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

#### 常见一般的headers
- Host：请求，标识应该由哪一个主机进行处理
- User-Agent： 请求，由于历史原因，屁用没有
- Date：通常响应头中，标识HTTP报文创建的时间，客户端可以用这个字段搭配其它字段决定缓存的策略
- Server：响应头，告诉客户端当前正在提供Web服务的软件名称和版本号，但是并不是必须出现的
- Content-Length：响应头，标识响应报文中body的长度，没有这个字段的时候，body是不定长的，需要用chunked的方式分段传输。
  
#### 客户端、服务器端MIME TYPE标识数据类型
- Accept：请求头，Accept: text/html,application/xml,image/webp,image/png告诉服务端客户端能够看懂html、xml、webp、png类型的数据
- Content-Type：响应头，告诉客户端服务器发送过来的数据是什么类型的
- Accept-Encoding：请求头，告诉服务器自己支持的数据压缩格式（可以省略，省略代表客户端不支持压缩数据的格式）
- Content-Encoding：响应头，告诉客户端服务器传输的数据压缩格式（可以省略，省略代表数据没有进行过压缩）

#### 传输大文件、音视频采用的方法
Accept-Encoding：告诉服务端自己能够识别的压缩算法，gzip对text/html的文件能够有比较好的压缩率，但是对于图片、音视频不行

分块传输：Transfer-Encoding：chunked 表示body的报文是分块传出，它和Content-Length字段是互斥的，分块传输的数据格式如下图所示

**浏览器在接收到分块的数据之后会自动将分块的数据合并在一起进行展示**
![image.png](https://i.loli.net/2019/11/15/nRebklPSc8MsTum.png)

范围传输：适用于视频的拖放，分拣的断点传输等。

1、一般客户端需要先用OPTION方法询问服务端是否支持范围传输

2、客户端： Range：byte=x-y 表示请求哪个范围的数据；服务器：Content—Range：bytes x-y/length


#### HTTP长连接、短连接
HTTP最早的版本采用短连接的方式传输数据，每发送一个HTTP请求，会新建立一个TCP连接，在HTTP 1.1之后，请求默认采用长连接的方式，不同的HTTP请求会复用tcp链路（tcp三次握手和四次挥手开销大）
相关的headers有下面这些：
- Connection：keep-alive 请求头，客户端明确表示需要使用长连接
- Connection：close 请求头，客户端明确告诉服务端在这次请求之后关闭这个tcp链路
- Connection：keep-alive 响应头，服务器端明确告诉客户端自身是支持长连接的，告诉客户端接下来的请求都复用这个tcp连接
服务端一般也能有配置长连接，以Nginx为例
- keepalive_timeout 60：60秒后关闭这个长连接
- keepalive_requests 1000：当Nginx在这个tcp链接上面处理了1000个请求之后关闭它

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
  - 301 && 302状态响应码中包含了一个Location字段，标识了后续要跳转的URL；Refresh字段能够实现延时的重定向
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


### HTTP之Cookie
HTTP是无状态的协议，服务端对客户端的身份一无所知，所以服务器无法为客户端提供“个性化”的服务，HTTP采用Cookie来标识客户端的身份。

客户端首次访问服务器的时候，服务器是不知道客户端的身份的，所以会为客户端进行身份标识，*采用的字段是"Set-Cookie: key=value"*，服务端能够设置多个Set-Cookie字段，
浏览器在后面的访问中会加上服务端设置的Cookie字段，*用分号进行分隔*

Cookie的有效期：
- Expires 表示在某个绝对的时间点Cookie过期，
- Max-Age表示相对的时间点，在客户端接收到这个Cookie之后，时间经过Max-Age之后，Cookie过期，
- 如果两个字段都存在，以Max-Age优先，
- 如果Cookie的字段中没有过期相关字段，表示再浏览器打开这个页面的时候Cookie有效，过了这个时间Cookie无效

Cookie相关字段：
- Domain：Cookie所属的域
- Path：Cookie的路径，一般服务器端给的都是根路径
- HttpOnly：Cookie只能够通过浏览器的HTTP协议进行传输，浏览器的JS引擎禁止JS访问document.cookie相关的API
- Secure：表示Cookie只能采用HTTPS协议加密传出，但是Cookie本身不是加密的


### HTTP的缓存

响应头关于缓存的headers
- Cache-Control：max-age=30  表示从报文离开服务器的时间算起，30秒后报文过期，包括了在链路传输过程中在所有节点停留的时间
- Cache-Control：no-store 不允许缓存，用于一些变化非常频繁的数据
- Cache-Control：no-cache 可以缓存，但是在使用之前必须去服务器验证数据是否过期
- Cache-Control：must-revalidate 如果缓存不过期就继续使用，如果缓存过期之后还想使用该缓存就必须向服务器进行验证


客户端关于缓存的headers：
- Cache-Control：max-age=0
- Cache-Control：no-cache
- 上面两个请求头是一样的，都是告诉浏览器要向服务器请求最新的数据，看服务器如何理解这个字段


HTTP的条件请求：常用的条件请求头有如下字段
- 'If-Modified-Since'-'Last-Modified':需要浏览器先返回Last-Modified子弹
- 'If-None-Match'-'Etag'：需要浏览器先返回Etag字段

浏览器在*第二次访问*的时候会带上上一次返回的Last-Modified或者Etag字段来验证资源是否发生变化，如果没有没法变化，服务端返回304，浏览器就可以更新一下有效期，然后放心大胆地使用缓存。

整个HTTP缓存请求的方式为：服务器端的Cache-Control用来控制客户端缓存的策略。
- Cache-Control：no-store：不需要设置max-age、Last-Modified、Etag等字段，浏览器每次都会请求最新的数据
- Cache-Control：no-cache：允许浏览器缓存，但是每次在使用数据的时候都要向服务器进行数据验证，需要搭配Last-Modified、Etag等字段进行条件请求
- Cache-Control：must-revalidate：允许浏览器缓存，搭配max-age字段，在缓存期内，浏览器直接使用缓存，过了缓存期，浏览器发起条件请求，更新缓存时间


### HTTP之安全
HTTP协议是明文传输，一些涉及购物、金融、政府办公的场景下，明文传输基本上不可行，在这种情景下，HTTPS应运而生。HTTPS是HTTP基于SSL/TLS之上的传输协议（OpenSSL是著名的开源密码学工具包，是SSL/TLS的具体实现）。其示意图如下图所示：
![image.png](https://i.loli.net/2019/11/21/PXBtMe8xjZQdERp.png)

#### HTTPS安全性的体现
- 机密性：数据是密文，黑客无法获取具体内容
- 完整性：确保数据在传输过程中被没有被加字节、调换位置等
- 身份验证：确认双方的身份，通信的双方要证明自己的身份
- 不可否认：已经发生的“行为”，不能抵赖

这四个特性确保了数据在传输的过程中的安全，HTTPS保证这四个特性的方法为：
- 机密性：对称加密和非对称加密
- 完整性：通过数据的摘要算法来确保数据完整不背篡改
- 身份验证和不可否认性：通过数字签名的方式验证

#### 对称加密
通信的双方商定一个密钥（一般是一个固定bit的数字），明文在传输之前在客户端通过密钥进行加密，服务端在收到密文之后，通过商量好的密钥进行解密。对称加密需要对称算法，对称算法有一个”分组模式“的概念，表示可以用固定长度的密钥来加密任何长度的明文。

缺点：两端的通信的时候需要交换或者商定一下密钥，在没有加密措施的情况下如何交换密钥是没法解决的

优点：对称加密对计算力的要求比较简单。

实现：AES。ASE128-GCM：表示采用密钥长度为128bit的ASE算法，该加密算法使用的分组模式为GCM。

#### 非对称加密
密钥分为了公钥和私钥（一对），私钥只能自己或者相关的网站拥有，不外泄。公钥则可以任意进行分发，是公开的。
对于非对称加密而言，存在这样的一个过程：

*客户端和服务端生成一对公私钥，设为AaBb，客户端和服务端先通过HTTP等方式互换公钥AB，客户端通过B加密明文，服务通过收到密文后通过b解密，向客户端发送数据时，通过A加密明文，客户端在收到数据之后通过a进行解密*

缺点：非对称加密的算法设计比较复杂，同时对计算性能要求很高

优点：非对称加密能够很好的解决对称加密中“会话密钥”交换的问题

实现：RSA、ECC等

#### 混合加密
客户端和服务端之间先通过非对称加密的方式交互“会话密钥”，之后的数据交通通过该“会话密钥”来进行对称加密。

#### 摘要算法
如何确定数据在传输过程中没有被篡改呢？一般情况下采用摘要算法来实现，摘要算法是一种Hash Function，能够将长数据压缩为一段短数据，给定一段长数据，采用相同的哈希算法，总是能够生成一样的短数据，通过这种方式能够验证数据是否被篡改了（当然，摘要算法应该建立的在机密性的基础上，否则，黑客获取到明文之后，篡改明文，采用相同的摘要算法，能够欺骗双端的验证）。常见的算法有SHA-2。

#### 数字签名
由于非对称加密的私钥能够在网络中代表身份，所以数字签名可以用私钥来实现。对摘要算法生成的“摘要”通过私钥进行加密，客户端在收到信息之后，只能用配对的公钥进行解密，这样客户端确保该数据是由私钥的持有者发送的，具有不可抵赖性。任何人都可以发布公钥，如何确保公钥的可信度？这时候就涉及到CA证书，浏览器和操作系统能够验证网站发送的CA证书是不是真的，从而确保公钥的可信度。

#### CA证书
公钥是随意分发的，所以为了确保公钥分发者的身份，需要用CA认证机构来确定公钥的身份，CA证书就像真实世界的警察局一样，具有非常高的可信度。