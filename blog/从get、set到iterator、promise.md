### function（method）分类
函数是js中常见的抽象方式，从一般的角度来讲函数能够分成下面三类
- getters：没有参数，返回值
- setters：没有返回值，有参数
- getters & setters：有返回值，有参数


#### getters函数
getters函数没有参数，存在返回值的函数。通常用于**抽象**，常见的使用方式有如下几种

1、屏蔽获取值的方式，将使用方和获取值的方式解耦
```javascript
function getHost() {
    if (process.env.NODE_ENV === 'test') {
        return 'http://XXX.test.com';
    }
    return 'http://XXX.prod.com';
}
```
2、用来隔离一些副作用
```javascript
function getUser() {
    Analytics.sendEvent('User object is now being accessed');
    return {name: 'bob', age: 12};
}
```

#### setters函数
setters函数一般接收一个参数，但是没有返回值，主要的作用是**命令抽象**，像常见的console.log函数、document.write函数等都是setters函数。


#### getters-getters函数
getters-getters本质上也是getters函数，只是其返回值不在是普通的值，也是一个getters函数，能够充分地利用js函数闭包的特性、防止全局环境污染、并发安全。
```javascript
function getGetNext() {
    let iter = 2;
    return () => {
        const next = iter;
        iter = iter * 2;
        return next;
    }
}
let getNext = getGetNext();
console.log(getNext()); // 2
console.log(getNext()); // 4
console.log(getNext()); // 6
getNext = getGetNext();
console.log(getNext()); // 2
console.log(getNext()); // 4
console.log(getNext()); // 6
```


#### setters-setters函数
setters-setters函数本质上也是一个setter函数，其参数为一个setter函数。
```javascript
function consume(log) {
    console.log(log);
}
function productLog(cb) {
    const log = 'log';
    cb(log);
}
productLog(consume);
```


注： getters-getters函数和setters-setters函数涉及到生产者-消费者模型中何时消费的策略。
getters-getters函数是pull模式，不断去拉数据，而setters-setters函数则是push模式，生产者产生数据之后，
push给消费者，在js中就是常见的回调函数。



#### iterators模模式
假设将内层getter函数看成一个序列，那么如何来判断这个序列是否结束了呢？
这个时候就需要对getters-getters模式做出进一步的限制。
```javascript
function getGetNext() {
    let init = {
        value: 0,
        done: false
    };
    return () => {
        init.value = init.value + 1;
        init.done = init.value > 10;
        return init;
    }
}

let getNext = getGetNext();
let seed = getNext();
while(!seed.done) {
    console.log(seed.value);
    seed = getNext();
}
```
对getters-getters函数的返回值加以限制，用一个对象来代替普通的返回值，value代表实际的值，done来表示序列是否结束，采用这种模式，
可以生成一些无限长的序列。
```javascript
function getGetNext() {
    let init = {
        value: -1,
        done: false
    };
    return () => {
        init.value = init.value + 1;
        return init;
    };
}
let getNext = getGetNext();
let seed = getGetNext();
while (seed.done) {
    console.log(seed.value);
    seed = getGetNext();
}
```
在这种模式下面，调用比较麻烦，每次都需要手动判断done的状态，js为我们提供的简洁的调用方式： for...of调用。


#### observable的模式
会到setters-setters的例子，生产者知道什么时候能能产生数据，虽然数据如何消费由cb回调函数决定，但是生成这可以决定消费几次，是不是同步消费等
```javascript

function triggerCb(cb) {
    // cb回调如果不是幂等函数的话，可能会对业务产生影响
    cb(10);
    cb(10);
    cb(10);
}
function triggerCbSync(cb) {
    // 同步调用，调用栈是马上可以看到的
    cb(10);
}
function triggerCbAsync(cb) {
    // 异步调用，调用栈是无法观测到
    setTimeout(() => {
        cb(10);
    }, 0);
}
```
对setters-setters函数的使用方式进行限制抽象，能够排成不同的抽象方式，比方说Promise、observable。promise
其实是对setters-setters的一种限制。只能消费数据一次，且消费是异步的。
```javascript
function promiseExample() {
    return new Promise((resolve, reject) => {
        resolve(10);
    });
}

function consumer(res) {
    console.log(res);
}
promiseExample().then(consumer);
console.log('a'); // a 10
```
