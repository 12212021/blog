// 1、var生命会在模块、脚本、函数这个三个作用域提升变量
function getValue(condition) {
    //实际上，val变量会hosting，相当于在函数的顶部声明了
    // var val;
    if (condition) {
        var val = 'blue';
        return val;
    } else {
        return null;
    }
}




// 2、let、const声明
// 存在块级作用域(在块级作用域外无法访问该变量)，但是不能重复声明
{
    let val;
    // SyntaxError: Identifier 'val' has already been declared
    // let val;
}

// 暂时性死区 实际上let、const也会进行变量提升（函数、模块、脚本、块级作用域）
// 但是在运行的时候会抛出一个runtime error（Cannot access 'val' before initialization）
{
    let val = 2;
    function test() {
        // Cannot access 'val' before initialization
        console.log(val);
        // let val;
    }
    test();
}



// function loops
var funcs = [];
for (var i = 0; i < 10; i++) {
    funcs.push(function() {
        console.log(i);
    });
}
// log 10 10times
// 原因：变量i在迭代的过程中是共享的（可以理解为一个引用），在迭代结束后自然输出10次10
funcs.forEach(fn => fn());

// IIFE（立即执行）
// 通过函数变量传参的方式，强迫对i1变量进行参数复制
var funcs1 = [];
for (var i1 = 0; i1 < 10; i1++) {
    funcs1.push(
        (val => {
            return () => console.log(val);
        })(i1),
    );
}
funcs1.forEach(fn => fn());


// let声明在每次迭代的过程中都会新建一个i变量
// 作用的方式类似于IIFE，但是更加清晰
var funcs2 = [];
for (let i = 0; i < 10; i++) {
    funcs2.push(() => console.log(i));
}
funcs2.forEach(fn => fn());




// 变量全局绑定
// var overwrite global variable
var RegExp = 'Hello';
console.log(window.RegExp) // Hello
//let const shadow global variable
let ntc = 'hi';
console.log(window.ntc === ntc) // false



// 最佳实践：用let、const代替var，在明确知道一个变量不应该发生变化的时候，用const声明代替var声明
