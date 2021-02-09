/*
模板方法模式是非常依赖  抽象类、类继承的一种方法

抽象类：封装了子类的抽象算法，包括实现一些公共类的方法以及封装子类方法的执行顺序


好莱坞原则：底层组件将自己挂钩到高层组件，由高层组件来决定什么时候去调用
模板方法、发布-订阅模式、回调函数都是好莱坞原则的例子
*/

/*
case1

冲泡咖啡
1、把水煮沸
2、用沸水冲泡咖啡
3、把咖啡倒进杯子
4、加糖加牛奶

冲泡茶
1、把水煮沸
2、用沸水冲泡茶叶
3、把茶水倒进杯子
4、加柠檬
*/

class Beverage {
    boilWater() {
        console.log('把水煮沸');
    }

    brew() {
        throw new Error('子类必须重写改方法');
    }

    pourInCup() {}

    addCondiments() {}

    // 此为模板方法，规定了冲泡饮料的步骤
    init() {
        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();
    }
}

class Coffee extends Beverage {
    constructor() {
        super();
    }

    brew() {
        console.log('用沸水冲泡咖啡');
    }

    pourInCup() {
        console.log('把咖啡倒进杯子');
    }

    addCondiments() {
        console.log('加糖加牛奶');
    }
}

class Tea extends Beverage {
    constructor() {
        super();
    }
    brew() {
        console.log('用沸水冲泡咖啡');
    }

    pourInCup() {
        console.log('把咖啡倒进杯子');
    }

    addCondiments() {
        console.log('加糖加牛奶');
    }
}

/*
模板方法比较依赖静态语言的抽象类和静态类型检查机制
js没有相关的工具和脚手架，无法保证子类正确地实现了父类定义的抽象方法

针对此，有如下解决方案
1、用鸭子类型来检查相关的接口（直接上TS吧）    在编译的时候就能检查出问题
2、在抽象父类中，对这个方法直接抛出异常       在运行的时候才能够检查出问题
*/

/*
备注：子类也可能根本就不想被父类调用某些方法，这时候可以参考Vue、react等框架的生命周期钩子函数
提供灵活性
*/




/*
另外一种实现方法：通过高阶函数可以轻易实现
*/

const Beverage1 = function (params) {
    const boilWater = function () {
        console.log('把水煮沸');
    };

    const brew = params.brew || function () {};

    const pourInCup = params.pourInCup || function () {};

    const addCondiments = params.addCondiments || function () {};

    const F = function() {}
    F.prototype.init = function() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };
    return new F();
};

const coffee = {
    brew() {
        console.log('用沸水冲泡咖啡');
    },

    pourInCup() {
        console.log('把咖啡倒进杯子');
    },

    addCondiments() {
        console.log('加糖加牛奶');
    }
};

const tea = {
    brew() {
        console.log('用沸水冲泡咖啡');
    },

    pourInCup() {
        console.log('把咖啡倒进杯子');
    },

    addCondiments() {
        console.log('加糖加牛奶');
    }
};


function testTmeplateFunc() {
    const coffeeIns = Beverage1(coffee);
    console.log(coffeeIns);
    coffeeIns.init();
    const teaIns = Beverage1(tea);
    teaIns.init();
}

testTmeplateFunc();
