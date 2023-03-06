mouseEvent的各种坐标
- mouseEvent.x是mouseEvent.clientX的alias，Y同理
- clientX/Y是相对于page可见部分，通过browser window来观察
- pageX/Y是相对于渲染的page，包括因为滚动而被隐藏的部分
- screenX/Y是相对于physical screen（大部分情况下是不需要的）

如图所示
![](../assets/mouseEvent-point.png)
