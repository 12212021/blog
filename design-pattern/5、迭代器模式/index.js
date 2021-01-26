/* 
迭代器模式：提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该聚合对象内部实现

js：[Symbol.iterator] 定义了对象的内部默认的迭代器模式，可以被for...of来消费
*/

/* 
内部迭代器：聚合对象内部定义好了迭代的规则，外部只需要一次调用，比方说forEach函数、for...of迭代器

内部迭代器的缺点：迭代规则被定义好了，例如，不能迭代两个数组
*/
function each(arr, cb) {
    for (let i = 0; i < arr.length; i++) {
        cb.call(arr[i], i, arr[i]);
    }
}
each([11, 22, 33], function (index, val) {
    console.log(index, val);
});

function compare(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('arr1 is not equal to arr2');
    }
    each(arr1, function (index, val) {
        if (arr2[index] !== val) {
            throw new Error('arr1 is not equal to arr2');
        }
    });
    return true;
}

compare([1, 2, 3], [2, 3, 4]);
// compare函数的实现不优雅

/* 
外部迭代器：调用方必须显式地请求下一个元素
外部迭代器虽然增加了一些调用的复杂度，但是也增加了灵活性
*/
function iterator(obj) {
    let current = 0;
    const next = () => {
        current = current + 1;
    };
    const isDone = () => {
        return current >= obj.length;
    };
    const getCurrentItem = () => {
        return obj[current];
    };
    return {
        next,
        isDone,
        getCurrentItem,
        length: obj.length
    };
}

function compare1(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('arr1 is not equal to arr2');
    }
    while (!arr1.isDone() && !arr2.isDone()) {
        if (arr1.getCurrentItem() !== arr2.getCurrentItem()) {
            throw new Error('arr1 is not equal to arr2');
        }
        arr1.next();
        arr2.next();
    }
    return true;
}

const iterator1 = iterator([1, 2, 3]);
const iterator2 = iterator([1, 2, 3]);
console.log(compare1(iterator1, iterator2));