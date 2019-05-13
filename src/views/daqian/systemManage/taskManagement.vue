<template>
    <div class="taskManage">
        <div class="searchAreaDiv">
            <div class="selectArea" :style="collapseFlag?'height:100%':'height:102px'">
                <div class="selectDiv" >
                    <span class="align-right">所属子项目：</span>
                    <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus"
                        @selectProjects="SelectSubProject" :ChangeOnselect="ChangeOnselect" :isProjectClearable="isProjectClearable"
                        :havedefaultProject="true" :showSelectProject="showSelectProject"
                        :resetselectProjectData="resetselectProjectData"></selectProject>
                </div>
                <div class="selectDiv">
                    <span class="align-right">源子项目：</span>
                    <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus"
                        @selectProjects="SelectSourceSubProjectId" :ChangeOnselect="ChangeOnselect" :isProjectClearable="isProjectClearable"
                        :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject"
                        :resetselectProjectData="resetselectProjectData" :isStorage="true"></selectProject>
                </div>
                <div class="selectDiv">
                    <span class="align-right">项目类型：</span>
                    <el-select size="medium" style="width:218px" clearable v-model="search.subProjectType" placeholder="全部">
                        <el-option size="medium" v-for="(item,index) in this.datasMap.subProjectProcessAllTypes" :key="index"
                            :value="index" :label="item"></el-option>
                    </el-select>
                </div>
                <div class="selectDiv">
                    <span class="align-right">处理状态：</span>
                    <el-select size="medium" clearable v-model="search.handleStatus" placeholder="全部">
                        <el-option size="medium" v-for="(item,index) in this.datasMap.handleStatus" :key="index" :value="index"
                            :label="item"></el-option>
                    </el-select>
                </div>
                <div class="selectDiv">
                    <span class="align-right">处理阶段：</span>
                    <el-select size="medium" @change="segmentChange" clearable v-model="search.searchSegment"
                        placeholder="全部">
                        <el-option size="medium" v-for="(item,index) in this.datasMap.searchSegment" :key="index"
                            :value="index" :label="item"></el-option>
                    </el-select>
                </div>
                <div class="selectDiv">
                    <span class="align-right">任务编号：</span>
                     <el-popover class="input-style" placement="bottom-start" title="支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                        :content="search.taskId">
                    <el-input class="input-style" clearable size="medium" slot="reference"  v-model="search.taskId" placeholder="可搜索多个任务编号"></el-input>
                     </el-popover>
                </div>
                <div class="selectDiv">
                    <span class="align-right">车天编号：</span>
                    <el-popover class="input-style" placement="bottom-start" title="支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                        :content="search.carDayId">
                        <el-input class="input-style" clearable size="medium" slot="reference" v-model="search.carDayId"
                            placeholder="可搜索多个车天编号"></el-input>
                    </el-popover>
                </div>
                <div class="selectDiv">
                    <span class="align-right">存储编号：</span>
                    <el-popover class="input-style" placement="bottom-start" title="支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                        :content="search.storageTaskId">
                        <el-input size="medium" slot="reference" v-model="search.storageTaskId" 
                            clearable placeholder="可搜索多个存储编号">
                        </el-input>
                    </el-popover>
                </div>
                <div class="selectDiv">
                    <span class="align-right">机器名称：</span>
                    <el-input class="input-style-1" size="medium" clearable v-model="search.hostName" placeholder="搜索机器名称"></el-input>
                </div>
                <div class="selectDiv" v-show="tileIDShow">
                    <span class="align-right">网格编号：</span>
                    <el-popover class="input-style" placement="bottom-start" title="支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                        :content="search.tileID">
                        <el-input size="medium" slot="reference" v-model="search.tileID" :change="formatSearchInput()"
                            clearable placeholder="可搜索多个网格编号">
                        </el-input>
                    </el-popover>
                </div>
            </div>
             <div class="open">
                    <div class="more" @click="collapseFlag=!collapseFlag">
                        <div class="moreLeft" :style="collapseFlag?'margin-top:8px':'margin-top:-2px'">
                            <div :class="collapseFlag?'arrow_up':'arrow_down'"></div>
                            <div :class="collapseFlag?'arrow_up':'arrow_down'"></div>
                        </div>
                        <div class="moreRight">
                            {{!collapseFlag?"展开":"折叠"}}
                        </div>
                    </div>
                    <div class="operation">
                        <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>
        </div>
        <div class="table-area">
            <div class="btn-list">
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">个任务</span> -->
                <span class="titlespan">任务管理</span>
                <el-button class="right-div" type="primary" size="medium" @click="stopTask()">中断任务</el-button>
            </div>
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">选择所有</span></el-checkbox>
                    <p class="select-number">已选择 <b>{{stopTaskList.length}}</b> 条记录</p>
                </div>
                <el-table :empty-text="emptyText" ref="multipleTable" v-loading="loading" :max-height="formHeight"
                    element-loading-text="拼命查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)"
                    :data="tableData" border style="width: 100%" @select="SelectionChange" @select-all="SelectionChange"
                    @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="task_id" show-overflow-tooltip label="任务编号" width="105"></el-table-column>
                    <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="子项目名称" width="145"></el-table-column>
                    <el-table-column prop="show_project_name" show-overflow-tooltip label="所属主项目" width="125"></el-table-column>
                    <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="项目类型" width="105"></el-table-column>
                    <el-table-column prop="show_handle_segment" show-overflow-tooltip label="处理阶段" width="105"></el-table-column>
                    <el-table-column prop="show_handle_status" show-overflow-tooltip label="处理状态" width="105"></el-table-column>
                    <el-table-column prop="storage_task_id" show-overflow-tooltip label="存储编号" width="115"></el-table-column>
                    <el-table-column prop="car_day_id" show-overflow-tooltip label="车天编号" width="175"></el-table-column>
                    <el-table-column prop="tile_id" show-overflow-tooltip label="网格编号" width="105"></el-table-column>
                    <el-table-column prop="trigger_time" show-overflow-tooltip label="触发时间" sortable="custom" width="165"></el-table-column>
                    <el-table-column prop="start_time" show-overflow-tooltip label="开始时间" sortable="custom" width="165"></el-table-column>
                    <el-table-column prop="end_time" show-overflow-tooltip label="结束时间" sortable="custom" width="165"></el-table-column>
                    <el-table-column prop="host_name" show-overflow-tooltip label="机器名称" width="165"></el-table-column>
                    <el-table-column prop="tile_id_list" show-overflow-tooltip label="网格列表" width="185"></el-table-column>
                    <el-table-column prop="storage_task_list" show-overflow-tooltip label="存储编号列表" width="185"></el-table-column>
                    <el-table-column prop="show_flow_version" label="环境版本" show-overflow-tooltip width="125"></el-table-column>
                    <el-table-column prop="show_algorithm_version" label="算法版本" show-overflow-tooltip width="125"></el-table-column>
                    <el-table-column prop="priority_level" show-overflow-tooltip label="优先级" sortable="custom" width="105"></el-table-column>
                    <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目名称" width="105"></el-table-column>
                </el-table>
            </div>
            <div class="pagination-area">
                
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="currentPage"
                    :page-sizes="[10,20,50,100,1000]" background :page-size="perPage" layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNumber">
                </el-pagination>
            </div>

        </div>
        <el-dialog v-loading="loadingDialog" element-loading-text="正在中断任务..." element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.6)" title="中断任务" center :visible.sync="stopTaskView"
            :close-on-click-modal="false">
            <el-form label-width="70px" class="demo-dynamic">
                <el-form-item label="任务列表" prop="carPlanIDS" style="margin-right:0px">
                    <el-input type="textarea" v-model="selectListView" readonly placeholder="请选择要中止的任务" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{stopTaskList.length}}</b>条记录</p>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="stopTaskDo()">确定</el-button>
                <el-button @click="stopTaskView = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {
        validateData,
        alertInfo,
        inputCheck,
        showDataSet,
        showDescription
    } from "@/utils/daqian_tools";
    import selectProject from "@/components/daqian_selectProject.vue";

    export default {
        components: {
            selectProject
        },
        data() {
            return {
                formHeight: this.global.formHeight,
                collapseFlag: false,
                stopTaskView: false,
                taskManagement: [],
                search: {
                    user_id: sessionStorage.userid,
                    taskId: "",
                    subProjectId: "",
                    subProjectType: "",
                    storageTaskId: "",
                    carDayId: "",
                    handleStatus: "",
                    sourceSubProjectId: "",
                    hostName: "",
                    pageIndex: 1,
                    pageSize: 10,
                    sortField: "",
                    searchSegment: "",
                    tileID: ""
                },
                searchDatas: {},
                ChangeOnselect: false, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: false, //是否具有默认子项目，true 有默认 false  无默认,即为选择全部项目
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                datasMap: {
                    subProjectProcessAllTypes: {
                        "1": "常规项目",
                        "2": "更新项目",
                        "3": "修复项目",
                        "4": "继承项目",
                        "5": "构网项目"
                    },
                    handleSegment: {
                        "2": "外业任务准入质检环节",
                        "4": "构网网格出库",
                        "5": "构网网格回库",
                        "10": "图片识别环节",
                        "11": "点云拼接+P矩阵生成环节",
                        "12": "前预处理准出质检环节",
                        "2001": "点云融合准出",
                        "20": "点云融合",
                        "21": "点云识别+染色+车道线建模",
                        "22": "点云融合人工调整阶段",
                        "23": "点云融合人工调整后P矩阵生成",
                        "24": "特征匹配",
                        "2101": "后预处理准出"
                    },
                    handleStatus: {
                        "1": "未开始",
                        "2": "排队中",
                        "3": "处理中",
                        "4": "通过",
                        "5": "处理失败",
                        "6": "不通过"
                    },
                    searchSegment: {
                        "1": "前预处理",
                        "2": "后预处理",
                        "3": "出入库"
                    }
                },
                perPage: 10,
                currentPage: 1,
                prePageNum: 1,
                totalNumber: 0,
                dialogCreateVisible: false,
                dialogEditVisible: false,
                loading: false,
                emptyText: "查询中",
                stopTaskList: [],
                selectListView: "",
                multipleSelection: [],
                returnAll: 2,
                stopTaskListNumber: 0,
                loadingDialog: false,
                selectAllFlag: false,
                allTabDatas: [],
                tileIDShow: false
            };
        },
        created() {
            this.searchTaskManagement();
        },
        computed: {
            tableData: function () {
                for (var val of this.taskManagement) {
                    val.show_project_name = showDataSet(val.project_id, val.project_name);
                    val.show_sub_project_name = showDataSet(
                        val.sub_project_id,
                        val.sub_project_name
                    );
                    val.show_source_sub_project_name = showDataSet(
                        val.source_sub_project_id,
                        val.source_sub_project_name
                    );
                    val.show_sub_project_type = val.sub_project_type ?
                        this.datasMap.subProjectProcessAllTypes[val.sub_project_type] :
                        "";
                    val.show_handle_segment = val.handle_segment ?
                        this.datasMap.handleSegment[val.handle_segment] :
                        "";
                    val.show_handle_status = val.handle_status ?
                        this.datasMap.handleStatus[val.handle_status] :
                        "";
                    val.show_flow_version = showDescription(
                        "版本",
                        val.algorithm_series_id,
                        "环境版本详情",
                        val.algorithm_series_description
                    );
                    val.show_algorithm_version = showDescription(
                        "版本",
                        val.algorithm_version,
                        "算法版本详情",
                        val.algorithm_version_description
                    );
                }
                return this.taskManagement;
            }
        },
        updated() {
            this.$refs.multipleTable.clearSelection();
            var tmpSelectData = this.multipleSelection[this.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (var i in this.tableData) {
                        if (sel.task_id == this.tableData[i].task_id) {
                            this.$refs.multipleTable.toggleRowSelection(this.tableData[i]);
                        }
                    }
                }
                this.multipleSelection[this.currentPage - 1] = arr;
            }
        },
        methods: {
            searchTaskManagement: function (arg) {
                var taskManagementData = {
                    user_id: sessionStorage.userid,
                    task_id: this.search.taskId,
                    sub_project_id: this.search.subProjectId ?
                        this.search.subProjectId : "",
                    sub_project_type: this.search.subProjectType,
                    handle_segment: this.search.handleSegment,
                    storage_task_id: this.search.storageTaskId,
                    car_day_id: this.search.carDayId,
                    handle_status: this.search.handleStatus,
                    source_sub_project_id: this.search.sourceSubProjectId ?
                        this.search.sourceSubProjectId : "",
                    host_name: this.search.hostName,
                    sort_field: this.search.sortField,
                    page_index: this.currentPage,
                    page_size: this.perPage,
                    search_segment: this.search.searchSegment,
                    return_all: arg && arg.return_all ? arg.return_all : 2,
                    tile_id: this.search.tileID
                };
                this.emptyText = "查询中";
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.indexSelectArry = [];
                        this.totalNumber = 0;
                        this.searchDatas = taskManagementData;
                    }
                    this.currentPage = 1;
                    this.multipleSelection = [];
                    this.loading = true;
                }
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_index = this.currentPage;
                this.searchDatas.page_size = this.perPage;
                this.$http
                    .post("/api/query_flow_master_task_info", this.searchDatas)
                    .then(
                        response => {
                            this.loading = false;
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0 || data.errno === 7) {
                                if (data.errno === 7) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.totalNumber = Number(data.count);
                                    if (this.totalNumber == 0) {
                                        this.emptyText = "未查询到符合条件的数据";
                                    } else {
                                        this.emptyText = "加载中";
                                    }
                                    if (arg && arg.return_all) {
                                        var pagesNumber = Math.ceil(this.totalNumber / this.perPage);
                                        for (var i = 0; i < pagesNumber; i++) {
                                            this.multipleSelection[i] = data.task_info_list.slice(
                                                i * this.perPage,
                                                (i + 1) * this.perPage
                                            );
                                        }
                                        this.allTabDatas = JSON.parse(JSON.stringify(this.multipleSelection));
                                        this.taskManagement = this.allTabDatas[0];
                                        this.$refs.multipleTable.clearSelection();
                                        this.tableData.forEach(row => {
                                            this.$refs.multipleTable.toggleRowSelection(row);
                                        });
                                        this.getSelectDatas();
                                    } else {
                                        this.taskManagement = data.task_info_list;
                                    }
                                }
                            } else {
                                this.totalNumber = 0;
                                this.taskManagement = [];
                                this.emptyText = "查询失败";
                            }
                        },
                        response => {
                            // 响应错误回调
                            this.loading = false;
                            this.emptyText = "查询失败";
                        }
                    );
            },
            segmentChange: function (val) {
                if (val == 2) {
                    this.tileIDShow = true;
                    this.collapseFlag = true;
                } else {
                    this.tileIDShow = false;
                }
            },
            onSearch: function (event) {
                this.currentPage = 1;
                this.clearPageData();
                this.selectAllFlag = false;
                this.searchTaskManagement(event);
            },
            clearPageData: function () {
                this.allTabDatas = [];
                this.multipleSelection = [];
                this.getSelectDatas();
            },
            stopTaskDo: function (event) {
                if (this.stopTaskList.length > 0) {
                    this.loadingDialog = true;
                    let doList = [];
                    for (let val of this.stopTaskList) {
                        doList.push({
                            task_id: val.task_id,
                            host_name: val.host_name
                        });
                    }
                    this.$http
                        .post("/api/stop_flow_master_task", {
                            task_list: doList
                        })
                        .then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                this.loadingDialog = false;
                                alertInfo(this, "success", "任务中断命令已下发", () => {
                                    this.currentPage = 1;
                                    this.stopTaskList = [];
                                    this.stopTaskView = false;
                                    this.clearPageData();
                                    this.selectAllFlag = false;
                                    this.searchTaskManagement();
                                });
                            } else {
                                alertInfo(this, "error", "任务中断命令下发失败" + data.msg);
                                this.loadingDialog = false;
                            }
                        });
                } else {
                    alertInfo(this, "warning", "请选择需要中断的任务");
                }
            },
            stopTask: function () {
                if (this.stopTaskList.length > 0) {
                    
                    for(let val of this.stopTaskList){
                        if(val.handle_status != "3") {
                            return alertInfo(this, "warning", "中断任务的处理状态必须为 <b>处理中</b>");
                        }
                    }
                    this.stopTaskView = true;
                } else {
                    alertInfo(this, "warning", "请选择需要中断的任务");
                }
            },
            onRefresh: function (event) {
                this.search.taskId = "";
                this.search.subProjectId = "";
                this.search.subProjectType = "";
                this.search.handleSegment = "";
                this.search.storageTaskId = "";
                this.search.carDayId = "";
                this.search.handleStatus = "";
                this.search.sourceSubProjectId = "";
                this.search.hostName = "";
                this.search.searchSegment = "";
                this.search.tileID = "";
                this.clearPageData();
                this.currentPage = 1;
                this.selectAllFlag = false;
                this.loading = true;
                this.resetselectProjectData = true;
                this.searchTaskManagement();
            },
            SelectionChange: function (arg) {
                this.multipleSelection[this.currentPage - 1] = arg;
                this.getSelectDatas();
            },
            sortTable: function (val) {
                if (val.order === "descending") {
                    this.search.sort_field_name = val.prop + " desc";
                } else if (val.order === "ascending") {
                    this.search.sortField = val.prop + " asc";
                } else {
                    this.search.sortField = "";
                }
                this.selectAllFlag = false;
                this.clearPageData();
                this.onSearch();
            },
            pageSizeChange: function (val) {
                this.perPage = val;
                this.currentPage = 1;
                this.selectAllFlag = false;
                this.clearPageData();
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.currentPage = val;
                if (this.allTabDatas.length > 0) {
                    this.taskManagement = this.allTabDatas[val - 1];
                    return;
                }
                this.searchTaskManagement({
                    loading: true
                });
            },
            getSelectDatas: function () {
                let selectList = [];
                let selectListView = [];
                for (var val of this.multipleSelection) {
                    if (val) {
                        for (var item of val) {
                            selectList.push({
                                task_id: item.task_id,
                                host_name: item.host_name,
                                handle_status: item.handle_status
                            });
                            selectListView.push(item.task_id);
                        }
                    }
                }
                this.selectListView = selectListView.join("；");
                this.stopTaskList = selectList;
                this.selectAllFlag = this.stopTaskList.length == this.totalNumber;
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchTaskManagement({
                        return_all: 1
                    });
                } else {
                    this.multipleSelection = [];
                    this.$refs.multipleTable.clearSelection();
                    this.getSelectDatas();
                }
            },
            updateProjectStatus: function (data) {
                this.resetselectProjectData = false;
            },
            SelectSubProject: function (data) {
                this.search.subProjectId = data.sub_project_id;
            },
            SelectSourceSubProjectId: function (data) {
                this.search.sourceSubProjectId = data.sub_project_id;
            },
            formatSearchInput: function () {
                this.search.tileID = inputCheck(this, this.search.tileID, 1);
                sessionStorage.tileID = this.search.tileID;
            }
        }
    };

</script>
<style lang="scss" rel="stylesheet/scss">
    .taskManage {
        .demo-form-inline {
            .el-form-item {
                margin-bottom: 10px;

                .el-form-item__label {
                    padding-right: 5px !important;
                    color: #2c3e50;
                }
            }
        }
    }

</style>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    .taskManage {
        height: $height;
        width: $width;
        overflow: auto;

        .searchAreaDiv {
            width: $width;
            min-height: 50px;
            padding-top: 20px;
            background: #fff;
            opacity: 1;
            .selectArea {
                width: 100%;
                overflow: hidden;

                .selectDiv {
                    float: left;
                    margin: 0 15px 15px 10px;
                }

                .align-right {
                    text-align: right;
                    min-width: 90px;
                    display: inline-block;
                }

                .input-style {
                    display: inline-block;
                    width: 300px;
                }

                .input-style-1 {
                    display: inline-block;
                    margin-right: 82px;
                    width: 300px;
                }

                .cascader-select-style {
                    width: 250px;
                }
            }
        }

        .right-div {
            float: right;
            margin: 10px 10px 5px 0;
        }

        .table-area {
            width: $width;
            margin: 10px 0px 10px 0px;
            padding: 10px 0 30px 0;
            opacity: 1;
            background: #fff;

            .btn-list {
                width: 95%;
                height: 40px;
                margin: 0px auto 0px auto;
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

            .table-div {
                width: 95%;
                margin: 10px auto 0px auto;
            }

            .pagination-area {
                width: 95%;
                text-align: right;
                margin: 30px 0 0px 0;

                
            }
        }
        .select-area {
            p {
                width: 150px;
                text-align: left;
            }
            float: left;
            display: flex;
            align-items: center;
            .select-number {
                font-size:16px;
            }
        }
        .tipInfo {
            text-align: left;
            width: 100%;
            margin: -10px 0 -5px 70px;
        }
    }

</style>
<style lang="scss" rel="stylesheet/scss">
</style>
