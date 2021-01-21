/* 
策略模式：定义一系列的算法，把他们一个个封装起来，并且他们之间是可以相互替换的
*/



// case 1:计算奖金
/* 
绩效  奖金倍数
S     4
A     3
B     2
*/


// oop模式下的策略模式
/* 
oop模式下，环境类（Bouns）接受客户的请求，然后委托给策略类进行计算
在js环境下，函数可以作为参数和返回值来传递，所以直接将计算策略定义为函数即可，不用封装为类
*/
class Bonus {
    constructor() {
        this.salary = null;
        this.strategy = null;
    }

    setSalary(salary) {
        this.salary = salary;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    getBouns() {
        return this.strategy.caculate(this.salary);
    }
}

// 具体的策略类
class PerformanceS {
    caculate(salary) {
        return 4 * salary;
    }
}

class PerformanceA {
    caculate(salary) {
        return 3 * salary;
    }
}

class PerformanceB {
    caculate(salary) {
        return 2 * salary;
    }
}


const bonus = new Bonus();
const performanceA = new PerformanceA();
bonus.setSalary(100);
bonus.setStrategy(performanceA);
console.log(bonus.getBouns())





/* 
case2
表单校验
*/

class Validator {
    constructor() {
        this.validators = [];
    }

    add() {
        const __me = this;
        const __args = Array.from(arguments);
        const fn = __args.shift();
        const args = Array.from(__args);
        this.validators.push({
            func: fn,
            args
        });
    }

    check() {
        let isAllFill = true;
        for(const rule of this.validators) {
            const ret = rule.func.apply(this, rule.args);
            if (!ret) {
                isAllFill = false;
            }
        }
        return isAllFill;
    }
}


function minLenght(length, value) {
    value = value.trim();
    const len = value.length;
    return len > length;
}

function notEmpty(value) {
    if (value === null || value === undefined || value === '') {
        return false;
    }
    return true;
}

const validator = new Validator();
validator.add(minLenght, 6, '876562861111111');
validator.add(notEmpty, '89');

console.log(validator.check());