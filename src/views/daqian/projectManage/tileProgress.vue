<template>
    <div class="tileProgress">
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea">
                    <div class="selectDiv">
                        <span class="align-right">所属项目：</span>
                        <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus" @selectProjects="SelectProjects" :ChangeOnselect="projectChangeOnselect" :isProjectClearable="isProjectClearable" :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject" :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">环节及状态：</span>
                        <el-cascader size="medium" placeholder="选择环节或状态" :options="options" filterable change-on-select @change="chooseSegment" clearable v-model="segmentAndStatus"></el-cascader>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus" :content="search.tileID">
                            <el-input size="medium" slot="reference" v-model="search.tileID" clearable placeholder="请输入网格编号" @change="formatSearchInput()"></el-input>
                        </el-popover>
                    </div>
                    <div class="operation">
                        <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                        <div>
                            <el-switch v-model="barShow" active-text="网格分布"></el-switch>
                        </div>

                    </div>
                </div>
            </div>

        </div>
        <div class="progress-bar" v-show="barShow" v-if="this.datasMap.segmentText1">
            <div class="progress-plain">
                <div class="progress-plain-text">
                    网格分布
                </div>
                <div class="progress-plain-items">
                    <span class="gray"></span>
                    <p>未开始</p>
                </div>
                <div class="progress-plain-items">
                    <span class="yellow"></span>
                    <p>进行中</p>
                </div>
                <div class="progress-plain-items">
                    <span class="red"></span>
                    <p>异常</p>
                </div>
                <div class="progress-plain-items">
                    <span class="green"></span>
                    <p>已完成</p>
                </div>
                <div class="progress-plain-items">
                    <span class="nodata"></span>
                    <p>无数据</p>
                </div>
            </div>
            <div class="progress-bar-body">
                <div class="progress-bar-item" :class='`${typeof progressSegmentInfo[index] != "undefined"?datasMap.segmentStatusMap[progressSegmentInfo[index].segment_status]:""} ${datasMap.segmentText[index] === barName?"checked": ""}`' v-for="(item,index) in this.datasMap.segmentText1" :key="item">
                    <div class="item-arrow-left"></div>
                    <div class="item-text">
                        <div class="item-text-content" @click="chooseBar(index)">
                            <p>{{item}}</p>
                            <p>{{typeof progressSegmentInfo[index] === "undefined" ? "" : progressSegmentInfo[index].tile_number}}</p>
                        </div>
                    </div>
                    <div class="item-arrow-right"></div>
                </div>
            </div>
        </div>
        <div class="tab-area">
            <el-tabs v-model="showMode" type="card" @tab-click="handleClick">
                <el-tab-pane label="列表模式" name="List"></el-tab-pane>
                <el-tab-pane label="地图模式" name="Map" :disabled="!isSelectSubproject || !this.totalNumber"></el-tab-pane>
            </el-tabs>
            <!-- <form class="export-div" action="/api/query_tile_progress_info" enctype="application/json">
                <input type="hidden" name="user_id" v-model="search.userid">
                <input type="hidden" name="sub_project_id" v-model="search.subProjectID">
                <input type="hidden" name="segment" v-model="search.segment">
                <input type="hidden" name="segment_status" v-model="search.segmentStatus">
                <input type="hidden" name="tile_id" v-model="search.tileID">
                <input type="hidden" name="query_or_export_data" value="1">
                <input type="hidden" name="path_name" value="网格进度">
                <input type="hidden" name="page_index" value="1">
                <input type="hidden" name="page_size" value="1">
                <input type="hidden" name="return_all" value="1">
                <el-button class="left-button" size="medium" type="primary" plain native-type="submit">导出</el-button>
            </form> -->
            <el-button class="export-button" size="medium" type="primary" plain @click="exportFile">导出</el-button>
            <p class="select-number">总共 <b>{{totalNumber}}</b> 条</p>
            <div class="show-area">
                <!-- 地图展示区 begin-->
                <div v-show="showMode === 'Map'" class="map-area" v-bind:style="{height: global.mapHeight + 'px'}">
                    <drawMap ref="drawMap" @sendTilesInScreen="sendTilesInScreen" @drawMapInfo="drawMapInfo" :haveLegend="true" :routerParams="routerParams"></drawMap>
                </div>
                <div v-show="showMode !== 'Map'">
                    <div class="table-div">
                        <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="tilesTables" border style="width: 100%" @sort-change="sortTable">
                            <el-table-column fixed prop="tile_id" label="编号" width="130" show-overflow-tooltip sortable="custom"></el-table-column>
                            <el-table-column prop="city_name" show-overflow-tooltip label="城市"></el-table-column>
                            <el-table-column prop="show_sub_project" label="所属子项目" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="show_segment" show-overflow-tooltip label="当前环节"></el-table-column>
                            <el-table-column prop="show_segment_status" show-overflow-tooltip label="环节状态"></el-table-column>
                            <el-table-column prop="tile_mileage" show-overflow-tooltip label="数据里程（km）" sortable="custom"></el-table-column>
                        </el-table>
                    </div>
                    <!-- 表格分页 begin-->
                    <div class="pagination-area">
                        <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="filter.currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="filter.perPage" layout="total, sizes, prev, pager, next, jumper" :total="totalNumber">
                        </el-pagination>
                    </div>
                    <!-- 表格分页 end-->
                </div>
                <!-- 列表展示区 end-->
            </div>
        </div>
    </div>
</template>
<script>
import drawMap from "@/components/daqian_drawMap.vue";
import selectProject from "@/components/daqian_selectProject.vue";
import { validateData, trim, alertInfo, messageInfo, getSubString, showDataSet, inputCheck, downloadFile } from "@/utils/daqian_tools";
import { setMapCity, drawCityBoundary, dataConstruct } from "@/utils/daqian_drawtools";
export default {
    components: {
        selectProject,
        drawMap
    },
    data() {
        return {
            formHeight: this.global.formHeight,
            projectChangeOnselect: false, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
            isProjectClearable: false, //是否允许删除项目，true 允许 false  不允许
            havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认,即为选择全部项目
            showSelectProject: false, //是否可选择 false 可选择 true 不可选择
            resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
            search: {
                mainProjectID: "",
                subProjectID: "",
                segment: "0",
                segmentStatus: "0",
                sort_field_name: "tile_id desc",
                tileID: ""
            },
            barShow: true,
            datasMap: {
                segmentStatusColor: {
                    1: "rgba(128,128,128,0.8)",
                    2: "rgba(255,140,0,0.8)",
                    3: "rgba(255,0,0,0.8)",
                    4: "rgba(0,128,0,0.8)"
                },
                outLibraryAllStatus: {
                    "2": "出库排队",
                    "3": "出库中",
                    "4": "出库成功",
                    "5": "出库失败"
                },
                inLibraryAllStatus: {
                    "1": "未回库",
                    "2": "回库排队",
                    "3": "回库中",
                    "4": "回库成功",
                    "5": "回库失败",
                    "6": "不回库"
                },
                preProcessAllStatus1: {
                    "1": "未开始",
                    "2": "排队中",
                    "3": "处理中",
                    "4": "完成",
                    "5": "失败"
                },
                preProcessAllStatus2: {
                    "1": "未开始",
                    "2": "排队中",
                    "3": "处理中",
                    "4": "处理完成且效果达标",
                    "6": "处理完成但未达标",
                    "5": "失败"
                },
                preProcessAllStatus3: {
                    "1": "未开始",
                    "3": "处理中",
                    "4": "处理完成且效果达标",
                    "6": "处理完成但未达标",
                    "5": "挂起",
                    "7": "暂停"
                },
                preProcessAllStatus4: {
                    "2": "排队中",
                    "3": "准出中",
                    "4": "通过",
                    "6": "不通过",
                    "5": "失败"
                },
                productionAllowInAllStatus: {
                    "10": "未生成任务包",
                    "12": "未分配质检员",
                    "3001": "准入未开始",
                    "3002": "准入中",
                    "3003": "准入暂停",
                    "3004": "准入通过",
                    "3005": "准入不通过"
                },
                workStatus: {
                    "1": "作业未开始",
                    "2": "作业中",
                    "3": "一检返工作业中",
                    "4": "一检返修作业中",
                    "5": "一检质检中",
                    "6": "一检返工质检中",
                    "7": "一检返修质检中",
                    "8": "一检通过",
                    "10": "未生成任务包",
                    "11": "未分配作业员",
                    "12": "未分配一检员",
                    "13": "一检质检未开始",
                    "14": "作业暂停",
                    "15": "一检返工作业暂停",
                    "16": "一检返修作业暂停",
                    "17": "一检质检暂停",
                    "18": "一检返工质检暂停",
                    "19": "一检返修质检暂停",
                    "20": "一检返工作业未开始",
                    "21": "一检返修作业未开始",
                    "103": "二检返工作业中",
                    "104": "二检返修作业中",
                    "105": "二检质检中",
                    "106": "二检返工质检中",
                    "107": "二检返修质检中",
                    "108": "二检通过",
                    "110": "未生成二检任务",
                    "112": "未分配二检员",
                    "113": "二检质检未开始",
                    "115": "二检返工作业暂停",
                    "116": "二检返修作业暂停",
                    "117": "二检质检暂停",
                    "118": "二检返工质检暂停",
                    "119": "二检返修质检暂停",
                    "120": "二检返工作业未开始",
                    "121": "二检返修作业未开始",
                    "2002": "机检排队中",
                    "2003": "机检处理中",
                    "2004": "机检完成",
                    "2005": "机检失败"
                },
                segmentDatas: [{
                    "1": "出库"
                }, {
                    "24": "特征识别",
                    "20": "自动融合",
                    "2001": "融合准出",
                    "22": "人工融合",
                    "23": "P矩阵生成",
                    "21": "路网建模",
                    "2101": "后预处理准出"
                }, {
                    "3000": "生产准入",
                }, {
                    "30": "基础作业",
                    "32": "基础接边",
                    "34": "高阶作业",
                    "36": "高阶接边",
                    "38": "回库接边"
                }, {
                    "2": "回库"
                }],
                segmentData: [{
                    "1": "出库",
                    "24": "特征识别",
                    "20": "自动融合",
                    "2001": "融合准出",
                    "22": "人工融合",
                    "23": "P矩阵生成",
                    "21": "路网建模",
                    "2101": "后预处理准出",
                    "3000": "生产准入",
                    "30": "基础作业",
                    "32": "基础接边",
                    "34": "高阶作业",
                    "36": "高阶接边",
                    "38": "回库接边",
                    "2": "回库"
                }],
                segmentText: {
                    out_library: "出库",
                    featrue_match_info: "特征识别",
                    dy_mix_info: "自动融合",
                    dyrh_allow_out_info: "融合准出",
                    dy_manual_adjustment_info: "人工融合",
                    hycl_pjz_info: "P矩阵生成",
                    dysb_rs_lanejm_info: "路网建模",
                    hycl_allow_out_info: "后预处理准出",
                    operation_allow_in: "生产准入",
                    basic_element_operation: "基础作业",
                    basic_element_jb_operation: "基础接边",
                    senior_element_operation: "高阶作业",
                    senior_element_jb_operation: "高阶接边",
                    city_jb_operation: "回库接边",
                    in_library: "回库"
                },
                segmentStatusMap: {
                    1: "gray",
                    2: "yellow",
                    3: "red",
                    4: "green"
                }
            },
            showMode: "List",
            totalNumber: 0,
            isSelectSubproject: false,
            emptyText: "查询中",
            searchDatas: null,
            loading: true,
            routerParams: "tileProgress",
            filter: {
                perPage: 10,
                currentPage: 1
            },
            tileProgressTables: [],
            totalCityList: [],
            progressSegmentInfo: {},
            segmentAndStatus: [],
            allTileProgressTables: [],
            barName: ""
        }
    },
    computed: {
        options: function () { //组装环节及状态的数据
            let arr = [];
            this.datasMap.segmentDatas.forEach((val, index) => {
                let keys = Object.keys(val);
                keys.forEach(ele => {
                    let childrenDatas = null;
                    if (index === 0) {
                        childrenDatas = this.datasMap.outLibraryAllStatus;
                    } else if (index === 1) {
                        if (ele == "21" || ele == "23") {
                            childrenDatas = this.datasMap.preProcessAllStatus1;
                        } else if (ele == "20" || ele == "24") {
                            childrenDatas = this.datasMap.preProcessAllStatus2;
                        } else if (ele == "22") {
                            childrenDatas = this.datasMap.preProcessAllStatus3;
                        } else if (ele == "2001" || ele == "2101") {
                            childrenDatas = this.datasMap.preProcessAllStatus4;
                        }
                    } else if (index === 2) {
                        childrenDatas = this.datasMap.productionAllowInAllStatus;
                    } else if (index === 3) {
                        childrenDatas = this.datasMap.workStatus;
                    } else if (index === 4) {
                        childrenDatas = this.datasMap.inLibraryAllStatus;
                    }
                    let childrenKeys = Object.keys(childrenDatas);
                    let childrenArr = [];
                    childrenKeys.forEach(v => {
                        childrenArr.push({
                            value: v,
                            label: childrenDatas[v]
                        })
                    })
                    arr.push({
                        value: ele,
                        label: val[ele],
                        children: childrenArr
                    })
                })
            });
            return arr;
        },
        tableData: function () {
            this.tileProgressTables.forEach(val => {
                val.show_sub_project = showDataSet(val.sub_project_id, val.sub_project_name);
                for (let item of this.options) {
                    if (item.value == val.segment) {
                        val.show_segment = item.label;
                        for (let child of item.children) {
                            if (child.value == val.segment_status) {
                                val.show_segment_status = child.label;
                                break;
                            }
                        }
                    }
                }
            })
            return this.tileProgressTables;
        }
    },
    watch: {
        totalCityList: function (val, oldval) {
            let boundaryStyle = {
                strokeWeight: 1.5,
                strokeColor: '#000',
                fillOpacity: 0.1,
                fillColor: '#409EFF'
            };
            if (validateData(val)) {
                if (this.$refs.drawMap) {
                    drawCityBoundary(this.$refs.drawMap.chartsInstance, val, true, false, boundaryStyle);
                }
            }
        }
    },
    methods: {
        onSearch: function (arg) {
            this.showMode = "List";
            this.searchProgressInfo(arg);
            this.searchProgressInfo({ showMode: "Map" });
            if (this.search.segment) {
                this.options.forEach(item => {
                    if (item.value == this.search.segment) {
                        this.barName = item.label;
                        return
                    }
                })
            } else {
                this.barName = "";
            }
        },
        onRefresh: function (arg) {
            this.showMode = "List";
            this.search.segment = "";
            this.search.segmentStatus = ""
            this.search.sort_field_name = "tile_id desc";
            this.search.tileID = "";
            this.barName = "";
            this.$refs.tilesTables.clearSort();
            this.segmentAndStatus = [];
            this.searchProgressInfo(arg);
            this.searchProgressInfo({ showMode: "Map" });
        },
        handleClick: function (val) {

        },
        drawMapInfo: function (data) {
            let that = data;
            let initCity = '';
            // 设置地图默认定位至城市为子项目下第一个网格所在城市
            if (validateData(this.totalCityList)) {
                initCity = this.tileProgressTables.length > 0 ? this.tileProgressTables[0].city_name : this.totalCityList[0];
                setMapCity(that, initCity);
            }
        },
        searchProgressInfo: function (arg) {
            this.emptyText = "查询中";
            let queryProjectData = {
                sub_project_id: this.search.subProjectID,
                segment: this.search.segment,
                segment_status: this.search.segmentStatus,
                sort_field_name: this.search.sort_field_name,
                tile_id: this.search.tileID,
                query_or_export_data: arg && arg.showMode == "Map" ? 2 : 0, //0为查询，2为查询可视化数据
                page_index: this.filter.currentPage,
                page_size: this.filter.perPage,
                return_all: 2
            };
            if (!(arg && arg.loading)) {
                if (!(arg && arg.return_all)) {
                    this.tileProgressTables = [];
                    this.totalNumber = 0;
                    this.searchDatas = queryProjectData;
                }
                this.filter.currentPage = 1;
                this.loading = true;
            }
            this.isSelectSubproject = validateData(this.search.subProjectID);
            this.searchDatas.page_index = this.filter.currentPage;
            this.searchDatas.page_size = this.filter.perPage;
            this.searchDatas.query_or_export_data = arg && arg.showMode == "Map" ? 2 : 0;
            this.$http.post("/api/query_tile_progress_info", this.searchDatas).then(
                response => {
                    this.loading = false;
                    response = response.body;
                    let data = response.data;
                    if (data.errno === 0 || data.errno === 7) {
                        if (data.errno === 7) {
                            this.emptyText = "未查询到符合条件的数据";
                        } else {
                            this.progressSegmentInfo = data.data.sub_project_progress_info;
                            this.datasMap.segmentText1 = this.datasMap.segmentText;
                            this.totalNumber = Number(data.data.total_number);
                            if (arg && arg.showMode) {
                                this.allTileProgressTables = data.data.tile_progress_info;
                                this.totalCityList = data.data.total_city_list;
                                this.$refs.drawMap.reset();
                            } else {
                                this.tileProgressTables = data.data.tile_progress_info;
                            }
                            if (this.totalNumber == 0) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.emptyText = "加载中";
                            }
                        }
                    } else {
                        this.emptyText = "查询失败";
                    }
                },
                response => {
                    // 响应错误回调
                    this.loading = false;
                    this.emptyText = "查询失败";
                }
            )
        },
        chooseSegment: function (val) {
            if (validateData(val)) {
                this.search.segment = val[0] || "0";
                this.search.segmentStatus = val[1] || "0";
            } else {
                this.search.segment = "";
                this.search.segmentStatus = "";
            }
        },
        SelectProjects: function (data) {
            this.search.mainProjectID = data.project_id;
            this.search.subProjectID = data.sub_project_id;
            if (data.init) {
                this.onSearch();
            }
        },
         //查询输入框格式校验
        formatSearchInput: function() {
            this.search.tileID = inputCheck(this, this.search.tileID, 1);
            // sessionStorage.tileID = this.search.tileID;
        },
        updateProjectStatus: function (data) {
            this.resetselectProjectData = false;
        },
        sortTable: function (val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "tile_id desc";
            }
            this.onSearch();
        },
        pageSizeChange: function (val) {
            this.multipleTileSelection = [];
            this.filter.perPage = val;
            this.searchProgressInfo({
                loading: true
            });
        },
        pageCurrentChange: function (val) {
            this.filter.currentPage = val;
            this.searchProgressInfo({
                loading: true
            });
        },
        tileManagerformatter: function (params) {
            let zoomLevel;
            if (this.$refs.drawMap) {
                zoomLevel = this.$refs.drawMap.chartsInstance
                    .getModel()
                    .getComponent("bmap")
                    .getBMap()
                    .getZoom();
            }
            let res = `${params.data.name}`;
            if (validateData(params.data.city)) {
                res += `\n\n城市：${params.data.city}`;
            }
            if (validateData(params.data.sub_project_name)) {
                // res += `\n\n所属项目：${params.data.sub_project_name}`;
                let tempStr = `\n\n所属项目：${params.data.sub_project_name}`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            if (validateData(params.data.segment)) {
                res += `\n当前环节：${params.data.segment}`;
            }
            if (validateData(params.data.segment_status)) {
                let tempStr = `\n\n当前状态：${params.data.segment_status}`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            return res;
        },
        getSubStringWithZoom: function(zoomLevel, tempStr) {
            let res = '';
            if (Number(zoomLevel) === 12) {
                let subStr = getSubString(tempStr, 22).split(",");
                for (let item of subStr) {
                    res += `${item}\n`;
                }
            } else {
                let subStr = getSubString(tempStr, 48).split(",");
                for (let item of subStr) {
                    res += `${item}\n`;
                }
            }
            return res;
        },
        sendTilesInScreen: function (val) {
            let { flag, tilesInScreen } = val;
            for (let tile of this.allTileProgressTables) {
                for (let item of tilesInScreen) {
                    if (Number(item.tileID) === Number(tile.tile_id)) {
                        if (tile.is_out_library_tile) {
                            item["is_out_library_tile"] = tile.is_out_library_tile;
                        }
                        item["city"] = tile.city_name;
                        item["sub_project_name"] = tile.sub_project_name;
                        for (let item of this.options) {
                            if (item.value == tile.segment) {
                                tile.show_segment = item.label;
                                for (let child of item.children) {
                                    if (child.value == tile.segment_status) {
                                        tile.show_segment_status = child.label;
                                        break;
                                    }
                                }
                            }
                        }
                        item["segment"] = tile.show_segment;
                        item["segment_status"] = tile.show_segment_status;
                        item["isCurrent"] = tile.is_current;
                        item["status"] = tile.segment;
                        break;
                    }
                }
            }
            this.$refs.drawMap.drawBaseTileMethod(tilesInScreen, this.tileManagerformatter);
            this.$refs.drawMap.drawTileOutLibraryBoundary(tilesInScreen);
        },
        chooseBar: function (val) {
            for (let item of this.options) {
                if (item.label == this.datasMap.segmentText[val]) {
                    this.barName = item.label;
                    this.segmentAndStatus = [item.value];
                    this.search.segment = item.value;
                    this.search.segmentStatus = "";
                    this.onSearch();
                    break;
                }
            }
        },
        exportFile: function (){
            let postData = Object.assign({},this.searchDatas)
            postData.query_or_export_data = 1;
            downloadFile(this,postData,"/api/query_tile_progress_info")
        }
    }
}
</script>

<style lang="scss" scoped>
$width: 100%;
$height: 100%;
.tileProgress {
    height: $height;
    width: $width;
    overflow: auto;

    .searchArea {
        width: $width;
        min-height: 50px;
        padding-top: 10px;
        background: #fff;
        display: flex;
        opacity: 1;
        flex-direction: column;

        .searchDiv {
            width: $width;
            height: 100%;
        }

        .selectArea {
            margin-top: 10px;
            width: $width;
            overflow: hidden;
        }

        .selectDiv {
            float: left;
            margin: 0 15px 10px 10px;
        }

        .align-right {
            text-align: right;
            min-width: 84px;
            display: inline-block;
            margin-left: 20px;
        }
        .input-style {
            display: inline-block;
            width: 300px;
        }
        .operation {
            width: 400px;
            float: left;
            margin-left: 30px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            div{
                margin-left: 20px;
            }
        }
        .input-style-1 {
            display: inline-block;
        }
    }
    .progress-bar {
        margin-top: 10px;
        padding-top: 5px;
        background-color: #fff;
        .progress-plain {
            display: flex;
            justify-content: flex-end;
            margin-left: 40px;
            margin-bottom: 5px;
            margin-right: 30px;
            .progress-plain-text {
                flex: 1;
                text-align: left;
            }
            .progress-plain-items {
                p {
                    font-size: 12px;
                }
                span {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 8px;
                    margin-right: 6px;
                }
                .green {
                    background-color: rgba($color: green, $alpha: 0.6);
                }
                .yellow {
                    background-color: rgba($color: #ff8c00, $alpha: 0.6);
                }
                .gray {
                    background-color: rgba($color: gray, $alpha: 0.6);
                }
                .red {
                    background-color: rgba($color: red, $alpha: 0.6);
                }
                .nodata {
                    background-color: rgba($color: #afeeee, $alpha: 0.8);
                }
                display: flex;
                align-items: center;
                margin-right: 20px;
                height: 20px;
            }
        }

        .progress-bar-body {
            display: flex;
            padding: 0px 30px 0px 70px;
            flex-wrap: wrap;
            padding-left: 70px;
            font-size: 13px;
            .progress-bar-item {
                color: #2c3e50;
                position: relative;
                // &:nth-child(1) {
                    // margin-left: 0;
                    // .item-arrow-left {
                    //     border-color: rgba($color: green, $alpha: 0.6);
                    //     border-width: 22px;
                    //     border-style: solid;
                    // }
                // }
                &:before {
                    background-color: rgba($color: #afeeee, $alpha: 0.6);
                }
                .item-text {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba($color: #afeeee, $alpha: 0.6);
                    flex: 1;
                    height: 100%;
                    width: 58px;
                    text-align: left;
                    .item-text-content {
                        p {
                            width: 100%;
                        }
                        position: absolute;
                        top: 0;
                        left: 20px;
                        width: 58%;
                        height: 100%;
                        text-align: center;
                        cursor: pointer;
                    }
                }
                .item-arrow-left {
                    width: 44px;
                    height: 100%;
                    border-color: rgba($color: #afeeee, $alpha: 0.6) rgba($color: #afeeee, $alpha: 0.6)
                        rgba($color: #afeeee, $alpha: 0.6) transparent;
                    border-width: 20px;
                    border-style: solid solid solid dashed;
                }
                .item-arrow-right {
                    width: 44px;
                    height: 100%;
                    border-color: transparent transparent transparent rgba($color: #afeeee, $alpha: 0.6);
                    border-width: 20px;
                    border-style: dashed dashed dashed solid;
                }
                height: 40px;
                margin-right: 2px;
                margin-left: -42px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
            }
            .checked:before {
                content: "";
                width: 88px;
                height: 3px;
                border-radius: 5px;
                position: absolute;
                top: -6px;
                left: 8px;
            }
            .green {
                .item-text {
                    background-color: rgba($color: green, $alpha: 0.6);
                }
                .item-arrow-left {
                    border-color: rgba($color: green, $alpha: 0.6) rgba($color: green, $alpha: 0.6)
                        rgba($color: green, $alpha: 0.6) transparent;
                }
                .item-arrow-right {
                    border-color: transparent transparent transparent rgba($color: green, $alpha: 0.6);
                }
                &:before {
                    background-color: rgba($color: green, $alpha: 0.6);
                }
            }
            .yellow {
                .item-text {
                    background-color: rgba($color: #ff8c00, $alpha: 0.6);
                }
                .item-arrow-left {
                    border-color: rgba($color: #ff8c00, $alpha: 0.6) rgba($color: #ff8c00, $alpha: 0.6)
                        rgba($color: #ff8c00, $alpha: 0.6) transparent;
                }
                .item-arrow-right {
                    border-color: transparent transparent transparent rgba($color: #ff8c00, $alpha: 0.6);
                }
                &:before {
                    background-color: rgba($color: #ff8c00, $alpha: 0.6);
                }
            }
            .gray {
                .item-text {
                    background-color: rgba($color: gray, $alpha: 0.6);
                }
                .item-arrow-left {
                    border-color: rgba($color: gray, $alpha: 0.6) rgba($color: gray, $alpha: 0.6)
                        rgba($color: gray, $alpha: 0.6) transparent;
                }
                .item-arrow-right {
                    border-color: transparent transparent transparent rgba($color: gray, $alpha: 0.6);
                }
                &:before {
                    background-color: rgba($color: gray, $alpha: 0.6);
                }
            }
            .red {
                .item-text {
                    background-color: rgba($color: red, $alpha: 0.6);
                }
                .item-arrow-left {
                    border-color: rgba($color: red, $alpha: 0.6) rgba($color: red, $alpha: 0.6)
                        rgba($color: red, $alpha: 0.6) transparent;
                }
                .item-arrow-right {
                    border-color: transparent transparent transparent rgba($color: red, $alpha: 0.6);
                }
                &:before {
                    background-color: rgba($color: red, $alpha: 0.6);
                }
            }
        }
    }
    .tab-area {
        width: $width;
        margin: 10px auto 0px auto;
        padding: 8px 15px 30px 15px;
        background: #fff;
        position: relative;

        .select-number {
            font-size: 16px;
            text-align: left;
        }

        .btn-list {
            width: 95%;
            height: 40px;
            margin: 0px auto 0px auto;
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

        .span-totalNumber {
            font-size: 38px;
            color: #ffd04b;
            font-weight: bold;
            margin: 5px 10px 5px 10px;
        }

        .segmenting-line {
            height: 1px;
            width: 95%;
            margin: 0px auto 0px auto;
            background-color: #ccc;
            overflow: hidden;
        }

        .el-dropdown-link {
            margin: 5px 10px 5px 10px;
            font-size: 12px;
        }
        .pagination-area {
            width: 95%;
            text-align: right;
            margin: 30px 0 0px 0;
        }
    }
    .left-button {
        float: left;
        margin: 10px 0px 5px 10px;
    }
    .export-button {
        position: absolute;
        top: 10px;
        left: 215px;
        pointer-events: auto;
    }
}
</style>
<style lang="scss">
.tileProgress {
    .el-tabs__header {
        margin: 0 0 8px;
    }
}
</style>
