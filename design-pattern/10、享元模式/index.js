/*
享元模式是一种提高性能，减少js中存在对象的模式
核心： 用共享技术来有效支持大量细粒度的对象，减少内存占用

享元模式需要将对象的状态（属性）划分为内部状态和外部状态，以内部状态来生成对象

内部状态和外部状态的区分标准（参考）
1.内部状态存储在对象的内部
2.内部状态可以被一些对象共享
3.内部状态独立于应用场景，通常不会发生变化
4.外部状态依赖的应用场景，并且根据场景进行变化，外部状态不能够被共享

备注：对象占据的空间比其他原始数据结构大一些，js不区分，参考C#的object和struct
*/




/*
case: js支持上传

浏览器插件上传、Flash上传两种模式
上传信息包括文件名，文件路径、文件大小


这里，将插件上传、flash上传划分为内部状态，将文件其他的信息划分为外部状态
*/

class PluginUpload {
    upload(filename, fileszie) {
        console.log(`${filename}: size > ${fileszie} upload success by plugin!`);
    }
}

class FlashUpload {
    upload(filename, fileszie) {
        console.log(`${filename}: size > ${fileszie} upload success by flash`);
    }
}


/*
 * @{param} flash | plugin
 * @{return} 返回单例
*/
function uploadTypeFactory(type) {
    let plugin = null;
    let flash = null;
    if (type === 'plugin') {
        if (!plugin) {
            plugin = new PluginUpload();
        }
        return plugin;
    }
    if (!flash) {
        flash = new FlashUpload();
    }
    return flash;
}

/*
 * @{desc} 管理器类，负责剥离和组装内部状态和外部状态
*/
class UploadManager {
    constructor() {
        this.uploadDatabase = [];
    }

    add(id, uploadType, filename, filesize) {
        const flyWeightObj = uploadTypeFactory(uploadType);
        this.uploadDatabase.push({
            id,
            filename,
            filesize,
            upload: flyWeightObj
        });
    }

    upload() {
        for (const file of this.uploadDatabase) {
            file.upload.upload(file.filename, file.filesize);
        }
    }
}

const uploadManager = new UploadManager();

function startUpload(type, list) {
    let id = 0;
    for (const file of list) {
        uploadManager.add(++id, type, file.filename, file.filesize)
    }
    return uploadManager;
}


let manager = startUpload('plugin', [
    {
        filename: '1.txt',
        filesize: 3000
    },
    {
        filename: '2.txt',
        filesize: 4000
    },
    {
        filename: '3.txt',
        filesize: 3340
    },
    {
        filename: '4.txt',
        filesize: 8900
    }
]);

manager = startUpload('flash', [
    {
        filename: 'a.txt',
        filesize: 3000
    },
    {
        filename: 'b.txt',
        filesize: 4000
    },
    {
        filename: 'c.txt',
        filesize: 3340
    },
    {
        filename: 'd.txt',
        filesize: 8900
    }
]);

manager.upload();



/*
减少对象的创建除了享元模式，还有对象池技术

对象池技术：维护一个装载空闲对象的池子，如果需要对象的时候，不是直接new，而是从池子中获取
HTTP连接池和数据库连接池都是对象池技术的经典应用
*/
