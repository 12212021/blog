#### 一台电脑上使用github和公司代码
在.ssh文件夹下面新建两个key，一个是rsa、一个是ed25519，命令分别是
`ssh-keygen -t rsa -C "yujianghua@corp.netease.com"`,`ssh-keygen -t ed25519 -C "12212021@bjtu.edu.cn"`


在该文件下新建config文件，写入如下配置
```ini
# git
Host g.hz.netease.com/
HostName g.hz.netease.com/
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa

# github
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_ed25519
```


#### node版本切换工具n配置
```ini
# npmrc文件
registry=https://registry.npmmirror.com
sass_binary_site=https://npmmirror.com/mirrors/node-sass/
phantomjs_cdnurl=https://npmmirror.com/mirrors/phantomjs/
electron_mirror=https://npmmirror.com/mirrors/electron/
sqlite3_binary_host_mirror=http://npmmirror.com/mirrors/
profiler_binary_host_mirror=http://npmmirror.com/mirrors/node-inspector/
chromedriver_cdnurl=https://npmmirror.com/mirrors/chromedriver
sentrycli_cdnurl=https://npmmirror.com/mirrors/sentry-cli/
sharp_binary_host="https://npmmirror.com/mirrors/sharp"
sharp_libvips_binary_host="https://npmmirror.com/mirrors/sharp-libvips"

# n配置文件
export N_NODE_MIRROR=https://npmmirror.com/mirrors/node/
export N_PRESERVE_NPM=1
export N_PREFIX=$HOME/.n
export PATH=$N_PREFIX/bin:$PATH
```
