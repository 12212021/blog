## Fetch
fetch api是xhr进化的结果，fetch和xhr最大的不同在于，xhr可以*选择同步*，但是fetch必须是*异步*，Fetch是暴露在全局的作用域的，
包括*执行线程*，*模块*，*工作线程*

### fetch例子
fetch与jquery的ajax有如下的不同点
- fetch不会基于http error status来reject请求，即便返回404，只会因为network failure或者其他内部reject
- fetch不会发送*同源*cookie，除非在init阶段指定

#### fetch options
```js
// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData("https://example.com/answer", { answer: 42 }).then((data) => {
  console.log(data); // JSON data parsed by `data.json()` call
});

```

#### fetch与cookie
```js
// 携带cookie
fetch("https://example.com", {
  credentials: "include",
});

// 同源策略下携带cookie
fetch("https://example.com", {
  credentials: "same-origin",
});

// 不携带cookie
fetch("https://example.com", {
  credentials: "omit",
});

// Access-Control-Allow-Origin头不能使用通配符，在 credentials: "include"的情况下
```

#### 上传json数据
```js
const data = { username: "example" };

fetch("https://example.com/profile", {
  method: "POST", // or 'PUT'
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

```

#### 上传文件
```js
const formData = new FormData();
const fileField = document.querySelector('input[type="file"]');

formData.append("username", "abc123");
formData.append("avatar", fileField.files[0]);

fetch("https://example.com/profile/avatar", {
  method: "PUT",
  body: formData,
})
  .then((response) => response.json())
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

```

#### 检查fetch是否成功
```js
fetch("flowers.jpg")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.blob();
  })
  .then((myBlob) => {
    myImage.src = URL.createObjectURL(myBlob);
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

```
#### 中断请求
```js
let abortController = new AbortController();
fetch('wikipedia.zip', { signal: abortController.signal })
  .catch(() => console.log('aborted!'));
// 10 毫秒后中断请求
setTimeout(() => abortController.abort(), 10);
// 已经中断
```

### fetch的基础结构
fetch中，有`Headers`,`Request`,`Response`三个接口

#### Headers
Headers允许用户通过方法去操作header，headers存在Guard，会影响`set`,`append`,`delete`方法

可以通过`Request.headers`,`Response.headers`，创建headers通过`new Headers()`

要点
- Headers.append()和Headers.set()区别
  - 如果header确实能接受多个值，set会overwrite，但是append会添加
- 所有Headers的方法会抛出TypeError，如果传递一个invalid HTTP Header Name
  - 如果header存在immutable guard，mutable headers也会触发TypeError
- iterate headers的时候，header会通过*lexicographical*顺序返回，同名key的value会被合并


#### Request

#### Response


### fetch进化点
- Service Worker也能使用，xhr只能在渲染进程中使用
- 同源请求可以自定义不带cookie，某些不需要cookie的场景下能省流量
- 可以自定义重定向场景，xhr只能follow
- 自定义cache mode，但是xhr只能借助response header
- 可以自定义referrer
