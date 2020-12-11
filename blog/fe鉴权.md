### HTTP无状态

http是无状态的，一些场景下，我们应该维护一个登陆状态，典型应用场景：一个用户登陆微博，发布，关注，评论等操作都应该是在登陆的状态下进行的。

解决登陆状态方式的办法是**标记**，类似于工卡，流程如下

1. 后端在用户登陆了之后会给用户下发一个标记tag
2. 前端存储这个标记tag
3. 向后端请求的时候带上这个标记tag

前端存储的方式

- 挂载到全局变量，刷新之后登陆状态就消失了（体验卡）
- 存储到cookie、localStorage、sessionStorage等，无论怎样刷新，只要浏览器没有清除或tag过期，就一直拿着这个状态

### 基石Cookie

cookie借助浏览器能力，HTTP头，cookie能够做到前端无感知的存储，流程如下：

1. 后端通过HTTP返回头的Set-Cookie字段将tag存放到浏览器
2. 浏览器在发送请求的时候会自动将cookie通过HTTP请求头的Cookie字段带给后端

后端通过cookie特定字段来限制cookie的使用场景

- 空间限制
  - Domain，域名限制
  - Path访问路径的限制
- 时间限制
  - Expires：达到一定的时间后，浏览器不再存储该cookie，依赖于本地系统时间，渐渐不再使用
  - Max-Age：从现在开始Cookie存在的秒数，60 * 60 * 24 * 365代表存储一年
- 使用方式限制
  - Secure：浏览器只有在https下，才能够将cookie发送给服务器
  - HttpOnly：cookie无法通过js脚本拿到

### Session方案

##### session方案的访问流程如下

![image.png](https://i.loli.net/2020/12/11/DGoS7kbeiYXKHNW.png)

##### session的存储方式

- Redis
- 内存，重启服务session就不存在了
- 数据库，普通数据库，性能不高

##### session分布式问题

服务器集群，用户请求会经过负载均衡，不一定打到哪一台服务器上，一旦用户后续请求和登陆请求访问的机器不一致，或者登陆机器宕机，session就失效了，解决方式有如下两种

- 从**存储**角度出发，把session集中存储，使用redis或者数据库可以把session存储到一个库里面
- 从**分布**角度出发，让相同ip的请求在负载均衡的时候打到同一台机器上，以nginx为例，可以通过ip_hash实现
  - 这种方法相当于阉割了负载均衡功能
  - 仍然没有解决*用户请求的机器宕机的问题*

### Token方案

##### token方案流程如下

![image.png](https://i.loli.net/2020/12/11/lD83tun6xrsaqRf.png)

##### token基本原理

token存储了有效期、使用限制等，通过base64编码传输给客户端，但是token是可以被篡改的（尽管可以通过HttpOnly来防止js修改，但是可以将token拷贝出来，修改后用python脚本发送请求），为了防止敏感信息被修改，可以token增加签名，防止修改，如下图所示

![image.png](https://i.loli.net/2020/12/11/EtGewSdcAWUOl5P.png)

该做法增加了cookie的数量，同时也没有规范，基于**这种思想**，JWT横空出世，JWT是一种成熟的字符串生成技术，包含了数据、签名。生成方式如下

![image.png](https://i.loli.net/2020/12/11/Y2ZwQ9fXhK6I3Cc.png)

##### refrsh Token

token是用来鉴权的，称为access token，越是权限敏感的业务，access token的有效时间需要越短，避免被盗用，但是过短的有效时间需要用户频繁登陆，不友好。针对这种场景，我们再生成一个token，专用用于生成access token，我们称为refresh token。refresh token的有效时间可以长一点，当refresh token也过期的情况下，用户需要重新登陆，基本的流程如下

![image.png](https://i.loli.net/2020/12/11/qbCJpjHNzUn5F1x.png)



### 总结

- HTTP是无状态的，为了维持请求，需要前端存储标记tag
- cookie是大多数状态管理方案的基石
- session方案：前端存储id，后端存储数据，后端需要处理分布式的问题（消耗空间来提升速度）
- token方案：前端存储数据，后端通过加密算法来解析数据（消耗时间，减少空间存储），灵活性比较高
- 复杂系统过可以通过refresh token、access token分权来满足安全性和用户体验

原文地址：https://juejin.cn/post/6898630134530752520#heading-4