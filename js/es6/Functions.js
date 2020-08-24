// 1、Functions with Default Values

// es5
function makeRequest(url, timeout, callback) {
    /* 
    当timeout参数的值为falsy的时候，取2000 
    flaw:放timeout是0的时候，会被当做falsy来处理 
    */
    // falsy：'', false、null、undefined、NaN、0 其余均被当做true来处理
    timeout = timeout || 2000;
    callback = callback || function() {};
    // the rest of the function
}

//es5 revolution
function makeRequest(url, timeout, callback) {
    timeout = typeof timeout !== undefined ? timeout : 2000;
    callback = typeof callback !== undefined ? callback : function() {};
}

//es6
// 默认参数的本质：当传入的参数为undefined（明显传入undefined或者不传参数），用默认参数来代替
// 类似于上面的es5进化版本
function makeRequest(url, timeout = 2000, callback = function() {}) {
    // the rest of the function
}

function makeRequest(url, timeout = 2000, callback) {
    // the rest of the function
}

// use default timeout
makeRequest('/foo', undefined, function(body) {});
makeRequest('/foo');
//doesn't use default timeout(null is valid parameter)
makeRequest('/foo', null, function() {});

// arguments对象总是能『实时』反应函数的参数状态（es5）
function mixArgs(first, second) {
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    first = 'c';
    second = 'd';
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    /*  
    output:
    true
    true
    true
    true 
    */
}

// use strict能够禁用这种动态性
function mixArgs(first, second) {
    'use strict';
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    first = 'c';
    second = 'd';
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    /*  
    output:
    true
    true
    false
    false
    */
}

// es6中使用默认参数，应该会自动启用 "use strict"
// 在这种情况下，arguments对象反映了函数被调用时候的参数快照
function mixArgs(first, second = 'b') {
    // lenght的长度反映了实际传入的参数个数
    console.log(arguments.length);

    console.log(first === arguments[0]);
    //第二个参数是  second => 'b'   arguments[1] => undefined
    console.log(second === arguments[1]);
    first = 'c';
    second = 'd';
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    /*  
    output:
    1
    true
    false
    false
    false
     */
}

// es6中function传入一个默认expression表达式
// 如下，当add执行的时候，getVal函数才会被调用
const getVal = (val = 2) => val + 2;
// 默认参数是函数的时候一定要进行调用
function add(first, second = getVal()) {
    return first + second;
}
// console.log(add(1, 1)); // 2
// console.log(add(1)); // 6

function add(first, second = getVal(first)) {
    return first + second;
}
/* 
// 在调用的时候（有默认参数时）类似于下面在的代码
let first;
let second = getVal(first);
 */
// console.log(add(1)); // 4

function add(first = second, second) {
    return first + second;
}
// console.log(add(undefined, 2)); //ReferenceError: Cannot access 'second' before initialization
/* 
// 当函数调用的时候，类似于下面的代码,会触发暂时性死区
let first = second;
let second;
 */









//  2 working with Unnamed parameters
// Reset parameters（其余参数）
// 将所有的参数都打包到keys（数组），同时函数明确地指出它接收多个参数
function pick(obj, ...keys) {
    let result = Object.create(null);
    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = obj[keys[i]];
    }
}
// 其余参数的限制
// 1、其余参数只能有一个且必须是函数的最后一个参数
// 2、Object的set函数不能使用其余参数，set函数语义上接受一个参数，而其余参数于以上接受无限个参数
// 3、注：函数的length属性（函数接受多少个命名参数，像上面的pick函数，pick.length是1）

// 扩展运算发
Math.max(1, 2); // 2
Math.max([1, 2, 3, 4]); //NaN Math函数不接受一个数组作为参数
// es5
Math.max.apply(Math, [1, 2, 3, 4]); // apply接受参数作为数组
// es6 
Math.max(...[1, 2, 3, 4], 0) // 参数为1，2，3，4，0









/* 
3、函数的name属性
函数内部存在一个name属性，用来表示函数的名字，为错误栈提供可读性
 */
function doSometing() {} // doSomething
// let doAntherThing = function() {} // doAntherThing
// let doSometing = function doSomethingElse() {} // doSomethingElse
// get、set方法必须用Object.getOwnPropertyDescriptor来调用，get前缀get、set前缀set

// special case
let bindDoSometing = doSometing.bind(null); // bound bindDoSometing(bind函数前缀bound)
let anonymous = new Function(); // anonymous 用Function的构造函数创建的function name是anonymous





// 4、函数的new target属性
/* 
es5中，函数既可以作为函数调用，又能通过new当过构造器来调用，当函数作为构造器使用的时候，[[constructor]]方法执行
当函数作为一个普通函数进行调用的时候，[[call]]方法会执行
new.target属性是为undefined当函数不作为构造器进行调用的时候，当函数作为构造器调用的时候，new.target为this
 */





//  5、块级作用域内的函数
// "use strict"
if (true) {
    // es5 throw error在"use strict'指令下
    function doSomething() {};
}

// "use strict"
if (true) {
    // 在"use strict'指令下function声明会提升到块级作用域的顶部（类比var）
    // 如果没有"use strict'指令，函数会提升到全局的作用域（模块、脚本、函数作用域的顶部）
    console.log(typeof doSomething); //function
    function doSomething() {};
    doSomething();
}






// 6、箭头函数
/* 
(1)、没有this、super、arguments、new.target绑定，这些值都是包含箭头函数的普通函数的的值
(2)、不能被new操作符调用
(3)、不能被call、apply、bind改变this的指向（动态改变包含箭头函数的普通函数的this指向，就能改变箭头函数中的this指向）
(4)、没有prototype
(5)、没有arguments object
(6)、不能有重复的命名参数
(7)、箭头函数的this总是指向外层函数this，如果外层函数的this是箭头函数，则指向再外层，直到最后外层是window或者普通函数，箭头函数是词法作用域，参数不算在在函数体内部
  */
 
 
let test = {
     name: 'source',
     say() {
         let innerSay = () => {
             console.log(this.name);
         }
         innerSay();
     }
}
let test2 = {
     name: 'target'
}
test2.say = test.say;
test.say(); // source
test2.say(); //target
// 尽量不要在箭头函数中访问上述的属性




// 7、尾递归优化
// es6进行了尾递归优化，前提是必须有"use strict"指令
/* 
当函数满足下面三个条件的时候，尾递归optimized
(1)、尾部调用的函数不引用当前栈内变量（尾部调用的函数不是闭包）
(2)、函数不能对尾部调用的函数的返回值进行处理，比方说加减乘除灯操作
(3)、尾部调用函数的返回值必须作为当前函数的返回值 
*/