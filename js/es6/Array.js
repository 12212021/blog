// create Array

// es5 way
var arr2 = [2, 3, 3, 4, 7, 8];
// Array的构造函数根据传入的参数的不同有不同的表现行为
var arr = new Array(5); // 5个empty 数组
var arr = new Array('2'); // ['2']
var arr = new Array(2, 3, 4, 5); // [2,3,4,5]




// es6 add way
// 大多数情况下都能被数组字面量创建数组的方式来替代，但是当作为参数传递给函数的时候，Array.of能发挥作用
var arr = Array.of(1); // [1]
var arr = Array.of(1, 2, 3, 4, 5); // [1,2,3,4,5]

// Array.from从ArrayLike的数据结构创建真正的数组，用来代替es5下面的一些方式
function makeArray(arrayLike) {
    let arr = [];
    for (let i = 0; i < arrayLike.length; i++) {
        arr.push(arrayLike[i]);
    }
    return arr;
}

function makeArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}

// var arr = Array.from(/* arrayLike */);

// map arrayLike类型的数据到数组
let helper = {
    diff: 1,
    add(num) {
        return num + this.diff;
    },
};

function translate(arrayLike) {
    return Array.from(
        arrayLike,
        /* callback function */ helper.add,
        /* which this */ helper,
    );
}
console.log(translate([2, 3, 4])); // [3, 4, 5]

// Array.from 从iterables中创建数组
var numbers = {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
}
console.log(Array.from(numbers)); //[1, 2, 3]

// Array 新增了Typed Array 使js能够在WebGL等平台发挥重要的作用