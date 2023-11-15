主要记录一下前端UI交互上的经验和杂谈

### 未分类

#### http请求竟态
在一些频繁触发http请求的页面上，如切换select选项触发请求、input输入文字触发请求
在这些场景下，需要考虑如下问题
- 接口的节流和防抖相关问题
- http请求竟态问题，这里用rxjs经验来看，区分为
  - switchMap总是获取最新
  - exhaustMap当前的请求不完成则忽略后续的请求

#### table相关
做table搜索页面的时候，有一些场景也要充分考虑
- 搜索结果为空，是不是要有自定义的页面空
- table展示组件可操作，操作完了如何反应到table的列表展示上（这里有一个状态同步的问题，具体问题具体分析）
- table组件需要给rowKey，不然多选没有办法正常工作且多选组件，同时key也是提升性能的一个关键变量
- table组件的page需要从1开始，如果从0开始，尽管已经拉取到dataSource的数据，但是table仍然会展示无数据


#### Popover、Tooltip
- 有一个getPopupContainer函数，参数是当前当前node节点，默认是渲染到body节点上的
  - 如果渲染到当前node的parentNode，那么滚动页面，popover会跟随滚动，但是受限于父节点的空间，再方位展示上可能存在一点问题
  - 如果默认body节点，有可能页面滚动，popover不跟随的情况

### vue

#### key妙用
vue中最常用key的场景就是v-for，但是vue会尽可能的复用已经存在的组件，如下场景
```vue
<div>
    <child-comp v-if="someCond"></child-comp>
    <child-comp v-else="someCond"></child-comp>
</div>
```
由于vue复用组件，这种情况下没有重新渲染child-comp，添加key可以有效解决该问题
