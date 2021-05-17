### 规范中如何定义延迟时间

- 如果设置的timer小于0，则设置为0
- 如果嵌套的层级超过了5层且timer设置小于4ms，则设置为4ms

### 浏览器实现

#### demo例子
```js
setTimeout(() => console.log(5), 5);
setTimeout(() => console.log(4), 4);
setTimeout(() => console.log(3), 3);
setTimeout(() => console.log(2), 2);
setTimeout(() => console.log(1), 1);
setTimeout(() => console.log(0), 0);
```

#### nodejs环境（node14）、chrome环境（90）、safari环境（14.1）

上面demo的输出 `1->0->2->3->4->5`

#### firefox环境

上面demo的输出 `0->1->2->3->4->5`


#### Chromium类浏览器实现

```c++
static const int maxIntervalForUserGestureForwarding = 1000; // One second matches Gecko.
static const int maxTimerNestingLevel = 5;
static const double oneMillisecond = 0.001;
// Chromium uses a minimum timer interval of 4ms. We'd like to go
// lower; however, there are poorly coded websites out there which do
// create CPU-spinning loops.  Using 4ms prevents the CPU from
// spinning too busily and provides a balance between CPU spinning and
// the smallest possible interval timer.
static const double minimumInterval = 0.004;

double intervalMilliseconds = std::max(oneMillisecond, interval * oneMillisecond);
if (intervalMilliseconds < minimumInterval && m_nestingLevel >= maxTimerNestingLevel)
    intervalMilliseconds = minimumInterval;
```
#### 结论
正常循环情况下，Chromium类浏览器设置timer的时间间隔最小是1ms

在nest嵌套循环下，所有浏览器设置最小时间间隔均为4ms



备注：https://juejin.cn/post/6846687590616137742
