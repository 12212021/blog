### 工作简略记录
1、修复了项目路径大小写的问题（case sensitive），因为macOS、windows不区分大小写，但是linux严格区分

2、facebook搜索、linkedin搜索页面有轮训页面直到后端返回某个值之后，不再轮训，这块用settimeout来做的，有问题
- clearTimeoutId，但是此时可能timeout已经执行了，但是内部的ajax promise还在pending，此时会发生无法取消的情况（非常小的timing，但是存在）
- 如何去retry，上述场景，实际有条件的repeat（依据后端返回的result去repeat请求）

3、地址簿批量选择，单独另外一个ts文件，批量操作，其中涉及到集合的交、并、补等

4、oxpecker SDK设计
- 首登字段的的缓存设计
- 关闭tab页面发送请求
- 定时缓存策略和

5、oxpecker中数据看板功能完成，主要有目录树组件（数结构）、看板之间的拖拽、模块之间的联动。主要难点是
- 目录树结构，递归去实现
- 看板拖拽需要有动画，用vue，display: grid 或者 flex，配合transition-group，拖拽的视觉效果（）

6、oxpecker埋点sdk的一些坑
批量发送埋点，批量发送埋点需要注意几点
- 一定要提供flush机制给业务方，以供业务方手动flush
- 单页、多页、混合页面一定会存在卸载页面的时候还没有发送缓存
- 基于pagehide事件积极地去发送埋点
- 基于visibilitychange事件去做，对浏览器的版本有要求
- fetch api中可以配置keepalive来确保ajax请求发送
- 像直接kill掉浏览器的行为（可能包括浏览器的退出），这个时候就会丢失
埋点的缓存机制
- 给予特定的时间，用settimeout去埋点
- 基于数据的量，达到一定的量flush，若存在settimeout task则取消

埋点tips
- 不要假设用户的协议，可以采用://的方式来发送请求，让浏览器自动添加协议，https发送http协议会被浏览器屏蔽

埋点skd的一些常见对外暴露的接口
- 配置服务器的落库url
- 配置一些埋点需要的关键性信息，如appkey或者业务标识
- 配置埋点sdk的行为，比如说是否自动pv等等
- 配置一些公共参数，这样业务埋点的时候不需要每次都手动传递


埋点sdk常见的一些功能点
- 自动pv
- 针对多页应用，在sdk loaded的时候可以认为是pv
- 针对单页应用，通过监听路由变化window.addEventListener('popstate', e => {})
- 更精细化的pv，可以依赖IntersectionObserver api来实现
- 某些功能点的点击
- 可以在document下捕获click事件，让后上报，需要注意，click事件的触发比较频繁，需要注意服务器的压力，更加友好化的功能：SDK的报错，在特定的一些函数call下，console log一些错误日志能够帮助用户更好地使用sdk


sdk发送埋点的api： img -> ajax -> sendBeacon api
优点
- 由浏览器发送，更加稳定
- 页面tab被关闭的时候能发送，不容易丢点

缺点
- 发送的数据有限，最多64KB（chrome上）
- 发送的时候有一个类似于QPS的概念，一段时间内不能push太多的数据到sendBeacon
防止丢数据的策略：
- 数据一次性push到sendBeacon，如果返回值为false，则对队列中的数据依次
- 数据一次性push，如果false，采用二分法进行数据的推送

sdk的问题排查思路
1. 最开始的时候上线了fetch请求的时，fatch总是会报错『fail to fetch』，经查阅，属于客户端报错，最可能的错误是跨域，但是服务端经过排查，跨域无问题，怀疑是fetch的兼容问题
2. 替换为xhr发送请求，但是还是会报错xhr请求错误，返回的错误日志里面，status是0，fetch和xhr应该是一种错误，怀疑是页面卸载的时候，ajax请求被浏览器取消了
3. 为了保留app卸载的时候，未发送的埋点，采用sendBeacon的方式进行发送，该api可以同步返回true、false代表埋点数据是否发送到了network队列
4. 业务上有亿左右数据量，怀疑是缓存的数据过多，sendBeacon无法发送数据（sendBeacon有64KB的数据限制），增加打点日志后发现果然是这样
5. 增加了localstorage的本地缓存，有5MB的限制，报错的日志显示，有些用户回缓存大量的数据，部分用户的数据量达到了30MB，且存在单个对象达到1M的情况（开发的性能埋点直接把报错的stack大对象塞到埋点日志里面）
6. 怀疑是app内某些报错的日志执行的逻辑错误，疯狂轮训打点。再sendBeacon失败的情况下加了qps过滤算法（同一个eventId，超过15个点，认为异常，丢弃），同时过大的埋点数据直接丢弃（单个埋点的属性大于8KB）
7. 经过qps的限制和过大数据对象的丢弃，基本上不会出现缓存无法写入的情况
8. 针对低版本的浏览器做兼容，探测是否存在sendBeacon方法，如果不存在，则回退到xhr的方式进行发送
9. 针对ie8、ie9下，xhr无法跨域的问题，有两个解决方式，一是nginx来配置转发；二是回退到img和script的请求方式（无法获取到返回）

为了快速上线测试，不打扰业务方，sdk由最初的业务方引入js源码，改成线上cdn的方式来进行，方便快速上线观测，验证埋点数据。
sdk最后定位到的问题
- 业务方的接入文件有缓存，加hash刷新可解决

7、升级项目（vue2的升级）
- pnpm的解析算法和安装速度均比较优秀，可以切换
- 要有耐心去看日志，多搜索，其实是一个气力和耐心活
- 利用vue-cli的命令行，vue migrate、vue upgrade来升级vue相关的npm包
- webpack5中node内置的一些模块都没有办法使用（vue文件中），如path、net等，可以安装相关polyfill
- webpack5中import css对象为空，可以将css文件名改为xxx.module.scss等，webpack5的解析有一些问题

8、 替换summernote到wangEditor，summernote需要全局用到jquery和bootstrap，这两个会影响全局的一些样式
- class是label的css会被bootstrap修改
- 全局的样式带来的污染太严重了

9 在vue项目中引入了rxjs，并且采用angular services的方式来进行开发体验
好处
- rxjs在处理异步流的时候，操作符非常好用
- 代码看起来干净的多，逻辑也自洽
- 边界条件考虑的少了很多，处理http的竟态也非常好用

不好的地方
- rxjs如果采用subject进行信号的分发，要时刻注意在页面卸载的时候要进行unsubscribe，不然内存泄露（这里vue可以用hook或者mixin的方式去做）
- subscribe对代码的侵入性非常强，无法避免视图代码里不受异步流影响
- vue、angular、react均是基于state来渲染view，和rxjs的理念不是很符合
- 有一些后端的接口，需要全局的一些状态，每个接口都需要，比如说appcode等，这个appcode可以随着用户改变而改变，这个就是需要状态的一些例子，可以用replaySubject去内部缓存状态

10 angular框架的service、view拆分还是比较符合分层的思想，写起来也比较能拆分复杂度。目前是基于vue框架进行开发，集合vue3的hooks composition api的能力，将业务的逻辑和view拆分开来
- 业务的逻辑用hooks包装，useLogic
- view只保留和视图相关的逻辑（可以去修改一些useLogic视图相关的state）
- hooks在封装逻辑方面类似于易用的类对象，但是有view框架的支持，内核是一个闭包函数。
