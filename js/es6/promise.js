/* 
js引擎是单线程工作的，每一时间只有一段代码被执行
在这种工作模式下，js引擎采用事件循环队列的方式来执行代码
while(there is code) {
    run(code)
} 
*/

var promiseExample = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok');
    }, 100);
});

promiseExample.then(res => {
    console.log(res);
    // at this point promise已经resolve了，所以将下面的resolve函数立即放入到微队列中
    promiseExample.then(res => console.log(res));
});

// 创建settled promise
// 立即执行，并不会向微队列中塞任务
// Promise.resolve();
// Promise.reject();

/*
Node.js Rejection handling and Browser Rejection handling
unhandledrejection rejectionhandled事件
 */


var p1 = new Promise((resolove, reject) => {
    resolove(42);
});

p1.then(val => {
    console.log(val); // 42
}).then(res => {
    console.log(res); // undefined 因为p1的then中没有显示返回Promise，默认返回：Promise.resolve('undefined')
    console.log('Finished'); // Finished
});


// 上面的代码等同于下面的代码
var p2 = p1.then(function(val) {
    console.log(val);
    // p2并没有显示地返回一个Promise
})

p2.then(function(res){
    console.log(res);
    console.log('Finished');
})
/* 
Promise中的executor铜过resolve、reject方法将结果返回给Promise的then、catch handler
在then、cathc中通过return这个值
1、值不是Promise  值被包含在原来的Promise（state => fulfilled）返回
2、值是Promise  原先的Promise被抛弃 A then函数之后的then函数处理的A中生成的Promise
 */

var p1 = new Promise((resolove, reject) => {
    setTimeout(() => {
        resolove(42);
    }, 200);
})

p1.then((res) => {
    console.log(res);
    return [1, 2,3,4]
    // let p2 = new Promise((resolove, reject) => {
    //     setTimeout(() => {
    //         resolove(45);
    //     }, 2000)
    // });
    // return p2;
}).then(res => console.log(res))
