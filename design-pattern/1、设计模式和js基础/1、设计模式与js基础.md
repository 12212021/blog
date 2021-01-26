### 基础概念

#### 设计模式的定义

设计模式：在**面向对象软件设计过程中**针对**特定问题**简单而优雅的解决方式

#### 设计模式的遵循的原则

找出程序中变化的部分和不变的部分，并将变化封装起来

#### 鸭子类型（duck typing）

鸭子类型关注对象的行为，而不是对象本身，换句话说关注 HAS-A，不关注 IS-A

鸭子类型的示例

```js
const duck = {
    duckSinging() {
        console.log('gaga');
    }
};
const chicken = {
    duckSinging() {
        console.log('gaga');
    }
};

// 合唱团需要的是能发出gaga叫声的动物，不一定非要是鸭子
let choir = [];
function joinChoir(animal) {
    if (animal && typeof animal.duckSinging === 'function') {
        choir.push(animal);
    }
}

// 关注对象的行为，而不关注对象本身
joinChoir(duck);
joinChoir(chicken);
```

#### 多态

定义：同一个消息或者操作，作用到不同的对象上，可以产生不同的解释和不同的执行结果

思想：多态的思想是将“做什么”和“谁去做以及怎样去做”这两个事情分离开来。

多态的根本作用：把过程话的 if-else 分支语句转化为对象的多态性，从而消除这些分支

js 多态示例

```js
function makeSound(animal) {
    if (animal && typeof animal.sound === 'function') {
        animal.sound();
    }
}

const duck = {
    name: 'duck',
    sound() {
        console.log(`${this.name} sounds`);
    }
};

const chicken = {
    name: 'chicken',
    sound() {
        console.log(`${this.name} sounds`);
    }
};

makeSound(duck);
makeSound(chicken);
/* 
js没有类型约束，所以可以比较方便地实现多态，对于静态类型语言，
由于存在类型限制，所以“向上转型”来实现多态
*/
```

```java
public class Duck {
    public void makeSound() {
        Sysrem.out.printLn('gaga');
    }
}

public class Chicken {
    public void makeSound() {
        System.out.printLn('gege');
    }
}

public class AnimalSound {
    public void makeSound(Duck duck) {
        duck.makeSound();
    }
}

public class Test {
    public static void main(String args[]) {
        AnimalSound animalSound = new AnimalSound();
        Duck duck = new Duck();
        // 这一行是ok的，类型能匹配上
        animalSound(duck);


        Chicken chicken = new Chicken();
        // 这行编译会报错，类型检查失败
        animalSound(chicken);
    }
}

/*
享受静态语言类型检查带来的安全性的时候，同时也被束缚
静态语言为了实现多态，通常有两种方法来实现“向上转型”
1、静态基类，继承实现多态
2、接口implement，关注对象的行为，而不是对象本身
 */

```

#### 封装

-   数据封装（private、public、protect 等数据封装标识符）
-   封装类型，用基类或者接口的方式将类型隐藏，主要用于静态类型语言
-   封装实现，将对象内部的实现细节封装起来，对于外部而言，对象是透明的，对象对自己的行为负责
-   封装变化，将变化与不变化的部分分隔，这个是设计模式介入的部分

#### js 原型链

js 遵循的原型编程要点

-   所有的数据都是对象
-   要得到一个对象，不是去实例化它，而是找到一个对象，并以这个对象为原型，进行克隆
-   对象会记住它的原型对象
-   如果对象对某个请求无法响应，就会将改请求委托给它的原型对象
-   js 的根对象是 Object.prototype 对象

```js
function Person(name) {
    this.name = name;
}

Person.prototype.getName = function () {
    return this.name;
};

// 就是new的实现
const objectFactory = function () {
    const obj = {};
    let contructor = [].shift.call(arguments);
    Object.setPrototypeOf(obj, contructor.prototype);
    const ret = contructor.apply(obj, arguments);

    // console.log(ret, obj);
    return typeof ret === 'object' ? ret : obj;
};

let a = objectFactory(Person, 'seven');
console.log(a.name); // seven
console.log(a.getName()); // seven
console.log(Object.getPrototypeOf(a) === Person.prototype); // true
```

Object 的 prototype 对象和 contructor 的 prototype 属性区别

-   Object 的 prototype 属性，通过 Object.getPrototypeOf(object)或者**废弃的**proto\*\*\*\*属性获取
-   prototype 属性只挂在**contructor 函数上**
-   Object.getPrototypeOf(new Foobar())就指向了 Foobar.prototype 属性

#### js 中的 this

js 中 this 不是静态绑定，是**运行中动态进行绑定**，js 中 this 的指向遵从下面几条原则（**this 只能在函数或者方法内部访问**）

-   通过对象方法进行调用，则 this 指向该对象
-   普通函数调用，非严格模式下，指向全局 window 对象，严格模式下为 undefined
-   在构造器函数内部调用，构造器函数总是会默认返回一个对象，this 默认指向该对象，如果构造器函数**显式的返回一个对象**，则构造器函数返回该对象，而不是 this 指向的对象
-   通过 call、apply、bind 进行调用，this 指向了函数的参数

#### call、apply、bind

-   call 可以有多个参数，apply 只接受两个参数（1、this 指向的对象；2、参数列表 arguments）
-   call 和 apply 可以借用其他对象的方法

```js
// 通过apply来实现bind函数
Function.prototype.bind = function (context) {
    // 这里的this指向了sayName这个函数
    const self = this;
    return function () {
        return self.apply(context, arguments);
    };
};

function sayName() {
    console.log(this.name);
}

var obj = {
    name: 'yuchi'
};

const a = sayName.bind1(obj);
a();
```

#### 闭包

闭包涉及到两个问题

1、变量的作用域：函数可以创建变量作用域，函数创建了一层半透明的毛玻璃，函数内部可以访问外部变量，但是外部无法访问函数内部变量

2、变量的生存周期：函数内部变量会随着函数访问结束而释放，但是闭包能延长这个变量的生命周期

#### 高阶函数

高阶函数需要满足下面的条件：

-   函数能够作为参数来传递
-   函数能够作为返回值

##### 高阶函数实现 AOP

```js
Function.prototype.before = function (fn) {
    const __self = this;
    return function () {
        fn.apply(this, arguments);
        return __self.apply(this, arguments);
    };
};

Function.prototype.after = function (fn) {
    const __self = this;
    return function () {
        const ret = __self.apply(this, arguments);
        fn.apply(this, arguments);
        return ret;
    };
};

let func = function () {
    console.log(2);
};

func = func
    .before(function () {
        console.log(1);
    })
    .after(function () {
        console.log(3);
    });

func();
```

##### curring

```js
function curring(fn) {
    let args = [];
    const curriedFunc = function () {
        if (arguments.length === 0) {
            return fn.apply(null, args);
        }
        [].push.apply(args, arguments);
        return curriedFunc;
    };
    return curriedFunc;
}

let cost = function () {
    var money = 0;
    for (let index = 0; index < arguments.length; index++) {
        money += arguments[index];
    }
    return money;
};
cost = curring(cost);
cost(100);
cost(200);
cost(300);
const money = cost();
console.log(money);
```

curring 成为部分求值，会接受一部分参数，但是并不求值，而是存储在闭包中，返回另外一个函数，等到真正需要求值的时候，一次性地计算所有的值

##### 防抖函数

debounce：在事件触发 n 秒之后才执行函数，如果在这期间又触发，则开始重新计时

```js
function debounce(fn, interval = 200) {
    const __self = fn;
    let timer = null;
    return function () {
        const __me = this;
        if (timer) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                __self.apply(__me, arguments);
            }, interval);
        }
    };
}
```

##### 节流函数

throttle：将即将被执行的函数延迟一段时间执行，如果该函数还没有执行完成，忽略所有接下来的函数调用

```js
function throttle(fn, interval = 500) {
    const __self = fn;
    let isFirst = true;
    let timer = null;

    return function () {
        const __me = this;
        // 第一次执行不用延迟
        if (isFirst) {
            __self.apply(__me, arguments);
            isFirst = false;
        }
        // 如果延时器有值，代表函数正在延迟执行过程中
        if (timer) {
            return false;
        }
        timer = setTimeout(() => {
            timer = null;
            __self.apply(__me, arguments);
        }, interval);
    };
}
```
