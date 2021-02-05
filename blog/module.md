### 前端模块化发展

#### 史前时代

js 内嵌于 html，通过 script 标签来引用，在 script 标签中声明的变量，作用域均为 window 全局，会造成命名冲突

js 中函数是存在自己的作用域的，所以可以通过 IIFE（立即调用函数表达式）来封装变量

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <script>
            (function () {
                var a = 10; // a变量被封装到匿名函数的作用域
                var b = 100;
            })();
        </script>
    </body>
</html>
```

#### commonjs

随着nodejs的发展，js模块化越来越必要，针对**后端应用场景（本地应用场景）**，commonjs应运而生

commonjs的模块化分成两个部分require函数和exports对象

utils.js文件如下
```js
// 直接给module.exports赋值
module.exports = {
    a: 10,
    b(): {
        console.log('aa');
    }
}

// 给exports赋值
exports.a = 10;
exports.b = function() {
    console.log('aaaa');
}
```
index.js文件引用utils文件如下
```js
var obj = require('./utils.js');
obj.b(); // aa
```
我们能够在模块化文件下面直接引用exports、module.exports、require函数、__filename、__dirname等变量

注意：exports变量是module.exports变量的别名，该变量默认指向了一个空对象，所以直接给exports变量赋值函数、值是无法发挥作用的。（可以给exports默认指定对象里面添加引用，或者直接给module.exports重新赋值）


require函数的简易版本实现如下
```js
function require(/* ... */) {
    const module = {exports: {}};
    ((module, exports) => {
        // Module code here. In this example, define a function.
        function someFunc() {}
        exports = someFunc;
        // At this point, exports is no longer a shortcut to module.exports, and
        // this module will still export an empty default object.
        module.exports = someFunc;
        // At this point, the module will now export someFunc, instead of the
        // default object.
    })(module, module.exports);
    return module.exports;
}
```

#### es6 module
es6被标记为模块的脚本，具有以下特性
- 自动启用严格模式且不能取消（use strict）
- top variables（顶层变量）不会被自动增加到global scope
- this变量的值被定义为undefined
- 可以单出执行`import './example.js'`，代表执行example文件


在浏览器环境下，模块的执行顺序，在浏览器环境下，标注js文件为module，defer属性被忽略，因为module文件执行表象就是标注了defer属性一样
```html
<!-- this will execyte first -->
<script type="module" src="module1.js"></script>

<!-- this will execute second -->
<script type="module">
import {sum} from './example/js';

let reseult = sum(1, 2);
</script>

<!-- this will execute third -->
<script type="module" src="module2.js"></script>
```
完整的loading文件顺序如下所示
1. 下载并解析module1.js
2. 递归地在module1.js中解析import资源文件并下载
3. 解析inline module
4. 递归的在inline module里面解析import资源文件并下载
5. 下载并解析module2.js
6. 递归地在module2.js中解析import资源并下载

当document文档被completely地解析完成，js代码的执行顺序如下
1.递归地执行module1.js中import的资源文件
2.执行module1.js的文件内容
3.递归地执行inline module内import的资源文件
4.执行line module中js内容
5.递归地执行module2.js文件内的import资源文件
5.执行module2.js文件内容


#### 循环加载

#### es6模块和commonjs模块的区别
- es6模块是ECMAScript的标准，适用于浏览器和node环境，commonjs仅能用于后端node环境
- commonjs的require同步加载模块，es6的import是异步加载模块
- commonjs是运行时才加载，故可以在if、for等循环中require模块，es6是编译的时候输出接口
- commonjs输出的是值的拷贝，而es6输出的是值的引用

```js
var a = 10;
export {a};
a = 100;

/*
1、 commonjs，require变量a时，拷贝一份10，故输出是10
2、 esm输出的是值的引用，故为100
 */

```


#### script标签特殊属性
1、普通script标签
```html
<script src="a.js"></script>
```
浏览器执行顺序如下
1.停止解析document
2.请求a.js
3.执行a.js脚本
4.继续解析document


2、defer
```html
<script src="d.js" defer></script>
<script src="e.js" defer></script>
```
浏览器执行顺序
1.不阻塞解析document，并下载d.js、e.js
2.即使下载完成了js文件，仍然继续解析document
3.按照script标签出现的顺序，在其他同步脚本执行完成后，DOMContentLoaded 事件前 依次执行 d.js, e.js。

3、async
```html
<script src="b.js" async></script>
<script src="c.js" async></script>
```
浏览器执行顺序
1.不阻止解析 document, 并行下载 b.js, c.js
2.当脚本下载完后立即执行。（两者执行顺序不确定，执行阶段不确定，可能在 DOMContentLoaded 事件前或者后 ）

