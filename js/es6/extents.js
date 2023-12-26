/**
 * 讲一下js中的继承
 */

function Say() {
    console.log(this.type);
}

// 1利用原型链进行一下继承
function Parent() {
    this.name = 'web';
    this.type = ['JS', 'HTML', 'CSS'];
}
Parent.prototype.Say = Say;
function Son() {}
Son.prototype = new Parent();

// 缺点1 所有的子类都共享父类的属性和方法，方法还ok，属性就有点糟糕了
// 缺点2 子类构造的时候无法给父类传递参数
var son1 = new Son();
var son2 = new Son();
son1.type.push('VUE');
console.log(son1.Say(), son2.Say()); // ['JS', 'HTML', 'CSS', 'VUE'];

// 2利用构造函数去继承，这里就可以自定义得去给父类构造函数传递参数了
// 缺点，这个只能去继承父类的属性，但是父类的方法无法继承
function Parent1() {
    this.name = 'web前端';
    this.type = ['JS', 'HTML', 'CSS'];
}
Parent1.prototype.Say = Say;
function Son1() {
    Parent1.call(this);
}
var son1 = new Son1();
var son2 = new Son1();
son1.type.push('VUE');
console.log(son1.type, son2.type); // ['JS', 'HTML', 'CSS', 'VUE'] ['JS', 'HTML', 'CSS'];
// console.log(son1.Say()); // 这里会报错

// 3 利用原型链和构造函数一起去继承
// 最常用的继承的方式,但是最起码会调用两次父类的构造函数,一次是指定原型对象的时候,一次是new child的时候
function Parent2() {
    this.name = 'web前端';
    this.type = ['JS', 'HTML', 'CSS'];
}
function Son2() {
    Parent2.call(this);
}
Son2.prototype = new Parent2();

// 4 利用组合的方式进行继承,类似于Object.create(),自行指定父类
// 这里如果传递同一个Object,那么就共享父类的属性了
function fun(obj) {
    function Son() {}
    Son.prototype = obj;
    return new Son();
}

// 寄生组合继承
function extend(son, parent) {
    const clone = Object.create(parent.prototype);
    console.log(clone, 'pp')
    son.prototype = clone;
    clone.constructor = son;
}
function Parent3(name) {
    this.name = name;
    this.type = ['JS', 'HTML', 'CSS'];
}
Parent3.prototype.Say = Say;
function Son3(name) {
    Parent3.call(this, name);
}
extend(Son3, Parent3);
var son1 = new Son3('yiyi');
var son2 = new Son3('rainbow');
son1.Say();
son2.Say();
