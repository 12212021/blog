/**
 * 装饰者模式主要为对象动态增加额外属性
 *
 * 装饰器主要是能够在不改变原函数功能的情况下，为函数增加新的功能，名字虽然叫装饰器，但是被称为wrapper更加合适
 * 装饰器模式可以为函数包上一层层的wrapper
 */

/*
比方说AOP模式，有以下case

所有的ajax请求需要额外增加Token参数，在ajax请求后要向后台报日志
*/

Function.prototype.before = function (beforeFn) {
    const self = this;
    return function (...args) {
        beforeFn.apply(this, args);
        self.apply(this, args);
    };
};

Function.prototype.after = function (afterFn) {
    const self = this;
    return function (...args) {
        self.apply(this, args);
        afterFn.apply(this, args);
    };
};

function ajaxRequest(params) {
    console.log(params, 'ajax finish');
}

const ajaxWrapper = ajaxRequest
    .before(function (...args) {
        const [params] = args;
        params.token = 'token';
        console.log('before function finish');
    })
    .after(function (...args) {
        console.log('log to serve');
    });

ajaxWrapper({
    name: 'yuchi',
    age: 12
});
