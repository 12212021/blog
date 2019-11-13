### HTTP概述

#### HTTP是什么
* HTTP是用在计算机世界的一个协议，确定了计算机之间甲流通信的规范以及各种控制和错误处理处理方式
* HTTP是专门用于两点之间的数据传输
* HTTP传输的是文字、图片、音频、视频等超文本数据

#### HTTP相关协议

TCP/IP协议：属于传输层协议，是一个可靠的字节流协议，是各种应用协议的基础

DNS协议：IP地址用来标识计算机，但是IP地址比较难以记忆，DNS系统实现了域名（www.baidu.com）和IP地址的映射关系。

DNS域名的解析：根域名服务器（返回com、net、cn等顶级域名服务器的IP地址）；顶级域名服务器（返回域名下面的权威域名服务器，比方说baidu.com）;权威域名服务器（返回www.baidu.com的IP地址）。访问DNS服务器的过程会比较慢，所以用缓存能够有效地提高访问的效率。

URI/URL：（http://nginx.org/en/download.html）
![image.png](https://i.loli.net/2019/11/13/zVRHdUxhQm46ynA.png)

HTTPS:通过HTTP请求头确定两端交流的加密方式，HTTPS=HTTP+SSL/TLS+TCP/IP，SSL/TLS是建立在TCP/IP协议上面的一个加密传输协议

代理：在HTTP通讯的两个端点中间增加一些中间层，这个中间层就就叫做代理，代理可以实现下面的功能
* 负载均衡
* 内容缓存
* 安全防护
* 数据处理
  

### HTTP报文
HTTP报文的结构如下，**头部和实体之间的存在一个空行**
![image.png](https://i.loli.net/2019/11/13/pjQOUmwNeT6ZxlA.png)

请求报文的start line
![image.png](https://i.loli.net/2019/11/13/pjDGYcmdt6BgRnE.png)

应答报文的start line
![image.png](https://i.loli.net/2019/11/13/Noe9P2JfUELCIb3.png)

### HTTP常用Headers
* Host：请求，标识应该由哪一个主机进行处理
* User-Agent： 请求，由于历史原因，屁用没有
* Date：通常响应头中，标识HTTP报文创建的时间，客户端可以用这个字段搭配其它字段决定缓存的策略
* Server：响应头，告诉客户端当前正在提供Web服务的软件名称和版本号，但是并不是必须出现的
* Content-Length：响应头，标识响应报文中body的长度，没有这个字段的时候，body是不定长的，需要用chunked的方式分段传输。

### HTTP请求方法
* GET：从服务器获取资源
* HEAD：从服务器获取资源，但是服务器不会返回body数据，只会返回一个header“元数据”
* POST：新增加一个资源
* PUT：更新一个资源
* DELETE：删除一个资源
* OPTIONS：要求服务器列出来可以对资源进行的操作方法，在响应头allow字段返回，在跨域访问的时候发生作用

安全：不会对服务器的数据进行破坏，如GET、HEAD，像PUT、POST、DELETE都是不安全的

幂等：多次执行相同的操作，结果也是相同的，幂等的方法有GET、HEAD、PUT、DELETE。POST不是幂等的


### HTTP的响应状态码
- 1XX：提示信息，表示目前是协议处理的中间状态，还需要后续的操作，一般由浏览器底层完成
  - 101 Switching Protocol是：客户端使用了Upgrade字段，要求在HTTP协议的基础上改成其他的协议进行通信
- 2XX：成功，报文被接收且被成功处理
  - 200 OK：成功返回了报文
  - 204 No Content：与200类似，但是没有body数据
  - 206 Partial Content：HTTP分块下载或者断点续传的基础，伴随着Content-Range：bytes 0-99/2000 表示此次获取的数据是总计2000字节中的前100个字节
- 3XX：重定向，资源的位置发生了变动，需要客户端重新发送请求
  - 301 Moved Permanently：永久重定向，表示此次请求的资源已经不存在了
  - 302 Found：临时重定向，表示资源还存在，但是需要暂时用另外一个url来访问
  - 301 && 302状态响应码中包含了一个Location字段，标识了后续要跳转的URL
  - 304 Not Modified：和If-Modified-Since等条件请求字段可以用于缓存控制
- 4XX：客户端错误，发送的报文有误，服务器无法处理
  - 400 Bad Request：笼统地表示报文有误，没有具体的原因
  - 403 Forbidden：服务器禁止访问资源，一般是由于权限、法律等原因
  - 404 Not Found：资源在服务器上面没有找到
  - 405 Method Not Allowed：不允许使用某些方法操作资源，例如不允许 POST 只能 GET
  - 406 Not Acceptable：资源无法满足客户端请求的条件，例如请求中文但只有英文
  - 408 Request Timeout：请求超时，服务器等待了过长的时间
  - 409 Conflict：多个请求发生了冲突，可以理解为多线程并发时的竞态
  - 413 Request Entity Too Large：请求报文里的 body 太大
  - 414 Request-URI Too Long：请求行里的 URI 太大
  - 429 Too Many Requests：客户端发送了太多的请求，通常是由于服务器的限连策略
  - 431 Request Header Fields Too Large：请求头某个字段或总体太大
- 5XX：服务器内部的错误，服务器在处理请求的时候发生了内部错误
  - 500 Internal Server Error：笼统的服务器存在错误
  - 501 Not Implemented：客户端请求的功能或者资源暂时还不支持
  - 502 Bad Gateway：通常是服务器作为网关或者代理的时候返回的错误码，表示自己工作正常，但是访问真正的后端服务器的时候发生了错误，具体错误原因未知
  - 503 Service Unavailable：表示服务器现在比较忙，暂时无法响应请求


