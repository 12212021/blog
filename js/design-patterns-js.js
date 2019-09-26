// 设计模式本身是为了代码复用
// 设计模式的核心思想在于”将代码中经常发生变化的部分和不经常发生变化的部分进行分离“

// 1、单例模式
// 保证一个类只有一个实例，并提供一个访问改实例的全局访问点
// 在js下面更像是保证一个函数只调用一次，保存了函数返回的对象
function singleton(fn) {
    let instance = null;
    return function() {
        if (instance) {
            return instance;
        } else {
            instance = fn.call(this, arguments);
            return instance;
        }
    };
}

// 2、策略模式
// 定义一系列的算法，把它们一个个封装起来，并且使它们可以项目替换
// js中策略模式几乎是隐形的，因为js能够将函数当作变量进行传递

// 设计一个计算员工工资的函数，逻辑为绩效考核等级*工资基数
function calculateBonus(func, salary) {
    return func(salary);
}

var S = function(salary) {
    return salary * 4;
};
var A = function(salary) {
    return salary * 3;
};
var B = function(salary) {
    return salary * 2;
};

calculateBonus(S, 20000);


// 3、代理模式
// 当客户端不方便或者不能访问一个对象的时候，提供一个代理对象来控制对这个对象的访问
// 代理模式的意义：单一职责原则
// 就一个类而言（通常也包括了函数和对象等），应该仅有一个引起它变化原因
// 在这种情况下，代理对象通常能够获取到一些“额外的”信息，知道什么时候去真正的访问被代理对象


// 小明给A送花表白，当A心情好的时候成功的概率比较高，当A新心情不好的时候概率几乎为0
// 由于小明跟A不是很熟悉，所以委托A的好朋友B进行送花这个操作，这就是代理模式