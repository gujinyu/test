<template>
    <div class="machineQualityCheckList">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv" @change="selectSectionChange">
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium">
                            <el-radio-button label="130">基础要素作业机检</el-radio-button>
                            <el-radio-button label="132">基础要素接边机检</el-radio-button>
                            <el-radio-button label="134">高阶要素作业机检</el-radio-button>
                            <el-radio-button label="136">高阶要素接边机检</el-radio-button>
                            <el-radio-button label="138">回库接边机检</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">所属项目：</span>
                        <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus"
                            @selectProjects="SelectProjects" :ChangeOnselect="ChangeOnselect" :isProjectClearable="isProjectClearable"
                            :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject"
                            :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">机检类型：</span>
                        <el-select size="medium" v-model="search.MachineCheckType" clearable placeholder="全部">
                            <el-option value="1" label="常规质检"></el-option>
                            <el-option value="2" label="差分质检"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">机检状态：</span>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                            <el-option value="2" label="排队中"></el-option>
                            <el-option value="3" label="处理中"></el-option>
                            <el-option value="4" label="完成"></el-option>
                            <el-option value="5" label="处理失败"></el-option>
                            <el-option value="6" label="跳过"></el-option>
                        </el-select>
                    </div>
                    <!--v_s: 添加项目状态筛选框 -->
                    <select-check @changeEvents="changeEvent" :forArrSelectDiv="forArrSelectDiv">
                    </select-check>
                    <div class="selectDiv">
                        <span class="align-right">关联作业类型：</span>
                        <el-select size="medium" v-model="search.selectTaskType" clearable placeholder="全部">
                            <el-option value="1" label="原始作业"></el-option>
                            <el-option value="2" label="一检返工作业"></el-option>
                            <el-option value="3" label="一检返修作业"></el-option>
                            <el-option value="32" label="二检返工作业"></el-option>
                            <el-option value="33" label="二检返修作业"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">任务包编号：</span>
                        <el-popover placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus"
                            width="320" :content="search.origintaskID">
                            <el-input class="input-style-1" size="medium" slot="reference" v-model="search.origintaskID"
                                placeholder="可搜索多个任务包编号" clearable :change="formatTaskPackageIDSearchInput()">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus"
                            width="320" :content="search.tileID">
                            <el-input class="input-style-1" size="medium" slot="reference" v-model="search.tileID"
                                :change="formatTileIDSearchInput()" clearable placeholder="可搜索多个网格编号">
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
                        <el-button size="medium" type="primary" v-on:click="onSearch">筛选</el-button>
                        <el-button size="medium" type="primary" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 网格列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">自动质检列表</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">个机检任务</span> -->
                <el-tooltip content="机检失败或未开始的可以批量跳过" placement="left" effect="light">
                    <el-button class="right-div" type="primary" size="medium" :disabled="accessDisabled" @click="skipMachineCheck()">批量跳过</el-button>
                </el-tooltip>
                <el-button class="right-div" type="primary" size="medium" @click="downloadLogs()" :disabled="accessDisabled">log批量下载</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="machinemachineQualityCheckTasksTables" border style="width: 100%" @select="SelectionChange"
                    @select-all="SelectionChange" @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="machine_check_task_id" show-overflow-tooltip label="机检任务编号" sortable="custom"
                        width="130"></el-table-column>
                    <el-table-column fixed prop="origin_operation_task_id" show-overflow-tooltip label="所属任务包编号" width="120"></el-table-column>
                    <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="所属子项目" width="120"></el-table-column>
                    <el-table-column prop="show_handle_segment" show-overflow-tooltip label="机检环节" width="135"></el-table-column>
                    <el-table-column prop="show_mc_type" show-overflow-tooltip label="机检类型" width="80"></el-table-column>
                    <el-table-column prop="show_handle_status" label="机检状态" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="show_diff_server_status" label="差分状态" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="operation_task_id" show-overflow-tooltip label="关联作业任务编号" width="135"></el-table-column>
                    <el-table-column prop="show_task_type" label="关联作业类型" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="host_name" label="处理机器" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="tile_number" label="网格数量" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="tile_id_list" label="任务网格" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="start_time" label="机检开始时间" sortable="custom" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="end_time" label="机检结束时间" sortable="custom" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="mc_server_task_id" label="机检服务任务编号" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="log_data_version" label="质检log版本" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="diff_log_data_version" label="差分log版本" show-overflow-tooltip width="135"></el-table-column>
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
        <!-- 批量跳过 begin-->
        <el-dialog title="机检任务批量跳过" :visible.sync="dialogSkipMachineCheckVisible" :close-on-click-modal="false">
            <el-form ref="skipMachineCheckData" :model="skipMachineCheckData" label-width="120px" class="demo-dynamic">
                <el-form-item label="机检任务列表" size="medium" required prop="machineCheckTaskIDS" :rules="[{ required: true, message: '请选择要跳过的机检任务', trigger: 'blur'},{ required: true, message: '请选择要跳过的机检任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要跳过的机检任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="skipMachineCheckData.machineCheckTaskIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{skipMachineCheckData.postMachineCheckTaskIDS.length}}</b>条记录</p>
                <el-form-item>
                    <el-button type="primary" @click="submitSkipMachineCheckForm()">确定</el-button>
                    <el-button @click="dialogSkipMachineCheckVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 批量跳过 end-->
        <!-- Log批量下载 begin-->
        <el-dialog title="log批量下载" :visible.sync="dialogDownloadLogVisible" :close-on-click-modal="false">
            <el-form ref="downloadLogData" :model="downloadLogData" label-width="120px" class="demo-dynamic" v-loading="downloadLoading" element-loading-text="拼命下载中">
                <el-form-item label="机检任务列表" required prop="taskIDS" :rules="[{ required: true, message: '请选择要下载log的机检任务', trigger: 'blur'},{ required: true, message: '请选择要下载准入log的机检任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要下载log的机检任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="downloadLogData.taskIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{downloadLogData.postTaskIDS.length}}</b>条记录（去重后）,选择任务的log将合并为一个文件下载</p>
                <el-form-item label="文件类型" required style="margin-bottom: 10px">
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="downloadLogData.fileType" label="qc">质检log</el-radio>
                        <el-radio v-model="downloadLogData.fileType" label="diff" :disabled="search.selectSection === '3001'">差分log</el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="文件格式" required style="margin-bottom: 10px">
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="downloadLogData.fileFormat" label="csv">csv格式</el-radio>
                        <el-radio v-model="downloadLogData.fileFormat" label="pb">proto格式</el-radio>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitDownloadLogForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogDownloadLogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- Log批量下载 end-->
    </div>
</template>

<script>
    import selectProject from '@/components/daqian_selectProject.vue'
    import selectCheck from "@/components/daqian_selectCheck.vue"
    import {
        validateData,
        alertInfo,
        inputCheck,
        showDataSet,
        resize,
        parentSonPassVal, // v_s: 这个方法是遍历data数据的方法
        reQpassVal //v_s: 循环数组给请求赋值
    } from '@/utils/daqian_tools'
    export default {
        components: {
            selectProject,
            selectCheck
        },
        data() {
            return {
                forArrSelectDiv: [{
                        // v_s:这个是daqian_selectCheck.vue组件下拉菜单的数据结构
                        name: "项目状态",
                        objectType: "0", // v_s: 这个是项目状态的默认值
                        showBoxType: "el-select", // v_s:判断要渲染的标签类型
                        AllTypesSelect: {
                            "0": "全部",
                            "3": "进行中",
                            "4": "完结",
                            "5": "作废",
                            "6": "暂停"
                        }
                    }
                ],
                onSubjectStatus: 0,
                formHeight: this.global.formHeight,
                collapseFlag: false,
                search: {
                    userId: sessionStorage.userid,
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    selectSection: "130",
                    selectState: "",
                    selectResult: "",
                    origintaskID: "",
                    MachineCheckType: "",
                    tileID: "",
                    selectTaskType: "",
                    qualityNumber: "",
                    sort_field_name: "machine_check_task_id desc"
                },
                searchDatas: {},
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                accessDisabled: false,
                machinemachineQualityCheckTasksTable: [],
                nowSelectSubprojectID: 0,
                nowSelectSection: '130',
                multipleMachineTaskSelection: [],
                dialogSkipMachineCheckVisible: false,
                skipMachineCheckData: {
                    machineCheckTaskIDS: "",
                    postMachineCheckTaskIDS: []
                },
                ChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                loading: true,
                emptyText: "查询中",
                downloadLoading: false,
                downloadLogData: {
                    taskIDS: "",
                    postTaskIDS: [],
                    fileFormat: 'csv',
                    fileType: 'qc'
                },
                dialogDownloadLogVisible: false,
                selectNumber: 0,
                selectAllFlag: false,
                allTableData: [],
                changeFlag: 0
            };
        },
        updated() {
            this.$refs.machinemachineQualityCheckTasksTables.clearSelection();
            var tmpSelectData = this.multipleMachineTaskSelection[this.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let i in this.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.tableData[i])) {
                            this.$refs.machinemachineQualityCheckTasksTables.toggleRowSelection(this.tableData[i]);
                        }
                    }
                }
                this.multipleMachineTaskSelection[this.filter.currentPage - 1] = arr;
            }
        },
        computed: {
            tableData: function () {
                if (this.machinemachineQualityCheckTasksTable) {
                    for (var val of this.machinemachineQualityCheckTasksTable) {
                        if (val) {
                            val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                            if (val.project_status === "0") {
                                val.show_project_status = "全部";
                            } else if (val.project_status === "3") {
                                val.show_project_status = "进行中";
                            } else if (val.project_status === "4") {
                                val.show_project_status = "完结";
                            } else if (val.project_status === "6") {
                                val.show_project_status = "暂停";
                            } else if (val.project_status === "5") {
                                val.show_project_status = "作废";
                            }
                            if (val.handle_segment === "130") {
                                val.show_handle_segment = "基础要素作业机检";
                            } else if (val.handle_segment === "132") {
                                val.show_handle_segment = "基础要素接边机检";
                            } else if (val.handle_segment === "134") {
                                val.show_handle_segment = "高阶要素作业机检";
                            } else if (val.handle_segment === "136") {
                                val.show_handle_segment = "高阶要素接边机检";
                            } else if (val.handle_segment === "138") {
                                val.show_handle_segment = "回库接边机检";
                            }
                            if (val.handle_status === "1") {
                                val.show_handle_status = "未开始";
                            } else if (val.handle_status === "2") {
                                val.show_handle_status = "排队中";
                            } else if (val.handle_status === "3") {
                                val.show_handle_status = "处理中";
                            } else if (val.handle_status === "4") {
                                val.show_handle_status = "完成";
                            } else if (val.handle_status === "5") {
                                val.show_handle_status = "处理失败";
                            } else if (val.handle_status === "6") {
                                val.show_handle_status = "跳过";
                            }
                            if (val.task_type === "1") {
                                val.show_task_type = "原始作业";
                            } else if (val.task_type === "2") {
                                val.show_task_type = "一检返工作业";
                            } else if (val.task_type === "3") {
                                val.show_task_type = "一检返修作业";
                            } else if (val.task_type === "32") {
                                val.show_task_type = "二检返工作业";
                            } else if (val.task_type === "33") {
                                val.show_task_type = "二检返修作业";
                            }
                            if (val.mc_type == '1') {
                                val.show_mc_type = '常规质检';
                            } else if (val.mc_type == '2'){
                                val.show_mc_type = '差分质检';
                            }
                            if (val.diff_server_status == '1') {
                                val.show_diff_server_status = '成功';
                            } else if (val.diff_server_status == '2') {
                                val.show_diff_server_status = '失败';
                            }
                        }
                    }
                    // return this.machinemachineQualityCheckTasksTable.slice(
                    //     (this.filter.currentPage - 1) * this.filter.perPage,
                    //     this.filter.currentPage * this.filter.perPage
                    // );
                    return this.machinemachineQualityCheckTasksTable;
                }
            }
        },
        created() {
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
            if (sessionStorage.selectSectionMQC) {
                this.search.selectSection = sessionStorage.selectSectionMQC;
            }
            if (sessionStorage.tileID) {
                this.search.tileID = sessionStorage.tileID;
            }
        },
        mounted() {
            this.$nextTick(function () {
                resize()
            })
        },
        methods: {
            changeEvent: function (val) {
                // v_s: 方法参数 1、要遍历的数组2、要赋值的对象名称3、要赋的值4、赋值的方向（子传父，父传子）
                parentSonPassVal(this.forArrSelectDiv, '项目状态', val, 'son_parent')
            },
            //查询输入框格式校验
            formatTileIDSearchInput: function () {
                this.search.tileID = inputCheck(this, this.search.tileID, 1);
                sessionStorage.tileID = this.search.tileID;
            },
            formatTaskPackageIDSearchInput: function () {
                this.search.origintaskID = inputCheck(this, this.search.origintaskID, 1);
            },
            searchMachineQualityCheckTasks: function (arg) {
                this.emptyText = "查询中";
                var query_machineQualityCheckInfo = {
                    project_status: reQpassVal(this.forArrSelectDiv, '项目状态'), // v_s: 项目状态
                    user_id: sessionStorage.userid,
                    query_start_time: "",
                    query_end_time: "",
                    project_id: this.search.selectProjectID,
                    sub_project_id: this.search.selectSubprojectID,
                    handle_segment: this.search.selectSection,
                    handle_status: this.search.selectState,
                    task_type: this.search.selectTaskType,
                    tile_id_list: this.search.tileID,
                    origin_operation_task_id_list: this.search.origintaskID,
                    mc_type: this.search.MachineCheckType,
                    sort_field_name: this.search.sort_field_name,
                    page_index: this.filter.currentPage,
                    page_size: this.filter.perPage,
                    return_all: arg && arg.return_all ? arg.return_all : 2
                };
                this.onSubjectStatus = reQpassVal(this.forArrSelectDiv, '项目状态');
                this.nowSelectSubprojectID = this.search.selectSubprojectID;
                this.nowSelectSection = this.search.selectSection;
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.machinemachineQualityCheckTasksTable = [];
                        this.totalNumber = 0;
                        this.searchDatas = query_machineQualityCheckInfo;
                    }
                    this.filter.currentPage = 1;
                    this.multipleMachineTaskSelection = [];
                    this.loading = true;
                }
                this.search.project_status = this.forArrSelectDiv[0].objectType; // v_s:给导出按钮执行赋值状态数据
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2
                this.searchDatas.page_index = this.filter.currentPage;
                this.searchDatas.page_size = this.filter.perPage;
                this.$http.post("/api/query_machine_quality_check_info", this.searchDatas).then(
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
                                        this.multipleMachineTaskSelection[i] = data.data.quality_check_info.slice(
                                            i * this.filter.perPage,
                                            (i + 1) * this.filter.perPage
                                        );
                                    }
                                    this.allTableData = Object.assign(
                                        [],
                                        this.allTableData,
                                        this.multipleMachineTaskSelection
                                    );
                                    if (this.allTableData.length > 0) {
                                        this.machinemachineQualityCheckTasksTable = this.allTableData[0];
                                    }
                                    this.$refs.machinemachineQualityCheckTasksTables.clearSelection();
                                    this.machinemachineQualityCheckTasksTable.forEach(row => {
                                        this.$refs.machinemachineQualityCheckTasksTables.toggleRowSelection(
                                            row);
                                    });
                                    this.getSelectDatas();
                                } else {
                                    this.machinemachineQualityCheckTasksTable = data.data.quality_check_info;
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
                this.searchMachineQualityCheckTasks(event);
            },
            onRefresh: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.search.selectState = "";
                this.search.origintaskID = "";
                this.search.selectTaskType = "";
                this.$refs.machinemachineQualityCheckTasksTables.clearSort();
                this.search.sort_field_name = "machine_check_task_id desc";
                if (event !== "sectionChange") {
                    // gu：当所属项目为主项目或全部时，项目状态为进行中；当为子项目时项目状态为全部
                    if(validateData(this.search.selectSubprojectID)){
                        this.search.project_status = "0";
                        parentSonPassVal(this.forArrSelectDiv, "项目状态", "0", "son_parent"); // 复位项目状态筛选框
                    } else {
                        this.search.project_status = "3";
                        parentSonPassVal(this.forArrSelectDiv, "项目状态", "3", "son_parent"); // 复位项目状态筛选框
                    }
                    this.search.tileID = "";
                    this.resetselectProjectData = true;
                } else {
                    this.searchMachineQualityCheckTasks();
                }
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchMachineQualityCheckTasks({
                        return_all: 1
                    });
                } else {
                    this.multipleMachineTaskSelection = [];
                    this.$refs.machinemachineQualityCheckTasksTables.clearSelection();
                    this.getSelectDatas();
                }
            },
            selectSectionChange: function () {
                sessionStorage.selectSectionMQC = this.search.selectSection;
                this.onRefresh("sectionChange");
            },
            skipMachineCheck: function () {
                if(this.onSubjectStatus == 4) {
                    return alertInfo(this, "error", "完结的项目不支持批量跳过");
                }
                if(this.onSubjectStatus == 5) {
                    return alertInfo(this, "error", "作废的项目不支持批量跳过");
                }
                if(this.onSubjectStatus == 6) {
                    return alertInfo(this, "error", "暂停的项目不支持批量跳过");
                }
                if (!validateData(this.nowSelectSubprojectID)) {
                    alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                    return;
                }
                let selectData = this.getSelectDatas();
                if (validateData(selectData.machineCheckTaskIDS)) {
                    this.skipMachineCheckData.postMachineCheckTaskIDS = [].concat(
                        JSON.parse(JSON.stringify(selectData.postMachineCheckTaskIDS))
                    );
                    this.skipMachineCheckData.machineCheckTaskIDS = selectData.machineCheckTaskIDS;
                    this.dialogSkipMachineCheckVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要批量跳过的机检任务");
                }
            },
            downloadLogs: function () {
                if (!validateData(this.nowSelectSubprojectID)) {
                    alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                    return;
                }
                let selectData = this.getSelectDatas();
                if (validateData(selectData.machineCheckTaskIDS)) {
                    this.downloadLogData.postTaskIDS = [].concat(JSON.parse(JSON.stringify(selectData.postMachineCheckTaskIDS)));
                    this.downloadLogData.taskIDS = selectData.machineCheckTaskIDS;
                    this.dialogDownloadLogVisible = true;
                    this.downloadLoading = false;
                } else {
                    alertInfo(this, "warning", "请选择要下载log的任务");
                }
            },
            getSelectDatas: function () {
                let machineCheckTaskIDS = "";
                let postMachineCheckTaskIDS = [];
                for (var val of this.multipleMachineTaskSelection) {
                    for (var item of val) {
                        postMachineCheckTaskIDS.push({
                            mqc_task_id: parseInt(item.machine_check_task_id)
                        });
                        if (machineCheckTaskIDS) {
                            machineCheckTaskIDS = machineCheckTaskIDS + "," + item.machine_check_task_id;
                        } else {
                            machineCheckTaskIDS = item.machine_check_task_id;
                        }
                    }
                }
                this.selectNumber = postMachineCheckTaskIDS.length;
                this.selectAllFlag = this.selectNumber == this.totalNumber;
                return {
                    machineCheckTaskIDS: machineCheckTaskIDS,
                    postMachineCheckTaskIDS: postMachineCheckTaskIDS
                };
            },
            submitSkipMachineCheckForm: function () {
                this.$refs["skipMachineCheckData"].validate(valid => {
                    if (valid) {
                        var postSkipMachineCheckData = {
                            user_id: sessionStorage.userid,
                            machine_qc_task_list: this.skipMachineCheckData.postMachineCheckTaskIDS
                        };
                        this.$http.post("/api/jump_machine_qc_segment", postSkipMachineCheckData).then(
                            response => {
                                response = response.body;
                                var data = response.data;
                                if (data.errno === 0) {
                                    alertInfo(this, "success", "成功跳过机检任务", () => {
                                        this.dialogSkipMachineCheckVisible = false;
                                        this.onSearch();
                                    });
                                } else {
                                    alertInfo(this, "error", "跳过机检任务失败，" + data.msg);
                                }
                            });
                    }
                });
            },
            submitDownloadLogForm: function () {
                this.$refs["downloadLogData"].validate(valid => {
                    if (valid) {
                        this.downloadLoading = true;
                        var postDownloadLogData = {
                            user_id: sessionStorage.userid,
                            sub_project_id: this.nowSelectSubprojectID,
                            process_segment: this.nowSelectSection,
                            format: this.downloadLogData.fileFormat,
                            type: this.downloadLogData.fileType,
                            mqc_task_list: this.downloadLogData.postTaskIDS
                        };
                        this.$http.post("/api/generate_log_download_url", postDownloadLogData).then(
                            response => {
                                response = response.body;
                                var data = response.data;
                                this.downloadLoading = false;
                                if (data.errno === 0) {
                                    alertInfo(
                                        this,
                                        "success",
                                        "log下载成功，<a class='a-download' href=" + data.data.log_download_url + ">点击保存</a>",
                                        () => {
                                            this.dialogDownloadLogVisible = false;
                                        }
                                    );
                                } else {
                                    alertInfo(this, "error", "log下载失败，" + data.msg);
                                }
                            });
                    }
                });
            },
            sortTable: function (val) {
                if (val.order === "descending") {
                    this.search.sort_field_name = val.prop + " desc";
                } else if (val.order === "ascending") {
                    this.search.sort_field_name = val.prop + " asc";
                } else {
                    this.search.sort_field_name = "machine_check_task_id desc";
                }
                this.onSearch();
            },
            pageSizeChange: function (val) {
                this.multipleMachineTaskSelection = [];
                this.filter.perPage = val;
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
                if (this.allTableData.length > 0) {
                    this.machinemachineQualityCheckTasksTable = this.allTableData[val - 1];
                    return;
                }
                this.searchMachineQualityCheckTasks({
                    loading: true
                });
            },
            SelectionChange: function (val) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.filter.currentPage - 1) {
                        this.multipleMachineTaskSelection[this.filter.currentPage - 1] = val;
                    } else {
                        if (typeof this.multipleMachineTaskSelection[i] == "undefined") {
                            this.multipleMachineTaskSelection[i] = [];
                        }
                    }
                }
                this.getSelectDatas();
            },
            SelectProjects: function (data) {
                this.search.selectProjectID = data.project_id;
                this.search.selectSubprojectID = data.sub_project_id;
                 // gu：当所属项目为主项目或全部时，项目状态为进行中；当为子项目时项目状态为全部
                if(validateData(this.search.selectSubprojectID)){
                    this.search.project_status = "0";
                    parentSonPassVal(this.forArrSelectDiv, "项目状态", "0", "son_parent"); // 复位项目状态筛选框
                } else {
                    this.search.project_status = "3";
                    parentSonPassVal(this.forArrSelectDiv, "项目状态", "3", "son_parent"); // 复位项目状态筛选框
                }
                if (data.init) {
                    this.searchMachineQualityCheckTasks();
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

    .machineQualityCheckList {
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
        }

        .selectSectionDiv {
            margin: 0 0 15px 10px;
            width: $width;
            text-align: left;
        }

        .selectDiv {
            float: left;
            margin: 0 20px 15px 10px;
        }

        .align-right {
            text-align: right;
            min-width: 60px;
            display: inline-block;
            margin-left: 20px;
        }

        .cascader-select-style {
            width: 300px;
        }

        .input-style {
            display: inline-block;
            margin-right: 82px;
            width: 400px;
        }

        .input-style-1 {
            display: inline-block;
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
                .titlespan {
                    float: left;
                    font-size: 20px;
                    font-weight: bold;
                    margin: 13px 0 0 0;
                }
            }

            // span {
            //     float: left;
            //     font-size: 20px;
            //     text-align: left;
            //     line-height: 40px;
            //     font-weight: bold;
            //     margin: 5px 10px 5px 10px;
            // }

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
