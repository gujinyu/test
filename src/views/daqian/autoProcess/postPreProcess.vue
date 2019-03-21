<template>
    <div class="postPreProcess">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv">
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium" @change="sectionChange()">
                            <el-radio-button label="24">点云语义分割</el-radio-button>
                            <el-radio-button label="20">点云融合</el-radio-button>
                            <el-radio-button label="2001">点云融合准出</el-radio-button>
                            <el-radio-button label="22">点云融合人工调整与确认</el-radio-button>
                            <el-radio-button label="23">P矩阵生成</el-radio-button>
                            <el-radio-button label="21">点云识别+染色+车道线建模</el-radio-button>
                            <el-radio-button label="2101">后预处理准出</el-radio-button>
                        </el-radio-group>
                        <!--<el-select size="medium" v-model="search.selectSection" placeholder="预处理环节" @change="sectionChange()">
                            <el-option value="20" label="点云融合"></el-option>
                            <el-option value="22" label="点云融合人工调整与确认"></el-option>
                            <el-option value="23" label="P矩阵生成"></el-option>
                            <el-option value="21" label="点云识别+染色+车道线建模"></el-option>
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
                    <div class="selectDiv" v-show="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21 || search.selectSection == 23 || search.selectSection == 22">
                        <span class="align-right">网格状态：</span>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部" v-show="search.selectSection == 20 || search.selectSection == 24">
                            <el-option value="1" label="未开始"></el-option>
                            <el-option value="2" label="排队中"></el-option>
                            <el-option value="3" label="处理中"></el-option>
                            <el-option value="4" label="处理完成且效果达标"></el-option>
                            <el-option value="6" label="处理完成但未达标"></el-option>
                            <el-option value="5" label="失败"></el-option>
                        </el-select>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部" v-show="search.selectSection == 21 || search.selectSection == 23">
                            <el-option value="1" label="未开始"></el-option>
                            <el-option value="2" label="排队中"></el-option>
                            <el-option value="3" label="处理中"></el-option>
                            <el-option value="4" label="完成"></el-option>
                            <el-option value="5" label="失败"></el-option>
                        </el-select>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部" v-show="search.selectSection == 22">
                            <el-option value="1" label="未开始"></el-option>
                            <el-option value="3" label="处理中"></el-option>
                            <el-option value="4" label="处理完成且效果达标"></el-option>
                            <el-option value="6" label="处理完成但未达标"></el-option>
                            <el-option value="5" label="挂起"></el-option>
                            <el-option value="7" label="暂停"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv" v-show="search.selectSection == 2001 || search.selectSection == 2101">
                        <span class="align-right">准出状态：</span>
                        <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                            <el-option value="2" label="排队中"></el-option>
                            <el-option value="3" label="准出中"></el-option>
                            <el-option value="4" label="通过"></el-option>
                            <el-option value="6" label="不通过"></el-option>
                            <el-option value="5" label="失败"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">源子项目：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.sourceSubProjectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.sourceSubProjectName"
                                clearable placeholder="搜索源子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件"
                            trigger="focus" :content="search.tileID">
                            <el-input size="medium" slot="reference" v-model="search.tileID" :change="formatSearchInput()"
                                clearable placeholder="搜索网格编号">
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
        <!-- 后预处理状态列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">后预处理</span>
                <form action="/api/query_total_hycl_status" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='project_id' v-model="search.selectProjectID">
                    <input type="hidden" name='sub_project_id' v-model="search.selectSubprojectID">
                    <input type="hidden" name='handle_status' v-model="search.selectState">
                    <input type="hidden" name='handle_segment' v-model="search.selectSection">
                    <input type="hidden" name='sort_field_name' v-if="search.sort_field_name">
                    <input type="hidden" name='tile_id_list' v-model="search.tileID">
                    <input type="hidden" name='sub_project_process_type' v-model="search.subProjectProcessType">
                    <input type="hidden" name='source_sub_project_name' v-model="search.sourceSubProjectName">
                    <input type="hidden" name='query_or_export_data' value='8'>
                    <input type="hidden" name='path_name' value='后预处理'>
                    <el-button class="left-button" size="medium" :disabled="accessDisabled" type="primary" plain
                        native-type="submit">导出</el-button>
                </form>
                <el-button v-show="!(search.selectSection == 2001)" class="right-div" type="primary" size="medium"
                    :disabled="accessDisabled" @click="operationTiles()">{{currentSectionOperations}}</el-button>
                <el-button v-show="search.selectSection == 22" class="right-div" type="primary" size="medium" @click="assignManual()" :disabled="workAccessDisabled">网格分配</el-button>
                <el-button v-show="search.selectSection == 2001 || search.selectSection == 2101" class="right-div" type="primary"
                    size="medium" @click="downloadLogs()" :disabled="accessDisabled">log批量下载</el-button>
                <el-tooltip content="准出失败的可以尝试重新准出" placement="top-start" effect="light">
                    <el-button v-show="search.selectSection == 2001 || search.selectSection == 2101" class="right-div"
                        type="primary" size="medium" @click="tryAllowOut()" :disabled="accessDisabled">重新准出</el-button>
                </el-tooltip>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
                <div v-if="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21 || search.selectSection == 23">
                    <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)"
                        :data="tableData" ref="postPreProcessTables" border style="width: 100%" @select="tileSelectionChange"
                        @select-all="tileSelectionChange" @sort-change="sortTable">
                        <!--@cell-dblclick="showEditMemo"-->
                        <el-table-column fixed type="selection" width="55"></el-table-column>
                        <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip sortable="custom"
                            width="105"></el-table-column>
                        <el-table-column fixed prop="tile_level" label="网格层级" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="show_project_name" label="所属主项目" show-overflow-tooltip width="95"></el-table-column>
                        <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                        <el-table-column prop="show_project_status" show-overflow-tooltip label="项目状态" width="90"></el-table-column>
                        <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                        <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目" width="105"></el-table-column>
                        <el-table-column prop="priority_level" label="优先级" show-overflow-tooltip sortable="custom"
                            width="90"></el-table-column>
                        <el-table-column prop="show_handle_segment" label="环节" show-overflow-tooltip width="130"></el-table-column>
                        <el-table-column prop="show_handle_status" label="状态" show-overflow-tooltip width="140"></el-table-column>
                        <!--<el-table-column prop="fail_description" label="失败描述" width="120"></el-table-column>-->
                        <el-table-column prop="handle_host_name" label="处理机器" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_host_group" label="机器组编号" show-overflow-tooltip width="95"></el-table-column>
                        <el-table-column prop="algorithm_parameters" label="算法参数" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_touch_user" label="触发用户" show-overflow-tooltip width="115"></el-table-column>
                        <el-table-column prop="human_touch_time" label="触发时间" show-overflow-tooltip sortable="custom"
                            width="155"></el-table-column>
                        <el-table-column prop="start_time" label="开始处理时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="end_time" label="完成处理时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="car_day_id" label="关联新增车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="storage_task_id" label="关联新增存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="source_car_day_id" label="关联继承车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="source_storage_task_id" label="关联继承存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="resource_level" label="资源等级" show-overflow-tooltip width="100"></el-table-column>
                        <!-- <el-table-column prop="show_flow_version" label="环境版本" show-overflow-tooltip width="100"></el-table-column> -->
                        <!-- <el-table-column prop="show_algorithm_version" label="算法版本" show-overflow-tooltip width="100"></el-table-column> -->
                        <el-table-column prop="memo" label="备注" show-overflow-tooltip width="100"></el-table-column>
                        <!--<el-table-column min-width="250px" label="备注" show-overflow-tooltip>
                            <template scope="scope">
                                <span v-show="!scope.row.edit">{{ scope.row.memo }}</span>
                                <el-input v-show="scope.row.edit" type="textarea"
                                :autosize="{ minRows: 2, maxRows: 5}" size="small"
                                :autofocus = "true"
                                @blur = "toggleEditInput(scope.row)"
                                v-model="scope.row.edit_memo"></el-input>
                            </template>
                        </el-table-column>-->
                        <el-table-column fixed="right" label="操作" width="80" v-if="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21|| search.selectSection == 23">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editPostPreProcessInfo(scope.$index)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-else-if="search.selectSection == 22">
                    <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)"
                        :data="tableData" ref="postPreProcessTables" border style="width: 100%" @select="tileSelectionChange"
                        @select-all="tileSelectionChange" @sort-change="sortTable">
                        <el-table-column fixed type="selection" width="55"></el-table-column>
                        <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip sortable="custom"
                            width="105"></el-table-column>
                        <el-table-column fixed prop="tile_level" label="网格层级" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="show_project_name" label="所属主项目" show-overflow-tooltip width="95"></el-table-column>
                        <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                        <el-table-column prop="show_project_status" show-overflow-tooltip label="项目状态" width="90"></el-table-column>
                        <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                        <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目" width="105"></el-table-column>
                        <el-table-column prop="priority_level" label="优先级" show-overflow-tooltip sortable="custom"
                            width="90"></el-table-column>
                        <el-table-column prop="show_handle_segment" label="环节" show-overflow-tooltip width="130"></el-table-column>
                        <el-table-column prop="show_handle_status" label="状态" show-overflow-tooltip width="140"></el-table-column>
                        <!--<el-table-column prop="fail_description" label="失败描述" width="120"></el-table-column>-->
                        <el-table-column prop="show_operator" label="作业员" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="adjustment_sequence" label="调整次数" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_touch_user" label="触发用户" show-overflow-tooltip width="115"></el-table-column>
                        <el-table-column prop="human_touch_time" label="触发时间" show-overflow-tooltip sortable="custom"
                            width="155"></el-table-column>
                        <el-table-column prop="start_time" label="开始处理时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="end_time" label="完成处理时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="car_day_id" label="关联新增车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="storage_task_id" label="关联新增存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="source_car_day_id" label="关联继承车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="source_storage_task_id" label="关联继承存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="resource_level" label="资源等级" show-overflow-tooltip width="100"></el-table-column>
                        <el-table-column prop="memo" label="备注" show-overflow-tooltip width="100"></el-table-column>
                        <!--<el-table-column min-width="250px" label="备注" show-overflow-tooltip>
                            <template scope="scope">
                                <span v-show="!scope.row.edit">{{ scope.row.memo }}</span>
                                <el-input v-show="scope.row.edit" type="textarea"
                                :autosize="{ minRows: 2, maxRows: 5}" size="small"
                                :autofocus = "true"
                                @blur = "toggleEditInput(scope.row)"
                                v-model="scope.row.edit_memo"></el-input>
                            </template>
                        </el-table-column>-->
                        <el-table-column fixed="right" label="操作" width="80" v-if="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21|| search.selectSection == 23">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editPostPreProcessInfo(scope.$index)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-else-if="search.selectSection == 2001 || search.selectSection == 2101">
                    <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)"
                        :data="tableData" ref="postPreProcessTables" border style="width: 100%" @select="tileSelectionChange"
                        @select-all="tileSelectionChange" @sort-change="sortTable">
                        <el-table-column fixed type="selection" width="55"></el-table-column>
                        <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip sortable="custom"
                            width="105"></el-table-column>
                        <el-table-column fixed prop="tile_level" label="网格层级" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="show_project_name" label="所属主项目" show-overflow-tooltip width="95"></el-table-column>
                        <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                        <el-table-column prop="show_project_status" show-overflow-tooltip label="项目状态" width="90"></el-table-column>
                        <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                        <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目" width="105"></el-table-column>
                        <el-table-column prop="priority_level" label="优先级" show-overflow-tooltip sortable="custom"
                            width="90"></el-table-column>
                        <el-table-column prop="show_handle_segment" label="环节" show-overflow-tooltip width="130"></el-table-column>
                        <el-table-column prop="show_handle_status" label="准出状态" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column prop="handle_host_name" label="处理机器" show-overflow-tooltip min-width="80"></el-table-column>
                        <el-table-column prop="start_time" label="准出开始时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="end_time" label="准出结束时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="log_version" label="准出log版本" show-overflow-tooltip min-width="105"></el-table-column>
                        <el-table-column prop="log_download_url" label="准出log下载地址" show-overflow-tooltip width="130"></el-table-column>
                        <el-table-column prop="show_touch_user" label="触发用户" show-overflow-tooltip width="115"></el-table-column>
                        <el-table-column prop="human_touch_time" label="触发时间" show-overflow-tooltip sortable="custom"
                            width="155"></el-table-column>
                        <el-table-column prop="car_day_id" label="关联新增车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="storage_task_id" label="关联新增存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="source_wy_list" label="关联继承车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="source_storage_task_list" label="关联继承存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="resource_level" label="资源等级" show-overflow-tooltip width="100"></el-table-column>
                        <el-table-column prop="memo" label="备注" show-overflow-tooltip width="100"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="80" v-if="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21|| search.selectSection == 23">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editPostPreProcessInfo(scope.$index)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
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
        <!--    后预处理状态列表 end-->
        <!-- 触发点云融合 begin-->
        <el-dialog title="后预处理操作" :visible.sync="dialogOperationTilesVisible" :close-on-click-modal="false" width="60%">
            <el-form label-width="120px" class="demo-dynamic" ref="operationForm" :model="operationData" :rules="operationFormRules">
                <el-form-item label="网格列表" prop="tileIDS">
                    <el-input v-model="operationData.tileIDS" readonly type="textarea" placeholder="请选择要操作的网格"
                        :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{operationData.postTileIDS.length}}</b>条记录</p>
                <el-form-item label="选择操作" required>
                    <div style="float:left;display:inline-block;">
                        <el-radio-group v-model="operationData.selectOperation" size="medium">
                            <!-- <el-radio :label="1" v-if="search.selectSection == 20">点云融合触发</el-radio> -->
                            <!-- <el-radio :label="1" v-if="search.selectSection == 24">点云语义分割触发</el-radio> -->
                            <el-radio :label="2" v-if="!(search.selectSection == 2101)">路网数据清除</el-radio>
                            <el-radio :label="3" v-if="!(search.selectSection == 2101)">后预处理重跑</el-radio>
                            <el-radio :label="4" v-if="search.selectSection == 22 || search.selectSection == 2101">环节人工流转</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="选择环节" required v-if="operationData.selectOperation==3">
                    <el-select v-model="operationData.selectTaskType" style="float: left" placeholder="请选择重跑环节" size="medium">
                        <el-option value="24" label="点云语义分割"></el-option>
                        <el-option value="20" label="点云融合"></el-option>
                        <el-option value="22" label="点云融合人工调整与确认"></el-option>
                        <el-option value="23" label="P矩阵生成"></el-option>
                        <el-option value="21" label="点云识别+染色+车道线建模"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="机器组编号" v-if="operationData.selectOperation==3">
                        <el-select  style="float: left"  v-model="operationData.machineNo" clearable placeholder="请选择机器组编号" size="medium">
                            <el-option  v-for="item in this.machineIDs" :key="item.host_group_id" :label="'编号：'+ item.host_group_id+' '+'， 机器组详情：'+item.host_group_description" :value="item.host_group_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="算法参数" v-if="operationData.selectOperation==3">
                        <el-input v-model="operationData.algorithmParameters" clearable size="medium" placeholder="请填写算法参数" ></el-input>
                    </el-form-item>   -->
                <el-form-item label="当前环节" required v-if="(search.selectSection == 22 || search.selectSection == 2101) && operationData.selectOperation==4"
                    size="medium">
                    <el-select disabled v-model="operationData.currentTaskType" style="float: left" placeholder="选择环节"
                        size="medium">
                        <el-option value="20" label="点云融合"></el-option>
                        <el-option value="22" label="点云融合人工调整与确认"></el-option>
                        <el-option value="23" label="P矩阵生成"></el-option>
                        <el-option value="21" label="点云识别+染色+车道线建模"></el-option>
                        <el-option value="2101" label="后预处理准出"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下一环节" required v-if="search.selectSection == 22 && operationData.selectOperation==4">
                    <el-select disabled v-model="operationData.NextTaskType" style="float: left" placeholder="选择环节"
                        size="medium">
                        <el-option value="20" label="点云融合"></el-option>
                        <el-option value="22" label="点云融合人工调整与确认"></el-option>
                        <el-option value="23" label="P矩阵生成"></el-option>
                        <el-option value="21" label="点云识别+染色+车道线建模"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下一环节" required v-if="search.selectSection == 2101 && operationData.selectOperation==4">
                    <el-select disabled v-model="operationData.NextTaskType" style="float: left" placeholder="选择环节"
                        size="medium">
                        <el-option value="3000" label="准入环节"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitOperationForm('operationForm')">确定</el-button>
                    <el-button @click="dialogOperationTilesVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 触发点云融合 end-->
        <!-- 重新准出 begin-->
        <el-dialog title="重新准出" :visible.sync="dialogTryAllowOutVisible" :close-on-click-modal="false">
            <el-form ref="tryAllowOutData" :model="tryAllowOutData" label-width="120px" class="demo-dynamic">
                <el-form-item label="网格列表" required prop="tileIDS" :rules="[{ required: true, message: '请选择要重新准出的网格', trigger: 'blur'},{ required: true, message: '请选择要重新准出的网格', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要重新准出的网格" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="tryAllowOutData.tileIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{tryAllowOutData.postTileIDS.length}}</b>条记录</p>
                <el-form-item label="准出环节" required>
                    <el-select disabled v-model="tryAllowOutData.currentSection" style="float: left" size="medium">
                        <el-option value="2001" label="点云融合准出"></el-option>
                        <el-option value="2101" label="后预处理准出"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitTryAllowOutForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogTryAllowOutVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 重新准出 end-->
        <!-- 准出Log批量下载 begin-->
        <el-dialog title="准出log批量下载" :visible.sync="dialogDownloadLogVisible" :close-on-click-modal="false">
            <el-form ref="downloadLogData" :model="downloadLogData" label-width="120px" class="demo-dynamic">
                <el-form-item label="网格列表" size="medium" required prop="tileIDS" :rules="[{ required: true, message: '请选择要下载log的网格', trigger: 'blur'},{ required: true, message: '请选择要下载log的网格', trigger: 'change'}]">
                    <el-input type="textarea" readonly placeholder="请选择要下载log的网格" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="downloadLogData.tileIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{downloadLogData.postTileIDS.length}}</b>条记录</p>
                <el-form-item label="准出环节" required>
                    <el-select disabled v-model="tryAllowOutData.currentSection" style="float: left" size="medium">
                        <el-option value="2001" label="点云融合准出"></el-option>
                        <el-option value="2101" label="后预处理准出"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitDownloadLogForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogDownloadLogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 准出Log批量下载 end-->
        <!-- 编辑后预处理信息 begin-->
        <el-dialog title="编辑网格后预处理信息" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form ref="inPostPreProcess" :model="inPostPreProcess" label-width="120px" class="demo-dynamic">
                <el-form-item label="网格编号">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inPostPreProcess.tile_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="网格层级">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inPostPreProcess.tile_level" disabled></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="所属子项目编号">
                            <el-col :span="16"><el-input v-model="inPostPreProcess.sub_project_id" disabled></el-input></el-col>
                        </el-form-item>
                        <el-form-item label="所属子项目名称">
                            <el-col :span="16"><el-input v-model="inPostPreProcess.sub_project_name" disabled></el-input></el-col>
                        </el-form-item>
                        <el-form-item label="所属主项目">
                            <el-col :span="16"><el-input v-model="inPostPreProcess.project_name" disabled></el-input></el-col>
                        </el-form-item>
                        <el-form-item label="优先级">
                            <el-col :span="16"><el-input v-model="inPostPreProcess.priority_level" disabled></el-input></el-col>
                        </el-form-item>-->
                <el-form-item label="后预处理环节">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inPostPreProcess.show_handle_segment" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="后预处理状态">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inPostPreProcess.show_handle_status" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="处理机器" v-if="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21">
                    <el-col :span="20">
                        <el-input size="medium" v-model="inPostPreProcess.handle_host_name" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="机器组编号" v-if="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21">
                    <el-col :span="20">
                        <el-input size="medium" v-model="inPostPreProcess.show_host_group" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="算法参数" v-if="search.selectSection == 20 || search.selectSection == 24 || search.selectSection == 21">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inPostPreProcess.algorithm_parameters" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="作业员id" v-if="search.selectSection == 22">
                    <el-col :span="20">
                        <el-input size="medium" v-model="inPostPreProcess.operator_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="调整次数" v-if="search.selectSection == 22">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inPostPreProcess.adjustment_sequence" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="触发用户id">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inPostPreProcess.touch_user_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="触发时间">
                    <el-col :span="18">
                        <el-date-picker format type="datetime" size="medium" v-model="inPostPreProcess.human_touch_time"
                            disabled style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="开始处理时间">
                    <el-col :span="18">
                        <el-date-picker format type="datetime" size="medium" v-model="inPostPreProcess.start_time"
                            disabled style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="完成处理时间">
                    <el-col :span="18">
                        <el-date-picker format type="datetime" size="medium" v-model="inPostPreProcess.end_time"
                            disabled style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" v-model="inPostPreProcess.memo"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inPostPreProcess')">重置</el-button>-->
                    <el-button @click="dialogEditVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑后预处理信息 end-->
        <!-- 网格分配 开始 -->
        <el-dialog title="网格分配" :visible.sync="assignManualVisible" :close-on-click-modal="false">
            <el-form  label-width="120px" class="demo-dynamic">
                <el-form-item label="网格列表">
                    <el-input type="textarea" readonly placeholder="请选择要需要分配的网格" :autosize="{ minRows: 5, maxRows: 5}"
                        v-model="assignManualList.tileIDS"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择<b>{{selectNumber}}</b>条记录</p>
                <el-form-item label="作业员" required>
                    <Cascader style="float:left;width:80%" :data="workerOptions" size="large" filterable
                        :change-on-select="WorkerChangeOnselect" class="left-div" placeholder="选择作业员" @on-visible-change="operatorVisible"
                        @on-change="workerChange" :clearable="true" v-model="selectWorkerArr"></Cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAssignManual()">确定</el-button>
                    <el-button @click="assignManualVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 网格分配 结束 -->
    </div>
</template>

<script>
    import selectProject from "@/components/daqian_selectProject.vue";
    import {
        validateData,
        alertInfo,
        inputCheck,
        showDataSet,
        showDescription,
        resize
    } from "@/utils/daqian_tools";
    import Vue from "vue";
    export default {
        components: {
            selectProject
        },
        data() {
            return {
                formHeight: this.global.formHeight,
                collapseFlag: false,
                search: {
                    userId: sessionStorage.userid,
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    selectSection: "24",
                    selectState: "",
                    selectAllowOutResult: "",
                    sort_field_name: "tile_id desc",
                    tileID: "",
                    subProjectProcessType: "",
                    project_status: "3"
                },
                searchDatas: {},
                inPostPreProcess: [],
                dialogEditVisible: false,
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                PostPreProcessTable: [],
                multipleTileSelection: [],
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
                dialogOperationTilesVisible: false,
                currentSectionOperations: '清除/重跑',
                operationData: {
                    tileIDS: "",
                    tileLevel: 0,
                    postTileIDS: [],
                    subprojectID: 0,
                    machineNo: "",
                    algorithmParameters: "",
                    selectTaskType: "20",
                    selectOperation: 1,
                    currentTaskType: "22",
                    NextTaskType: "21"
                },
                operationFormRules: {
                    tileIDS: [{
                        required: true,
                        message: "请选择要操作的网格",
                        trigger: "blur,change"
                    }]
                },
                machineIDs: [],
                tryAllowOutData: {
                    subProjectID: 0,
                    currentSection: "2001",
                    tileIDS: "",
                    postTileIDS: []
                },
                dialogTryAllowOutVisible: false,
                downloadLogData: {
                    subProjectID: 0,
                    currentSection: "2001",
                    tileIDS: "",
                    postTileIDS: []
                },
                dialogDownloadLogVisible: false,
                accessDisabled: false,
                ChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                loading: true,
                emptyText: "查询中",
                selectNumber: 0,
                selectAllFlag: false,
                allTableData: [],
                assignManualList: {},
                assignManualVisible: false,
                workerOptions: [],
                selectWorkerArr: [],
                selectWorker: "",
                WorkerChangeOnselect: false,
                workAccessDisabled: false
            };
        },
        updated() {
            this.$refs.postPreProcessTables.clearSelection();
            var tmpSelectData = this.multipleTileSelection[this.filter.currentPage - 1];
            if (tmpSelectData) {
                let arr = JSON.parse(JSON.stringify(tmpSelectData));
                for (var sel of tmpSelectData) {
                    for (let index in this.tableData) {
                        if (JSON.stringify(sel) === JSON.stringify(this.tableData[index])) {
                            this.$refs.postPreProcessTables.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
                this.multipleTileSelection[this.filter.currentPage - 1] = arr;
            }
        },
        mounted() {
            this.$nextTick(function () {
                resize()
            });
            this.operationUser();
        },
        computed: {
            tableData: function () {
                for (var val of this.PostPreProcessTable) {
                    val.show_project_name = showDataSet(val.project_id, val.project_name);
                    val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                    val.show_operator = showDataSet(val.operator_id, val.operator_name);
                    val.show_touch_user = showDataSet(val.touch_user_id, val.touch_user_name);
                    val.show_source_sub_project_name = showDataSet(val.source_sub_project_id, val.source_sub_project_name);
                    val.show_sub_project_type = this.subProjectAllTypes[val.sub_project_type];
                    val.show_project_status = this.projectStatuDatas[val.project_status];
                    val.show_sub_project_process_type = this.subProjectProcessAllTypes[val.sub_project_process_type];

                    /*Vue.set(val,'edit',false);
                            Vue.set(val,'edit_memo',val.memo);*/
                    if (val.handle_status === "1") {
                        val.show_handle_status = "未开始";
                    } else if (val.handle_status === "2") {
                        val.show_handle_status = "排队中";
                    } else if (val.handle_status === "3") {
                        val.show_handle_status = "处理中";
                        if (this.search.selectSection == 2001 || this.search.selectSection == 2101) {
                            val.show_handle_status = "准出中";
                        }
                    } else if (val.handle_status === "4") {
                        if (
                            this.search.selectSection == 20 ||
                            this.search.selectSection == 22 ||
                            this.search.selectSection == 24
                        ) {
                            val.show_handle_status = "处理完成且效果达标";
                        } else if (this.search.selectSection == 2001 || this.search.selectSection == 2101) {
                            val.show_handle_status = "通过";
                        } else {
                            val.show_handle_status = "完成";
                        }
                    } else if (val.handle_status === "6") {
                        if (
                            this.search.selectSection == 20 ||
                            this.search.selectSection == 22 ||
                            this.search.selectSection == 24
                        ) {
                            val.show_handle_status = "处理完成但未达标";
                        } else if (this.search.selectSection == 2001 || this.search.selectSection == 2101) {
                            val.show_handle_status = "不通过";
                            if (val.fail_description) {
                                val.show_handle_status = "不通过，原因：" + val.fail_description;
                            } else {
                                val.show_handle_status = "不通过，原因：无";
                            }
                        } else {
                            val.show_handle_status = "完成";
                        }
                    } else if (val.handle_status === "5") {
                        if (
                            this.search.selectSection == 20 ||
                            this.search.selectSection == 24 ||
                            this.search.selectSection == 21 ||
                            this.search.selectSection == 23 ||
                            this.search.selectSection == 2001 ||
                            this.search.selectSection == 2101
                        ) {
                            val.show_handle_status = "失败";
                            if (val.fail_description) {
                                val.show_handle_status = "失败，原因：" + val.fail_description;
                            } else {
                                val.show_handle_status = "失败，原因：无";
                            }
                        } else {
                            val.show_handle_status = "挂起";
                            if (val.fail_description) {
                                val.show_handle_status = "挂起，原因：" + val.fail_description;
                            } else {
                                val.show_handle_status = "挂起，原因：无";
                            }
                        }
                    } else if(val.handle_status === "7"){
                        if(this.search.selectSection == 22){
                            val.show_handle_status = "暂停";
                        }
                    }
                    if (val.handle_segment === "20") {
                        val.show_handle_segment = "点云融合";
                    } else if (val.handle_segment === "21") {
                        val.show_handle_segment = "点云识别+染色+车道线建模";
                    } else if (val.handle_segment === "22") {
                        val.show_handle_segment = "点云融合人工调整与确认";
                    } else if (val.handle_segment === "23") {
                        val.show_handle_segment = "P矩阵生成";
                    } else if (val.handle_segment === "2001") {
                        val.show_handle_segment = "点云融合准出";
                    } else if (val.handle_segment === "2101") {
                        val.show_handle_segment = "后预处理准出";
                    } else if (val.handle_segment === "24") {
                        val.show_handle_segment = "点云语义分割";
                    }
                    val.show_host_group = showDescription(
                        "编号",
                        val.host_group_id,
                        "机器组详情",
                        val.host_group_description
                    );
                    // val.show_flow_version = showDescription('版本',val.algorithm_series_id,'环境版本详情',val.algorithm_series_description);
                    // val.show_algorithm_version = showDescription('版本',val.algorithm_version,'算法版本详情',val.algorithm_version_description);
                }
                return this.PostPreProcessTable;
            }
        },
        created() {
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
            if (sessionStorage.userrole == 4) {
                this.workAccessDisabled = true;
            }
            if (sessionStorage.tileID) {
                this.search.tileID = sessionStorage.tileID;
            }
        },
        methods: {
            /*showEditMemo: function (val) {
                    val.edit = true;
                },
                toggleEditInput: function (val) {
                    var queryEditData = {
                        "user_id": sessionStorage.userid,
                        "tile_id": val.tile_id,
                        "tile_level": val.tile_level,
                        "sub_project_id": val.sub_project_id,
                        "handle_segment": val.handle_segment,
                        "memo": val.edit_memo
                    };
                    this.$http.post('/api/modify_hycl_memo',queryEditData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            val.memo = val.edit_memo;
                            val.edit = false;
                        } else {
                            alertInfo(this,'error','后预处理备注编辑失败，' + data.msg,()=>{
                                val.edit = false;
                            });
                        }
                    });
                },*/
            assignManual: function () {
                let selectData = this.getSelectDatas();
                if (validateData(selectData.tileIDS)) {
                    this.assignManualList = selectData;
                    this.assignManualVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要操作的网格");
                }
            },
            submitAssignManual: function () {
                // 网格分配提交
                if (!validateData(this.selectWorker)) {
                    alertInfo(this, "warning", "请先选择作业员");
                    return;
                }
                let postData = {
                    user_id: sessionStorage.userid,
                    operator_id: this.selectWorker,
                    tile_list: this.assignManualList.assignManualIDs
                }
                this.$http.post('/api/assign_manual_adjust_task', postData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", `${data.msg},本次成功分配 ${data.data.tile_count} 个网格`, ()=>{
                            this.assignManualVisible = false;
                            setTimeout(() => {
                                this.onSearch();
                            });
                            
                        });
                    } else {
                        alertInfo(this, "error", data.msg);
                    }
                })
            },
            workerChange: function (val) { // 级联菜单 选择作业员或作业组长时的事件
                this.selectWorker = '';
                if (val.length === 2) {
                    this.user_id = val[0];
                    this.selectWorker = val[1];
                } else if (val.length === 1) {
                    this.selectWorker = val[0];
                } else {
                    this.selectWorker = '';
                }
            },
            operatorVisible: function (val) {
                if (val) {
                    if (this.WorkerChangeOnselect === false) {
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
            operationUser: function () { // 获取所有操作和检验人员数据
                this.workerOptions = [];
                this.QualityUserOptions = [];
                var queryUserData = {
                    user_return_all: 1
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
                    }
                });
            },
            editPostPreProcessInfo: function (index) {
                this.inPostPreProcess = JSON.parse(JSON.stringify(this.tableData[index]));
                this.dialogEditVisible = true;
            },
            submitEditForm: function () {
                var queryEditData = {
                    user_id: sessionStorage.userid,
                    tile_id: this.inPostPreProcess.tile_id,
                    tile_level: this.inPostPreProcess.tile_level,
                    sub_project_id: this.inPostPreProcess.sub_project_id,
                    handle_segment: this.inPostPreProcess.handle_segment,
                    memo: this.inPostPreProcess.memo
                };
                this.$http.post("/api/modify_hycl_memo", queryEditData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "网格后预处理信息编辑成功", () => {
                            this.dialogEditVisible = false;
                            this.searchPostPreprocess();
                        });
                    } else {
                        alertInfo(this, "error", "网格后预处理信息编辑失败，" + data.msg);
                    }
                });
            },
            formatSearchInput: function () {
                this.search.tileID = inputCheck(this, this.search.tileID, 1);
                sessionStorage.tileID = this.search.tileID;
            },
            searchPostPreprocess: function (arg) {
                this.emptyText = "查询中";
                this.tryAllowOutData.subProjectID = this.search.selectSubprojectID;
                this.tryAllowOutData.currentSection = this.search.selectSection;
                this.downloadLogData.subProjectID = this.search.selectSubprojectID;
                this.downloadLogData.currentSection = this.search.selectSection;
                var query_PostPreProcessdata = {
                    user_id: sessionStorage.userid,
                    handle_segment: this.search.selectSection,
                    handle_status: this.search.selectState,
                    query_start_time: "",
                    query_end_time: "",
                    project_id: this.search.selectProjectID,
                    sub_project_id: this.search.selectSubprojectID,
                    city_name: "",
                    sort_field_name: this.search.sort_field_name,
                    tile_id_list: this.search.tileID,
                    sub_project_process_type: this.search.subProjectProcessType,
                    source_sub_project_name: this.search.sourceSubProjectName,
                    query_or_export_data: 0,
                    page_size: this.filter.perPage,
                    page_index: this.filter.currentPage,
                    project_status: this.search.project_status,
                    return_all: arg && arg.return_all ? arg.return_all : 2
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.PostPreProcessTable = [];
                        this.totalNumber = 0;
                        this.searchDatas = query_PostPreProcessdata;
                    }
                    this.filter.currentPage = 1;
                    this.multipleTileSelection = [];
                    this.loading = true;
                }
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_size = this.filter.perPage;
                this.searchDatas.page_index = this.filter.currentPage;
                this.$http.post("/api/query_total_hycl_status", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.totalNumber = Number(data.data.total_number);
                                if (this.totalNumber == 0) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.emptyText = "加载中";
                                }
                                if (arg && arg.return_all) {
                                    var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                    for (var i = 0; i < pagesNumber; i++) {
                                        this.multipleTileSelection[i] = data.data.hycl_status_info.slice(
                                            i * this.filter.perPage,
                                            (i + 1) * this.filter.perPage
                                        );
                                    }
                                    this.allTableData = Object.assign([], this.allTableData, this.multipleTileSelection);
                                    if (this.allTableData.length > 0) {
                                        this.PostPreProcessTable = this.allTableData[0];
                                    }
                                    this.$refs.postPreProcessTables.clearSelection();
                                    this.multipleTileSelection.forEach(row => {
                                        this.$refs.postPreProcessTables.toggleRowSelection(row);
                                    });
                                    this.getSelectDatas();
                                } else {
                                    this.PostPreProcessTable = data.data.hycl_status_info;
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
                this.searchPostPreprocess(event);
            },
            onRefresh: function (event) {
                this.selectNumber = 0;
                this.selectAllFlag = false;
                this.allTableData = [];
                this.search.selectState = "";
                this.search.subProjectProcessType = "";
                this.search.sourceSubProjectName = "";
                this.$refs.postPreProcessTables.clearSort();
                this.search.sort_field_name = "tile_id desc";
                if (event !== "sectionChange") {
                    this.search.tileID = "";
                    this.resetselectProjectData = true;
                } else {
                    this.searchPostPreprocess();
                }
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
                    this.PostPreProcessTable = this.allTableData[val - 1];
                    return;
                }
                this.searchPostPreprocess({
                    loading: true
                });
            },
            selectAll: function () {
                if (this.selectAllFlag) {
                    this.searchPostPreprocess({
                        return_all: 1
                    });
                } else {
                    this.multipleTileSelection = [];
                    this.$refs.postPreProcessTables.clearSelection();
                    this.getSelectDatas({
                        loading: true
                    });
                }
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
            operationTiles: function () {
                var selectData = this.getSelectDatas();
                if (validateData(selectData.tileIDS)) {
                    this.operationData.postTileIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTileIDS)));
                    this.operationData.tileIDS = selectData.tileIDS;
                    this.operationData.selectTaskType = this.search.selectSection;
                    this.operationData.subProjectID = this.operationData.postTileIDS[0].sub_project_id;
                    this.operationData.tileLevel = this.operationData.postTileIDS[0].tile_level;
                    //查询机器组编号
                    // var queryMachineID = {
                    //     "user_id":sessionStorage.userid
                    // };
                    // this.$http.post('/api/query_all_host_group',queryMachineID).then(response => {
                    //     response = response.body;
                    //     var data = response.data;
                    //     if (data.errno === 0) {
                    //         this.machineIDs = data.data.host_group_list;
                    //     }
                    // });
                    this.dialogOperationTilesVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要操作的网格");
                }
            },
            downloadLogs: function () {
                var selectData = this.getSelectDatas();
                if (validateData(selectData.tileIDS)) {
                    this.downloadLogData.postTileIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTileIDS)));
                    this.downloadLogData.tileIDS = selectData.tileIDS;
                    this.dialogDownloadLogVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要下载log的网格");
                }
            },
            tryAllowOut: function () {
                var selectData = this.getSelectDatas();
                if (validateData(selectData.tileIDS)) {
                    this.tryAllowOutData.postTileIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTileIDS)));
                    this.tryAllowOutData.tileIDS = selectData.tileIDS;
                    this.dialogTryAllowOutVisible = true;
                } else {
                    alertInfo(this, "warning", "请选择要准出的网格");
                }
            },
            getSelectDatas: function () {
                let tileIDS = "";
                let postTileIDS = [];
                let assignManualIDs = [];
                for (var val of this.multipleTileSelection) {
                    if (val) {
                        for (var item of val) {
                            postTileIDS.push({
                                tile_id: item.tile_id,
                                sub_project_id: item.sub_project_id,
                                tile_level: item.tile_level,
                                car_day_id: item.car_day_id
                            });
                            assignManualIDs.push({
                                tile_id: item.tile_id,
                                sub_project_id: item.sub_project_id
                            });
                            if (tileIDS) {
                                tileIDS = tileIDS + "," + item.tile_id;
                            } else {
                                tileIDS = item.tile_id;
                            }
                        }
                    }
                }
                this.selectNumber = postTileIDS.length;
                this.selectAllFlag = this.selectNumber == this.totalNumber;
                return {
                    tileIDS: tileIDS,
                    postTileIDS: postTileIDS,
                    assignManualIDs: assignManualIDs
                };
            },
            submitTryAllowOutForm: function () {
                this.$refs["tryAllowOutData"].validate(valid => {
                    if (valid) {
                        var postTryAllowOutData = {
                            user_id: sessionStorage.userid,
                            sub_project_id: this.tryAllowOutData.subProjectID,
                            handle_segment: this.tryAllowOutData.currentSection,
                            tile_list: this.tryAllowOutData.postTileIDS
                        };
                        this.$http.post("/api/reset_hycl", postTryAllowOutData).then(response => {
                            response = response.body;
                            var data = response.data;
                            var msg = "";
                            if (this.tryAllowOutData.currentSection == "2001") {
                                msg = "点云融合重新准出";
                            } else if (this.tryAllowOutData.currentSection == "2101") {
                                msg = "后预处理重新准出";
                            }
                            if (data.errno === 0) {
                                alertInfo(this, "success", msg + "触发成功", () => {
                                    this.dialogTryAllowOutVisible = false;
                                    this.onSearch();
                                });
                            } else {
                                alertInfo(this, "error", msg + "触发失败，" + data.msg);
                            }
                        });
                    }
                });
            },
            submitDownloadLogForm: function () {
                this.$refs["downloadLogData"].validate(valid => {
                    if (valid) {
                        var postDownloadLogData = {
                            user_id: sessionStorage.userid,
                            sub_project_id: this.downloadLogData.subProjectID,
                            process_segment: this.downloadLogData.currentSection,
                            tile_list: this.downloadLogData.postTileIDS
                        };
                        this.$http.post("/api/generate_log_download_url", postDownloadLogData).then(
                            response => {
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
                    }
                });
            },
            submitOperationForm: function (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.operationData.selectOperation == 1) {
                            var postoperationData = {
                                user_id: sessionStorage.userid,
                                sub_project_id: this.operationData.subProjectID,
                                tile_level: this.operationData.tileLevel,
                                tile_list: this.operationData.postTileIDS
                            };
                            this.$http.post("/api/hm_trigger_hycl", postoperationData).then(response => {
                                response = response.body;
                                var data = response.data;
                                var selectSectionName = "";
                                if (this.search.selectSection == "20") {
                                    selectSectionName = "点云融合";
                                } else if (this.search.selectSection == "24") {
                                    selectSectionName = "点云语义分割";
                                }
                                if (data.errno === 0) {
                                    alertInfo(this, "success", selectSectionName + "触发成功", () => {
                                        this.dialogOperationTilesVisible = false;
                                        this.onSearch();
                                    });
                                } else {
                                    alertInfo(this, "error", selectSectionName + "触发失败，" + data.msg);
                                }
                            });
                        } else if (this.operationData.selectOperation == 2) {
                            var postoperationData = {
                                user_id: sessionStorage.userid,
                                sub_project_id: this.operationData.subProjectID,
                                tile_list: this.operationData.postTileIDS
                            };
                            this.$http.post("/api/clear_hycl_data", postoperationData).then(response => {
                                response = response.body;
                                var data = response.data;
                                if (data.errno === 0) {
                                    alertInfo(this, "success", "路网数据清除成功", () => {
                                        this.dialogOperationTilesVisible = false;
                                        this.onSearch();
                                    });
                                } else {
                                    alertInfo(this, "error", "路网数据清除失败，" + data.msg);
                                }
                            });
                        } else if (this.operationData.selectOperation == 3) {
                            var postoperationData = {
                                user_id: sessionStorage.userid,
                                sub_project_id: this.operationData.subProjectID,
                                tile_list: this.operationData.postTileIDS,
                                tile_level: this.operationData.tileLevel,
                                host_group_id: this.operationData.machineNo,
                                algorithm_parameters: this.operationData.algorithmParameters,
                                handle_segment: this.operationData.selectTaskType
                            };
                            this.$http.post("/api/reset_hycl", postoperationData).then(response => {
                                response = response.body;
                                var data = response.data;
                                if (data.errno === 0) {
                                    alertInfo(this, "success", "后预处理重跑成功", () => {
                                        this.dialogOperationTilesVisible = false;
                                        this.onSearch();
                                    });
                                } else {
                                    alertInfo(this, "error", "后预处理重跑失败，" + data.msg);
                                }
                            });
                        } else if (this.operationData.selectOperation == 4) {
                            var postoperationData = {
                                user_id: sessionStorage.userid,
                                sub_project_id: this.operationData.subProjectID,
                                tile_arr: this.operationData.postTileIDS,
                                tile_level: this.operationData.tileLevel,
                                segment_from: this.operationData.currentTaskType,
                                segment_to: this.operationData.NextTaskType
                            };
                            this.$http.post("/api/operation_segment_from_to", postoperationData).then(
                                response => {
                                    response = response.body;
                                    var data = response.data;
                                    if (data.errno === 0) {
                                        alertInfo(this, "success", "后预处理环节人工流转成功", () => {
                                            this.dialogOperationTilesVisible = false;
                                            this.onSearch();
                                        });
                                    } else {
                                        alertInfo(this, "error", "后预处理环节人工流转失败，" + data.msg);
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
                    this.searchPostPreprocess();
                }
            },
            updateProjectStatus: function (data) {
                this.resetselectProjectData = false;
            },
            sectionChange: function () {
                if (this.search.selectState === "2" && this.search.selectSection === "22") {
                    this.search.selectState = "";
                }
                if (this.search.selectSection == "20" || this.search.selectSection == "24") {
                    this.currentSectionOperations = "清除/重跑";
                    this.operationData.selectOperation = 1;
                } else if (this.search.selectSection == "22") {
                    this.currentSectionOperations = "清除/重跑/环节流转";
                    this.operationData.currentTaskType = "22";
                    this.operationData.NextTaskType = "21";
                    this.operationData.selectOperation = 2;
                } else if (this.search.selectSection == "21" || this.search.selectSection == "23") {
                    this.currentSectionOperations = "清除/重跑";
                    this.operationData.selectOperation = 2;
                } else if (this.search.selectSection == "2101") {
                    this.currentSectionOperations = "环节流转";
                    this.operationData.currentTaskType = "2101";
                    this.operationData.NextTaskType = "3000";
                    this.operationData.selectOperation = 4;
                }
                this.onRefresh("sectionChange");
            }
        }
    };

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    .postPreProcess {
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

        .cascader-select-style {
            width: 300px;
        }

        .input-style {
            display: inline-block;
            width: 400px;
        }

        .input-style-1 {
            display: inline-block;
            width: 300px;
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
            margin: -10px 0 -5px 120px;
        }

        .tipInfo-1 {
            text-align: left;
            width: 100%;
            margin: -10px 0 5px 120px;
        }
    }

</style>
