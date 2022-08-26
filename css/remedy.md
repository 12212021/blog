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
