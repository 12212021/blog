#### 浏览器缓存

缓存的目的是为了更快访问，可以显著提高网站的性能，减少网络访问的流量。

##### Cache-Control HTTP请求头
缓存主要通过HTTP头Cache-Control请求头来控制

Cache-Control HTTP response Header如下
- no-store 没有缓存
- no-cache 缓存，但是每次需要向服务器来验证资源是否可用
- public、private public代表文件能够被中间代理缓存；private代表文件只能够被浏览器端缓存
- must-revalidate 当浏览器使用一个“不新鲜”的资源时，需要先行验证
- max-age 代表浏览器能够被缓存的（保持新鲜）的最大时间

##### 资源的新鲜度
如何计算资源的新鲜度

expirationTime = responseTime + freshnessLifetime - currentAge
- currentAge  当前时间节点
- responseTime  浏览器接收此响应的时间节点
- freshnessLifetime **依次**根据以下计算
  1. max-age: 768772， 秒
  2. Expires: Wed, 21 Oct 2015 07:28:00 GMT， 转化为秒时间戳，Expires - Data， Data为http请求头值，下同
  3. Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT， (Date-Last-Modified)/ 10 （rfc2626规定）

http请求过程如下图
![image.png](../assets/浏览器缓存.png)


##### 验证缓存相关HTTP请求头
客户端携带服务端下发的资源“指纹”信息来核对资源是否需要重新拉取，经服务端判断后，若返回304，客户端更新“新鲜度”，复用本地缓存文件；
若资源已经更新，返回200，则启用http返回内容

相关http请求头，存在优先级
1. ETag、If-None-Match，客户端设置If-None-Match为资源返回Etag值
2. Last-Modified、If-Modified-Since 客户端设置If-Modified-Since为资源返回的Last-Modified值


##### 资源缓存revving技术

对**更新程度比较弱**的文件，比如说js、css文件，设置非常大的缓存时间，需要满足一下条件
- js、css文件依据内容在文件名上生成hash名称
- html引用带hash的文件，webpack可以比较方便地实现

对于**频繁更新的**html文件，可以不设置缓存或者利用304协商缓存的方式来节约带宽

上线过程的核心在于**非覆盖式**更新
1. 先上线js、css等静态文件，由于携带content hash码，不会覆盖原先存在的文件
2. 上线模板文件html，完成项目的整体更新
