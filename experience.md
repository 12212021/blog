主要记录一下工作中遇到的问题和思考

### 未分类

#### bash脚本windows和unix的差异
在windows下写的bash脚本再unix下可能无法使用，因为不同操作系统的编码格式不一样。常见的区别主要集中在换行
- Unix和类Unix（如Linux）：换行符采用 \n
- Windows和MS-DOS：换行符采用 \r\n
- Mac OS X之前的系统：换行符采用 \r
- Mac OS X：换行符采用 \n

将windows下的bash脚本放到unix下执行，通常会报错`: not found 2: `,其中2代表符号


这种情况下，可以通过vim的命令去将windows下的编码格式转化为unix风格。

- `set ff=unix` 将编码格式转化为unix
- `set ff`查询当前文件的编码格式


#### http请求竟态
在一些频繁触发http请求的页面上，如切换select选项触发请求、input输入文字触发请求
在这些场景下，需要考虑如下问题
- 接口的节流和防抖相关问题
- http请求竟态问题，这里用rxjs经验来看，区分为
  - switchMap总是获取最新
  - exhaustMap当前的请求不完成则忽略后续的请求

#### table相关
做table搜索页面的时候，有一些场景也要充分考虑
- 搜索结果为空，是不是要有自定义的页面空
- table展示组件可操作，操作完了如何反应到table的列表展示上（这里有一个状态同步的问题，具体问题具体分析）
- table组件需要给rowKey，不然多选没有办法正常工作且多选组件，同时key也是提升性能的一个关键变量
- table组件的page需要从1开始，如果从0开始，尽管已经拉取到dataSource的数据，但是table仍然会展示无数据


#### Popover、Tooltip
- 有一个getPopupContainer函数，参数是当前当前node节点，默认是渲染到body节点上的
  - 如果渲染到当前node的parentNode，那么滚动页面，popover会跟随滚动，但是受限于父节点的空间，再方位展示上可能存在一点问题
  - 如果默认body节点，有可能页面滚动，popover不跟随的情况



### Form表单

以angular的两种表单为例
#### reactive Form
angular将表单组件抽象成了三种类型，

1、formControl instance代表视图上的一个组件；

2、FormGroup instance代表聚合一群formControl的一个表单（最常用）

3、FormArray instance主要是用来创建动态表单

4、通过angular特殊指令，可以将上面的instance和view视图特定的组件关联起来

reactive form的数据流如下所示：

1、从view到model
- 用户type一个字符到input等组件，该组件emit一个“input”事件
- control value accessor监听该事件，将最新的值传递给control instance
- FormControl 通过valueChanges observable emits最新的value
- 所有订阅该observeble的订阅者都能够收到这个值

![image.png](https://i.loli.net/2020/09/04/KQNmJldxzM1ohRA.png)

2、从model到view
- 代码调用favoriteColorControl.setValue()来更新control的值
- FormControl 通过valueChanges observable emits最新的value
- 所有订阅该observeble的订阅者都能够收到这个值
- control value accessor更新view视图上的值

![image.png](https://i.loli.net/2020/09/04/9eVgyRD4oMrTfYp.png)


thinking：reactive form显示地创建了表单组件，并将表单组件和view视图的一些输入性控件结合起来；其数据model在一开始就是明确的，angular更新的时候采用的生成新的数据对象的方式，所以数据也是不可变；reactive form数据和视图之间的更新采用同步的方式进行更新，更利于我们去查找bug

#### template-driven Form
template-driven的表单与Vue、React构建表单是比较一致的。视图和变量之间通过ngmodel指令来关联，数据流如下所示

1、view到model
- 用户在input中输入blue，input输入框emit一个“input”事件
- 与input组件关联的control value accessor trigger FormControl实例的setValue()方法
- FormControl instance通过valueChanges observable来emit最新的value
- 所有订阅该observeble的订阅者都能够收到这个值
- control value accessor调用NgModel.viewToModelUpdate()来emit ngModelChange事件
- 由于双向绑定的机制，ngModel绑定的值变为blue

整个流程，示例图如下所示
![image.png](https://i.loli.net/2020/09/04/7ErcJFay1tnoXq6.png)

2、model到view
- 代码更改了ngModel的值
- 变更检测开始，input值发生变化
- 在变更检测期间，由于input值发生变化，ngOnChanges会被调用
- ngOnChanges()将设置内部FormControl实例的值的任务推入到一个待执行异步队列
- 变更检测结束
- nexttick，FormControl的值被更新
- FormControl instance通过valueChanges observable来emit最新的value
- 所有订阅该observeble的订阅者都能够收到这个值
- control value accessor更新view视图上的值

整个流程，示例图如下所示
![image.png](https://i.loli.net/2020/09/04/G1RYOASzUkNHWeb.png)


#### Form Validate
表单验证主要是规则和css视觉提示两个部分，这部分用Vue来讲，但是结合和angular的一些设计
- 在创建FormControl表单的时候，angular支持传入validator function来验证表单是否有效
- angular将表单组件区分成了下面几类，每一类对应着特殊的css样式来提示用户
  - .ng-valid
  - .ng-invalid
  - .ng-pending
  - .ng-pristine
  - .ng-dirty
  - .ng-untouched
  - .ng-touched
- Element UI中用transition组件包裹了一个absolute的标签用于提示用户验证失败信息（其父组件为relative）
- validator的触发方式一般为blur和change事件


### 导航栏随页面滚动而滚动
这个问题会被拆分成三个子问题。

1、点击导航栏，页面的位置发生变化
- 通过dom的scrollIntoView方法将dom移动到视口
- 通过window.location.href锚点的方式来滚动页面
- 借助smoothScroll等库来丝滑滚动，下面是Vue2官网的例子
```js
new SmoothScroll('a[href*="#"]',{
    speed: 400,
    speedAsDuration: true,
    offset: function(anchor, toggle) {
        let dataTypeAttr = anchor.attributes['data-type']
        if (dataTypeAttr && dataTypeAttr.nodeValue === 'theme-product-title') {
            return 300
        }
        return 0
    }
})
```

2、刷新页面的时候保存原来页面的位置和导航栏状态
- 调用window.addEventListener方法来注册'beforeunload'事件，将页面的scrollTop，activeTab信息保存下来
  - 'beforeunload'事件只能在window对象上注册，不能在document上注册
  - 该事件一般是不需要remove的，**刷新页面会消除内存泄露的影响**
  - Vue在刷新页面的时候是不会调用beforeDestroy、destroyed这两hooks
  - 用sessionStorage来保存数据，sessionStorage在浏览器或者tab关闭的时候会自动清空信息
- 在mounted钩子函数中init页面的状态

3、滚动页面的时候，导航栏随着页面位置变化而变化
参考Vue2官网的例子
```js
window.addEventListener('scroll', updateSidebar)
function updateSidebar() {
    var doc = document.documentElement

    // An element's scrollTop value is a measurement of the distance from the element's top to its topmost visible content.
    var top = doc && doc.scrollTop || document.body.scrollTop
    if (animating || !allHeaders)
        return
    var last
    // allHeaders是一个数组，内部存储页面的定义的所有的header
    for (var i = 0; i < allHeaders.length; i++) {
        var link = allHeaders[i]

        // The HTMLElement.offsetTop read-only property returns the distance of the current element relative to the top of the offsetParent node.
        if (link.offsetTop > top) {
            if (!last)
                last = link
            break
        } else {
            last = link
        }
    }
    if (last)
        setActive(last.id, !hoveredOverSidebar)
}
```

在这个例子中，allHeaders中所有的dom的offsetTop都是相对document而言的，scrollTop代表视口内最上面的内容距离document；遍历所有的headers，当遇到第一个dom的offsetTop大于scrollTop的时候，页面默认聚焦到了该Tab

局限性：当页面最底部的部分较短的时候，无论如何导航都无法聚焦到最后一个tab

#### 页面load前http获取全局状态
设定`code`,`key`两个全局状态需要异步加载,其中code变化带动key变化，且后续的http请求均需要携携带这两个参数。

带来的问题
- 路由页面的加载（本地）一定是比异步快的，页面load后发送的请求参数均不对
- 如果采用watch的方式去做，状态之间的逻辑复杂度加剧，流程更加不容易控制

解决的方式（vue为例）
- 在app.vue中去发起异步请求，状态就绪后，再展示路由插槽
- 在router的Navigate Guards中拦截路由，发送异步请求，就绪后再resole路由

这两个方式均可以解决这个问题，但是如果接口比较漫长，那么带来的就是首屏渲染速度低，另外就是页面正常加载，由于获取不到code、key两个值，这个时候ajax请求可以一直loading，等待值resolve，两种方式
- pull，通过一个小时间片100ms，不断去轮询值是否就绪
- push，观测值，等到值自动resolve（rxjs、eventEmitter）的方式



### vue
#### key妙用
vue中最常用key的场景就是v-for，但是vue会尽可能的复用已经存在的组件，如下场景
```vue
<div>
    <child-comp v-if="someCond"></child-comp>
    <child-comp v-else="someCond"></child-comp>
</div>
```
由于vue复用组件，这种情况下没有重新渲染child-comp，添加key可以有效解决该问题


### react
#### react re-render
react框架re-render的核心概念`当state发生变化的时候，重新渲染组件以及其子组件`

针对react的re-render，有一些misconception，主要有
- state发生变化的时候，re-render整个app（并不是，ui树结构顶层算起，哪个comp发生变化，重新渲染它以及子组件）
- comp只有在props发生变化的时候才re-render（根据core concept，即便props不发生变化，也重新渲染）

关于React.memo，将组件缓存起来，这些react不会每次都渲染组件，除非
- props发生变化
- 明确地使用了useContext hooks，context发生了变化（context可以看做隐式props）
- 备注：React.memo需要对比props才能决定是不是发生了变化，也是存在代价的
  - 组件props非常多，但是没有子组件，这时候直接渲染可能性能表现更好
  - 组件发生变化只以来context、props，且组件树非常深

分析react app的性能，需要在production模式下分析，production的性能是远远高于dev模式的，同时可以以来react devtools中profile面板分析react re-render的次数

react的component是函数，所以对于如下component
```js
function App() {
  const dog = {
    name: 'Spot',
    breed: 'Jack Russell Terrier'
  };
  return (
    <DogProfile dog={dog} />
  );
}
```
不管是否用React.memo进行包裹，每次均进行re-render

