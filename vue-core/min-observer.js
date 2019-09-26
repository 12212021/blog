// 全局变量，用来存储当前的运行的updater（大部分都是render function）
let activeRender;

// 依赖收集类实现

/* 
props更新的时候，子组件的DOM树进行了重新渲染：子组件的render函数被被以来收集到父组件的data（reactive）属性中，
当父组件中data发生变化的守候，子组件注册的render函数重新渲染（类似于react，react中状态树的改变全部取决于setState）
 */
class Dep {
    constructor() {
        this.subscribers = new Set();
    }
    depend() {
        if (activeRender) {
            this.subscribers.add(activeRender);
        }
    }
    notify() {
        this.subscribers.forEach(sub => sub());
    }
}


// 通过Object.defineProperty来使得一个对象变的可观测
function makeReactive(obj) {
    Object.keys(obj).forEach(key => {
        let internalVal = obj[key];
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                dep.depend();
                return internalVal;
            },
            set(newVal) {
                internalVal = newVal;
                dep.notify();
            },
        });
    });
}

/* 
每个render function（watcher、computed）均被autoRUn函数包裹
当上述函数首次执行的时候，autoRun函数配合Dep类对对象的属性进行注册
当对象属性发生变化的时候，autoRun注册的函数会再次自动执行 
*/
function autoRun(render) {
    function updateWrapper() {
        activeRender = updateWrapper;
        render();
        activeRender = null;
    }
    updateWrapper();
}


/* 
说明：Vue在存在Observer的情况下为什么还需要VirtualDom
1、抽象，类比React、ReactNative，抽象出vNode这一层，可以使得框架跨平台（Vue的Weex）
2、Vue并不是不存在diff-path的过程，通过响应式、依赖收集机制，Vue能精确地知道那个组件发生了变动，需要重新渲染render function
之后，在组件的层次上面，Vue会比对重新通过render function生成的vDom和之间的vDom之间的差异，之后再进行diff-patch。
 */