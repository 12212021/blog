/* 
代理模式：为一个对象提供一个代理，以便控制对它的访问

使用场景：
1、当客户端不能直接满足访问这个对象的时候，引入代理对象来访问
2、单一职责原则：一个类或者函数，应该只有一个引起它变化的原因，面向对象鼓励将行为分布到细粒度的对象中
    - 代理对象可以做一些边角的工作，保证对象的纯粹性
    - 代理对象和对象应该保持一致的接口（静态语言），对于客户而言，是透明的
*/

// 缓存代理，计算某项值是非常耗时的操作

// class 风格
class ProxyFib {
    constructor() {
        this.cache = {};
    }
    compute(n) {
        // 代理缓存
        const ret = this.cache[n];
        if (ret) {
            return ret;
        }
        const fibCompute = new computeFib();
        this.cache[n] = fibCompute.compute(n);
        return this.cache[n];
    }
}

class computeFib {
    compute(n) {
        if (n === 0) {
            return 0;
        }
        if (n === 1) {
            return 1;
        }
        return this.compute(n - 1) + this.compute(n - 2);
    }
}

function getFib() {
    return new ProxyFib();
}

const fibObj = getFib();
console.log(fibObj.compute(40));
console.log(fibObj.compute(40));

// 高阶函数风格（js一般用高阶函数）
function createCacheFactory(fn) {
    let cache = {};
    return function () {
        const args = Array.prototype.join.call(arguments, ',');
        const ret = cache[args];
        if (ret) {
            return ret;
        }
        cache[args] = fn.apply(this, arguments);
        return cache[args];
    };
}

function fib(n) {
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
}

const fibProxy = createCacheFactory(fib);
console.log(fibProxy(40));
console.log(fibProxy(40));





/* 
虚拟代理：像节流函数，防抖函数都属于虚拟代理的一部分
下面的例子展示当浏览dom区域进入视口的时候，再加载图片的例子
*/
function delayLoadImg(fn) {
    return function(node, src) {
        if (inView(node)) {
            setImgSrc(node, 'localImgSrc');
            // 代理给真正的对象
            setImgSrc(node, src);
        }
    }
}

function setImgSrc(node, src) {
    node.src = src;
}

function inView() {
    return true;
}

const setImg = delayLoadImg(setImgSrc);
setImg({}, 'local');