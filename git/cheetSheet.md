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

`git reflog` 查看自己提交过的commit id

`git reset --hard <commit ID>` 切换到想去的commit id上面，不保留本次修改内容

`git reset --soft <commit ID>` 切换到想去的commit id上面，将本次改动文件存放到staged区域


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
```bash
git stash
git stash pop

(other)
git stash
git stash list # 查看暂存的工作区现场
git stash apply stash@{0} # 弹出栈中暂存工作区最上面的一个
git stash drop stash@{0} # 删除栈中暂存工作区最上面的一个
```


### 多人合作进行开发
```bash
git remote -v #显示远程分支的信息

git branch --set-upstream-to <branch-name> origin/<branch-name> #创建本地分支和远程分支的链接关系

```
多人协作的工作模式：
* `git push origin <branch-name>`推送自己的修改
* 如果推送失败，证明远程的分支比你本地的分支更新一些，需要先采用`git pull`进行合并，如果有冲突则解决冲突并在本地提交
* `git push origin <branch-name>`再次推送自己的修改


### git merge vs git rebase
```bash
# git pull = git fetch + git merge
# git pull --rebase = git fetch + git rebase
```

#### git merge

操作基本释义如下，有以下分支

![image.png](https://i.loli.net/2020/12/11/EQJ7z6CKvYcq4xa.png)

执行`git merge iss53`，git会将master和iss53分支的修改进行对照，git会使用这两个分支的末端节点（**C4和C5**）和两个分支**共同的祖先节点C2**做一个简单的三方合并（*如果存在冲突的话，解决冲突*），在master分支上生成一个新的节点（**C6**），同时master分支的指针指向该节点，效果如下图所示

![image.png](https://i.loli.net/2020/12/11/bnMoNaG7jEVqs8S.png)

#### git rebase

有如下分支

![image.png](https://i.loli.net/2020/12/11/A7IMl9byc1gZPhj.png)

执行以下的命令`git switch experiment`和`git rebase master`，git会找到当前分支（expriment）和目标的基底分支（master）的**最近公共祖先（C2）**，然后将该分支相对于C2的数次提交存储为临时文件，将当前分支（expriment）指向基底分支（master）C3，最后将存储的临时文件依次应用，修改后如下

![image.png](https://i.loli.net/2020/12/11/kErq1oFGhlAn9D4.png)



#### 总结

1. git整合不同分支主要有两种方法`git merge`和`git rebase`
2. git rebase会将所有的提交整合成一条直线，看起来更加直观整洁
3. git merge会保留代码库原始提交记录，从中可以发现更多的信息


### 本地分支开发搁置许久，如何将本地的分支更新到最新分支
1、首先再远程机器上将master分支合并到特定的分支

2、git pull --rebase
