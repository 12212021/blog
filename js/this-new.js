// 在js中this代表了什么
// 1、在普通函数中，this指向了window全局对象，在strict模式下面this指向undefined

var a = 10;
function oridinary() {
    console.log(this.a);
}

// 2、函数作为对象的一个属性进行调用， this指向了这个对象
var obj = {
    name: 'yuchi',
    sayName() {
        console.log(this.name);
    },
};

// 3、作为call、apply、bind进行调用的时候，指向的这个三个函数的第一个参数指定的对象
// call apply bind这些函数的内部this就指向了函数（这是this的第二种用法）
var obj1 = {
    name: 'yellow',
};
var sayName = obj.sayName;
sayName.call(obj1); // yellow

// 4、作为构造函数进行调用的时候（js中除了一些内置函数，大部分函数都能用做构造函数）
/* 
函数作为构造器使用的时候，this指向了引擎为你构造的一个对象,这个对象的Constructor是该函数
实际上，对象将不存在的属性委托给他的原型这句话的说法有点不准确，准确的说法是对象对于不存在的属性，将其
委托给了它的构造起的原型进行查询
 */
function CreatePerson(name = 'yuchi', age = 18) {
    this.name = name;
    this.age = age;
}
var p = new CreatePerson();
console.log(p); // CreatePerson { name: 'yuchi', age: 18 }



function CreatePerson1(name = 'yuchi', age = 12) {
    this.name = name;
    this.age = age;
    return {
        name: 'yellow',
        age: 18,
    };
}

var p = new CreatePerson1();
console.log(p) // { name: 'yellow', age: 18 }
// 当构造函数返回一个对象的时候，引擎会抛弃this创建的对象，返回函数中返回的对象
// 该对象是有Object进行构造的 对象.__proto__指向的对象构造函数的原型
// 只有函数或者方法才存在prototype属性
console.log(p.__proto__ === Object.prototype);

// 5、函数内层的函数
global.id = 'global.id';
var a = {
    id : 'a.id',
    say() {
        const innerSay = function () {
            console.log(this.id);
        }
        innerSay();
    }
}
a.say(); // global.id  innerSay内层函数指向了全局对象

var b = {
    id : 'b.id',
    say() {
        const innerSay = () => {
            console.log(this.id);
        }
        innerSay();
    }
}

b.say(); // b.id 箭头函数没有this，调用this的时候会指向上层函数的this

// 6、回调函数中的this
// (1) dom元素的回调函数

/*
<div click="onClick()"></div>  

let dom = document.querySelector('div');
dom.onclick = function () {

}
dom.addEventListener('click', function () {

})
$('div').on('click', function () {

}) 
1、全局window对象
2、当前选中的dom元素
3、当前选中的dom元素
4、当前选中的dom元素（jquery）
注：第二种和第三种绑定dom事件的方式会覆盖第一种绑定的同名事件，第一种已经不再推荐
*/

// (2) 数组常见的回调函数 map、filter、reduce
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.filter(function (value, index, array){
    console.log(value, index, array, this);
}, {
    a: 2
});
// fliter、map、reduce函数都有一个thisArg的参数，用来指定callback执行时this的指向
// callback必须是普通的函数才能访问到指定的thisArg，箭头函数没有this，指向了全局对象
// 这种类型的函数本身对this没有强需求


// 注：原型链原理
function CreatePerson() {
    this.name = 'yu';
    this.age = 90;
}

let person = new CreatePerson();
let personProto = Object.getPrototypeOf(person);
let personProtoProto = Object.getPrototypeOf(personProto);
let personProtoProtoProto = Object.getPrototypeOf(personProtoProto);

console.log(personProto.constructor === CreatePerson, personProto);
// person存一个一个原型对象，改原型对象的构造函数就是CreatePerson    || true CreatePerson {}
console.log(personProtoProto.constructor === Object, personProtoProto, Object.getPrototypeOf({}) === personProtoProto);
// person的原型对象也是对象，是由js引擎中Object的原型对象创建的，它的原型对象和对象字面量的原型对象是一个     || true {} true
console.log(personProtoProtoProto);
// 创建对象字面量的原型对象的原型是null
