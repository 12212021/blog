# git 使用指南简介

##  创建git工作区间

### 初始化git工作区
`git init` 在当前目录下面生成.git隐藏文件夹，包含了git工作所需的全部信息

### git提交三连
`git add <filename>` 将文件从工作区提交到暂存区  

`git commit -m <filename>` 暂存区 -> 当前分支（一般是master分支）

`git push origin master` 将本地的master分支push到远程分支上面（origin为git中默认的远程分支名称）  


### git 工作区、暂存区、分支示意图
![git .jpeg](https://i.loli.net/2019/10/30/QzRwNJDK3nWkX5F.jpg)
工作区指当前你的工作目录

## git时光机穿梭

### 回到过去
`git log --pretty=oneline` 查看提交的历史，主要是为了查询commit ID 

`git reset --hard <commit ID>` 切换到想去的commit id上面 

### 回到未来
`git reflog` 查看自己提交过的commit id

`git reset --hard <commit ID>` 切换到想去的commit id上面


### 管理git修改
git跟踪管理的是修改而不是文件：

`git add 1.txt`
`git commit`

继续更改1.txt文件中的一些东西且再次进行add，第二次更改的内容并没有commit到相关的分支，如果需要第二次更改生效
需要再次

`git add 1.txt`
`git commit`


撤销修改：

`git checkout -- <filename>`:撤销工作区里面的更改

`git reset HEAD <filename>`:将暂存区的修改去除（HEAD代表了当前分支的最近的提交）

`git reset --hard <commit id>`:将分支中的一些修改丢弃


删除文件：

`git rm <filename>`

`git commit`

注：误删除文件的时候可以通过上述（撤销修改的三种方法来找回），但是没有放入的暂存区的文件是没有办法通过checkout来恢复的



## 远程仓库
需要配置git config文件，配置ssh公钥私钥

`git remote add origin <git-name>`：将本地的分支和远程分支进行关联

`git push -u origin master`:第一次推送，将本地的master分支和远程的master分支管理起来，之后可以用下面简化版本的推送命令

`git push origin master`:

## 分支管理策略
