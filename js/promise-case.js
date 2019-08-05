/* 
Promise的一些缺点
1、不是惰性执行的
2、不能取消
3、不成同步
4、then()函数是map和flatMap的mix 
*/

// 1、不是惰性执行
function fn(resolve, reject) {
    console.log('Hello');
}
console.log('before');
const promise = new Promise(fn);
console.log('after');
// 对于非惰性执行的补丁
console.log('after');
const promiseGetter = () => new Promise(fn);
console.log('after');
// 因为函数是惰性执行的，所以，用函数来返回一个Promise自然也就是惰性执行的了

// 如果原生的Promise执行惰性执行的话，我们可以像下面的例子一样使用Promise
const getUserAge = betterFetch('https://my.api.lol/user/295712')
    .then(res => res.json())
    .then(user => user.age);
getUserAge.run(cb);

// 但是现在只能采用Promise Getter的方式来获取数据
//这个是Promise Getter
function getUserAge() {
    // fetch函数也是Promise Getter
    return fetch('https://my.api.lol/user/295712')
        .then(res => res.json())
        .then(user => user.age);
}




// 2、Promise不能取消
// Promise不能取消是因为它不是惰性执行的
var promiseA = someAsyncFn();
var promiseB = promiseA.then(/*  */);
// 这种情况下，call promiseB.cancel(),promiseA自然可以取消
var promiseA = someAsyncFn();
var promiseB = promiseA.then(/* ... */);
var promiseC = promiseA.then(/* ... */);
/* 
这种情况下，call promiseB.cancel(),promiseA不知道能不能取消，
因为promiseC还依赖于promiseA。一种解决方法是采用引用计数，但是你也只能采用引用计数
的方法来取消promise。
 */

 var execution = promise.run();
 execution.cancel();
 /* 
 如果promise是惰性执行的，那么每一个promise chain都有自己的独立的副本，
 最下游取消直接取消最上游的promise，因为副本的原因（类比函数的多次执行），并不用
 担心其他下游（依赖相同上游，类比上面PromiseA、B、C例子）的上游取消。
 如果想让几个下游共享一个上游的话，可以对上游进行share配置（eager版本promise取消）。
 综上，你既可以使用引用计数也可以不使用，灵活性比较大。
 */





//  3、promise能够把同步的代码变为异步的，但是变不回来。
console.log('before');
Promise.resolve(42).then(x => console.log(x));
console.log('after');

// callback既能执行同步的代码又能执行异步代码
console.log('before');
[42].forEach(x => console.log(x));
console.log('after');


// 4、then函数是map和flatMap的mix,then函数会自动将returned value转化为Promise，
// 下面的两个例子是等价的
Promise.resolve(2).then(x => x / 10);
Promise.resolve(2).then(x => Promise.resolve(x / 10));
/* 
Promise的then函数是够用的，但是可能还是希望添加一些类似于map、flatMap之类的函数来更
细粒度控制Promise，其实也是向函数式方向靠拢 
*/


