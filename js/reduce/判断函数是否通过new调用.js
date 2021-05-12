function foo() {
    // 普通调用 new.target为undefined；new调用该值为foo
    if (new.target) {
        console.log('call by new', new.target === foo)
    }

    // obj instanceof constructor
    if (this instanceof foo) {
        console.log('call by new')
    }

    // 查看对象的构造函数是否为该函数
    if (this.constructor === foo) {
        console.log('call by new')
    }
}

new foo();
