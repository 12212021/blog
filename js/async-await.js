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