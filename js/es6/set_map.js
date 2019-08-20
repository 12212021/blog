// set、map出现的背景

// 1、Object中将key当作字符串进行计算
var map = Object.create(null);
map[5] = 'foo';
console.log(map[5], map['5']); // foo foo

// 采用object作为key的时候，会自动调用object.toString返回[object object]
// 所有key1 key2返回的值是一样的
var key1 = {},
    key2 = {};
map[key1] = 'bar';
console.log(map[key2]); // bar

// 带有歧义性
map.count = 1;
if (map.count) {
    // 是判断map对象中存在count属性呢？还是count属性对应的值是否为falsy？（实际上是判断count属性的值是否为falsy）
    console.log('print');
}
// 变通：可以采用in操作符来判断对象中是否存在该属性，但是in属性会遍历prototype原型上的属性，当对象的原型是null的时候，in操作符不存在该限制

// set

// constructor
var s1 = new Set(); // 空set
var s2 = new Set([8, 9, 11, 99, 9]); // 去除数组中的重复的数据

// set的增删查
var set = new Set();
set.add(5);
set.add('5');
set.add(5); // 因为set已经存在5了，所以会被忽略
console.log(set);
set.add(4);
set.delete(4);
console.log(set.has('5'));
set.clear(); // set消除

//set的forEach
var set = new Set([1, 2]);
//第一个参数是传入的值、第二个是key（在set中key、value相同）、第三个是对set的引用
// 这么做是为了保持了Array、map等数据结构forEach函数一致
set.forEach((val, key, ref) => {
    console.log(key + '' + val);
    console.log(ref === set);
});

// set转Array
var arr = [...set]; // 采用扩展运算符





// map
/* 
map结构和set相似，运行的机理也比较类似
has(key)
delete(key)
clear()
size
 */
var map = new Map();
map.set('name', 'Nicholas');
map.set('age', 27);
console.log(map);

// nested数组结构生成新的map
var map = new Map([['name', 'test'], ['age', 28]]);
console.log(map);

// map的forEach函数是有序的
map.forEach((key, value, ownerMap) => {
    console.log(key + ' ' + value);
    console.log(ownerMap === map);
});
