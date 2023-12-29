#### 介绍下BFC及其应用
bfc是块级上下文，是页面盒模型的一个css渲染模式，相当于一个独立的容器，内部的元素和外部的元素互相都不干扰。

创建bfc的方式
- html根元素
- float
- absolutely position
- display: inline-block， table-cell等
- overflow不是visible
- display: flow-root, list-item（flow-root属性专门为创建BFC）
- contain: layout, content, strict
- flex items, grid items

bfc的作用
- 内部的Box会在垂直方向上一个接一个放置
- Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠
- 每个元素的 margin box 的左边，与包含块 border box 的左边相接触
- BFC的区域不会与float box重叠
- BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素
- 计算BFC的高度时，浮动元素也会参与计算


#### 如何让元素垂直水平居中
1、可以用flex、grid布局的方式

```css
.parent {
    position: relative;
}
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
}
```
块级元素的水平居中，margin为auto的时候会自动占据父容器的可用空间，所以利用margin的auto属性，可以轻松实现`块级元素`靠左、居中、靠右
```css
.parent {
    display: block;
}
.child {
    margin-left: auto;
    margin-right: auto;
}
```

块级元素的垂直居中
```css
div {
    width: 200px;
    height: 100px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0
    margin: auto;
}
```


#### 分析比较opacity: 0、visibility: hidden、display: none 优劣和适用场景
都是使元素在视觉上不可见，但是有如下的不同点

1、display: none,让元素渲染树中移除，所有的子元素均不可见。会触发reflow。

2、visibility: hidden, 元素不会从渲染树中消失，继续占据空间，不可点击，会触发repaint，子元素如设置visible可见

3、opacity: 0,可以点击。触发reflow、repaint待研究


#### Retina屏幕的1px问题
基础问题
- 物理像素，设备像素，所谓的一倍屏、二倍屏、三倍屏是值多少个物理像素展示1个css像素
- 设备独立像素，css像素，是抽象单位
- 像素设备比，dpr = 物理像素 / 设备独立像素

所以说这里的1px在2倍屏幕下，应该是0.5px，一般而言，有下面几个方法来做
- 用图片来填边（不能代码修改颜色、不支持圆角）
- 用vw的方式来实现
- 伪元素先放大后缩小


vm方案代码
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" id="WebViewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>Document</title>
        <style type="text/css"></style>
    </head>
    <body>
        <script type="text/javascript">
            let viewport = document.querySelector('meta[name=viewport]')
            //下面是根据设备像素设置viewport
            if (window.devicePixelRatio == 1) {
                viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no')
            }
            if (window.devicePixelRatio == 2) {
                viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no')
            }
            if (window.devicePixelRatio == 3) {
                viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no')
            }
            function resize() {
                let width = screen.width > 750 ? '75px' : screen.width / 10 + 'px'
                document.getElementsByTagName('html')[0].style.fontSize = width
            }
            window.onresize = resize
        </script>
    </body>
</html>
```

伪元素代码
```css
.hairline{
  position: relative;
  &::after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    transform-origin: 0 0;
    background-color: #EDEDED;
  }
}
```

#### 长列表的渲染
- 可以采用虚拟列表的方式去渲染
  - 虚拟列表的每一项高度固定
  - 通过滚动的位置去渲染可视化的区域、以及上下的缓存区域
- 通过requestFrame API去分页加载，通过observable的浏览器接口去观测DOM是否在视口内，不在视口内的可以用visibility: hidden隐藏
- content-visibility、contain-intrinsic-size两个新的css属性去虚拟渲染


#### 如何实现深拷贝
- 浏览器的structuredClone原生方法
- 通过JSON.stringify、JSON.parse
  - `循环引用`无法处理
  - function、bingInt、Symbol、Date等不能序列化的对象无法处理
- lodash的deepClone方法

#### useEffect、useLayoutEffect


#### 宏任务和微任务
从node的角度来说，包括了`process.nextTick`
- 宏任务
  - 当前脚本的执行
  - setInterval、setTimeout api产生的任务
- 微任务
  - process.nextTick
  - Promise产生的任务
  - 通过`queueMicrotask`执行的任务

浏览器执行任务的时候，会优先执行微任务，（微任务可以向微任务队列添加任务、微任务），当当前微任务队列不存在任务时候，再执行宏任务。
```js
console.log('start')
setTimeout(() => {
    console.log('sett1')
}, 0)

Promise.resolve().then(() => {
    console.log('p1')
    return Promise.resolve()
}).then(() => {
    console.log('p2')
})

process.nextTick(() => {
    console.log('process')
    process.nextTick(() => {
        console.log('process 2')
    })
})
/*
运行结果：
start
process
process 2
p1
p2
sett1
*/
```

#### 如何使用css画三角形
```css
#triangle {
    width: 0;
    height: 0;
    box-sizing: content-box;
    border: 10px solid;
    border-color: transparent transparent transparent green;
}
```

#### 箭头函数的作用
es6以前，js中函数是一鱼三吃的，承担了`class constructor`,`class method`, `plain function`的作用，es6之后，class和箭头函数的引入让函数的职责更加明确了

- 箭头函数的书写更加简洁
- 箭头函数没有自己的this，绑定了词法作用域的this，也不支持call、apply、bind去修改this
- 箭头函数的内部无法使用arguments对象
- 箭头函数无法通过new去调用


#### 函数的curry化
```js
/**
 *
 * @param {Function} fn function to be curred
 * @returns {*} curred function or result
 */
function curry(fn) {
    let _args = [];
    return function inner(...args) {
        _args = _args.concat(args);
        if (_args.length < fn.length) {
            return inner;
        }
        return fn(..._args);
    };
}
```

#### http的retry函数
```js

/**
 * retry函数，针对异步函数失败，最多重试times
 * ! 在try、catch语句中执行return，return值会作为函数的返回值
 * ! 但是finally语句一定会执行
 *
 * @param {async function} asyncFunc
 * @param {number} times
 * @returns
 */
function retry(asyncFunc, times = 3) {
    const call = async (...params) => {
        let resp;
        try {
            resp = await asyncFunc.apply(null, params);
        } catch (error) {
            if (times > 0) {
                times--;
                return call(...params);
            }
            return error;
        }
        return resp;
    };
    return call;

```

#### 如何对数据进行shuffle混乱
```js

/**
 * 对数组进行洗牌，扰乱
 * @param {Array} array
 * @returns {Array}
 */
const shuffle = array => {
    let index = 0;
    const swap = (indexA, indexB, collection) => {
        const tmp = collection[indexA];
        collection[indexA] = collection[indexB];
        collection[indexB] = tmp;
    };
    const lastIndex = array.length;
    const shuffleArray = array.slice();

    while (index < shuffleArray.length) {
        const randomIndex =
            Math.floor(Math.random() * (lastIndex - index)) + index;
        swap(index, randomIndex, shuffleArray);
        index++;
    }
    return shuffleArray;
};
```


#### 如何从文件流下载文件
```js

// 如何从文件流下载文件
const downloadTemplate = async (url, name) => {
    httpApi
        .get(
            `${url}`,
            {},
            {
                responseType: 'blob'
            }
        )
        .then(res => {
            const blob = res.rawData;
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob); // 将流文件写入a标签的href属性值
            a.download = `${name}.xlsx`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
            // release URL.createObjectURL创建的流 未测试
            URL.revokeObjectURL(url);
        });
};

```

#### 模拟switchMap、exhaustMap
```js

// 闭包函数，返回最新的promise
function getLatestPromise(asyncFunc) {
    let id = 0;
    return function (...args) {
        id++;
        const curId = id;
        return asyncFunc.apply(null, args).then(resp => {
            if (id === curId) {
                return resp;
            }
            throw new Error('not latest promise result!');
        });
    };
}

// 获取第一个promise
function getFirstPromise(asyncFunc) {
    let pendingPromise = null;
    return function (...args) {
        if (pendingPromise) {
            return pendingPromise;
        }
        pendingPromise = asyncFunc
            .apply(null, args)
            .then(data => {
                pendingPromise = null;
                return data;
            })
            .catch(err => {
                pendingPromise = null;
                throw err;
            });
        return pendingPromise;
    };
}
```

#### 如何判断数据的类型
js中的数据类型一共有八种，
- 基础数据类型：number、string、boolean、null、undefined、Symbol、Bigint
- 引用数据类型：Object

其中function、Array也是Object，但是有如下需要注意的点
- function可以直接用typeof去判读
- Array一般有如下的办法去判断
  - Array.isArray
  - Object.getPrototypeOf(arr).constructor === Array
  - arr instanceof
- typeof null返回的的也是Object，可以用===去判断
- 更具体类型可以通过instanceof操作符去判断

还可以通过toString函数去判断类型
```js
/**
 * 当js期望一个bool值的时候，以下值总是会被当成false
 *
 *
 * false        false关键字
 * 0            数值0
 * -0           数值-0
 * 0n           bigInt，0n是falsy
 * "",'',``     空串是false
 * null         null值
 * undefined    undefined值
 * NaN          非数值Not a Number
 */
function type(input) {
    const typeOf = typeof input;

    if (input === null) {
        return 'Null';
    } else if (input === undefined) {
        return 'Undefined';
    } else if (typeOf === 'boolean' || input instanceof Boolean) {
        return 'Boolean';
    } else if (typeOf === 'number') {
        return input === input ? 'Number' : 'NaN';
    } else if (input instanceof Number) {
        const innerValue = input && input.valueOf && input.valueOf();
        return innerValue === innerValue ? 'Number' : 'NaN';
    } else if (typeOf === 'string' || input instanceof String) {
        return 'String';
    } else if (typeOf === 'symbol') {
        return 'Symbol';
    } else if (typeOf === 'function') {
        return 'Function';
    } else if (input instanceof RegExp) {
        return 'RegExp';
    } else if (input instanceof Promise) {
        return 'Promise';
    } else if (input instanceof Date) {
        return 'Date';
    } else if (Array.isArray(input)) {
        return 'Array';
    } else {
        return 'Object';
    }
}
```

#### 实现一个自定义的instanceof
```js
/**
 * 判断一个对象是不是一个类的实例
 *
 * 构造函数才有prototype对象，es6新出的箭头函数是没prototype的
 * @param {Object} L 被检测的对象
 * @param {Function} R 原型构造函数
 */
function instanceOf(L, R) {
    if (typeof R !== 'function') {
        return false;
    }
    R = R.prototype;
    let proto = Object.getPrototypeOf(L);
    while (proto) {
        if (proto === R) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}

```


#### 在不声明变量的情况下，swap两个变量
```js
// 数字类型的
var a = 10
var b = 20
a = a + b;
b = a - b;
a = a - b;

// 通用一点
[b ,a] = [a, b]
```


#### promise和callback的互相转化
```js
/**
 *
 * @param {Function} fn promise类型函数
 * @returns 返回一个callback类型的函数
 * @description 默认callback回调函数，参数类型为(err, data)，用户使用的时候需要将cb作为最后一个参数传递
 */
function callbackfy(fn) {
    return function (...args) {
        const cb = args.pop();
        fn(...args)
            .then(result => {
                cb(undefined, result);
            })
            .catch(err => {
                cb(err);
            });
    };
}


/**
 *
 * @param {Function} fn 普通的回调函数类型的，最后一个参数的是cb函数
 * @returns {Function} 返回一个可以当做Promise调用的函数
 * @description
 */
function promisefy(fn) {
    return function (...args) {
        // 这里就不用再给函数传递cb参数了
        // const cb = args.pop();
        return new Promise((resolve, reject) => {
            const cbWrapper = (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            };
            args.push(cbWrapper);
            fn(...args);
        });
    };
}
```

#### 深拷贝（处理循环引用）
```js

function deepCopy(obj, seen = new WeakMap()) {
    // 判断是否为对象类型，如果是数组或函数，则使用JSON方法进行深拷贝
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 检查是否已经处理过该对象，如果是则直接返回
    if (seen.has(obj)) {
        return seen.get(obj);
    }

    // 创建一个新的对象或数组，用于存储深拷贝后的结果
    let copy = Array.isArray(obj) ? [] : {};

    // 将新对象添加到已处理过的对象集合中
    seen.set(obj, copy);

    // 遍历原对象的所有属性，并进行深拷贝
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key], seen);
        }
    }

    return copy;
}
function isObject(value) {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}
```

#### 实现一个promise.all函数
```js
/**
 *
 * @param {Array} args 一个包含promsie的可迭代对象
 * @returns 如果所有的promise都返回，则返回一个数组，数组内包含了所有promise，否则返回第一个reject的内容
 */
function PromiseAll(args) {
    return new Promise((resolve, reject) => {
        let promiseNumber = args.length;
        let count = 0;
        let resolved = new Array(promiseNumber);
        for (let index = 0; index < promiseNumber; index++) {
            let p = args[index];
            p.then(response => {
                count += 1;
                rejected[index] = response;
                if (count === promiseNumber) {
                    resolve(resolved);
                }
            }).then(err => {
                reject(err);
            });
        }
    });
}
```

#### 实现一个自定义的Promise
```js
class MyPromise {
    constructor(promiseFn) {
        this.promiseFn = promiseFn;
        this.thenCbList = [];
        this.errorCbList = [];
        // 传入promise的resolve和reject，绑定this，供外函数调用
        this.promiseFn(this.resolve.bind(this), this.reject.bind(this));
        return this;
    }

    then(cb) {
        this.thenCbList.push(cb);
        return this;
    }

    catch(cb) {
        this.errorCbList.push(cb);
        return this;
    }

    resolve(value) {
        const cb = this.thenCbList.shift();
        if (cb && typeof cb === 'function') {
            let r;
            try {
                r = cb(value);
            } catch (e) {
                this.reject(r);
            }
            if (r instanceof MyPromise) {
                r.then(res => {
                    setTimeout(() => {
                        this.resolve(res);
                    }, 0);
                }).catch(err => this.reject(err));
            } else {
                setTimeout(() => {
                    this.resolve(r);
                }, 0);
            }
        }
    }

    reject(err) {
        const cb = this.errorCbList.shift();
        if (cb && typeof cb === 'function') {
            setTimeout(() => {
                cb(err);
                this.reject(err);
            }, 0);
        }
    }
}
```

#### 实现一个自定义的new函数
```js
/**
 * 自定义实现的new函数
 *
 * @param {Function} func 构造函数
 * @param  {...any} args
 * @returns {Object} 如果返回的一个对象，那么它的原型指向Object.prototype
 */
function selfNew(func, ...args) {
    // 这一步去做原型链
    const obj = Object.create(func.prototype);

    // 这一步，将obj apply给函数，如果函数访问this的话，更改的就是obj的值
    const ret = func.apply(obj, args);
    return typeof ret === 'object' ? ret : obj;
}
```

#### 自定义的call、bind函数
```js
/**
 * 自定义call函数
 * @param {Object} thisArg
 * @param {...any} args
 */
Function.prototype.selfCall = (thisArg, ...args) => {
    if (typeof this !== 'function') {
        throw new Error('当前调用call的方法不是函数');
    }
    const fn = Symbol('fn');
    thisArg[fn] = this;
    const result = thisArg[fn](...args);
    delete thisArg[fn];
    return result;
};


/**
 *
 * @param {Function} fn 被绑定的函数
 * @param {any} this
 */
function bind(fn, thisArg) {
    const fnSymbol = Symbol('bind');
    thisArg[fnSymbol] = fn;
    return function (...args) {
        const result = thisArg[fnSymbol](...args);
        delete thisArg[fnSymbol];
        return result;
    };
}

```

#### 实现节流和防抖函数
```js
/**
 *
 * @param {Function} fn 被节流的函数
 * @param {Number} wait 节流时间段
 * @description 规定在单位时间内，只能触发一次函数，如果这个时间段内被多次触发，只有一个生效
 * 类似于fps游戏的有射速上限，不管鼠标点击多么快，一段时间内也只能射出一发子弹
 */
function throttle(fn, wait = 200) {
    let timer;
    return function (...args) {
        if (timer) {
            return;
        }
        // 在节流函数的最后一秒来做
        timer = setTimeout(function () {
            fn.apply(this, ...args);
            timer = null;
        }, wait);
    };
}

/**
 *
 * @param {Function} fn
 * @param {Number} wait
 * @description 防抖函数：当事件触发的n秒后再执行回调函数，如果这段时间内重复触发，则重新计时
 * 比喻：类似于游戏读技能条，需要一段时间，如果这个时候被敌人攻击了，需要重新读时间条
 */
function debounce(fn, wait = 200) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        // setTimeout函数中充当了计时器
        timer = setTimeout(function () {
            fn.apply(this, args);
            timer = null;
        }, wait);
    };
}

```

#### 带限制request函数
```js
/**
 * 返回带并发限制的http请求
 * @param {string[]} urls 请求urls
 * @param {number} limit
 * @returns {Promise}
 */
function requestWithLimit(urls = [], limit = 10) {
    const successNum = 0;
    const result = new Array(urls.length);
    let urlIndex = 0;

    return new Promise((resolve, reject) => {
        const request = index => {
            const url = urls[index];
            http(url)
                .then(data => {
                    successNum++;
                    result[index] = data;
                    if (successNum === urls.length) {
                        resolve(result);
                        return;
                    }
                    urlIndex++;
                    request(urlIndex);
                })
                .catch(err => {
                    reject(err);
                });
        };
        for (
            urlIndex = 0;
            urlIndex < Math.min(limit, urls.length);
            urlIndex++
        ) {
            request(urlIndex);
        }
    });
}
```


#### flatten函数
```js
function flatten(array) {
    return array.reduce((acc, cur) => {
        if (Array.isArray(cur)) {
            return acc.concat(flatten(cur));
        }
        acc.push(cur);
        return acc;
    }, []);
}
```

#### 大数据量下对文件进行分片上传
client端利用file自带的slice函数对文件进行分片，标号，服务端根据标号去恢复文件
```js
class SliceBlob {
    constructor(chunkSize = 10 * 1024 * 1024) {
        this.chunkSize = chunkSize;
        this.data = [];
    }

    createFileChunk(file, size = this.chunkSize) {
        const fileChunkList = [];
        let cur = 0;
        while (cur < file.size) {
            fileChunkList.push({
                // 这里用文件自己prototype上带的slice方法进行分片
                file: file.slice(cur, cur + size)
            });
            cur += size;
        }
        return fileChunkList;
    }

    async uploadChunks() {
        const requestList = this.data
            .map(({chunk, hash}) => {
                const formData = new FormData();
                formData.append('chunk', chunk);
                formData.append('hash', hash);
                formData.append('filename', 'fileTest');
                return {
                    formData
                };
            })
            .map(({formData}) => {
                return this.request({url: '', data: formData});
            });
        await Promise.all(requestList);
    }

    async handleUpload() {
        const fileChunkList = this.createFileChunk();
        this.data = fileChunkList.map(({file}, i) => {
            return {
                chunk: file,
                hash: 'file-' + i
            };
        });

        await this.uploadChunks();
    }
}
```
