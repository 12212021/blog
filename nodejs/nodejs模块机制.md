### commonjs模块规范
```js
// 1、模块引用，通过require函数进行引用
var math = require('math');

// 2、模块定义，文件本身存在一个module对象，代表文件自身，存在一个exports对象
// 挂载在exports对象上的属性可以视为定义模块导出
exports.add = function () {
    return 1 + 1;
}

// 3、模块标识 require函数的参数接收一个模块标识，可以是绝对路径、相对路径，可以没有文件的后缀名
var fs = require('fs'); //核心模块引用
var sum = require('./sum.js'); //文件模块引用
var config = require('./config.json') // 文件模块-json文件引用
var Vue =require('Vue') // 文件模块引用-库文件引用
```

### node针对commonjs模块机制规范的实现

####  nodjs模块分类
- 核心模块（由nodjs提供，在加载Node进程的时候会直接被编译为二进制文件，没有文件定位、编译执行的过程）
- 文件模块（由用户编写的nodejs模块，需要完整的路径分析、文件定位、编译执行过程）


#### nodejs路径分析
- 优先从缓存中进行加载（核心模块和文件模块）
- 从内存中直接加载核心模块
- 依据相对路径或者绝对路径加载文件模块
- 自定义的模块加载（查看当前目录下的node_modules,父文件夹下的node_modules...递归查找，找不到报错）

#### nodejs文件定位
- 没有文件后缀名的情况下，node会一次按照.js、.json、.node的次序来尝试
- 自定义模块，node在包目录下查找package.json文件中mian对应的入口文件，如果没有指定或者指定的文件不存在，会尝试解析当前目录下的index文件

#### nodejs的编译执行
1、js的编译执行
```js
// node对文件进行了包装，所以脚本能够访问exports、module、require等对象或者函数
(function(exports, require, module, __filename, __dirname) {
    // 文件内容
    // 最后exports对象引用中的包含的东西会return给引用方（require）
});

// module.exports对象是函数中exports对象，直接对exports对象赋值是不管用的
// exports传入的是形参引用，在内部是没有办法更改这个引用的，但是module.exports可以
```

2、对C/C++模块的编译执行
调用process.dlopen()进行加载和执行

3、对JSON文件的编译执行
调用JSON.parse()函数进行记载，可以享受node模块缓存带来的优势

### 前后端共用的模块规范和实现

### npm包字段解释
