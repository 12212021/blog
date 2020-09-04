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


#### 动态规划

##### 贪心算法

1、有面值为1、5、10、20、50、100元面值的钞票

question：w元如何尽可能的用少的钞票凑出来

贪心算法：尽可能地让w变小，如666 = 100 x 6 + 50 x 1 + 10 x 1 + 5 x 1 + 1 x 1，总共用了10张钞票就能凑出666元

2、有面值为1、5、11，用贪心算法凑出15元

15 = 11 x 1 + 1 x 4（5张钞票）

15 = 5 x 3（3张钞票，这个是最优解）

贪心算法的问题：在于鼠目寸光，只考虑了眼前的情况，并没有基于全局去考虑问题，所以导致只能得到局部最优解

##### 动态规划



#### Form表单

以angular的两种表单为例
##### reactive Form
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

##### template-driven Form
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


##### Form Validate
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

