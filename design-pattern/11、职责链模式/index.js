/*
职责链模式：使多个对象都有处理请求的机会，从而避免请求的发送者和接受者之间的耦合关系，
将这些处理对象连成一条链，请求沿着这条链来传送，直到有一个对象处理它
*/


/*
case 手机商场

orderType：
1： 500元定金用户 2：300元定金用户 3：普通定金用户
pay：是否支付过定金
true：已经支付定金，享受优惠，未支付定金，退级到普通用户
stock：手机库存，表示普通用户购买手机库存的数据量，定金用户不受限制
*/

function order500(order, pay, stock) {
    if (order === 1 && pay) {
        console.log('500元定金预购，享受100元优惠券');
        return;
    }
    // 我处理不了，传递给下一个节点吧
    return 'next';
}

function order300(order, pay, stock) {
    if (order === 2 && pay) {
        console.log('300元定金预购，享受50元优惠券');
        return;
    }
    return 'next';
}

function orderNormal(order, pay, stock) {
    if (order === 3 && stock > 0) {
        console.log('购买成功');
        return;
    }
    console.log('库存不足');
    return;
}


class Chain {
    constructor() {
        this.chain = [];
    }

    setChain(process) {
        this.chain.push(process);
    }

    passRequest(type, pay, stock) {
        // 除了for循环，可以用更加灵活的递归函数
        for (const func of this.chain) {
            const ret = func(type, pay, stock);
            // 有节点给处理了，就回退
            if (ret !== 'next') {
                return;
            }
        }
    }
}


function main() {
    const chain = new Chain();
    chain.setChain(order500);
    chain.setChain(order300);
    chain.setChain(orderNormal);

    chain.passRequest(1, true, 500);
    chain.passRequest(2, true, 500);
    chain.passRequest(3, true, 500);
    chain.passRequest(1, false, 0);
    chain.passRequest(1, true, 10);
}


main();
