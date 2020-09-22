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
    // fn.lenght代表了函数期望接受的参数，其实就是函数的参数个数
    if (fn.length === 0) {
        return fn;
    }
    return (generator = (...args) => {
        if (fn.length === args.length) {
            return fn(...args);
        } else {
            return (...args2) => {
                // 这个结构其实是将所有参数挨个传入的缩写
                return generator(...args, ...args2);
            };
        }
    });
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
    if (typeof func !== 'function') {
        throw new TypeError('this is not a function');
    }
    let caller = Symbol('caller');
    context[caller] = func;
    let res = context[caller](...args);
    delete context[caller];
    return res;
}

/* 
bind函数的实现 
bind返回的函数被new调用的时候，绑定的this值会失效并且返回new创建的this对象（详见new操作符实现）
被bind的函数要设置好自己的原型
需要定义被bind之后的函数的length和那么属性
*/
const isComplexDataType = (obj) => 
    (typeof obj === 'obj' || typeof obj === 'function') && (obj !== null);

const slefBind = function(bindTarget, ...args1) {
    if (typeof this !== 'function') {
        throw new TypeError('Bind must be called on a function');
    }
    let func = this;
    let bindFunc = function(...args2) {
        let args = [...args1, args2];
        // 如果被bind的函数是通过new call的，new.target为true，否则为false
        if (new.target) {
            // 这个this是new运算符创建的this对象
            let res = func.apply(this, args);
            if (isComplexDataType(res)) return res;
            return this;
        } else {
            return func.apply(args);
        }
    };
    // 这个this是调用bind的函数，在这个函数中和func同值
    if (this.prototype) {
        bindFunc.prototype = Object.create(this.prototype);
    }

    let desc = Object.getOwnPropertyDescriptors(func);
    Object.defineProperty(bindFunc, {
        length: desc.length,
        name: Object.assign(desc.name, {
            value: `bound${desc.name.value}`
        })
    })
    return bindFunc;
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
