### js Object Key Order
对于js而言，对象的key的迭代顺序从ES2015之后，遵循特定的iteration order。


Object key的迭代顺序为
1. 优先输出number-like的key，并且按照ascending的顺序
2. string keys按照插入的顺序（对于对象字面而言是书写的顺序）

```js
let obj = {};
obj.name = 'yu';
obj.age = 12;
obj[12] = 12;
obj[1] = 1;
// ['1', '12', 'name', 'age']
console.log(Object.keys(obj));
```

如果要保障key迭代的顺序为key插入的顺序，通过map数据结构可以保障

```js
let m = new Map([['name', 'yu'], ['age', 12], [12, 12], [1, 1]]);
//  ['name', 'age', 12, 1]
console.log([...m.keys()])

m.set('f', 'f');
m.delete(12)
//  ['name', 'age', 1, 'f']
console.log([...m.keys()])
```
