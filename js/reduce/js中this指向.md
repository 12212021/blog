#### dom响应事件中的this
dom中绑定事件有两种方式*addEventListener*和*dom.onclick=function*两种方式
```js
const btnDOM = document.querySelector('.btn');
btnDOM.addEventListener('click', function (e) {
    console.log(this); // btnDOM对象
});
btnDOM.onclick = function (e) {
    console.log(this); // btnDOM对象
};
// 如果绑定的函数是箭头函数，在严格模式下，this是undefined，否则为window（在全局环境下）
// 因为箭头函数没有自己的this，它的this指向了上层函数或者脚本（模块）的this
// 脚本<scirpt>标签，this纸箱window对象，严格模式下，指向了undefined，设置type=module，脚本会自动应用严格模式
```

#### call、apply、bind
这个三个函数能够改变this指向

#### 通过new调用的函数
```js
function Person(name = 'yuchi', age = 20) {
    this.name = name;
    this.age = age;
    console.log(this); // this指向了新生成的person对象
}


// new函数的实现
/**
 *
 * @param {Function} context
 * @param  {...any} args
 */
function _new(context, ...args) {
    let obj = new Object();
    Object.setPrototypeOf(obj, context.prototype);

    // 这一步将obj传入到构造函数，作为this来使用
    const res = context.apply(obj, args);
    const isObject = typeof res === 'object' && res !== null;
    const isFunction = typeof res === 'function';
    return isObject || isFunction ? res : obj;
}
```

#### 总结
js中this的绑定是运行时状态（一般情况下），在严格模式和非严格模式下表现略微不同


this的表现
- global环境下（不再任何function内），this指向了global object
- 在function环境下（全局function）
  - strict 指向undefined；non-strict 指向 global object
- class环境下，与function环境大致相同，在constructor中this指向生成的object，所有的non-static methods都会增加到this的prototype上
- derived class中，在调用super()关键字之前，子类是没有this的，调用super()相当于`this = new Base()`
- bind函数可以提前绑定this，无论函数如何调用，绑定的this不发生变化
- Arrow Function，箭头函数this是绑定上层的enclosing lexical context's this
- 作为Object的method被调用，this是绑定到运行时调用method的object上的
- 在原型链上的this，也是被通过method被调用的，this也是绑定到调用method的object上
- getter、setter，this被绑定到getter、setter所属的object上的


箭头函数的小的示例
```js
'use strict'
let obj = {
    name: 'bob',
    getArrowFunction() {
        return () => {
            return this;
        };
    }
};

const arrow1 = obj.getArrowFunction();
// getArrowFunction通过obj调用，故getArrowFunction的this是obj
console.log(arrow1() === obj);
const arrow2 = obj.getArrowFunction;
// getArrowFunction是全局调用，指向globalThis，strict模式下为undefined
console.log(arrow2()() === globalThis, arrow2()());

```

#### this混乱源
js中this混乱的源头是function，在传统的js中，function主要有三种作用
- 当作普通函数调用（类似与arrow function）
- 当作构造函数调用（类似于new class）
- 当作类的method去调用（class类中的方法）
这三种function的调用都比较典型，也不会造成错误，但是这里有一个问题，就是如果把一个constructor function当做一个普通的function调用。合理的方式是直接报错，但是js的实现上，会默认给window当做this，所以全局的function其实也是全局对象的method。
