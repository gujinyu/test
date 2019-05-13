<template>
    <div class="userInfo">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <!-- v_s 经度和纬度 -->
            <input-val :coordinate="reset.coordinate"></input-val>
            <div class="open">
                <div class="operation">
                    <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                    <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                </div>
            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 列表、地图tab切换区 begin-->
        <div class="tab-area">
            <!-- 模式切换 begin -->
            <el-tabs v-model="reset.showMode" type="card" @tab-click="handleClick">
                <el-tab-pane label="列表模式" name="List"></el-tab-pane>
                <el-tab-pane label="地图模式" :disabled="reset.tableData.length === 0" name="Map"></el-tab-pane>
            </el-tabs>
            <!-- 模式切换 end-->
            <!-- 按钮区 begin-->
            <div class="button-area">
                <el-button size="medium" type="primary" @click="batchQuery">批量查询</el-button>
                <el-button size="medium" type="primary" @click="handleDownload">导出</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="select-area">
                <span class="select-number">总共 <b>{{this.reset.totalNumber}}</b> 条</span>
            </div>
        </div>
        <!-- 列表、地图tab切换区 end-->
        <!-- 展示区 begin-->
        <div class="show-area">
            <!-- 地图展示区 begin-->
            <div v-show="reset.showMode === 'Map'" class="map-area" v-bind:style="{height: global.mapHeight + 'px'}">
                <drawMap ref="drawMap" @sendTilesInScreen="sendTilesInScreen" :haveLegend="haveLegend" :routerParams="routerParams"></drawMap>
            </div>
            <!-- 地图展示区 end-->
            <!-- 列表展示区 begin-->
            <table-compoent v-show="reset.showMode !== 'Map'" ref="MapBox" :tableData="reset.tableData" :dataList="dataList" :english="english">
            </table-compoent>
            <div v-show="reset.showMode !== 'Map'">
                <el-pagination class="pagination-area" @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="reset.filter.currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="reset.filter.perPage" layout="total, sizes, prev, pager, next, jumper" :total="reset.totalNumber">
                </el-pagination>
            </div>
            <!-- 列表展示区 end-->
        </div>
        <!-- 弹框区域begin -->
        <batch-query :importCsvView="importCsvView" @uploadHedden="uploadHedden" @reqFun="reqBody"></batch-query>
        <!-- 弹框区域end -->
    </div>
</template>
<script>
import Vue from "vue";
import { wgsToTileID } from "@/utils/mesh.js";
import inputVal from "@/components/daqian_tipsInput.vue";
import tableCompoent from "./daqian_listComponent.vue";
import batchQuery from "./daqian_batchQuery.vue";
import drawMap from "@/components/daqian_drawMap.vue";
import { validateData, alertInfo } from "@/utils/daqian_tools";
export default {
    components: {
        inputVal,
        tableCompoent,
        batchQuery,
        drawMap
    },
    data() {
        return {
            importCsvView: false,
            routerParams: "listMode",
            haveLegend: false,
            dataList: ['经度','纬度','11级网格','13级网格','11级网格归属城市'], // 表头所有的表格列可以在父组件里传过来
            english: ['lng','lat','tatleList','tatleList13','city'], // 原始返回数据的键
            reset: { // v_s: reset是刷新要重置的数据
                listDatas: [],
                showMode: "List", //模式切换
                filter: { // 分页组件数据
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                coordinate: [
                    {
                        name: "经度",
                        value: "",
                        longitude: "",
                        placeholder: "请输入...",
                        tips: "经度：-180～180范围内数值，如：116.391", // 示例为北京中心经度
                    },
                    {
                        name: "纬度",
                        value: "",
                        dimension: "",
                        placeholder: "请输入...",
                        tips: "纬度：-90～90范围内数值，如：39.905" // 示例为北京中心纬度
                    }
                ],
                tableData: [], // 该数组是渲染表格用的
                allTableData: [], // 请求到的数据会保存在这个数组里
            }
        };
    },
    methods: {
        pageCurrentChange: function (val) { //切页
            this.reset.filter.currentPage = val;
            // 调用数组分隔方法重新渲染视图
            this.pageaddsize();
        },
        pageSizeChange: function (val) { // 每页显示的条数
            this.reset.filter.currentPage = 1; // 每页显示条数更改时要重置显示的页码
            this.reset.filter.perPage = val;
            // 调用数组分隔方法重新渲染视图
            this.pageaddsize();
        },
        // 地图列表模式按钮被点击时执行
        handleClick: function(tab, event){
            if(this.reset.showMode == 'Map') {
                this.MapLocation(this.reset.listDatas);
            }
        },
        uploadHedden: function() {
            this.importCsvView = false;
        },
        // 批量查询弹框关闭方法
        batchQuery: function() {
            this.importCsvView = true;
        },
        // 切页和每页显示的条数变化时执行的方法
        pageaddsize: function () {
            this.reset.tableData = this.reset.allTableData.slice((this.reset.filter.currentPage-1)*this.reset.filter.perPage,this.reset.filter.perPage*this.reset.filter.currentPage)
        },
        // 导出按钮事件
        handleDownload: function () {
            if(!this.reset.tableData.length){
                return alertInfo(this, "error", "导出数据不能为空！");
            }
            this.exportFun();
        },
        // 导出方法实现
        exportFun: function () {
            const loading = this.$loading({
                lock: true,
                text: '正在导出...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
            });
            const filterVal = ['lng','lat','tatleList','tatleList13','city'];
            const tHeader = ['经度','纬度','11级网格','13级网格','11级网格归属城市'];
            //更改导出方式，减少插件加载
            // \uFEFF 解决中文乱码问题
            let csvData = "\uFEFF" + tHeader.join(",") + "\n";
            for (let val of this.reset.allTableData){
                let arr = [];
                for(let index of filterVal) {
                    arr.push(val[index])
                }
                csvData += arr.join(",") + "\n";
            }
            let blob = new Blob( [csvData] , { type:'text/csv' })
            let a = document.createElement('a');
                a.download = "坐标数据.csv";
                a.href = window.URL.createObjectURL(blob);
                a.click();
            loading.close();
            this.$message({
                message: '导出成功',
                type: 'success',
                duration: 2500
            });
        },
        // 发送请求的方法
        SendRequest: function(data,arrList) {
            this.$http.post("/api/query_tile_attribution_info", data).then(res=>{
                if (res.body.data.errno === 0 || res.body.data.errno === 7){
                    let {msg,data:{tile_list:data,total_number}} = res.body.data;
                    this.reset.totalNumber = arrList.length;
                    // 将返回的数据城市赋值给arrList数组
                    arrList.map(ele=>data.map(val=>{
                        if (val.tile_id == ele.tatleList){
                            ele.city = val.city
                        }
                    }))
                    // 将数据保存到数组中
                    this.reset.allTableData = arrList;
                    // 根据分页渲染列表
                    this.pageaddsize();
                } else {
                    alertInfo(this, "error", "网格查询失败，" + res.body.data.msg);
                }
            })
        },
        onSearch: function() { // 查询
            // 判断坐标是否正确
            if(this.reset.coordinate[0].value == '' || this.reset.coordinate[1].value == '') {
                return alertInfo(this, "error", "经度、纬度的值都不可为空，请修改后再试！");
            };
            if(-180<=this.reset.coordinate[0].value&&this.reset.coordinate[0].value<=180&&-90<=this.reset.coordinate[1].value&&this.reset.coordinate[1].value<=90){
                this.reset.filter.currentPage = 1;
                let lngLat = {lng:this.reset.coordinate[0].value,lat:this.reset.coordinate[1].value};
                let tatleList = wgsToTileID(lngLat,11)+'';
                let tatleList13 = wgsToTileID(lngLat,13)+'';
                var objData = [{tatleList,lng:this.reset.coordinate[0].value,lat:this.reset.coordinate[1].value,tatleList13}];
            } else {
                return alertInfo(this, "error", "经纬度格式不准确经度范围-180~180,负数表示西经；纬度范围-90~90，负数表示南纬！");
            };
            this.reqBody(objData)
        },
        // 请求体
        reqBody: function(arrList) {
            this.reset.listDatas = arrList;
            let titleIdList = '';
            for (let i of arrList) {
                if (i.tatleList == '') {
                    return alertInfo(this, "error", "网格查询失败，请输入要查询的经纬度！");
                }
                titleIdList += i.tatleList+','
            }
            if(this.reset.showMode == 'Map') {
                this.MapLocation(arrList);
            }
            let data = {
                "tile_list": titleIdList, // v_s：输入经纬度时将经纬度转换成网格编号
                "page_index": this.reset.filter.currentPage,  // 当前是第几页
                "page_size": this.reset.filter.perPage, // 每页显示的条数
                "return_all": 1        //1为返回全部，2为返回分页信息
            };
            this.SendRequest(data,arrList)
        },
        onRefresh: function() { // 清空按钮
            if (this.reset.showMode == 'Map') {
                // 在地图模式下去调用地图组件的刷新方法
                this.MapLocation('onRefresh')
            }
            // 在列表模式下将data数据还原为初始值
            Object.assign(this.$data.reset, this.$options.data().reset) // v_s: 初始化data数据
        },
        tileManagerformatter: function(params) {
            let zoomLevel;
            let res = `${params.data.name}`;
            if (validateData(params.data.city)) {
                res += `\n\n城市：${params.data.city}`;
            }
            return res;
        },
        // 在地图模式调用地图的刷新和定位方法
        MapLocation: function (lngLat) {
            if(lngLat == 'onRefresh'){
                // 刷新时清除所有地图定位
                this.$refs.drawMap.onRefresh()
            }else{
                // 根据导入的坐标在地图上标出位置
                this.$refs.drawMap.MapBox(lngLat)
            }
        },
        // 显示查询的的网格城市
        sendTilesInScreen: function (val) {
            let { flag, tilesInScreen} = val;
            for (let tile of this.reset.allTableData) {
                for (let item of tilesInScreen) {
                    if (Number(item.tileID) === Number(tile.tatleList)) {
                        item["city"] = tile.city;
                        break;
                    }
                }
            }
            this.$refs.drawMap.drawBaseTileMethod(tilesInScreen, this.tileManagerformatter);
        }
    }
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;
.userInfo {
    height: $height;
    width: $width;
    overflow: auto;
    .searchArea {
        width: $width;
        min-height: 50px;
        padding-top: 10px;
        background: #fff;
        opacity: 1;
    }
    .tab-area {
        width: $width;
        margin: 10px auto 0px auto;
        padding: 8px 15px 0px 15px;
        background: #fff;
        position: relative;
    }
    .button-area {
        margin: -55px auto 0px auto;
        position: absolute;
        right: 20px;
        pointer-events: auto;
    }
    .show-area {
        width: $width;
        margin: 0px 0px 10px 0px;
        padding: 0px 0 30px 0;
        background: #fff;
        opacity: 1;
        .btn-list {
            width: 97%;
            height: 40px;
            margin: 20px auto 0px auto;
        }
        span {
            float: left;
            font-size: 20px;
            text-align: left;
            line-height: 40px;
            font-weight: bold;
            margin: 5px 10px 5px 10px;
        }
        .span-left {
            margin: 5px 0px 5px 0px;
        }
        .span-right {
            margin: 5px 10px 5px 0px;
        }
        // .span-totalNumber {
        //     font-size: 38px;
        //     color: #ffd04b;
        //     font-weight: bold;
        //     margin: 5px 10px 5px 10px;
        // }
        .segmenting-line {
            height: 1px;
            width: $width;
            margin: 0px auto 0px auto;
            background-color: #ccc;
            overflow: hidden;
        }
        .table-div {
            width: $width;
            padding: 0px 15px 0px 15px;
        }
        .pagination-area {
            width: $width;
            text-align: right;
            margin: 30px 0px 0px 0;
            padding-right: 15px;
        }
        .map-area {
            width: $width;
            padding: 0px 15px 0px 15px;
        }
    }
}
</style>