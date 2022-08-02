### js中this的绑定问题
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
