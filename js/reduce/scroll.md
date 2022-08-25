#### window中scroll相关属性
- window.scrollX(window.pageXOffset)代表了window x轴上滚动的距离
- window.scrollY(window.pageYOffset)代表了window y轴上滚动的距离
- widow.scrollTop会返回window.scrollY的值

#### scroll相关方法
scroll()方法和scrollTo方法是一样的，代表需要滚动的位置的`绝对距离`,基于pixel的


scrollBy()方法代表基于当前位置，`相对滚动距离`


scrollBy和scroll、scrollTo的方法签名相同，如下
```js
scroll(x-coord, y-coord);
scroll(options)
```
期中options代表
```js
options = {
    top: 0, // y轴距离
    left: 0, // x轴距离
    behavior: 'smooth'
    /*
    smooth: 代表滚动丝滑，加动画
    instant: 代表立即滚动，不需要动画
    auto: 浏览器默认
    */
}
```


#### scrollTop
Element.scrollTop获取element垂直方向上的距离，能够被设置，被设置后，浏览器会在y轴上进行滚动


scrollTop有一些需要注意的小问题
- 如果元素不能滚动(eg 没有overflow或者设置element的property为「no-scrollable」)，scrollTop是0
- scrollTop永远不会是负值，如果被设置为负值，自动转化为0
- 如果给scrollTop设置的值大于其最大值，则scrollTop自动会被设置为最大值

#### 通过锚点来快速定位



#### 备注
- window窗口的滚动，可以用window.scroll()、window.scrollBy()进行；也可用设置html元素的scrollTop属性
- Document.scrollingElement代表了html元素
- Document.documentElement也代表了html元素
