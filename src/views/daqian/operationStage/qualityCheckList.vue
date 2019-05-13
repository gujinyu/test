<template>
    <div class="qualityCheckList">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv" @change="selectSectionChange">
                        <!--<span class="align-right">环节：</span>
                        <el-select size="medium" v-model="search.selectSection" show-overflow-tooltip clearable placeholder="全部">
                            <el-option value="31" label="基础要素质检"></el-option>
                            <el-option value="33" label="基础要素接边质检"></el-option>
                            <el-option value="35" label="高阶要素作业质检"></el-option>
                            <el-option value="37" label="高阶要素接边质检"></el-option>
                            <el-option value="39" label="城市接边质检"></el-option>
                        </el-select> -->
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium">
                            <!-- <el-radio-button label="">不限</el-radio-button> -->
                            <el-radio-button label="3001">生产准入</el-radio-button>
                            <el-radio-button label="31">基础要素作业质检</el-radio-button>
                            <el-radio-button label="33">基础要素接边质检</el-radio-button>
                            <el-radio-button label="35">高阶要素作业质检</el-radio-button>
                            <el-radio-button label="37">高阶要素接边质检</el-radio-button>
                            <el-radio-button label="39">回库接边</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">所属项目：</span>
                        <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus"
                            @selectProjects="SelectProjects" :ChangeOnselect="ChangeOnselect" :isProjectClearable="isProjectClearable"
                            :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject"
                            :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <!--v_s: 添加项目状态筛选框 -->
                    <select-check @changeEvents="changeEvent" :forArrSelectDiv="forArrSelectDiv">
                    </select-check>
                    <div v-show="search.selectSection == '3001'">
                        <div class="selectDiv">
                            <span class="align-right">准入状态：</span>
                            <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                                <el-option value="1" label="未分配质检员"></el-option>
                                <el-option value="2" label="准入未开始"></el-option>
                                <el-option value="3" label="准入中"></el-option>
                                <el-option value="5" label="准入暂停"></el-option>
                                <el-option value="4" label="准入通过"></el-option>
                                <el-option value="6" label="准入不通过"></el-option>
                            </el-select>
                        </div>
                        <div class="selectDiv" v-show="search.selectState == 4">
                            <span class="align-right">准入结果：</span>
                            <el-checkbox-group style="display:inline" size="medium" v-model="search.selectAllowInPassResult">
                                <el-checkbox label="1" border>A类，无融合问题，预处理效果较好</el-checkbox>
                                <el-checkbox label="2" border>B类，较少融合问题，预处理效果一般</el-checkbox>
                                <el-checkbox label="3" border>C类，较多融合问题，预处理效果差</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="selectDiv" v-show="search.selectState == 6">
                            <span class="align-right">准入结果：</span>
                            <el-checkbox-group style="display:inline" size="medium" v-model="search.selectAllowInFailResult">
                                <el-checkbox label="1" border>点云分层错位</el-checkbox>
                                <el-checkbox label="2" border>预处理效果差</el-checkbox>
                                <el-checkbox label="3" border>点云图片不清晰</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection !== '3001'">
                        <span class="align-right">质检轮数：</span>
                        <el-select size="medium" v-model="search.qualityNumber" clearable placeholder="全部">
                            <el-option value="1" label="一检"></el-option>
                            <el-option value="2" label="二检"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection !== '3001'">
                        <span class="align-right">质检类型：</span>
                        <el-select size="medium" v-model="search.selectTaskType" clearable placeholder="全部">
                            <el-option value="1" label="原始作业质检"></el-option>
                            <el-option value="2" label="返工作业质检"></el-option>
                            <el-option value="3" label="返修作业质检"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection !== '3001'">
                        <span class="align-right">质检状态：</span>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                            <el-option value="1" label="未分配"></el-option>
                            <el-option value="2" label="未开始质检"></el-option>
                            <el-option value="3" label="质检中"></el-option>
                            <el-option value="4" label="完成质检"></el-option>
                            <el-option value="5" label="暂停质检"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection !== '3001'">
                        <span class="align-right">质检结果：</span>
                        <el-select size="medium" v-model="search.selectResult" clearable placeholder="全部">
                            <el-option value="1" label="通过"></el-option>
                            <el-option value="2" label="返工"></el-option>
                            <el-option value="3" label="返修"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">质检任务编号：</span>
                        <el-popover placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus"
                            width="320" :content="search.taskID">
                            <el-input class="input-style-1" size="medium" slot="reference" v-model="search.taskID"
                                placeholder="可搜索多个质检任务编号" clearable :change="formatTaskIDSearchInput()">
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
                        <!-- <el-button size="medium" type="primary" v-on:click="onSearch">筛选</el-button>
                        <el-button size="medium" type="primary" v-on:click="onRefresh">刷新</el-button> -->
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
                <span class="titlespan">质检任务列表</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">个人工质检任务</span> -->
                <el-button class="left-button" size="medium" type="primary" plain @click="exportDatas()" v-show="search.selectSection !== '3001'">统计数据下载</el-button>
                <form action="/api/query_total_qc_task_status" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='project_id' v-model="search.selectProjectID">
                    <input type="hidden" name='sub_project_id' v-model="search.selectSubprojectID">
                    <input type="hidden" name='quality_check_segment' v-model="search.selectSection">
                    <input type="hidden" name='quality_check_result' v-model="search.selectResult">
                    <input type="hidden" name='quality_check_round' v-model="search.qualityNumber">
                    <input type="hidden" name='quality_check_sequence' value="0">
                    <input type="hidden" name='quality_check_task_list' v-model="search.taskID">
                    <input type="hidden" name='quality_check_task_number' v-model="task_list.length">
                    <input type="hidden" name='city_name' value="">
                    <input type="hidden" name='path_name' value='质检任务列表'>
                    <input type="hidden" name='query_start_time' value="">
                    <input type="hidden" name='query_end_time' value="">
                    <input type="hidden" name='status' v-model="search.selectState">
                    <input type="hidden" name='project_status' v-model="search.project_status">
                    <input type="hidden" name='task_type' v-model="search.selectTaskType">
                    <input type="hidden" name='tile_id_list' v-model="search.tileID">
                    <input type="hidden" name='query_or_export_data' value='13'>
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
            <div class="table-div" v-if="search.selectSection == '3001'">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="qualityCheckTasksTable" border style="width: 100%" @select="SelectionChange" @select-all="SelectionChange"
                    @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="quality_check_task_id" show-overflow-tooltip label="质检任务编号" sortable="custom"
                        width="130"></el-table-column>
                    <el-table-column fixed prop="orign_operation_task_id" show-overflow-tooltip label="所属任务包编号" width="120"></el-table-column>
                    <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="所属子项目" width="120"></el-table-column>
                    <el-table-column prop="show_quality_check_segment" show-overflow-tooltip label="环节" width="105"></el-table-column>
                    <el-table-column prop="show_status" label="准入状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_result" label="准入结果" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="log_data_version" label="准入log版本" show-overflow-tooltip min-width="105"></el-table-column>
                    <el-table-column prop="show_quality_check_round" label="质检轮数" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_task_type" label="质检类型" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_history_max_qc_round" label="历史最大质检轮数" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="show_qc_operator" show-overflow-tooltip label="质检员" width="170"></el-table-column>
                    <el-table-column prop="tile_number" label="网格数量" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_tile_list" label="任务网格" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="quality_check_sequence" show-overflow-tooltip label="质检次数" sortable="custom"
                        width="105"></el-table-column>
                    <el-table-column prop="assign_task_time" label="分配任务时间" sortable="custom" show-overflow-tooltip
                        width="180"></el-table-column>
                    <el-table-column prop="start_time" label="准入开始时间" sortable="custom" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="end_time" label="准入结束时间" sortable="custom" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="consume_time" label="耗时(小时)" show-overflow-tooltip width="100"></el-table-column>
                    <!-- <el-table-column prop="data_load_time" label="数据加载时间(小时)" show-overflow-tooltip width="145"></el-table-column>                     -->
                    <!-- <el-table-column prop="machine_quality_check_time" label="机检时间(小时)" show-overflow-tooltip width="120"></el-table-column> -->
                    <!-- <el-table-column prop="machine_quality_check_result_time" label="过机检结果时间(小时)" show-overflow-tooltip width="160"></el-table-column>               -->
                    <!-- <el-table-column prop="human_mark_time" label="人工标记时间(小时)" show-overflow-tooltip width="200"></el-table-column>             -->
                    <!-- <el-table-column prop="machine_quality_check_error_number" label="机检错误数量" show-overflow-tooltip width="105"></el-table-column> -->
                    <!-- <el-table-column prop="human_quality_check_error_number" label="人检错误数量" show-overflow-tooltip width="105"></el-table-column> -->
                    <!-- <el-table-column prop="first_quality_check_error_total_number" label="第一次检查错误总量" show-overflow-tooltip width="150"></el-table-column> -->
                    <!-- <el-table-column prop="machine_quality_check_task_id" show-overflow-tooltip label="关联机检任务编号" width="135" v-if="search.selectSection != '31'"></el-table-column> -->
                    <el-table-column prop="operation_task_id" show-overflow-tooltip label="关联作业任务编号" width="135"></el-table-column>
                    <el-table-column prop="show_operator" show-overflow-tooltip label="作业员" width="170"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                </el-table>
            </div>
            <div class="table-div" v-else>
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="qualityCheckTasksTable" border style="width: 100%" @select="SelectionChange" @select-all="SelectionChange"
                    @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="quality_check_task_id" show-overflow-tooltip label="质检任务编号" sortable="custom"
                        width="130"></el-table-column>
                    <el-table-column fixed prop="orign_operation_task_id" show-overflow-tooltip label="所属任务包编号" width="120"></el-table-column>
                    <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="所属子项目" width="120"></el-table-column>
                    <el-table-column prop="show_quality_check_segment" show-overflow-tooltip label="环节" width="80"></el-table-column>
                    <el-table-column prop="show_quality_check_round" label="质检轮数" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_task_type" label="质检类型" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_status" label="质检状态" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="show_quality_check_result" label="质检结果" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_history_max_qc_round" label="历史最大质检轮数" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="show_qc_operator" show-overflow-tooltip label="质检员" width="105"></el-table-column>
                    <el-table-column prop="tile_number" label="网格数量" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_tile_list" label="任务网格" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="quality_check_sequence" show-overflow-tooltip label="质检次数" sortable="custom"
                        width="105"></el-table-column>
                    <el-table-column prop="assign_task_time" label="分配任务时间" sortable="custom" show-overflow-tooltip
                        width="180"></el-table-column>
                    <el-table-column prop="start_time" label="质检开始时间" sortable="custom" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="end_time" label="质检完成时间" sortable="custom" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="consume_time" label="耗时(小时)" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column prop="data_load_time" label="数据加载时间(小时)" show-overflow-tooltip width="145"></el-table-column>
                    <el-table-column prop="machine_quality_check_time" label="机检时间(小时)" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="machine_quality_check_result_time" label="过机检结果时间(小时)" show-overflow-tooltip
                        width="160"></el-table-column>
                    <el-table-column prop="human_mark_time" label="人工标记时间(小时)" show-overflow-tooltip width="200"></el-table-column>
                    <el-table-column prop="machine_quality_check_error_number" label="机检错误数量" show-overflow-tooltip
                        width="105"></el-table-column>
                    <el-table-column prop="human_quality_check_error_number" label="人检错误数量" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="first_quality_check_error_total_number" label="第一次检查错误总量"
                        show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="machine_quality_check_task_id" show-overflow-tooltip label="关联机检任务编号" width="135"
                        v-if="search.selectSection != '31'"></el-table-column>
                    <el-table-column prop="operation_task_id" show-overflow-tooltip label="关联作业任务编号" width="135"></el-table-column>
                    <el-table-column prop="show_operator" show-overflow-tooltip label="作业员" width="105"></el-table-column>
                    <el-table-column prop="log_data_version" label="质检log版本" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="diff_log_data_version" label="差分log版本" show-overflow-tooltip width="135"></el-table-column>
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
        <!-- 导出质检任务 begin-->
        <el-dialog title="统计数据下载" :visible.sync="dialogExportVisible" :close-on-click-modal="false">
            <el-form label-width="120px" action="/api/qc_data_statistics" enctype='application/json' class="demo-dynamic">
                <el-form-item label="统计类型">
                    <el-select v-model="exportData.statisticsType" style="float: left">
                        <el-option value='1' label="过程质量统计"></el-option>
                        <el-option value='2' label="质检任务数据统计"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质检结果">
                    <el-select v-model="exportData.qualityCheckResult" style="float: left" clearable placeholder="选择质检结果">
                        <el-option value='1' label="通过"></el-option>
                        <el-option value='2' label="返工"></el-option>
                        <el-option value='3' label="返修"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质检次数" v-if="exportData.qualityCheckResult == '2' || exportData.qualityCheckResult == '3'">
                    <el-select style="float: left" v-model="exportData.qualityCheckSequence" clearable placeholder="选择质检次数">
                        <el-option v-for="n in 20" :label="n" :value="n" :key="n"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
                    <el-col :span="10">
                        <el-date-picker format type="date" placeholder="质检统计开始时间" v-model="exportData.startTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="10">
                        <el-date-picker format type="date" placeholder="质检统计结束时间" v-model="exportData.endTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <input type="hidden" name='statistics_type' v-model="exportData.statisticsType">
                    <input type="hidden" name='quality_check_sequence' v-model="exportData.qualityCheckSequence">
                    <input type="hidden" name='quality_check_result' v-model="exportData.qualityCheckResult">
                    <input type="hidden" name='start_time' v-bind:value="transformstartDate(exportData.startTime)">
                    <input type="hidden" name='end_time' v-bind:value="transformEndDate(exportData.endTime)">
                    <el-button type="primary" plain native-type="submit">确定</el-button>
                    <el-button @click="dialogExportVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 分配任务 end-->
        <!-- Log批量下载 begin-->
        <el-dialog title="log批量下载" :visible.sync="dialogDownloadLogVisible" :close-on-click-modal="false">
            <el-form ref="downloadLogData" :model="downloadLogData" label-width="120px" class="demo-dynamic" v-loading="downloadLoading" element-loading-text="拼命下载中">
                <el-form-item label="质检任务列表" required prop="taskIDS" :rules="[{ required: true, message: '请选择要下载log的质检任务', trigger: 'blur'},{ required: true, message: '请选择要下载准入log的质检任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要下载log的质检任务" :autosize="{ minRows: 5, maxRows: 5}"
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
    import selectCheck from "@/components/daqian_selectCheck.vue"
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
                    },
                }],
                formHeight: this.global.formHeight,
                collapseFlag: false,
                search: {
                    userId: sessionStorage.userid,
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    selectSection: "3001",
                    selectState: "",
                    selectResult: "",
                    taskID: "",
                    tileID: "",
                    selectTaskType: "",
                    qualityNumber: "",
                    sort_field_name: "quality_check_task_id desc",
                    selectAllowInPassResult: [],
                    selectAllowInFailResult: [],
                    project_status: ""
                },
                searchDatas: {},
                task_list: [],
                task_list_length: "0",
                nowSelectSubprojectID: 0,
                nowSelectSection: '3001',
                exportData: {
                    statisticsType: "1",
                    qualityCheckResult: "",
                    qualityCheckSequence: "",
                    startTime: "",
                    endTime: ""
                },
                dialogExportVisible: false,
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                qualityCheckTasksTable: [],
                multipleOperatorSelection: [],
                dialogAssignVisible: false,
                ChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                loading: true,
                emptyText: "查询中",
                accessDisabled: false,
                downloadLoading: false, // log下载操作响应等待提示
                downloadLogData: {
                    taskIDS: "",
                    postTaskIDS: [],
                    fileFormat: 'csv',
                    fileType: 'qc'
                },
                dialogDownloadLogVisible: false,
                selectAllFlag: false,
                selectNumber: 0,
                allTableData: []
            };
        },
        updated() {
            this.$refs.qualityCheckTasksTable.clearSelection();
            var tmpSelectData = this.multipleOperatorSelection[this.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let index in this.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.tableData[index])) {
                            this.$refs.qualityCheckTasksTable.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
                this.multipleOperatorSelection[this.filter.currentPage - 1] = arr;
            }
        },
        mounted() {
            this.$nextTick(function () {
                resize()
            })
        },
        computed: {
            tableData: function () {
                if (this.search.selectSection !== "3001") {
                    if (this.qualityCheckTasksTable) {
                        for (var val of this.qualityCheckTasksTable) {
                            if (val) {
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
                                if (val.quality_check_segment === "31") {
                                    val.show_quality_check_segment = "基础要素作业质检";
                                } else if (val.quality_check_segment === "33") {
                                    val.show_quality_check_segment = "基础要素接边质检";
                                } else if (val.quality_check_segment === "35") {
                                    val.show_quality_check_segment = "高阶要素作业质检";
                                } else if (val.quality_check_segment === "37") {
                                    val.show_quality_check_segment = "高阶要素接边质检";
                                } else if (val.quality_check_segment === "39") {
                                    val.show_quality_check_segment = "回库接边";
                                } else if (val.quality_check_segment === "3001") {
                                    val.show_quality_check_segment = "生产准入";
                                }

                                if (val.status === "1") {
                                    val.show_status = "未分配";
                                } else if (val.status === "2") {
                                    val.show_status = "未开始质检";
                                } else if (val.status === "3") {
                                    val.show_status = "质检中";
                                } else if (val.status === "4") {
                                    val.show_status = "完成质检";
                                } else if (val.status === "5") {
                                    val.show_status = "暂停质检";
                                }

                                if (val.quality_check_result === "1") {
                                    val.show_quality_check_result = "通过";
                                } else if (val.quality_check_result === "2") {
                                    val.show_quality_check_result = "返工";
                                } else if (val.quality_check_result === "3") {
                                    val.show_quality_check_result = "返修";
                                }
                                if (val.task_type === "1") {
                                    val.show_task_type = "原始作业质检";
                                } else if (val.task_type === "2") {
                                    val.show_task_type = "返工作业质检";
                                } else if (val.task_type === "3") {
                                    val.show_task_type = "返修作业质检";
                                }
                                if (val.tile_list) {
                                    var tileIDs = "";
                                    for (var tile of val.tile_list) {
                                        if (tileIDs) {
                                            tileIDs = tileIDs + "," + tile.tile_id;
                                        } else {
                                            tileIDs = tile.tile_id;
                                        }
                                    }
                                    val.show_tile_list = tileIDs;
                                }
                                if (val.quality_check_round === "1") {
                                    val.show_quality_check_round = "一检";
                                } else if (val.history_max_qc_round === "2") {
                                    val.show_quality_check_round = "二检";
                                }
                                if (val.history_max_qc_round === "1") {
                                    val.show_history_max_qc_round = "一检";
                                } else if (val.history_max_qc_round === "2") {
                                    val.show_history_max_qc_round = "二检";
                                }
                            }
                        }
                        return JSON.parse(JSON.stringify(this.qualityCheckTasksTable));
                    }
                } else {
                    if (this.qualityCheckTasksTable) {
                        for (var val of this.qualityCheckTasksTable) {
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
                            if (val.quality_check_segment === "3001") {
                                val.show_quality_check_segment = "生产准入";
                            }
                            if (val.status === "1") {
                                val.show_status = "未分配质检员";
                            } else if (val.status === "2") {
                                val.show_status = "准入未开始";
                            } else if (val.status === "3") {
                                val.show_status = "准入中";
                            } else if (val.status === "4") {
                                val.show_status = "准入通过";
                            } else if (val.status === "5") {
                                val.show_status = "准入暂停";
                            } else if (val.status === "6") {
                                val.show_status = "准入不通过";
                            }

                            if (val.task_type === "1") {
                                val.show_task_type = "原始作业质检";
                            } else if (val.task_type === "2") {
                                val.show_task_type = "返工作业质检";
                            } else if (val.task_type === "3") {
                                val.show_task_type = "返修作业质检";
                            }

                            if (val.quality_check_round === "1") {
                                val.show_quality_check_round = "一检";
                            } else if (val.history_max_qc_round === "2") {
                                val.show_quality_check_round = "二检";
                            }
                            if (val.history_max_qc_round === "1") {
                                val.show_history_max_qc_round = "一检";
                            } else if (val.history_max_qc_round === "2") {
                                val.show_history_max_qc_round = "二检";
                            }

                            if (val.tile_list) {
                                var tileIDs = "";
                                for (var tile of val.tile_list) {
                                    if (tileIDs) {
                                        tileIDs = tileIDs + "," + tile.tile_id;
                                    } else {
                                        tileIDs = tile.tile_id;
                                    }
                                }
                                val.show_tile_list = tileIDs;
                            }

                            if (val.admittance_level == "1") {
                                val.show_admittance_level = "A类，无融合问题，预处理效果较好";
                            } else if (val.admittance_level == "2") {
                                val.show_admittance_level = "B类，较少融合问题，预处理效果一般";
                            } else if (val.admittance_level == "3") {
                                val.show_admittance_level = "C类，较多融合问题，预处理效果差";
                            }
                            if (val.admittance_reason) {
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
                            if (val.status === "4") {
                                val.show_result = val.show_admittance_level;
                            } else if (val.status === "6") {
                                val.show_result = val.show_admittance_reason;
                            }
                        }
                        return JSON.parse(JSON.stringify(this.qualityCheckTasksTable));
                    }
                }
            }
        },
        created() {
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
            if (sessionStorage.selectSectionQC) {
                this.search.selectSection = sessionStorage.selectSectionQC;
            }
            if (sessionStorage.tileID && sessionStorage.tileID !== undefined) {
                this.search.tileID = sessionStorage.tileID;
            }
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
            formatTaskIDSearchInput: function () {
                this.search.taskID = inputCheck(this, this.search.taskID, 1);
            },
            searchQualityCheckTasks: function (arg) {
                this.emptyText = "查询中";
                var taskArray = [];
                taskArray = this.search.taskID.split("；");
                var task_list = [];
                for (var val of taskArray) {
                    if (val) {
                        var tmp = {
                            quality_check_task_id: trim(val)
                        };
                        task_list.push(tmp);
                    }
                }
                this.task_list = task_list;
                this.task_list_length = this.task_list.length;
                this.nowSelectSubprojectID = this.search.selectSubprojectID;
                this.nowSelectSection = this.search.selectSection;
                var query_qualityCheckInfo = {
                    project_status: reQpassVal(this.forArrSelectDiv, '项目状态'), // v_s: 项目状态
                    user_id: sessionStorage.userid,
                    quality_check_segment: this.search.selectSection,
                    quality_check_sequence: 0,
                    query_or_export_data: 0,
                    status: this.search.selectState,
                    quality_check_result: this.search.selectResult,
                    query_start_time: "",
                    query_end_time: "",
                    project_id: this.search.selectProjectID,
                    sub_project_id: this.search.selectSubprojectID,
                    city_name: "",
                    quality_check_task_number: task_list.length,
                    quality_check_task_list: this.search.taskID,
                    sort_field_name: this.search.sort_field_name,
                    tile_id_list: this.search.tileID,
                    quality_check_round: this.search.qualityNumber,
                    task_type: this.search.selectTaskType,
                    admittance_level: this.search.selectAllowInPassResult,
                    admittance_reason: this.search.selectAllowInFailResult,
                    page_index: this.filter.currentPage,
                    page_size: this.filter.perPage,
                    return_all: arg && arg.return_all ? arg.return_all : 2
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.qualityCheckTasksTable = [];
                        this.searchDatas = query_qualityCheckInfo;
                    }
                    this.totalNumber = 0;
                    this.filter.currentPage = 1;
                    this.multipleOperatorSelection = [];
                    this.loading = true;
                }
                this.search.project_status = this.forArrSelectDiv[0].objectType; // v_s:给导出按钮执行赋值状态数据
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_index = this.filter.currentPage;
                this.searchDatas.page_size = this.filter.perPage;
                this.$http.post("/api/query_total_qc_task_status", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.qualityCheckTasksTable = [];
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.totalNumber = data.data.total_number;
                                if (arg && arg.return_all) {
                                    var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                    for (var i = 0; i < pagesNumber; i++) {
                                        this.multipleOperatorSelection[i] = data.data.quality_check_task_info.slice(
                                            i * this.filter.perPage,
                                            (i + 1) * this.filter.perPage
                                        );
                                    }
                                    this.allTableData = Object.assign(
                                        [],
                                        this.allTableData,
                                        this.multipleOperatorSelection
                                    );
                                    if (this.allTableData.length > 0) {
                                        this.qualityCheckTasksTable = this.allTableData[0];
                                    }
                                    this.$refs.qualityCheckTasksTable.clearSelection();
                                    this.tableData.forEach(row => {
                                        this.$refs.qualityCheckTasksTable.toggleRowSelection(row);
                                    });
                                    this.getSelectDatas();
                                } else {
                                    this.qualityCheckTasksTable = data.data.quality_check_task_info;
                                }
                                if (this.totalNumber == 0) {
                                    this.qualityCheckTasksTable = [];
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.emptyText = "加载中";
                                }
                            }
                        } else {
                            this.qualityCheckTasksTable = [];
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
                this.searchQualityCheckTasks(event);
            },
            onRefresh: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.search.selectState = "";
                this.search.taskID = "";
                this.search.selectResult = "";
                this.search.qualityNumber = "";
                this.search.selectTaskType = "";
                this.$refs.qualityCheckTasksTable.clearSort();
                this.search.sort_field_name = "quality_check_task_id desc";
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
                    this.searchQualityCheckTasks();
                }
            },
            selectSectionChange: function () {
                sessionStorage.selectSectionQC = this.search.selectSection;
                this.onRefresh("sectionChange");
            },
            sortTable: function (val) {
                if (val.order === "descending") {
                    this.search.sort_field_name = val.prop + " desc";
                } else if (val.order === "ascending") {
                    this.search.sort_field_name = val.prop + " asc";
                } else {
                    this.search.sort_field_name = "quality_check_task_id desc";
                }
                this.onSearch();
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
                    if (this.nowSelectSection === '3001') {
                        this.downloadLogData.fileType = 'qc';
                    }
                } else {
                    alertInfo(this, "warning", "请选择要下载log的任务");
                }
            },
            getSelectDatas: function () {
                let taskIDS = "";
                let postTaskIDS = [];
                for (var val of this.multipleOperatorSelection) {
                    if (val) {
                        for (var item of val) {
                            postTaskIDS.push({
                                qc_task_id: item.quality_check_task_id
                            });
                            if (taskIDS) {
                                taskIDS = taskIDS + "," + item.quality_check_task_id;
                            } else {
                                taskIDS = item.quality_check_task_id;
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
                            qc_task_list: this.downloadLogData.postTaskIDS
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
            exportDatas: function () {
                this.dialogExportVisible = true;
                var myDate = new Date();
                this.exportData.startTime = myDate.toLocaleDateString() + " " + "0" + ":" + "0" + ":" + "0";
                this.exportData.endTime = myDate.toLocaleDateString() + " " + "23" + ":" + "59" + ":" + "59";
            },
            transformstartDate: function (date) {
                if (date) {
                    var tmpdate = new Date(date);
                    return (
                        tmpdate.getFullYear() +
                        "-" +
                        (tmpdate.getMonth() + 1) +
                        "-" +
                        tmpdate.getDate() +
                        " " +
                        tmpdate.getHours() +
                        ":" +
                        tmpdate.getMinutes() +
                        ":" +
                        tmpdate.getSeconds()
                    );
                } else {
                    return "";
                }
            },
            transformEndDate: function (date) {
                if (date) {
                    var tmpdate = new Date(date);
                    if (tmpdate.getHours() == 0 && tmpdate.getMinutes() == 0 && tmpdate.getSeconds() == 0) {
                        return (
                            tmpdate.getFullYear() +
                            "-" +
                            (tmpdate.getMonth() + 1) +
                            "-" +
                            tmpdate.getDate() +
                            " " +
                            (tmpdate.getHours() + 23) +
                            ":" +
                            (tmpdate.getMinutes() + 59) +
                            ":" +
                            (tmpdate.getSeconds() + 59)
                        );
                    } else {
                        return (
                            tmpdate.getFullYear() +
                            "-" +
                            (tmpdate.getMonth() + 1) +
                            "-" +
                            tmpdate.getDate() +
                            " " +
                            tmpdate.getHours() +
                            ":" +
                            tmpdate.getMinutes() +
                            ":" +
                            tmpdate.getSeconds()
                        );
                    }
                } else {
                    return "";
                }
            },
            pageSizeChange: function (val) {
                this.multipleOperatorSelection = [];
                this.filter.perPage = val;
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
                if (this.allTableData.length > 0) {
                    this.qualityCheckTasksTable = this.allTableData[val - 1];
                    return;
                }
                this.searchQualityCheckTasks({
                    loading: true
                });
            },
            SelectionChange: function (val) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.filter.currentPage - 1) {
                        this.multipleOperatorSelection[this.filter.currentPage - 1] = val;
                    } else {
                        if (typeof this.multipleOperatorSelection[i] == "undefined") {
                            this.multipleOperatorSelection[i] = [];
                        }
                    }
                }
                this.getSelectDatas();
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchQualityCheckTasks({
                        return_all: 1
                    });
                } else {
                    this.multipleOperatorSelection = [];
                    this.$refs.qualityCheckTasksTable.clearSelection();
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
                    this.searchQualityCheckTasks();
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

    .qualityCheckList {
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
    }

</style>
