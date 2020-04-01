const http =require('http');

const server = http.createServer((req, res) => {
    // req -> IncomingMessage, 包含了http请求的一些消息
    // req分为请求头和请求体两个部分
    // 请求体通过http_parse解析之后，信息挂载在req的一些属性上
    console.log(req.url, req.httpVersion, req.method, req.headers);
    let buffers = [];
    let reqBody;
    // req的请求体是一个可读的流对象，通过下面的方式来解析出请求体内容
    req.on('data', trunk => {
        buffers.push(trunk);
    });
    req.on('end', () => {
        reqBody = Buffer.concat(buffers);
        console.log(reqBody.toString('utf8'));
    })


    // res -> ServerResponse，可以看做一个可写的流对象
    // res.end()先调用write函数写入消息，再发送信息给服务器终止此次通信
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('the first line');
    res.end('hello nodejs http!');
});

//底层是tcp服务，在tcp建立的时候会触发该事件
// http默认使用keep-alive:true作为请求头，复用tcp连接，所以同一个域名发送的多个http请求并不会多次触发该事件
server.on('connection', () => {
    console.log('http connected!');
});

// 每次http请求均会触发request事件
// 该事件的触发时机在http底层模块将请求抽象为req、res对象，在解析出req对象请求头之后触发
// 该回调函数相当于第三行createServer中的回调函数，二者相同
server.on('request', (req, res) => {
    console.log('request event fire!');
});

// 当http服务器手动关闭的时候会触发该事件
server.on('close', () => {
    console.log('all connection closed!');
});


server.listen(3000, 'localhost');