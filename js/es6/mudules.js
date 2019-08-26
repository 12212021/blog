// es6 modules和script的不同点
/* 
1、module自动运行在"use strict"模式下
2、module中的变量不会自动运行注入到global中，他们存储在top-level scope
3、只有在module中被显式export的变量才能够被别的代码引用
4、module可以从别的module import绑定
 */



//  basic Exporting
// 被export的变量、函数、类等都必须要有名字，除非采用export default的形式才能导出匿名函数（变量等）
// export data
export var color = 'red';
export let name = 'Nicholas';
export const magicNumber = 7;

// export function
export function sum(a, b) {
    return a + b;
}

// export class
export class Rectangel {
    constructor(length, width) {
        this.width = width;
        this.length = length;
    }
}

// this function is private to the module
function substract(a, b) {
    return a - b;
}

// define a function
function multiply(a, b) {
    return a * b;
}

// export multiply function
export {multiply}



// basic import
// 被import的变量就像在本定用const变量定义一样 不能进行另外的赋值
// 不论一个模块被import多少次，该模块只初始化一次

// 单个引入
import {sum} from './example.js';
// 多个引入
import {sum, multiply, magicNumber} from './example.js';
// import every thing
// namespace import example中所有的export code被打包在example object中
import * as example from './example.js';

export var name = 'Nicholas';
export function setName(newName) {
    name = newName
}

// 只有出自同一模块的函数才能改变这个模块中的变量
import {name, setName} from './example.js';
console.log(name); // Nicholas
setName('Greg');
console.log(name); // Greg

name = 'Nicholas'; // error 被import的变量不能改变


// rename 关键字as
function sum(a, b) {
    return a + b;
}
export {sum as add};

import {add as sum} from './example.js';



// export default 一个模块只能输出一个default
// default可以不需要名字 因为模块文件名代表了defaut变量
export default function(a, b) { 
    return a + b;
}

export {sum as default};

export default sum;

// 可以同时import default和非default类型的变量
import sum, {color} from './example.js';
import {default as sum, color} from './example.js';



// 一些模块可能不导出任何变量，仅仅在global scope上面做一些modify
Array.prototype.pushAll = function(items) {
    if (!Array.isArray(items)) {
        throw new Error('Argument must be array');
    }
    return this.push(...items);
}
import './example.js';