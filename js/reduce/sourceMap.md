## sourceMap概览

### Why sourceMap
大部分js源代码都要经过"转换"才能投入使用，主要是为了以下几种情况
- 压缩文件，减少文件体积
- 合并文件，减少Http请求的数量
- 其他语言编译成js语言

这种情况使得js运行时代码与开发的时不同，造成debug困难，sourceMap为`编译后代码`和`源代码`之间提供映射关系，减少debug难度。


### 如何使用sourceMap
浏览器devtools面板中需要开启
1. Enable Javascript source maps
2. Enable CSS source maps

### webpack中的sourceMap
前置概念
- 内联：sourceMap字符串会以base64的形式插入sourceMappingURL中，不额外生成文件，`构建速度较快`
- 外部：生成以map为后缀名的文件，该文件可以存在于网络中或者本地，`构建速度比较慢`

常见sourceMap的种类
- source-map: 外部，可以准确查看构建后错误代码的信息和`源代码的错误位置`
- inline-source-map: 内部，可以准确查看构建后错误代码的信息和`源代码的错误位置`
- hidden-source-map: 外部，`不能追踪源代码的错误信息`，只能查看构建后代码错误信息
- eval-source-map:内联，每一个文件都生成对应的source Map，都在eval中，可以查看构建后代码错误信息和`源代码错误信息`
- nosources-source-map:外部，可以查看错误信息，但是没有错误代码的准确信息，没有任何`源代码信息`
- cheap-source-map:外部，错误代码准确信息和源代码的错误位置，但是忽略了具体的列
- cheap-module-source-map:外部，与`cheap-source-map`差不多，但是会将module的sourceMap一并引入

