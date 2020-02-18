// 1、prop和value同名，可以简写
function createPerson(name, age) {
    return {
        name,
        age
    }
    /*  
    // es5 old fasion
    return {
        name: name,
        age: age
    } */
}


// 2、方法简写
var person = {
    name: 'Ni',
    sayName() {
        console.log(this.name);
    }
    /* 
    // es5 old fasion
    sayName: function() {
        console.log(this.name);
    } */
}



// 3、方括号计算属性
var person = {'first name': 'Ni'}
console.log(person['first name']); // person.first name会报错



// 4、Object.is 比较两个值是否相等（1、两个值有一样的类型；2、两个值的值是相等的）
// 基本上该方法和===作用一样，但是存在一个不同的地方
console.log(+0 === -0); //true （+0、-0在js engine中的表示类型其实是不同的）
console.log(Object.is(+0, -0)); //false
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true



// 5、Object.assign method（会将源对象中所有的可枚举属性都复制到目标对象）
// assgin方法其实就js中常见的mixin继承的实现，大致的实现如下
function mixin(receiver, supplier) {
    Object.keys(supplier).forEach(key => {
        receiver[key] = supplier[key];
    })
}
// assgin不会复制getter、setter函数，但是在赋值的过程中会触发getter、setter函数
var target = {
    number: [],
    set num(val) {
        this.number.push(val);
    },
    get numbers() {
        return this.number;
    }
}

var source = {
    tag: 'source',
    num : 2,
    get tagName() {
        return this.tag;
    },
    set tagName(val) {
        this.tag = val;
    }
}

console.log(Object.assign(target, source));
/*
assgin将source属性的get属性赋值为target的普通属性，当target有setter函数时，
assgin将source中同名的property通过setter函数赋值。
{
    number: [ 2 ],
    num: [Setter],
    numbers: [Getter],
    tag: 'source',
    tagName: 'source'
} 
*/




// 6、es6在原型继承上的工作
// Object.getPrototypeOf 获取一个对象的原型
// Object.setPrototypeOf 设置一个对象的原型

// 普通的原型继承case
var person = {
    getGretting() {
        return 'hello';
    }
}

var dog = {
    getGretting() {
        return 'woof';
    }
}

var friend = {
    getGretting() {
        return Object.getPrototypeOf(this).getGretting.call(this) + ', hi';
    }
}

Object.setPrototypeOf(friend, person);
console.log(friend.getGretting());


// Friend中getGretting方法调用原型链上的方法，实现非常繁琐，es6提供了super关键字，指向其原型

var friend = {
    getGretting() {
        // super自动指向原型，绑定当前对象的this
        // super关键必须使用在间接谢发的method中
        // getGretting: function() {} 这种写法中super不起作用
        return super.getGretting() + ', hi';
    }
}


var relative = Object.create(friend);
/* 
采用super关键字实现集成，能够成功运行出结果，woof, hi，super关键字永远指向了dog
getGretting（只有对象方法才存在这个属性，函数不存在这个属性）存在一个内部属性[[HomeObject]]指向了friend
super.getGretting实际上等同于 Object.getPrototypeOf([[HomeObject]]).getGretting.call(this)
 */

/* 
采用 "Object.getPrototypeOf(this).getGretting.call(this) + ', hi';"来实现，会出现
Maximum call stack size exceeded的错误，是因为set、get的动态性，relative的原型指向friend，
该函数中this又指向了friend，造成无限递归栈溢出
 */

Object.setPrototypeOf(friend, dog);
console.log(relative.getGretting());


// 7 对象中的可枚举属性 遍历对象的手段
var funcSymbol = Symbol();
var attrSymbol = Symbol();
var obj = {
    id: 'testObj',
    [attrSymbol]: '2',
    say() {
        console.log(this.id);
    },
    [funcSymbol]() {
        console.log('inner');
    }
}
Object.getPrototypeOf(obj).sayName = () => {
    console.log('prototype say name');
}
Object.defineProperty(obj, 'name', {
    writable: true,
    enumerable: false
});

console.log(Object.getOwnPropertyDescriptor(obj, attrSymbol));
// { value: '2', writable: true, enumerable: true, configurable: true } 
// Symbol属性是可以枚举的，但是大部分操作都没有办法枚举到Symbol属性

// 如何遍历对象上面的属性
for (var attr in obj) {
    console.log(attr); 
    /* 
    id
    say
    sayName

    for...in能够遍历对象中所有的可枚举属性，但是一些原生的对象的（Array，Date）原型
    上面的属性是不能够被遍历的
    Symbol属性也是不能够被for...in枚举的
    */
}

console.log(Object.keys(obj)); // [ 'id', 'say']
// 能够遍历自身上所有的可枚举属性，但是不包括原型链上的属性（不包含继承的属性）和Symbol属性

console.log(JSON.stringify(obj)); // {"id":"testObj"}
// JSON.stringify能够JSON化自身的可枚举属性，不包括继承的，也不包含函数和Symbol属性

console.log(Object.getOwnPropertyNames(obj)); // [ 'id', 'say', 'name' ]
// 不包括Symbol属性和原型链上属性，但是包含自身不可以枚举的属性

console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(), Symbol() ]
// 返回对象自身所有的Symbol属性

console.log(Reflect.ownKeys(obj)); // [ 'id', 'say', 'name', Symbol(), Symbol() ]
// 返回自身所有的属性（可枚举、不可枚举、Symbol），但是不包含原型链上面的属性

class Foo {
    constructor () {
        this.name = 'yu';
        this.age = 90;
    }
    sayName() {
        console.log(this.name);
    }
    sayAge() {
        console.log(this.age);
    }
}
var foo = new Foo();
console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(foo), 'sayName')); 
/* 
{
  value: [Function: sayName],
  writable: true,
  enumerable: false,
  configurable: true
}
*/
console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(foo), 'sayAge')); 
/* 
{
  value: [Function: sayAge],
  writable: true,
  enumerable: false,
  configurable: true
}
*/
console.log(Object.keys(foo)); // ['name', 'age']
// class定义的方法都对方在对象的原型链上，但是是不可以枚举的