### webpack

#### webpack的核心概念
webpack是一个打包工具，将一个js application打包成一个bundle.js

- entry：webpack开始构建的入口文件
- output：如何命名输出文件、输出目录
- loaders：webpack只能处理js文件，无法处理非js文件，这时候需要loader转化模块为webpack能识别的模块
- plugins：更多的是优化，提取公共文件、压缩css/js/html，对对webpack的功能扩展
- mode：'development','production'等，依据不同的mode，webpack可以提供不同的能力
- chunk：webpack将代码打包为一个个chunk


#### loader
```javascript
const path = require('path');
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    module: {
        rules: {
            test: '/\.(png|jpg|gif)$/', // 正则匹配，依据文件名ext后缀来匹配相关loader
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]', // name代表图片原来的名字，hash代表hash码，ext代表文件的扩展名
                    outputPath: 'images/', // 图片会被打包到dist/images目录下面
                    limit: 102400 // 100kb 低于100kb的图片会被打包成base64码
                }
            }
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    }
}
```
