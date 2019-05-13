<template>
    <div class="autoDiscrimination">
        <!-- 筛选区 begin -->
        <el-row class="searchBox">
            <!-- 筛选框 begin -->
            <select-check :forArrSelectDiv="reset.checkData"></select-check>
            <div class="selectDiv">
                <span class="align-right">网格编号：</span>
                <el-popover class="input-style" placement="bottom-start" title="仅可输入数字、分号，分号分隔多个查询条件" trigger="focus" :content="reset.tileID">
                    <el-input slot="reference" class="input-padding" size="medium" v-model="reset.tileID" :change="formatSearchInput()" clearable placeholder="可搜索多个网格编号"></el-input>
                </el-popover>
                <el-checkbox class="inputBox" v-model="reset.isAccurate">精确</el-checkbox>
            </div>
            <ordinary-input :rendDatas="reset.inputData"></ordinary-input>
            <div class="selectDiv">
                <span class="align-right">创建时间：</span>
                <el-date-picker size="medium" style="width:300px;" v-model="reset.tiemArr" @change="selectDateChange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </div>
            <!-- 筛选框 end -->
            <el-col :span="3" class="marginBottom">
                <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
            </el-col>
        </el-row>
        <!-- 筛选区 end -->
        <!-- 列表展示 begin -->
        <el-row class="table-area">
            <!-- 表头内容 begin -->
            <el-row class="bottomBox" type="flex" justify="space-between">
                <el-col>
                    <div>
                        <span class="titleBox">自定义差分</span>
                        <el-col :span="2">
                            <el-button class="left-button" size="medium" type="primary" @click="exporty" plain native-type="submit">导出</el-button>
                        </el-col>
                    </div>
                </el-col>
                <el-col>
                    <el-row type="flex" justify="end">
                        <el-button type="primary" :disabled="accessDisabled" size="medium" @click="openObject">新建任务</el-button>
                        <!-- <el-button type="primary" size="medium">暂停</el-button>   -->
                        <el-button type="primary" :disabled="accessDisabled" @click="repeatStart" size="medium">重启</el-button>
                    </el-row>
                </el-col>
            </el-row>
            <div class="segmenting-line"></div>
            <el-row class="bottomBox">
                <el-col>
                    <el-row type="flex" justify="start">
                        <div class="select-area-1">
                            <el-checkbox v-model="reset.selectAllFlag" @change="selectAll()">
                                <span class="select-number">全选</span>
                            </el-checkbox>
                            <span class="select-number">
                                共
                                <b>{{reset.totalNumber}}</b> 条
                            </span>
                            <span class="select-number">
                                已选
                                <b>{{reset.selectNumber}}</b>条记录
                            </span>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
            <!-- 表头内容 end -->
            <!-- 表格组件 begin -->
            <div class="table-div">
                <el-table :data="reset.tableData" :empty-text="emptyText" @select="tileSelectionChange" @select-all="tileSelectionChange" v-loading="loading" element-loading-text="拼命查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" ref="multipleTable" border style="width: 100%" @sort-change="sortTable">
                    <el-table-column fixed type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="diff_branch_task_id" label="编号" sortable="custom" show-overflow-tooltip min-width="90"></el-table-column>
                    <el-table-column fixed prop="diff_branch_job_id" label="任务编号" sortable="custom" show-overflow-tooltip min-width="102"></el-table-column>
                    <el-table-column prop="diff_branch_task_status" label="状态" show-overflow-tooltip min-width="80">
                    </el-table-column>
                    <el-table-column prop="tile_num" label="网格数量" show-overflow-tooltip min-width="80">
                    </el-table-column>
                    <el-table-column prop="target_data" label="目标数据" show-overflow-tooltip min-width="200">
                    </el-table-column>
                    <el-table-column prop="target_version" label="目标时间版本" show-overflow-tooltip min-width="260">
                    </el-table-column>
                    <el-table-column prop="refer_data" label="参考数据" show-overflow-tooltip min-width="200">
                    </el-table-column>
                    <el-table-column prop="refer_version" label="参考时间版本" show-overflow-tooltip min-width="280">
                    </el-table-column>
                    <el-table-column prop="created_by" label="创建用户" show-overflow-tooltip min-width="150">
                    </el-table-column>
                    <el-table-column prop="task_created_at" label="创建时间" show-overflow-tooltip min-width="180">
                    </el-table-column>
                    <el-table-column prop="task_start_at" label="开始时间" show-overflow-tooltip min-width="180">
                    </el-table-column>
                    <el-table-column prop="task_end_at" label="结束时间" show-overflow-tooltip min-width="180">
                    </el-table-column>
                    <el-table-column prop="diff_amount" label="差异量" show-overflow-tooltip min-width="80">
                    </el-table-column>
                    <el-table-column prop="note" label="备注" show-overflow-tooltip min-width="140"></el-table-column>
                    <el-table-column fixed="right" label="下载" show-overflow-tooltip width="140">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="exportd({user_id:userId,diff_branch_task_id:scope.row.diff_branch_task_id,query_or_export_data:1},'query_custom_diff_branch_task_detail_info')">
                                详情</el-button>
                            <a :href="scope.row.download_result_url" class="inline">
                                <el-button type="text" size="small">差分结果</el-button>
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 表格组件 end -->
            <!-- 分页box begin -->
            <el-pagination class="pagination-area" @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="reset.filter.currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="reset.filter.perPage" layout="total, sizes, prev, pager, next, jumper" :total="reset.totalNumber"></el-pagination>
            <!-- 分页box end -->
        </el-row>
        <!-- 列表展示 end -->
        <!-- 弹框 begin -->
        <el-dialog title="新建差分任务" class="el-dialogBox" :visible.sync="centerDialogVisible" v-loading="createLoading" :close-on-click-modal="false" width="900px" center>
            <el-form :rules="frameData.rules" :model="frameData" ref="formName">
                <el-row type="flex" justify="center">
                    <el-col :span="10" class="left-input">
                        <el-row>
                            <el-row type="flex" justify="space-around">
                                <div class="title-box">
                                    <b>目标数据</b>
                                </div>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-form-item label="数据分支" class="el-formwidth" required prop="dataBranchTarget">
                                    <el-cascader style="float:left;width:198px" @change="selectChange" :options="frameData.optionsWithDisabled" filterable size="medium" placeholder="请输入" :clearable="true" :show-all-levels="false" v-model="frameData.dataBranchTarget"></el-cascader>
                                </el-form-item>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :span="10">
                                    <div class="el-version">
                                        <el-form-item label="数据版本" required>
                                            <el-cascader @change="updatasStart" style="float:left;width:100px;margin-bottom:10px;" :options="frameData.prooducLink" filterable size="medium" placeholder="请输入" :clearable="true" :show-all-levels="false" v-model="frameData.targetProoducLinkVal"></el-cascader>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :push="1" :span="6">
                                    <el-form-item v-if="frameData.targetProoducLinkVal[0]=='2'" required>
                                        <el-date-picker class="tiemline" style="float:left;width:192px" value-format="yyyy-MM-dd HH:mm:ss" v-model="frameData.linkTimeVersion" :picker-options="startEndDateOpt" type="datetime" size="medium" placeholder="请选择"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-col>
                    <el-col :span="2" class="center-input">
                        <el-row type="flex" justify="center">
                            <i class="el-icon-daqian-duibi" style="margin:65px 0;font-size:30px;"></i>
                        </el-row>
                    </el-col>
                    <el-col :span="10" class="right-input">
                        <el-row type="flex" justify="space-around">
                            <div class="title-box">
                                <b>参考数据</b>
                            </div>
                        </el-row>
                        <el-row type="flex" justify="start">
                            <el-form-item style="margin-left:24px;" label="数据分支" class="el-formwidth" required prop="dataBranchContrast">
                                <el-cascader @change="selectchangeEd" style="float:left;width:198px" :options="frameData.optionsWithDisabled" filterable size="medium" placeholder="请输入" :clearable="true" :show-all-levels="false" v-model="frameData.dataBranchContrast">
                                </el-cascader>
                            </el-form-item>
                        </el-row>
                        <el-row type="flex" justify="start">
                            <el-col :span="10">
                                <div class="el-version" style="margin-left:24px;">
                                    <el-form-item label="数据版本" required>
                                        <el-cascader @change="updatasEd" style="float:left;width:100px;margin-bottom:10px;" :options="frameData.edProoducLink" filterable size="medium" placeholder="请输入" :clearable="true" :show-all-levels="false" v-model="frameData.edProoducLinkVal"></el-cascader>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :push="1" :span="6" style="margin-left:24px;">
                                <el-form-item v-if="frameData.edProoducLinkVal[0]=='2'" required>
                                    <el-date-picker class="tiemline" style="float:left;width:192px" value-format="yyyy-MM-dd HH:mm:ss" v-model="frameData.edTimeVersion" :picker-options="startEndDateOpt" type="datetime" size="medium" placeholder="请选择"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row class="dataListBox">
                    <div class="frameBox">
                        <el-col :span="4" class="listBox">网格列表</el-col>
                        <el-col :span="20">
                            <el-row class="frameBox">
                                <el-radio-group v-model="frameData.gridList" @change="isDefinitiontable" size="small">
                                    <el-radio-button label="自定义"></el-radio-button>
                                    <el-radio-button label="自动推荐"></el-radio-button>
                                </el-radio-group>
                            </el-row>
                            <p v-show="frameData.isShowTable">共{{frameData.titleNum}}个网格</p>
                            <el-form-item>
                                <el-input v-show="frameData.isShowTable" type="textarea" @blur="gridNum" :rows="2" placeholder="请输入，网格与网格间用分号（；）分隔！" v-model="frameData.tile_id_list" :change="formatTileIDInput(frameData.tile_id_list)" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                    <div class="frameBox paddingBox">
                        <el-col :span="4" class="listBox">备注</el-col>
                        <el-col :span="20">
                            <el-input type="textarea" :rows="2" placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="frameData.memo"></el-input>
                        </el-col>
                    </div>
                </el-row>
                <el-form-item>
                    <el-button size="medium" type="primary" @click="closeframe('create_custom_diff_branch_task')">确 定
                    </el-button>
                    <el-button size="medium" @click="centerDialogVisible = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 弹框 end -->
    </div>
</template>

<script>
import selectCheck from "@/components/daqian_selectCheck.vue";
import ordinaryInput from "@/components/daqian_elementInput.vue";
import { alertInfo, inputCheck, transformstartDate, transformEndDate, downloadFile } from "@/utils/daqian_tools";
export default {
    components: {
        selectCheck,
        ordinaryInput
    },
    data() {
        return {
            accessDisabled: false,
            startEndDateOpt: {
                // 时间版本数据 限制选择的起始时间和选择的结束时间
                disabledDate(time) {
                    return time.getTime() < new Date(2016, 11, 32) || time.getTime() > Date.now();
                }
            },
            startDateOpt: {
                // 时间版本数据 限制选择的起始时间和选择的结束时间
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            userId: sessionStorage.userid,
            loading: false,
            emptyText: "查询中",
            centerDialogVisible: false, // 弹框显示数据
            createLoading: false, //差分任务新建操作响应等待提示
            reset: {
                // 刷新时要重置的所有数据
                levelObj: {}, // 在筛选后保存请求体
                tableOrderNum: "diff_branch_task_id desc", // 表格数据排序
                ObtainTrue: [], // 保存已选中的行
                pagingData: [], // 前端总数据分页
                everypages: [], // 前端分页每页数据
                checkData: [
                    // 状态数据
                    {
                        name: "状态",
                        objectType: "0",
                        AllTypesSelect: {
                            "0": "全部",
                            "2": "排队中",
                            "3": "处理中",
                            "4": "完成",
                            "5": "失败",
                            "6": "暂停"
                        }
                    }
                ],
                inputData: [
                    // 触发用户数据
                    {
                        name: "触发用户",
                        value: sessionStorage.username,
                        disabled: false 
                    }
                ],
                tiemArr: [],
                endTime: "",
                startTime: "",
                tileID: "", // 要查询的网格编号
                isAccurate: false, // 是否精确查找
                tableData: [], // 表格展示数据数组
                filter: {
                    // 分页组件数据
                    perPage: 10, // 每页显示的条数
                    currentPage: 1 // 当前的页数
                },
                selectAllFlag: false, // 表格是否全选按钮
                totalNumber: 0, // 总共条数
                selectNumber: 0 // 已选择的条数
            },
            frameData: {
                // 新建差分任务弹窗数据
                rules: {
                    dataBranchTarget: [
                        {
                            required: true,
                            message: "请选择数据分支",
                            trigger: "change"
                        }
                    ],
                    dataBranchContrast: [
                        {
                            required: true,
                            message: "请选择数据分支",
                            trigger: "change"
                        }
                    ]
                },
                taskList: [], // 作业库
                marsterList: [], // 后端返回的母库数据
                dataBranchTarget: [], // 目标分支数据
                dataBranchContrast: [], // 参考分支数据
                resultsList: [], // 成果库数据
                targetProoducLinkVal: [], // 目标生产环节值
                edProoducLinkVal: [], // 参考生产环节值
                linkTimeVersion: "", // 目标时间版本数据
                edTimeVersion: "", // 参考时间版本数据
                optionsWithDisabled: [
                    // 新建任务数据
                    {
                        // 作业库
                        value: "1",
                        label: "作业库",
                        disabled: false, // 是否禁用
                        children: []
                    },
                    // {                     //母库
                    //     value: '2',
                    //     label: '母库',
                    //     disabled: true,     // 是否禁用
                    //     children: [{ value: '1', label: '项目库', children: [] },{ value: '2', label: '基础库', children: [] }]
                    // },
                    {
                        //成果库
                        value: "3",
                        label: "成果库",
                        disabled: false, // 是否禁用
                        children: []
                    }
                ],
                prooducDatas: [], // 生产环节数据公交车
                prooducLink: [
                    // 生产环节数据
                    {
                        value: "1",
                        label: "生产环节",
                        disabled: false
                    },
                    {
                        value: "2",
                        label: "时间版本"
                    }
                ],
                edProoducLink: [
                    // 生产环节数据
                    {
                        value: "1",
                        label: "生产环节",
                        disabled: false
                    },
                    {
                        value: "2",
                        label: "时间版本"
                    }
                ],
                isShowTable: true,
                gridList: "自定义",
                tile_id_list: "", // 网格列表数据
                titleNum: 0,
                tileType: 1,
                memo: "" // 备注
            }
        };
    },
    created() {
        this.onSearch(); // 调用初始化查询方法
        this.accessDisabled = eval(sessionStorage.roteAuthotity);
    },
    updated() {
        this.flagTrue(); // 调用全选方法
    },
    methods: {
        mypageings: function() {
            // 前端数据分页
            var pagesNumber = Math.ceil(this.reset.totalNumber / this.reset.filter.perPage);
            this.reset.everypages = [];
            for (let i = 0; i < pagesNumber; i++) {
                this.reset.everypages[i] = this.reset.pagingData.slice(
                    i * this.reset.filter.perPage,
                    (i + 1) * this.reset.filter.perPage
                );
            }
            this.reset.ObtainTrue = JSON.parse(JSON.stringify(this.reset.everypages));
            this.reset.tableData = this.reset.everypages[this.reset.filter.currentPage - 1];
        },
        pageCurrentChange: function(val) {
            // 切页
            this.reset.filter.currentPage = val;
            this.reset.levelObj["page_index"] = val; // 切页的请求体赋值
            if (this.reset.everypages.length) {
                this.reset.tableData = this.reset.everypages[this.reset.filter.currentPage - 1];
            } else {
                this.tableDataFun(this.reset.levelObj);
            }
        },
        pageSizeChange: function(val) {
            // 每页显示的条数
            this.reset.everypages = []; // 将保存全量数据的数组清空
            this.reset.ObtainTrue = []; // 要勾选的数据
            this.reset.filter.perPage = val;
            this.reset.levelObj["page_size"] = val; // 每页显示条数的请求体赋值
            this.reset.levelObj["page_index"] = 1; // 将切页赋值为1
            this.tableDataFun(this.reset.levelObj);
        },
        onSearch: function() {
            // 筛选方法
            this.loading = true;
            this.reset.selectAllFlag = false; // 是否要勾选
            this.reset.ObtainTrue = []; // 要勾选的数据
            this.reset.filter.currentPage = 1;
            let searchData = {
                // 全部的筛选框条件
                created_by: this.reset.inputData[0].value,
                tile_id_list: this.reset.tileID, // 要查询的网格编号
                tile_search_type: this.reset.isAccurate, // 精确查找true，模糊查找false
                create_diff_branch_task_start_time: this.reset.startTime, // 创建开始时间
                create_diff_branch_task_end_time: this.reset.endTime, // 创建结束时间
                task_status: this.reset.checkData[0].objectType, // 查询脚本状态
                page_index: 1 // 当前页数
            };
            this.reset.levelObj = searchData; // 将已发送的请求体进行保存
            this.tableDataFun(searchData);
        },
        onRefresh: function() {
            // 刷新方法
            this.loading = true;
            Object.assign(this.$data.reset, this.$options.data().reset); // 初始化data数据
            this.$refs.multipleTable.clearSort();
            this.onSearch();
        },
        isSelectAll: function() {
            // 是否要勾选全选按钮
            let num = [];
            for (let i in this.reset.ObtainTrue) {
                // 数组拍平
                num.push(...this.reset.ObtainTrue[i]);
            }
            this.reset.selectAllFlag = this.reset.totalNumber == num.length && this.reset.totalNumber != 0;
            this.reset.selectNumber = num.length;
        },
        selectAll: function() {
            // 全选方法
            this.reset.filter.currentPage = 1;
            if (this.reset.selectAllFlag) {
                this.loading = true;
                this.tableDataFun(this.reset.levelObj, true);
            } else {
                // 取消全选时清空数组
                this.reset.ObtainTrue = [];
                this.flagTrue();
            }
        },
        tileSelectionChange: function(val) {
            //勾选记录,单选或多选，按页存储
            //某行被点击后，将该页选中的信息存储到数组
            var pagesNumber = Math.ceil(this.reset.totalNumber / this.reset.filter.perPage);
            for (var i = 0; i < pagesNumber; i++) {
                if (i == this.reset.filter.currentPage - 1) {
                    this.reset.ObtainTrue[this.reset.filter.currentPage - 1] = val;
                } else {
                    if (typeof this.reset.ObtainTrue[i] == "undefined") {
                        this.reset.ObtainTrue[i] = [];
                    }
                }
            }
            this.isSelectAll();
        },
        flagTrue: function() {
            // 勾选的方法
            this.$refs.multipleTable.clearSelection();
            var tmpSelectData = this.reset.ObtainTrue[this.reset.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let i in this.reset.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.reset.tableData[i])) {
                            this.$refs.multipleTable.toggleRowSelection(this.reset.tableData[i]);
                        }
                    }
                }
                this.reset.ObtainTrue[this.reset.filter.currentPage - 1] = arr;
            }
            this.isSelectAll();
        },
        tableDataFun: function(reqDatas, isAll) {
            // 查询所有数据全选的请求体
            let req = {
                // val的值0查询
                created_by: this.reset.inputData[0].value,
                sort_field_name: this.reset.tableOrderNum, // 排序
                query_or_export_data: 0, // 是否导出 0查询
                tile_id_list: "",
                tile_search_type: "", // 精确查找true，模糊查找false
                create_diff_branch_task_start_time: "", // 创建开始时间
                create_diff_branch_task_end_time: "", //创建结束时间
                task_status: "", // 查询脚本状态
                page_index: 1,
                page_size: 10,
                return_all: 2
            };
            if (reqDatas) {
                for (let ele in reqDatas) {
                    for (let val in req) {
                        if (ele == val) {
                            req[val] = reqDatas[ele];
                        }
                    }
                }
            }
            if (isAll) {
                req["return_all"] = 1;
            }
            let url = "query_custom_diff_branch_task";
            this.reqFun(url, req, "tableData");
        },
        reqFun: function(url, datas, event) {
            // 所有请求的请求方法
            this.$http.post("/api/" + url, datas).then(res => {
                this.loading = false;
                this.createLoading = false;
                if (res.body.data.errno == 0) {
                    let { data } = res.body.data;
                    if (event === "isMaster") {
                        // 返回母库数据
                        this.frameData.marsterList = data.master_library_list;
                        // this.masterEvent()
                    } else if (event === "isResults") {
                        // 返回成果库数据
                        this.frameData.resultsList = data.results_library_info;
                        this.resultsEvent();
                    } else if (event === "isTask") {
                        // 返回作业库数据
                        this.frameData.taskList = data.project_list;
                        this.taskEvent();
                    } else if (event === "isTargetSubProject" || event === "isTargetSubProjectAuto") {
                        // 返回创建任务时数据版本展示的数据
                        if (data[0] && data[0].segment_list[0]) {
                            this.frameData.prooducDatas = data[0].segment_list;
                            if (event === "isTargetSubProjectAuto") {
                                this.datalietll("prooducLink", "stats");
                            } else {
                                this.datalietll("prooducLink", "stats");
                            }
                        } else {
                            this.frameData.prooducLink[0].disabled = true;
                            this.frameData.targetProoducLinkVal = ["2"];
                        }
                    } else if (event === "isEdSubProject" || event === "isEdSubProjectAuto") {
                        // 返回创建任务时数据版本展示的数据
                        if (data[0] && data[0].segment_list[0]) {
                            this.frameData.prooducDatas = data[0].segment_list;
                            if (event === "isEdSubProjectAuto") {
                                this.datalietll("edProoducLink", "ed");
                            } else {
                                this.datalietll("edProoducLink", "ed");
                            }
                        } else {
                            this.frameData.edProoducLink[0].disabled = true;
                            this.frameData.edProoducLinkVal = ["2"];
                        }
                    } else if (event === "createdObj") {
                        // 返回创建任务时点击确定查询网格id个数的数据
                        if (url == "query_custom_diff_branch_tile_list") {
                            this.frameData.titleNum = -1;
                            this.$confirm(res.body.data.msg, {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            })
                                .then(() => {
                                    this.establishCFTask("create_custom_diff_branch_task");
                                })
                                .catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消创建!"
                                    });
                                });
                            this.frameData.titleNum = 0;
                        } else {
                            this.centerDialogVisible = false;
                            this.onRefresh();
                            return alertInfo(this, "success", "创建自定义任务成功！");
                        }
                    } else if (event === "tableData") {
                        // 返回点击筛选按钮时表格展示的数据
                        this.reset.totalNumber = Number(data.total_num);
                        if (this.reset.totalNumber == 0) {
                            this.emptyText = "未查询到符合条件的数据";
                        }
                        if (datas.return_all == "1") {
                            this.reset.pagingData = data.task_list;
                            this.mypageings();
                        } else {
                            this.reset.tableData = data.task_list;
                        }
                    } else if (event === "repeat") {
                        // 返回差分任务重启是是否成功的提示
                        return alertInfo(this, "success", res.body.data.msg);
                    }
                } else {
                    if (event == "tableData") {
                        this.emptyText = res.body.data.msg;
                    } else {
                        return alertInfo(this, "error", res.body.data.msg);
                    }
                }
            });
        },
        repeatStart: function() {
            // 差分任务重启
            let num = [];
            for (let i in this.reset.ObtainTrue) {
                // 数组拍平
                num.push(...this.reset.ObtainTrue[i]);
            }
            if(num.length == 0){
                return alertInfo(this, "error", "请选择要重启的任务！");
            }
            let arr = [];
            for (let ele of this.reset.ObtainTrue) {
                for (let val of ele) {
                    if (val.diff_branch_task_status == "失败") {
                        arr.push({
                            diff_branch_task_id: val.diff_branch_task_id,
                            diff_branch_task_status: 5
                        });
                    } else {
                        return alertInfo(this, "error", "只支持失败的自定义差分任务重启！");
                    };
                }
            }
            let req = {
                diff_branch_task_id_list: arr
            };
            let url = "restart_custom_diff_branch_task";
            this.reqFun(url, req, "repeat");
        },
        updatasEd: function(val) {
            // 选择数据分支时要清空时间版本反之清空数据分支
            if (val[0] == "1") {
                this.frameData.edTimeVersion = "";
            } else {
                this.frameData.edProoducLinkVal = ["2"];
            }
        },
        updatasStart: function(val) {
            // 选择数据分支时要清空时间版本反之清空数据分支
            if (val[0] == "1") {
                this.frameData.linkTimeVersion = "";
            } else {
                this.frameData.targetProoducLinkVal = ["2"];
            }
        },
        selectchangeEd: function(val) {
            // 获取目标数据分支的第一项 判断是否显示生产环节
            if (val.length) {
                this.frameData.edProoducLink[0].disabled = val[0] == "1" ? false : true;
                if (val[0] == "1") {
                    this.subProjectLink(val[2], "isEdSubProject");
                } else {
                    this.frameData.edProoducLinkVal = ["2"];
                }
            }
        },
        selectChange: function(val) {
            // 获取目标数据分支的第一项 判断是否显示生产环节
            if (val.length) {
                this.frameData.prooducLink[0].disabled = val[0] == "1" ? false : true;
                if (val[0] == "1") {
                    this.subProjectLink(val[2], "isTargetSubProject");
                } else {
                    this.frameData.targetProoducLinkVal = ["2"];
                }
            }
        },
        closeframe: function(url) {
            // 点击确定提交表单
            this.$refs["formName"].validate(valid => {
                if (valid) {
                    if (!!!this.frameData.targetProoducLinkVal[2]) {
                        if (!this.frameData.linkTimeVersion) {
                            return alertInfo(this, "error", "目标数据版本不能为空!");
                        }
                    }
                    if (!!!this.frameData.edProoducLinkVal[2]) {
                        if (!this.frameData.edTimeVersion) {
                            return alertInfo(this, "error", "参考数据版本不能为空！");
                        }
                    }
                    if (this.frameData.tileType == 1) {
                        if (this.frameData.tile_id_list == "") {
                            return alertInfo(this, "error", "网格列表选择自定义时必须输入网格！");
                        }
                        // 自定义时直接创建
                        this.establishCFTask("create_custom_diff_branch_task");
                    } else {
                        // 自动推荐时先查询
                        this.establishCFTask("query_custom_diff_branch_tile_list");
                    }
                } else {
                    return false;
                }
            });
        },
        establishCFTask: function(url) {
            this.createLoading = true;
            let arr = {
                target_id: this.frameData.dataBranchTarget[2], // 目标数据分支id：子项目id/母库id/成果库id
                target_type: this.frameData.dataBranchTarget[0], // 目标数据分支类型：子项目1/母库2/成果库3
                target_segment: this.frameData.targetProoducLinkVal[1], // 基础要素作业
                target_segment_status: this.frameData.targetProoducLinkVal[2], // 目标数据分支 子项目环节类型
                target_branch_version: this.frameData.linkTimeVersion, // 目标数据分支的时间
                refer_id: this.frameData.dataBranchContrast[2], // 参考数据分支id：子项目id/母库id/成果库id
                refer_type: this.frameData.dataBranchContrast[0], // 参考数据分支类型：子项目1/母库2/成果库3
                refer_segment: this.frameData.edProoducLinkVal[1], // 参考数据分支子项目质检环节 回库接边39
                refer_segment_status: this.frameData.edProoducLinkVal[2], // 参考数据分支
                refer_branch_version: this.frameData.edTimeVersion, // 参考数据分支的时间版本
                tile_id_list: this.frameData.tile_id_list,
                tile_type: this.frameData.tileType, // 网格列表类型 1 自定义网格列表，2推荐网格列表
                note: this.frameData.memo // 备注
            };
            for (let ele in arr) {
                if (arr[ele] === undefined || arr[ele] === "") {
                    arr[ele] = "";
                }
            }
            this.reqFun(url, arr, "createdObj");
        },
        openObject: function() {
            // 弹窗打开是要执行的事件
            this.frameData.tile_id_list = "";
            this.frameData.memo = "";
            this.gridNum(); // 新建差分任务网格列表条数计算
            this.createLoading = false;
            this.centerDialogVisible = true;
            this.taskLibrary(); // 获取作业库数据
            // this.masterReqBody(); // 获取母库数据
            this.resultsReqBody(); // 获取成果库数据
        },
        subProjectLink: function(subProjectId, str) {
            // 获取子项目的作业环节
            let arr = {
                sub_project_id: subProjectId
            };
            let url = "query_project_segment_status";
            this.reqFun(url, arr, str);
        },
        taskLibrary: function() {
            // 获取作业库
            let arr = {
                query_type: 0
            };
            let url = "query_project_info";
            this.reqFun(url, arr, "isTask");
        },
        resultsReqBody: function() {
            // 成果库查询
            let arr = {
                car_factory: "",
                is_query_sub_library: 2,
                page_index: 1,
                page_size: 10,
                query_end_time: "",
                query_or_export_data: 0,
                query_start_time: "",
                results_library_id: 0,
                results_library_name: "",
                return_all: 1
            };
            let url = "query_results_library";
            this.reqFun(url, arr, "isResults");
        },
        // masterReqBody: function () { // 母库查询
        //     let arr = {
        //         mark_status: 1,
        //         query_or_export_data: 0,
        //         return_all: 1,
        //         page_index: 1,
        //         page_size: 10
        //     };
        //     let url = 'query_master_library';
        //     this.reqFun(url,arr,'isMaster')
        // },
        datalietll: function(obj, judge) {
            // 新建差分任务选择数据分支后从后端得到数据版本信息给数据版本赋值
            let num1 = "";
            let num2 = "";
            this.frameData[obj][0].children = []; // 先清空渲染数据版本的数组
            this.frameData.prooducDatas.map(event => {
                // 遍历后端返回的数组
                let object = {
                    value: "",
                    label: "",
                    children: []
                };
                object.value = event.quality_check_segment;
                object.label = event.quality_check_segment_text;
                num1 = object.value;
                if (event.children) {
                    event.children.map(val => {
                        if (val.qc_round_result) {
                            object.children.push({
                                value: val.qc_round_result,
                                label: val.qc_round_result_text
                            });
                            num2 = val.qc_round_result;
                        }
                        if (val.quality_check_sequence) {
                            object.children.push({
                                value: val.quality_check_sequence,
                                label: val.quality_check_sequence_text
                            });
                        }
                    });
                }
                this.frameData[obj][0].children.push(object);
            });
            if (num1 && num2) {
                // 当num1和num2都不为空时赋值；
                if (obj == "prooducLink") {
                    this.frameData.targetProoducLinkVal = ["1", num1, num2];
                } else if (obj == "edProoducLink") {
                    this.frameData.edProoducLinkVal = ["1", num1, num2];
                }
            } else {
                if (judge == "ed") {
                    this.frameData.edProoducLinkVal = [];
                } else {
                    this.frameData.targetProoducLinkVal = [];
                }
            }
        },
        taskEvent: function() {
            // 新建差分任务 方法
            if (this.frameData.taskList[0] == undefined) {
                this.frameData.optionsWithDisabled[0].disabled = true;
                return;
            }
            let arr = [];
            for (let val of this.frameData.taskList) {
                let children = [];
                for (let i of val.sub_project_list) {
                    children.push({
                        label: i.sub_project_name,
                        value: Number(i.sub_project_id),
                        sub_project_process_type1: this.sub_project_process_type
                    });
                }
                arr.push({
                    label: val.project_name,
                    value: Number(val.project_id),
                    disabled: children[0] ? false : true,
                    children: children[0] ? children : null
                });
            }
            // 给数据分支赋默认值
            this.frameData.dataBranchTarget = ["1", arr[0].value, arr[0].children[0].value];
            this.frameData.dataBranchContrast = ["1", arr[0].value, arr[0].children[0].value];
            this.subProjectLink(this.frameData.dataBranchTarget[2], "isTargetSubProjectAuto");
            this.subProjectLink(this.frameData.dataBranchContrast[2], "isEdSubProjectAuto");
            // 给作业库数组赋值
            this.frameData.optionsWithDisabled[0].children = arr;
        },
        resultsEvent: function() {
            // 成果库遍历数据
            if (this.frameData.resultsList[0] == undefined) {
                this.frameData.optionsWithDisabled[1].disabled = true;
                return;
            }
            let arr = [];
            for (let ele of this.frameData.resultsList) {
                let children = [];
                for (let val of ele.results_sub_library_info) {
                    children.push({
                        value: val.results_sub_library_id,
                        label: val.results_sub_library_name
                    });
                }
                arr.push({
                    label: ele.results_library_name,
                    value: ele.results_library_id,
                    disabled: children[0] ? false : true,
                    children: children[0] ? children : null
                });
            }
            /*  
                    &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
                    &&&  如果要显示母库数据请将：this.frameData.optionsWithDisabled[1]&&&&
                    &&&  改为：this.frameData.optionsWithDisabled[2]                 &&&
                    &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
                */
            this.frameData.optionsWithDisabled[1].children = arr;
        },
        // masterEvent: function () { // 母库数据遍历赋值
        //     this.frameData.marsterList.filter(ele =>{
        //         if(ele.master_library_type == 1) {
        //             this.frameData.optionsWithDisabled[1].children[0].children.push({value:ele.master_library_id,label:ele.master_library_name});
        //         } else if(ele.master_library_type == 2) {
        //             this.frameData.optionsWithDisabled[1].children[1].children.push({value:ele.master_library_id,label:ele.master_library_name});
        //         }
        //     })
        // },
        isDefinitiontable: function() {
            // 新建差分任务时自定义网格列表
            this.frameData.titleNum = 0;
            this.frameData.tile_id_list = "";
            if (this.frameData.gridList == "自定义") {
                this.frameData.isShowTable = true;
                this.frameData.tileType = 1;
            } else {
                this.frameData.isShowTable = false;
                this.frameData.tileType = 2;
            }
        },
        gridNum: function() {
            // 新建差分任务网格列表条数计算
            this.frameData.titleNum = 0;
            if (this.frameData.tile_id_list != "") {
                let arr = this.frameData.tile_id_list.split(";");
                let arr1 = [];
                for(let ele of arr) {
                    if(arr1.indexOf(ele) < 0){
                        arr1.push(ele);
                    }
                };
                for (let ele of arr1) {
                    if (ele != "") {
                        this.frameData.titleNum++;
                    }
                }
                this.frameData.tile_id_list = arr1.join(";");
            }
        },
        formatTileIDInput: function(tmpString) {
            // 校验新建差分任务输入网格数据的正确性
            this.frameData.tile_id_list = inputCheck(this, tmpString, 2);
        },
        formatSearchInput: function() {
            // 校验查询输入框格式
            this.reset.tileID = inputCheck(this, this.reset.tileID, 2);
        },
        selectDateChange: function(val) {
            // 筛选条件创建时间赋值
            if (val) {
                this.reset.startTime = transformstartDate(this.reset.tiemArr[0]);
                this.reset.endTime = transformEndDate(this.reset.tiemArr[1]);
            } else {
                this.reset.startTime = "";
                this.reset.endTime = "";
            }
        },
        sortTable: function(val) {
            // 表格数据排序
            this.reset.ObtainTrue = [];
            this.reset.levelObj["page_index"] = 1;
            this.reset.filter.currentPage = 1;
            if (val.order === "descending") {
                this.reset.tableOrderNum = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.reset.tableOrderNum = val.prop + " asc";
            } else {
                this.reset.tableOrderNum = "diff_branch_task_id desc";
            }
            this.tableDataFun(this.reset.levelObj);
        },
        exporty: function() {
            let postData = Object.assign({},this.reset.levelObj)
            postData['query_or_export_data'] = '1';
            postData['path_name'] = '自定义差分';
            postData['return_all'] = '1';
            downloadFile(this, postData, "/api/query_custom_diff_branch_task");
        },
        exportd: function(req, url) {
            downloadFile(this, req, "/api/" + url);
        }
    }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;

.autoDiscrimination {
    height: $height;
    width: $width;
    overflow: auto;

    .searchBox {
        min-height: 50px;
        padding-top: 20px;
        background: #fff;

        .selectDiv {
            float: left;
            margin: 0 0 15px 30px;
            position: relative;

            .input-style {
                display: inline-block;
                width: 240px;
            }

            .inputBox {
                position: absolute;
                top: 8px;
                right: 28px;
            }
        }

        .align-right {
            min-width: 50px;
            display: inline-block;
        }

        .marginBottom {
            text-align: right;
            width: 178px;
            margin: 0 6px 10px;
        }
    }

    .table-area {
        width: $width;
        margin: 10px 0px;
        padding: 10px 0 30px;
        background: #fff;

        .table-div {
            width: 95%;
            margin: 0 auto;

            .formBox {
                display: inline-block;
            }

            .margin {
                margin: 0 3px;
            }
            .inline {
                display: inline-block;
            }
        }

        .bottomBox {
            width: 95%;
            margin: 5px auto;

            .select-area {
                text-align: left;
                height: 26px;
                line-height: 26px;
                margin-left: 20px;

                .select-number {
                    font-size: 16px;
                    margin-right: 10px;
                }
            }

            .titleBox {
                float: left;
                font-size: 20px;
                font-weight: bold;
                margin: 3px 10px 0 0;
            }
        }

        .pagination-area {
            width: 95%;
            text-align: right;
            margin: 30px 0 0px 0;
        }

        .loadup {
            text-align: left;
            width: 95%;
            margin: 0 auto;

            .buttonBox {
                margin: 10px 0 5px 10px;
            }
        }

        .segmenting-line {
            width: 95%;
            border-top: 1px solid #ccc;
            margin: 0px auto;
        }
    }

    .frameBox {
        overflow: hidden;
        margin-bottom: 10px;
    }

    .listBox {
        width: 64px;
        margin-right: 3px;
    }

    .paddingBox {
        padding-top: 1px;
    }

    .dataListBox {
        padding-left: 10px;
    }

    .el-dialogBox {
        min-width: 1300px;

        .title-box {
            margin-bottom: 10px;
        }

        .left-input {
            min-width: 400px;
        }

        .center-input {
            min-width: 50px;
        }

        .right-input {
            min-width: 400px;
        }

        .el-formwidth {
            min-width: 276px;
        }

        .el-version {
            width: 207px;
        }

        .time-version {
            height: 36px;
        }

        .tiemline {
            line-height: 37px;
        }
    }
}
</style>

<style>
/* v_s：自定义差分页面的网格编号筛选框样式 */
.input-padding .el-input__inner {
    padding: 0 80px 0 15px;
}
</style>
