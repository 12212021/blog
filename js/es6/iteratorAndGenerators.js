/* 
es6新增了iterator来代替传统的for迭代方式
iterator被for...of、[...]等es6新增的操作符使用
iterator可以被用在数组、set、map、string数据结构上 
*/



/* 
iterator是一个对象
内部有next method（return一个对象）
return的对象中value表示值 done表示迭代是否完成
下面的函数不能通过for of或者...操作符来消耗，这是一个iterator原理解释的例子
 */
function createIterator(items) {
    let i = 0;
    return {
        next() {
            let done = i >= items.length;
            let value = done ? undefined : items[i];
            i++;
            return {
                done,
                value
            }
        }
    }
}

var iterator = createIterator([1, 2, 3]);
console.log(iterator.next(), iterator.next(), iterator.next(), /* 迭代已经完成 */iterator.next());

/* 
Generator是一个函数，该函数返回一个iterator，可以用es6新加入的yeild关键字来简化代码
Generator需要在函数名之前增加*号来声明（可以用在普通函数、箭头函数、类方法上）
yeild关键字只能在generator函数内部使用，否则会报错 
*/
function *createIteratorByYeild(items) {
    for(let i = 0; i < items.length; i++) {
        yield items[i];
    }
}
var iter = createIteratorByYeild([1, 2, 3]);
console.log(iter.next(), iter.next(), iter.next(), /* 迭代已经完成 */iter.next());


/* 
iterable是一个Object 存在一个[Symbol.iterator]的属性（接口，该函数返回一个iterator），可以被for...of消耗 
for...of首先call对象的[Symbol.iterator]方法，在返回的iterator上调用next方法，当done是false的时候返回
*/
const infiniteIterable = {
    [Symbol.iterator]() {
        return {
            next() {
                return {
                    value: 'infinite',
                    done: false
                }
            }
        }
    }
}
// for(let val of infiniteIterable) {
//     console.log(val);
// }

// 这是一般的迭代器，产出1到100
const plainIterator = {
    [Symbol.iterator]() {
        let begin = 0;
        let end = 100;
        return {
            next() {
                begin += 1;
                return {
                    value: begin,
                    done: begin > end
                }
            }
        }
    }
}



let collection = {
    items: [],
    *[Symbol.iterator]() {
        for (let item of this.items) {
            yield item;
        }
    }
}
collection.items = [1, 2, 3];
for (let x of collection) {
    console.log(x);
}




//内建的iterators
/* 
collection type的数据结构有一个default iterator，当不声明方法时（没有显式地指定keys、entries、values）
set、array默认是values；map默认是entries */
let colors = ['red', 'green', 'blue'];
let tracking = new Set([1234, 5678, 9012]);
let data = new Map([['title', 'Understanding ECMAScript 6'], ['format', 'ebook']])
// entries()
for (let entry of colors.entries()) {
    console.log(entry);
}
for (let entry of tracking.entries()) {
    console.log(entry);
}
for (let entry of data.entries()) {
    console.log(entry);
}
/* 
output
[0, "red"]
[1, "green"]
[2, "blue"]
[1234, 1234]
[5678, 5678]
[9012, 9012]
["title", "Understanding ECMAScript 6"]
["format", "ebook"]
 */

// values()
for (let entry of colors.values()) {
    console.log(entry);
}
for (let entry of tracking.values()) {
    console.log(entry);
}
for (let entry of data.values()) {
    console.log(entry);
}
/* 
"red"
"green"
"blue"
1234
5678
9012
"Understanding ECMAScript 6"
"ebook"
 */

// keys()
for (let entry of colors.keys()) {
    console.log(entry);
}
for (let entry of tracking.keys()) {
    console.log(entry);
}
for (let entry of data.keys()) {
    console.log(entry);
}
/* 
0
1
2
1234
5678
9012
"title"
"format" 
*/


/* 
String iterator
es5可以用中括号来获取字符串中的character，但是中括号作用机制是code units而不是character
所以在double-byte character中存在一些缺陷 
*/
var message = 'A 𠮷 B';
for (let i = 0; i< message.length; i++) {
    console.log(message[i]);
}
/* 
A
(blank)
�
�
(blank)
B 
*/
for (let character of message) {
    console.log(character);
}
/* 
A
(blank)
𠮷
(blank)
B 
*/



// spread oprator作用在iterable上，示例如下
var map = new Map([["name", "Nicholas"], ["age", 25]]);
var arrayEntries = [...map];
var arrayKeys = [...map.keys()];
var arrayValues = [...map.values()];
console.log(arrayEntries, arrayKeys, arrayValues);
// [['name', 'Nicholas' ], [ 'age', 25 ] ]----[ 'name', 'age' ]----[ 'Nicholas', 25 ]
