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
