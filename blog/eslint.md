# eslint

### 背景
icode更新了eslint规范集合，废弃了fecs检查，引入eslint高版本的检查，自定义了部分检查规范集合，旧有项目更改之后上传到icode会引发代码规范错误，为了将这步骤提前到开发过程中，降低合入代码成本，引入部分vscode配置、npm包，部分配置文件，降低开发成本。

### 注意事项
1、更新vscode到最新的版本，node版本>=12
2、如果eslint插件不发挥作用，请禁用插件，再启用插件，或者重启vscode编辑器
3、icar项目中，优先将type=config的标签改写到export对象中的config属性，否则语法解析会发生问题
4、目前释放的规则较少，可根据项目迭代过程酌情增删eslint规则


### 插件链接

ecomfe规则github：https://github.com/ecomfe/eslint-config
eslint-plugin-vue规则： https://eslint.vuejs.org/rules/
eslint规则：https://eslint.org/

### vscode配置
项目的根目录下包含.vscode文件夹，文件夹内文件有
1、extensions.json
为用户推荐vscode插件，在插件窗口键入@recommended即可看到项目推荐安装的插件，安装即可

2、settings.json
项目配置，覆盖用户vscode默认配置，主要配置项如下
```json
{
    "[javascript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[vue]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "eslint.format.enable": true,
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "vetur.format.defaultFormatter.less": "prettier",
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "vue"
    ]
}
```

### npm包
npm install -D 引入如下安装包
1、eslint（eslint检查包）
2、@babel/eslint-parser、@babel/eslint-plugin、 @ecomfe/eslint-config（百度@ecomfe规则集合包）
3、eslint-plugin-vue（eslint针对vue的检查插件）
4、husky（git precommit钩子调用）
5、lint-staged（检查staged区域的文件）

### .eslintrc.js
```js
module.exports = {
    extends: [
        // 百度规范集合
        '@ecomfe/eslint-config',
        '@ecomfe/eslint-config/vue'
    ],
    rules: {
        // 自定义规则
        'comma-dangle': ['error', 'never'],
        'vue/html-self-closing': 0,
        'vue/return-in-computed-property': 0,
        'max-len': 0,
        'vue/max-len': ['error', {
            'code': 120,
            'template': 120,
            'tabWidth': 4,
            'ignoreUrls': false
        }],
        'vue/max-attributes-per-line': ['error', {
            'singleline': 1,
            'multiline': {
                'max': 1,
                'allowFirstLine': false
            }
        }]
    }
};

```

### .editorconfig
```
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 4
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```
该文件配合vscode的EditorConfig for VS Code插件，可以自动修复一些常见问题，强烈推荐安装

### .prettierrc.js
```js
module.exports = {
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    bracketSpacing: false,
    arrowParens: 'avoid',
    trailingComma: 'none',
    // 不缩进Vue文件的script、style tag
    vueIndentScriptAndStyle: false
}
```
prettier插件的配置文件，eslint可以动态调用prettier插件来格式化代码（eslint本身不具备格式化代码的能力），属于后备，当部分规则未被eslint定义的时候，该文件发挥作用

### staged lint配置
1、husky配置
```json
"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
```
2、lint-staged配置
```json
"lint-staged": {
    "linters": {
      "*": [
        "./node_modules/.bin/eslint --ext .js,.vue"
      ]
    },
    "ignore": [
      "src/assets/icons/*.css",
      "build/*",
      "compile_code/*",
      ".fecsrc",
      "mars.config.js",
      ".eslintrc.js",
      "package.json",
      "package-lock.json",
      "scripts/build.sh"
    ]
  }
```

### 使用过程
1、配合eslint插件，当书写不符合规范集合代码的时候，vscode出现提示信息，
![图片](https://agroup-bos-bj.cdn.bcebos.com/bj-6342298c2d62dbfa9c7132338f233f255a3d9de1)
可以快捷键command+.来单独修复此处的eslint错误或者通过option+shift+F来全局格式化代码。
2、可以通过`./node_modules/.bin/eslint --ext .js,.vue src --fix`来格式化src目录下所有的代码，威力无穷，慎用。
3、可以通过`./node_modules/.bin/eslint --ext .js,.vue src`来查看src目录下所有不符合eslint规范的文件以及错误行数

### ts、js混合项目
1、在devDependencies中新增@typescript-eslint/parser @typescript-eslint/eslint-plugin两个包
2、.eslintrc.js文件的配置如下
```js
module.exports = {
    parser: 'vue-eslint-parser',
    extends: [
        // 百度规范集合
        '@ecomfe/eslint-config',
        '@ecomfe/eslint-config/vue'
    ],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    rules: {
        // 数组或者对象最末元素不得有逗号
        'comma-dangle': ['error', 'never'],
        // 小程序view元素被识别为自定义元素需要自闭和，单view、text不支持自闭和
        'vue/html-self-closing': 0,
        // eslint检测不到computed函数switch语句内的return，故关闭
        'vue/return-in-computed-property': 0,
        // 关闭max-len规则，启用vue/max-len规则，不检测style标签
        'max-len': 0,
        'vue/max-len': ['error', {
            'code': 120,
            'template': 120,
            'tabWidth': 4,
            'ignoreUrls': false
        }]
    }
};
```

### 附件
附件是基础的配置，可以根据团队或者个人风味酌情增删。
