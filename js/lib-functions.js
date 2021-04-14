/*
判断数据的类型
call始终会将第一个参数进行装箱操作
*/
const isType = type => target =>
    `[object ${type}]` === Object.prototype.toString.call(target);
// use case
/*
const isNUmber = isType('Number');
console.log(isNUmber(2));
 */

/*
循环实现数组的map方法
*/
const slefMap = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    let mappedArr = Array(arr.length - 1);
    for (let i = 0; i < arr.length; i++) {
        // 对于稀疏数组，这里处理一下
        if (arr.hasOwnProperty(i)) {
            mappedArr[i] = fn.call(context, arr[i], i, this);
        }
    }
    return mappedArr;
};
// use case
/*
Array.prototype.selfMap = slefMap;
console.log([1, 2, 3].selfMap(num => num * 2));
 */

/*
 使用reduce来实现数组map方法
  */
const selfMap2 = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    return arr.reduce((pre, cur, index) => {
        return [...pre, fn.call(context, cur, index, this)];
    }, []);
};

/*
 循环实现filter方法
  */
const selfFilter = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    let filteredArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr.hasOwnProperty(i)) {
            if (fn.call(context, arr[i], i)) {
                filteredArr.push(arr[i]);
            }
        }
    }
    return filteredArr;
};

/*
采用reduce来实现filter函数
 */
const selfFilter2 = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    return arr.reduce((pre, cur, index) => {
        // 感觉要不要this参数好像都可以
        if (fn.call(context, cur, index, this)) {
            return [...pre, cur];
        } else {
            return pre;
        }
    }, []);
};

/*
// use case
Array.prototype.selfFilter2 = selfFilter2;
console.log([1, 2, 3, 4, 4].selfFilter2(num => num % 2 === 0));
*/

/*
用循环来实现数组的some方法
*/
const selfSome = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    if (arr.length === 0) {
        return false;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr.hasOwnProperty(i)) {
            if (fn.call(context, arr[i], i, this)) {
                return true;
            }
        }
    }
    return false;
};
/*
Array.prototype.selfSome = selfSome
console.log([1,2,3,4,5].selfSome(num => num === 10))
 */

/*
循环实现数组的reduce方法
 */
const selfReduce = function(fn, initialValue) {
    let arr = Array.prototype.slice.call(this);
    let res;
    let startIndex;
    if (initialValue !== undefined) {
        res = initialValue;
    } else {
        for (let i = 0; i < arr.length; i++) {
            if (arr.hasOwnProperty(i)) {
                startIndex = i;
                res = arr[i];
            }
        }
    }

    for (let i = ++startIndex || 0; i < arr.length; i++) {
        if (arr.hasOwnProperty(i)) {
            res = fn.call(null, res, arr[i], i, this);
        }
    }
    return res;
};

/*
let a = Array(10);
a = a.concat([1, 2]);
Array.prototype.selfReduce = selfReduce;
console.log(
    a.selfReduce((pre, cur, index) => {
        return pre + cur;
    }),
);
 */

/*
reduce实现数组的flat方法
原生的flat支持一个depth的参数，表示降维深度，默认是1即给数组降一层
如果传入Inifity会将传入的数组变成一个一维数组
 */

const selfFlat = function(depth = 1) {
    let arr = Array.prototype.slice.call(this);
    if (depth === 0) {
        return arr;
    }
    // reduce在提供initValue的时候，第一的pre就是initValue
    // 不提供initValue的时候，第一个参数是数组第一个元素
    return arr.reduce((pre, cur) => {
        if (Array.isArray(cur)) {
            return [...pre, ...selfFlat.call(cur, depth - 1)];
        } else {
            return [...pre, cur];
        }
    }, []);
};

/*
Array.prototype.selfFlat = selfFlat;
console.log([[1,2,3,],2,[4,5,[2,43,22]]].selfFlat(2)); */

/*
通过 Object.create 方法创造一个空对象，并将这个空对象继承
Object.create 方法的参数，再让子类（subType）的原型对象等于这个空对象，
就可以实现子类实例的原型等于这个空对象，而这个空对象的原型又等于父类原型对象（superType.prototype）的继承关系
备注：es6究竟是如何实现class语法糖的，还是不知道，就把这个例子当做Object.create的一个示范用例吧
 */
function inherit(subType, superType) {
    subType.prototype = Object.create(superType.prototype, {
        value: subType,
        configurable: true,
        enumerable: false,
        writable: true,
    });
}

/*
科里化是指：将结果多个参数的函数转化为接收一个参数的函数
核心思想是：根据函数的参数个数，返回一个闭包函数，该闭包函数仅接受一个参数

 */
function curry(fn) {
    const argNumber = fn.length;
    let args = [];
    return function generator(arg) {
        args.push(arg);
        if (args.length === argNumber) {
            return fn(...args);
        }
        return generator;
    };
}
/* 偏函数和curry的区别：
偏函数的是先固定函数的一部分参数，然后再一次性地接收剩余的所有参数。
函数科里化会根据你传入的参数不停地返回函数，知道传入的参数等于被科里化的函数的参数总个数。
 */

/*
let add = (a, b, c, d) => a + b + c + d;
const curried1 = curry(add);
const crrried2 = curried1(1);
const crrried3 = crrried2(2);
const crrried4 = crrried3(3);
const crrried5 = crrried4(4);
console.log(curried1, crrried2, crrried3, crrried4, crrried5);
 */

/*
call函数的实现
将函数作为传入的上下文的属性执行(函数的this指向，obj.say，say函数中的this一般就指向obj)
 */

function selfCall(context, ...args) {
    let func = this;
    context = context || window;
    if (context === null || undefined) {
        func(...args);
        return;
    }
    let caller = Symbol('caller');
    context[caller] = func;
    let res = context[caller](...args);
    delete context[caller];
    return res;
}

/*
bind函数的实现
*/
function selfBind(context, ...args1) {
    const func = this;
    if (typeof func !== 'function') {
        throw new TypeError('must be callable!');
    }
    return function(...args2) {
        const args = [...args1, ...args2];
        return func.apply(context, args);
    }
}

/**
 * 菲波那切数列以及优化
 *
 */

// 需要的重复计算太多
function fibBase(n) {
    const fib = memory(fibBase);
    if (n < 1) throw new Error('参数错误');
    if (n === 1 || n === 2) {
        return 1
    }
    return fib(n - 1) + fib(n - 2);
}

// 高阶函数，利用闭包，缓存结果
function fibCache() {
    let cache = {};
    return function fib(n) {
        if (n < 1) throw new Error('参数错误');
        if (n === 1 || n === 2) {
            return 1
        }
        if (!cache[n]) {
            cache[n] = fib(n - 1) + fib(n - 2);
        }
        return cache[n];
    }
}

function fibDP(n) {
    if (n === 1 || n === 2) {
        return 1;
    }
    let res = 0;
    let pre = 1;
    let cur = 1;
    let index = 2;
    while(index < n) {
        res = pre + cur;
        pre = cur;
        cur = res;
        index++;
    }
    return res;
}


/*
jquery.offset() 方法
获取当前dom元素的位置信息，该位置信息是相对于document而言

1、Element.getBoundingClientRect: returns the size of an element and its position relative to the viewport.
2、window.pageYOffset是window.scrollY的别名，pageXOffset类似
3、The read-only scrollY property of the Window interface returns the number of pixels that the document is currently scrolled vertically.
*/

function offset(dom) {
    if (!(dom instanceof HTMLElement)) {
        return;
    }

    // 获取dom元素大小和相对于viewport的位置信息
    const rect = dom.getBoundingClientRect();
    // 获取dom所属文档的window对象
    const win = dom.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    }
}

/**
 *
 * @param {any} src 被拷贝的元素
 * @returns 深拷贝后的元素，需要提防循环引用引起的暴栈问题
 */
function deepCopy(src) {
    let dist;
    if (isPlain(src)) {
        dist = src;
        return dist;
    }
    const keys = Object.keys(src);
    if (Array.isArray(src)) {
        dist = [];
    }
    else {
        dist = {}
    }
    keys.forEach(key => {
        if (isPlain(src[key])) {
            dist[key] = src[key];
        }
        else {
            dist[key] = deepCopy(src[key]);
        }
    });
    return dist;
}

function isPlain(item) {
    if (item === null
        || typeof item === 'number'
        || typeof item === 'string'
        || typeof item === 'symbol'
        || typeof item === 'undefined'
        || typeof item === 'function'
        || typeof item === 'boolean') {
        return true;
    }
    return false;
}



/**
 *
 * @param {Function} fn
 * @param {Number} wait
 * @description 防抖函数：当事件触发的n秒后再执行回调函数，如果这段时间内重复触发，则重新计时
 * 比喻：类似于游戏读技能条，需要一段时间，如果这个时候被敌人攻击了，需要重新读时间条
 */
function debounce(fn, wait=200) {
    let timer = null;
    return function(...args) {
        if (timer) {
            clearTimeout(timer);
        }
        // setTimeout函数中充当了计时器
        timer = setTimeout(function() {
            fn.apply(this, args);
            timer = null;
        }, wait);
    }
}

/**
 *
 * @param {Function} fn 被节流的函数
 * @param {Number} wait 节流时间段
 * @description 规定在单位时间内，只能触发一次函数，如果这个时间段内被多次触发，只有一个生效
 * 类似于fps游戏的有射速上限，不管鼠标点击多么快，一段时间内也只能射出一发子弹
 */
function throttle(fn, wait = 200) {
    let timer;
    return function(...args) {
        if (timer) {
            return;
        }
        // 在节流函数的最后一秒来做
        timer = setTimeout(function() {
            fn.apply(this, ...args);
            timer = null;
        }, wait);
    }
}

/**
 *
 * @param {Function} fn callback类型函数
 * @returns 返回一个Promisefy的函数
 * @description 默认callback回调函数，参数类型为(err, data)，用户使用的时候不传递改cb函数
 */
function promisefy(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            args.push(function(err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
            fn.apply(null, args);
        });
    }
}

/**
 *
 * @param {Function} fn promise类型函数
 * @returns 返回一个callback类型的函数
 * @description 默认callback回调函数，参数类型为(err, data)，用户使用的时候需要将cb作为最后一个参数传递
 */
function callbackfy(fn) {
    return function(...args) {
        const cb = args.pop();
        fn.apply(null, args).then(response => {
            cb(undefined, response);
        }).catch(err => {
            cb(err, undefined);
        });
    }
}

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
            })
        }
    })
}

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



/**
 * 快排的核心思想在于每次找到一个pivot，然后将数组分成左右两部分，左侧的部分值小于pivot，
 * 右侧值大于pivot，对左右两侧的值分治递归，然后合并
 * @param {Array} arr the array to sort
 * @returns {Array} sorted Array
 */
function quickSort(arr) {
    if (arr.length === 0) {
        return arr;
    }
    const [left, right, pivot] = partition(arr);
    const leftSorted = quickSort(left);
    const rightSorted = quickSort(right);
    return [...leftSorted, pivot, ...rightSorted];
}

/**
 * partition array to three parts, members in left is smaller thann pivot, right is bigger
 * @param {Array} arr the array to partition
 * @returns {Array} [left, right, right]
 */
function partition(arr) {
    const pivot = arr[0];
    let left = [];
    let right = [];
    let index = 0;
    while(++index < arr.length) {
        const value = arr[index];
        if (value < pivot) {
            left.push(value);
        }
        else {
            right.push(value);
        }
    }
    return [left, right, pivot];
}


/**
 * 二分查找,二分搜索区域减少一半，log(n)（n代表集合中元素的个数）
 * @param {Array} array sorted array
 * @returns {Number} if matched return index of metched element else -1
 */
function binarySearch(array, val, begin = 0, end = array.length) {
    if (end - begin <= 0) {
        return -1;
    }
    const mid = Math.ceil((begin + end) / 2);
    const midVal = array[mid - 1];
    if (midVal === val) {
        return mid - 1;
    } else if (midVal > val) {
        return binarySearch(array, val, begin, mid - 1);
    } else {
        return binarySearch(array, val, mid, end);
    }
}

