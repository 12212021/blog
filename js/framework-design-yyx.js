// 框架设计的取舍

/* 
1、Scope
react（自下向上）：react的职责很小，这也是react被称为一个UI库的原因，react仅仅关心如何将数据渲染为vdom，
这种设计是一种自下向上的设计，这是react生态非常好的原因，其余像状态管理、路由等核心库，都交给了社区来做。
优点：学习react的曲线非常平缓（仅仅指react视图库），react的概念也非常少。react的核心研发团队更多地关注于
视图库这个东西，所以能够提出更多创新的东西（Hooks），同时，因为react提供的是比较底层一下的东西，所以在react
上面进行扩展是比较容易的。
缺点：生态太多，在选取react的最佳取舍上面会比较难。

Angular（自上向下）：angular的职责很大，是一个正儿八经的框架，很多东西（像动画效果、表单验证等都做好了封装）。
优点：框架大而全，很多情况下，你只需要关注官方文档，你就能够找到你要解决的问题的“最佳实践”。但是概念比较多，抽象程度
相较于react也要高很多，学习的曲线是比较陡峭的。
缺点：灵活度不够，在angular上想要扩展一个自己想用的东西是非常困难的，因为angular是作为一个整体进行设计的，牵一发而动全身。


Vue（在react和angular的中间位置）：官方提供了一套router、vuex状态管理库的实现，当然你也可以使用自定义的实现。 
*/




/* 
2、render mechanism
react：JSX，拥有js全部的灵活性，但是做了多余的计算。像下面的例子，
从tempalate中能够明显地看出只有第三个p标签的message进行了数据绑定，
但是在进行vdom patch-diff的时候，必须要遍历整个模板再做diff工作，
标准vdom的代价是相对于视图的大小的，而不是可改变节点的数量。
<template>
    <div className="content">
        <p className="text">Lorem ipsum</p>
        <p className="text">Lorem ipsum</p>
        <p className="text">{{message}}</p>
        <p className="text">Lorem ipsum</p>
        <p className="text">Lorem ipsum</p>
    </div>
</template>


SVELTE：整个框架采用模板编译，模板实际上是一种受限的语法，编译器能够通过模板来预测用户更多的行为。
<h1>Hello {name}!</h1>
能够被编译为如下的函数：
p(changed, ctx) {
    if (changed.name) {
        set_data(t1, ctx.name);
    }
}
所有的内容都是静态的，是有name可能会发生变化，p是一个updated函数，唯一的作用就是在name发生变化的时候，
更新dom中name的值。
模板编译丧失了js的灵活性，你必须受限于模板的语法。


Vue（3.0）：默认采用模板编译，编译器能够根据受限的模板语法对视图进行优化，同时也提供render function的方式来
渲染视图。 
*/