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
要设置文字溢出的...效果，下面的五个条件都必须具备
```css
span {
    white-space: nowrap;
    display: block; /* inline-block也可以 */
    width: 100px; /*max-width属性同样能够生效，百分比是不生效的*/
    overflow: hidden; /*明确不同于visible属性，一般用hidden*/
    text-overflow: ellipsis;
}
```

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



### margin居中

#### 水平居中
- 块级元素（display: block）
- margin-left: auto
- margin-right: auto

margin为auto的时候会自动占据父容器的可用空间，所以利用margin的auto属性，可以轻松实现`块级元素`靠左、居中、靠右

#### 垂直居中
其中top、right、left、bottom属性必须设置为0
```css
div {
    width: 200px;
    height: 100px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0
    margin: auto;
}
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



### sticky无效
position: sticky是relative和fixed的混合定位模式，sticky元素被DOM当做relative元素对待，直到它超过一个特定threshold的值，这个值是由top、
left、right、bottom决定的

所以一个sticky元素生效的条件有（当然在浏览器兼容的条件下）
- 必须标注top等属性
- overflow matters
  - 任何祖先元素都不能设置overflow元素，那么sticky基于window进行sticky
  - 任何一个祖先元素同时设置和overflow: auto / scroll 和height，那么sticky元素基于该祖先元素进行sticky
- 如果一个祖先元素设置了height属性，那么sticky相对于该祖先元素sticky，待该祖先元素移出视口的时候，sticky一同被移出



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


### BFC：block formatting context
创建BFC
- float
- absolutely position
- display: inline-block， table-cell等
- overflow不是visible
- display: flow-root, list-item（flow-root属性专门为创建BFC）
- contain: layout, content, strict
- flex items, grid items

BFC的作用
- margin collapsing只能发生在一个BFC内部，可以隔绝BFC之间的margin塌陷
- float回脱离文档，但是BFC能够“包含”内部float元素
- BFC能够隔绝不属于自身的float元素


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
