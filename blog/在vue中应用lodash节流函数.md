### vue应用节流函数debounce

背景：在业务中遇到这样的一个问题，需要对input输入框输入内容，动态地请求后端接口。为了节约后端资源，需要对input输入框进行防抖操作。


#### 模板上应用节流
基本思路：
```vue
<template>
    <input @change="_.debounce(handler, 200)">
</template>
```
但是这个存在一些列的问题：当用户输入的时候，这时候控制台会报错：“Property or method "_" is not defined on the instance but referenced during render.”
这是因为vue中模板的编译环境是受限的，仅能访问实例上变量、handler少数变量，所以会报错。

针对这个问题，我们可以更新代码如下
```vue
<template>
    <button @click="lodash.debounce(handler, 200)">click</button>
    <div>{{age}}</div>
</template>
<script>
import _ from 'lodash';
export default {
    data() {
        return {
            lodash: _,
            age: 0
        }
    },
    methods: {
        handler() {
            this.age = this.age + 1;
        }
    }
}
</script>
```
解决了lodash的引用问题，但是代码并没有像我们预期的那样执行。当用户点击button的时候，执行的函数可以简单理解为下面代码中的debounceWrapper，
但是我们期望当用户单击的时候，被执行的函数是debouncedFunc（由lodash返回的函数）
```js
let debounceWrapper = () => _.debounce(handler, 200);
let debouncedFunc = debounceWrapper();
```

针对这个问题，Vue模板支持IIFE立即执行函数，所以我们可以更新我们的代码如下
```vue
<template>
    <button @click="(() => lodash.debounce(handler, 200))()">click</button>
    <div>{{age}}</div>
</template>
```

注意：lodash函数被导出为一个函数，所以挂载在data对象里面的消耗很小，只会增加一层get、set函数，如果库用对象的方式来组织，
这时会Vue会生成大量的get、set函数，对内考验会增加。
![image.png](https://i.loli.net/2020/08/21/xfU7GmeFit4CAuy.png)


### 在methods上应用debounce
```vue
<template>
    <div class="about">
        <button @click="handler">test</button>
        <div>{{name}}</div>
    </div>
</template>

<script>
import _ from 'lodash';
export default {
    data() {
        return {
            name: 'bob'
        };
    },
    methods: {
        handler: _.debounce(() => {
            // Uncaught TypeError: Cannot set property 'name' of undefined
            this.name = 'mary';
        }, 2000)
    }
};
</script>
```

Vue在组件编译的阶段，直接执行_.debounce(func, 200)返回一个debounced函数；Vue的method中的方法在调用的时候，Vue会将this自动绑定到组件实例上，
debounced函数在执行的时候会后会调用invokeFunc，invokeFunc通过func.apply的方式来调用，箭头函数是没有办法this的。

lodash的debounce函数返回一个debounced函数，部分源码摘录如下。
```js
function debounce(func, wait, options) {
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime

  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function')

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time

    // 调用这里，箭头函数不同通过apply来绑定this
    result = func.apply(thisArg, args)
    return result
  }

  /* ... */

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export default debounce
```

为啥这里会报undefined的错误呢？这个this到底是什么？我们不妨把ladash的代码抄录过来如下,
可以看到，箭头函数作为参数来传递，它的this指向外层普通函数的this（词法静态作用域），从箭头函数定义的位置来看，最外层指向了script标签，这里的this自然也就是undefined
```vue
<script>
import _ from 'lodash';
export default {
    data() {
        return {
            name: 'bob'
        };
    },
    methods: {
        handler: (function(() => {
            // 自定义的函数
        }, 2000) {
            /* ... */
            function debounced() {
                /* ... */
            };
            return debounced;
        })()
    }
};
</script>
```


正确的使用方式为
```vue
<script>
import _ from 'lodash';
export default {
    data() {
        return {
            name: 'bob'
        };
    },
    methods: {
        handler: _.debounce(function() {
            this.name = 'mary';
        }, 2000)
    }
};
</script>
```