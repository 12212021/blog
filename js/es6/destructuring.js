// 1、对象结构赋值

// 基本解构赋值
var node = {
    type: 'identifier',
    name: 'foo',
};
var { type, name } = node;
console.log(type, name); // "identifier foo"

// 带默认值的解构赋值
// 右侧的node对象不存在value属性，默认返回undefined，value采用了默认值true来赋值
var { type, name, value = true } = node;
console.log(type, name, value); // "identifier foo true"

// 重命名属性名称的解构赋值
var node = {
    type: 'identifier',
};
// 左侧是被解构对象属性名propriety，右侧是声明的本地变量名称，默认是bar
var { type: localType, name: localName = 'bar' } = node;
console.log(localType, localName); // "identifier bar"

// nested object destructuring
var node = {
    type: 'identifier',
    name: 'foo',
    loc: {
        start: {
            line: 1,
            column: 1,
        },
        end: {
            line: 1,
            column: 4,
        },
    },
};
var {
    loc: { start: localStart = 2 },
} = node;

// nested解构赋值左侧对象的结构需要和右侧一样
var {
    loc: {start: {line: newLine = 2}},
    loc: {start: {column: newColumn} = 3}
} = node

console.log(newLine, newColumn); // 1 1

console.log(localStart); // { line: 1, column: 1 }
// 对象解构赋值（类似于上面的start对象的解构赋值）是浅拷贝
node.loc.start.line = 'foo';
console.log(localStart); // { line: 'foo', column: 1 }

// 已经初始化的变量进行解构赋值
var type = 2,
    name = 'foo';
// 整个解构赋值必须用括号，不用括号的话， js引擎会将花括号解析为代码块，代码块不能赋值
({ type, name } = node);





// 2、Array解构赋值 不同于对象的解构赋值，数组解构赋值依赖的是数组的位置

// 交换两个变量值的快捷写法
var a = 1,
    b = 2;
[b, a] = [a, b];
console.log(a, b); //2 1

//剩余数组items
// ...剩余数组必须是最后一个参数
var colors = ['red', 'green', 'blue'];
var [firstColor, ...restColor] = colors;
console.log(firstColor, restColor); // red [ 'green', 'blue' ]





// 3、利用解构赋值简化函数参数

// es5
function setCookie(name, value, options) {
    options = options || {};
    let secure = options.secure,
        path = options.path,
        domain = options.domain,
        expires = options.expires;
}

//es6
function setCookie(name, value, { secure, path, domain, expires }) {}

// 实际上上面的function执行的语句等效于下面的语法 可以赋值给解构赋值的参数添加默认参数
function setCookie(name, value, options) {
    let { secure, path, domain, expires } = options;
}
