<template>
    <div class="taskPackageList">
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
                            <el-radio-button label="3000">生产准入</el-radio-button>
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
                            @selectProjects="SelectProjects" :ChangeOnselect="projectChangeOnselect"
                            :isProjectClearable="isProjectClearable" :havedefaultProject="havedefaultProject"
                            :showSelectProject="showSelectProject" :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <!--v_s: 添加项目状态筛选框 -->
                    <select-check @changeEvents="changeEvent" :forArrSelectDiv="forArrSelectDiv">
                    </select-check>
                    <div v-show="search.selectSection == '3000'">
                        <div class="selectDiv">
                            <span class="align-right">准入状态：</span>
                            <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                                <el-option value="12" label="未分配质检员"></el-option>
                                <el-option value="3001" label="准入未开始"></el-option>
                                <el-option value="3002" label="准入中"></el-option>
                                <el-option value="3003" label="准入暂停"></el-option>
                                <el-option value="3004" label="准入通过"></el-option>
                                <el-option value="3005" label="准入不通过"></el-option>
                            </el-select>
                        </div>
                        <div class="selectDiv" v-show="search.selectState == 3004">
                            <span class="align-right">准入结果：</span>
                            <el-checkbox-group style="display:inline" size="medium" v-model="search.selectAllowInPassResult">
                                <el-checkbox label="1" border>A类，无融合问题，预处理效果较好</el-checkbox>
                                <el-checkbox label="2" border>B类，较少融合问题，预处理效果一般</el-checkbox>
                                <el-checkbox label="3" border>C类，较多融合问题，预处理效果差</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="selectDiv" v-show="search.selectState == 3005">
                            <span class="align-right">准入结果：</span>
                            <el-checkbox-group style="display:inline" size="medium" v-model="search.selectAllowInFailResult">
                                <el-checkbox label="1" border>点云分层错位</el-checkbox>
                                <el-checkbox label="2" border>预处理效果差</el-checkbox>
                                <el-checkbox label="3" border>点云图片不清晰</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div v-show="search.selectSection == '30' || search.selectSection == '32' || search.selectSection == '34' || search.selectSection == '36' || search.selectSection == '38'">
                        <div class="selectDiv">
                            <span class="align-right">任务包状态：</span>
                            <el-select filterable size="medium" v-model="search.selectState" clearable placeholder="全部"
                                v-if="search.selectSection == '30'">
                                <template>
                                    <el-option v-for="(item,index) in this.workStatus" :key="index" :value="index"
                                        :label="item" v-if="index < 2000"></el-option>
                                </template>
                            </el-select>
                            <el-select filterable size="medium" v-model="search.selectState" clearable placeholder="全部"
                                v-else>
                                <template>
                                    <el-option v-for="(item,index) in this.workStatus" :key="index" :value="index"
                                        :label="item" v-if="index < 3000"></el-option>
                                </template>
                            </el-select>
                        </div>
                        <div class="selectDiv">
                            <span class="align-right">抽检状态：</span>
                            <el-select size="medium" v-model="search.selectRandomSelectState" clearable placeholder="全部">
                                <template>
                                    <el-option v-for="(item,index) in this.randomSelectStatus" :key="index" :value="index"
                                        :label="item"></el-option>
                                </template>
                            </el-select>
                        </div>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">任务包编号：</span>
                        <el-popover placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus"
                            width="400" :content="search.taskPackageID">
                            <el-input class="input-style-1" size="medium" slot="reference" v-model="search.taskPackageID"
                                placeholder="搜索任务包编号" clearable :change="formatTaskPackageIDSearchInput()">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover class="input-style-1" placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件"
                            trigger="focus" width="400" :content="search.tileID">
                            <el-input size="medium" slot="reference" v-model="search.tileID" :change="formatTileIDSearchInput()"
                                clearable placeholder="可搜索多个网格编号">
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
                        <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 任务包列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">任务包列表</span>
                <form action="/api/query_total_op_task_status" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='project_id' v-model="search.selectProjectID">
                    <input type="hidden" name='sub_project_id' v-model="search.selectSubprojectID">
                    <input type="hidden" name='operation_segment' v-model="search.selectSection">
                    <input type="hidden" name='status' v-model="search.selectState">
                    <input type="hidden" name='sampling_status' v-model="search.selectRandomSelectState">
                    <input type="hidden" name='tile_id_list' v-model="search.tileID">
                    <input type="hidden" name='project_status' v-model="search.project_status">
                    <input type="hidden" name='orign_operation_task_id' v-model="search.taskPackageID">
                    <input type="hidden" name='query_or_export_data' value='4'>
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[0]" v-model="search.selectAllowInPassResult[0]">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[1]" v-model="search.selectAllowInPassResult[1]">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[2]" v-model="search.selectAllowInPassResult[2]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[0]"
                        v-model="search.selectAllowInFailResult[0]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[1]"
                        v-model="search.selectAllowInFailResult[1]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[2]"
                        v-model="search.selectAllowInFailResult[2]">
                    <el-button class="left-button" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
                <!-- 这是批量分配按钮 -->
                <el-button class="right-div" size="medium" type="primary" @click="batchAllocation">批量分配</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div" v-if="search.selectSection == '3000'" key="table1">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)"
                    :data="tableData" ref="taskPackageTables" border style="width: 100%" @select="taskPackageSelectionChange"
                    @select-all="taskPackageSelectionChange" @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="orign_operation_task_id" label="任务包编号" show-overflow-tooltip
                        sortable="custom" width="120"></el-table-column>
                    <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="show_operation_segment" label="环节" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_status" label="准入状态" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_result" label="准入结果" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="show_operator" label="作业员" show-overflow-tooltip width="170"></el-table-column>
                    <el-table-column prop="show_qc_operator" label="质检员" show-overflow-tooltip width="170"></el-table-column>
                    <el-table-column prop="operation_task_id" label="作业编号" show-overflow-tooltip width="170"></el-table-column>
                    <el-table-column prop="quality_check_task_id" label="质检编号" show-overflow-tooltip width="170"></el-table-column>
                    <el-table-column prop="show_history_max_qc_round" label="历史最大质检轮数" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="start_time" label="准入开始时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="end_time" label="准入结束时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="show_log_data_version" label="准入log版本" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="operation_sequence" label="准入次数" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="tile_number" label="网格数量" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="tile_list" label="任务网格" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <template v-if="accessDisabled">
                                <el-button type="text" size="small" :disabled="scope.row.status == 11 || (scope.row.status == 1 && scope.row.operation_sequence == 1)|| scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 112 || scope.row.status == 113 || scope.row.status == 3001? false:true"
                                    @click.native.prevent="assignTask(scope.$index)">分配</el-button>
                                <el-button type="text" size="small" :disabled="true" @click.native.prevent="moveTile(scope.$index)">拆除</el-button>
                            </template>
                            <template v-else>
                                <el-button type="text" size="small" :disabled="scope.row.status == 11 || (scope.row.status == 1 && scope.row.operation_sequence == 1)|| scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 112 || scope.row.status == 113 || scope.row.status == 3001? false:true"
                                    @click.native.prevent="assignTask(scope.$index)">分配</el-button>
                                <el-button type="text" size="small" :disabled="true" @click.native.prevent="moveTile(scope.$index)">拆除</el-button>
                            </template>
                            <!--<el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="moveTile(scope.$index)">拆除</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-div" v-else key="table2">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)"
                    :data="tableData" ref="taskPackageTables" border style="width: 100%" @select="taskPackageSelectionChange"
                    @select-all="taskPackageSelectionChange" @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="orign_operation_task_id" label="任务包编号" show-overflow-tooltip
                        sortable="custom" width="120"></el-table-column>
                    <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="show_operation_segment" label="环节" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_status" label="任务包状态" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="show_sampling_status" label="抽检状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_operator" label="作业员" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_qc_operator" label="一检员" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_second_qc_operator" label="二检员" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="operation_task_id" label="当前返工/返修作业编号" show-overflow-tooltip width="170"></el-table-column>
                    <el-table-column prop="machine_check_task_id" show-overflow-tooltip label="当前机检编号" width="135"
                        v-if="search.selectSection != '30'"></el-table-column>
                    <el-table-column prop="quality_check_task_id" label="当前质检编号" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_history_max_qc_round" label="历史最大质检轮数" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="tile_number" label="网格数量" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="tile_list" label="任务网格" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="operation_sequence" label="总作业次数" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="start_time" label="开始作业时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="end_time" label="一检通过时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="second_qc_start_time" label="二检开始时间" sortable="custom"
                        show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="second_qc_end_time" label="二检通过时间" sortable="custom"
                        show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="total_hycl_result_number" label="后预处理数据量(km)" show-overflow-tooltip
                        width="150"></el-table-column>
                    <el-table-column prop="total_op_result_number" label="作业数据量(km)" show-overflow-tooltip width="130"></el-table-column>
                    <el-table-column prop="total_jb_mark_number" label="总接边mark数" show-overflow-tooltip width="115"></el-table-column>
                    <el-table-column prop="current_jb_mark_number" label="已完成接边mark数" show-overflow-tooltip width="145"></el-table-column>
                    <el-table-column prop="connect_border_sequence" label="接边次数" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <template v-if="accessDisabled">
                                <el-button type="text" size="small" :disabled="scope.row.status == 11 || (scope.row.status == 1 && scope.row.operation_sequence == 1)|| scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 112 || scope.row.status == 113? false:true"
                                    @click.native.prevent="assignTask(scope.$index)">分配</el-button>
                                <el-button type="text" size="small" :disabled="true" @click.native.prevent="moveTile(scope.$index)">拆除</el-button>
                            </template>
                            <template v-else>
                                <el-button type="text" size="small" :disabled="scope.row.status == 11 || (scope.row.status == 1 && scope.row.operation_sequence == 1)|| scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 112 || scope.row.status == 113? false:true"
                                    @click.native.prevent="assignTask(scope.$index)">分配</el-button>
                                <el-button type="text" size="small" :disabled="scope.row.status == 11 || (scope.row.status == 1 && scope.row.operation_sequence == 1)|| scope.row.status == 2? false:true"
                                    @click.native.prevent="moveTile(scope.$index)">拆除</el-button>
                            </template>
                            <!--<el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="moveTile(scope.$index)">拆除</el-button>-->
                        </template>
                    </el-table-column>
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
        <!--    任务包列表 end-->
        <!--解除任务包网格-->
        <el-dialog title="拆除网格" size="small" :visible.sync="dialogMoveVisible" :close-on-click-modal="false">
            <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入网格ID" v-model="moveTilesData"
                @change="handleMoveTileChange" :titles="['任务包的网格', '要拆除的网格']" :data="tiledata">
                <el-button class="transfer-footer" type="primary" slot="right-footer" size="small" @click="moveMemoInput">拆除</el-button>
            </el-transfer>
        </el-dialog>
        <!--解除任务包网格-->
        <!-- 分配作业任务 begin-->
        <el-dialog title="分配作业员" :visible.sync="dialogOperationAssignVisible" :close-on-click-modal="false" width="40%">
            <el-form label-width="150px">
                <el-form-item label="作业员" required>
                    <el-cascader style="float:left;width:80%" :options="workerOptions" size="medium" filterable
                        :change-on-select="ChangeOnselect" class="left-div" placeholder="选择作业员" @visible-change="operatorVisible"
                        @change="workerChange" :clearable="true" :show-all-levels="false" v-model="assignData.selectWorkerArr"></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAssignOperatorForm()">分配</el-button>
                    <el-button @click="dialogOperationAssignVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 分配作业任务 end-->
        <!-- 分配质检任务 begin-->
        <el-dialog title="分配质检员" :visible.sync="dialogQualityUserAssignVisible" :close-on-click-modal="false" width="40%">
            <el-form label-width="150px" class="demo-dynamic">
                <el-form-item label="质检员" required>
                    <el-cascader style="float:left;width:80%" :options="QualityUserOptions" filterable size="medium"
                        :change-on-select="ChangeOnselect" class="left-div" placeholder="选择质检员" @visible-change="QualityOperatorVisible"
                        @change="QualityUserChange" :clearable="true" v-model="assignData.selectQCWorkerArr" :show-all-levels="false"></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAssignQualityUserForm()">分配</el-button>
                    <el-button @click="dialogQualityUserAssignVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="批量分配任务包" :visible.sync="dialogAssignVisible" :close-on-click-modal="false">
            <el-form label-width="120px" :model="assignData" ref="assignData" class="demo-dynamic">
                <el-form-item label="任务包列表" prop="selectSubProjectList" :rules="[{ required: true, message: '请选择要生分配务包的网格ID', trigger: 'blur'}]">
                    <el-input disabled v-model="assignData.selectSubProjectList" placeholder="请选择要生成任务包的网格" type="textarea"
                        :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <el-form-item label="提示：">
                    <p class="TipsNum">已选择<b>{{selectNumber}}</b>条记录</p>
                </el-form-item>
                <el-form-item label="作业员" prop="selectWorkerArr" v-if="this.batchAllocationDatas.operatorData.length!=0"
                    required>
                    <el-cascader style="float:left;width:80%" :options="workerOptions" size="medium" filterable
                        :change-on-select="ChangeOnselect" class="left-div" placeholder="选择作业员" @visible-change="operatorVisible"
                        @change="workerChange" :clearable="true" v-model="assignData.selectWorkerArr" :show-all-levels="false"></el-cascader>
                </el-form-item>
                <el-form-item label="质检员" prop="selectQCWorkerArr" v-if="this.batchAllocationDatas.operatorData.length==0"
                    required>
                    <el-cascader style="float:left;width:80%" :options="QualityUserOptions" filterable size="medium"
                        :change-on-select="ChangeOnselect" class="left-div" placeholder="选择质检员" @visible-change="QualityOperatorVisible"
                        @change="QualityUserChange" :clearable="true" v-model="assignData.selectQCWorkerArr"></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAssigForm()">分配</el-button>
                    <el-button @click="dialogAssignVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import {
        trim,
        alertInfo,
        inputCheck,
        showDataSet,
        validateData,
        resize,
        parentSonPassVal, // v_s: 这个方法是遍历data数据的方法
        reQpassVal // 遍历数组给请求赋值方法
    } from '@/utils/daqian_tools'
    import {
        setTimeout
    } from 'timers';
    import Vue from 'vue';
    import selectProject from '@/components/daqian_selectProject.vue'
    import selectCheck from "@/components/daqian_selectCheck.vue"
    export default {
        components: {
            selectProject,
            selectCheck
        },
        data() {
            return {
                onSubjectStatus: 0,
                forArrSelectDiv: [{ // v_s:这个是daqian_selectCheck.vue组件下拉菜单的数据结构
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
                batchAllocationDatas: {
                    operatorData: [],
                    InspectorData: [],
                    TwoInspectorsData: [],
                    allDatas: []
                },
                assignData: {
                    selectQualityUser: '',
                    selectSubProjectList: '',
                    user_id: -1,
                    tileIDS: '',
                    tileLevel: 0,
                    dataNumber: 0,
                    postTileS: [],
                    selectTaskType: '30',
                    selectWorker: '',
                    subProjectID: 0,
                    selectWorkerArr: [],
                    selectQCWorkerArr: [],
                },
                sub_project_id: 0,
                nowSelectSubprojectID: 0,
                dialogAssignVisible: false,
                formHeight: this.global.formHeight,
                collapseFlag: false,
                search: {
                    userId: sessionStorage.userid,
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    selectSection: '3000',
                    selectState: '',
                    selectAllowInPassResult: [],
                    selectAllowInFailResult: [],
                    tileID: '',
                    taskPackageID: '',
                    selectRandomSelectState: '',
                    sort_field_name: 'orign_operation_task_id desc',
                    project_status: ""
                },
                searchDatas: {},
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                taskPackageTable: [],
                multiplePackageSelection: [],
                assignData: {
                    postTileS: [],
                    selectWorker: '',
                    tileLevel: 0,
                    selectQualityUser: ''
                },
                selectTaskPackage: [],
                tiledata: [],
                moveTilesData: [],
                dialogMoveVisible: false,
                postMoveTile: [],
                wholeTileData: [],
                dialogOperationAssignVisible: false,
                workerOptions: [],
                selectWorkInfo: [],
                dialogQualityUserAssignVisible: false,
                QualityUserOptions: [],
                accessDisabled: false,
                ChangeOnselect: false,
                projectChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                workStatus: {
                    '1': '作业未开始',
                    '2': '作业中',
                    '3': '一检返工作业中',
                    '4': '一检返修作业中',
                    '5': '一检质检中',
                    '6': '一检返工质检中',
                    '7': '一检返修质检中',
                    '8': '一检通过',
                    '11': '未分配作业员',
                    '12': '未分配一检员',
                    '13': '一检质检未开始',
                    '14': '作业暂停',
                    '15': '一检返工作业暂停',
                    '16': '一检返修作业暂停',
                    '17': '一检质检暂停',
                    '18': '一检返工质检暂停',
                    '19': '一检返修质检暂停',
                    '20': '一检返工作业未开始',
                    '21': '一检返修作业未开始',
                    '103': '二检返工作业中',
                    '104': '二检返修作业中',
                    '105': '二检质检中',
                    '106': '二检返工质检中',
                    '107': '二检返修质检中',
                    '108': '二检通过',
                    '110': '未生成二检任务',
                    '112': '未分配二检员',
                    '113': '二检质检未开始',
                    '115': '二检返工作业暂停',
                    '116': '二检返修作业暂停',
                    '117': '二检质检暂停',
                    '118': '二检返工质检暂停',
                    '119': '二检返修质检暂停',
                    '120': '二检返工作业未开始',
                    '121': '二检返修作业未开始',
                    '2002': '机检排队中',
                    '2003': '机检处理中',
                    '2004': '机检完成',
                    '2005': '机检失败',
                    '3001': '准入未开始',
                    '3002': '准入中',
                    '3003': '准入暂停',
                    '3004': '准入通过',
                    '3005': '准入不通过'
                },
                randomSelectStatus: {
                    '1': '待抽检',
                    '2': '抽中',
                    '3': '未抽中'
                },
                loading: true,
                emptyText: '查询中',
                selectAllFlag: false,
                selectNumber: 0, // 现在是两个用途一个是现实以选中的条数；另一个是在批量分配任务时判断选中的网格数量是否是同一个状态
                allTableData: []
            }
        },
        updated() {
            this.$refs.taskPackageTables.clearSelection();
            var tmpSelectData = this.multiplePackageSelection[this.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let i in this.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.tableData[i])) {
                            this.$refs.taskPackageTables.toggleRowSelection(this.tableData[i]);
                        }
                    }
                }
                this.multiplePackageSelection[this.filter.currentPage - 1] = arr;
            }
        },
        computed: {
            tableData: function () {
                if (this.taskPackageTable) {
                    for (var val of this.taskPackageTable) {
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_operator = showDataSet(val.operator_id, val.operator_name);
                        val.show_qc_operator = showDataSet(val.qc_operator_id, val.qc_operator_name);
                        val.show_second_qc_operator = showDataSet(val.second_qc_operator_id, val.second_qc_operator_name);
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
                        if (val.operation_segment === "3000") {
                            val.show_operation_segment = "生产准入";
                        } else if (val.operation_segment === "30") {
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

                        if (val.status === "12" && this.search.selectSection === "3000") {
                            val.show_status = "未分配质检员";
                        } else {
                            val.show_status = this.workStatus[val.status];
                        }
                        val.show_sampling_status = this.randomSelectStatus[val.sampling_status];
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
                        if (val.status === "3004") {
                            val.show_result = val.admittance_level;
                        } else if (val.status === "3005") {
                            val.show_result = val.admittance_reason;
                        }
                    }
                    return this.taskPackageTable;
                }
            }
        },
        created() {
            if (sessionStorage.userrole == 4) {
                this.accessDisabled = true;
            }
            if (sessionStorage.selectSectionWork) {
                this.search.selectSection = sessionStorage.selectSectionWork;
            }
            if (sessionStorage.tileID) {
                this.search.tileID = sessionStorage.tileID;
            }
        },
        mounted() {
            this.$nextTick(function () {
                resize()
            })
            this.operationUser();
        },
        methods: {
            changeEvent: function (val) {
                // v_s: 方法参数 1、要遍历的数组2、要赋值的对象名称3、要赋的值4、赋值的方向（子传父，父传子）
                parentSonPassVal(this.forArrSelectDiv, '项目状态', val, 'son_parent')
            },
            batchAllocation: function () {
                if(this.onSubjectStatus == 4) {
                    return alertInfo(this, "error", "完结的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 5) {
                    return alertInfo(this, "error", "作废的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 6) {
                    return alertInfo(this, "error", "暂停的项目不支持生成任务包");
                }
                if (!validateData(this.nowSelectSubprojectID)) {
                    alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                    return;
                }
                if (this.selectNumber === 0) {
                    alertInfo(this, "warning", "请先选择状态为未分配作业员或未分配一检员或未分配二检员任务");
                    return;
                }
                this.batchAllocationDatas.operatorData = []; //批量分配作业员传的任务包编号
                this.batchAllocationDatas.InspectorData = []; //批量分配质检员传的质检编号
                this.batchAllocationDatas.allDatas = [];
                // this.assignData.selectWorker = '';
                // this.assignData.selectQualityUser = '';
                // this.assignData.selectWorkerArr = [];
                // this.assignData.selectQCWorkerArr = [];
                this.assignData.selectSubProjectList = '';
                for (let item of this.multiplePackageSelection) {
                    for (let i in item) {
                        if (sessionStorage.userrole == 4 && item[i].status == 11) { //质检组长
                            alertInfo(this, 'warning', '您没有权限分配作业员');
                            return
                        }
                        if (sessionStorage.userrole == 2 && (item[i].status == 12 || item[i].status == 112)) { //作业组长
                            alertInfo(this, 'warning', '您没有权限分配质检员');
                            return
                        }
                        if (item[i].status == 11) {
                            this.batchAllocationDatas.operatorData.push(item[i].orign_operation_task_id);
                        } else if (item[i].status == 12 || item[i].status == 112) {
                            this.batchAllocationDatas.InspectorData.push(item[i].quality_check_task_id)
                        } else {
                            alertInfo(this, "warning", "所选任务包状态需全部为未分配作业员或未分配一检员或未分配二检员任务，请重新选择");
                            return;
                        }
                        this.batchAllocationDatas.allDatas.push(item[i])
                        this.assignData.selectSubProjectList += item[i].orign_operation_task_id + ';'
                    }
                }
                this.dialogAssignVisible = true;
            },
            //批量分配任务包
            submitAssigForm: function () {
                if (this.batchAllocationDatas.operatorData.length == this.selectNumber) { //判断是质检员分配还是操作员分配
                    this.submitAssignOperatorForm()
                } else {
                    this.submitAssignQualityUserForm()
                }
            },
            //查询输入框格式校验
            formatTileIDSearchInput: function () {
                this.search.tileID = inputCheck(this, this.search.tileID, 1);
                // 用于保存内业管理各个页面的网格编号
                sessionStorage.tileID = this.search.tileID;
            },
            formatTaskPackageIDSearchInput: function () {
                this.search.taskPackageID = inputCheck(this, this.search.taskPackageID, 1);
            },
            //任务包列表查询
            searchPackageTable: function (arg) {
                this.emptyText = "查询中";
                this.nowSelectSubprojectID = this.search.selectSubprojectID;
                var query_taskpackagedata = {
                    project_status: reQpassVal(this.forArrSelectDiv, '项目状态'), // 项目状态
                    user_id: sessionStorage.userid,
                    orign_operation_task_id: trim(this.search.taskPackageID),
                    operation_segment: this.search.selectSection,
                    operation_sequence: 0,
                    status: this.search.selectState,
                    query_start_time: "",
                    query_end_time: "",
                    project_id: this.search.selectProjectID,
                    sub_project_id: this.search.selectSubprojectID,
                    sampling_status: this.search.selectRandomSelectState,
                    tile_id_list: this.search.tileID,
                    city_name: "",
                    query_or_export_data: 0,
                    sort_field_name: this.search.sort_field_name,
                    admittance_level: this.search.selectAllowInPassResult,
                    admittance_reason: this.search.selectAllowInFailResult,
                    page_size: this.filter.perPage,
                    page_index: this.filter.currentPage,
                    return_all: arg && arg.return_all ? arg.return_all : 2
                };
                this.onSubjectStatus = reQpassVal(this.forArrSelectDiv, '项目状态');
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.taskPackageTable = [];
                        this.totalNumber = 0;
                        this.searchDatas = query_taskpackagedata;
                    }
                    this.filter.currentPage = 1;
                    this.multiplePackageSelection = [];
                    this.loading = true;
                }
                this.search.project_status = this.forArrSelectDiv[0].objectType; // v_s:给导出按钮执行赋值状态数据
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_index = this.filter.currentPage;
                this.searchDatas.page_size = this.filter.perPage;
                this.$http.post("/api/query_total_op_task_status", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.taskPackageTable = data.data.operation_task_status_info;
                                this.totalNumber = Number(data.data.total_number);
                                if (arg && arg.return_all) {
                                    var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                    for (var i = 0; i < pagesNumber; i++) {
                                        this.multiplePackageSelection[i] = data.data.operation_task_status_info
                                            .slice(
                                                i * this.filter.perPage,
                                                (i + 1) * this.filter.perPage
                                            );
                                    }
                                    this.allTableData = Object.assign(
                                        [],
                                        this.allTableData,
                                        this.multiplePackageSelection
                                    );
                                    if (this.allTableData.length > 0) {
                                        this.taskPackageTable = this.allTableData[0];
                                    }
                                    this.$refs.taskPackageTables.clearSelection();
                                    this.tableData.forEach(row => {
                                        this.$refs.taskPackageTables.toggleRowSelection(row);
                                    });

                                    this.getSelectDatas();
                                } else {
                                    this.taskPackageTable = data.data.operation_task_status_info;
                                }
                                if (this.totalNumber == 0) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.emptyText = "加载中";
                                }
                            }
                        } else {
                            this.taskPackageTable = [];
                            this.emptyText = "查询失败";
                        }
                    },
                    response => {
                        // 响应错误回调
                        this.taskPackageTable = [];
                        this.loading = false;
                        this.emptyText = "查询失败";
                    }
                );
            },
            onSearch: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.searchPackageTable(event);
            },
            onRefresh: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.search.selectState = "";
                this.search.selectRandomSelectState = "";
                this.search.taskPackageID = "";
                this.$refs.taskPackageTables.clearSort();
                this.search.sort_field_name = "orign_operation_task_id desc";
                if (event !== "sectionChange") {
                    // v_s: 方法参数 1、要遍历的数组2、要赋值的对象名称3、要赋的值4、赋值的方向（子传父，父传子）
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
                    this.searchPackageTable();
                }
            },
            selectSectionChange: function () {
                sessionStorage.selectSectionWork = this.search.selectSection;
                this.onRefresh("sectionChange");
            },
            sortTable: function (val) {
                if (val.order === "descending") {
                    this.search.sort_field_name = val.prop + " desc";
                } else if (val.order === "ascending") {
                    this.search.sort_field_name = val.prop + " asc";
                } else {
                    this.search.sort_field_name = "orign_operation_task_id desc";
                }
                this.onSearch();
            },
            pageSizeChange: function (val) {
                this.multiplePackageSelection = [];
                this.filter.perPage = val;
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
                if (this.allTableData.length > 0) {
                    if (this.allTableData.length > 0) {
                        this.taskPackageTable = this.allTableData[val - 1];
                        return;
                    }
                }
                this.searchPackageTable({
                    loading: true
                });
            },
            getSelectDatas: function () {
                let num = 0;
                for (let val of this.multiplePackageSelection) {
                    num += val.length;
                }
                this.selectNumber = num;
                this.selectAllFlag = this.selectNumber == this.totalNumber;
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchPackageTable({
                        return_all: 1
                    });
                } else {
                    this.multiplePackageSelection = [];
                    this.$refs.taskPackageTables.clearSelection();
                    this.getSelectDatas();
                }
            },
            taskPackageSelectionChange: function (val) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.filter.currentPage - 1) {
                        this.multiplePackageSelection[this.filter.currentPage - 1] = val;
                    } else {
                        if (typeof this.multiplePackageSelection[i] == "undefined") {
                            this.multiplePackageSelection[i] = [];
                        }
                    }
                }
                this.getSelectDatas();
            },
            assignTask: function (index) { //获取操作员或检验员的信息
                if(this.onSubjectStatus == 4) {
                    return alertInfo(this, "error", "完结的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 5) {
                    return alertInfo(this, "error", "作废的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 6) {
                    return alertInfo(this, "error", "暂停的项目不支持生成任务包");
                }
                this.selectTaskPackage = JSON.parse(JSON.stringify(this.tableData[index]));
                // this.assignData.selectWorker = '';
                // this.assignData.selectQualityUser = '';
                // this.assignData.selectWorkerArr = [];
                // this.assignData.selectQCWorkerArr = [];
                this.sub_project_id = this.selectTaskPackage.sub_project_id;
                if (this.selectTaskPackage.status === '1' || this.selectTaskPackage.status === '11') {
                    if (sessionStorage.userrole == '4') {
                        alertInfo(this, 'warning', '您没有权限分配作业员');
                    } else {
                        this.dialogOperationAssignVisible = true;
                        this.assignData.postTileS = this.selectTaskPackage.tile_list;
                        
                        if (this.selectTaskPackage.tile_list !== null && this.selectTaskPackage.tile_list.length !==
                            0) {
                            this.assignData.tileLevel = this.selectTaskPackage.tile_list[0].tile_level;
                        } else {
                            this.assignData.tileLevel = 0;
                        }
                    }
                } else if (this.selectTaskPackage.status === '12' || this.selectTaskPackage.status === '13' || this
                    .selectTaskPackage.status === '112' || this.selectTaskPackage.status === '113' || this.selectTaskPackage
                    .status === '3001') {
                    if (sessionStorage.userrole == 2) {
                        alertInfo(this, 'warning', '您没有权限分配质检员');
                    } else {

                        this.dialogQualityUserAssignVisible = true;
                    }
                }
            },

            operationUser: function () { // 获取所有操作和检验人员数据
                this.workerOptions = [];
                this.QualityUserOptions = [];
                var queryUserData = {
                    user_return_all: 1  //v_s: 后端接口字段改了
                };
                this.$http.post('/api/query_all_user', queryUserData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        data.data.operation_headman_user_info.forEach((headInfo, index) => {
                            var workerUser = [];
                            headInfo.user_info.forEach((userInfo, index) => {
                                workerUser.push({
                                    label: userInfo.user_name,
                                    value: String(userInfo.user_id),
                                });
                            })
                            this.workerOptions.push({
                                label: headInfo.user_name,
                                value: String(headInfo.user_id),
                                children: workerUser
                            });
                        })
                        data.data.qc_headman_user_info.forEach((headInfo, index) => {
                            var workerUser = [];
                            headInfo.user_info.forEach((userInfo, index) => {
                                workerUser.push({
                                    label: userInfo.user_name,
                                    value: String(userInfo.user_id),
                                });
                            })
                            this.QualityUserOptions.push({
                                label: headInfo.user_name,
                                value: String(headInfo.user_id),
                                children: workerUser
                            });
                        });
                    }
                });
            },
            workerChange: function (val) { // 级联菜单 选择作业员或作业组长时的事件
                this.assignData.selectWorker = [];
                if (val.length === 2) {
                    this.assignData.user_id = val[0];
                    this.assignData.selectWorker = val[1];
                } else if (val.length === 1) {
                    this.assignData.selectWorker = val[0];
                } else {
                    this.assignData.selectWorker = '';
                }
                if (this.assignData.selectWorker) {
                    Vue.set(this.selectWorkInfo, 0, val[0]);
                    Vue.set(this.selectWorkInfo, 1, val[1]);
                } else {
                    this.selectWorkInfo = [];
                }
            },
            operatorVisible: function (val) {
                if (val) {
                    if (this.ChangeOnselect === false) {
                        for (var item of this.workerOptions) {
                            if (!item.children.length) {
                                item.disabled = true;
                            } else {
                                item.disabled = false;
                            }
                        }
                    }
                }
            },
            QualityOperatorVisible: function (val) {
                if (val) {
                    if (this.ChangeOnselect === false) {
                        for (var item of this.QualityUserOptions) {
                            if (!item.children.length) {
                                item.disabled = true;
                            } else {
                                item.disabled = false;
                            }
                        }
                    }
                }
            },
            QualityUserChange: function (val) {
                this.assignData.selectQualityUser = [];
                if (val.length === 2) {
                    this.assignData.selectQualityUser = val[1];
                } else if (val.length === 1) {
                    this.assignData.selectQualityUser = val[0];
                } else {
                    this.assignData.selectQualityUser = '';
                }
            },
            submitAssignOperatorForm: function () {
                let tile_arr = [];
                if (!validateData(this.assignData.selectWorker)) {
                    alertInfo(this, "warning", "请先选择作业员");
                    return
                }
                var postassignData = {
                    user_id: sessionStorage.userid,
                    operator_id: this.assignData.selectWorker,
                    sub_project_id: this.dialogOperationAssignVisible ? this.selectTaskPackage.sub_project_id :
                        this
                        .search.selectSubprojectID,
                    operation_task_id: this.dialogOperationAssignVisible ? [this.selectTaskPackage.orign_operation_task_id] :
                        this.batchAllocationDatas.operatorData,
                    operation_segment: this.search.selectSection,
                };
                this.$http.post("/api/operation_task_assign", postassignData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "作业任务分配成功" +
                            "，作业员ID：" + data.data.operator_id, () => {
                                this.dialogAssignVisible = false;
                                this.dialogOperationAssignVisible = false;
                                this.onSearch();
                            }
                        );
                    } else {
                        alertInfo(this, "error", "分配作业任务失败，" + data.msg);
                    }
                })
            },
            submitAssignQualityUserForm: function () {
                if(this.onSubjectStatus == 4) {
                    return alertInfo(this, "error", "完结的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 5) {
                    return alertInfo(this, "error", "作废的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 6) {
                    return alertInfo(this, "error", "暂停的项目不支持生成任务包");
                }
                if (!validateData(this.assignData.selectQualityUser)) {
                    alertInfo(this, "warning", "请先选择质检员");
                    return
                }
                var postassignData = {
                    user_id: sessionStorage.userid,
                    sub_project_id: this.sub_project_id,
                    qc_operator_id: this.assignData.selectQualityUser,
                    quality_check_task_id: this.dialogAssignVisible ? this.batchAllocationDatas.InspectorData : [ this.selectTaskPackage.quality_check_task_id ]
                };
                this.$http.post("/api/quality_check_task_assign", postassignData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(
                            this,
                            "success",
                            "质检任务分配成功，质检员ID：" +
                            data.data.qc_operator_id,
                            () => {
                                this.dialogAssignVisible = false; // 调用关闭批量分配任务包的变量
                                this.dialogQualityUserAssignVisible = false;
                                this.onSearch(); // 刷新页面的方法
                            }
                        );
                    } else {
                        alertInfo(this, "error", "分配质检任务失败，" + data.msg);
                    }
                });
            },
            moveTile: function (index) {
                if(this.onSubjectStatus == 4) {
                    return alertInfo(this, "error", "完结的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 5) {
                    return alertInfo(this, "error", "作废的项目不支持生成任务包");
                }
                if(this.onSubjectStatus == 6) {
                    return alertInfo(this, "error", "暂停的项目不支持生成任务包");
                }
                this.selectTaskPackage = JSON.parse(JSON.stringify(this.tableData[index]));
                this.tiledata = [];
                this.moveTilesData = [];
                if (!validateData(this.selectTaskPackage.tile_list)) {
                    alertInfo(this, "warning", "暂无网格拆除");
                    return;
                }
                this.wholeTileData = this.selectTaskPackage.tile_list.split(" ");
                this.wholeTileData.forEach((tile, index) => {
                    this.tiledata.push({
                        label: tile,
                        key: tile
                    });
                });
                this.dialogMoveVisible = true;
            },
            handleMoveTileChange: function (value, direction, movedKeys) {
                this.moveTilesData = value;
            },
            moveMemoInput: function () {
                if (this.moveTilesData.length) {
                    this.$prompt("请输入拆除原因", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            inputPattern: /\S/,
                            inputErrorMessage: '拆除原因不能为空'
                        })
                        .then(({
                            value
                        }) => {
                            var query_tilemove = {
                                user_id: sessionStorage.userid,
                                operation_task_id: this.selectTaskPackage.orign_operation_task_id,
                                sub_project_id: this.selectTaskPackage.sub_project_id,
                                remove_tile_list: this.moveTilesData.join(" "),
                                remove_reason: value
                            };
                            this.$http.post("/api/operation_task_tile_remove", query_tilemove).then(response => {
                                response = response.body;
                                var data = response.data;
                                if (data.errno === 0) {
                                    alertInfo(this, "success", "任务包网格解除成功", () => {
                                        this.dialogMoveVisible = false;
                                        this.searchPackageTable();
                                    });
                                } else {
                                    alertInfo(this, "error", "任务包网格解除失败，" + data.msg);
                                }
                            });
                        })
                        .catch(() => {});
                }
            },
            filterMethod: function (query, item) {
                return item.key.indexOf(query) > -1;
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
                    this.searchPackageTable();
                }
            },
            updateProjectStatus: function (data) {
                this.resetselectProjectData = false;
            }
        }
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    .TipsNum {
        text-align: left;
    }

    .taskPackageList {
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
            min-width: 50px;
            margin-left: 20px;
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
            width: 300px;
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

    .moveTile .el-transfer-panel__list {
        float: left;
    }

    .el-transfer-panel__item .el-checkbox__input {
        text-indent: -60px;
    }

</style>
