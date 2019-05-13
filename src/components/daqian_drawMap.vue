<template>
    <div class="map">
        <div id="mapDiv" class="map-div"></div>
        <mapTools class="mapTools" :toolsItems="toolsItems" @change="mapToolsChange"></mapTools>
    </div>
</template>
<script>
import echarts from "echarts";
import * as drawtools from "@/utils/daqian_drawtools";
import * as Mesh from "@/utils/mesh";
import mapTools from "@/components/daqian_mapTools.vue";
export default {
    /*  tileList 返回父组件选中的网格
        routerParams 父组件参数
        haveLegend 父组件是否有图例
        optionalList 返回父组件中可选中的网格 */
    props: ["tileList", "routerParams", "haveLegend", "optionalList"],
    components: {
        mapTools
    },
    data() {
        return {
            toolsItemsAll: [
                {
                    iconName: "el-icon-daqian-jian1",
                    iconText: "框选",
                    iconTextShow: false,
                    iconChecked: false,
                    iconDisabled: true
                },
                {
                    iconName: "el-icon-daqian-jian",
                    iconText: "取消选择",
                    iconTextShow: false,
                    iconChecked: false,
                    iconDisabled: true
                },
                {
                    iconName: "el-icon-daqian-plus-gridview",
                    iconText: "网格",
                    iconTextShow: false,
                    iconChecked: true,
                    iconClick: this.isGridDisplay,
                    iconDisabled: true
                },
                {
                    iconName: "el-icon-daqian-xiangqing",
                    iconText: "文本",
                    iconTextShow: false,
                    iconChecked: true,
                    iconClick: this.isTextDisplay,
                    iconDisabled: true
                },
                {
                    iconName: "el-icon-daqian-xuxiankuang",
                    iconText: "上一任务包边界",
                    iconTextShow: false,
                    iconChecked: false,
                    idName: "icon5",
                    iconClick: this.isPrePackageDisplay,
                    iconDisabled: true
                },
                {
                    iconName: "el-icon-daqian-shixiankuang",
                    iconText: "当前任务包边界",
                    iconTextShow: false,
                    iconChecked: true,
                    idName: "icon6",
                    iconClick: this.isCurPackageDisplay,
                    iconDisabled: true
                }
            ],
            toolsItems: [],
            drawCityListControl: false,
            isDetailInfoShow: false, //详细文本展示标识
            showOption: {
                //颜色池   基础网格颜色  鼠标经过网格颜色
                colorParams: {
                    colors: ["#B0C4DE", "rgba(255,255,0,0.5)", "#1482e5", "#70b4eb", "#b4e0f3", "#ffffff"],
                    opacity: 0.5
                },
                bmapOption: {
                    center: [116.46, 39.92], //地图初始默认中心点，116.46, 39.92设置将整个中国放在可视区中间
                    zoomLevel: 10 //地图初始默认缩放层级
                },
                cityBoundary: {
                    provincelist: [],
                    cityBoundaryLegend: true,
                    showCityFlag: true
                }
            },
            /* 图层控制，参数含义：
             exist：是否存在该图层；
             show：是否显示该图层，true 显示 false 隐藏；
             showZoomLevel：显示该图层时的地图缩放层级；*/
            layerOptions: {
                // 城市行政区域边界
                cityBoundary: {
                    exist: true,
                    show: true,
                    showZoomLevel: 5
                },
                // 11级网格图层
                baseTile11: {
                    exist: true,
                    show: true,
                    showZoomLevel: 10,
                    // 网格城市边界图层
                    tileCityBoundary: {
                        exist: true,
                        show: true,
                        showZoomLevel: 10
                    },
                    //网格简单信息展示设置
                    simpleLabelInfo: {
                        show: true,
                        showZoomLevel: 11
                    },
                    //网格详细信息文字展示图层
                    detailLabelInfo: {
                        exist: true,
                        show: true,
                        showZoomLevel: 12
                    },
                    // 网格项目边界图层
                    tileProjectBoundary: {
                        exist: true,
                        show: true,
                        showZoomLevel: 10
                    },
                    // 出库网格边界图层
                    tileOutLibraryBoundary: {
                        exist: true,
                        show: true,
                        showZoomLevel: 10
                    },
                    // 网格当前任务包边界图层
                    tileCurPackageBoundary: {
                        exist: true,
                        show: true,
                        showZoomLevel: 11
                    },
                    // 网格上一任务包边界图层
                    tilePrePackageBoundary: {
                        exist: false,
                        show: true,
                        showZoomLevel: 11
                    }
                }
            },
            allowChooseList: [], // 全部网格List
            tileManageVisualMapInfo: {
                categories: ["未锁定", "当前项目锁定", "其他项目锁定"],
                color: ["#EEA9B8", "#262729", "#606266"]
            },
            defaultvisualMap: {
                categories: [""],
                color: ["#fff"]
            },
            visualMapInfo3000: {
                categories: ["未生成任务包", "未开始", "准入中", "不通过", "通过"],
                color: ["#787878", "#8B008B", "#8968CD", "#8B0000", "#98FB98"]
            },
            assignmentsVisualMapInfo: {
                categories: [
                    "未生成任务包",
                    "待作业",
                    "作业中",
                    "待一检",
                    "一检中",
                    "一检返工返修",
                    "待二检",
                    "二检中",
                    "二检返工返修",
                    "二检通过"
                ],
                color: [
                    "#787878",
                    "#9370DB",
                    "#9932CC",
                    "#EE9A49",
                    "#EE8262",
                    "#EE3A8C",
                    "#0099ff",
                    "#0066ff",
                    "#0033ff",
                    "#98FB98"
                ]
            },
            tileProgressVisualMapInfo: {
                categories: [
                    "出库",
                    "后预处理",
                    "生产准入",
                    "基础作业",
                    "基础接边",
                    "高阶作业",
                    "高阶接边",
                    "回库接边",
                    "回库"
                ],
                color: [
                    "#DAA520",
                    "#9932CC",
                    "#DC143C",
                    "#EE8262",
                    "#483D8B",
                    "#0099ff",
                    "#0066ff",
                    "#0033ff",
                    "#98FB98"
                ]
            },
            tileManageInfo: {
                "1": "未锁定",
                "2": "当前项目锁定",
                "3": "其他项目锁定"
            },
            allowInState: {
                "10": "未生成任务包",
                "12": "未开始",
                "3001": "未开始",
                "3002": "准入中",
                "3003": "准入中",
                "3004": "通过",
                "3005": "不通过"
            },
            assignmentsInfo: {
                "1": "未生成任务包",
                "2": "待作业",
                "3": "作业中",
                "4": "待一检",
                "5": "一检中",
                "6": "一检返工返修",
                "7": "待二检",
                "8": "二检中",
                "9": "二检返工返修",
                "10": "二检通过"
            },
            tileProgresssInfo: {
                "1": "出库",
                "24": "后预处理",
                "20": "后预处理",
                "2001": "后预处理",
                "22": "后预处理",
                "23": "后预处理",
                "21": "后预处理",
                "2101": "后预处理",
                "3000": "生产准入",
                "30": "基础作业",
                "32": "基础接边",
                "34": "高阶作业",
                "36": "高阶接边",
                "38": "回库接边",
                "2": "回库"
            },
            highLightType: 0, // 0 高亮 1 取消高亮
            drawBoundaryParam: {
                projectParamsObj: {
                    tileBoundaryFlag: false,
                    nameFlag: "project",
                    indexFlag: "sub_project_id",
                    itemStyle: {
                        borderColor: "rgba(0,0,0,0.6)",
                        borderWidth: 3,
                        borderType: "solid"
                    }
                },
                cityParamObj: {
                    tileBoundaryFlag: false,
                    nameFlag: "city",
                    indexFlag: "city",
                    itemStyle: {
                        borderColor: "rgba(0,0,0,0.6)",
                        // borderWidth: 2,
                        borderType: "solid"
                    }
                },
                predrawParamsObj: {
                    tileBoundaryFlag: false,
                    nameFlag: "pretaskPackage",
                    indexFlag: "pre_orign_operation_task_id",
                    itemStyle: {
                        borderColor: "#0000AA",
                        borderWidth: 2,
                        borderType: "dashed"
                        // borderType: 'dotted'
                    }
                },
                curdrawParamsObj: {
                    tileBoundaryFlag: false,
                    nameFlag: "curtaskPackage",
                    indexFlag: "current_orign_operation_task_id",
                    itemStyle: {
                        borderColor: "#0000AA",
                        borderType: "solid",
                        borderWidth: 2,
                    }
                },
                outLibraryParamsObj: {
                    tileBoundaryFlag: false,
                    nameFlag: "outLibrary",
                    indexFlag: "is_out_library_tile",
                    itemStyle: {
                        borderColor: "#000",
                        borderType: "solid",
                        borderWidth: 2,
                    }
                }
            }
        };
    },
    watch: {
        tileList: function (newVal, oldVal) {
            //监听父组件选中的tileList
            this.$emit("drawMapCall", newVal);
            // 将上次选择取消高亮
            drawtools.highLighReset(this.chartsInstance, oldVal, 1);
            // 将选中网格高亮
            drawtools.highLighReset(this.chartsInstance, newVal, 0);
        },
        // baseTile11Show: function (val, oldVal) {
        //   console.log(val);
        //     if (val && this.layerOptions.baseTile11.show) {
        //         // 根据可视区绘制11级网格层
        //         drawtools.drawAllTile(this.chartsInstance, 11, this.showOption.colors, this.showOption.opacity, this.layerOptions.baseTile11.labelInfo.show);
        //     } else {
        //         // 隐藏11级网格层
        //         drawtools.drawBaseTile(this.chartsInstance, [], this.showOption.colors, this.showOption.opacity, this.layerOptions.baseTile11.labelInfo.show);
        //     }
        // },
        // tileCityBoundaryShow: function (val, oldVal) {
        //     if (val && this.layerOptions.baseTile11.tileCityBoundary.show) {
        //         // 根据可视区绘制网格城市边界
        //         drawtools.getTileAttrInfo(this, 11, this.layerOptions.baseTile11.tileCityBoundary.show);
        //     } else {
        //         // 隐藏网格城市边界
        //         drawtools.drawTileBoundary(this.chartsInstance, [], this.layerOptions.baseTile11.tileCityBoundary.show, 'city');
        //     }
        // }
    },
    created() {
        let arr = [];
        // 根据路由 选择图标
        if (this.routerParams === "tileManage") {
            arr = [0, 1, 2, 3];
        } else if (this.routerParams.startsWith("assignments")) {
            arr = [0, 1, 2, 3, 4, 5];
        } else if (this.routerParams.startsWith("tileProgress")) {
            arr = [2, 3];
        }
        for (let index of arr) {
            this.toolsItems.push(this.toolsItemsAll[index]);
        }
    },
    mounted() {
        drawtools.initPaintMap(this, "mapDiv", this.showOption, this.layerOptions);
        drawtools.setMapChina(this);
        this.$emit("drawMapInfo", this);
        //页面屏幕大小变化，重新绘制
        // if (this.resizeChart) {
        //     window.addEventListener("resize", this.resizeChart);
        // }
        let that = this;
        let map = this.chartsInstance
            .getModel()
            .getComponent("bmap")
            .getBMap();
        map.addEventListener("dragend", function (event) {
            // 根据可视区进行各图层绘制
            that.drawingManagerReset();
            that.drawAccordingToScreenArea(map);
        });
        map.addEventListener("zoomend", function (event) {
            that.drawingManagerReset();
            that.zoomResponse(map);
        });
        map.addEventListener("resize", function (event) {
            that.chartsInstance.resize();
            if (!this.drawCityListControl) {
                drawtools.addCityListControl(map);
                this.drawCityListControl = true;
            }
            // 根据可视区进行各图层绘制
            that.drawAccordingToScreenArea(map);
            that.drawingManagerReset();
        });
        // drawtools.getTileAttrInfo(this,"mapDiv", 11);
    },
    // computed: {
    //     baseTile11Show: function() {
    //         return this.layerOptions.baseTile11.exist;
    //     },
    //     tileCityBoundaryShow: function() {
    //         return this.layerOptions.baseTile11.tileCityBoundary.exist;
    //     }
    // },
    methods: {
        mapToolsChange: function (data) {
            if (data.text === "框选" || data.text === "取消选择") {
                if (data.index) {
                    this.toolsItems[0].iconChecked = false;
                } else {
                    this.toolsItems[1].iconChecked = false;
                }
                let drawingManager = drawtools.returndrawingManager();
                let map = this.chartsInstance
                    .getModel()
                    .getComponent("bmap")
                    .getBMap();
                this.highLightType = data.index;
                if (data.checked) {
                    drawingManager.open();
                    drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
                    map.disableDragging();
                } else {
                    drawingManager.close();
                    map.enableDragging();
                }
            } else {
                if (data.callback) {
                    data.callback();
                }
            }
        },
        // 关闭画笔 重置框选按钮
        drawingManagerReset: function () {
            let drawingManager = drawtools.returndrawingManager();
            let map = this.chartsInstance
                .getModel()
                .getComponent("bmap")
                .getBMap();
            drawingManager.close();
            this.toolsItemsAll[0].iconChecked = false;
            this.toolsItemsAll[1].iconChecked = false;
        },
        // 控制当前任务包边界的显示隐藏
        isCurPackageDisplay: function () {
            this.layerOptions.baseTile11.tileCurPackageBoundary.exist = !this.layerOptions.baseTile11
                .tileCurPackageBoundary.exist;
            for (let item of this.toolsItemsAll) {
                if (item.iconText === "当前任务包边界") {
                    item.iconChecked = this.layerOptions.baseTile11.tileCurPackageBoundary.exist;
                }
            }
            let curdrawParamsObj = this.drawBoundaryParam.curdrawParamsObj;
            if (this.layerOptions.baseTile11.tileCurPackageBoundary.exist) {
                let map = this.chartsInstance
                    .getModel()
                    .getComponent("bmap")
                    .getBMap();
                this.zoomResponse(map);
            } else {
                // 隐藏网格当前任务包边界
                drawtools.drawTileBoundary(this.chartsInstance, [], curdrawParamsObj);
            }
        },
        // 控制上一任务包边界的显示隐藏
        isPrePackageDisplay: function () {
            this.layerOptions.baseTile11.tilePrePackageBoundary.exist = !this.layerOptions.baseTile11
                .tilePrePackageBoundary.exist;
            for (let item of this.toolsItemsAll) {
                if (item.iconText === "上一任务包边界") {
                    item.iconChecked = this.layerOptions.baseTile11.tilePrePackageBoundary.exist;
                }
            }
            let predrawParamsObj = this.drawBoundaryParam.predrawParamsObj;
            if (this.layerOptions.baseTile11.tilePrePackageBoundary.exist) {
                let map = this.chartsInstance
                    .getModel()
                    .getComponent("bmap")
                    .getBMap();
                this.zoomResponse(map);
            } else {
                // 隐藏网格上一任务包边界
                drawtools.drawTileBoundary(this.chartsInstance, [], predrawParamsObj);
            }
        },
        // 控制文字属性显示隐藏
        isTextDisplay: function () {
            this.isDetailInfoShow = !this.isDetailInfoShow;
            this.layerOptions.baseTile11.detailLabelInfo.exist = !this.layerOptions.baseTile11.detailLabelInfo.exist;
            for (let item of this.toolsItemsAll) {
                if (item.iconText === "文本") {
                    item.iconChecked = this.layerOptions.baseTile11.detailLabelInfo.exist;
                }
            }
            let map = this.chartsInstance
                .getModel()
                .getComponent("bmap")
                .getBMap();
            this.zoomResponse(map);
        },
        // 控制网格显示隐藏
        isGridDisplay: function () {
            this.layerOptions.baseTile11.exist = !this.layerOptions.baseTile11.exist;
            for (let item of this.toolsItemsAll) {
                if (item.iconText === "网格") {
                    item.iconChecked = this.layerOptions.baseTile11.exist;
                }
            }
            let map = this.chartsInstance
                .getModel()
                .getComponent("bmap")
                .getBMap();
            this.zoomResponse(map);
        },
        onRefresh: function () {
            // v_s:刷新刷新时清除定位覆盖物
            let mapClear = this.chartsInstance
                .getModel()
                .getComponent("bmap")
                .getBMap();
            let mapaddOverlay = mapClear.getOverlays();
            for (let i = 0; i < mapaddOverlay.length; i++) {
                if (mapaddOverlay[i].V.classList[0] == "BMap_Marker") {
                    mapClear.removeOverlay(mapaddOverlay[i]);
                }
            }
        },
        MapBox: function (lngLat) {
            // v_s: 地图定位方法
            this.onRefresh();
            let map = this.chartsInstance.getModel().getComponent("bmap").getBMap();
            let coordinate = [];
            for (let i = 0; i < lngLat.length; i++) {
                let bdPoint = Mesh.wgs84tobd09({
                    lng: Number(lngLat[i].lng),
                    lat: Number(lngLat[i].lat)
                });
                let new_point = new BMap.Point(bdPoint.lng, bdPoint.lat);
                // 创建标注
                let marker = new BMap.Marker(new_point);
                coordinate.push(new_point);
                map.addOverlay(marker);
            }
            map.setViewport(coordinate);
            if (lngLat.length == 1 && map) {
                setTimeout(() => {
                    map.setZoom(12);
                }, 300);
            }
        },
        addMapList: function () {
            drawtools.initPaintMap(this, "mapDiv", this.showOption);
            drawtools.setMapChina(this);
            this.$emit("drawMapInfo", this);
            //页面屏幕大小变化，重新绘制
            if (this.resizeChart) {
                window.addEventListener("resize", this.resizeChart);
            }
        },
        resizeChart: function () {
            setTimeout(() => {
                this.chartsInstance.resize();
            }, 300);
        },
        reset: function () {
            this.$emit("drawMapInfo", this);
        },
        zoomResponse: function (map) {
            let zoomLevel = map.getZoom();
            let bs = map.getCenter();
            let option = this.chartsInstance.getOption();
            option.bmap = {
                center: [bs.lng, bs.lat],
                zoom: zoomLevel
            };
            this.chartsInstance.setOption(option);
            // 根据缩放级别设置11级网格图层，网格属性图层，网格城市边界是否显示
            if (this.layerOptions.baseTile11.exist && zoomLevel >= this.layerOptions.baseTile11.showZoomLevel) {
                this.layerOptions.baseTile11.show = true;
                this.toolsItemsAll[0].iconDisabled = true;
                this.toolsItemsAll[1].iconDisabled = true;
                // 根据缩放级别设置网格城市边界图层是否显示
                if (
                    this.layerOptions.baseTile11.tileCityBoundary.exist &&
                    zoomLevel >= this.layerOptions.baseTile11.tileCityBoundary.showZoomLevel
                ) {
                    this.layerOptions.baseTile11.tileCityBoundary.show = true;
                } else {
                    this.layerOptions.baseTile11.tileCityBoundary.show = false;
                }
                // 根据缩放级别设置网格属性详细图层是否显示
                if (
                    this.layerOptions.baseTile11.detailLabelInfo.exist &&
                    zoomLevel >= this.layerOptions.baseTile11.detailLabelInfo.showZoomLevel
                ) {
                    this.layerOptions.baseTile11.detailLabelInfo.show = true;
                    this.isDetailInfoShow = true;
                } else {
                    this.layerOptions.baseTile11.detailLabelInfo.show = false;
                    this.isDetailInfoShow = false;
                }
                // 根据缩放级别设置网格属性简单图层是否显示
                if (zoomLevel < this.layerOptions.baseTile11.simpleLabelInfo.showZoomLevel) {
                    this.layerOptions.baseTile11.simpleLabelInfo.show = false;
                } else {
                    this.layerOptions.baseTile11.simpleLabelInfo.show = true;
                }
                // 根据缩放级别设置网格项目边界图层是否显示
                if (
                    this.layerOptions.baseTile11.tileProjectBoundary.exist &&
                    zoomLevel >= this.layerOptions.baseTile11.tileProjectBoundary.showZoomLevel
                ) {
                    this.layerOptions.baseTile11.tileProjectBoundary.show = true;
                } else {
                    this.layerOptions.baseTile11.tileProjectBoundary.show = false;
                }
                // 根据缩放级别设置网格当前任务包边界图层是否显示
                if (
                    this.layerOptions.baseTile11.tileCurPackageBoundary.exist &&
                    zoomLevel >= this.layerOptions.baseTile11.tileCurPackageBoundary.showZoomLevel
                ) {
                    this.layerOptions.baseTile11.tileCurPackageBoundary.show = true;
                } else {
                    this.layerOptions.baseTile11.tileCurPackageBoundary.show = false;
                }
                // 根据缩放级别设置网格上一任务包边界图层是否显示
                if (
                    this.layerOptions.baseTile11.tilePrePackageBoundary.exist &&
                    zoomLevel >= this.layerOptions.baseTile11.tilePrePackageBoundary.showZoomLevel
                ) {
                    this.layerOptions.baseTile11.tilePrePackageBoundary.show = true;
                } else {
                    this.layerOptions.baseTile11.tilePrePackageBoundary.show = false;
                }
                // 根据缩放级别设置出库网格边界图层是否显示
                if (
                    this.layerOptions.baseTile11.tileOutLibraryBoundary.exist &&
                    zoomLevel >= this.layerOptions.baseTile11.tileOutLibraryBoundary.showZoomLevel
                ) {
                    this.layerOptions.baseTile11.tileOutLibraryBoundary.show = true;
                } else {
                    this.layerOptions.baseTile11.tileOutLibraryBoundary.show = false;
                }
            } else {
                this.layerOptions.baseTile11.show = false;
                this.toolsItemsAll[0].iconDisabled = false;
                this.toolsItemsAll[1].iconDisabled = false;
                this.layerOptions.baseTile11.tileCityBoundary.show = false;
                this.layerOptions.baseTile11.detailLabelInfo.show = false;
                this.layerOptions.baseTile11.simpleLabelInfo.show = false;
                this.layerOptions.baseTile11.tileProjectBoundary.show = false;
                this.layerOptions.baseTile11.tileCurPackageBoundary.show = false;
                this.layerOptions.baseTile11.tilePrePackageBoundary.show = false;
                this.layerOptions.baseTile11.tileOutLibraryBoundary.show = false;
            }
            // 根据可视区进行各图层绘制
            this.drawAccordingToScreenArea(map);
        },
        // 根据可视区进行各图层绘制
        drawAccordingToScreenArea: function (map) {
            if (this.layerOptions.baseTile11.exist && this.layerOptions.baseTile11.show) {
                // 获取可视区内网格
                let tilesInScreen = drawtools.getScreenAllTiles(this.chartsInstance, 11);
                // 获取当前的缩放级别
                let zoomLevel = map.getZoom();
                // 根据可视区绘制11级网格
                this.drawBaseTile11Level(tilesInScreen, zoomLevel);
                // 根据可视区绘制网格城市边界
                if (this.routerParams === "tileManage" || this.routerParams === "listMode") {
                    this.drawTileCityBoundary(tilesInScreen);
                }
                // 如果当前缩放级别小于项目边界的显示层级，隐藏项目边界
                if (zoomLevel < this.layerOptions.baseTile11.tileProjectBoundary.showZoomLevel) {
                    let drawParamsObj = this.drawBoundaryParam.projectParamsObj;
                    drawtools.drawTileBoundary(this.chartsInstance, [], drawParamsObj);
                }
            } else {
                // 隐藏11级网格层
                drawtools.drawBaseTile(this.chartsInstance, [], false);
                // 隐藏网格城市边界
                if (this.routerParams === "tileManage" || this.routerParams === "listMode") {
                    let paramObj = this.drawBoundaryParam.cityParamObj;
                    drawtools.drawTileBoundary(this.chartsInstance, [], paramObj);
                }
                // 隐藏网格项目边界、任务包边界、出库网格边界
                if (this.routerParams.startsWith("assignments") || this.routerParams.startsWith("tileProgress")) {
                    let projectParamsObj = this.drawBoundaryParam.projectParamsObj;
                    drawtools.drawTileBoundary(this.chartsInstance, [], projectParamsObj);
                    let predrawParamsObj = this.drawBoundaryParam.predrawParamsObj;
                    drawtools.drawTileBoundary(this.chartsInstance, [], predrawParamsObj);
                    let curdrawParamsObj = this.drawBoundaryParam.curdrawParamsObj;
                    drawtools.drawTileBoundary(this.chartsInstance, [], curdrawParamsObj);
                    let outLibraryParamsObj = this.drawBoundaryParam.outLibraryParamsObj;
                    drawtools.drawTileBoundary(this.chartsInstance, [], outLibraryParamsObj);
                }
            }
        },
        // 11级网格层绘制
        drawBaseTile11Level: function (tilesInScreen, zoomLevel) {
            // 向父组件传递可视区内的网格,在父组件获取网格属性信息
            let sendData = {
                tilesInScreen: tilesInScreen,
                zoomLevel: zoomLevel
            };
            // flag标识为detail的时候，需要获取网格的详细信息，为simple的时候只需要获取状态信息
            if (zoomLevel >= this.layerOptions.baseTile11.detailLabelInfo.showZoomLevel) {
                sendData["flag"] = "detail";
                this.$emit("sendTilesInScreen", sendData);
            } else if (zoomLevel >= this.layerOptions.baseTile11.showZoomLevel) {
                sendData["flag"] = "simple";
                this.$emit("sendTilesInScreen", sendData);
            } else {
                // 只需要绘制基础网格，不需要请求网格任何属性信息
                this.drawBaseTileMethod(tilesInScreen);
            }
        },
        drawBaseTileMethod: function (tilesInScreen, formatter) {
            // 绘制11级网格
            // 不同页面传递不同配置参数
            let visualMapInfo = this.defaultvisualMap;
            let constructParamsArr = {};
            if (this.routerParams === "tileManage") {
                visualMapInfo = this.tileManageVisualMapInfo;
                constructParamsArr = this.tileManageInfo;
            } else if (this.routerParams === "assignments3000") {
                visualMapInfo = this.visualMapInfo3000;
                constructParamsArr = this.allowInState;
            } else if (this.routerParams === "assignments") {
                visualMapInfo = this.assignmentsVisualMapInfo;
                constructParamsArr = this.assignmentsInfo;
            } else if (this.routerParams === "tileProgress") {
                visualMapInfo = this.tileProgressVisualMapInfo;
                constructParamsArr = this.tileProgresssInfo;
            }
            let tileData = [];
            // 构造数据结构
            for (let tileBox of tilesInScreen) {
                tileData.push(drawtools.dataConstruct(tileBox, constructParamsArr));
            }
            if (this.isDetailInfoShow) {
                drawtools.drawBaseTile(
                    this.chartsInstance,
                    tileData,
                    this.layerOptions.baseTile11.detailLabelInfo.show,
                    this.haveLegend,
                    visualMapInfo,
                    formatter
                );
            } else {
                drawtools.drawBaseTile(
                    this.chartsInstance,
                    tileData,
                    this.layerOptions.baseTile11.simpleLabelInfo.show,
                    this.haveLegend,
                    visualMapInfo
                );
            }
            // 选中网格高亮
            drawtools.highLighReset(this.chartsInstance, this.tileList, 0);
        },
        // 网格城市边界绘制、隐藏
        drawTileCityBoundary: function (tileData) {
            if (
                this.layerOptions.baseTile11.tileCityBoundary.exist &&
                this.layerOptions.baseTile11.tileCityBoundary.show
            ) {
                // 绘制网格城市边界
                drawtools.getTileAttrInfo(this, tileData, 11);
            } else {
                // 隐藏网格城市边界
                let paramObj = this.drawBoundaryParam.cityParamObj;
                drawtools.drawTileBoundary(this.chartsInstance, [], paramObj);
            }
        },
        // 网格项目边界绘制、隐藏
        drawTileProjectBoundary: function (tileData) {
            let drawParamsObj = this.drawBoundaryParam.projectParamsObj;
            drawParamsObj.tileBoundaryFlag = this.layerOptions.baseTile11.tileProjectBoundary.show;
            if (
                this.layerOptions.baseTile11.tileProjectBoundary.exist &&
                this.layerOptions.baseTile11.tileProjectBoundary.show
            ) {
                // 绘制网格项目边界
                let boundaryPoints = drawtools.getScreenTileBoundaryPoint(tileData, 11, drawParamsObj.indexFlag);
                drawtools.drawTileBoundary(this.chartsInstance, boundaryPoints, drawParamsObj);
            } else {
                // 隐藏网格项目边界
                drawtools.drawTileBoundary(this.chartsInstance, [], drawParamsObj);
            }
        },
        // 出库网格边界绘制、隐藏
        drawTileOutLibraryBoundary: function (tileData) {
            let drawParamsObj = this.drawBoundaryParam.outLibraryParamsObj;
            drawParamsObj.tileBoundaryFlag = this.layerOptions.baseTile11.tileOutLibraryBoundary.show;
            if (
                this.layerOptions.baseTile11.tileOutLibraryBoundary.exist &&
                this.layerOptions.baseTile11.tileOutLibraryBoundary.show
            ) {
                // 绘制出库网格边界边界
                let boundaryPoints = drawtools.getScreenTileBoundaryPoint(tileData, 11, drawParamsObj.indexFlag);
                drawtools.drawTileBoundary(this.chartsInstance, boundaryPoints, drawParamsObj);
            } else {
                // 隐藏出库网格边界边界
                drawtools.drawTileBoundary(this.chartsInstance, [], drawParamsObj);
            }
        },
        // 网格任务包边界绘制、隐藏
        drawTilePackageBoundary: function (tileData) {
            if (this.layerOptions.baseTile11.tileCurPackageBoundary.exist) {
                let curdrawParamsObj = this.drawBoundaryParam.curdrawParamsObj;
                curdrawParamsObj.tileBoundaryFlag = this.layerOptions.baseTile11.tileCurPackageBoundary.show;
                if (
                    this.layerOptions.baseTile11.tileCurPackageBoundary.exist &&
                    this.layerOptions.baseTile11.tileCurPackageBoundary.show
                ) {
                    // 绘制网格当前任务包边界
                    let curboundaryPoints = drawtools.getScreenTileBoundaryPoint(
                        tileData,
                        11,
                        curdrawParamsObj.indexFlag
                    );
                    drawtools.drawTileBoundary(this.chartsInstance, curboundaryPoints, curdrawParamsObj);
                } else {
                    // 隐藏当前网格任务包边界
                    drawtools.drawTileBoundary(this.chartsInstance, [], curdrawParamsObj);
                }
            }
            if (this.layerOptions.baseTile11.tilePrePackageBoundary.exist) {
                let predrawParamsObj = this.drawBoundaryParam.predrawParamsObj;
                predrawParamsObj.tileBoundaryFlag = this.layerOptions.baseTile11.tilePrePackageBoundary.show;
                if (
                    this.layerOptions.baseTile11.tilePrePackageBoundary.exist &&
                    this.layerOptions.baseTile11.tilePrePackageBoundary.show
                ) {
                    // 绘制网格上一任务包边界
                    let preboundaryPoints = drawtools.getScreenTileBoundaryPoint(
                        tileData,
                        11,
                        predrawParamsObj.indexFlag
                    );
                    drawtools.drawTileBoundary(this.chartsInstance, preboundaryPoints, predrawParamsObj);
                } else {
                    // 隐藏网格上一任务包边界
                    drawtools.drawTileBoundary(this.chartsInstance, [], predrawParamsObj);
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.map {
    width: 100%;
    height: 100%;
    position: relative;
    .map-div {
        width: 100%;
        height: 100%;
    }
}
</style>