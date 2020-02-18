// es6的class实际上标准化了es5常见class的方式
// class是一等公民，可以当作参数传递或者返回

/* 
1、class声明不会发生hoist，行为类似于let声明，存在暂时性死区
2、class内部的代码自动运行在strict模式下
3、类内部所有的方法都是non-enumerable的
4、类内部所有的方法都缺少[[constructor]]方法，不能用new操作符来调用
5、类只能有new操作符来调用，不能当作普通的函数来调用
6、在类内部方法中overwrite类名称会抛出错误 
*/

// 类可以当做expression使用，在当做expression使用的前提下
// 类如果存在名字，该名字只能在类的内部进行使用，不能在类外部使用
// js 解释器没有对personClass2在本地进行名称绑定，而是绑定在了类的内部
var personClass = class personClass2 {
    constructor(name) {
        this.name = name;
    }
    sayName() {
        console.log(this.name);
        console.log(personClass2);
    }
};
console.log(typeof personClass); // function
console.log(typeof personClass2); // undefined
var p = new personClass('yu');
p.sayName(); // yu [Function: personClass2]

// class的get、set方法(方法计算属性)
let propertyName = 'html';
class CustomerHTMLElement {
    constructor(ele) {
        this.element = ele;
    }

    // 不仅类的方法名可以用计算方法名 甚至get、set属性也能用Computed Member Name
    get [propertyName]() {
        return this.element.innerHTML;
    }

    set [propertyName](value) {
        this.element.innerHTML = value;
    }
}

// statci Members
// es5 way
function PersonType(name) {
    this.name = name;
}
// static method 可以直接通过PersonType（类）进行引用
PersonType.create = function(name) {
    return new PersonType(name);
};
// instance method
PersonType.prototype.sayName = function() {
    console.log(this.name);
};

// es6 way
class PersonType2 {
    constructor(name) {
        this.name = name;
    }
    // equivalent of PersonType.prototype.sayName
    sayName() {
        console.log(this.name);
    }
    // equivalent of PersonType.create
    static create(name) {
        return new PersonType2(name);
    }
}

// 继承方式

// es5
function Ractangle(length, width) {
    this.length = length;
    this.width = width;
}

Ractangle.prototype.getArea = function() {
    return this.length * this.width;
};

function Square(length) {
    Ractangle.call(this, length, length);
}

Square.prototype = Object.create(Ractangle.prototype, {
    constructor: {
        value: Square,
        enumerabel: false,
        writeble: true,
        configurable: true,
    },
});

var square = new Square(3);
console.log(
    square.getArea(),
    square instanceof Square,
    square instanceof Ractangle,
); // 9 true true

//es6
class Ractangle1 {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }

    getArea() {
        return this.length * this.width;
    }
}

/* 
1、子类能够覆盖父类的方法（子类的getArea方法覆盖父类）
2、子类能够继承父类的静态方法 
3、extends继承关键字能够用在expression（expression是一个function并且存在[[Constructor]]方法即可）
es6类型的类能够继承es5风格的函数
*/
class Square1 extends Ractangle1 {
    constructor(length) {
        // same as Ractangle.call(this, length, length)
        super(length, length);
    }
}

// es6风格实现mixin继承
let SerializableMixin = {
    serialize() {
        return JSON.stringify(this);
    },
};

let AreaMixin = {
    getArea() {
        return this.length * this.width;
    },
};

function mixin(...mixins) {
    let base = function() {};
    Object.assign(base.prototype, ...mixins);
    return base;
}

class Square2 extends mixin(AreaMixin, SerializableMixin) {
    constructor(length) {
        super();
        this.length = length;
        this.width = length;
    }
}

let x = new Square2(3);
console.log(x.getArea(), x.serialize()); // 9 {"length":3,"width":3}

// 利用new.target来创建抽象类（不能被实例化）
// class类只能通过new操作符来调用，所以在constructor内部，new.target永远部位undefined
// example demo
class Ractangle3 {
    constructor(length, width) {
        this.width = width;
        this.length = length;
        console.log(new.target, new.target === Square3);
    }
}

class Square3 extends Ractangle3 {
    constructor(length) {
        super(length, length);
    }
}

let objSqaure = new Square3(3); // [Function: Square3] true

// shape是一个抽象类
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('This class cannot be instantiated directly!');
        }
    }
}
