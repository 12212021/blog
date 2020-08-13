### function（method）分类
函数是js中常见的抽象方式，从一般的角度来讲函数能够分成下面三类
- getters：没有参数，返回值
- setters：没有返回值，有参数
- getters & setters：有返回值，有参数


#### getters
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

#### setters
setters函数一般接收一个参数，但是没有返回值，主要的作用是**命令抽象**，像常见的console.log函数、document.write函数等都是setters函数。


#### getters-getters
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


#### iterator
