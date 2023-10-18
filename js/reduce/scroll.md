### window中scroll

#### window中的scroll属性
- window.scrollX(window.pageXOffset)代表了window x轴上滚动的距离
- window.scrollY(window.pageYOffset)代表了window y轴上滚动的距离
- widow.scrollTop会返回window.scrollY的值

#### 备注
- window窗口的滚动，可以用window.scroll()、window.scrollBy()进行；也可用设置html元素的scrollTop属性
- Document.scrollingElement代表了html元素
- Document.documentElement也代表了html元素

### scroll相关方法
- scroll()方法和scrollTo方法是一样的，代表需要滚动的位置的`绝对距离`,基于pixel的
- scrollBy()方法代表基于当前位置，`相对滚动距离`


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



### scroll事件
通常用户需要通过scroll事件结束的时候去发起一些用户的操作，scroll事件是不断触发的，js端常用的策略，比如说触底请求，代码如下
```js
const scrollTable = _.debounce(function (e) {
            const target = e.target;
            const { scrollTop, clientHeight, scrollHeight } = target;
            // 滚动触底
            if (clientHeight + scrollTop >= scrollHeight - 40 && !this.loadingAppendTable) {
                this.scrollTop = scrollTop;
                const body = this.getUserSearchBody();
                this.loadingAppendTable = true;
                service.scrollTable(body);
            }
        }, 200),
```
这种策略通常认为如果200ms内没触发scroll事件，则认为scroll事件完成了。是一个不稳定的策略，同时**当element的大小发生变化的时，也可能会触发scroll事件，这是意料之外**，也需要进行处理


在chrome111版本上，带来了`scrollend`事件，该事件代表了用户的滚动操作完成，再如下的情况下面触发
- The browser is no longer animating or translating scroll.
- The user's touch has been released.
- The user's pointer has released the scroll thumb.
- The user's keypress has been released.
- Scroll to fragment has completed.
- Scroll snap has completed.
- scrollTo() has completed.
- The user has scrolled the visual viewport.

在如下的情况下不触发
- A user's gesture did not result in any scroll positional changes (no translation occurred).
- scrollTo() did not result in any translation.

`scrollend`事件能够很好地满足需求，当用户的scroll操作完成后，去做一些事情，但是目前该事件的兼容性存在问题，使用该事件可以用如下的方式
```js
if ('onscrollend' in window) {
  document.onscrollend = callback
}
else {
  document.onscroll = event => {
    clearTimeout(window.scrollEndTimer)
    window.scrollEndTimer = setTimeout(callback, 100)
  }
}
```

