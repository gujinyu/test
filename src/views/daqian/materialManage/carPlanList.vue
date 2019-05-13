<template>
    <div class="carPlan">
        <!-- 按钮区，归类、导出等 begin-->
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" ref="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv">
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium" @change="selectSectionChange">
                            <el-radio-button label="1">外业任务挂盘</el-radio-button>
                            <el-radio-button label="2">外业任务准入</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right">所属项目：</span>
                        <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus"
                            @selectProjects="SelectProjects" :ChangeOnselect="ChangeOnselect" :isProjectClearable="isProjectClearable"
                            :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject"
                            :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right">归类状态：</span>
                        <el-select size="medium" :disabled="showClassify" @change="classifySelect" v-model="search.selectClassifyState"
                            clearable placeholder="全部">
                            <el-option value="1" label="未归类"></el-option>
                            <el-option value="2" label="已归类"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">采集城市：</span>
                        <selectCity :resetselectCityData="resetselectCityData" @updateCityStatus="updateCityStatus"
                            :isClearable="isSearchCityClearable" @selectCitys="SelectCitys"></selectCity>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '1'">
                        <span class="align-right">挂盘状态：</span>
                        <el-select size="medium" v-model="search.selectHangingState" clearable placeholder="全部">
                            <el-option value="1" label="挂盘中"></el-option>
                            <el-option value="2" label="已完成"></el-option>
                            <el-option value="3" label="失败"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right">准入状态：</span>
                        <el-select size="medium" v-model="search.selectAllowInState" clearable placeholder="全部">
                            <el-option value="2" label="排队中"></el-option>
                            <el-option value="3" label="准入中"></el-option>
                            <el-option value="4" label="通过"></el-option>
                            <el-option value="6" label="不通过"></el-option>
                            <el-option value="5" label="失败"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">外业质检状态：</span>
                        <el-select size="medium" v-model="search.field_qc_status" clearable placeholder="全部">
                            <el-option value="1" label="未开始"></el-option>
                            <el-option value="4" label="合格"></el-option>
                            <el-option value="7" label="打回"></el-option>
                            <!-- <el-option value="8" label="复审中"></el-option>  -->
                            <el-option value="6" label="作废"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '1'">
                        <span class="align-right">提交日期：</span>
                        <el-date-picker style="width:400px;" v-model="search.gpTime" type="daterange" @change="selectDateChange"
                            size="medium" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right left-margin-10">准入标记结果：</span>
                        <el-select size="medium" v-model="search.selectAllowInResult" clearable placeholder="全部">
                            <el-option value="1" label="未标记"></el-option>
                            <el-option value="2" label="通过"></el-option>
                            <el-option value="3" label="作废"></el-option>
                            <el-option value="4" label="替换"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '1'">
                        <span class="align-right">外业计划质检状态：</span>
                        <el-select size="medium" v-model="search.field_plan_qc_status" clearable placeholder="全部">
                            <el-option value="1" label="待审核"></el-option>
                            <el-option value="3" label="审核中"></el-option>
                            <el-option value="4" label="审核完成"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right">存储编号：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件"
                            trigger="focus" :content="search.storageID">
                            <el-input size="medium" slot="reference" v-model="search.storageID" :change="formatStorageIDSearchInput()"
                                clearable placeholder="搜索存储编号">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '1'">
                        <span class="align-right">任务详情：</span>
                        <el-popover class="input-style-1" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                            :content="search.description">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.description"
                                clearable placeholder="搜索任务详情，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">车天编号：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="仅可输入【数字、字母、下划线、空格、逗号、星号和分号】，其中‘*’匹配 任意多个字符，分号或空格分隔多个条件，例如输入 *gc；20170910T154407_GD 会筛选出20170910T154407_GD及所有gc结尾的外业任务。"
                            width="600" trigger="focus" :content="search.carPlanId">
                            <el-input size="medium" slot="reference" v-model="search.carPlanId" :change="formatSearchInput()"
                                clearable placeholder="搜索车天编号">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">外业计划名称：</span>
                        <el-popover class="input-style-1" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                            :content="search.field_plan_name">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.field_plan_name"
                                clearable placeholder="搜索外业计划名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                </div>
                <div class="open">
                    <div class="more" v-show="moreShow" @click="collapseFlag=!collapseFlag">
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
        <!-- 外业任务列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list" v-show="notAllowInSection">
                <span class="titlespan">外业任务管理</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">条外业挂盘信息</span> -->
                <form action="/api/query_total_gp_status" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='gp_status' v-model="search.selectHangingState">
                    <input type="hidden" name='query_start_time' v-bind:value="search.startTime">
                    <input type="hidden" name='query_end_time' v-bind:value="search.endTime">
                    <input type="hidden" name='city_name' v-model="search.selectCity">
                    <input type="hidden" name='field_qc_status' v-model="search.field_qc_status">
                    <input type="hidden" name='field_plan_qc_status' v-model="search.field_plan_qc_status">
                    <input type="hidden" name='description' v-model="search.description">
                    <input type="hidden" name='field_plan_name' v-model="search.field_plan_name">
                    <input type="hidden" name='car_day_id_list' v-model="search.postcarPlanId">
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name='query_or_export_data' value='3'>
                    <input type="hidden" name='path_name' value='外业任务管理'>
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain
                        native-type="submit">导出</el-button>
                </form>
            </div>
            <div class="btn-list" v-show="!notAllowInSection">
                <span class="titlespan">外业任务管理</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">条外业准入信息</span> -->
                <form action="/api/query_wy_allow_in_info" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='project_id' v-model="search.selectProjectID">
                    <input type="hidden" name='sub_project_id' v-model="search.selectSubprojectID">
                    <input type="hidden" name='guilei_status' v-model="search.selectClassifyState">
                    <input type="hidden" name='city_name' v-model="search.selectCity">
                    <input type="hidden" name='car_day_id_list' v-model="search.postcarPlanId">
                    <input type="hidden" name='storage_task_id_list' v-model="search.storageID">
                    <input type="hidden" name='handle_segment' v-model="search.selectSection">
                    <input type="hidden" name='handle_status' v-model="search.selectAllowInState">
                    <input type="hidden" name='op_status' v-model="search.selectAllowInResult">
                    <input type="hidden" name='sort_field_name' v-model="searchAllowIn.sort_field_name">
                    <input type="hidden" name='field_qc_status' v-model="search.field_qc_status">
                    <input type="hidden" name='field_plan_name' v-model="search.field_plan_name">
                    <input type="hidden" name='query_or_export_data' value='9'>
                    <input type="hidden" name='path_name' value='外业任务管理'>
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain
                        native-type="submit">导出</el-button>
                </form>
                <el-dropdown class="right-div">
                    <el-button type="primary" size="medium" :disabled="accessDisabled">
                        更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="center" @click.native="returnMark()">打回</el-dropdown-item>
                        <el-tooltip content="挂盘完成且准入通过才可归类，归类完成自动触发前预处理" placement="left" effect="light">
                            <el-dropdown-item class="center" @click.native="classifyToSubproject()">归类</el-dropdown-item>
                        </el-tooltip>
                        <el-dropdown-item class="center" @click.native="allowInMark()">人工通过</el-dropdown-item>
                        <el-dropdown-item class="center-last" @click.native="downloadLogs()">log批量下载</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-tooltip content="准入失败的可以尝试重新准入" placement="top-start" effect="light">
                    <el-button class="right-div" type="primary" size="medium" @click="tryAllowIn()" :disabled="accessDisabled">重新准入</el-button>
                </el-tooltip>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <carPlanDetailList @carPlanPageChange="searchCarPlan" :editDisabled="accessDisabled" :resetSelectionCarday="resetSelectionCarday"
                :clearSort="clearSort" @refreashCarPlan="refreashCarPlan" @sortSearch="sortSearch" @updateSelectCarPlan="SelectCarPlan"
                @updateMultipleSelectionStatus="updateMultipleSelectionStatus" @updateClearSortStatus="updateClearSortStatus"
                :notAllowInSection="notAllowInSection" :loading="loading" :emptyText="emptyText" :carPlanData="carPlanData"
                ref="carPlanDetailList">
                <div class="select-area-1" slot="headPlate">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
            </carPlanDetailList>
        </div>
        <!-- 外业任务列表 end-->
        <!-- 外业任务归类 begin-->
        <el-dialog title="外业任务归类" width="600px" :visible.sync="dialogClassifyVisible" :close-on-click-modal="false">
            <el-form label-width="120px" class="demo-dynamic">
                <el-form-item label="外业任务列表" required>
                    <el-input type="textarea" readonly placeholder="请选择要归类（即关联到子项目）的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="classifyData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{classifyData.postCarPlanIDS.length}}</b>条记录（去重后）</p>
                <el-form-item label="项目分支" required>
                    <selectProject style="float:left;min-width:400px;" @selectProjects="SelectClassifyProjects"
                        :isStorage="true" :havedefaultProject="false"></selectProject>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitClassifyForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogClassifyVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 外业任务归类 end-->
        <!-- 外业任务重新准入 begin-->
        <el-dialog title="外业任务重新准入" :visible.sync="dialogTryAllowInVisible" :close-on-click-modal="false">
            <el-form ref="tryAllowInData" :max-height="formHeight" :model="tryAllowInData" label-width="120px" class="demo-dynamic">
                <el-form-item label="外业任务列表" required prop="carPlanIDS" :rules="[{ required: true, message: '请选择要重新准入的外业任务', trigger: 'blur'},{ required: true, message: '请选择要重新准入的外业任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要重新准入的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="tryAllowInData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{tryAllowInData.postCarPlanIDS.length}}</b>条记录（去重后）</p>
                <el-form-item>
                    <el-button type="primary" @click="submitTryAllowInForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogTryAllowInVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 外业任务重新准入 end-->
        <!-- 外业任务准入Log批量下载 begin-->
        <el-dialog title="外业任务准入log批量下载" :visible.sync="dialogDownloadLogVisible" :close-on-click-modal="false">
            <el-form ref="downloadLogData" :model="downloadLogData" label-width="120px" class="demo-dynamic">
                <el-form-item label="外业任务列表" required prop="carPlanIDS" :rules="[{ required: true, message: '请选择要下载准入log的外业任务', trigger: 'blur'},{ required: true, message: '请选择要下载准入log的外业任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要下载准入log的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="downloadLogData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{downloadLogData.postCarPlanIDS.length}}</b>条记录（去重后）</p>
                <el-form-item>
                    <el-button type="primary" @click="submitDownloadLogForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogDownloadLogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 外业任务准入Log批量下载 end-->
        <!-- 外业任务准入人工通过 begin-->
        <el-dialog title="外业任务准入人工通过" :visible.sync="dialogAllowInMarkVisible" :close-on-click-modal="false">
            <el-form ref="allowInMarkData" :model="allowInMarkData" label-width="120px" class="demo-dynamic">
                <el-form-item label="外业任务列表" required>
                    <el-input type="textarea" readonly placeholder="请选择要人工通过的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="allowInMarkData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{allowInMarkData.postCarPlanIDS.length}}</b>个外业任务</p>
                <el-form-item label="标记结果" required>
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="allowInMarkData.allowInResult" label="2">通过</el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="标记原因" prop="allowInReason" :rules="[ { required: true, message: '请输入标记原因', trigger: 'blur' }]">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" v-model="allowInMarkData.allowInReason"
                        :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitAllowInMarkForm()">确定</el-button>
                    <el-button @click="dialogAllowInMarkVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 外业任务准入人工标记 end-->
        <!-- 外业任务打回 begin-->
        <el-dialog title="外业任务准入打回确认" width="600px" :visible.sync="dialogReturnVisible" :close-on-click-modal="false">
            <el-form ref="returnMarkData" :model="returnMarkData" label-width="120px" class="demo-dynamic">
                <el-form-item label="外业任务列表" required>
                    <el-input type="textarea" readonly placeholder="请选择要打回的的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="returnMarkData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{returnMarkData.postCarPlanIDS.length}}</b>个外业任务打回外业质检环节</p>
                <el-form-item label="打回原因" prop="return_reason">
                    <el-input type="textarea" placeholder="默认是各任务准入不通过原因，请输入原因" v-model="returnMarkData.return_reason"
                        :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="returnMarkData.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitFormOperation('returnMarkData')">确定</el-button>
                    <el-button @click="dialogReturnVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 外业任务打回 end-->
    </div>
</template>

<script>
    import {
        transformstartDate,
        transformEndDate,
        validateData,
        alertInfo,
        inputCheck,
        trim
    } from "@/utils/daqian_tools";
    import carPlanDetailList from "@/components/daqian_carPlanDetailList.vue";
    import selectProject from "@/components/daqian_selectProject.vue";
    import selectCity from "@/components/daqian_selectCity.vue";
    import Vue from "vue";
    export default {
        components: {
            carPlanDetailList,
            selectProject,
            selectCity
        },
        data() {
            return {
                formHeight: this.global.formHeight,
                search: {
                    userId: sessionStorage.userid,
                    carPlanId: "",
                    storageID: "",
                    selectSection: "1",
                    selectProjectID: "",
                    selectClassifyState: "",
                    selectSubprojectID: "",
                    selectCity: "",
                    selectHangingState: "",
                    selectAllowInState: "",
                    selectAllowInResult: "",
                    gpTime: [],
                    startTime: "",
                    endTime: "",
                    postcarPlanId: "",
                    sort_field_name: "end_time desc",
                    field_qc_status: "",
                    field_plan_qc_status: "",
                    field_plan_name: "",
                    description: ""
                },
                searchDatas: {},
                searchAllowIn: {
                    sort_field_name: ""
                },
                pageInfo: {
                    perPage: 10,
                    currentPage: 1
                },
                carPlanData: {},
                totalNumber: 0,
                showClassify: true,
                showSelectProject: false,
                resetselectProjectData: false,
                resetselectCityData: false,
                isProjectClearable: true,
                havedefaultProject: true,
                classifyData: {
                    carPlanIDS: "",
                    classifiedCarPlanIDS: "",
                    postCarPlanIDS: [],
                    projectId: 0,
                    subProjectId: 0
                },
                dialogClassifyVisible: false,
                tryAllowInData: {
                    carPlanIDS: "",
                    postCarPlanIDS: []
                },
                dialogTryAllowInVisible: false,
                downloadLogData: {
                    subProjectId: 0,
                    carPlanIDS: "",
                    postCarPlanIDS: []
                },
                dialogDownloadLogVisible: false,
                isSearchCityClearable: true,
                ChangeOnselect: true,
                accessDisabled: false,
                resetSelectionCarday: false,
                loading: true,
                emptyText: "查询中",
                notAllowInSection: true,
                requestTime: "",
                clearSort: false,
                dialogAllowInMarkVisible: false,
                allowInMarkData: {
                    carPlanIDS: "",
                    allowInResult: "2",
                    allowInReason: "",
                    postCarPlanIDS: []
                },
                dialogReturnVisible: false,
                returnMarkData: {
                    carPlanIDS: "",
                    postCarPlanIDS: [],
                    return_reason: "",
                    memo: ""
                },
                collapseFlag: true,
                moreShow: true
            };
        },
        created() {
            if (sessionStorage.carPlanId) {
                this.search.carPlanId = sessionStorage.carPlanId;
                this.search.postcarPlanId = this.search.carPlanId;
            }
            if (this.search.selectSection == "1") {
                this.searchCarPlan();
            }
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
        },

        mounted: function () {
            if (this.$refs.selectArea.offsetHeight > 100) {
                this.collapseFlag = false;
                this.$refs.selectArea.style.height = "100px"
            } else {
                this.moreShow = false;
            }
        },
        methods: {
            selectDateChange: function (val) {
                if (val) {
                    this.search.startTime = transformstartDate(this.search.gpTime[0]);
                    this.search.endTime = transformEndDate(this.search.gpTime[1]);
                } else {
                    this.search.startTime = "";
                    this.search.endTime = "";
                }
            },
            formatStorageIDSearchInput: function () {
                this.search.storageID = inputCheck(this, this.search.storageID, 1);
            },
            formatSearchInput: function () {
                this.search.carPlanId = inputCheck(this, this.search.carPlanId, 4);
                if (this.search.carPlanId) {
                    this.search.postcarPlanId = this.search.carPlanId;
                } else {
                    this.search.postcarPlanId = "";
                }
                sessionStorage.carPlanId = this.search.postcarPlanId;
            },
            searchCarPlan: function (arg) {
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.isAll)) {
                        this.totalNumber = 0;
                        this.carPlanData = {};
                    }
                    this.loading = true;
                    this.pageInfo.currentPage = 1;
                }
                if (arg && arg.page_index) {
                    this.pageInfo.perPage = arg.page_size;
                    this.pageInfo.currentPage = arg.page_index;
                }
                this.emptyText = "查询中";
                if (this.search.selectSection == "1") {
                    this.notAllowInSection = true;
                    var query_carPlandata = {
                        user_id: sessionStorage.userid,
                        project_id: 0,
                        sub_project_id: 0,
                        guilei_status: this.search.selectClassifyState,
                        gp_status: this.search.selectHangingState,
                        query_start_time: this.search.startTime,
                        query_end_time: this.search.endTime,
                        city_name: this.search.selectCity,
                        field_qc_status: this.search.field_qc_status,
                        field_plan_name: this.search.field_plan_name,
                        description: this.search.description,
                        sort_field_name: this.search.sort_field_name,
                        car_day_id_list: this.search.postcarPlanId.replace(/[*]/g, "%"),
                        field_plan_qc_status: this.search.field_plan_qc_status,
                        query_or_export_data: 0,
                        page_size: this.pageInfo.perPage,
                        page_index: this.pageInfo.currentPage,
                        return_all: 2
                    };
                    if (!(arg && arg.loading)) {
                        if (!(arg && arg.isAll)) {
                            this.searchDatas = query_carPlandata;
                        }
                        this.loading = true;
                    }
                    this.searchDatas.return_all = arg && arg.isAll ? arg.isAll : 2;
                    this.searchDatas.page_index = this.pageInfo.currentPage;
                    this.searchDatas.page_size = this.pageInfo.perPage;
                    this.$http.post("/api/query_total_gp_status", this.searchDatas, this.randomMarkStraing).then(
                        response => {
                            this.loading = false;
                            var headerData = response.headers;
                            var revDate = "";
                            if (headerData.map.date) {
                                revDate = new Date(headerData.map.date[0]);
                            } else if (headerData.map.Date) {
                                revDate = new Date(headerData.map.Date[0]);
                            }
                            if (this.requestTime == "") {
                                this.requestTime = revDate;
                                this.getResponseDate(response.body);
                            } else {
                                if (revDate >= this.requestTime) {
                                    this.requestTime = revDate;
                                    this.getResponseDate(response.body);
                                }
                            }
                        },
                        response => {
                            // 响应错误回调
                            this.loading = false;
                            this.carPlanData = {};
                            this.emptyText = "查询失败";
                        }
                    );
                } else {
                    // 准入查询z
                    this.notAllowInSection = false;
                    this.downloadLogData.subProjectId = this.search.selectSubprojectID;
                    var query_carPlandata = {
                        user_id: sessionStorage.userid,
                        project_id: this.search.selectProjectID,
                        sub_project_id: this.search.selectSubprojectID,
                        guilei_status: this.search.selectClassifyState,
                        city_name: this.search.selectCity,
                        car_day_id_list: this.search.postcarPlanId.replace(/[*]/g, "%"),
                        storage_task_id_list: this.search.storageID,
                        handle_segment: this.search.selectSection,
                        handle_status: this.search.selectAllowInState,
                        op_status: this.search.selectAllowInResult,
                        sort_field_name: this.searchAllowIn.sort_field_name,
                        field_qc_status: this.search.field_qc_status,
                        field_plan_name: this.search.field_plan_name,
                        query_or_export_data: 0,
                        page_size: this.pageInfo.perPage,
                        page_index: this.pageInfo.currentPage,
                        return_all: arg && arg.isAll ? arg.isAll : 2
                    };
                    if (!(arg && arg.loading)) {
                        if (!(arg && arg.isAll)) {
                            this.searchDatas = query_carPlandata;
                        }
                    }
                    this.searchDatas.return_all = arg && arg.isAll ? arg.isAll : 2;
                    this.searchDatas.page_index = this.pageInfo.currentPage;
                    this.searchDatas.page_size = this.pageInfo.perPage;
                    this.$http.post("/api/query_wy_allow_in_info", this.searchDatas).then(
                        response => {
                            this.loading = false;
                            var headerData = response.headers;
                            var revDate = "";
                            if (headerData.map.date) {
                                revDate = new Date(headerData.map.date[0]);
                            } else if (headerData.map.Date) {
                                revDate = new Date(headerData.map.Date[0]);
                            }
                            if (this.requestTime == "") {
                                this.requestTime = revDate;
                                this.getResponseDate(response.body, arg);
                            } else {
                                if (revDate >= this.requestTime) {
                                    this.requestTime = revDate;
                                    this.getResponseDate(response.body, arg);
                                }
                            }
                        },
                        response => {
                            // 响应错误回调
                            this.loading = false;
                            this.emptyText = "查询失败";
                        }
                    );
                }
            },
            getResponseDate: function (response, arg) {
                var data = response.data;
                if (data.errno === 0 || data.errno === 7) {
                    if (data.errno === 7) {
                        this.emptyText = "未查询到符合条件的数据";
                    } else {
                        this.totalNumber = data.data.total_number;
                        if (this.totalNumber == 0) {
                            this.carPlanData = {};
                            this.emptyText = "未查询到符合条件的数据";
                        }
                        if (arg && arg.isAll) {
                            this.$refs.carPlanDetailList.afterSelectAll(data)
                        } else {
                            this.carPlanData = Object.assign({}, this.carPlanData, data);
                        }
                    }
                } else {
                    this.carPlanData = {};
                    this.emptyText = "查询失败";
                }
            },
            onSearch: function (event) {
                this.$refs.carPlanDetailList.resetSelect();
                this.searchCarPlan();
                this.resetSelectionCarday = true;
            },
            onRefresh: function (event) {
                this.$refs.carPlanDetailList.resetSelect();
                this.resetSelectionCarday = true;
                this.search.selectHangingState = "";
                this.search.gpTime = [];
                this.search.startTime = "";
                this.search.endTime = "";
                this.search.selectCity = "";
                this.resetselectCityData = true;
                this.search.selectAllowInState = "";
                this.search.selectAllowInResult = "";
                this.clearSort = true;
                this.search.field_qc_status = "";
                this.search.field_plan_name = "";
                this.search.description = "";
                // this.showClassify = true;
                this.search.field_plan_qc_status = "";
                this.search.selectClassifyState = "";
                this.search.storageID = "";
                this.search.sort_field_name = "end_time desc";
                this.searchAllowIn.sort_field_name = "";
                if (event !== "sectionChange") {
                    this.search.carPlanId = "";
                    this.search.postcarPlanId = "";
                    if (this.search.selectSection == "1") {
                        this.searchCarPlan();
                    } else {
                        this.resetselectProjectData = true;
                    }
                } else {
                    if (this.search.selectProjectID) {
                        this.showClassify = true;
                        this.showSelectProject = false;
                    } else {
                        this.showClassify = false;
                        this.showSelectProject = false;
                    }
                    this.searchCarPlan();
                }
            },
            refreashCarPlan: function (data) {
                if (data) {
                    this.searchCarPlan();
                }
            },
            sortSearch: function (data) {
                this.search.sort_field_name = data;
                this.searchAllowIn.sort_field_name = data;
                this.onSearch();
            },
            selectSectionChange: function () {
                this.onRefresh("sectionChange");
            },
            SelectCitys: function (data) {
                this.search.selectCity = data;
            },
            SelectProjects: function (data) {
                if (data.project_id) {
                    this.showClassify = true;
                } else {
                    this.showClassify = false;
                }
                this.search.selectProjectID = data.project_id;
                this.search.selectSubprojectID = data.sub_project_id;
                if (data.init) {
                    if (this.search.selectSection == "2") {
                        this.searchCarPlan();
                    }
                }
            },
            updateMultipleSelectionStatus: function (data) {
                this.resetSelectionCarday = false;
            },
            updateClearSortStatus: function (data) {
                this.clearSort = false;
            },
            updateProjectStatus: function (data) {
                this.resetselectProjectData = false;
                if (this.search.selectProjectID) {
                    this.showSelectProject = false;
                    this.showClassify = true;
                } else {
                    this.showSelectProject = false;
                    this.showClassify = false;
                }
            },
            updateCityStatus: function (data) {
                this.resetselectCityData = false;
            },
            classifySelect: function (val) {
                sessionStorage.selectClassifyState = val;
                if (val) {
                    this.showSelectProject = true;
                } else {
                    this.showSelectProject = false;
                }
            },
            SelectCarPlan: function (data) {
                var carPlanIDS = "";
                var classifiedCarPlanIDS = "";
                this.classifyData.postCarPlanIDS = [];
                var postcarPlanIds = [];
                for (var val of data) {
                    for (var item of val) {
                        if (postcarPlanIds.indexOf(item.car_day_id) == -1) {
                            postcarPlanIds.push(item.car_day_id);
                            this.classifyData.postCarPlanIDS.push({
                                car_day_id: item.car_day_id,
                                storage_task_id: item.storage_task_id,
                                sub_project_id: item.sub_project_id,
                                handle_status: item.handle_status,
                                fail_description: item.fail_description,
                                return_sequence: item.return_sequence,
                                field_plan_id: item.field_plan_id,
                                field_qc_status: item.field_qc_status
                            });
                            if (item.sub_project_id) {
                                if (classifiedCarPlanIDS) {
                                    if (classifiedCarPlanIDS.indexOf("等") == -1) {
                                        classifiedCarPlanIDS = classifiedCarPlanIDS + "等";
                                    }
                                } else {
                                    classifiedCarPlanIDS = item.car_day_id;
                                }
                            }
                            if (carPlanIDS) {
                                carPlanIDS = carPlanIDS + "," + item.car_day_id;
                            } else {
                                carPlanIDS = item.car_day_id;
                            }
                        }
                    }
                }
                this.classifyData.carPlanIDS = carPlanIDS;
                this.classifyData.classifiedCarPlanIDS = classifiedCarPlanIDS;
                this.tryAllowInData.carPlanIDS = carPlanIDS;
                this.tryAllowInData.postCarPlanIDS = [].concat(
                    JSON.parse(JSON.stringify(this.classifyData.postCarPlanIDS))
                );
                this.downloadLogData.carPlanIDS = carPlanIDS;
                this.downloadLogData.postCarPlanIDS = [].concat(
                    JSON.parse(JSON.stringify(this.classifyData.postCarPlanIDS))
                );
                this.returnMarkData.carPlanIDS = carPlanIDS;
                this.returnMarkData.postCarPlanIDS = [].concat(
                    JSON.parse(JSON.stringify(this.classifyData.postCarPlanIDS))
                );
                this.allowInMarkData.carPlanIDS = carPlanIDS;
                this.allowInMarkData.postCarPlanIDS = [].concat(
                    JSON.parse(JSON.stringify(this.classifyData.postCarPlanIDS))
                );
            },
            downloadLogs: function () {
                this.$refs.carPlanDetailList.toData();
                if (validateData(this.downloadLogData.carPlanIDS)) {
                    this.dialogDownloadLogVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要下载准入log的外业任务");
                }
            },
            tryAllowIn: function () {
                this.$refs.carPlanDetailList.toData();
                if (validateData(this.tryAllowInData.carPlanIDS)) {
                    this.dialogTryAllowInVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要重新准入的外业任务");
                }
            },
            classifyToSubproject: function () {
                this.$refs.carPlanDetailList.toData();
                if (validateData(this.classifyData.carPlanIDS)) {
                    this.dialogClassifyVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要归类的外业任务");
                }
            },
            validateClassify: function () {
                this.$refs.carPlanDetailList.toData();
                if (!validateData(this.classifyData.subProjectId)) {
                    alertInfo(this, "warning", "请选择项目分支");
                } else {
                    return true;
                }
            },
            submitClassifyForm: function () {
                this.$refs.carPlanDetailList.toData();
                if (this.validateClassify()) {
                    if (this.classifyData.classifiedCarPlanIDS) {
                        this.$confirm(this.classifyData.classifiedCarPlanIDS + "已归类，是否继续归类?", "提示", {
                                cancelButtonText: "取消",
                                confirmButtonText: "确定",
                                type: "warning"
                            })
                            .then(() => {
                                this.submitclassifyData();
                            })
                            .catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "已取消归类",
                                    duration: 1500
                                });
                            });
                    } else {
                        this.submitclassifyData();
                    }
                }
            },
            submitclassifyData: function () {
                var postClassifyData = {
                    user_id: sessionStorage.userid,
                    sub_project_id: this.classifyData.subProjectId,
                    car_day_id_list: this.classifyData.postCarPlanIDS
                };
                this.$http.post("/api/wy_task_add_sub_project", postClassifyData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "外业任务归类成功", () => {
                            this.dialogClassifyVisible = false;
                            this.searchCarPlan();
                            this.$refs.carPlanDetailList.resetSelect();
                        });
                    } else {
                        alertInfo(this, "error", "外业任务归类失败，" + data.msg);
                    }
                });
            },
            SelectClassifyProjects: function (data) {
                if (data) {
                    this.classifyData.projectId = data.project_id;
                    this.classifyData.subProjectId = data.sub_project_id;
                }
            },
            submitTryAllowInForm: function () {
                this.$refs["tryAllowInData"].validate(valid => {
                    if (valid) {
                        this.$confirm("是否确认要触发外业任务重新准入?", "提示", {
                                cancelButtonText: "取消",
                                confirmButtonText: "确定",
                                type: "warning"
                            })
                            .then(() => {
                                this.submitTryAllowInData();
                            })
                            .catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "已取消触发外业任务重新准入",
                                    duration: 1500
                                });
                            });
                    }
                });
            },
            submitTryAllowInData: function () {
                var postTryAllowInData = {
                    user_id: sessionStorage.userid,
                    handle_segment: 2,
                    wy_task_list: this.tryAllowInData.postCarPlanIDS
                };
                this.$http.post("/api/reset_wy_allow_in_status", postTryAllowInData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "外业任务重新准入触发成功", () => {
                            this.dialogTryAllowInVisible = false;
                            this.searchCarPlan();
                        });
                    } else {
                        alertInfo(this, "error", "外业任务重新准入触发失败，" + data.msg);
                    }
                });
            },
            submitDownloadLogForm: function () {
                this.$refs["downloadLogData"].validate(valid => {
                    if (valid) {
                        var postDownloadLogData = {
                            user_id: sessionStorage.userid,
                            sub_project_id: this.downloadLogData.subProjectId,
                            process_segment: 2,
                            wy_task_list: this.downloadLogData.postCarPlanIDS
                        };
                        this.$http.post("/api/generate_log_download_url", postDownloadLogData).then(
                            response => {
                                response = response.body;
                                var data = response.data;
                                if (data.errno === 0) {
                                    alertInfo(this, "success", "已下发log下载命令，" + data.data.tips, () => {
                                        this.dialogDownloadLogVisible = false;
                                        this.searchCarPlan();
                                    });
                                } else {
                                    alertInfo(this, "error", "log下载失败，" + data.msg);
                                }
                            });
                    }
                });
            },
            allowInMark: function () {
                if (validateData(this.allowInMarkData.carPlanIDS)) {
                    let notAllowInCount = 0;
                    for (let val of this.allowInMarkData.postCarPlanIDS) {
                        if (val.handle_status == 6) {
                            notAllowInCount++;
                        }
                    }
                    if (notAllowInCount == this.allowInMarkData.postCarPlanIDS.length) {
                        this.dialogAllowInMarkVisible = true;
                    } else {
                        alertInfo(this, "warning", "只能选择准入不通过的外业任务进行人工通过");
                    }

                } else {
                    alertInfo(this, "warning", "请选择要人工通过的外业任务");
                }
            },
            submitAllowInMarkForm: function () {
                this.$refs["allowInMarkData"].validate(valid => {
                    if (valid) {
                        var queryAllowInMarkData = {
                            user_id: sessionStorage.userid,
                            items_list: this.allowInMarkData.postCarPlanIDS,
                            handle_segment: 2,
                            op_status: this.allowInMarkData.allowInResult,
                            op_remark: trim(this.allowInMarkData.allowInReason)
                        };
                        this.$http.post("/api/modify_wy_valid_status", queryAllowInMarkData).then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                alertInfo(this, "success", "外业任务准入人工通过成功", () => {
                                    this.dialogAllowInMarkVisible = false;
                                    this.searchCarPlan();
                                });
                            } else {
                                alertInfo(this, "error", "外业任务准入人工通过失败" + data.msg);
                            }
                        });
                    }
                });
            },
            returnMark: function () {
                if (validateData(this.returnMarkData.carPlanIDS)) {
                    let allowReturnCount = 0;
                    this.returnMarkData.return_reason = "";
                    for (let val of this.returnMarkData.postCarPlanIDS) {
                        if ((val.handle_status == 6 || val.handle_status == 4) && val.field_qc_status == 4) {
                            allowReturnCount++;
                        }
                    }
                    if (allowReturnCount == this.returnMarkData.postCarPlanIDS.length) {
                        // 选择一个外业的时候，推荐准入不通过原因
                        if (this.returnMarkData.postCarPlanIDS.length == 1) {
                            if (this.returnMarkData.postCarPlanIDS[0].fail_description) {
                                var fail_description = this.returnMarkData.postCarPlanIDS[0].fail_description;
                                if (fail_description.indexOf("http://") !== -1) {
                                    var index = fail_description.indexOf("http://");
                                    this.returnMarkData.return_reason = fail_description.substring(0, index - 2);
                                } else {
                                    this.returnMarkData.return_reason = fail_description;
                                }
                            }
                        }
                        this.dialogReturnVisible = true;
                    } else {
                        alertInfo(this, "warning", "只能选择外业质检状态为合格且准入不通过或准入通过的外业任务打回");
                    }
                } else {
                    alertInfo(this, "warning", "请选择要打回的外业任务");
                }
            },
            submitFormOperation: function (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let returnFlag = false;
                        let fieldPlanId = -1;
                        let fieldPlanNum = 0;
                        for (let item of this.returnMarkData.postCarPlanIDS) {
                            if (item.return_sequence >= 1) {
                                returnFlag = true;
                            }
                            if (item.field_plan_id !== fieldPlanId) {
                                fieldPlanId = item.field_plan_id;
                                fieldPlanNum++;
                            }
                        }
                        if (returnFlag || fieldPlanNum > 1) {
                            this.$confirm("所选任务中存在被打回任务或所选任务不在同一个外业计划，是否要继续?", "提示", {
                                    cancelButtonText: "取消",
                                    confirmButtonText: "确定",
                                    type: "warning"
                                })
                                .then(() => {
                                    this.submitReturnForm();
                                })
                                .catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消打回",
                                        duration: 1500
                                    });
                                });
                        } else {
                            this.submitReturnForm();
                        }
                    } else {
                        return false;
                    }
                });
            },
            submitReturnForm: function () {
                var returnMarkData = {
                    user_id: sessionStorage.userid,
                    car_day_id: this.returnMarkData.carPlanIDS,
                    reason: this.returnMarkData.return_reason,
                    segment: 2,
                    sub_project_id: "",
                    memo: trim(this.returnMarkData.memo)
                };
                this.$http.post("/api/return_field_task", returnMarkData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "外业任务打回成功", () => {
                            this.dialogReturnVisible = false;
                            this.searchCarPlan();
                        });
                    } else {
                        alertInfo(this, "error", "外业任务打回失败" + data.msg);
                    }
                });
            }
        }
    };

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    .el-dropdown {
        vertical-align: top;
    }

    .el-dropdown-menu {
        padding: 0px;
    }

    .center {
        text-align: center;
        border-bottom: 1px solid #ccc;
        min-width: 115px;
    }

    .center-last {
        text-align: center;
        min-width: 115px;
    }

    .carPlan {
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
            min-width: 90px;
            display: inline-block;
        }

        .left-margin-10 {
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
            }

            // span {
            //     float: left;
            //     font-size: 20px;
            //     text-align: left;
            //     line-height: 40px;
            //     font-weight: bold;
            //     margin: 5px 10px 5px 10px;
            // }

            // .span-left {
            //     margin: 5px 0px 5px 0px;
            // }

            // .span-right {
            //     margin: 5px 10px 5px 0px;
            // }

            // .span-totalNumber {
            //     font-size: 38px;
            //     color: #ffd04b;
            //     font-weight: bold;
            //     margin: 5px 10px 5px 10px;
            // }

            .segmenting-line {
                height: 1px;
                width: 95%;
                margin: 0px auto 0px auto;
                background-color: #ccc;
                overflow: hidden;
            }

            .table-div {
                width: 95%;
                margin: 20px auto 0px auto;
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
            margin: -10px 0 5px 120px;
        }

        .tipInfo-1 {
            text-align: left;
            width: 100%;
            margin: -10px 0 0 120px;
        }
    }

</style>
