#### 组织组件树的一些个人原则

##### http请求是否正交？

1）http请求如果正交的（各个请求之前没有相互依赖关系），各个components或者views在组件内部请求，将各个状态分散在component、view的内部，
制造一个局部的状态（抽象，抽象到局部，适合之后的维护），缺点是http请求一旦不正交，更正起来比较麻烦。

2）http请求相互之间有依赖关系，在容器组件请求各个状态（利于控制http的次序），通过Props传递数据，view或者component通过conputed计算属性
来生成适合模板数据类型。通过emit事件来通知父组件修改原始数据。

##### 如何组织页面的状态是可刷新的

单页面SPA应用有些情况需要保存自身的状态，如何保存状态？

1）通过后端http请求来缓存前端的一些状态，刷新的时候重新向后端请求状态

2）通过本地local storage来存储app状态，但是这些缓存的状态可以的浏览器清理，同时，如果将改url发送给其他的人，其他人无法看到相同的页面（其他人本地local storage并没有存储相关的状态）

3）通过url的query链来保存状态。组件划分为container、display组件，query参数一般只能container组件来触碰。**保存哪些状态需要进行精心的设计**。一些触发hhtp请求的button类组件在这个时候会增加query参数，用url链来保存页面的状态
- 只有path路径发生变化，Vue才会重新渲染页面，path不发生变化，仅仅query参数发生变化，并不会重新渲染页面，也不会调用created钩子函数。需要button之类的按钮自行处理http请求
- 组件在created的时候，需要有一个类似initStatusFromQuery之类函数来初始化APP的状态
- Vue中同一个路径、query、params不能再次调用router.push，会触发NavigationDuplicated错误，路由的push本身是一个Promise函数，如果不关心这类错误，可以用catch函数进行忽略，如下面所示。
- 对于新的app而言，可以通过合理的设计，将app的状态隐藏在path路径上，这样保证了状态发生变化的时候路由是一定会发生变化的
```js
this.$router.push({
    path: './search',
    query: {
        term: 'lorem',
        sort: 'alphabetical'
    }
}).catch(err => {})
```