/* 
单例模式：保障一个类仅有一个实例，并且要提供一个访问它的全局访问点

针对单一职责的原理，提供一个工厂函数来负责类只有一个实例，实例的初始化分离出去
*/

// 单例模式逻辑是固定的，分离出来
function getSingle(fn) {
    let instance = null;
    return function () {
        const __me = this;
        if (!instance) {
            instance = fn.applay(__me, arguments);
        }
        return instance;
    };
}

// 类初始化的工作交给函数自己来做
function createLoginLayer() {
    const div = document.createElement('div');
    div.innerHTML = 'login';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
}

const createLoginSingle = getSingle(createLoginLayer);
document.getElementById('login-btn').onclick = function () {
    let loginDiv = createLoginSingle();
    loginDiv.style.display = 'block';
};
