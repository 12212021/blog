### js Object Key Order
对于js而言，对象的key的迭代顺序从ES2015之后，遵循特定的iteration order。


Object key的迭代顺序为
1. 优先输出number-like的key，并且按照ascending的顺序
2. string keys按照插入的顺序（对于对象字面而言是书写的顺序）

```js
let obj = {};
obj.name = 'yu';
obj.age = 12;
obj[12] = 12;
obj[1] = 1;
// ['1', '12', 'name', 'age']
console.log(Object.keys(obj));
```

如果要保障key迭代的顺序为key插入的顺序，通过map数据结构可以保障

```js
let m = new Map([['name', 'yu'], ['age', 12], [12, 12], [1, 1]]);
//  ['name', 'age', 12, 1]
console.log([...m.keys()])

m.set('f', 'f');
m.delete(12)
//  ['name', 'age', 1, 'f']
console.log([...m.keys()])
```


### 如何处理js中的null、undefined值
一般而言，编译类型的语言能够在编译时解决undefined的问题（如typescript），但是没有办法解决程序运行时的null问题，很可惜的是js作为动态类型语言，既没有办法解决null；也没有办法解决undefined问题，下面从null、undefined的来源方面提出针对性的措施。

#### 用户输入
- 对用户的输入进行校验，这也是防止xss攻击的办法
- 对用户的总是将用户输入传入一个hydrate function，这个函数对undefined的类型的数据进行处理

#### 来源于后端、数据库拉取数据
- 将从后端拉取的数据传入hydrate function进行处理

example
```js
function setUser({name = 'Anonymous', avator = 'anon.png'} = {}) {
    state.name = name;
    state.avator = avator;
}
```

#### 未初始化的状态变量
一般而言，一个变量的类型决定了在运行的时候很少发生变化，所以尽量给变量设置默认值，比方说，balance代表一个人银行的账户余额，
这个状态需要在后端拉取，页面展示的时候，本地的balance状态变量需要设置初始值。可以默认设置为'0'（一般用字符串代表银行余额，精确）。
balance变量在使用过程中类型很少发生变化。（一个变量是数组，很大概率上，在程序的运行周期内改变量的类型一直是数组）

注：这样会引入一个新的问题，用balance为例，用户观察余额是，首先看到的是0，从后端拉取数据之后才能够看到正确的账户余额，这中体验谁也受不了。
可以采用state machine的思路进行解决。如下面的例子所示，绑定balance状态的时候，访问formatVal函数，该函数能够依据balance的状态返回合适
值。
```js
class BalanceInstance {
  constructor() {
    this.state = "uninited";
    this.value = "";
  }

  changeState(newState) {
    this.state = newState;
  }

  set value(newValue) {
    this.state = "inited";
    this.value = newValue;
  }

  get value() {
    switch (this.state) {
      case "uninited":
        return "--";
      case "inited":
        return this.value;
    }
  }
}
```

#### 函数没有明确指定返回值
可以利用函数式中的Either进行处理，Either：he Either monad is a special abstract data type that allows you to attach two different code paths: a success path, or a fail path.
js中的Promise就具有这种性质。下面的例子阐述了这种思想。可以将没有明确返回值的函数视为一个Promise函数，正常情况下应该有返回值，异常情况下直接catch null、undefined等情况
```js
const exists = value => value !== null;
const isExists = value => {
  return exists(value)
    ? Promise.resolve(value)
    : Promise.reject("null value detected");
};

isExists("name")
  .then(val => console.log(val))
  .catch(err => console.log(err));

isExists(null)
  .then(val => console.log(val))
  .catch(err => console.log(err));

```

注：
#### Array中的方法，如map、filter、flat等，能够自动处理数组长度为0的情况，避免了程序员手工检测length
#### js新增的了optional chaining、Nullish Coalescing方法来检测undefined、null状态，目前进入了stage 3状态


### echarts使用
再vue组件化过程中，echart使用有一些特点需要注意，基础的echarts vue封装组件如下
```vue
<template>
    <div :style="styles" class="echarts" ref="echarts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "EchartComp",
    props: {
        width: {
            default: "100%",
            type: String
        },
        height: {
            default: "100%",
            type: String
        },
        options: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            chart: null
        };
    },
    computed: {
        styles() {
            let style = {};
            if (this.width) {
                style.width = this.width;
            }
            if (this.height) {
                style.height = this.height;
            }
            return style;
        },
        chartDOM() {
            return this.$refs["echarts"];
        }
    },
    mounted() {
        // echarts再init的时候，dom块必须已经挂载上去（display: none）也行不
        this.chart = echarts.init(this.chartDOM);
        this.chart.setOption(this.options);
    },
    watch: {
        options(val) {
            if (this.chart) {
                // echarts的setOption采用merge的策略，如果需要全量更新，需要先clear
                this.chart.clear();
                this.chart.setOption(val)
            }
        }
    },
    beforeDestroy() {
        // 这里要对echarts进行资源释放，不然会存在内存泄露
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
    }
};
</script>

<style lang="scss" scoped>
.text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.echarts {
    height: 100%;
}
</style>

```


### JSON和js中的转义字符
```js
JSON.parse('{"hello":"\world"}');
// 先被js解析一下字符串
// 解析为 '{"hello":"world"}'

// 上面的代码输出
/*
{
  hello: "world"
}
*/


JSON.parse('{"hello":"\\world"}');
JSON.parse('{"hello":"\\\world"}');
// 先被js解析一下字符串
// 解析为 '{"hello":"\world"}' 根据下面json解析规则铁轨图，报错
// 上面代码输出
// Uncaught SyntaxError: Unexpected token w in JSON at position 11

JSON.parse('{"hello":"\\\\world"}');
// 先被js解析一下字符串
// 解析为 '{"hello":"\\world"}'
/*
{
 hello: "\world"
}
*/
```
JSON在parse一个字符串的时候，需要js先对字符串进行解析，（十六进制、空格、换行等控制符功能）；
js对字符串解析的时候，遇到转义符'\'的时候，会执行下面的骚操作
- \转义符后面是u，u后面不是unicode字符的时候，报错
- \转义符后面是x，x后面不是十六进制数的时候，报错
- （\b,\\,\n,\r）等可以解释的转移操作做正常解释
- （\w,\m）等没有办法解释的转义符会自动忽略转义符\

JSON解析铁轨图
![image.png](https://i.loli.net/2020/01/10/k8f3C1SlZDhtqsI.png)



### console.log函数同步异步
console.log函数如何工作在标准文档中并没有规定，依赖于宿主环境的实现，以下标准均来自于chrome 84版本（https://github.com/Mmzer/think/issues/30）

```javascript
let obj = {
  id: 11,
  per: {
    name: 'tom',
    age: 26
  }
};
console.log(obj.per.age);  // 这里会输出两个值 先输出 26 再输出10
obj.per.age = 10;
```
例子实例图：
![image.png](https://i.loli.net/2020/08/13/XVShyuFdmQLoCPk.png)

解释：JS中对象是引用类型，每次使用对象时，都只是使用了对象在堆中的引用。
当我们在使用obj.per.name = 'Jack'改变了对象的属性值时，它在堆中name的值也变成了'Jack'，而当我们不展开对象看的时候，console.log打印的是对象当时的快照，所以我们看到的name属性值是没改变之前'Tom'，展开对象时，它其实是重新去内存中读取对象的属性值，所以当我们展开对象后看到的name属性值是Jack。

结论:
- 基于基本类型string、number、boolean、null、undefined、symbol的内容一般是可信的
- 基于对象的调试，应该用打断点的方式或者console.log(JSON.stringify(obj))来强行存取快照




### 页面因为滚动条而抖动的解决方式
页面抖动主要是因为width的宽度动态变化，给定宽可以简单暴力地解决，但是自适应布局是没有办法给定宽的，这个时候会引入百分比布局或者vw、vh动态获取页面宽度高度。PC端会涉及到滚动条的问题，滚动条会占据部分宽度，这样就带来了布局抖动的问题。

1、用css3 calc计算的方式
```css
.wrapper-outer {
  margin-left: calc(100vw - 100%);
}
```
- .wrapper-outer是定宽容器主体的父级元素
- 100vw是浏览器的window.innnerWidth，滚动条也包含在内
- 100%是可用的宽度，不包含滚动条
- 100vw是动态的，依据屏幕的大小而变化，100%也是动态的


2、大佬给的固定解决方案，暂时还不清楚原理
```css
html {
  overflow-y: scroll;
}

:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
  overflow: hidden;
}
```

### location替换url
location可以通过href、assign()、replace()方法来跳转url
- assign替换url，url会被push到history stack中，可以回退或者前进
- replace替换url无法回退


替换方法
- '/xx/xx?name=yu'会直接替换location的pathname和search
- '?name=yu'会直接替换location的search
- 可以传入完整的url来进行跳转
- 'xxx/xxx'之类，会替换pathname最后一个path然后追加内容到尾部

这里面还涉及了到href标签的使用，a标签中href可以有多种使用方式
- url fragments
  - 比方#锚点的使用
  - test,会跳转到(当前路径 + /test)
  - /test,会以当前host port为基础，跳转到/test根路径下
  - https://www.baidu.com完整的http协议会跳转到另外的网站
- media file
- tels: 电话URL
- email地址 mailto: URLs

### 如何disabled所有DOM元素
form元素下有些组件直接支持disabled属性，对于不支持该属性的元素，可以通过如下方式解决
```js
$('#my-div').addClass('disabledButton')
```
```css
.disabledButton {
    /* 禁用元素的鼠标交互 */
    pointer-events: none;
    opacityL 0.3;
}
```

### http竟态问题

问题：当前端页面tab切换时，会向后端请求数据，tab作为参数传递，用户切换tab可能很快，如何保障点击的tab和http请求匹配？

前端由于js是单线程的，所以一般不存在通常意义上的“race condition”问题。上述场景下，竟态问题本质是一个异步操作，如果匹配？
所以解决的思路都是
- 通过id来匹配，如时间戳、后端回显改参数等
- 每个异步操作只能发起一次，如axios取消上次操作、rxjs的unsubscribe等方式


解决方式
- 基于tab参数做特殊化处理，后端可需要回传该参数，前端可用该参数匹配（这种方式也可以js函数内部闭包id类变量实现）
- 不管是xhr还是fetch的方式，都可以先取消上一个请求，重新发起一个请求
- 前端维护一个timeStamp时间戳，一般通过函数调用fetch请求，闭包内可读取该时间戳，匹配则赋值
- rxjs封装http请求，通过unsubscribe方法调用，取消上次请求

### 测试input输入框中文字的宽度

1、 基于canvas进行进行计算
```js
function getTextLengthInScreen(text, style) {
    style = style ?? {
        font: '16px Times, Serif',
        color: '#00F'
    };
    const { color, font } = style;
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textBaseline = 'Top';
    return ctx.measureText(text).width;
}
```

2、基于html进行计算
```css
input,
#input-helper {
    display: inline;
    font-size: 14px;
    font-family: serif;
    line-height: 16px;
}

#input-helper {
    position: absolute;
    visibility: hidden
}
```
```js
var div = document.createElement('div');
div.id = 'input-helper';
document.body.appendChild(div);

var input = document.querySelector("input");
// 每次都可以计算宽度是多少
input.addEventListener("keyup", function() {
    div.textContent = this.value;
    input.style.width = div.offsetWidth + "px";
});​
```

### react stale prop or state
- setState中拿到的闭包state是代码执行时拿到的state，如果后一个state更新依赖前state，用preState => {}代替
- useEffect、useMemo、useCallBack中访问到的闭包变量均需要在挂载到deps
  - 这些hooks中调用方法，最好方法在hooks内声明


### 判断一个变量是不是对象字面量
```js
function isObjectLiteral(obj) {
  return typeof obj === "object" && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}
```
