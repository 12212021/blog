### 设计稿转换
一般而言设计稿会基于一个固定的宽度来设计页面，比方说750px，这个时候为了适配不同屏幕大小的手机，需要将绝对单位px转为相对单位rem或者vw

#### Sass/Less
```sass
$ui-width: 375px;

@function px2vw($px) {
    @return $px / $ui-width * 100vw;
}

#sidebar {
    width: px2vw(50px);
}
```
这种方式的可读性还行，但是存在以下缺点
- px必须转换为px2vw函数调用，略显繁琐
- 如果要放弃这种方式，修改麻烦，扩展性比较低，不容易维护
- 不能转style内联样式

#### Postcss plugin
postcss有postcss-px-to-viewport和postcss-px-to-rem等插件，可以帮助开发人员进行单位转换。插件可以细粒度的控制选择器、属性、属性值等，
但是因为是postcss插件，只能处理css值，没有办法处理style内联样式

#### webpack自定义loader
可以通过编写自定义loader的方式来进行css单位的转换
