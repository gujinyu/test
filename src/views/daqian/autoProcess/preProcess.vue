<template>
    <div class="preProcess">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv">
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium" @change="selectSectionChange">
                            <el-radio-button label="1">前预处理</el-radio-button>
                            <el-radio-button label="2">前预处理准出</el-radio-button>
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
                        <span class="align-right">项目类型：</span>
                        <el-select v-model="search.subProjectProcessType" placeholder="全部" clearable size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.subProjectProcessAllTypes" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">项目状态：</span>
                        <el-select v-model="search.project_status" placeholder="全部" size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.projectStatuDatas" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '1'">
                        <span class="align-right" style="margin-left:20px;">图片识别状态：</span>
                        <el-select v-model="search.imageReconitionState" size="medium" clearable placeholder="全部">
                            <el-option value='1' label="未开始"></el-option>
                            <el-option value='2' label="排队中"></el-option>
                            <el-option value='3' label="处理中"></el-option>
                            <el-option value='4' label="完成"></el-option>
                            <el-option value='5' label="失败"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '1'">
                        <span class="align-right" style="margin-left:20px;">点云拼接+P矩阵状态：</span>
                        <el-select v-model="search.pointCloudPMatrixState" size="medium" clearable placeholder="全部">
                            <el-option value='1' label="未开始"></el-option>
                            <el-option value='2' label="排队中"></el-option>
                            <el-option value='3' label="处理中"></el-option>
                            <el-option value='4' label="完成"></el-option>
                            <el-option value='5' label="失败"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right">准出状态：</span>
                        <el-select size="medium" v-model="search.selectAllowOutState" clearable placeholder="全部">
                            <el-option value="1" label="未开始"></el-option>
                            <el-option value="2" label="排队中"></el-option>
                            <el-option value="3" label="准出中"></el-option>
                            <el-option value="4" label="通过"></el-option>
                            <el-option value="6" label="不通过"></el-option>
                            <el-option value="5" label="失败"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right left-margin-10">准出标记结果：</span>
                        <el-select size="medium" v-model="search.selectAllowOutResult" clearable placeholder="全部">
                            <el-option value="1" label="未标记"></el-option>
                            <el-option value="2" label="通过"></el-option>
                            <el-option value="3" label="作废"></el-option>
                            <el-option value="4" label="替换"></el-option>
                            <el-option value="5" label="删除归类"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right">外业质检状态：</span>
                        <el-select size="medium" v-model="search.field_qc_status" clearable placeholder="全部">
                            <el-option value="1" label="未开始"></el-option>
                            <el-option value="4" label="合格"></el-option>
                            <el-option value="7" label="打回"></el-option>
                            <!-- <el-option value="8" label="复审中"></el-option>  -->
                            <el-option value="6" label="作废"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">源子项目：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.sourceSubProjectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.sourceSubProjectName"
                                clearable placeholder="搜索源子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">源子项目：</span>
                        <el-input class="input-style-1" size="medium" v-model="search.sourceSubProjectName" clearable
                            placeholder="搜索源子项目名称，支持模糊搜索">
                        </el-input>
                    </div> -->

                    <div class="selectDiv">
                        <span class="align-right">外业计划名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.field_plan_name">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.field_plan_name"
                                clearable placeholder="搜索外业计划名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv" v-show="search.selectSection == '2'">
                        <span class="align-right">外业计划名称：</span>
                        <el-input class="input-style-1" size="medium" 
                        v-model="search.field_plan_name" clearable
                            placeholder="搜索外业计划名称，支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">解决方案：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.return_solution">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.return_solution"
                                clearable placeholder="搜索解决方案，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">存储编号：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件"
                            trigger="focus" :content="search.storageID">
                            <el-input size="medium" slot="reference" v-model="search.storageID" :change="formatStorageIDSearchInput()"
                                clearable placeholder="搜索存储编号">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">车天编号：</span>
                        <el-popover class="input-style" placement="bottom" title="仅可输入【数字、字母、下划线、空格、逗号、星号和分号】，其中‘*’匹配任意多个字符，分号或空格分隔多个条件，例如输入 *gc；20170910T154407_GD 会筛选出20170910T154407_GD及所有gc结尾的外业任务。"
                            width="600" trigger="focus">
                            <el-input slot="reference" v-model="search.carPlanId" size="medium" :change="formatSearchInput()"
                                clearable placeholder="搜索车天编号">
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
        <!-- 前预处理状态列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list" v-show="search.selectSection == '1'">
                <span class="titlespan">前预处理</span>
                <el-button class="right-div" type="primary" size="medium" :disabled="accessDisabled" @click="operationCarDayIDs()">前预处理重跑</el-button>
            </div>
            <div class="btn-list" v-show="search.selectSection == '2'">
                <span class="titlespan">前预处理</span>
                <el-dropdown class="right-div">
                    <el-button type="primary" size="medium" :disabled="accessDisabled">
                        更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="center" @click.native="operationCarDayIDs('return')">打回</el-dropdown-item>
                        <el-dropdown-item class="center" @click.native="operationCarDayIDs('mark')">标记</el-dropdown-item>
                        <el-tooltip content="子项目前预处理准出全部通过之后，可进行网格出库" placement="left" effect="light">
                            <el-dropdown-item class="center" @click.native="tileOutLibrary()">网格出库</el-dropdown-item>
                        </el-tooltip>
                        <el-dropdown-item class="center-last" @click.native="operationCarDayIDs('downloadLog')">log批量下载</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button class="right-div" type="primary" size="medium" :disabled="accessDisabled" @click="operationCarDayIDs('allowOut')">人工准出</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div" v-if="search.selectSection == '1'">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="fullPreProcessTable" border style="width: 100%" @sort-change="sortTable" @select="carPlanSelectionChange"
                    @select-all="carPlanSelectionChange">
                    <el-table-column fixed type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="car_day_id" label="车天编号" show-overflow-tooltip sortable="custom" width="180"></el-table-column>
                    <el-table-column fixed prop="storage_task_id" label="存储任务编号" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="show_project_name" label="所属主项目" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                    <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                    <el-table-column prop="show_project_status" show-overflow-tooltip label="项目状态" width="100"></el-table-column>
                    <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目" width="105"></el-table-column>
                    <el-table-column prop="show_image_handle_status" label="图片识别" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_point_handle_status" label="点云拼接+P矩阵" show-overflow-tooltip width="130"></el-table-column>
                    <el-table-column prop="priority_level" label="优先级" show-overflow-tooltip width="65"></el-table-column>
                    <el-table-column prop="image_handle_host_name" label="图片识别处理机器" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="image_start_time" label="图片识别开始时间" show-overflow-tooltip sortable="custom"
                        width="165"></el-table-column>
                    <el-table-column prop="image_end_time" label="图片识别结束时间" show-overflow-tooltip sortable="custom"
                        width="165"></el-table-column>
                    <el-table-column prop="image_memo" label="图片识别备注" show-overflow-tooltip min-width="105"></el-table-column>
                    <el-table-column prop="point_handle_host_name" label="点云拼接处理机器" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="point_start_time" label="点云拼接开始时间" show-overflow-tooltip sortable="custom"
                        width="165"></el-table-column>
                    <el-table-column prop="point_end_time" label="点云拼接结束时间" show-overflow-tooltip sortable="custom"
                        width="165"></el-table-column>
                    <el-table-column prop="tile_number" label="网格数量" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="tile_list" label="网格列表" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="point_memo" label="点云拼接备注" show-overflow-tooltip min-width="105"></el-table-column>
                </el-table>
            </div>
            <div class="table-div" v-else-if="search.selectSection == '2'">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="fullPreProcessTable" border style="width: 100%" @sort-change="sortTable" @select="carPlanSelectionChange"
                    @select-all="carPlanSelectionChange">
                    <el-table-column fixed type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="car_day_id" label="车天编号" show-overflow-tooltip sortable="custom" width="180"></el-table-column>
                    <el-table-column prop="show_field_plan_name" label="所属外业计划" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column fixed prop="storage_task_id" label="存储任务编号" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="show_project_name" label="所属主项目" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                    <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                    <el-table-column prop="show_project_status" show-overflow-tooltip label="项目状态" width="100"></el-table-column>
                    <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目" width="105"></el-table-column>
                    <el-table-column prop="priority_level" label="优先级" show-overflow-tooltip width="65"></el-table-column>
                    <el-table-column prop="show_handle_status" label="准出状态" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="show_field_qc_status" label="外业质检状态" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="show_field_plan_qc_status" label="外业计划质检状态" show-overflow-tooltip min-width="140"></el-table-column>
                    <el-table-column prop="show_field_plan_coverage" label="计划覆盖度" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="total_mileage" label="总里程(km)" show-overflow-tooltip min-width="95"></el-table-column>
                    <el-table-column prop="cover_mileage" label="覆盖里程(km)" show-overflow-tooltip min-width="115"></el-table-column>
                    <el-table-column prop="show_cover_rate" label="覆盖率" show-overflow-tooltip min-width="95"></el-table-column>
                    <el-table-column prop="handle_host_name" label="处理机器" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="start_time" label="准出开始时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                    <el-table-column prop="end_time" label="准出结束时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                    <el-table-column prop="log_version" label="准出log版本" show-overflow-tooltip min-width="105"></el-table-column>
                    <el-table-column prop="log_download_url" label="准出log下载地址" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="show_user" label="人工准出用户" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="show_op_status" label="准出人工标记结果" show-overflow-tooltip min-width="135"></el-table-column>
                    <el-table-column prop="op_date" label="准出标记时间" show-overflow-tooltip sortable="custom" min-width="155"></el-table-column>
                    <el-table-column prop="show_op_user" label="准出标记用户" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="return_sequence" label="打回次数" sortable="custom" show-overflow-tooltip
                        min-width="110"></el-table-column>
                    <el-table-column prop="show_return_user_name" label="打回用户" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column prop="return_time" label="打回时间" sortable="custom" show-overflow-tooltip min-width="155"></el-table-column>
                    <el-table-column prop="return_reason" label="打回原因" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column prop="return_solution" label="解决方案" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="80" v-if="!accessDisabled">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click.native.prevent="downloadBaseMap(scope.$index)">底图下载</el-button>
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
        <!--  前预处理状态列表 end-->
        <!-- 前预处理重跑 begin-->
        <el-dialog title="前预处理重跑" :visible.sync="dialogOperationCarDay" :close-on-click-modal="false">
            <el-form label-width="120px" class="demo-dynamic" :model="operationData" ref="operationData">
                <el-form-item label="外业任务列表" prop="carPlanIDS" :rules="[{ required: true, message: '请选择要重跑的外业任务', trigger: 'blur'},
                        { required: true, message: '请选择要重跑的外业任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要重跑的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="operationData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{operationData.postCarPlanIDS.length}}</b>条记录</p>
                <el-form-item label="选择环节" prop="operationSection" :rules="[{ type: 'array', required: true, message: '请至少选择一个环节', trigger: 'change'}]">
                    <el-checkbox-group style="float: left" v-model="operationData.operationSection">
                        <el-checkbox label='10'>图片识别</el-checkbox>
                        <el-checkbox label='11'>点云拼接+P矩阵</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationCarDay()">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogOperationCarDay = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 前预处理重跑 end-->
        <!--  前预处理准出人工标记 begin-->
        <el-dialog title="前预处理准出人工标记" :visible.sync="dialogAllowOutMarkVisible" :close-on-click-modal="false">
            <el-form ref="allowOutMarkData" :model="allowOutMarkData" label-width="120px" class="demo-dynamic">
                <el-form-item label="外业任务列表" required>
                    <el-input type="textarea" readonly placeholder="请选择要标记的的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="operationData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-2">提示：已选择<b>{{operationData.postCarPlanIDS.length}}</b>个外业任务</p>
                <el-form-item label="标记结果" required>
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="allowOutMarkData.allowOutResult" label="2">通过</el-radio>
                        <el-radio v-model="allowOutMarkData.allowOutResult" label="5">删除归类</el-radio>
                        <!-- <el-radio v-model="allowOutMarkData.allowOutResult" label="4">替换</el-radio> -->
                    </div>
                </el-form-item>
                <el-form-item label="标记原因" prop="allow_out_reason" :rules="[ { required: true, message: '请输入标记原因', trigger: 'blur' }]">
                    <el-input type="textarea" placeholder="请输入标记原因" v-model="allowOutMarkData.allow_out_reason"
                        :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitAllowOutMarkOperation()">确定</el-button>
                    <!--<el-button @click="resetForm('inCarDay')">重置</el-button>-->
                    <el-button @click="dialogAllowOutMarkVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 前预处理准出人工标记 end-->
        <!-- 前预处理准出Log批量下载 begin-->
        <el-dialog title="前预处理准出log批量下载" :visible.sync="dialogDownloadLogVisible" :close-on-click-modal="false">
            <el-form label-width="120px" class="demo-dynamic" :model="operationData" ref="downloadLogData">
                <!--<p class="confirmInfo">请确认要下载准出log的外业任务信息</p>
            <div class="form-table">
                <el-table :data="operationData.showCarPlanInfos" empty-text = "请选择要下载前预处理准出log的外业任务">
                    <el-table-column property="car_day_id" label="车天编号" show-overflow-tooltip min-width="150"></el-table-column>
                    <el-table-column property="storage_task_id" label="存储编号" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column property="sub_project_name" label="所属子项目" show-overflow-tooltip min-width="150"></el-table-column>
                    <el-table-column property="show_handle_status" label="准出状态" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column property="log_version" label="准出log版本" show-overflow-tooltip min-width="105"></el-table-column>
                </el-table>
            </div>-->
                <el-form-item label="外业任务列表" prop="carPlanIDS" :rules="[{ required: true, message: '请选择要下载前预处理准出log的外业任务', trigger: 'blur'},
                { required: true, message: '请选择要下载前预处理准出log的外业任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要下载前预处理准出log的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="operationData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{operationData.postCarPlanIDS.length}}</b>条记录</p>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationForm('downloadLog')">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogDownloadLogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 前预处理准出Log批量下载 end-->
        <!-- 删除归类 begin-->
        <el-dialog title="删除归类" :visible.sync="dialogDelectClassify" :close-on-click-modal="false">
            <el-form label-width="120px" class="demo-dynamic" :model="operationData" ref="deleteClassifyData">
                <el-form-item label="外业任务列表" prop="carPlanIDS" :rules="[{ required: true, message: '请选择要删除归类的外业任务', trigger: 'blur'},
                { required: true, message: '请选择要删除归类的外业任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要删除归类的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="operationData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{operationData.postCarPlanIDS.length}}</b>条记录</p>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationForm('deleteClassify')">确定</el-button>
                    <el-button @click="dialogDelectClassify = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 前预处理人工准出 end-->
        <!-- 前预处理人工准出 begin-->
        <el-dialog title="人工触发前预处理准出" :visible.sync="dialogbatchAllowOut" :close-on-click-modal="false">
            <el-form label-width="120px" class="demo-dynamic" :model="operationData" ref="batchAllowOutData">
                <!--<p class="confirmInfo">请确认要触发准出的外业任务信息</p>
            <div class="form-table">
                <el-table :data="operationData.showCarPlanInfos" empty-text = "请选择要触发前预处理准出的外业任务">
                    <el-table-column property="car_day_id" label="车天编号" show-overflow-tooltip min-width="150"></el-table-column>
                    <el-table-column property="storage_task_id" label="存储编号" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column property="sub_project_name" label="所属子项目" show-overflow-tooltip min-width="150"></el-table-column>
                    <el-table-column property="show_handle_status" label="准出状态" show-overflow-tooltip min-width="80"></el-table-column>
                </el-table>
            </div>-->
                <el-form-item label="外业任务列表" prop="carPlanIDS" :rules="[{ required: true, message: '请选择要触发前预处理准出的外业任务', trigger: 'blur'},
                { required: true, message: '请选择要触发前预处理准出的外业任务', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要触发前预处理准出的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="operationData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{operationData.postCarPlanIDS.length}}</b>条记录</p>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationForm('allowOut')">确定</el-button>
                    <el-button @click="dialogbatchAllowOut = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 前预处理人工准出 end-->
        <!-- 外业任务打回 begin-->
        <el-dialog title="前预处理准出外业任务打回确认" width="600px" :visible.sync="dialogReturnVisible" :close-on-click-modal="false">
            <el-form ref="returnMarkData" :model="returnMarkData" label-width="120px" class="demo-dynamic">
                <el-form-item label="外业任务列表" required>
                    <el-input type="textarea" readonly placeholder="请选择要打回的的外业任务" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="operationData.carPlanIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-2">提示：已选择<b>{{operationData.postCarPlanIDS.length}}</b>个任务打回外业质检环节</p>
                <el-form-item label="关联车天编号" prop="relation_id">
                    <el-input type="textarea" :change="formatRelationIdInput()" placeholder="高程差超过2米的问题，需要填写关联车天编号,车天编号之间用逗号分隔"
                        v-model="returnMarkData.relation_id" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <el-form-item label="打回原因" prop="return_reason">
                    <el-input type="textarea" placeholder="默认是各任务准出不通过原因，请输入原因" v-model="returnMarkData.return_reason"
                        :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="returnMarkData.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationForm('return')">确定</el-button>
                    <el-button @click="dialogReturnVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 外业任务打回 end-->
    </div>
</template>

<script>
    import {
        trim,
        validateData,
        alertInfo,
        inputCheck,
        showDataSet,
        showDescription
    } from "@/utils/daqian_tools";
    import selectProject from "@/components/daqian_selectProject.vue";
    import selectCity from "@/components/daqian_selectCity.vue";
    import router from "@/router";
    export default {
        components: {
            selectProject,
            selectCity
        },
        data() {
            return {
                formHeight: this.global.formHeight,
                collapseFlag: false,
                search: {
                    carPlanId: "",
                    postCarPlanId: "",
                    selectSection: "1",
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    subProjectProcessType: "",
                    sourceSubProjectName: "",
                    selectCity: "",
                    imageReconitionState: "",
                    pointCloudPMatrixState: "",
                    selectAllowOutState: "",
                    selectAllowOutResult: "",
                    storageID: "",
                    field_qc_status: "",
                    field_plan_name: "",
                    return_solution: "",
                    sort_field_name: "car_day_id desc",
                    project_status: "3"
                },
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                PreProcessTable: [],
                fullPreProcessTable: [],
                subProjectAllTypes: {
                    "1": "单任务流程",
                    "2": "多任务流程"
                },
                subProjectProcessAllTypes: {
                    "1": "常规项目",
                    "2": "更新项目",
                    "3": "修复项目",
                    "5": "构网项目"
                },
                projectStatuDatas: {
                    "0": "全部",
                    "3": "进行中",
                    "4": "完结",
                    "5": "作废",
                    "6": "暂停"
                },
                resetselectCityData: false,
                isSearchCityClearable: true,
                ChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                accessDisabled: false,
                dialogOperationCarDay: false,
                operationData: {
                    subProjectId: 0,
                    carPlanIDS: "",
                    showCarPlanInfos: [],
                    postCarPlanIDS: [],
                    operationSection: ["10"]
                },
                dialogbatchAllowOut: false,
                dialogDelectClassify: false,
                dialogDownloadLogVisible: false,
                dialogAllowOutMarkVisible: false,
                dialogReturnVisible: false,
                returnMarkData: {
                    return_reason: "",
                    relation_id: "",
                    memo: ""
                },
                allowOutMarkData: {
                    allowOutResult: "2",
                    allow_out_reason: ""
                },
                priorPage: 1,
                multipleCarPlanSelection: [],
                loading: true,
                emptyText: "查询中",
                allTableData: [],
                selectAllFlag: false,
                selectNumber: 0
            };
        },
        updated() {
            this.$refs.fullPreProcessTable.clearSelection();
            var tmpSelectData = this.multipleCarPlanSelection[this.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let index in this.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.tableData[index])) {
                            this.$refs.fullPreProcessTable.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
                this.multipleCarPlanSelection[this.filter.currentPage - 1] = arr;
            }
        },
        computed: {
            tableData: function () {
                if (this.search.selectSection == "1") {
                    for (var val of this.PreProcessTable) {
                        val.show_project_name = showDataSet(val.project_id, val.project_name);
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_source_sub_project_name = showDataSet(
                            val.source_sub_project_id,
                            val.source_sub_project_name
                        );
                        val.show_sub_project_type = this.subProjectAllTypes[val.sub_project_type];
                        val.show_project_status = this.projectStatuDatas[val.project_status];
                        val.show_sub_project_process_type = this.subProjectProcessAllTypes[val.sub_project_process_type];
                        if (val.handle_detail_info) {
                            val.image_handle_status = val.handle_detail_info[0].handle_status;
                            val.point_handle_status = val.handle_detail_info[1].handle_status;
                            val.image_fail_description = val.handle_detail_info[0].fail_description;
                            val.point_fail_description = val.handle_detail_info[1].fail_description;
                            val.image_handle_host_name = val.handle_detail_info[0].handle_host_name;
                            val.image_start_time = val.handle_detail_info[0].start_time;
                            val.image_end_time = val.handle_detail_info[0].end_time;
                            val.image_memo = val.handle_detail_info[0].memo;
                            val.point_handle_host_name = val.handle_detail_info[1].handle_host_name;
                            val.point_start_time = val.handle_detail_info[1].start_time;
                            val.point_end_time = val.handle_detail_info[1].end_time;
                            val.tile_number = val.handle_detail_info[1].tile_number;
                            val.tile_list = val.handle_detail_info[1].tile_list;
                            val.point_memo = val.handle_detail_info[1].memo;
                            // val.show_flow_version = showDescription('版本',val.handle_detail_info[0].algorithm_series_id,'环境版本详情',val.handle_detail_info[0].algorithm_series_description);
                            // val.show_image_algorithm_version = showDescription('版本',val.handle_detail_info[0].algorithm_version,'算法版本详情',val.handle_detail_info[0].algorithm_version_description);
                            // val.show_point_algorithm_version = showDescription('版本',val.handle_detail_info[1].algorithm_version,'算法版本详情',val.handle_detail_info[1].algorithm_version_description);
                        }
                        if (val.image_handle_status === "1") {
                            val.show_image_handle_status = "未开始";
                        } else if (val.image_handle_status === "2") {
                            val.show_image_handle_status = "排队中";
                        } else if (val.image_handle_status === "3") {
                            val.show_image_handle_status = "处理中";
                        } else if (val.image_handle_status === "4") {
                            val.show_image_handle_status = "完成";
                        } else if (val.image_handle_status === "5") {
                            val.show_image_handle_status = "失败";
                            if (val.image_fail_description) {
                                val.show_image_handle_status = "失败，失败原因：" + val.image_fail_description;
                            } else {
                                val.show_image_handle_status = "失败，失败原因：无";
                            }
                        }
                        if (val.point_handle_status === "1") {
                            val.show_point_handle_status = "未开始";
                        } else if (val.point_handle_status === "2") {
                            val.show_point_handle_status = "排队中";
                        } else if (val.point_handle_status === "3") {
                            val.show_point_handle_status = "处理中";
                        } else if (val.point_handle_status === "4") {
                            val.show_point_handle_status = "完成";
                        } else if (val.point_handle_status === "5") {
                            val.show_point_handle_status = "失败";
                            if (val.point_fail_description) {
                                val.show_point_handle_status = "失败，失败原因：" + val.point_fail_description;
                            } else {
                                val.show_point_handle_status = "失败，失败原因：无";
                            }
                        }
                    }
                } else {
                    for (var val of this.PreProcessTable) {
                        val.show_project_name = showDataSet(val.project_id, val.project_name);
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_user = showDataSet(val.user_id, val.user_name);
                        val.show_op_user = showDataSet(val.op_user_id, val.op_user_name);
                        val.show_source_sub_project_name = showDataSet(
                            val.source_sub_project_id,
                            val.source_sub_project_name
                        );
                        val.show_project_status = this.projectStatuDatas[val.project_status];
                        val.show_sub_project_type = this.subProjectAllTypes[val.sub_project_type];
                        val.show_sub_project_process_type = this.subProjectProcessAllTypes[val.sub_project_process_type];
                        if (val.handle_status === "1") {
                            val.show_handle_status = "未开始";
                        } else if (val.handle_status === "2") {
                            val.show_handle_status = "排队中";
                        } else if (val.handle_status === "3") {
                            val.show_handle_status = "准出中";
                        } else if (val.handle_status === "4") {
                            val.show_handle_status = "通过，原因：" + val.fail_description;
                        } else if (val.handle_status == "5") {
                            if (val.fail_description) {
                                val.show_handle_status = "失败，原因：" + val.fail_description;
                            } else {
                                val.show_handle_status = "失败，原因：无";
                            }
                        } else if (val.handle_status == "6") {
                            if (val.fail_description) {
                                val.show_handle_status = "不通过，原因：" + val.fail_description;
                            } else {
                                val.show_handle_status = "不通过，原因：无";
                            }
                        }
                        if (val.op_status == "1") {
                            val.show_op_status = "未标记";
                        } else if (val.op_status == "2") {
                            if (val.op_remark) {
                                val.show_op_status = "通过，原因：" + val.op_remark;
                            } else {
                                val.show_op_status = "通过，原因：无";
                            }
                        } else if (val.op_status == "3") {
                            if (val.op_remark) {
                                val.show_op_status = "作废，原因：" + val.op_remark;
                            } else {
                                val.show_op_status = "作废，原因：无";
                            }
                        } else if (val.op_status == "4") {
                            if (val.op_remark) {
                                val.show_op_status = "替换，原因：" + val.op_remark;
                            } else {
                                val.show_op_status = "替换，原因：无";
                            }
                        } else if (val.op_status == "5") {
                            if (val.op_remark) {
                                val.show_op_status = "删除归类，原因：" + val.op_remark;
                            } else {
                                val.show_op_status = "删除归类，原因：无";
                            }
                        }
                        if (val.field_qc_status == "1") {
                            val.show_field_qc_status = "未开始";
                        } else if (val.field_qc_status == "4") {
                            val.show_field_qc_status = "合格";
                        } else if (val.field_qc_status == "6") {
                            val.show_field_qc_status = "作废";
                        } else if (val.field_qc_status == "7") {
                            val.show_field_qc_status = "打回";
                        } else if (val.field_qc_status == "8") {
                            val.show_field_qc_status = "复审中";
                        }
                        if (val.field_plan_qc_status == "1") {
                            val.show_field_plan_qc_status = "待审核";
                        } else if (val.field_plan_qc_status == "3") {
                            val.show_field_plan_qc_status = "审核中";
                        } else if (val.field_plan_qc_status == "4") {
                            val.show_field_plan_qc_status = "审核完成";
                        }
                        if (val.field_plan_coverage) {
                            val.show_field_plan_coverage = (val.field_plan_coverage * 100).toFixed(2) + "%";
                        }
                        val.show_return_user_name = showDataSet(val.return_user_id, val.return_user_name);
                        val.show_field_plan_name = showDataSet(val.field_plan_id, val.field_plan_name);

                        if (val.cover_rate) {
                            val.show_cover_rate = (val.cover_rate * 100).toFixed(2) + "%";
                        }
                    }
                }
                return this.PreProcessTable;
            }
        },
        created() {
            if (sessionStorage.carPlanId) {
                this.search.carPlanId = sessionStorage.carPlanId;
                this.search.postCarPlanId = this.search.carPlanId;
            }
            if (this.$route.params.car_day_id) {
                this.havedefaultProject = false;
                this.search.selectSection = "2";
                this.search.carPlanId = this.$route.params.car_day_id;
                this.formatSearchInput();
                this.$route.params.car_day_id = "";
                this.searchPreprocess();
            }
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
        },
        methods: {
            formatStorageIDSearchInput: function () {
                this.search.storageID = inputCheck(this, this.search.storageID, 1);
            },
            formatRelationIdInput: function () {
                this.returnMarkData.relation_id = inputCheck(this, this.returnMarkData.relation_id, 8);
            },
            // 修改为4是因为它的查询条件与inputCheck方法4的一致
            formatSearchInput: function () {
                this.search.carPlanId = inputCheck(this, this.search.carPlanId, 4);
                if (this.search.carPlanId) {
                    this.search.postCarPlanId = this.search.carPlanId;
                } else {
                    this.search.postCarPlanId = "";
                }
                sessionStorage.carPlanId = this.search.postCarPlanId;
            },
            searchPreprocess: function (arg) {
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.PreProcessTable = [];
                        this.totalNumber = 0;
                    }
                    this.filter.currentPage = 1;
                    this.multipleCarPlanSelection = [];
                    this.loading = true;
                }
                this.emptyText = "查询中";
                this.operationData.subProjectId = this.search.selectSubprojectID;
                if (this.search.selectSection == 1) {
                    var query_PreProcessdata = {
                        user_id: sessionStorage.userid,
                        image_recognition_status: this.search.imageReconitionState,
                        dypj_pjz_status: this.search.pointCloudPMatrixState,
                        query_start_time: "",
                        query_end_time: "",
                        project_id: this.search.selectProjectID,
                        sub_project_id: this.search.selectSubprojectID,
                        city_name: this.search.selectCity,
                        sort_field_name: this.search.sort_field_name,
                        storage_task_id_list: this.search.storageID,
                        car_day_id_list: this.search.postCarPlanId.replace(/[*]/g, "%"),
                        sub_project_process_type: this.search.subProjectProcessType,
                        source_sub_project_name: this.search.sourceSubProjectName,
                         project_status: this.search.project_status,
                        page_size: this.filter.perPage,
                        page_index: this.filter.currentPage,
                        return_all: arg && arg.return_all ? arg.return_all : 2
                    };
                    if (!(arg && arg.loading)) {
                        if (!(arg && arg.return_all)) {
                            this.searchDatas = query_PreProcessdata;
                        }
                    }
                    this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2
                    this.searchDatas.page_size = this.filter.perPage;
                    this.searchDatas.page_index = this.filter.currentPage;
                    this.$http.post("/api/query_total_qycl_status", this.searchDatas).then(
                        response => {
                            this.loading = false;
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0 || data.errno === 7) {
                                if (data.errno === 7) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.totalNumber = Number(data.data.total_number);
                                    if (arg && arg.return_all) {
                                        var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                        for (var i = 0; i < pagesNumber; i++) {
                                            this.multipleCarPlanSelection[i] = data.data.qycl_status_info.slice(
                                                i * this.filter.perPage,
                                                (i + 1) * this.filter.perPage
                                            );
                                        }
                                        this.allTableData = Object.assign(
                                            [],
                                            this.allTableData,
                                            this.multipleCarPlanSelection
                                        );
                                        if (this.allTableData.length > 0) {
                                            this.PreProcessTable = this.allTableData[0];
                                        }
                                        this.$refs.fullPreProcessTable.clearSelection();
                                        this.tableData.forEach(row => {
                                            this.$refs.fullPreProcessTable.toggleRowSelection(row);
                                        });
                                        this.getSelectDatas();
                                    } else {
                                        this.PreProcessTable = data.data.qycl_status_info;
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
                } else {
                    var query_PreProcessdata = {
                        user_id: sessionStorage.userid,
                        handle_segment: 12,
                        query_start_time: "",
                        query_end_time: "",
                        project_id: this.search.selectProjectID,
                        sub_project_id: this.search.selectSubprojectID,
                        city_name: this.search.selectCity,
                        sort_field_name: this.search.sort_field_name,
                        car_day_id_list: this.search.postCarPlanId.replace(/[*]/g, "%"),
                        storage_task_id_list: this.search.storageID,
                        handle_status: this.search.selectAllowOutState,
                        op_status: this.search.selectAllowOutResult,
                        sub_project_process_type: this.search.subProjectProcessType,
                        source_sub_project_name: this.search.sourceSubProjectName,
                        field_qc_status: this.search.field_qc_status,
                        field_plan_name: this.search.field_plan_name,
                        return_solution: this.search.return_solution,
                        project_status: this.search.project_status,
                        page_size: this.filter.perPage,
                        page_index: this.filter.currentPage,
                        return_all: arg && arg.return_all ? arg.return_all : 2
                    };
                    if (!(arg && arg.loading)) {
                        if (!(arg && arg.return_all)) {
                            this.searchDatas = query_PreProcessdata;
                        }
                    }
                    this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2
                    this.searchDatas.page_size = this.filter.perPage;
                    this.searchDatas.page_index = this.filter.currentPage;
                    this.$http.post("/api/query_qycl_allow_out_status", this.searchDatas).then(
                        response => {
                            this.loading = false;
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0 || data.errno === 7) {
                                if (data.errno === 7) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.totalNumber = Number(data.data.total_number);
                                    if (arg && arg.return_all) {
                                        var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                        for (var i = 0; i < pagesNumber; i++) {
                                            this.multipleCarPlanSelection[i] = data.data.qycl_status_info.slice(
                                                i * this.filter.perPage,
                                                (i + 1) * this.filter.perPage
                                            );
                                        }
                                        this.allTableData = Object.assign(
                                            [],
                                            this.allTableData,
                                            this.multipleCarPlanSelection
                                        );
                                        if (this.allTableData.length > 0) {
                                            this.PreProcessTable = this.allTableData[0];
                                        }
                                        this.$refs.fullPreProcessTable.clearSelection();
                                        this.tableData.forEach(row => {
                                            this.$refs.fullPreProcessTable.toggleRowSelection(row);
                                        });
                                        this.getSelectDatas();
                                    } else {
                                        this.PreProcessTable = data.data.qycl_status_info;
                                    }
                                    if (this.totalNumber == 0) {
                                        this.emptyText = "未查询到符合条件的数据";
                                    } else {
                                        this.emptyText = "加载中";
                                        if (validateData(this.operationData.subProjectId)) {
                                            this.nowProjectStatus = this.PreProcessTable[0].project_status;
                                        }
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
                }
            },
            onSearch: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.searchPreprocess(event);
            },
            onRefresh: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.search.selectCity = "";
                this.search.storageID = "";
                this.resetselectCityData = true;
                this.search.subProjectProcessType = "";
                this.search.sourceSubProjectName = "";
                this.search.selectAllowOutState = "";
                this.search.selectAllowOutResult = "";
                this.search.imageReconitionState = "";
                this.search.pointCloudPMatrixState = "";
                this.search.field_qc_status = "";
                this.search.field_plan_name = "";
                this.search.return_solution = "";
                this.$refs.fullPreProcessTable.clearSort();
                this.search.sort_field_name = "car_day_id desc";
                if (event !== "sectionChange") {
                    this.search.project_status = "3"; // v_s: 环节切换时不改变项目状态
                    this.search.carPlanId = "";
                    this.search.postCarPlanId = "";
                    this.resetselectProjectData = true;
                } else {
                    this.searchPreprocess();
                }
            },
            selectSectionChange: function () {
                this.onRefresh("sectionChange");
            },
            sortTable: function (val) {
                if (val.order === "descending") {
                    this.search.sort_field_name = val.prop + " desc";
                } else if (val.order === "ascending") {
                    this.search.sort_field_name = val.prop + " asc";
                } else {
                    this.search.sort_field_name = "car_day_id desc";
                }
                this.onSearch();
            },
            pageSizeChange: function (val) {
                this.multipleCarPlanSelection = [];
                this.filter.perPage = val;
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
                if (this.allTableData.length > 0) {
                    this.PreProcessTable = this.allTableData[val - 1];
                    return;
                }
                this.searchPreprocess({
                    loading: true
                });
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchPreprocess({
                        return_all: 1
                    });
                } else {
                    this.multipleCarPlanSelection = [];
                    this.$refs.fullPreProcessTable.clearSelection();
                    this.getSelectDatas();
                }
            },
            carPlanSelectionChange: function (val) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.filter.currentPage - 1) {
                        this.multipleCarPlanSelection[this.filter.currentPage - 1] = val;
                    } else {
                        if (typeof this.multipleCarPlanSelection[i] == "undefined") {
                            this.multipleCarPlanSelection[i] = [];
                        }
                    }
                }
                this.getSelectDatas();
            },
            SelectCitys: function (data) {
                this.search.selectCity = data;
            },
            SelectProjects: function (data) {
                this.search.selectProjectID = data.project_id;
                this.search.selectSubprojectID = data.sub_project_id;
                if (data.init) {
                    this.searchPreprocess();
                }
            },
            updateProjectStatus: function (data) {
                this.resetselectProjectData = false;
            },
            updateCityStatus: function (data) {
                this.resetselectCityData = false;
            },
            tileOutLibrary: function () {
                router.push({
                    name: "tileManage"
                });
            },
            submitAllowOutMarkOperation: function () {
                this.$refs["allowOutMarkData"].validate(valid => {
                    if (valid) {
                        let allowOutFlag = false;
                        for (let item of this.operationData.postCarPlanIDS) {
                            if (
                                item.handle_status == 1 ||
                                item.handle_status == 2 ||
                                item.handle_status == 3 ||
                                item.handle_status == 4 ||
                                item.handle_status == 5
                            ) {
                                allowOutFlag = true;
                                break;
                            }
                        }
                        if (allowOutFlag) {
                            this.$confirm("包含准出未开始、排队中、准出中、通过、失败的外业任务，是否继续?", "提示", {
                                    cancelButtonText: "取消",
                                    confirmButtonText: "确定",
                                    type: "warning"
                                })
                                .then(() => {
                                    this.submitAllowOutMarkForm();
                                })
                                .catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消触发前预处理准出人工标记",
                                        duration: 1500
                                    });
                                });
                        } else {
                            this.submitAllowOutMarkForm();
                        }
                    }
                });
            },
            submitAllowOutMarkForm: function () {
                var queryallowOutMarkData = {
                    user_id: sessionStorage.userid,
                    items_list: this.operationData.postCarPlanIDS,
                    handle_segment: 12,
                    op_status: this.allowOutMarkData.allowOutResult,
                    op_remark: trim(this.allowOutMarkData.allow_out_reason)
                };
                this.$http.post("/api/modify_wy_valid_status", queryallowOutMarkData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "前预处理准出人工标记成功", () => {
                            this.dialogAllowOutMarkVisible = false;
                            this.onSearch();
                        });
                    } else {
                        alertInfo(this, "error", "前预处理准出人工标记失败，" + data.msg);
                    }
                });
            },
            operationCarDayIDs: function (operationType) {
                var selectData = this.getSelectDatas();
                if (validateData(selectData.carPlanIDS)) {
                    this.operationData.postCarPlanIDS = [].concat(JSON.parse(JSON.stringify(selectData.postCarPlanIDS)));
                    this.operationData.carPlanIDS = selectData.carPlanIDS;
                    if (operationType == "allowOut") {
                        if (validateData(this.operationData.subProjectId)) {
                            if (this.nowProjectStatus == "4") {
                                alertInfo(this, "warning", "完结项目不支持该操作");
                                return;
                            }
                            if (this.nowProjectStatus == "5") {
                                alertInfo(this, "warning", "作废项目不支持该操作");
                                return;
                            }
                            this.dialogbatchAllowOut = true;
                        } else {
                            alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                        }
                    } else if (operationType == "downloadLog") {
                        if (this.validateOperationInfo()) {
                            this.dialogDownloadLogVisible = true;
                        }
                    } else if (operationType == "deleteClassify") {
                        this.dialogDelectClassify = true;
                    } else if (operationType == "return") {
                        this.returnMarkData.return_reason = "";
                        this.returnMarkData.relation_id = "";
                        let notAllowOutCount = 0;
                        let relationIDS = [];
                        for (let val of this.operationData.postCarPlanIDS) {
                            if (val.handle_status == 6 && val.field_qc_status == 4) {
                                notAllowOutCount++;
                            }
                            if (val.fail_description) {
                                if (val.fail_description.indexOf("rule2003") !== -1) {
                                    relationIDS.push(val.car_day_id);
                                }
                            }
                        }
                        this.returnMarkData.relation_id = relationIDS.join(",");
                        if (validateData(this.operationData.subProjectId)) {
                             if (this.nowProjectStatus == "4") {
                                alertInfo(this, "warning", "完结项目不支持该操作");
                                return;
                            }
                            if (this.nowProjectStatus == "5") {
                                alertInfo(this, "warning", "作废项目不支持该操作");
                                return;
                            }
                            if (notAllowOutCount == this.operationData.postCarPlanIDS.length) {
                                if (this.operationData.postCarPlanIDS.length == 1) {
                                    if (this.operationData.postCarPlanIDS[0].fail_description) {
                                        var fail_description = this.operationData.postCarPlanIDS[0].fail_description;
                                        if (fail_description.indexOf("http://") !== -1) {
                                            var index = fail_description.indexOf("http://");
                                            this.returnMarkData.return_reason = fail_description.substring(0, index -
                                                2);
                                        } else {
                                            this.returnMarkData.return_reason = fail_description;
                                        }
                                    }
                                }
                                this.dialogReturnVisible = true;
                            } else {
                                alertInfo(this, "warning", "只能选择外业质检状态为合格且准出不通过的外业任务打回");
                            }
                        } else {
                            alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                        }
                    } else if (operationType == "mark") {
                        this.allowOutMarkData.allow_out_reason = "";
                        this.dialogAllowOutMarkVisible = true;
                        //   let tempCount = 0;
                        //   for (let val of this.operationData.postCarPlanIDS) {
                        //     if (val.handle_status == 6) {
                        //       tempCount++;
                        //     }
                        //   }
                        //   if (tempCount == this.operationData.postCarPlanIDS.length) {
                        //     this.dialogAllowOutMarkVisible = true;
                        //   } else {
                        //     alertInfo(this, "warning", "只能选择准出不通过的外业任务");
                        //   }
                    } else {
                        this.dialogOperationCarDay = true;
                    }
                } else {
                    if (operationType == "allowOut") {
                        alertInfo(this, "warning", "请选择要触发前预处理准出的外业任务");
                    } else if (operationType == "downloadLog") {
                        alertInfo(this, "warning", "请选择要下载前预处理准出log的外业任务");
                    } else if (operationType == "deleteClassify") {
                        alertInfo(this, "warning", "请选择要删除归类的外业任务");
                    } else if (operationType == "return") {
                        alertInfo(this, "warning", "请选择要打回的外业任务");
                    } else if (operationType == "mark") {
                        alertInfo(this, "warning", "请选择要标记的外业任务");
                    } else {
                        alertInfo(this, "warning", "请选择要重跑的外业任务");
                    }
                }
            },
            getSelectDatas: function () {
                var carPlanIDS = "";
                var postCarPlanIDS = [];
                for (var val of this.multipleCarPlanSelection) {
                    for (var item of val) {
                        postCarPlanIDS.push({
                            car_day_id: item.car_day_id,
                            storage_task_id: item.storage_task_id,
                            sub_project_id: item.sub_project_id,
                            handle_status: item.handle_status,
                            fail_description: item.fail_description,
                            field_qc_status: item.field_qc_status,
                            return_sequence: item.return_sequence,
                            field_plan_id: item.field_plan_id,
                            field_qc_status: item.field_qc_status
                        });
                        if (carPlanIDS) {
                            carPlanIDS = carPlanIDS + "," + item.car_day_id;
                        } else {
                            carPlanIDS = item.car_day_id;
                        }
                    }
                }
                this.selectNumber = postCarPlanIDS.length;
                this.selectAllFlag = this.selectNumber == this.totalNumber;
                return {
                    carPlanIDS: carPlanIDS,
                    postCarPlanIDS: postCarPlanIDS
                };
            },
            submitOperationCarDay: function () {
                this.$refs["operationData"].validate(valid => {
                    if (valid) {
                        var posttriggerData = {
                            user_id: sessionStorage.userid,
                            segment_list: this.operationData.operationSection,
                            wy_task_list: this.operationData.postCarPlanIDS
                        };
                        this.$http.post("/api/reset_qycl", posttriggerData).then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                alertInfo(this, "success", "前预处理重跑成功", () => {
                                    this.dialogOperationCarDay = false;
                                    this.onSearch();
                                });
                            } else {
                                alertInfo(this, "error", "前预处理重跑失败，" + data.msg);
                            }
                        });
                    }
                });
            },
            validateOperationInfo: function () {
                var subProject = 0;
                var subProjectNum = 0;
                for (var val of this.operationData.postCarPlanIDS) {
                    if (val.sub_project_id != subProject) {
                        subProject = val.sub_project_id;
                        subProjectNum++;
                    }
                }
                if (subProjectNum > 1) {
                    alertInfo(this, "warning", "请选择同一子项目下的外业任务进行操作");
                } else {
                    return true;
                }
            },
            submitOperationForm: function (operationType) {
                if (operationType == "deleteClassify") {
                    this.$refs["deleteClassifyData"].validate(valid => {
                        if (valid) {
                            this.$confirm("是否确认要删除归类?", "提示", {
                                    cancelButtonText: "取消",
                                    confirmButtonText: "确定",
                                    type: "warning"
                                })
                                .then(() => {
                                    this.submitDelectClassifyData();
                                })
                                .catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消删除归类",
                                        duration: 1500
                                    });
                                });
                        }
                    });
                } else if (operationType == "downloadLog") {
                    this.$refs["downloadLogData"].validate(valid => {
                        if (valid) {
                            this.submitDownloadLogForm();
                        }
                    });
                } else if (operationType == "allowOut") {
                    this.$refs["batchAllowOutData"].validate(valid => {
                        if (valid) {
                            //查询一个子项目下所有外业任务
                            var query_PreProcessdata = {
                                user_id: sessionStorage.userid,
                                handle_segment: 12,
                                query_start_time: "",
                                query_end_time: "",
                                project_id: this.search.selectProjectID,
                                sub_project_id: this.search.selectSubprojectID,
                                city_name: "",
                                sort_field_name: this.search.sort_field_name,
                                car_day_id_list: "",
                                storage_task_id_list: "",
                                handle_status: "",
                                op_status: "",
                                sub_project_process_type: "",
                                source_sub_project_name: "",
                                field_qc_status: "",
                                field_plan_name: ""
                            };
                            this.$http.post("/api/query_qycl_allow_out_status", query_PreProcessdata).then(
                                response => {
                                    response = response.body;
                                    var data = response.data;
                                    let notInvalidfileldCount = 0;
                                    if (data.errno === 0) {
                                        // 获取子项目下所有非作废任务个数
                                        let responseData = data.data.qycl_status_info;
                                        for (let item of responseData) {
                                            if (item.field_qc_status != 6) {
                                                notInvalidfileldCount++;
                                            }
                                        }
                                    }
                                    let haveReturnFieldFlag = false;
                                    for (let item of this.operationData.postCarPlanIDS) {
                                        if (item.field_qc_status == 6 || item.field_qc_status == 7) {
                                            haveReturnFieldFlag = true;
                                            break;
                                        }
                                    }
                                    if (
                                        this.operationData.postCarPlanIDS.length !==
                                        notInvalidfileldCount ||
                                        haveReturnFieldFlag
                                    ) {
                                        this.$confirm(
                                                "未包含该子项目下全量非作废任务或所选任务包含作废、打回中的外业任务，是否继续?",
                                                "提示", {
                                                    cancelButtonText: "取消",
                                                    confirmButtonText: "确定",
                                                    type: "warning"
                                                }
                                            )
                                            .then(() => {
                                                this.submitBatchAllowOutData();
                                            })
                                            .catch(() => {
                                                this.$message({
                                                    type: "info",
                                                    message: "已取消触发前预处理准出",
                                                    duration: 1500
                                                });
                                            });
                                    } else {
                                        this.$confirm("是否确认要触发前预处理准出?", "提示", {
                                                cancelButtonText: "取消",
                                                confirmButtonText: "确定",
                                                type: "warning"
                                            })
                                            .then(() => {
                                                this.submitBatchAllowOutData();
                                            })
                                            .catch(() => {
                                                this.$message({
                                                    type: "info",
                                                    message: "已取消触发前预处理准出",
                                                    duration: 1500
                                                });
                                            });
                                    }
                                },
                                response => {
                                    // 响应错误回调
                                }
                            );
                        }
                    });
                } else if (operationType == "return") {
                    this.$refs["returnMarkData"].validate(valid => {
                        if (valid) {
                            let returnFlag = false;
                            let fieldPlanId = -1;
                            let fieldPlanNum = 0;
                            for (let item of this.operationData.postCarPlanIDS) {
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
                        }
                    });
                }
            },
            submitBatchAllowOutData: function () {
                var postBatchAllowOutData = {
                    user_id: sessionStorage.userid,
                    wy_task_list: this.operationData.postCarPlanIDS
                };
                this.$http.post("/api/hm_trigger_qycl", postBatchAllowOutData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "前预处理准出触发成功", () => {
                            this.dialogbatchAllowOut = false;
                            this.onSearch();
                        });
                    } else {
                        alertInfo(this, "error", "前预处理准出触发失败，" + data.msg);
                    }
                });
            },
            submitDelectClassifyData: function () {
                var postDelectClassifyData = {
                    user_id: sessionStorage.userid,
                    wy_task_list: this.operationData.postCarPlanIDS
                };
                this.$http.post("/api/wy_task_delete_sub_project", postDelectClassifyData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "删除归类成功", () => {
                            this.dialogDelectClassify = false;
                            this.onSearch();
                        });
                    } else {
                        alertInfo(this, "error", "删除归类失败，" + data.msg);
                    }
                });
            },
            submitDownloadLogForm: function () {
                var postDownloadLogData = {
                    user_id: sessionStorage.userid,
                    sub_project_id: this.operationData.subProjectId,
                    process_segment: 12,
                    wy_task_list: this.operationData.postCarPlanIDS
                };
                this.$http.post("/api/generate_log_download_url", postDownloadLogData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "已下发log下载命令，" + data.data.tips, () => {
                            this.dialogDownloadLogVisible = false;
                            this.onSearch();
                        });
                    } else {
                        alertInfo(this, "error", "log下载失败，" + data.msg);
                    }
                });
            },
            submitReturnForm: function (formName) {
                var returnMarkData = {
                    user_id: sessionStorage.userid,
                    car_day_id: this.operationData.carPlanIDS,
                    reason: this.returnMarkData.return_reason,
                    relation_id: this.returnMarkData.relation_id,
                    segment: 12,
                    sub_project_id: this.operationData.subProjectId,
                    memo: trim(this.returnMarkData.memo)
                };
                this.$http.post("/api/return_field_task", returnMarkData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "外业任务打回成功", () => {
                            this.dialogReturnVisible = false;
                            this.onSearch();
                        });
                    } else {
                        alertInfo(this, "error", "外业任务打回失败，" + data.msg);
                    }
                });
            },
            downloadBaseMap: function (index) {
                let thisRowData = JSON.parse(JSON.stringify(this.tableData[index]));
                let queryData = {
                    car_day_id: thisRowData.car_day_id
                };
                this.$http.post("/api/download_wy_map_file_url", queryData).then(response => {
                    response = response.body;
                    let data = response.data;
                    if (data.errno === 0) {
                        let a = document.createElement("a");
                        a.href = data.data.url;
                        a.click();
                    } else if (data.errno === 7) {
                        alertInfo(this, "error", "没有底图相关资料");
                    } else {
                        alertInfo(this, "error", data.msg);
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

    .preProcess {
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

        .form-table {
            width: 100%;
            margin: 0 0 20px 0;
        }

        .confirmInfo {
            float: left;
            font-weight: bold;
            color: red;
            font-size: 16px;
            margin: 0 0 10px 10px;
        }

        .left-title {
            text-align: left;
            padding: 0 0 20px 30px;
            width: 100%;
        }

        .tipInfo {
            text-align: left;
            width: 100%;
            margin: -10px 0 -5px 120px;
        }

        .tipInfo-1 {
            text-align: left;
            width: 100%;
            margin: -10px 0 0 120px;
        }

        .tipInfo-2 {
            text-align: left;
            width: 100%;
            margin: -10px 0 5px 120px;
        }
    }

</style>
