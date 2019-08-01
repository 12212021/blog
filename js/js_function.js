/* 
判断数据的类型 
call始终会将第一个参数进行装箱操作
*/
const isType = type => target =>
    `[object ${type}]` === Object.prototype.toString.call(target);
// use case
/* 
const isNUmber = isType('Number');
console.log(isNUmber(2));
 */

/* 
循环实现数组的map方法
*/
const slefMap = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    let mappedArr = Array(arr.length - 1);
    for (let i = 0; i < arr.length; i++) {
        // 对于稀疏数组，这里处理一下
        if (arr.hasOwnProperty(i)) {
            mappedArr[i] = fn.call(context, arr[i], i, this);
        }
    }
    return mappedArr;
};
// use case
/* 
Array.prototype.selfMap = slefMap;
console.log([1, 2, 3].selfMap(num => num * 2));
 */

/* 
 使用reduce来实现数组map方法
  */
const selfMap2 = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    return arr.reduce((pre, cur, index) => {
        return [...pre, fn.call(context, cur, index, this)];
    }, []);
};

/* 
 循环实现filter方法
  */
const selfFilter = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    let filteredArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr.hasOwnProperty(i)) {
            if (fn.call(context, arr[i], i)) {
                filteredArr.push(arr[i]);
            }
        }
    }
    return filteredArr;
};

/* 
采用reduce来实现filter函数
 */
const selfFilter2 = function(fn, context) {
    let arr = Array.prototype.slice.call(this);
    return arr.reduce((pre, cur, index) => {
        // 感觉要不要this参数好像都可以
        if (fn.call(context, cur, index, this)) {
            return [...pre, cur];
        } else {
            return pre;
        }
    }, []);
};

/* 
// use case
Array.prototype.selfFilter2 = selfFilter2;
console.log([1, 2, 3, 4, 4].selfFilter2(num => num % 2 === 0)); 
*/

