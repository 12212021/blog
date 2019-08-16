// symbol是js原始类型中新增的一位,代表了独一无二的变量

// 创建symbol
var firstName = Symbol();
var person = {}
person[firstName] = 'Nichilas';
console.log(person[firstName]);

//Symbol构造函数接受一个解释字符串，当调用Symbol.toString()时该字符串会输出
var firstName = Symbol('first name');
var person = {};

person[firstName] = 'Nichilas';
console.log('first name' in person);
console.log(person[firstName]);
console.log(firstName);


// 共享Symbol
// for方法会首先再全局的Symbol环境中根据字符串'uid'搜索符合的Symbol
// 有符合条件的Symbol，返回，否则执行Symbol('uid'),并在全局的Symbol环境中注册
var uid = Symbol.for('uid');
var uid1 = Symbol.for('uid');
console.log(uid === uid1);

// Symbol.keyFor方法根据参数（Symbol）返回它的注册key
var uid = Symbol.for('uid');
var uid2 = Symbol.for('uid');
console.log(Symbol.keyFor(uid), Symbol.keyFor(uid2)); // 'uid uid'
var uid3 = Symbol('uid');
console.log(Symbol.keyFor(uid3)); // undefined uid3并未再全局的Symbol环境中注册



// Symbol类型变量是非常难以被改变的
// 54 + '2'会将操作符左侧的54类型变为string类型，Symbol再执行这类的操作的时候会触发runtime error
// Symbol类型再逻辑操作符中能够发挥作用，被认为时真值
// uid3 + 2;  // Cannot convert a Symbol value to a number
// uid3 + ''  // Cannot convert a Symbol value to a string
console.log(!uid3); // false


// Symbol类型类是js中的接口，es6用Symbol定义了一些对象默认接口和表现行为
// js的字符串中有一些函数可以让你匹配正则，es6将这个接口暴露出来
// 任何函数（尤其是字符串的函数），接收一个正则表达式，都可以用hasLengthOf10 Object来代替这个正则表达式
var hasLengthOf10 = {
    [Symbol.match](value) {
        return value.length === 10 ? [value] : null;
    },
    [Symbol.replace](value, replacement) {
        return value.length === 10 ? replacement : value;
    },
    [Symbol.search](value) {
        return value.length === 10 ? 0 : -1;
    },
    [Symbol.split](value) {
        return value.length === 10 ? ['', ''] : [value];
    }
}

var message1 = 'Hello world';
var message2 = 'Hello John';
console.log(message1.match(hasLengthOf10), message2.match(hasLengthOf10)); // null '['Hello John']'
console.log(message1.replace(hasLengthOf10, 'Howdy'), message2.replace(hasLengthOf10, 'Howdy')); // 'Hello world' 'Howdy'


// js的基础类型在参与运算的时候经常发生装箱和拆箱的操作，es6通过Symbol.toPrimitive接口将这一行为暴露出来
function Temperature(degrees) {
    this.degrees = degrees;
}
/* 
hint准却来讲是enum类型的参数，取值为string、number、default三中类型之一(hint是由js引擎提供的)
number：
1、调用valueOf方法，如果是原始类型值，直接返回
2、调用toString方法，如果是原始类型值，返回
3、否则，抛出一个错误
string：
1、调用toString方法，如果是原始类型值，返回
2、调用valueOf方法，如果是原始类型值，直接返回
3、否则，抛出一个错误
default：
等同于number类型（Date类型的default类型等同于string类型）
 */
Temperature.prototype[Symbol.toPrimitive] = function(hint) {
    switch(hint) {
        case 'string':
            return this.degrees + '\u00b0';
        case 'number':
            return this.degrees;
        case 'default':
            return this.degrees + 'degrees';
    }
}
var freezing = new Temperature(32);
console.log(freezing + '!'); //32degrees!
console.log(freezing / 2); //16
console.log(String(freezing)); //32°



// iframe有自己的全局作用域 当变量在iframe和本地进行传递的时候，用instanceof来判断变量类型是不准确的
// Object.prototype.toString.call()方法能够明确地指出变量的类型是什么
// es6增加了Symbol.toStringTag属性来帮助开发者判断变量的类型
function Person(name) {
    this.name = name;
}

Person.prototype[Symbol.toStringTag] = 'Person';
var me = new Person('Nichilas');
console.log(me.toString(), Object.prototype.toString.call(me)); // [object Person] [object Person]


// 用户自定义的属性可以是Array，没有限制，会引发类型混淆；
// 同时也能够定义原生类型的toStringTag属性
// 这表明了在es6模式下，用Object.prototype.toString.call(...)来判断变量的类型是不准确的
function Person(name) {
    this.name = name;
}

Person.prototype[Symbol.toStringTag] = 'Array';
var me = new Person('Nichilas');
console.log(Object.prototype.toString.call(me)); // [object Array]

Array.prototype[Symbol.toStringTag] = 'Magic';
console.log(Object.prototype.toString.call([])); // [object Magic]
