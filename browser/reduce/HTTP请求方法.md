### POST请求
post请求头分类
1. application/x-www-form-urlencoded
   - key-value对，通过&分隔，通过=连接key，value。
   - Non-alphanumeric characters都是通过URL encoded
   - 通过`URLSearchParams`能比较轻松地操作search相关
2. multipart/form-data
   - 每个value都被当做block of data被发送，通过user agent-defined分隔符（“boundary”）来分隔
   - 每个vue的key通过Content-Disposition给出
3. text/plain

post请求还能过xhr来发送，当通过xhr来发送的时候，可以自定义`Content-Type: application/json`，这方面要多注意axios、fetch等api的接口


#### GET、POST请求区别
- get、post在浏览器点击回退都会请求，但是get请求一般是无害的
- get请求的url地址可以被收藏，但是post不可以
- get请求会被浏览器缓存，而post不会，除非被手动设置
- get请求的参数会被完整的保存在浏览器的历史记录里面，post不会
- get、post请求长度http协议并没有限制，get请求的的url长度可能会被浏览器或者服务器端截断，post不会
- get请求参数直接放在url里面，不适合敏感参数的传递，post请求放在Request Body里面
