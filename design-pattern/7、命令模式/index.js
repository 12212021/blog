/* 
命令模式：发起者不知道是具体的接受者是谁，也不知道接受者将要做哪一些操作，可以引入command命令对象，实现发起者和接受者之间的解耦

优点：引入命令模式，可以比较方便的做  撤销、重做等功能

核心：发起者和具体的执行者之间进行解耦
*/

const btnDOM = document.querySelector('.btn');
const setCommand = (dom, fn) => {
    dom.onclick = fn;
};
function refreshTable() {
    console.log('refresh');
}
function loadingData() {
    console.log('loading data');
}
setCommand(btnDOM, refreshTable);
setCommand(btnDOM, loadingData);
// setCommand函数将dom的onclick事件绑定到fn上，可以轻松实现解耦



// 命令模式可以比较方便地实现撤销步骤
const moveBtn = document.querySelector('.move');
const undoBtn = document.querySelector('.undo');
class PositionCommand {
    constructor(receiver) {
        this.oldPosition = null;
        this.receiver = receiver;
    }
    excute(pos) {
        this.oldPosition = this.getCurrentPos();
        this.receiver(pos);
    }
    getCurrentPos() {
        return null;
    }
    undo() {
        this.receiver(this.oldPosition);
    }
}

/* 
1、对于需要撤销多步，我们可以在命令类内部创建一个history列表，逐步进行撤销
2、对于某一些不能够撤销，我们可以记录命令执行了多少步，需要撤销的时候，先初始化，然后逐步重新执行这些命令
*/