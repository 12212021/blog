/**
 * 判断一个对象是不是对象字面量
 * @param {Object} obj
 * @returns {boolean}
 */
function isPlainObject(obj) {
    // 对象是null或者原始类型不是object的排除
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
        return false;
    }

    const proto = Object.getPrototypeOf(obj);
    // 对于Object.creta(null)创建的对象，判断为true
    if (!proto) {
        return true;
    }
    // 获取对象的原型对象上的构造函数
    const ctor =
        Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
        proto.constructor;

    return (
        typeof ctor === 'function' &&
        Function.prototype.toString.call(ctor) ===
            'function Object() { [native code] }'
    );
}

var obj1 = Object.create(null); // true
var obj2 = {
    name: 'batman',
    age: 36
}; // true
var obj3 = new Date(); // false
var obj4 = /batman/; // false
console.log(
    isPlainObject(obj1),
    isPlainObject(obj2),
    isPlainObject(obj3),
    isPlainObject(obj4),
    isPlainObject(null),
    isPlainObject([1, 2, 3])
);
