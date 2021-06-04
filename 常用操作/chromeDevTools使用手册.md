### copying & saving
- copy函数可以copy变量
- 右键打印出来的数据，可以“Store as global variable”
- console打印的堆栈信息可以右键“Save as”，保存为文件
- HTML可以直接cmd + c来复制

### 快捷键
- cmd + shift + D可以toggle devtool面板的位置（右侧和下侧）
- ctrl + [ 或者 ctrl + ]可以左右切换面板
- ctrl + 1 ... 9可以切换面板（Elements、Console、Source...）
- 上下箭头可以调整style的数值大小，step为1（shift -> step: 10, ctrl -> step: 0.1）
- elements， logs， sources & network 可以按下cmd + f来查找
- cmd + shift + P 进入运行命令行面板（Capture full size screenshot可以截取全屏）


### Snippets
source面板中可以添加Snippets，可复用的js片段，可以通过命令框输入！来选择片段来执行


### console相关

console.log打印的对象保存的是引用，只有当你点击打开它的时候，chrome才真正地去读取数据，打印primitive类型的值不受影响
打印object类的值的时候，可以用JSON.Stringfy来字符串化

#### console快捷引用信息
- 再Elements面板中，$0是对当前选择节点的引用，$1是对上一个选择节点的引用，到$4，以此类推
- \$是document.querySelector缩写，$$是对Array.from(document.querySlectorAll)缩写
- $_是对上次js执行结果的引用
- Console中是异步环境，可以直接用await来获取异步对象

#### console中打印
1、再Source面板中，可以在源代码行数`右键`添加`条件断点`，当条件执行为truly的时候，截断代码执行

2、可以在Source面板各个位置添加断点，增添console.log语句，因为console返回值为undefined，所以断点会一直执行，
不停地输出console值，比在源码添加log语句要好很多，且线上环境可以使用，方便移除

3、console.assert(assertion, msg)当我们传入的第一个参数为falsly的时候，打印第二个参数以后的信息

4、Console面板中眼睛图标可以Observe一个全局变量

#### Console中关于对象和事件
- queryObjects(constructor)可以打印出当前系统中存活的以该类构造的对象
- monitor(function)可以监视函数执行，当该函数执行的时候，打印出函数名和参数
- monitorEvents(dom, evenetName)可以监视页面事件的执行（ex: monitorEvents($0, 'click')）


#### console API
- console.log输出log日志，console.log({name, age})，可以启动enhance object literal，输出对象
- console.table以表格的形式打印一个类数组
- console.dir打印一个DOM节点关联的js对象

### Network相关
- network面板可以隐藏timeline
- Request initiator可以显示脚本的哪一行触发了HXR请求
- 可以输入（method:GET, status-code: 200）来过滤需求，（-method: GET）反过滤，显示所有非GET请求
- 右键请求可以重新发送xhr请求
- 在Source面板上可以XHR断点


### Elements相关
- 选中element，键入h可以隐藏或者显示元素
- 鼠标选中可以拖动dom元素
- cmd + 上下箭头，可以上下移动dom元素
- css box-shadow属性可以单击左侧小窗口来可视化调整
