// es7 (2016)

// 1、指数运算符 **
console.log(2 ** 10, Math.pow(2, 10)); // 1024 1024


// es8 (2017)
// 1、async/await操作符

// 2、Object.values()  返回对象的value
var a = {
    a: 1,
    b: 2,
    c: 3
};
console.log(Object.values(a)); // [ 1, 2, 3 ]

// 3 Object.entries() 返回对象的key、value，格式为[key, value]，
// 返回值的顺序是for...in一直，但是不包含原型链上的属性
for (let [key, value] of Object.entries(a)) {
    console.log(`key:${key}  value:${value}`)
}
/* 
key:a  value:1
key:b  value:2
key:c  value:3 
*/

// 4、Object.getOwnPropertyDescriptors() 获取一个对象所有自身属性的描述符
console.log(Object.getOwnPropertyDescriptors(a));
/* 
{
    a: {
        value: 1,
        writable: true,
        enumerable: true,
        configurable: true
    },
    b: {
        value: 2,
        writable: true,
        enumerable: true,
        configurable: true
    },
    c: {
        value: 3,
        writable: true,
        enumerable: true,
        configurable: true
    }
} 
*/

// es9 (2018)
// 1、Promise.finally() 最后进行资源清理的操作

// 2、异步迭代
const doSometing = (i) => {};
// 在同步循环中调用异步的代码   ----->>>>>不会工作
async function process(array) {
    for (let item of array) {
        await doSometing(item);
    }
}

// es9引入了异步迭代器，next函数返回一个Promise 如下方式会正常工作
async function process(array) {
    for await (let i of array) {
        doSometing(i);
    }
}

// es10 (2019)
// 1、Array.prototype.flat():降低数组的维度
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]
var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]
var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]
//使用 Infinity 作为深度，展开任意深度的嵌套数组
arr3.flat(Infinity);
// [1, 2, 3, 4, 5, 6]

// 2、Array.prototype.flatMap()：先对数据的元素进行映射，再对结果降低一层维度
var arr1 = [1, 2, 3, 4];
arr1.map(x => [x * 2]);
// [[2], [4], [6], [8]]
arr1.flatMap(x => [x * 2]);
// [2, 4, 6, 8]
// 只会将 flatMap 中的函数返回的数组 “压平” 一层
arr1.flatMap(x => [
    [x * 2]
]);
// [[2], [4], [6], [8]]

// 3、Object.fromEntries()：将包含键值对的列表转化为一个对象，是Object.entries函数反操作


// es11 (2020)

// 1、 ?. 可选链操作符 Optional Chaining
const adventurer = {
    name: 'Alice',
    cat: {
        name: 'Dinah'
    }
};
console.log(adventurer.dog?.name); //undefined
// 等价于 adventurer.dog && advendurer.dog.name
// 获取多层级的属性的时候非常有用

// 2、 ?? 空值合并运算符 Nullish Coalescing
// 当左侧的操作数为null或者undefined的时候，返回右侧的操作数否则返回左侧的操作数