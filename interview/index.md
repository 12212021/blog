#### 介绍下BFC及其应用
bfc是块级上下文，是页面盒模型的一个css渲染模式，相当于一个独立的容器，内部的元素和外部的元素互相都不干扰。

创建bfc的方式
- html根元素
- float
- absolutely position
- display: inline-block， table-cell等
- overflow不是visible
- display: flow-root, list-item（flow-root属性专门为创建BFC）
- contain: layout, content, strict
- flex items, grid items

bfc的作用
- 内部的Box会在垂直方向上一个接一个放置
- Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠
- 每个元素的 margin box 的左边，与包含块 border box 的左边相接触
- BFC的区域不会与float box重叠
- BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素
- 计算BFC的高度时，浮动元素也会参与计算


#### 如何让元素垂直水平居中
1、可以用flex、grid布局的方式

```css
.parent {
    position: relative;
}
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
}
```
块级元素的水平居中，margin为auto的时候会自动占据父容器的可用空间，所以利用margin的auto属性，可以轻松实现`块级元素`靠左、居中、靠右
```css
.parent {
    display: block;
}
.child {
    margin-left: auto;
    margin-right: auto;
}
```

块级元素的垂直居中
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


#### 分析比较opacity: 0、visibility: hidden、display: none 优劣和适用场景
都是使元素在视觉上不可见，但是有如下的不同点

1、display: none,让元素渲染树中移除，所有的子元素均不可见。会触发reflow。

2、visibility: hidden, 元素不会从渲染树中消失，继续占据空间，不可点击，会触发repaint，子元素如设置visible可见

3、opacity: 0,可以点击。触发reflow、repaint待研究


#### Retina屏幕的1px问题
基础问题
- 物理像素，设备像素，所谓的一倍屏、二倍屏、三倍屏是值多少个物理像素展示1个css像素
- 设备独立像素，css像素，是抽象单位
- 像素设备比，dpr = 物理像素 / 设备独立像素

所以说这里的1px在2倍屏幕下，应该是0.5px，一般而言，有下面几个方法来做
- 用图片来填边（不能代码修改颜色、不支持圆角）
- 用vw的方式来实现
- 伪元素先放大后缩小


vm方案代码
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" id="WebViewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>Document</title>
        <style type="text/css"></style>
    </head>
    <body>
        <script type="text/javascript">
            let viewport = document.querySelector('meta[name=viewport]')
            //下面是根据设备像素设置viewport
            if (window.devicePixelRatio == 1) {
                viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no')
            }
            if (window.devicePixelRatio == 2) {
                viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no')
            }
            if (window.devicePixelRatio == 3) {
                viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no')
            }
            function resize() {
                let width = screen.width > 750 ? '75px' : screen.width / 10 + 'px'
                document.getElementsByTagName('html')[0].style.fontSize = width
            }
            window.onresize = resize
        </script>
    </body>
</html>
```

伪元素代码
```css
.hairline{
  position: relative;
  &::after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    transform-origin: 0 0;
    background-color: #EDEDED;
  }
}
```

#### 长列表的渲染
- 可以采用虚拟列表的方式去渲染
  - 虚拟列表的每一项高度固定
  - 通过滚动的位置去渲染可视化的区域、以及上下的缓存区域
- 通过requestFrame API去分页加载，通过observable的浏览器接口去观测DOM是否在视口内，不在视口内的可以用visibility: hidden隐藏
- content-visibility、contain-intrinsic-size两个新的css属性去虚拟渲染


#### 如何实现深拷贝
- 浏览器的structuredClone原生方法
- 通过JSON.stringify、JSON.parse
  - 循环引用无法处理
  - function、bingInt、Symbol、Date等不能序列化的对象无法处理
- lodash的deepClone方法

#### React hooks的优势

#### useEffect、useLayoutEffect

#### 前端如何跨域
- JSONP通过script标签去跨域
  - 只能用get请求
- 通过img标签去跨域
- 通过CORS去跨域
- 通过iframe去跨域

