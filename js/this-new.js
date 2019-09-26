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
实际上，对象将不存在的属性委托给他的原型这句话的说法有点准确，准确的说法是对象对于不存在的属性，将其
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

