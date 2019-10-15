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





// 4、迭代器模式
// 程序提供了一种接口API供用户按照某种次序访问集合中的每一个元素
// 一般而言，你要数据data支持index下表取值，length属性，我们就能很方便的实现迭代器

// 内部迭代器：迭代的方式已经写死了
function each(ary, callback) {
    for (let i = 0; i < ary.length; i++) {
        callback.call(ary[i], i, ary[i]);
    }
}

// 外部迭代器：需要用户显示地请求迭代器中的下一个元素，使用的场景更加灵活
// 但是迭代调用的方式显的繁琐一些
var iterator = function(obj) {
    var current = 0;
    var next = () => (current += 1);
    var isDone = () => current === obj.length;
    var getCurrentItem = () => obj[current];
    return {
        next,
        isDone,
        getCurrentItem,
        length: obj.length
    }
};


// 下面是两个利用内部迭代器和外部迭代器来比较两个数组是不是相同
const compare1 = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    each(arr1, (index, item) => {
        if (item !== arr2[index]) {
            return false;
        }
    });
    return true;
}
const compare2 = (iterator1, iterator2) => {
    if (iterator1.length !== iterator2.length) {
        return false;
    }
    while(!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
            return false;
        }
        iterator1.next();
        iterator2.next();
    }
    return true;
}

// 发布订阅者模式（观察者模式） nodejs中的event事件就能够实现
// 发布订阅模式描述了对象之间一对一或者一对多的关系
// 优点：减少了对象之间在空间和对象上面的耦合；缺点：一旦订阅了事件，即使事件从头到尾都没有触发，事件处理程序还是占用了一定的内存
const event = {
    clientList= {},
    // key主要是为了甄别事件类型，确保相关的回调函数只在特定的事件类型触发情况下回调执行
    listen(key, fn) {
        if (this.clientList[key]) {
            this.clientList.key.push(fn);
        } else {
            this.clientList.key = [];
        }
    },
    trigger(...args) {
        const key = args[0];
        const fns = this.clientList.key;
        if (fns && fns.length !== 0) {
            fns.forEach(fn => {
                fn.apply(this, args);
            })
        }
    },
    remove(key, fn) {
        const fns = this.clientList.key;
        if (!fns || fns.length === 0) {
            return false;
        }
        if (!fn) {
            this.clientList.key = [];
        } else {
            this.clientList.key = this.clientList.key.filter(callback => callback !== fn);
        }
        return true;
    }
}