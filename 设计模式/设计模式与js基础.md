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
    },
};
const chicken = {
    duckSinging() {
        console.log('gaga');
    },
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
    },
};

const chicken = {
    name: 'chicken',
    sound() {
        console.log(`${this.name} sounds`);
    },
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

-   Object 的 prototype 属性，通过 Object.getPrototypeOf(object)或者**废弃的**proto****属性获取
-   prototype属性只挂在**contructor函数上**
-   Object.getPrototypeOf(new Foobar())就指向了Foobar.prototype属性
