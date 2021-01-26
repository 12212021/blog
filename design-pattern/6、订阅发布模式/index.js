/* 
订阅发布模式：定义了对象之间一对多的依赖关系，当一个对象的状态发生改变的时候，所有依赖它的对象都收到通知

现实中订阅发布模式：js回调函数、dom的事件订阅机制

优点：
1、能够实现空间和时间的解耦
缺点：
1、创建订阅者本身需要消耗内存，有可能app在整个生命周期内都没有消息来通知该订阅者
2、该模式弱化了对象和对象之间的联系，过度使用，对象和对象之间必要的联系会被深埋，不利于debug，也不利于代码维护
*/
class Event {
    constructor() {
        this.queue = {};
    }
    listen(key, fn) {
        const listeners = this.queue[key];
        if (!listeners) {
            this.queue[key] = [];
            this.queue[key].push(fn);
            return;
        }
        console.log(listeners, 'lis');
        if (!listeners.includes(fn)) {
            this.queue[key].push(fn);
            return;
        }
    }
    trigger() {
        let args = Array.from(arguments);
        const key = args.shift();
        const listeners = this.queue[key];
        if (!listeners) {
            return;
        }
        listeners.forEach(fn => {
            fn.apply(null, args);
        });
    }
    remove(key, fn) {
        const listeners = this.queue[key];
        if (!listeners) {
            throw new Error(`type ${key} don't have function named ${fn.name}`);
        }
        if (!listeners.includes(fn)) {
            throw new Error(`type ${key} don't have function named ${fn.name}`);
        }
        this.queue[key] = this.queue[key].filter(func => func !== fn);
        return;
    }
}

const event = new Event();
function logger(time, name) {
    console.log(time, name);
}
function logger2(time, name) {
    console.log(time, name);
}
event.listen('logger', logger);
event.listen('logger', logger2);
event.trigger('logger', new Date(), logger.name);
