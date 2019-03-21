/**
 * @file 不同坐标系的坐标点转换，计算网格编号，范围
 *  该文件定义了以下方法：
 *      1. 百度坐标系 (BD-09) 到 火星坐标系 (GCJ-02)的转换
 *      2. 火星坐标GCJ02 转换为 WGS84
 *      3. 百度坐标转化为wgs坐标
 *      4. 火星坐标系 (GCJ-02) 到百度坐标系 (BD-09) 的转换
 *      5. WGS84转GCj02
 *      6. wgs坐标转化为百度坐标
 *      7. 转换经度
 *      8. 转换纬度
 *      9. 判断是否在国内，不在国内则不做偏移
 *      10. 通过wsg坐标和tileLevel获取tileID
 *      11. 根据tileId和tileLevel获取tile中心点坐标
 *      12. 根据中心点坐标和tileLevel获得tile盒子边界点坐标,并将坐标转化为百度坐标
 *      13. 输入一个百度坐标，得到这个坐标所在tile盒子的左下角和右上角的百度坐标,并获取盒子的宽和高
 * @author wangchunhong<wangchunghong@baidu.com>
 */


// 定义一些常量
let xPI = 3.1415926535897932384626 * 3000.0 / 180.0;
let PI = 3.1415926535897932384626;
let constA = 6378245.0;
let constEE = 0.00669342162296594323;

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param {number} lng 经度 0到180度之间
 * @param {number} lat 纬度 0到90度之间
 * @return {boolean} true 国外坐标 false 国内坐标
 */
export const outOfChina = function (lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
};
// 获取一个数的某一个bit位
export const getBit = function (num, bit) {
    return (num >> (bit)) & 1;
};
// 转换经度
export const transformlat = function (lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(
        lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret;
};
// 转换纬度
export const transformlng = function (lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
};

/**
 * 百度坐标系 (BD-09) 到 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param {Object} point 转换前的BD-09坐标系的坐标点
 * @return {Object} 转换后的GCJ02坐标系的坐标点
 */
export const bd09togcj02 = function (point) {
    let lng = point.lng;
    let lat = point.lat;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI);
    let ggLng = z * Math.cos(theta);
    let ggLat = z * Math.sin(theta);
    return {
        lng: ggLng,
        lat: ggLat
    };
};

/**
 * 火星坐标GCJ02 转换为 WGS84
 * @param {Object} point 转换前的GCJ02坐标系的坐标点
 * @return {Object} 转换后的WGS84坐标系的坐标点
 */
export const gcj02towgs84 = function (point) {
    let lng = point.lng;
    let lat = point.lat;
    if (outOfChina(lng, lat)) {
        return {
            lng: lng,
            lat: lat
        };
    } else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = lat / 180.0 * PI;
        let magic = Math.sin(radlat);
        magic = 1 - constEE * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((constA * (1 - constEE)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (constA / sqrtmagic * Math.cos(radlat) * PI);
        let mglat = lat + dlat;
        let mglng = lng + dlng;
        return {
            lng: lng * 2 - mglng,
            lat: lat * 2 - mglat
        };
    }
};

/**
 * 百度坐标系 (BD-09) 到 WGS84坐标系的转换
 * @param {Object} point 转换前的BD-09坐标系的坐标点
 * @return {Object} 转换后的WGS84坐标系的坐标点
 */
export const bd09towgs84 = function (point) {
    let GCJ02Point = bd09togcj02(point);
    let WGS84Point = gcj02towgs84(GCJ02Point);
    return WGS84Point;
};

/**
 * 火星坐标系 (GCJ-02) 到百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param {Object} point 转换前的GCJ-02坐标系的坐标点
 * @return {Object}  转换后的BD-09坐标系的坐标点
 */
export const gcj02tobd09 = function (point) {
    let z = Math.sqrt(point.lng * point.lng + point.lat * point.lat) + 0.00002 * Math.sin(point.lat * xPI);
    let theta = Math.atan2(point.lat, point.lng) + 0.000003 * Math.cos(point.lng * xPI);
    let bdLng = z * Math.cos(theta) + 0.0065;
    let bdLat = z * Math.sin(theta) + 0.006;
    return {
        lng: bdLng,
        lat: bdLat
    };
};

/**
 * WGS84坐标系 到火星坐标系GCJ02 的转换
 * 即谷歌、高德 转 百度
 * @param {Object} point 转换前的WGS84坐标系的坐标点
 * @return {Object}  转换后的火星坐标系GCJ02的坐标点
 */
export const wgs84togcj02 = function (point) {
    let lng = point.lng;
    let lat = point.lat;
    if (outOfChina(lng, lat)) {
        return {
            lng: lng,
            lat: lat
        };
    } else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = lat / 180.0 * PI;
        let magic = Math.sin(radlat);
        magic = 1 - constEE * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((constA * (1 - constEE)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (constA / sqrtmagic * Math.cos(radlat) * PI);
        let mglat = lat + dlat;
        let mglng = lng + dlng;
        return {
            lng: mglng,
            lat: mglat
        };
    }
};

/**
 * WGS84坐标系 到百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param {Object} point 转换前的WGS84坐标系的坐标点
 * @return {Object} 转换后的BD-09坐标系的坐标点
 */
export const wgs84tobd09 = function (point) {
    let gcj02Ponit = wgs84togcj02(point);
    let bd09Point = gcj02tobd09(gcj02Ponit);
    return bd09Point;
};

/**
 * 通过wsg坐标和tileLevel获取tileID
 * @param {Object} point WGS84坐标系的坐标点，含经度和纬度
 * @param {number} tileLevel 网格层级，1，2，3……
 * @return {number} tileID 该层级下的所属网格编号
 */
export const wgsToTileID = function (point, tileLevel) {
    let ix = point.lng / (90.0 / (1 << 30));
    let iy = point.lat / (90.0 / (1 << 30));
    let tileID = getBit(ix, 31);

    for (let i = 30; i > (30 - tileLevel); --i) {
        tileID = tileID << 2;
        tileID |= getBit(iy, i) << 1 | getBit(ix, i);
    }
    return tileID;
};

/**
 * 根据网格编号tileId和网格层级tileLevel获取网格中心点坐标
 * @param {number} tileID 网格编号
 * @param {number} tileLevel 网格层级，1，2，3……
 * @return {Object}  该层级下的所属网格的中心点坐标（wgs84坐标系）
 */
export const getTileCenterWgs = function (tileID, tileLevel) {
    let lx = 0;
    let ly = 0;

    for (let i = (tileLevel - 1); i >= 0; --i) {
        lx <<= 1;
        lx |= getBit(tileID, i * 2);
        ly <<= 1;
        ly |= getBit(tileID, i * 2 + 1);
    }
    let centerX = (lx + 0.5) * 180 / (1 << tileLevel);
    let centerY = (ly + 0.5) * 180 / (1 << tileLevel);
    return {
        lng: centerX,
        lat: centerY
    };
};

/**
 * 根据网格中心点坐标（wgs84坐标系）和网格层级tileLevel获取网格tile盒子边界点坐标,并将坐标转化为百度坐标
 * @param {Object} centerPoint 网格的中心点坐标（wgs84坐标系）
 * @param {number} tileLevel 网格层级，1，2，3……
 * @return {Array}  该层级下的所属网格的四个角点的坐标（百度bd09坐标系）
 */
export const getTileBoxWgs = function (centerPoint, tileLevel) {
    let minx = centerPoint.lng - 0.5 * 180.0 / (1 << tileLevel);
    let miny = centerPoint.lat - 0.5 * 180.0 / (1 << tileLevel);
    let maxx = centerPoint.lng + 0.5 * 180.0 / (1 << tileLevel);
    let maxy = centerPoint.lat + 0.5 * 180.0 / (1 << tileLevel);
    let leftBottom = wgs84tobd09({
        lng: minx,
        lat: miny
    });
    let rightTop = wgs84tobd09({
        lng: maxx,
        lat: maxy
    });
    let leftTop = wgs84tobd09({
        lng: minx,
        lat: maxy
    });
    let rightBottom = wgs84tobd09({
        lng: maxx,
        lat: miny
    });
    return [leftBottom, rightTop, rightBottom, leftTop];
};

/**
 * 根据网格编号tileId和网格层级tileLevel获取网格信息，中心点，四角坐标，较长的长和宽
 * @param {number} tileID 网格编号
 * @param {number} tileLevel 网格层级，1，2，3……
 * @return {Object}  该层级下的所属网格的网格信息，网格编号，中心点，四角坐标，较长的长和宽
 */
export const getTielBoxByTileID = function (tileID, tileLevel) {
    let centerPoint = getTileCenterWgs(tileID, tileLevel);
    let tileBox = getTileBoxWgs(centerPoint, tileLevel);
    let leftBottom = tileBox[0];
    let rightTop = tileBox[1];
    let lngArr = [];
    let latArr = [];
    lngArr.push(leftBottom.lng);
    latArr.push(leftBottom.lat);
    lngArr.push(rightTop.lng);
    latArr.push(rightTop.lat);
    let maxlng = Math.max(...lngArr);
    let minlng = Math.min(...lngArr);
    let maxlat = Math.max(...latArr);
    let minlat = Math.min(...latArr);
    let latStep = maxlat - minlat;
    let lngStep = maxlng - minlng;
    let maxStep = Math.max(latStep, lngStep);
    let boxLength = {
        lngStep: lngStep,
        latStep: latStep,
        maxStep: maxStep
    };
    return {
        tileID: tileID,
        centerPoint: centerPoint,
        tileBox: tileBox,
        boxLength: boxLength
    };
};

/**
 * 给定一个百度坐标，得到这个坐标所在网格的网格信息，网格编号，中心点，四角坐标，较长的长和宽
 * @param {Object} bd09Point BD09坐标系的坐标点
 * @param {number} tileLevel 网格层级，1，2，3……
 * @return {Object}  该层级下的所属网格的网格信息，网格编号，中心点，四角坐标，较长的长和宽
 */
export const getTielBox = function (bd09Point, tileLevel) {
    let wgsPonit = bd09towgs84(bd09Point);
    let tileID = wgsToTileID(wgsPonit, tileLevel);
    return getTielBoxByTileID(tileID, tileLevel);
};

/**
 * 给定一个网格id和网格层级，得到这个网格的四邻域网格id
 * @param {num} tileId 网格id
 * @param {number} tileLevel 网格层级
 * @return {Object}  该网格四邻域网格id
 */
export const getFourNeighborhood = function (tileId, tileLevel) {
    let {
        centerPoint,
        boxLength
    } = getTielBoxByTileID(tileId, tileLevel);
    let boxWidth = boxLength.maxStep;
    let top = {
        lng: centerPoint.lng,
        lat: centerPoint.lat + boxWidth
    };
    let topTileid = wgsToTileID(top, tileLevel);
    let right = {
        lng: centerPoint.lng + boxWidth,
        lat: centerPoint.lat
    };
    let righTileid = wgsToTileID(right, tileLevel);
    let bottom = {
        lng: centerPoint.lng,
        lat: centerPoint.lat - boxWidth
    };
    let bottomTileid = wgsToTileID(bottom, tileLevel);
    let left = {
        lng: centerPoint.lng - boxWidth,
        lat: centerPoint.lat
    };
    let leftTileid = wgsToTileID(left, tileLevel);
    return {
        top: topTileid,
        right: righTileid,
        bottom: bottomTileid,
        left: leftTileid
    };
};

/**
 * 判断网格是否是边界
 *
 * @param {Object} tileArr 网格数组
 * @param {number} tileLevel 网格层级
 * @param {string} flag 网格城市边界、任务包边界标识符
 * @return {Object} 边界网格数组
 */
export const getBoundaryTile = function (tileArr, tileLevel, flag) {
    let boundaryTile = [];
    let indexFlag = flag;
    for (let tile of tileArr) {
        let bdFlag = false;
        if (tile.tileID) {
            tile.tile_id = tile.tileID;
        }
        let fourNeighborhood = getFourNeighborhood(tile.tile_id, tileLevel);
        for (let key in fourNeighborhood) {
            for (let child of tileArr) {
                if (Number(child.tile_id) === Number(fourNeighborhood[key])) {
                    // 适配项目边界、任务包边界
                    if (tile[indexFlag] !== child[indexFlag]) {
                        if (key === 'top') {
                            if (!child.bottom) {
                                tile[key] = true;
                            }
                        }
                        if (key === 'right') {
                            if (!child.left) {
                                tile[key] = true;
                            }
                        }
                        if (key === 'bottom') {
                            if (!child.top) {
                                tile[key] = true;
                            }
                        }
                        if (key === 'left') {
                            if (!child.right) {
                                tile[key] = true;
                            }
                        }
                        bdFlag = true;
                    }
                    break;
                }
            }
        }
        if (bdFlag) {
            boundaryTile.push(tile);
        }
    }
    return boundaryTile;
};

/**
 * 根据边界网格获取对应的网格边界点
 *
 * @param {Object} tileArr 网格id数组
 * @param {number} tileLevel 网格层级
 * @return {Object}  网格边界点数据
 */
export const getBoundaryPoint = function (tileArr, tileLevel) {
    let pointArr = [];
    for (let child of tileArr) {
        let {
            top,
            right,
            bottom,
            left
        } = child;
        let tileId = child.tile_id;
        let centerPoint = getTileCenterWgs(tileId, tileLevel);
        let tileBox = getTileBoxWgs(centerPoint, tileLevel);
        // console.log(tileBox);
        // [leftBottom, rightTop, rightBottom, leftTop]
        if (top) {
            getTilePointObj(pointArr, tileId, tileBox[3], tileBox[1]);
        }
        if (right) {
            getTilePointObj(pointArr, tileId, tileBox[1], tileBox[2]);
        }
        if (bottom) {
            getTilePointObj(pointArr, tileId, tileBox[2], tileBox[0]);
        }
        if (left) {
            getTilePointObj(pointArr, tileId, tileBox[0], tileBox[3]);
        }
    }
    return pointArr;
};

/**
 * 获取边界点坐标
 *
 * @param {Object} pointArr 点数组
 * @param {number} tileId 网格id
 * @param {Object} firstData 传入数据
 * @param {Object} secondData 传入数据
 */
export const getTilePointObj = function (pointArr, tileId, firstData, secondData) {
    let pointObj = {};
    pointObj.value = [];
    pointObj.value.push(tileId);

    pointObj.value.push(firstData.lng);
    pointObj.value.push(firstData.lat);
    pointObj.value.push(secondData.lng);
    pointObj.value.push(secondData.lat);
    pointArr.push(pointObj);
};
