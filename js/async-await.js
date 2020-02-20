/* 
async能够将异步的代码转化为同步书写的方式
更符合人类的使用习惯 
*/
async function getBookByAuthorWithAwait(authorId) {
    const books = await bookModel.fetchAll();
    return books.filter(b => b.authorId === authorId);
}

// Promise case
function getBookByAuthorWithAwait(authorId) {
    return bookModel
        .fetchAll()
        .then(books => books.filter(b => b.authorId === authorId));
}

/* 
async函数保证了函数一定会返回一个Promise
但是一个Promise函数并不一定会返回一个Promise
在这个情况下，如果authorId是falsy值，函数返回一个null

async函数会将这个null自动包装为一个Promise
caller总能能安全地调用then、catch函数
 */
function getBookByAuthorWithAwait(authorId) {
    if (!authorId) {
        return null;
    } else {
        return bookModel
            .fetchAll()
            .then(books => books.filter(b => b.authorId === authorId));
    }
}

/* 
避免代码太同步 
*/
// bad case
async function getBookAndAuthor(authorId) {
    const books = await bookModel.fetchAll();
    const author = await bookModel.fetchAll(authorId);
    return {
        author,
        books: books.filter(b => b.authorId === authorId),
    };
}
// good case 
async function getBookAndAuthor(authorId) {
    const booksPromise = bookModel.fetchAll();
    const authorPromise = bookModel.fetchAll(authorId);
    // 保证了两个请求几乎同时发起，节省fetch数据的时间
    const books = await booksPromise;
    const author = await authorPromise;
    return {
        author,
        books: books.filter(b => b.authorId === authorId),
    };
}

/* 
Error handing
利用try...catch来捕获错误
1、在await中直接处理这个错误，并且返回一个Value
2、直接throw it，希望caller来处理它。可以直接throw一个新的error
或者直接throw new Error(error)这样能够给caller一个完整的错误调用栈
3、return Promise.reject(error)等同于throw一个error，不推荐
4、因为await后的表达式返回一个Promise，所以也可以使用catch语句来捕获所有的错误。
 */



// 这是一个模拟的http请求
const getId = () => {
    return new Promise((resolve, reject) => {
        let id = {
            name: 'yuchi',
            age: 12
        };
        let errorMsg = 'http requests error, code 404';
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve(id);
            } else {
                reject(errorMsg);
            }
        }, 1000)
    })
}


// 生成器函数 演示的是生成器是如何作为await、async函数的基础的
function* requestUserId() {
    try {
        // yeild关键字可以任务是await关键字的简化版
        // 在这个生成器函数中yeild将线程的控制权交还给mainThread函数（可以简单理解为主线程）
        /*
        await关键字还可以直接抛出非promise的数值，如await 100，但是await会自动将这个值包裹为一个Promise
        对于Promise而言直接直接返回这个promise，或者新创建个一个Promise，直接resolve接收到的Promise对象
         */

        // await 100情况如下
        /* 
        const res = yield (new Promise((resolve, reject) => {
            resolve(100);
        } ));
        */
        // await http请求，情况如下
        const res = yield (new Promise((resolve, reject) => {
            resolve(getId());
        }))
        console.log('this id user id message', res);
    } catch (err) {
        console.log(err, 'from main Thread');
    }

}

const mainThread = () => {
    let it = requestUserId();
    
    // 下面部分代码的执行都是async、await关键字来实现了，对于用户而言是不可见的，体现了语法糖的本质
    // 执行到yeild关键字的右半边部分 拿到相关的Promise对象
    let ajaxPromise = it.next().value;
    // 通过next、throw方法将线程的控制权返还给子协程（requestUserId）
    ajaxPromise.then(res => {
        it.next(res)
    }).catch(err => {
        it.throw(err);
    })
}

// async、await关键字是语法糖，它是由Promise、Iterator、generator三个语言层面的特性来实现异步代码采用同步的方式来书写

mainThread();
