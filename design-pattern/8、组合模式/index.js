/*
组合模式的思想：事物总是由相似的事物构成

组合模式的用途：
1、能够比较好的表示树形结构
2、利用对象的多态性统一对待组合对象和叶对象

组合模式的特点：
1、组合模式的树形结构，很容易让人觉着组合节点和叶节点是父子关系，但是实际上是HAS-A关系，不是IS-A关系
2、对叶对象的操作必须有一致性，所有的叶节点都要做某种操作，比方说给所有的员工发送1000元过节费适用组合模式，给过生日的员工发送祝福邮件就不适用，除非先把过生日的员工挑选出来
3、发送过节费到员工，如果说某个员工属于两个部门，那么就需要进行区分，否则该员工就能收到两份过节费，组合对象和叶对象建立双向映射，会复杂一些
4、职责链模式可以提高组合模式的性能，组合模式是深度优先遍历，请求顺着职责链传递，直到遇到能处理改请求的对象，就终止，能提高性能
*/

/*
例子1 万能遥控器，拥有以下功能
1、打开空调
2、打开电视和音箱
3、关门、开电脑、打开QQ
*/
class MacroCommand {
    constructor() {
        this.commandList = [];
    }
    add(command) {
        this.commandList.push(command);
    }
    execute() {
        for (const command of this.commandList) {
            command.execute();
        }
    }
}

class OpenAirConditioner {
    add() {
        throw new Error('leaf can not push command');
    }
    execute() {
        console.log('open air cinditioner!');
    }
}

class OpenDoor {
    add() {
        throw new Error('leaf can not push command');
    }
    execute() {
        console.log('open door!');
    }
}

class OpenLoudspeaker {
    add() {
        throw new Error('leaf can not push command');
    }
    execute() {
        console.log('open loudspeaker!');
    }
}

class CloseDoor {
    add() {
        throw new Error('leaf can not push command');
    }
    execute() {
        console.log('close door!');
    }
}

class OpenComputer {
    add() {
        throw new Error('leaf can not push command');
    }
    execute() {
        console.log('open computer!');
    }
}

class LoginQQ {
    add() {
        throw new Error('leaf can not push command');
    }
    execute() {
        console.log('login QQ!');
    }
}


function testMicroCommand() {
    const root = new MacroCommand();
    const compositeOne = new MacroCommand();
    const compositeTwo = new MacroCommand();

    const openAirConditioner = new OpenAirConditioner();
    const openDoor = new OpenDoor();
    const openLoudspeaker = new OpenLoudspeaker();
    const closeDoor = new CloseDoor();
    const openComputer = new OpenComputer();
    const loginQQ = new LoginQQ();

    compositeOne.add(openDoor);
    compositeOne.add(openLoudspeaker);

    compositeTwo.add(closeDoor);
    compositeTwo.add(openComputer);
    compositeTwo.add(loginQQ);

    root.add(openAirConditioner);
    root.add(compositeOne);
    root.add(compositeTwo);

    root.execute();
    /*
    open air cinditioner!
    open door!
    open loudspeaker!
    close door!
    open computer!
    login QQ!
    */
}


// testMicroCommand();







/*
case2 文件夹和文件统一操作

包括扫描，移除文件，增加文件三个功能
*/
class Folder {
    constructor(name) {
        this.fileList = [];
        this.parent = null;
        this.name = name + ' folder';
    }

    add(file) {
        file.parent = this;
        this.fileList.push(file);
    }

    remove() {
        // 孤立的叶子节点或者根节点
        if (!this.parent) {
            return;
        }
        const parent = this.parent;
        parent.fileList = parent.fileList.filter(child => child !== this);
    }

    scan() {
        for (const child of this.fileList) {
            child.scan();
        }
    }
}

class File {
    constructor(name) {
        this.parent = null;
        this.name = name + ' file';
    }

    add(file) {
        throw new Error('leaf can not push command');
    }

    remove() {
        if (!this.parent) {
            return;
        }
        const parent = this.parent;
        parent.fileList = parent.fileList.filter(child => child !== this);
    }

    scan() {
        console.log(this.name);
    }
}


function testFile() {

    const folderNodeDemo = new Folder('node-demo');
    const fileNode = new File('node');
    const fileJs = new File('js');
    folderNodeDemo.add(fileNode);
    folderNodeDemo.add(fileJs);

    const folderHappy = new Folder('happy');
    const music = new File('zhou');
    const movie = new File('ultroman');
    folderHappy.add(music);
    folderHappy.add(movie);

    const folderRoot = new Folder('root');
    const litter = new File('san');
    folderRoot.add(litter);
    folderRoot.add(folderNodeDemo);
    folderRoot.add(folderHappy);

    folderRoot.scan();
    /*
    san file
    node file
    js file
    zhou file
    ultroman file
    */

    music.remove();
    folderRoot.scan();
    /*
    san file
    node file
    js file
    ultroman file
    */
}

testFile();
