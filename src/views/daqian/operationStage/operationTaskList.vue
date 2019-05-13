<template>
    <div class="operationTaskList">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv" @change="selectSectionChange">
                        <!--<span class="align-right">环节：</span>
                        <el-select size="medium" v-model="search.selectSection" placeholder="全部">
                            <el-option value="30" label="基础要素作业"></el-option>
                            <el-option value="32" label="基础要素接边"></el-option>
                            <el-option value="34" label="高阶要素作业"></el-option>
                            <el-option value="36" label="高阶要素接边"></el-option>
                            <el-option value="38" label="城市接边"></el-option>
                        </el-select>-->
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium">
                            <!-- <el-radio-button label="3000">生产准入</el-radio-button> -->
                            <el-radio-button label="30">基础要素作业</el-radio-button>
                            <el-radio-button label="32">基础要素接边</el-radio-button>
                            <el-radio-button label="34">高阶要素作业</el-radio-button>
                            <el-radio-button label="36">高阶要素接边</el-radio-button>
                            <el-radio-button label="38">回库接边</el-radio-button>
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
                        <span class="align-right">作业类型：</span>
                        <el-select size="medium" v-model="search.selectTaskType" clearable placeholder="全部">
                            <el-option value="1" label="原始作业"></el-option>
                            <el-option value="2" label="一检返工作业"></el-option>
                            <el-option value="3" label="一检返修作业"></el-option>
                            <el-option value="32" label="二检返工作业"></el-option>
                            <el-option value="33" label="二检返修作业"></el-option>
                        </el-select>
                    </div>
                    <!--v_s: 添加项目状态筛选框 -->
                    <select-check @changeEvents="changeEvent" :forArrSelectDiv="forArrSelectDiv">
                    </select-check>
                    <div class="selectDiv">
                        <span class="align-right">作业状态：</span>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                            <el-option value="1" label="未分配作业员"></el-option>
                            <el-option value="2" label="未开始作业"></el-option>
                            <el-option value="3" label="作业中"></el-option>
                            <el-option value="4" label="完成作业"></el-option>
                            <el-option value="5" label="暂停作业"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">任务包编号：</span>
                        <el-popover placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus"
                            width="400" :content="search.origintaskID">
                            <el-input class="input-style-1" size="medium" slot="reference" v-model="search.origintaskID"
                                placeholder="搜索任务包编号" clearable :change="formatTaskPackageIDSearchInput()">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus"
                            width="400" :content="search.tileID">
                            <el-input class="input-style-1" size="medium" slot="reference" v-model="search.tileID"
                                :change="formattaskIDSearchInput()" clearable placeholder="可搜索多个网格编号">
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
        </div>
        <!-- 筛选区 end-->
        <!-- 作业任务列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">作业任务列表</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">个作业任务</span> -->
                <form action="/api/query_op_task_info" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='project_id' v-model="search.selectProjectID">
                    <input type="hidden" name='sub_project_id' v-model="search.selectSubprojectID">
                    <input type="hidden" name='operation_segment' v-model="search.selectSection">
                    <input type="hidden" name='status' v-model="search.selectState">
                    <input type="hidden" name='task_type' v-model="search.selectTaskType">
                    <input type="hidden" name='project_status' v-model="search.project_status">
                    <input type="hidden" name='orign_operation_task_id' v-model="search.origintaskID">
                    <input type="hidden" name='tile_id_list' v-model="search.tileID">
                    <input type="hidden" name='query_or_export_data' value='6'>
                    <input type="hidden" name='path_name' value='作业任务列表'>
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[0]" v-model="search.selectAllowInPassResult[0]">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[1]" v-model="search.selectAllowInPassResult[1]">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[2]" v-model="search.selectAllowInPassResult[2]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[0]" v-model="search.selectAllowInFailResult[0]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[1]" v-model="search.selectAllowInFailResult[1]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[2]" v-model="search.selectAllowInFailResult[2]">
                    <el-button class="left-button" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
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
                    ref="operatetaskTables" border style="width: 100%" @select="operationTaskSelectionChange"
                    @select-all="operationTaskSelectionChange" @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="operation_task_id" show-overflow-tooltip label="作业任务编号" sortable="custom"
                        width="130"></el-table-column>
                    <el-table-column fixed prop="orign_operation_task_id" show-overflow-tooltip label="所属任务包编号" width="120"></el-table-column>
                    <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="所属子项目" width="120"></el-table-column>
                    <el-table-column prop="show_operation_segment" show-overflow-tooltip label="环节" width="105"></el-table-column>
                    <el-table-column prop="show_task_type" label="作业类型" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_status" label="作业状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_operator" show-overflow-tooltip label="作业员" width="105"></el-table-column>
                    <el-table-column prop="data_number" label="作业数据量(km)" show-overflow-tooltip width="130"></el-table-column>
                    <el-table-column prop="tile_number" label="网格数量" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_tile_list" label="任务网格" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="operation_sequence" label="作业次数" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="assign_task_time" label="分配任务时间" show-overflow-tooltip sortable="custom"
                        width="160"></el-table-column>
                    <el-table-column prop="start_time" label="开始作业时间" show-overflow-tooltip sortable="custom" width="160"></el-table-column>
                    <el-table-column prop="end_time" label="完成作业时间" show-overflow-tooltip sortable="custom" width="160"></el-table-column>
                    <el-table-column prop="commit_task_time" label="提交任务时间" show-overflow-tooltip sortable="custom"
                        width="160"></el-table-column>
                    <el-table-column prop="total_jb_mark_number" label="总接边mark数" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="current_jb_mark_number" label="已完成接边mark数" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="connect_border_sequence" label="接边次数" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column prop="machine_check_task_id" show-overflow-tooltip label="关联机检任务编号" width="135"
                        v-if="search.selectSection != '30'"></el-table-column>
                    <el-table-column prop="quality_check_task_id" label="关联质检任务编号" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="show_qc_operator" label="质检员" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_history_max_qc_round" label="历史最大质检轮数" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="data_trunk_name" label="数据分支名称" show-overflow-tooltip width="130"></el-table-column>
                    <el-table-column prop="log_data_version" label="质检log版本" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="diff_log_data_version" label="差分log版本" show-overflow-tooltip width="135"></el-table-column>
                    <!--<el-table-column prop="user_id" label="分配任务人员" width="150"></el-table-column>  -->
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
        <!--    作业任务列表 end-->
        <!-- Log批量下载 begin-->
        <el-dialog title="log批量下载" :visible.sync="dialogDownloadLogVisible" :close-on-click-modal="false">
            <el-form ref="downloadLogData" :model="downloadLogData" label-width="120px" class="demo-dynamic" v-loading="downloadLoading" element-loading-text="拼命下载中">
                <el-form-item label="作业任务列表" required prop="taskIDS" :rules="[{ required: true, message: '请选择要下载log的作业任务', trigger: 'blur'},{ required: true, message: '请选择要下载准入log的作业任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要下载log的作业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="downloadLogData.taskIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{downloadLogData.postTaskIDS.length}}</b>条记录（去重后）,选择任务的log将合并为一个文件下载</p>
                <el-form-item label="文件类型" required style="margin-bottom: 10px">
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="downloadLogData.fileType" label="qc">质检log</el-radio>
                        <el-radio v-model="downloadLogData.fileType" label="diff">差分log</el-radio>
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
                    <el-button @click="dialogDownloadLogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- Log批量下载 end-->
    </div>
</template>

<script>
    import {
        trim,
        validateData,
        alertInfo,
        inputCheck,
        showDataSet,
        resize,
        parentSonPassVal, // v_s: 这个方法是遍历data数据的方法
        reQpassVal //v_s: 循环数组给请求赋值
    } from '@/utils/daqian_tools'
    import selectProject from '@/components/daqian_selectProject.vue'
    import selectCheck from "@/components/daqian_selectCheck.vue" // v_s: 引入自定义组件-项目状态
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
                }],
                formHeight: this.global.formHeight,
                collapseFlag: false,
                search: {
                    userId: sessionStorage.userid,
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    selectSection: "30",
                    selectState: "",
                    selectAllowInPassResult: [],
                    selectAllowInFailResult: [],
                    origintaskID: "",
                    tileID: "",
                    selectTaskType: "",
                    sort_field_name: "operation_task_id desc",
                    project_status: ""
                },
                searchDatas: {},
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                operatetaskTable: [],
                multipleOperationTaskSelection: [],
                workerOptions: [],
                nowSelectSubprojectID: 0,
                nowSelectSection: '30',
                downloadLoading: false,
                downloadLogData: {
                    taskIDS: "",
                    postTaskIDS: [],
                    fileFormat: 'csv',
                    fileType: 'qc'
                },
                dialogDownloadLogVisible: false,
                ChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                accessDisabled: false,
                loading: true,
                emptyText: "查询中",
                selectAllFlag: false,
                selectNumber: 0,
                allTableData: []
            };
        },
        updated() {
            if (this.$refs.operatetaskTables) {
                this.$refs.operatetaskTables.clearSelection();
            }
            var tmpSelectData = this.multipleOperationTaskSelection[this.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let i in this.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.tableData[i])) {
                            this.$refs.operatetaskTables.toggleRowSelection(this.tableData[i]);
                        }
                    }
                }
                this.multipleOperationTaskSelection[this.filter.currentPage - 1] = arr;
            }
        },
        computed: {
            tableData: function () {
                if (this.operatetaskTable) {
                    for (var val of this.operatetaskTable) {
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_operator = showDataSet(val.operator_id, val.operator_name);
                        val.show_qc_operator = showDataSet(val.qc_operator_id, val.qc_operator_name);
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
                        if (val.operation_segment === "30") {
                            val.show_operation_segment = "基础要素作业";
                        } else if (val.operation_segment === "32") {
                            val.show_operation_segment = "基础要素接边";
                        } else if (val.operation_segment === "34") {
                            val.show_operation_segment = "高阶要素作业";
                        } else if (val.operation_segment === "36") {
                            val.show_operation_segment = "高阶要素接边";
                        } else if (val.operation_segment === "38") {
                            val.show_operation_segment = "回库接边";
                        }
                        if (val.status === "1") {
                            val.show_status = "未分配作业员";
                        } else if (val.status === "2") {
                            val.show_status = "未开始作业";
                        } else if (val.status === "3") {
                            val.show_status = "作业中";
                        } else if (val.status === "4") {
                            val.show_status = "完成作业";
                        } else if (val.status === "5") {
                            val.show_status = "暂停作业";
                        } else if (val.status === "3001") {
                            val.show_status = "准入未开始";
                        } else if (val.status === "3002") {
                            val.show_status = "准入中";
                        } else if (val.status === "3003") {
                            val.show_status = "准入暂停";
                        } else if (val.status === "3004") {
                            val.show_status = "准入通过";
                        } else if (val.status === "3005") {
                            val.show_status = "准入不通过";
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

                        if (val.tile_list.length) {
                            var taskIDS = "";
                            var logVersion = "";
                            for (var tile of val.tile_list) {
                                if (taskIDS) {
                                    taskIDS = taskIDS + "," + tile.tile_id;
                                } else {
                                    taskIDS = tile.tile_id;
                                }
                                if (logVersion) {
                                    logVersion = logVersion + "," + tile.log_data_version;
                                } else {
                                    logVersion = tile.log_data_version;
                                }
                            }
                            val.show_tile_list = taskIDS;
                            val.show_log_data_version = logVersion;
                        }
                        if (val.history_max_qc_round === "1") {
                            val.show_history_max_qc_round = "一检";
                        } else if (val.history_max_qc_round === "2") {
                            val.show_history_max_qc_round = "二检";
                        }
                        if (val.admittance_level == "1") {
                            val.show_admittance_level = "A类，无融合问题，预处理效果较好";
                        } else if (val.admittance_level == "2") {
                            val.show_admittance_level = "B类，较少融合问题，预处理效果一般";
                        } else if (val.admittance_level == "3") {
                            val.show_admittance_level = "C类，较多融合问题，预处理效果差";
                        }
                        if (val.admittance_reason.length) {
                            val.show_admittance_reason = "";
                            for (var reasonVal of val.admittance_reason) {
                                if (reasonVal == "1") {
                                    val.show_admittance_reason += "点云分层错位;";
                                } else if (reasonVal == "2") {
                                    val.show_admittance_reason += "预处理效果差;";
                                } else if (reasonVal == "3") {
                                    val.show_admittance_reason += "点云图片不清晰;";
                                }
                            }
                        }
                        if (val.status === "3004") {
                            val.show_result = val.show_admittance_level;
                        } else if (val.status === "3005") {
                            val.show_result = val.show_admittance_reason;
                        }
                    }
                    // return this.operatetaskTable.slice((this.filter.currentPage-1)*this.filter.perPage,this.filter.currentPage*this.filter.perPage);
                    return this.operatetaskTable;
                }
            }
        },
        created() {
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
            if (sessionStorage.selectSectionWork) {
                if (sessionStorage.selectSectionWork !== "3000") {
                    this.search.selectSection = sessionStorage.selectSectionWork;
                } else {
                    this.search.selectSection = "30";
                }
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
            //读取选中网格数据，设置分配任务所需数据
            assignDataSet: function () {
                var tileIDS = '';
                this.assignData.postTileS = [];
                this.assignData.dataNumber = 1;
                if (this.multipleTileSelection) {
                    for (var val of this.multipleTileSelection) {
                        if (val) {
                            for (var item of val) {
                                this.assignData.subProjectID = item.sub_project_id;
                                //this.assignData.dataNumber += item.data_number;
                                this.assignData.tileLevel = item.tile_level;
                                this.assignData.selectTaskType = item.operation_segment;
                                var tmpTile = {};
                                tmpTile.tile_id = item.tile_id;
                                tmpTile.tile_level = item.tile_level;
                                //tmpTile.data_number = item.data_number;
                                this.assignData.postTileS.push(tmpTile);
                                if (tileIDS) {
                                    tileIDS = tileIDS + ';' + item.tile_id;
                                } else {
                                    tileIDS = item.tile_id;
                                }
                            }
                        }
                    }
                    this.assignData.tileIDS = tileIDS;
                }
            },
            //查询输入框格式校验
            formattaskIDSearchInput: function () {
                this.search.tileID = inputCheck(this, this.search.tileID, 1);
                sessionStorage.tileID = this.search.tileID;
            },
            formatTaskPackageIDSearchInput: function () {
                this.search.origintaskID = inputCheck(this, this.search.origintaskID, 1);
            },
            searchOperation: function (arg) {
                this.multipleOperationTaskSelection = [];
                this.emptyText = "查询中";
                this.nowSelectSubprojectID = this.search.selectSubprojectID;
                this.nowSelectSection = this.search.selectSection;
                var query_operationTaskList = {
                    project_status: reQpassVal(this.forArrSelectDiv, '项目状态'), // v_s: 项目状态
                    user_id: sessionStorage.userid,
                    operation_segment: this.search.selectSection,
                    operation_sequence: 0,
                    status: this.search.selectState,
                    task_type: this.search.selectTaskType,
                    query_start_time: "",
                    query_end_time: "",
                    project_id: this.search.selectProjectID,
                    sub_project_id: this.search.selectSubprojectID,
                    city_name: "",
                    orign_operation_task_id: trim(this.search.origintaskID),
                    operation_task_id: 0,
                    tile_id_list: this.search.tileID,
                    sort_field_name: this.search.sort_field_name,
                    query_or_export_data: 0,
                    admittance_level: this.search.selectAllowInPassResult,
                    admittance_reason: this.search.selectAllowInFailResult,
                    page_index: this.filter.currentPage,
                    page_size: this.filter.perPage,
                    return_all: arg && arg.return_all ? arg.return_all : 2
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.operatetaskTable = [];
                        this.searchDatas = query_operationTaskList;
                    }
                    this.totalNumber = 0;
                    this.filter.currentPage = 1;
                    this.multipleOperationTaskSelection = [];
                    this.loading = true;
                }
                this.search.project_status = this.forArrSelectDiv[0].objectType; // v_s:给导出按钮执行赋值状态数据
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_index = this.filter.currentPage;
                this.searchDatas.page_size = this.filter.perPage;
                this.$http.post("/api/query_op_task_info", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.operatetaskTable = [];
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.totalNumber = data.data.total_number;
                                if (arg && arg.return_all) {
                                    var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                    for (var i = 0; i < pagesNumber; i++) {
                                        this.multipleOperationTaskSelection[i] = data.data.operation_task_status_info.slice(
                                            i * this.filter.perPage,
                                            (i + 1) * this.filter.perPage
                                        );
                                    }
                                    this.allTableData = Object.assign(
                                        [],
                                        this.allTableData,
                                        this.multipleOperationTaskSelection
                                    );
                                    if (this.allTableData.length > 0) {
                                        this.operatetaskTable = this.allTableData[0];
                                    }
                                    this.$refs.operatetaskTables.clearSelection();
                                    this.tableData.forEach(row => {
                                        this.$refs.operatetaskTables.toggleRowSelection(row);
                                    });
                                    this.getSelectDatas();
                                } else {
                                    this.operatetaskTable = data.data.operation_task_status_info;
                                }
                                if (this.totalNumber == 0) {
                                    this.operatetaskTable = [];
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.emptyText = "加载中";
                                }
                            }
                        } else {
                            this.operatetaskTable = [];
                            this.emptyText = "查询失败";
                        }
                    },
                    response => {
                        // 响应错误回调
                        this.operatetaskTable = [];
                        this.loading = false;
                        this.emptyText = "查询失败";
                    }
                );
            },
            onSearch: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.searchOperation(event);
            },
            onRefresh: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.search.selectState = '';
                this.search.origintaskID = '';
                this.search.selectTaskType = '';
                this.$refs.operatetaskTables.clearSort();
                this.search.sort_field_name = "operation_task_id desc";
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
                    this.searchOperation();
                }
            },
            selectSectionChange: function () {
                sessionStorage.selectSectionWork = this.search.selectSection;
                this.onRefresh("sectionChange");
            },
            downloadLogs: function () {
                if (!validateData(this.nowSelectSubprojectID)) {
                    alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                    return;
                }
                let selectData = this.getSelectDatas();
                if (validateData(selectData.taskIDS)) {
                    this.downloadLogData.postTaskIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTaskIDS)));
                    this.downloadLogData.taskIDS = selectData.taskIDS;
                    this.dialogDownloadLogVisible = true;
                    this.downloadLoading = false;
                } else {
                    alertInfo(this, "warning", "请选择要下载log的任务");
                }
            },
            getSelectDatas: function () {
                let taskIDS = "";
                let postTaskIDS = [];
                for (var val of this.multipleOperationTaskSelection) {
                    if (val) {
                        for (var item of val) {
                            postTaskIDS.push({
                                operation_task_id: item.operation_task_id
                            });
                            if (taskIDS) {
                                taskIDS = taskIDS + "," + item.operation_task_id;
                            } else {
                                taskIDS = item.operation_task_id;
                            }
                        }
                    }
                }
                this.selectNumber = postTaskIDS.length;
                this.selectAllFlag = this.selectNumber == this.totalNumber;
                return {
                    taskIDS: taskIDS,
                    postTaskIDS: postTaskIDS
                };
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
                            operation_task_list: this.downloadLogData.postTaskIDS
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
                    this.search.sort_field_name = "operation_task_id desc";
                }
                this.onSearch();
            },
            pageSizeChange: function (val) {
                this.multipleOperationTaskSelection = [];
                this.filter.perPage = val;
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
                if (this.allTableData.length > 0) {
                    this.operatetaskTable = this.allTableData[val - 1];
                    return;
                }
                this.searchOperation({
                    loading: true
                });
            },
            operationTaskSelectionChange: function (val) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.filter.currentPage - 1) {
                        this.multipleOperationTaskSelection[this.filter.currentPage - 1] = val;
                    } else {
                        if (typeof this.multipleOperationTaskSelection[i] == "undefined") {
                            this.multipleOperationTaskSelection[i] = [];
                        }
                    }
                }
                this.getSelectDatas();
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchOperation({
                        return_all: 1
                    });
                } else {
                    this.multipleOperationTaskSelection = [];
                    this.$refs.operatetaskTables.clearSelection();
                    this.getSelectDatas();
                }
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
                    this.searchOperation();
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

    .operationTaskList {
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
