### xhr基础
xhr基础
- xhr的初始化通过`let xhr = new XMLHttpRequest()`完成
- 使用xhr，需要通过open、send两个函数完成
  - xhr.open('get', 'example.php', false)，false代表请求是同步发送
  - xhr.send(null), 没有参数的情况下，send必须传递null

xhr对象在收到服务器返回的结果之后，会填充如下结果
- responseText：作为响应体返回的文本
- responseXML：如果响应的内容类型是"text/xml"或"application/xml"，那就是包含响应数据的 XML DOM 文档。
- status：响应的 HTTP 状态
- statusText：响应的 HTTP 状态描述。


xhr对象的readyState属性能够表示当前的请求处于某一个阶段
1. 0：未初始化，尚未调用open方法
2. 1：已经打开（open），已经调用open但是没有调用send
3. 2：已发送，已经调用send，但是没有收到响应
4. 3：接受中，已经收到部分请求
5. 4：完成，已经收到所有的响应，可以是哟个了

通常意义下，要检查status属性值以确保响应成功返回，http状态码2xx一般代表成功，如果是304，代表资源从浏览器缓存中拿，也意味响应是有效的。

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          alert(xhr.responseText);
      } else {
          alert('request failed!' + xhr.status);
      }
    } else {
        // 在这里可以取消http的调用
        xhr.abort();
    }
}

// 设置http请求头
xhr.setRequestHeader('myHeader', 'myValue');
const myHeader = xhr.getResponseHeader('myHeader')
const allHeaders = xhr.getAllResponseHeaders();

// 发送get请求 get请求最常见的错误是字符串的格式不对
function addURLParam(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}
let url = "example.php";
url = addURLParam(url, 'name', 'nil');
url = addURLParam(url, 'book', 'nil');
xhr.open('get', url);


// 发送post请求
xhr.open("post", "postexample.php", true);
// form请求
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// json请求
xhr.setRequestHeader("Content-Type", "application/json");
let form = document.getElementById("user-info");
xhr.send(serialize(form));
```

#### encodeURIComponent与encodeURI
encodeURI方法不会对下列字符编码  ASCII字母  数字  ~!@#$&*()=:/,;?+'

encodeURIComponent方法不会对下列字符编码 ASCII字母  数字  ~!*()'

所以encodeURIComponent比encodeURI编码的范围更大。

比如`encodeURI("http://www.cnblogs.com/season-huang/some other thing");`

结果会变成`"http://www.cnblogs.com/season-huang/some%20other%20thing";`

如果通过encodeURIComponent来编码

结果会变成`"http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2Fsome%20other%20thing"`连 "/" 都被编码了，整个URL已经没法用了。




### XMLHttpRequest Level 2

#### form请求
针对form请求，xhr2序列化扩展，可以通过FormData来序列化Form
```js
const form = document.querySelector('#user-info');
xhr.send(new FormData(form))

// 自定义
const data = new FormData();
data.append("name", "Nicholas");
xhr.send(data)
```

#### 超时
设置1000超时，请求在1s内没有返回会触发超时，此时会触发ontimeout事件，但是readyState仍然会变成4，会调用onreadystatechange事件，在超时之后访问status会报错，需要做好防护
```js
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
    try {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        alert(xhr.responseText);
    } else {
        alert("Request was unsuccessful: " + xhr.status);
    }
    } catch (ex) {
        // 假设由 ontimeout 处理
        }
    }
};
xhr.open("get", "timeout.php", true);
xhr.timeout = 1000; // 设置 1 秒超时
xhr.ontimeout = function() {
    alert("Request did not return in a second.");
};
xhr.send(null);
```

#### overrideMimeType
响应返回的 MIME 类型决定了 XHR 对象如何处理响应，比方说是挂在responseText上还是responseXML上，服务器端可以设置不对，client端可以覆盖，但是必须在*调用send之前调用overrideMimeType*
```js
let xhr = new XMLHttpRequest();
xhr.open("get", "text.php", true);
xhr.overrideMimeType("text/xml");
xhr.send(null);
```

### 进度事件
与进度相关的事件主要有6个，触发顺序为：先触发loadstart，之后是*一个或者多个*progress事件，紧接着是error、abort、load中的一个，最后是loadend事件
- loadstart：在接收到响应的第一个字节时触发。
- progress：在接收响应期间反复触发。
- error：在请求出错时触发。
- abort：在调用 abort()终止连接时触发。
- load：在成功接收完响应时触发。
- loadend：在通信完成时，且在 error、abort 或 load 之后触发


progress使用示例,为了保证正确执行，必须在调用 open()之前添加 onprogress 事件处理程序。
假设响应有 Content-Length 头部，就可以利用这些信息计算出已经收到响应的百分比。
```js
let xhr = new XMLHttpRequest();
xhr.onload = function(event) {
    if ((xhr.status >= 200 && xhr.status < 300) ||
    xhr.status == 304) {
    alert(xhr.responseText);
    } else {
    alert("Request was unsuccessful: " + xhr.status);
    }
};
xhr.onprogress = function(event) {
let divStatus = document.getElementById("status");
if (event.lengthComputable) {
divStatus.innerHTML = "Received " + event.position + " of " +
event.totalSize +
" bytes";
}
};
xhr.open("get", "altevents.php", true);
xhr.send(null);
```


### Beacon API
发送post请求，可选数据有效负荷参数有`ArrayBufferView、Blob、DOMString、FormData`实例，如果请求成功进入了最终要发送的任务队列，该方法返回true，否则false
```js
// 发送 POST 请求
// URL: 'https://example.com/analytics-reporting-url'
// 请求负载：'{foo: "bar"}'
navigator.sendBeacon('https://example.com/analytics-reporting-url', '{foo: "bar"}');
```

该方法看起来像是post的语法糖，但是有几个重要的特性
- sendBeacon()并不是只能在页面生命周期末尾使用，而是任何时候都可以使用。
- 调用 sendBeacon()后，浏览器会把请求添加到一个内部的请求队列。浏览器会主动地发送队列中的请求。
- 浏览器保证在原始页面已经关闭的情况下也会发送请求。
- 状态码、超时和其他网络原因造成的失败完全是不透明的，不能通过编程方式处理。
- 信标（beacon）请求会携带调用 sendBeacon()时所有相关的 cookie。
