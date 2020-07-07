/* 
类型系统带来的好处：
1、进行静态检查，能够在编译期发现类型不匹配，属性undefined这些较为低级的错误
2、对于ide、编辑器而言，静态语言能够提供更加智能的提示，重构代码更加安全
 */



/* 
 类型的本质是满足某些特性的js（或者其他语言）的值的集合
 集合具有：
 1、确定性
 2、无序性
 3、互异性

概念定义
内涵：指集合中所有元素的全体
外延：指集合中所有元素的共有属性
一个集合的外延越小，它的内涵就大

类型的运算
&:交集
|:或集
any类型的元素类似于全集
never类型的元素则类似的数学中的空集

 */
type landAnimal = {
    name: string;
    canLiveOnLand: true;
}
type waterAnimal = {
    name: string;
    canLiveInWater: true;
}
type amphibian = landAnimal & waterAnimal;
type animalInWaterOrOnLand = landAnimal | waterAnimal;

// 两栖动物 toad既能够生活在水中也能够生活在陆地上
// 所以toad需要具备landAnimal、waterAnimal中所有的属性
// 相当于两个类型的交集
const toad: amphibian = {
    name: 'toad',
    canLiveInWater: true,
    canLiveOnLand: true
}

// 类似于两个集合的并集 一个动物要不在水中生活，要么在陆地上生活
const maybeLandOrWater: animalInWaterOrOnLand = {
    name: 'dog',
    canLiveOnLand: true
}

// A & B <= A U B   (两个集合的交集总是从属于两个集合的并集)
const maybeLandOrWater1: animalInWaterOrOnLand = {
    name: 'dog',
    canLiveOnLand: true,
    canLiveInWater: true
}








// 类型的兼容性
type Point1D = {
    x: number
}

type Point2D = {
    x: number;
    y: number
}

function plot1D(p: Point1D) {
    console.log(p.x);
}

function plot2D(p: Point2D) {
    console.log(p.x, p.y);
}

const p1: Point1D = {
    x: 0
};

const p2: Point2D = {
    x: 0,
    y: 0
}

plot1D(p1);
plot1D(p2);
plot2D(p1); // 类型“Point1D”的参数不能赋给类型“Point2D”的参数。
plot2D(p2);

// plot1D函数的参数要求是Point1D类型，但是将p2参数传入并没有编译错误，这是类型兼容性的功能
// 属于多态的一种  ts在js的基础上面增加了类型，js比较灵活，所有ts的类型检查采用了结构子类型检查的方式
// 类似于js中duck typing


// duck typing example(结构子类型检查方式)
interface Duck {
    say: () => void
}

function duckSay(animal: Duck) {
    animal.say()
}

let dog = {
    say() {
        console.log('dog dog');
    }
}

let duck: Duck = {
    say() {
        console.log('duck duck');
    }
}

duckSay(dog);
duckSay(duck);



// 普通类型的兼容性（父类指针能够赋值给子类）
interface Named  {
    name: string
}

let x: Named;
let y = {name: 'yuchi', age: 19}
x = y
y = x //Property 'age' is missing in type 'Named' but required in type '{ name: string; age: number; }



// 函数类型的兼容性(本质上是集合之间映射关系的兼容性)
let func1 = (a: number) => 0;
let func2 = (a: number, s: string) => 0;

// 参数的逆变
// 协变：子类型 <= 父类型 逆变是这个关系反过来了
// 一个函数的参数要求比较精确的参数信息，当你传入的参数信息比较简陋的时候也能够正常工作
const testArr = [1, 3, 4, 5, 6, 7];
testArr.map((ele, index, whichThis) => {
    console.log(ele, index, whichThis);
});
func1 = func2; // 不能将类型“(a: number, s: string) => number”分配给类型“(a: number) => number”。
func2 = func1;

let func3 = () => ({name: 'yuchi', age: 10});
let func4 = () => ({name: 'yuchi'});

func3 = func4; // 不能将类型“() => { name: string; }”分配给类型“() => { name: string; age: number; }”
func4 = func3;

// 函数的类型可以看作是一个像和像之间的映射， 参数是原像， 而返回值则是作为被映射的像
// func2的参数集合P2 <= P1(func1的参数) R1 === R2, func2是func1的超关系类型
// P3 === P4；  R3 <= R4。 所以fun4是func3的超类型关系
// 当参数的内涵变大的时候或者返回值的内涵变小的时候，产生一个映射关系的子集






// 控制流分析能力(类型收缩)

// 类型分析流能力
// 基础的typeof类型哨兵  instanceof类型保护
// typeof类型保护*只有两种形式能被识别： typeof v === "typename"和 typeof v !== "typename"， 
// "typename"必须是 "number"， "string"， "boolean"或 "symbol"。
function foo(x: string | number) {
    if (typeof x === 'string') {
        x.toLowerCase();
    } else {
        // else 分支 ts的编译器会自动推断x类型为number
        x.toFixed(2)
    }
}


interface Bird {
    fly();
    layEggs();
}
interface Fish {
    swim();
    layEggs();
}
function getSmallPet(): Bird | Fish {
    if (Math.random() < 0.5) {
        return ({
            fly(){},
            layEggs() {}
        })
    } else {
        return ({
            swim(){},
            layEggs(){}
        })
    }
}
let smallPet = getSmallPet();
smallPet.swim(); // 类型“Bird | Fish”上不存在属性“swim”。
// 采用类型断言
(<Fish>smallPet).swim(); 

// 自定义类型保护 函数的返回值为类型谓词
// 谓词 parameterName is Type这种形式，parameter必须来自当前函数签名里面的一个参数名
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim === undefined;
}

if (isFish(smallPet)) {
    smallPet.swim();
} else {
    smallPet.fly();
}


// null、undefined在ts中的类型保护和类型断言
function f(sn: string | null | undefined): string {
    if (sn === null) {
        return 'null';
    } else if (sn === undefined) {
        return 'undefined';
    } else {
        // 自动推断出sn是字符串类型
        return sn.toLowerCase();
    }
}

function f1(sn: string | null | undefined):string {
    //短路运算符
    return sn || 'null or undefined';
}


//利用单例类型、联合类习惯、类型保护和类型别名来创建 可辨识联合的高级模式
interface Square {
    kind: 'square';
    size: number
}
interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number
}
interface Circle {
    kind: 'circle';
    radius: number
}
type Shape = Square | Rectangle | Circle;
function area(s: Shape) {
    // 由于kind是唯一的类型 所以分支中能自动判断s的类型
    switch(s.kind) {
        case 'square':
            return s.size * s.size;
        case 'rectangle':
            return s.height * s.width;
        case 'circle':
            return Math.PI * s.radius ** 2;
    }
}






// 类型的编程
function identify<T>(x: T): T {
    return x;
}
let outputString = identify<string>('foo') //string
let outputNumber = identify<number>(666) //number
// 泛型本质上是一个类型层面的函数，输入指定的具体类型，得到的结果是处理后的输出类型
const identify1 = x => x; // value层面的函数
type identify2<T> = T; // 类型层面的函数

// 类型层面的函数
type Pair<T, U> = [T, U]; 
const point1: Pair<number, number> = [1 ,2];

// partical
type User = {
    id: number;
    name: string;
    birthday: string
}
type PartialSelf<T> = {
    [U in keyof T]?: T[U]
}

function updateUser1(id: number, userInfo: PartialSelf<User>) {}
function updateUser2(id: number, userInfo: User) {}
updateUser2(100, {name: 'yuchi'}) // 类型“{ name: string; }”的参数不能赋给类型“User”的参数。
updateUser1(100, {name: 'yuchi'}) 

type ReadOnlySelf<T> = {
    readonly [U in keyof T]: T[U]
}

let user1: ReadOnlySelf<User> = {
    name: 'yuchi',
    id: 18,
    birthday: '20000101'
}

user1.id = 10; // 增加了readOnly属性，所以不能更改

//Conditional Type
type BoxedValue<T> = {value: T}
type BoxedArray<T> = {array: T[]}
type Boxed<T> = T extends number[] ? BoxedArray<T[number]> : BoxedValue<T>

type T10 = Boxed<string>
type T11 = Boxed<string[]>
type T12 = Boxed<number[]>
type T13 = Boxed<string | string[]>


// Conditional Type infer关键字能够声明一个类型变量，在分支中可以引用
type ReturnTypeSelf<T> = T extends (...args: any[]) => infer U ? U : any;

type test<T> = {
    [K in keyof T]: T[K]
}

// 类型的递归
type DeepReadOnlySelf<T> = {
    readonly [P in keyof T]: DeepReadOnly<T[P]>
}
interface NestedNumber {
    a: {
        b: {
            c : number;
        }
    }
}

const obj2: ReadOnlySelf<NestedNumber> = {a:{b:{c:2}}}
obj2.a.b.c = 10; //不报错
const obj3: DeepReadOnlySelf<NestedNumber> = {a:{b:{c:2}}};
obj3.a.b.c = 12; // Cannot assign to 'c' because it is a read-only property.


// 附录：操作符含义
// ts的复杂类型分成了两类
// set：无序、无重复元素的集合
// map：没有重复键的键值对

type Size = 'big' | 'small' | 'default' | 'large';
interface IA {
    a: string;
    b: number;
}

// map => set
type IAKeys = keyof IA; // "a" | "b"
type IAValues = IA[keyof IA]; // string | number

// set => map
type SizeMap = {
    [P in Size]: number;
}

// 索引操作
type SubA = IA['a'];
type Person = {
    age: number;
    readonly name: string; // 只读属性，初始化的时候必须赋值
    nickname? : string; // 可选属性 相当于 | undefined
}

func2 = func1;