<template>
    <div class="assignments">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv">
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium" @change="selectSectionChange">
                            <el-radio-button label="">不限</el-radio-button>
                            <el-radio-button label="50">限速批处理</el-radio-button>
                            <el-radio-button label="51">护栏批处理</el-radio-button>
                        </el-radio-group>
                        <!--<el-select size="medium" v-model="search.selectSection" clearable placeholder="全部">
                            <el-option value="50" label="限速批处理"></el-option>
                            <el-option value="51" label="护栏批处理"></el-option>
                        </el-select>-->
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">所属项目：</span>
                        <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus"
                            @selectProjects="SelectProjects" :ChangeOnselect="ChangeOnselect" :isProjectClearable="isProjectClearable"
                            :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject"
                            :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">状态：</span>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                            <el-option value="1" label="未触发"></el-option>
                            <el-option value="2" label="排队中"></el-option>
                            <el-option value="3" label="处理中"></el-option>
                            <el-option value="4" label="处理完成"></el-option>
                            <el-option value="5" label="处理失败"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover class="input-style" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件"
                            trigger="focus" :content="search.tileID">
                            <el-input size="medium" slot="reference" v-model="search.tileID" :change="formatSearchInput()"
                                clearable placeholder="搜索网格编号">
                            </el-input>
                        </el-popover>
                        <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 网格列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">作业后处理</span>
                <el-button class="right-div" type="primary" size="medium" :disabled="accessDisabled" @click="triggerbatchProcess()">log下载</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="tilesTables" border style="width: 100%" @select="tileSelectionChange" @select-all="tileSelectionChange"
                    @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column fixed prop="tile_level" label="网格层级" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="priority_level" label="优先级" show-overflow-tooltip width="65"></el-table-column>
                    <el-table-column prop="show_process_segment" label="作业后处理环节" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="show_process_status" label="作业后处理状态" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="show_process_mode" label="当前触发类型" show-overflow-tooltip min-width="105"></el-table-column>
                    <el-table-column prop="show_user" label="触发用户" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="human_touch_time" label="触发时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                    <el-table-column prop="host_name" label="处理机器" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="start_time" label="处理开始时间" show-overflow-tooltip sortable="custom" min-width="155"></el-table-column>
                    <el-table-column prop="end_time" label="处理结束时间" show-overflow-tooltip sortable="custom" min-width="155"></el-table-column>
                    <el-table-column prop="log_version" show-overflow-tooltip label="处理后log版本" width="115"></el-table-column>
                    <el-table-column prop="data_version" show-overflow-tooltip label="处理后数据版本" width="120"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                </el-table>
            </div>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="filter.currentPage"
                    :page-sizes="[10,20,50,100,1000]" background :page-size="filter.perPage" layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </div>
        <!--    网格列表 end-->
        <el-dialog title="批处理log下载" :visible.sync="dialogTriggerVisible" :close-on-click-modal="false">
            <el-form label-width="120px" :model="triggerData" ref="triggerData" class="demo-dynamic">
                <el-form-item label="选择环节" required prop="confirmselectTaskType">
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="triggerData.confirmselectTaskType" label="50">限速批处理</el-radio>
                        <el-radio v-model="triggerData.confirmselectTaskType" label="51">护栏批处理</el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="网格列表" prop="tileIDS" :rules="[{ required: true, message: '请选择或输入要下载log的网格ID', trigger: 'blur'},
                { required: true, message: '请选择或输入要下载log的网格ID', trigger: 'change'}]">
                    <el-input v-model="triggerData.tileIDS" :change="formatTriggerInput()" @blur="refreshSelectTiles(triggerData.tileIDS)"
                        type="textarea" placeholder="请选择或输入要下载log的网格ID，多个网格ID用分号分隔，仅可输入数字和分号" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{triggerData.postTileS.length}}</b>条记录（去重后）</p>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationForm()">确定</el-button>
                    <el-button @click="dialogTriggerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--  <el-dialog title="作业后处理操作" :visible.sync="dialogTriggerVisible" :close-on-click-modal="false">
            <el-form label-width="120px" :model="triggerData" ref="triggerData"  class="demo-dynamic">
                <el-form-item label="选择操作" required prop="selectOperation">
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="triggerData.selectOperation" label="3" @change="operationChange()">触发</el-radio>
                        <el-radio v-model="triggerData.selectOperation" label="4" @change="operationChange()">下载log</el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="选择环节" prop="batchselectTaskType"  v-if="triggerData.selectOperation==3"
                    :rules="[{ type: 'array', required: true, message: '请至少选择一个环节', trigger: 'change'}]">
                        <el-checkbox-group style="float: left" v-model="triggerData.batchselectTaskType">
                            <el-checkbox label='50'>限速批处理</el-checkbox>
                            <el-checkbox label='51'>护栏批处理</el-checkbox>
                        </el-checkbox-group>
                </el-form-item>
                <el-form-item label="选择环节" v-else required prop="confirmselectTaskType">
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="triggerData.confirmselectTaskType" label="50">限速批处理</el-radio>
                        <el-radio v-model="triggerData.confirmselectTaskType" label="51">护栏批处理</el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="网格列表"  prop="tileIDS"
                :rules="[{ required: true, message: '请选择或输入要操作的网格ID', trigger: 'blur'},
                { required: true, message: '请选择或输入要操作的网格ID', trigger: 'change'}]">
                    <el-input v-model="triggerData.tileIDS"
                    :change = "formatTriggerInput()"
                    @blur="refreshSelectTiles(triggerData.tileIDS)" type="textarea"
                    placeholder="请选择或输入要操作的网格ID，多个网格ID用分号分隔，仅可输入数字和分号"
                    :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{triggerData.postTileS.length}}</b>条记录（去重后）</p>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationForm()">确定</el-button>
                    <el-button @click="dialogTriggerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>-->
    </div>

</template>

<script>
    import {
        trim,
        alertInfo,
        inputCheck,
        showDataSet
    } from "@/utils/daqian_tools";
    import selectProject from "@/components/daqian_selectProject.vue";
    export default {
        components: {
            selectProject
        },
        data() {
            return {
                formHeight: this.global.formHeight,
                search: {
                    userId: sessionStorage.userid,
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    selectSection: "",
                    selectState: "",
                    tileID: "",
                    sort_field_name: "tile_id desc"
                },
                searchDatas: {},
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                tilesTable: [],
                pageSize: [10, 50, 100],
                multipleTileSelection: [],
                dialogTriggerVisible: false,
                triggerData: {
                    tileIDS: "",
                    tileInfos: "",
                    postTileS: [],
                    postTileInfos: [],
                    selectOperation: "4",
                    confirmselectTaskType: "50",
                    batchselectTaskType: ["50"],
                    subProjectID: 0
                },
                accessDisabled: false,
                ChangeOnselect: false, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: false, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                loading: true,
                emptyText: "查询中",
                allTableData: [],
                selectAllFlag: false,
                selectNumber: 0
            };
        },
        updated() {
            this.$refs.tilesTables.clearSelection()
            var tmpSelectData = this.multipleTileSelection[this.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let index in this.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.tableData[index])) {
                            this.$refs.tilesTables.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
                this.multipleTileSelection[this.filter.currentPage - 1] = arr;
            }
        },
        computed: {
            tableData: function () {
                if (this.tilesTable) {
                    for (var val of this.tilesTable) {
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_user = showDataSet(val.user_id, val.user_name);
                        if (val.process_segment === "50") {
                            val.show_process_segment = "限速批处理";
                        } else if (val.process_segment === "51") {
                            val.show_process_segment = "护栏批处理";
                        }

                        if (val.process_status === "1") {
                            val.show_process_status = "未触发";
                        } else if (val.process_status === "2") {
                            val.show_process_status = "排队中";
                        } else if (val.process_status === "3") {
                            val.show_process_status = "处理中";
                        } else if (val.process_status === "4") {
                            val.show_process_status = "处理完成";
                        } else if (val.process_status === "5") {
                            val.show_process_status = "处理失败";
                            if (val.fail_description) {
                                val.show_process_status = "处理失败，失败原因：" + val.fail_description;
                            } else {
                                val.show_process_status = "处理失败，失败原因：无";
                            }
                        }
                        if (val.process_mode === "1") {
                            val.show_process_mode = "限速";
                        } else if (val.process_mode === "2") {
                            val.show_process_mode = "护栏";
                        } else if (val.process_mode === "3") {
                            val.show_process_mode = "限速+护栏";
                        }
                    }
                    return this.tilesTable
                }
            }
        },
        created() {
            if (sessionStorage.userrole == 4) {
                this.accessDisabled = true;
            } else {
                this.accessDisabled = false;
            }
            if (sessionStorage.tileID) {
                this.search.tileID = sessionStorage.tileID;
            }
        },
        methods: {
            searchTiles: function (arg) {
                this.triggerData.subProjectID = this.search.selectSubprojectID;
                this.emptyText = "查询中";
                var query_tilesdata = {
                    user_id: sessionStorage.userid,
                    sub_project_id: this.search.selectSubprojectID,
                    process_segment: this.search.selectSection,
                    process_status: this.search.selectState,
                    tile_list: this.search.tileID,
                    sort_field_name: this.search.sort_field_name,
                    page_size: this.filter.perPage,
                    page_index: this.filter.currentPage,
                    return_all: arg && arg.return_all ? arg.return_all : 2
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.tilesTable = [];
                        this.totalNumber = 0;
                        this.searchDatas = query_tilesdata;
                    }
                    this.filter.currentPage = 1;
                    this.multipleTileSelection = [];
                    this.loading = true;
                }
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_size = this.filter.perPage;
                this.searchDatas.page_index = this.filter.currentPage;
                this.$http.post("/api/query_operation_post_process_status", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.totalNumber = data.data.total_number;
                                if (arg && arg.return_all) {
                                    var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                    for (var i = 0; i < pagesNumber; i++) {
                                        this.multipleTileSelection[i] = data.data.operation_post_process_info.slice(
                                            i * this.filter.perPage,
                                            (i + 1) * this.filter.perPage
                                        );
                                    }
                                    this.allTableData = Object.assign([], this.allTableData, this.multipleTileSelection);
                                    if (this.allTableData.length > 0) {
                                        this.tilesTable = this.allTableData[0];
                                    }
                                    this.$refs.tilesTables.clearSelection();
                                    this.tableData.forEach(row => {
                                        this.$refs.tilesTables.toggleRowSelection(row);
                                    });
                                    this.getSelectDatas();
                                } else {
                                    this.tilesTable = data.data.operation_post_process_info;
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
                );
            },
            onSearch: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.searchTiles(event);
            },
            onRefresh: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.search.selectState = "";
                this.$refs.tilesTables.clearSort();
                this.search.sort_field_name = "tile_id desc";
                if (event !== "sectionChange") {
                    this.search.tileID = "";
                    this.resetselectProjectData = true;
                } else {
                    this.searchTiles();
                }
            },
            selectSectionChange: function () {
                this.onRefresh("sectionChange");
            },
            formatSearchInput: function () {
                this.search.tileID = inputCheck(this, this.search.tileID, 1);
                sessionStorage.tileID = this.search.tileID;
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
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
                if (this.allTableData.length > 0) {
                    this.tilesTable = this.allTableData[val - 1];
                    return;
                }
                this.searchTiles({
                    loading: true
                });
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchTiles({
                        return_all: 1
                    });
                } else {
                    this.multipleTileSelection = [];
                    this.$refs.tilesTables.clearSelection();
                    this.getSelectDatas();
                }
            },
            getSelectDatas: function () {
                let num = 0;
                for (let val of this.multipleTileSelection) {
                    num += val.length;
                }
                this.selectNumber = num;
                this.selectAllFlag = this.totalNumber == this.selectNumber;
            },
            tileSelectionChange: function (val) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.filter.currentPage - 1) {
                        this.multipleTileSelection[this.filter.currentPage - 1] = val;
                    } else {
                        if (typeof this.multipleTileSelection[i] == "undefined") {
                            this.multipleTileSelection[i] = [];
                        }
                    }
                }
                this.getSelectDatas();
            },
            formatTriggerInput: function () {
                this.triggerData.tileIDS = inputCheck(this, this.triggerData.tileIDS, 2);
            },
            formatConfirmInput: function () {
                this.triggerData.tileInfos = inputCheck(this, this.triggerData.tileInfos, 3);
            },
            triggerbatchProcessDataSet: function () {
                var tileIDS = "";
                this.triggerData.postTileS = [];
                var postTileS = [];
                if (this.multipleTileSelection) {
                    for (var val of this.multipleTileSelection) {
                        if (val) {
                            for (var item of val) {
                                if (postTileS.indexOf(item.tile_id) == -1) {
                                    //去重
                                    postTileS.push(item.tile_id);
                                    var tmpTile = {};
                                    tmpTile.tile_id = item.tile_id;
                                    tmpTile.log_version = item.log_version;
                                    this.triggerData.postTileS.push(tmpTile);
                                    if (tileIDS) {
                                        tileIDS = tileIDS + ";" + item.tile_id;
                                    } else {
                                        tileIDS = item.tile_id;
                                    }
                                }
                            }
                        }
                    }
                    this.triggerData.tileIDS = tileIDS;
                }
            },
            triggerbatchProcess: function () {
                this.triggerbatchProcessDataSet();
                this.dialogTriggerVisible = true;
            },
            refreshSelectTiles: function (str) {
                var inputTileIds = str.split(";");
                var tableIDs = [];
                for (var val of this.tilesTable) {
                    tableIDs.push(val.tile_id);
                }
                var notExistArray = [];
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (this.multipleTileSelection[i]) {
                        for (var j = 0; j < this.multipleTileSelection[i].length; j++) {
                            if (inputTileIds.indexOf(this.multipleTileSelection[i][j].tile_id) <= -1) {
                                if (this.filter.currentPage === i + 1) {
                                    var unselectindex = this.tableData.indexOf(this.multipleTileSelection[i][j]);
                                    this.$refs.tilesTables.toggleRowSelection(this.tableData[unselectindex]);
                                }
                                this.multipleTileSelection[i].splice(j, 1);
                                j--;
                            }
                        }
                    }
                }
                for (var sel of inputTileIds) {
                    var tableindex = tableIDs.indexOf(trim(sel));
                    if (tableindex > -1) {
                        //判断网格是否存在
                        //console.log('第'+tableindex+'个');
                        var inpage = Math.floor(tableindex / this.filter.perPage); //判断网格在第几页
                        //console.log('当前第'+inpage+'页');
                        //console.log(this.multipleTileSelection[inpage]);
                        if (this.multipleTileSelection[inpage]) {
                            //网格所在页是否已有选中的网格
                            //console.log(this.multipleTileSelection[inpage].length);
                            if (this.multipleTileSelection[inpage].length) {
                                var thisPageSelectIDs = [];
                                for (var seltile of this.multipleTileSelection[inpage]) {
                                    thisPageSelectIDs.push(seltile.tile_id);
                                }
                                var index = thisPageSelectIDs.indexOf(sel);
                                //console.log('在选中数组中的位置'+index);
                                if (index <= -1) {
                                    //该网格未选中
                                    var selectTileinfo = this.tilesTable.slice(tableindex, tableindex + 1);
                                    if (selectTileinfo) {
                                        this.multipleTileSelection[inpage] = this.multipleTileSelection[inpage].concat(
                                            selectTileinfo
                                        );
                                        //console.log('存入选中数组');
                                    }
                                    if (this.filter.currentPage === inpage + 1) {
                                        var currentpageindex = this.tableData.indexOf(this.tilesTable[tableindex]);
                                        if (currentpageindex > -1) {
                                            //console.log('切换第'+currentpageindex+'行选择状态');
                                            this.$refs.tilesTables.toggleRowSelection(this.tableData[
                                                currentpageindex]);
                                        }
                                    }
                                }
                            } else {
                                this.multipleTileSelection[inpage] = this.tilesTable.slice(tableindex, tableindex +
                                    1);
                                if (this.filter.currentPage === inpage + 1) {
                                    var currentpageindex = this.tableData.indexOf(this.tilesTable[tableindex]);
                                    if (currentpageindex > -1) {
                                        this.$refs.tilesTables.toggleRowSelection(this.tableData[currentpageindex]);
                                    }
                                }
                            }
                        } else {
                            //网格所在页没有已选中网格
                            this.multipleTileSelection[inpage] = this.tilesTable.slice(tableindex, tableindex + 1);
                            if (this.filter.currentPage === inpage + 1) {
                                var currentpageindex = this.tableData.indexOf(this.tilesTable[tableindex]);
                                if (currentpageindex > -1) {
                                    this.$refs.tilesTables.toggleRowSelection(this.tableData[currentpageindex]);
                                }
                            }
                        }
                    } else {
                        if (sel) {
                            notExistArray.push(sel);
                        }
                    }
                }
                var notexistString = "";
                if (notExistArray.length) {
                    notexistString = notExistArray.join(",");
                    alertInfo(this, "warning", "不存在的网格ID：" + notexistString);
                }
                this.triggerbatchProcessDataSet();
            },
            getInputTileInfos: function () {
                this.triggerData.postTileInfos = [];
                var TileInfos = this.triggerData.tileInfos.split(";"); //将各网格信息分隔存储
                var invalidString = "";
                var invalidinfo = "";
                if (TileInfos) {
                    for (var item of TileInfos) {
                        if (item.length) {
                            let tileinfo = item.split(",");
                            let tmp = {};
                            if (tileinfo.length != 3) {
                                if (invalidString) {
                                    invalidString = invalidString + "；" + item;
                                } else {
                                    invalidString = item;
                                }
                            }
                            /* else {
                                                           if (tileinfo[0]&&tileinfo[1]&&tileinfo[2]){
                                                           } else {
                                                               if (invalidString) {
                                                                   invalidString = invalidString +'；'+ item;
                                                               } else {
                                                                   invalidString = item;
                                                               }
                                                           }
                                                       }*/
                            if (tileinfo[0]) {
                                tmp.tile_id = tileinfo[0];
                            } else {
                                if (invalidinfo) {
                                    invalidinfo = invalidinfo + "；" + item;
                                } else {
                                    invalidinfo = item;
                                }
                            }
                            if (tileinfo[1]) {
                                tmp.log_version = tileinfo[1];
                            }
                            if (tileinfo[2]) {
                                tmp.data_version = tileinfo[2];
                            }
                            if (tmp) {
                                this.triggerData.postTileInfos.push(tmp);
                            }
                        }
                    }
                }
                if (invalidString) {
                    alertInfo(
                        this,
                        "warning",
                        "单个网格信息为3项（依次为网格ID，log版本和数据版本,用逗号分隔）。以下网格信息不是3项，请及时修正：" +
                        invalidString
                    );
                }
                if (invalidinfo) {
                    alertInfo(this, "warning", "网格ID不可为空。以下网格信息的网格ID为空，请及时修正：" + invalidinfo);
                }
            },
            operationChange: function () {
                //if(this.triggerData.batchselectTaskType.length == 0){
                //Vue.set(this.triggerData,'batchselectTaskType',['50']);
                this.$refs["triggerData"].validate(valid => {});
                //}
            },
            submitOperationForm: function () {
                this.$refs["triggerData"].validate(valid => {
                    if (valid) {
                        var posttriggerData = {
                            user_id: sessionStorage.userid,
                            sub_project_id: this.triggerData.subProjectID,
                            process_segment: this.triggerData.confirmselectTaskType,
                            //"process_segment_list": this.triggerData.batchselectTaskType,
                            //"process_status": this.triggerData.selectOperation,
                            tile_list: this.triggerData.postTileS
                        };
                        if (this.triggerData.selectOperation == 3) {
                            this.$http.post("/api/update_operation_post_process_status", posttriggerData).then(
                                response => {
                                    response = response.body;
                                    var data = response.data;
                                    if (data.errno === 0) {
                                        if (data.data.process_status == "3") {
                                            alertInfo(this, "success", "触发成功", () => {
                                                this.dialogTriggerVisible = false;
                                                this.searchTiles();
                                            });
                                        } else if (data.data.process_status == "4") {
                                            alertInfo(this, "success", "确认成功", () => {
                                                this.dialogTriggerVisible = false;
                                                this.searchTiles();
                                            });
                                        }
                                    } else {
                                        alertInfo(this, "error", data.msg);
                                    }
                                });
                        } else {
                            this.$http.post("/api/generate_batch_log_download_url", posttriggerData).then(
                                response => {
                                    response = response.body;
                                    var data = response.data;
                                    if (data.errno === 0) {
                                        alertInfo(this, "success", "已下发log下载命令，" + data.data.tips, () => {
                                            this.dialogTriggerVisible = false;
                                            this.searchTiles();
                                        });
                                    } else {
                                        alertInfo(this, "error", "log下载失败，" + data.msg);
                                    }
                                });
                        }
                    }
                });
            },
            SelectProjects: function (data) {
                this.search.selectProjectID = data.project_id;
                this.search.selectSubprojectID = data.sub_project_id;
                if (data.init) {
                    this.searchTiles();
                }
            },
            updateProjectStatus: function (data) {
                this.resetselectProjectData = false;
            }
        }
    };

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    .assignments {
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

        .searchDiv {
            width: $width;
        }

        .selectArea {
            margin-top: 10px;
            width: $width;
            overflow: hidden;
            .bottonBox {
                text-align: right;
                margin-bottom: 10px;
            }
        }

        .selectDiv {
            float: left;
            margin: 0 20px 15px 10px;
        }

        .selectSectionDiv {
            margin: 0 0 15px 10px;
            width: $width;
            text-align: left;
        }

        .align-right {
            text-align: right;
            min-width: 90px;
            display: inline-block;
        }

        .cascader-select-style {
            width: 300px;
        }

        .input-style {
            display: inline-block;
            margin-right: 82px;
            width: 400px;
        }

        .table-area {
            width: $width;
            margin: 10px 0px 10px 0px;
            padding: 10px 0 30px 0;
            background: #fff;
            opacity: 1;

            .btn-list {
                width: 95%;
                height: 40px;
                margin: 0px auto 0px auto;
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

        .left-div {
            float: left;
        }

        .left-button {
            float: left;
            margin: 10px 0px 5px 10px;
        }

        .right-div {
            float: right;
            margin: 10px 10px 5px 0;
        }

        .right-span {
            float: right;
            margin: 0px 30px 0px 0;
        }

        .tileId-area {
            width: $width;
            margin: 5px 10px 5px 0;
        }

        .radio-group {
            float: left;
            line-height: 36px;
            height: 100%;
        }

        .tipInfo {
            text-align: left;
            width: 100%;
            margin: -10px 0 0 120px;
        }
    }

</style>
