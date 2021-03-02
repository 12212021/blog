/**
 * 适配器模式类似于现实生活中的适配器，将一个自己无法控制或者不想去控制的接口通过适配器转化成符合要求的接口
 *
 * 适配器模式不是一开始就要使用的，往往是随着业务的发展，现有接口不能满足，则通过适配器来转接一下
 */



/*
case 调用地图展示，展示谷歌地图和百度地图

假设谷歌地图和百度地图之前都用show方法来展示地图，随着时间迭代，百度地图采用display来展示地图
*/

function showMap(baiduMap, googleMap) {
    baiduMap.show();
    googleMap.show();
}

const baidu = {
    display() {
        console.log('baidu map show');
    }
};

const google = {
    show() {
        console.log('google map show');
    }
};

/**
 *
 * 这里做了适配器，用来适配百度地图的接口
 */
const baiduMapAdaptor = {
    show() {
        baidu.display();
    }
}

showMap(baiduMapAdaptor, google);
