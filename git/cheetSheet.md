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

### 创建分支
`git checkout -b dev`相当于下面的两个命令
```
git branch dev
git switch dev
```
`git switch -c dev`
创建一个新的dev分支并切换到dev分支


### 合并分支
`git merge dev`:如果当前的分支是master分支，该操作表示将dev分支的内容合并到master分支

`git merge --no--ff -m "<merge info>" dev`：采用普通的合并策略将dev分支合并到当前的工作分支

注：没有 --no--ff参数的合并采用的是快速合并策略，不会携带dev分支上面的commit信息，加上这个参数之后就能够将dev的commit信息一块合并到master分支

`git cherry-pick <commit id>`：提交一些特定的commit到相关的分支

### 删除分支
`git branch -d dev`:删除dev分支，当前dev分支没有更改

`git branch -D dev`：强制删除dev分支，舍弃到dev分支的更改，相当于放弃merge操作

### BUG分支
当开发进行到一半的时候突然要在线上修复bug，可是当前的工作又没有完成，这时候可以执行下面的命令，暂存当前的更改
```git
git stash
git stash pop

(other)
git stash
git stash list // 查看暂存的工作区现场
git stash apply stash@{0} // 弹出栈中暂存工作区最上面的一个
git stash drop stash@{0} // 删除栈中暂存工作区最上面的一个
```


### 多人合作进行开发
```git
git remote -v //显示远程分支的信息

git branch --set-upstream-to <branch-name> origin/<branch-name> //创建本地分支和远程分支的链接关系

```
多人协作的工作模式：
* `git push origin <branch-name>`推送自己的修改
* 如果推送失败，证明远程的分支比你本地的分支更新一些，需要先采用`git pull`进行合并，如果有冲突则解决冲突并在本地提交
* `git push origin <branch-name>`再次推送自己的修改


### git rebase

