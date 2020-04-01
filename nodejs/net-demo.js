const net = require('net');
const serve = net.createServer((socket) => {
    socket.on('close', () => {
        console.log('tcp socket 完全关闭');
    });
    //默认的情况下，socket会启用Nagle算法，每次socket.write()的时候并不会立即发送数据，而是选择将
    // 很多小的数据包合并为一个大的数据包直接发送出去，该设置能保证每次write之后立即发送数据包
    socket.setNoDelay(true);

    // 如果当前socket设置了encode编码，读取出来的数据则不是buffer
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
        console.log('received buffer: ', data);
        socket.write('你好');
    });

    socket.on('end', () => {
        console.log('socket的另一端关闭了');
    });

    socket.setTimeout(3000);
    socket.on('timeout', () => {
        console.log('该socket套接字已经长时间不活动了！');
    })
});

serve.on('error', (err) => {
    throw err;
});

// tcp服务端关闭（一般都是手动关闭）的时候会触发该事件，如果此时尚有连接存在，会等待
// 所有的连接都关闭的时候触发事件
serve.on('close', () => {
    console.log('tcp服务端关闭');
});

serve.on('connection', () => {
    console.log('有socket套接字连接');
});

serve.listen(3000, 'localhost');