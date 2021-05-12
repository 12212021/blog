#### Vue为何不能用index做key的原因

- 性能问题，vue依赖key作为vNode的标示，key从语义上来讲应该唯一代表这个vnode，index代表的是vnode的位置信息
- 一些情况下会发生错误，具体例子如下

```vue
<template>
  <div>
    <ul>
      <li v-for="(value, index) in arr" :key="index">
        <test/>
      </li>
    </ul>
    <button @click="this.handleDelete">delete</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      arr: [1, 2, 3]
    };
  },
  methods: {
    handleDelete() {
      this.arr.splice(0, 1);
    }
  },
  components: {
    test: {
      template: "<li>{{Math.random()}}</li>"
    }
  }
};
</script>
```

附录Vue源码如何判断两个vnode是相同的node
```js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```
