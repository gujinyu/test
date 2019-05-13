/**
 * @file 绘制函数封装
 * @author wangchunhong<wangchunghong@baidu.com>
 */
import * as Mesh from './mesh.js';
let city = require('../common/citydata.json');
// let allTilesCityInfo = require('../common/tileCityInfo.json');
// let handleCities = ['江门', '黄山', '三沙', '万宁', '普洱', '常州', '北海', '昌都', '莆田', '三门峡', '巴彦淖尔', '舟山', '商丘',
//     '张家界', '亳州', '乌海', '安庆', '烟台', '渭南', '宝鸡', '忻州', '柳州', '东营', '宜宾', '铜仁', '定西', '六安', '抚州'
// ];
let drawingManager = null;
// 地图初始化绘制
export const initPaintMap = function (that, divId, showOption, layerOptions) {
    let tileShowLevel = layerOptions.baseTile11.showZoomLevel;
    let provinceInit = showOption.cityBoundary.provincelist;
    that.chartsInstance = echarts.init(document.getElementById(divId));
    that.chartsOption = {
        progressive: 20000,
        // 加载 bmap 组件
        bmap: {
            // 北京
            center: [116.46, 39.92],
            zoom: 10,
            roam: true,
            // mapStyle: {
            //         style:'normal'
            // }
            mapStyle: {
                styleJson: [{
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }]
                // 关闭水域、草地、poi
                // ,{
                //         'featureType': 'water',
                //         'elementType': 'all',
                //         'stylers': {
                //                 // 'color': '#d1d1d1'
                //                 'visibility': 'off'
                //         }
                // }, {
                //         'featureType': 'green',
                //         'elementType': 'all',
                //         'stylers': {
                //                 'visibility': 'off'
                //         }
                // },{
                //         'featureType': 'poi',
                //         'elementType': 'all',
                //         'stylers': {
                //                 'visibility': 'off'
                //         }
                // }]
            }
        },
        series: []
    };
    if (that.chartsOption && typeof that.chartsOption === 'object') {
        that.chartsInstance.setOption(that.chartsOption, true);
        // 获取百度地图实例，使用百度地图自带的控件
        let map = that.chartsInstance.getModel().getComponent('bmap').getBMap();
        map.setCurrentCity('北京');
        // 设置地图默认的鼠标指针样式
        map.setDefaultCursor("url('bird.cur')");
        // 设置地图类型，普通，混合，全景等
        // map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP ]}));
        // 添加控件和比例尺
        let topLeftControl = new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            offset: new BMap.Size(100, 25)
        });
        // let topLeftNavigation = new BMap.NavigationControl({
        //         // 缩放控件类型 仅包含缩放按钮
        //         type: BMAP_NAVIGATION_CONTROL_LARGE,
        //         anchor: BMAP_ANCHOR_BOTTOM_LEFT,
        //         // 进一步控制缩放按钮的水平竖直偏移量
        //         offset: new BMap.Size(5, 50)
        // });
        var leftBottomNavigation = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            type: BMAP_NAVIGATION_CONTROL_SMALL,
            offset: new BMap.Size(5, 40)
        });

        map.addControl(topLeftControl);
        map.addControl(leftBottomNavigation);
        // 添加城市控件
        // map.addControl(new BMap.CityListControl({
        //         anchor: BMAP_ANCHOR_TOP_LEFT,
        //         offset: new BMap.Size(20, 20)
        // }));

        // 添加右键菜单
        // let menu = new BMap.ContextMenu();
        // let txtMenuItem = [{
        //                 text: '框选',
        //                 callback: function () {
        //                         map.zoomIn();
        //                 }
        //         },
        //         {
        //                 text: '取消框选',
        //                 callback: function () {
        //                         map.zoomOut();
        //                 }
        //         }
        // ];
        // for (let i = 0; i < txtMenuItem.length; i++) {
        //         menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
        // }
        // map.addContextMenu(menu);

        // let citysInScreenInit = [];
        // // 初始根据可视区绘制全国行政区域
        // if (map.getZoom() >= tileShowLevel) {
        //         // 获取可视区的城市
        //         let {
        //                 citysInScreen,
        //                 provincelist
        //         } = getCityInView(that.chartsInstance, provinceInit);
        //         provinceInit = provincelist;
        //         citysInScreenInit = citysInScreen;
        //         // 绘制可视区城市行政区域边界
        //         drawCityBoundary(that.chartsInstance, citysInScreen, true);
        // }
        // // 如果没有缓存过则缓存城市行政区域边界点
        // if (!localStorage.getItem('boundaryCacheFlag')) {
        //         getAllCityBoundary(that.chartsInstance, city);
        // }
        // setTimeout(() => {
        //         // 获取除了可视区外的城市列表
        //         let citysOutScreen = getOutScreenCitys(citysInScreenInit);
        //         // 绘制除了可视区外的全国的城市行政区域
        //         drawCityBoundary(that.chartsInstance, citysOutScreen);
        // }, 1000);

        // 点击网格事件
        that.chartsInstance.on('click', function (params) {
            if ('status' in params.data) {
                if (!('isCurrent' in params.data) || params.data.isCurrent === 1) {
                    if (params.seriesName === 'baseTile') {
                        if (that.tileList) {
                            let existIndex = that.tileList.indexOf(params.name);
                            if (existIndex === -1) {
                                that.tileList.push(params.name);
                                that.chartsInstance.dispatchAction({
                                    type: 'highlight',
                                    seriesName: params.seriesName,
                                    dataIndex: params.dataIndex,
                                    name: params.name
                                });
                            } else {
                                let index = that.tileList.indexOf(params.name);
                                if (index > -1) {
                                    that.tileList.splice(index, 1);
                                }
                                that.chartsInstance.dispatchAction({
                                    type: 'downplay',
                                    seriesName: params.seriesName,
                                    dataIndex: params.dataIndex,
                                    name: params.name
                                });
                            }
                        }
                    }
                }
            }
        });
        let styleOptions = {
            strokeColor: '#409EFF', // 边线颜色。
            fillColor: '#409EFF', // 填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1, // 边线的宽度，以像素为单位。
            strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
            fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' // 边线的样式，solid或dashed。
        }
        // 实例化鼠标绘制工具
        drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, // 是否开启绘制模式
            enableDrawingTool: false, // 是否显示工具栏
            enableCalculate: false,
            rectangleOptions: styleOptions // 矩形的样式
        });
        let overlaycomplete = function (e) {
            // 绘制完之后清除
            let rectCoordinate = e.overlay.Mn || e.overlay.ja || e.overlay.Xe[2]; // 矩形的四点坐标
            let filter = {
                bsswTileBox: Mesh.getTielBox(rectCoordinate[0], 11),
                bsneTileBox: Mesh.getTielBox(rectCoordinate[2], 11)
            };
            map.removeOverlay(e.overlay);
            let bsObject = getBs(that.chartsInstance);
            let bsswTileBox = Mesh.getTielBox(bsObject.bssw, 11);
            let bsneTileBox = Mesh.getTielBox(bsObject.bsne, 11);
            // 计算可视区内网格信息
            let poinArr = getPonit(bsswTileBox, bsneTileBox);
            let data = pointToDataRight(poinArr, 11, that.optionalList, filter, map);
            if (that.highLightType === 0) {
                if (data && data.length > 0) {
                    for (let val of data) {
                        if (that.tileList.indexOf(val.tileID) === -1) {
                            that.tileList.push(val.tileID);
                        }
                    }
                    highLighReset(that.chartsInstance, that.tileList, 0)
                }
            } else if (that.highLightType === 1) {
                if (data && data.length > 0) {
                    highLighReset(that.chartsInstance, that.tileList, 1);
                    for (let val of data) {
                        if (that.tileList.indexOf(val.tileID) > -1) {
                            that.tileList.splice(that.tileList.indexOf(val.tileID), 1);
                        }
                    }
                }
            }
        };
        // 监听绘制完之后的事件
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    }
};
export const addCityListControl = function (map) {
    map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(10, 10)
    }));
};
export const returndrawingManager = function () {
    return drawingManager;
};

/**
 * 绘制计划覆盖轨迹和实际覆盖轨迹
 *
 * @param {Object} that this对象
 * @param {Array} paintBaseData 计划覆盖轨迹数据
 * @param {Array} paintCoverData 实际覆盖轨迹数据
 */
export const drawCoverLine = function (that, paintBaseData, paintCoverData) {
    paintBaseData = formatLineData(paintBaseData);
    paintCoverData = formatLineData(paintCoverData);
    if (that.chartsInstance) {
        // 取消数据加载动画
        that.chartsInstance.hideLoading();
        // 绘制曲线
        that.chartsInstance.setOption({
            legend: {
                data: ['计划道路', '覆盖道路'],
                right: '10',
                bottom: '5'
            },
            series: [{
                name: '计划道路',
                type: 'lines',
                coordinateSystem: 'bmap',
                polyline: true,
                silent: true,
                data: paintBaseData,
                lineStyle: {
                    normal: {
                        color: 'rgb(200, 35, 45)',
                        opacity: 1,
                        width: 2
                    }
                },
                large: true,
                animation: false
            }, {
                name: '覆盖道路',
                type: 'lines',
                coordinateSystem: 'bmap',
                polyline: true,
                silent: true,
                data: paintCoverData,
                lineStyle: {
                    normal: {
                        color: '#458B00',
                        opacity: 1,
                        width: 3
                    }
                },
                large: true,
                animation: false
            }]
        });
    }
};
export const formatLineData = function (lineArray) {
    for (let index in lineArray) {
        let coords = lineArray[index].coords;
        if (coords.length === 0) {
            lineArray.splice(index, 1);
        } else if (coords.length === 1) {
            coords.push(coords[0]);
        }
    }
    return lineArray;
};

/**
 * 将地图移动到某个指定城市
 *
 * @param {Object} that this对象
 * @param {string} currentCity 要移动到的城市名称，如'北京'
 */
export const setMapCity = function (that, currentCity) {
    if (that.chartsInstance) {
        let map = that.chartsInstance.getModel().getComponent('bmap').getBMap();
        if (currentCity) {
            // 设置地图的中心点
            map.setZoom(10);
            map.setCenter(currentCity);
        }
    }
};

/**
 * 将整个中国放到屏幕中央
 *
 * @param {Object} that this对象
 */
export const setMapChina = function (that) {
    if (that.chartsInstance) {
        let map = that.chartsInstance.getModel().getComponent('bmap').getBMap();
        // 设置地图的中心点
        map.setZoom(5);
        map.setCenter(new BMap.Point(103.504854, 37.681463));
    }
};

/**
 * 绘制城市行政边界区域多边形
 *
 * @param {Object} rs 城市行政区域边界坐标点数据
 * @param {Object} map    map对象
 * @param {Object} boundaryStyle    自定义的覆盖物样式
 * @return {Object} maxPly 城市行政区域多边形覆盖物点数组
 */
export const addCityBoundaryOverlay = function (rs, map, boundaryStyle) {
    let maxNum = -1;
    let maxPly;
    let count = rs.boundaries.length;
    for (let j = 0; j < count; j++) {
        let ply;
        if (boundaryStyle) {
            ply = new BMap.Polygon(rs.boundaries[j], boundaryStyle);
        } else {
            ply = new BMap.Polygon(rs.boundaries[j], {
                strokeWeight: 1.5,
                strokeColor: '#409EFF',
                fillOpacity: 0.1,
                fillColor: '#409EFF'
                // strokeStyle: 'dashed',
            });
        }
        // 添加多边形覆盖物
        map.addOverlay(ply);
        // 获取多边形覆盖物的点数组
        let arrPts = ply.getPath();
        if (arrPts.length > maxNum) {
            maxNum = arrPts.length;
            maxPly = ply;
        }
    }
    return maxPly;
};

/**
 * 绘制多个城市边界线
 *
 * @param {Object} chartsInstance 实例
 * @param {Array} cities 要绘制边界线的城市名
 * @param {boolean} clearPreOverlay 是否清除原先绘制的覆盖物，可不设置，默认不清除
 * @param {boolean} ResetView 是否要根据城市边界线调整地图视图，可不设置，默认不调整
 * @param {Object} boundaryStyle 要绘制边界线的样式，可不设置
 */
export const drawCityBoundary = function (chartsInstance, cities, clearPreOverlay, ResetView, boundaryStyle) {
    // 若传入的为城市名数组['北京市','天津']，则适配为[{label: '北京'},{label: '天津'}]
    if (cities.length && !cities[0].label) {
        let tmpCityList = [];
        for (let city of cities) {
            if (city && city.indexOf('市') !== -1) {
                city = city.replace('市', '');
            }
            tmpCityList.push({
                label: city
            });
        }
        cities = tmpCityList;
    }
    if (chartsInstance) {
        let map = chartsInstance.getModel().getComponent('bmap').getBMap();
        map.closeInfoWindow();
        // 创建行政区域对象实例
        let bdary = new BMap.Boundary();
        if (clearPreOverlay) {
            // 清除原有覆盖物
            for (let i = map.getOverlays().length - 2; i > 0; i--) {
                map.removeOverlay(map.getOverlays()[i]);
            }
        }
        let plyArr = [];
        let num = 0;
        if (ResetView) {
            if (cities.length > 60) {
                map.setZoom(5);
                map.setCenter(new BMap.Point(103.504854, 37.681463));
            }
        }
        for (let i = 0; i < cities.length; i++) {
            let maxPly;
            let cityName = cities[i].label;
            let tmpCityName = cities[i].label + '市';
            let localBD = localStorage.getItem(cityName);
            let tmpLocalBD = localStorage.getItem(tmpCityName);
            let localRs = localBD ? JSON.parse(localBD) : (tmpLocalBD ? JSON.parse(tmpLocalBD) : null);
            if (localRs && localRs.boundaries) {
                maxPly = addCityBoundaryOverlay(localRs, map, boundaryStyle);
            } else {
                bdary.get(cityName, function (rs) {
                    if (!rs.boundaries.length) {
                        console.log(cityName + '：未找到城市边界');
                        bdary.get(tmpCityName, function (tmpRs) {
                            if (!tmpRs.boundaries.length) {
                                console.log(tmpCityName + '：未找到城市边界');
                            } else {
                                console.log(tmpCityName + ':找到城市边界');
                                localStorage.setItem(tmpCityName, JSON.stringify(tmpRs));
                                maxPly = addCityBoundaryOverlay(tmpRs, map, boundaryStyle);
                            }
                        });
                    } else {
                        localStorage.setItem(cities[i].label, JSON.stringify(rs));
                        maxPly = addCityBoundaryOverlay(rs, map, boundaryStyle);
                    }
                });

            }
            if (ResetView) {
                if (cities.length < 60) {
                    if (maxPly) {
                        plyArr = plyArr.concat(maxPly.getPath());
                        num++;
                    }
                    if (num === cities.length) {
                        map.setViewport(plyArr);
                    }
                }
            }
        }
    }
};

/**
 * 获取可视区城市列表
 *
 * @param {Object} chartsInstance 实例对象
 * @param {Object} provincelist 省级列表
 * @return {Object} 城市列表和省级区域列表
 */
export const getCityInView = function (chartsInstance, provincelist) {
    if (chartsInstance) {
        // let map = chartsInstance.getModel().getComponent('bmap').getBMap();
        let {
            bssw,
            bsne
        } = getBs(chartsInstance);
        // let tileLevel = map.getZoom();
        let citysInScreen = [];
        for (let item of city.children) {
            if (item.lng >= bssw.lng && item.lng <= bsne.lng && (item.lat >= bssw.lat && item.lat <= bsne.lat)) {
                if (provincelist.indexOf(item.label) === -1) {
                    // addFlag = true;
                    provincelist.push(item.label);
                    citysInScreen = citysInScreen.concat(item.children);
                }
            }
        }
        return {
            citysInScreen: citysInScreen,
            provincelist: provincelist
        };
    }
};

/**
 * 获取全国城市的城市区域边界数据并缓存在localStorage
 *
 * @param {Object} chartsInstance 实例
 * @param {Object} city 可视区城市列表
 * @return {Object} 返回信息
 */
export const getAllCityBoundary = function (chartsInstance, city) {
    // 获取全国城市
    let cities = getAllCity(city);
    if (chartsInstance) {
        drawCityBoundary(chartsInstance, cities);
        return {
            init: true
        };
    }

};

// 获取多个城市的中心点
export const parseCityCenterPoint = function (that, cities) {
    if (that.chartsInstance) {
        let map = that.chartsInstance.getModel().getComponent('bmap').getBMap();
        // 创建地址解析器实例
        let myGeo = new BMap.Geocoder();
        let points = [];
        let centerLngSum = 0;
        let centerLatSum = 0;
        // 将地址解析结果显示在地图上，并调整地图视野
        for (let i = 0; i < cities.length; i++) {
            myGeo.getPoint(cities[i], function (point) {
                centerLngSum += point.lng;
                centerLatSum += point.lat;
                if (i === (cities.length - 1)) {
                    let centerPointLag = centerLngSum / cities.length;
                    let centerPointLat = centerLatSum / cities.length;
                    return new BMap.Point(centerPointLag, centerPointLat);
                }
            });
        }
    }
};

// 获取可视区左下角和右上角坐标点,百度坐标系
export const getBs = function (chartsInstance) {
    if (chartsInstance) {
        // 获取地图实例
        let map = chartsInstance.getModel().getComponent('bmap').getBMap();
        let bs = map.getBounds();
        let bssw = bs.getSouthWest();
        let bsne = bs.getNorthEast();
        return {
            bssw,
            bsne
        };
    }
};

// 获取可视区内的点坐标
export const getPonit = function (bsswTileBox, bsneTileBox) {
    let bsswBoxLength = bsswTileBox.boxLength;
    let bsswBoxCenter = bsswTileBox.centerPoint;
    let bsneBoxCenter = bsneTileBox.centerPoint;
    let pointArr = [];
    for (let i = bsswBoxCenter.lng - bsswBoxLength.lngStep; i <= bsneBoxCenter.lng + bsswBoxLength.lngStep; i = i +
        bsswBoxLength.lngStep) {
        for (let j = bsneBoxCenter.lat + bsswBoxLength.latStep; j >= bsswBoxCenter.lat - bsswBoxLength.latStep; j = j -
            bsswBoxLength.latStep) {
            pointArr.push({
                lng: i,
                lat: j
            });
        }
    }
    return pointArr;
};
// 给定百度坐标系的坐标点，获取网格信息（网格ID，网格中心点，四角坐标点，网格长，宽）
export const pointToData = function (pointArr, tileLevel) {
    let data = [];
    for (let i = 0; i < pointArr.length; i++) {
        let tileBox = Mesh.getTielBox(pointArr[i], tileLevel);
        // if (data.indexOf(tileBox) == -1) {
        data.push(tileBox);
        // }
    }
    return data;
};
// 选取符合的网格信息
export const pointToDataRight = function (pointArr, tileLevel, chooseArr, filter, map) {
    let data = [];
    let point1 = filter.bsswTileBox.tileBox[3];
    let point2 = filter.bsneTileBox.tileBox[2];
    if (chooseArr.length > 0) {
        for (let i = 0; i < pointArr.length; i++) {
            let tileBox = Mesh.getTielBox(pointArr[i], tileLevel);
            if (chooseArr.indexOf(String(tileBox.tileID)) > -1) {
                // 比较经纬度大小选取
                if (tileBox.centerPoint.lng > point1.lng && tileBox.centerPoint.lng < point2.lng && tileBox.centerPoint.lat < point1.lat && tileBox.centerPoint.lat > point2.lat) {
                    data.push(tileBox);
                }
            }
        }
    }
    return data;
};
// 构造绘制网格的数据
export const dataConstruct = function (tileBox, constructParamsArr) {
    let leftBottom = tileBox.tileBox[0];
    let rightTop = tileBox.tileBox[1];
    let rightBottom = tileBox.tileBox[2];
    let leftTop = tileBox.tileBox[3];
    let status = tileBox.status ? constructParamsArr[tileBox.status] : '';
    let isCurrent = tileBox.isCurrent ? tileBox.isCurrent : 0;
    let valueData = [tileBox.tileID,
        leftBottom.lng,
        leftBottom.lat,
        rightTop.lng,
        rightTop.lat,
        rightBottom.lng,
        rightBottom.lat,
        leftTop.lng,
        leftTop.lat,
        status,
        isCurrent
    ];
    tileBox.value = valueData;
    tileBox.name = tileBox.tileID;
    return tileBox;
};
// 获取屏幕可视区内网格
export const getScreenAllTiles = function (chartsInstance, tileLevel) {
    // 获取可视区角点坐标
    let bsObject = getBs(chartsInstance);
    let bsswTileBox = Mesh.getTielBox(bsObject.bssw, tileLevel);
    let bsneTileBox = Mesh.getTielBox(bsObject.bsne, tileLevel);
    // 计算可视区内网格信息
    let poinArr = getPonit(bsswTileBox, bsneTileBox);
    let data = pointToData(poinArr, tileLevel);
    return data;
};
// 绘制网格
export const drawBaseTile = function (chartsInstance, tileData, labelShow, haveLegend, visualMapInfo, formatter) {
    // let bs = bmap.getCenter();
    // let zl = bmap.getZoom();
    // sessionStorage.center = [bs.lng, bs.lat];
    // sessionStorage.zoom = zl;
    // map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
    if (visualMapInfo) {
        var {
            categories,
            color
        } = visualMapInfo;
    }
    let visualMapShow = true;
    if (!tileData.length || !haveLegend) {
        visualMapShow = false;
    }
    if (chartsInstance) {
        // 获取地图实例
        let map = chartsInstance.getModel().getComponent('bmap').getBMap();
        let option = chartsInstance.getOption();
        chartsInstance.setOption({
            series: [{
                name: 'baseTile',
                type: 'custom',
                coordinateSystem: 'bmap',
                // 图形渲染的逻辑
                renderItem: renderBaseItem,
                animation: false,
                itemStyle: {
                    emphasis: {
                        // color: '#ffd04b',
                        // opacity: 0.6
                        color: 'rgba(255,255,0,0.5)'
                    }
                },
                encode: {
                    label: 0
                },
                label: {
                    normal: {
                        show: labelShow,
                        position: 'insideTopLeft',
                        formatter: formatter,
                        lineHeight: 15
                    }
                },
                data: tileData
            }],
            visualMap: {
                type: 'piecewise',
                inverse: true,
                categories: categories,
                top: 40,
                left: 10,
                show: visualMapShow,
                borderColor: '#ccc',
                borderWidth: 2,
                backgroundColor: '#eee',
                dimension: 9,
                inRange: {
                    colorAlpha: 0.5,
                    color: color,
                    opacity: 1
                },
                outOfRange: {
                    colorAlpha: 0.5,
                    color: '#fff',
                    opacity: 1
                },
                seriesName: 'baseTile',
                hoverLink: false
            },
            bmap: {
                zoom: map.getZoom()
            },
            textStyle: {
                color: '#000'
                // fontSize: 14
            }
        });
    }
};
export const renderBaseItem = function (params, api) {
    let context = params.context;
    let key = api.value(0);
    let pointLeftBottom = api.coord([api.value(1), api.value(2)]);
    let pointRightTop = api.coord([api.value(3), api.value(4)]);
    let pointRightBottom = api.coord([api.value(5), api.value(6)]);
    let pointLeftTop = api.coord([api.value(7), api.value(8)]);
    let tileStyle = {};
    if (api.value(10) === 1) {
        tileStyle = {
            stroke: 'rgba(45,140,240,0.8)',
            lineWidth: 4
        };
    } else {
        tileStyle = {
            stroke: 'rgba(0,0,0,0.1)'
        };
    }
    return {
        type: 'polygon',
        id: key,
        name: key,
        shape: {
            points: [pointLeftBottom, pointRightBottom, pointRightTop, pointLeftTop]
        },
        style: api.style(tileStyle),
        styleEmphasis: api.styleEmphasis()
    };
};

/**
 * 与列表选中的数据进行关联
 * @param {*} chartsInstance 实例
 * @param {*} tileArr 选中的tileId
 */
export const highLighReset = function (chartsInstance, tileArr, type) {
    if (tileArr) {
        if (type === 0) {
            type = 'highlight';
        } else if (type === 1) {
            type = 'downplay';
        }
        // 将网格取消选择或高亮选择
        if (tileArr.length) {
            for (let val of tileArr) {
                chartsInstance.dispatchAction({
                    type: type,
                    seriesName: 'baseTile',
                    name: Number(val)
                });
            }
        }
    }
};

export const renderItem = function (params, api) {
    let context = params.context;
    let key = api.value(0);
    let pointLeftBottom = api.coord([api.value(1), api.value(2)]);
    let pointRightTop = api.coord([api.value(3), api.value(4)]);
    let pointRightBottom = api.coord([api.value(5), api.value(6)]);
    let pointLeftTop = api.coord([api.value(7), api.value(8)]);
    return {
        type: 'polygon',
        id: key,
        name: key,
        shape: {
            points: [pointLeftBottom, pointRightBottom, pointRightTop, pointLeftTop]
        },
        style: api.style({
            stroke: 'rgba(0,0,0,0.1)'
        }),
        styleEmphasis: api.styleEmphasis()
    };
}

/**
 * 根据可视区内的网格获取网格边界点（城市边界、项目边界、任务包边界）
 *
 * @param {Object} tileArr 网格列表
 * @param {number} tileLevel 网格层级
 * @param {string} flag 网格城市边界、任务包边界标识
 * @return {Object} 网格边界点坐标集合
 */
export const getScreenTileBoundaryPoint = function (tileArr, tileLevel, boundaryflag) {
    let boundaryPoints = [];
    let boundaryTile = Mesh.getBoundaryTile(tileArr, tileLevel, boundaryflag);
    boundaryPoints = Mesh.getBoundaryPoint(boundaryTile, tileLevel);
    return boundaryPoints;
};

/**
 * 绘制边界（网格城市、网格项目、网格任务包）
 *
 * @param {Object} chartsInstance 实例
 * @param {Object} data 边界点数组
 * @param {Object} paramsObj 绘制参数对象
 */
export const drawTileBoundary = function (chartsInstance, data, paramsObj) {
    if (chartsInstance) {
        let {
            tileBoundaryFlag,
            nameFlag,
            itemStyle
        } = paramsObj;
        let option = chartsInstance.getOption();
        let optionArr = option.series;
        if (tileBoundaryFlag) {
            let existFlag = false;
            for (let item of optionArr) {
                if (item.name === nameFlag) {
                    existFlag = true;
                    item.data = data;
                }
            }
            if (!existFlag) {
                option.series.push({
                    type: 'custom',
                    name: nameFlag,
                    coordinateSystem: 'bmap',
                    renderItem: renderTileBoundary,
                    animation: false,
                    itemStyle: itemStyle,
                    data: data
                });
            }
        } else {
            for (let item of optionArr) {
                if (item.name === nameFlag) {
                    item.data = [];
                }
            }
        }
        chartsInstance.setOption(option);
    }
};

/**
 * 绘制网格城市、网格项目、网格任务包边界渲染函数
 *
 * @param {Object} params 参数
 * @param {Object} api 参数api
 * @return {Object} 配置参数
 */
export const renderTileBoundary = function (params, api) {
    let key = api.value(0);
    let point1 = api.coord([api.value(1), api.value(2)]);
    let point2 = api.coord([api.value(3), api.value(4)]);
    return {
        type: 'line',
        id: key,
        name: key,
        shape: {
            x1: point1[0],
            y1: point1[1],
            x2: point2[0],
            y2: point2[1]
        },
        style: api.style({
            // stroke: 'rgba(0,0,0,0.6)',
            // lineWidth: '1'
        })
    };
};

/**
 * 获取全国城市
 *
 * @param {Object} city 全国城市JSON对象
 * @return {Object} 全国城市的列表
 */
export const getAllCity = function (city) {
    let cityList = [];
    // let len = 0;
    let cityObj = city.children;
    for (let child of cityObj) {
        if (child.children) {
            let childList = child.children;
            // len += childList.length;
            cityList = [...cityList, ...childList];
        }
    }
    return cityList;
};

/**
 * 获取可视区外城市
 *
 * @param {Object} citysInScreenInit 可视区内的城市列表
 * @return {Object} citysOutScreen 可视区外的全国城市列表
 */
export const getOutScreenCitys = function (citysInScreenInit) {
    let allCityList = getAllCity(city);
    let citysOutScreen = allCityList;
    for (let city of citysInScreenInit) {
        for (let item of citysOutScreen) {
            if (city.label === item.label) {
                citysOutScreen.splice(
                    citysOutScreen.findIndex(
                        slectVal => slectVal.label === city.label
                    ),
                    1
                );
                break;
            }
        }
    }
    return citysOutScreen;
};

/**
 * 获取网格归属城市信息并绘制网格城市边界
 *
 * @param {Object} that this对象
 * @param {number} tileLevel 网格层级
 * @param {boolean} tileBoundaryFlag 网格边界是否显示标识
 */
export const getTileAttrInfo = function (that, tileData, tileLevel) {
    let tilesArr = [];
    for (let tile of tileData) {
        tilesArr.push(tile.tileID);
    }
    let queryData = {
        tile_list: tilesArr.join(','),
        return_all: 1
    };
    that.$http.post('/api/query_tile_attribution_info', queryData).then(response => {
        response = response.body;
        let data = response.data;
        if (data.errno === 0) {
            let tileList = data.data.tile_list;
            let boundaryflag = 'city';
            let boundaryPoints = getScreenTileBoundaryPoint(tileList, tileLevel, boundaryflag);
            let paramObj = {
                tileBoundaryFlag: true,
                nameFlag: boundaryflag,
                iindexFlag: boundaryflag,
                itemStyle: {
                    borderColor: 'rgba(0,0,0,0.6)',
                    borderWidth: 2,
                    borderType: 'solid'
                }
            };
            drawTileBoundary(that.chartsInstance, boundaryPoints, paramObj);
        }
    });
};

/**
 * 获取可视区外网格
 *
 * @param {Object} that this对象
 * @param {number} tileLevel 网格层级
 * @return {Object} 可视区外的所有网格
 */
// export const getTilesOutScreen = function (that, tileLevel) {
//         // 获取初始化可视区的网格
//         let tillsInScreen = getScreenAllTiles(that.chartsInstance, tileLevel);
//         let tilesOutScreen = allTilesCityInfo.tile_list;
//         for (let tile of tillsInScreen) {
//                 for (let item of tilesOutScreen) {
//                         if (tile.tileID === Number(item.tile_id)) {
//                                 tilesOutScreen.splice(
//                                         tilesOutScreen.findIndex(
//                                                 slectVal => slectVal.tile_id === tile.tileID
//                                         ),
//                                         1
//                                 );
//                                 break;
//                         }
//                 }
//         }
//         return tilesOutScreen;
// };
