#### 如何判断一个函数是被普通调用还是通过new来调用
```js
function foo() {
    // 普通调用 new.target为undefined；new调用该值为foo
    if (new.target) {
        console.log('call by new', new.target === foo)
    }

    // obj instanceof constructor
    if (this instanceof foo) {
        console.log('call by new')
    }

    // 查看对象的构造函数是否为该函数
    if (this.constructor === foo) {
        console.log('call by new')
    }
}

new foo();
```


#### 原型链基础
![image.png](https://i.loli.net/2021/03/23/L1XjPlvADJguw8k.png)

注意点
- 函数才有prototype属性，对象没有
- 浏览器会在对象上暴露一个__proto__属性，指向对象的原型
- Object.setPrototypeOf()会严重影响应能，修改继承关系微妙且深远，可以通过Object.create来指定对象原型
- this只能够在函数或者method中访问，箭头函数没有自己的this，只能访问自己上一层环境（function、method、module顶层环境、window顶层环境）



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
