### height 100%不起作用
当元素的父级容器的height没有显示指定（即高度由内容决定）并且该元素不是绝对定位，则计算值是auto，auto是没有办法跟百分比相乘的，所以作用无效。
想要容器百分比设定生效，需要用下面的设置
```css
html, body {
    height: 100%;
}
#app {
    height: 100%;
}


/*
使用绝对定位
绝对定位元素的高度计算的是包含块的padding box的尺寸
非绝对定位的高度计算是包含块的content box尺寸
*/
div {
    height: 100%;
    position: absolute
}

```


### css设置文字...的效果（省略效果）

#### 单行文字
text-overflow主要负责web端单行文字clip（截断）效果，但是tex-overflow不会强制overflow发生，所以，如果要单行clip，则需要设置css属性overflow、white-space
```css
overflow: hidden;
white-space: nowrap;
```
white-space属性不必说，主要集中在overflow属性上。



overflow
- visible(default)
- clip（与hidden类似，但是会禁用所有的滚动，包括js程序滚动）
- hidden，相对于padding-box，如果必要，会clip内容，同时js可以使内容发生滚动
- scroll，浏览器总是会展示滚动条
- auto，如果内容能够fit padding-box，表现同visible，否则同scroll

overflow设置除visible、clip之外的属性，会创建一个block formatting context，另外，如果要使overflow生效，block-level container必须有个height或者width（max-height、max-width），或者white-space被设置为nowrap

针对文本溢出的情况，一般的展示逻辑是：当空间不足以展示文本的时候，文本overflow，鼠标hover的时候会展示tooltip

这里就会涉及到tooltip展示时机的问题
```js
this.showTooltip = this.$refs.content.offsetWidth < this.$refs.content.scrollWidth || // 处理单行省略
                   this.$refs.name.offsetHeight < this.$refs.name.scrollHeight; // 处理多行省略
```

除此之外，还需要监控文本的宽度是否发生了变化
- 通过useLayoutEffect来监测，useLayoutEffect的性能消耗需要注意
- 通过useEffect，监测children的变化（children的具体触发时机是什么还需要研究）


#### 多行文字
```css
span {
    overflow: hidden;
    text-overflow: ellipse;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 设置几行后显示...效果 */
    -webkit-box-orient: vertical; /* 设置文字方向为纵向 */
}
```


### 如何判断一个元素的的text-overflow属性是否生效？
选取dom元素，判断该dom元素的offsetWidth属性是否大于clientWidth属性，如果大于，则生效。

tips：
- offsetWidth：content + padding + border + 滚动条（如果存在）
- clientWidth：content + padding，不包括滚动条宽度
- scrollWidth：对象的实际宽度，生面两个属性是在描述盒子，scrollWidth描述的是对象实际的宽度

### table中如何设置文字的...效果
再table-cell内部包裹一个div标签，对该div标签设置...效果可以起作用；这样既可以利用table表格的属性有能实现文字溢出的效果。

注：在table中设置table-cell的宽度是无效的，table中cell的宽度一般是由内部文字的长度决定的，默认情况下是不换行的，所以对于table-cell设置宽度一般是无效的。可以设置table的word-break:break-all属性，在改属性基础上，再设置table-cell的宽度能够生效。


### inline-block相关问题
inline-block无法换行的问题
- inline-block表现跟inline一样，如果内部是是cjk文字，是会自动换行的（word-break）等属性
- 两个inline-block之间会有一个5px左右的间隙，是因为闭合标签之间空格渲染，解决方式如下
  - 重写html标签（详细示例见下）
  - 通过margin负值（需要根据父元素的font size进行调整）
  - 设置font-size为0

```html
<ul>
  <li>
   one</li><li>
   two</li><li>
   three</li>
</ul>


<ul>
  <li>one</li
  ><li>two</li
  ><li>three</li>
</ul>


<ul>
  <li>one</li><!--
  --><li>two</li><!--
  --><li>three</li>
</ul>


<!-- 在html5中还可以这样写 -->
<ul>
  <li>one
  <li>two
  <li>three
</ul>
```

### 包含块
css中包含块
对于包含块而言，百分比value（width、height、padding、margin），以及绝对定位元素（position为absolute或者fixed的），top、left、right、bottom的百分比值都是相对于包含块来计算的。

包含块的确定：
- 每个元素的包含块完全是由自身position属性决定的
static、relative、sticky，找到最近的block container（inline-block、block、list-item）或者建立了formatting context（table、flex、grid），基于content-box算
- absolute，找到第一个祖先节点position属性不是static（fixed、absolute、relative、sticky），基于padding-box
- fixed、基于html viewport
- absolute、 fixed，找到最近的祖先节点（有以下属性的），基于padding-box
    - transform、perspective值不为none
    - will-change的值为transform、perspective、filter
    - filter的值不是none
    - contain的值是paint（contain: paint）
    - backdrop-filter的值不是none



### css中的选择器
普通选择器：
- \# id选择器
- . class选择器，一般是被公用的
- []属性选择器
- : 伪元素选择器（在html中不存在，生生被造出来的元素）
- ::伪类选择器（一些实实在在的元素存在一些特殊的表现形式，比方说hover等）

基于关系的选择器：
- 空格：表示该元素所有后代中符合规则的元素
- \> :表示只选择儿子元素中（不包含孙子等元素）符合规则的元素
- ～：兄弟选择器 表示选择该元素后面所有的兄弟元素中符合规则的元素
- +：表示选择该元素相邻的那个兄弟元素中符合规则的元素


### font相关

#### font-family
font-family定义字体（如果@font-face包含了这个字体，浏览器会优先下载该字体）
```css
span {
    font-family: <family-nem> , <generic-name>
}
```

浏览器根据font-family渲染字体是逐文字渲染的，如果某个字体没有相关的glyph，会自动找下一个字体的这个glyph


\<family-name>： 如果包含空格的话，必须添加引号


\<generic-name>: 不能包含空格，作为是字体族，后备机制，如果找不到标识的family-font，会从系统安装的字体中找一个合适的字体

包含以下关键字： serif、sans-serif、monospace等


#### @font-face
```css
@font-face {
    font-family: 'DIN Alternate Bold';
    font-style: normal;
    font-weight: normal;
    src: local('DIN Alternate Bold'), url(./woff/DINAlternate-Bold.woff) format('woff');
}
```
要点
- src可以是本地拉取的字体，也可以是网络拉取字体
- font-family标识了\<family-name>
- local代表会先在本地找一下是不是有这字体，如果没，再去网络拉
- format是一个可选参数，用来标识字体是什么格式的

#### font-size
font-size属性值
- 绝对值（px），相对值，或者math keywords
- 一些length或者percentage，相对与父元素的font-size


动态size

- ems
  - em代表capital 『M』在特定的字体中，数字代表一个multiplier
  - 1.6em代表element的当前font-size的1.6倍（这个字体大小继承的）
- rems
  - rems reference html
- ex
  - ex是指选中的字体的x-height的高度，数字代表一个multiplier


### background相关要点

#### 相关属性
- background-attachment
    - fixed：background相对于viewport固定
    - local：background相对于element's content，如果content滚动，background跟随滚动
    - scroll：background相对于element itself，并且不随着content滚动而滚动
- background-clip
  - 标识background相对于哪种盒子固定，包括`border-box`、`padding-box`、`content-box`、`text`，
  - 如果element没有设置bc-image或者bc-color，只有当border有一个transparent的区域的时候，这个属性才会在视觉上有呈现
- background-color
- background-origin
  - border-box：background的位置相对于border-box
  - padding-bxo：background的位置相对于padding-box
  - content-box：background的位置相对于content-box
  - 如果background-attachment的属性为fixed，background-origin不生效
- background-position（详情见下）
- background-repeat
  - repeat-x (repeat no-repeat)
  - repeat-y (no-repeat repeat)
  - repeat (repeat repeat)
  - space (space space)
  - round (round round)
  - no-repeat (no-repeat no-repeat)
- background-size
  - auto 保持图片的intrinsic，scale corresponding direction
  - cover 保持图片的intrinsic，但是可能无法完全展示整张图
  - contain 保持图片的intrinsic，但是视口内可能会留白
  - 数字和百分比，百分比主要是有background-origin来决定的，默认是padding-box

#### background-position
设置为1个值的时候
- `center` keyword，将图片居中
- `left、right、bottom、top`设置一边为相应的关键字，另一边50%
- length、percentage，设定x轴距离边缘的长度，y轴被设置为50%

设置为2个值的时候
- 如果left或者right形式给值，则先定义X轴再定义Y轴，如果top或者bottom形式，则先y后x
- 给length或者percentage值，如果另一个是`left、right`关键字，则数字作用与y，如果是`top、bottom`关键字，则数字作用与x，如果均为数字，则先作用于x再作用于y
- 诸如top、top；left、right之类的值是不合法的
- 默认值为left top 或者 0% 0%

设置为3个值的时候（两个关键字，一个数值）
- 如果是关键字，还是left、right标识x，top、bottom表示y
- 数值标识了第一个值的offset
- 一个关键字，一个数值是不合法的

设置为4个值的时候（两个关键字，两个数字）
- 如果是关键字，还是left、right标识x，top、bottom表示y
- 第一个数字标识第一个关键字规定的轴，相应的第二个标识第二个关键字标识的轴


### 如何让overflow: auto页面出现滚动条时不抖动

#### vw方案
```css
.wrap-outer {
    margin-left: calc(100vw - 100%);
}
```
或者
```css
.wrap-outer {
    padding-left: calc(100vw - 100%);
}
```
其中`.wrap-outer`指的的是*定宽居中*的父级，父级顶宽居中两侧才有空白，能让dom进行margin或者padding

原理：100vw相当于`window.innerWidth`，是浏览器的内部宽度，*滚动条的宽度也计算再内*，100%是可用宽度，*不包含滚动条宽度*

#### scrollbar-gutter
```css
scrollbar-gutter: auto | stable && both-edges?
```
```css
scrollbar-gutter: auto;
scrollbar-gutter: stable;
scrollbar-gutter: stable both-edges;
```
属性释义
- auto：默认行为，没有滚动条内容尽可能占据宽度，有了滚动条，可用宽度就减少
- stable：如果overflow不是visible，预留空白位置，这样滚动条出现的时候，整个结构和布局是稳定的
- both-edges：两侧都留好空白，这个是为了能让内容居中对称


#### v-html中的class和tag样式生效
基于scss的的开发，需要用::v-deep来使得样式生效


#### 基于flex、grid布局的overflow
如果需要某个item占据最大的可用宽度，且内容溢出的时候overflow，可以用如下css了设置
```css
.item {
    flex: 1 1 0%;
    height: 0;
    overflow: auto;
}
```
这种情况下，浏览器会根据flex布局自动分配可用空间


#### 拖拽dom块不跟鼠标
业务开发过程中常常需要基于`某个区域`拖拽dom块，这种情况下，如果在这个dom上绑定了`mousemove`,`mouseup`事件，通常会造成dom不跟鼠标的现象，解决方式如下
1. 在区域dom内部绑定`mousedown`事件，事件处理程序上在document上绑定`mousemove`,`mouseup`事件
2. `mouseup`事件上执行clear操作，清除document上绑定的事件

document.body是全局存在的，所以不会造成不跟鼠标的情况（鼠标滑动的区域会一直在document区域内）


#### 位置信息属性
通常是鼠标信息携带，有如下属性值，都是只读的属性
- clientX 相对于`viewport`视口的x距离
- movementX `currentEvent.movementX = currentEvent.screenX - previousEvent.screenX` 两个事件之间的变化值
- offsetX 相对于`target node`和鼠标之间的x距离
- pageX 相对于`document`和鼠标x之间的距离，包含document不可见的部分
- screenX 相对于`全局global`，比方说展示是双屏幕、浏览器进行了缩放，都会影响

#### 文字换行信息属性
文字换行通常涉及到white-space属性，有如下属性值和释义
- normal 默认，忽略文本中的换行符，只有在text-box需要换行的时候，才换行
- nowrap 文字不换行
- pre 空白符被保存，只有在text中遇到换行符或者<br />的时候才换行
- pre-wrap 空白符保存，在text中遇到换行符、<br />和为了填充text-box的时候换行
- pre-line 和normal一样，但是遇到text中的换行符、<br />和为了填充text-box的时候会换行
- break-spaces 和pre-wrap属性一样，但是有如下需要注意的点
  - 空白符会占据空间，即使在文字的尾部
  - 每个空白符之间都存在换行的机会，即使是两个空白符之间
  - 空白符占据空间且不会挂起来，所以会影响盒子的固有大小，（`min-content`,`max-content`）

有如下表格总结white-space属性的表现
![](assets/white-space.jpg)




由于英文字符是不定长的，所以换行需要考虑的问题多，cjk文字是方块字，定长，容易换行。css属性涉及到`word-break`
- normal 默认
- break-all 为了防止overflow，可以在任何两个character之间break
- keep-all 西文表现和normal一样，但是cjk文字不许两个字之间break
- break-word 废弃中，是`overflow-wrap: anywhere`和`work-break: normal`的组合，会忽略overflow-wrap的实际属性值


为了处理文字之间的break，css还引入和`overflow-wrap`属性
- normal 只能在正常的break点break，如两个words之间的空白
- anywhere 为了不overflow，如果一行中没有可以break的时机，那么，可是随意break，且不加连字符。`min-content`属性可以让text soft wrap。
- break-word 和anywhere一样，但是soft wrap不考虑`min-content`属性


### 布局
对于h5 app而言，目前常见的布局方式是典型的header-body-footer的结构，其中header、footer是固定吸附的，中间的body部分可以滚动展示更多的内容。这种情况下，sticky属性能很好得实现。


#### sticky无效
position: sticky是relative和fixed的混合定位模式，sticky元素被DOM当做relative元素对待，直到它超过一个特定threshold的值，这个值是由top、
left、right、bottom决定的

所以一个sticky元素生效的条件有（当然在浏览器兼容的条件下）
- 必须标注top等属性
- overflow matters
  - 任何祖先元素都不能设置overflow元素，那么sticky基于window进行sticky
  - 任何一个祖先元素同时设置和overflow: auto / scroll 和height，那么sticky元素基于该祖先元素进行sticky
- 如果一个祖先元素设置了height属性，那么sticky相对于该祖先元素sticky，待该祖先元素移出视口的时候，sticky一同被移出
