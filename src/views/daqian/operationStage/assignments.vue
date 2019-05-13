<template>
    <div class="assignments">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv" @change="selectSectionChange">
                        <!--<span class="align-right">选择环节：</span>
                        <el-select size="medium" v-model="search.selectSection" placeholder="环节">
                            <el-option value="30" label="基础要素作业"></el-option>
                            <el-option value="32" label="基础要素接边"></el-option>
                            <el-option value="34" label="高阶要素作业"></el-option>
                            <el-option value="36" label="高阶要素接边"></el-option>
                            <el-option value="38" label="城市接边"></el-option>
                        </el-select>-->
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium">
                            <!-- <el-radio-button v-for="(item,index) in this.sectionList" :key="index" :label="index" >{{item}}</el-radio-button> -->
                            <el-radio-button label="3000">生产准入</el-radio-button>
                            <el-radio-button label="30">基础要素作业</el-radio-button>
                            <el-radio-button label="32">基础要素接边</el-radio-button>
                            <el-radio-button label="34">高阶要素作业</el-radio-button>
                            <el-radio-button label="36">高阶要素接边</el-radio-button>
                            <!-- v_s: 添加回库接边 -->
                            <el-radio-button label="38">回库接边</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">所属项目：</span>
                        <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus" @selectProjects="SelectProjects" :ChangeOnselect="projectChangeOnselect" :isProjectClearable="isProjectClearable" :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject" :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">出库类型：</span>
                        <el-select size="medium" v-model="search.outLibraryType" clearable placeholder="全部">
                            <template>
                                <el-option v-for="(item,index) in this.outLibraryAllTypes" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <!--v_s: 添加项目状态筛选框 -->
                    <select-check @changeEvents="changeEvent" :forArrSelectDiv="forArrSelectDiv"></select-check>
                    <div v-show="search.selectSection == '3000'">
                        <div class="selectDiv">
                            <span class="align-right">准入状态：</span>
                            <el-select size="medium" v-model="search.selectState" clearable placeholder="全部">
                                <template>
                                    <el-option v-for="(item,index) in this.allowInState" :key="index" :value="index" :label="item"></el-option>
                                </template>
                            </el-select>
                        </div>
                        <div class="selectDiv" v-show="search.selectState == '3004'">
                            <span class="align-right">准入结果：</span>
                            <el-checkbox-group style="display:inline" size="medium" v-model="search.selectAllowInPassResult">
                                <el-checkbox label="1" border>A类，无融合问题，预处理效果较好</el-checkbox>
                                <el-checkbox label="2" border>B类，较少融合问题，预处理效果一般</el-checkbox>
                                <el-checkbox label="3" border>C类，较多融合问题，预处理效果差</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="selectDiv" v-show="search.selectState == '3005'">
                            <span class="align-right">准入结果：</span>
                            <el-checkbox-group style="display:inline" size="medium" v-model="search.selectAllowInFailResult">
                                <el-checkbox label="1" border>点云分层错位</el-checkbox>
                                <el-checkbox label="2" border>预处理效果差</el-checkbox>
                                <el-checkbox label="3" border>点云图片不清晰</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div v-show="search.selectSection !== '3000'">
                        <div class="selectDiv">
                            <span class="align-right">网格状态：</span>
                            <el-select filterable size="medium" v-model="search.selectState" clearable placeholder="全部" v-if="search.selectSection == '30'">
                                <template>
                                    <el-option v-for="(item,index) in this.workStatus" :key="index" :value="index" :label="item" v-if="index < 2000"></el-option>
                                </template>
                            </el-select>
                            <el-select filterable size="medium" v-model="search.selectState" clearable placeholder="全部" v-else>
                                <template>
                                    <el-option v-for="(item,index) in this.workStatus" :key="index" :value="index" :label="item" v-if="index < 3000"></el-option>
                                </template>
                            </el-select>
                        </div>
                        <div class="selectDiv">
                            <span class="align-right">抽检状态：</span>
                            <el-select size="medium" v-model="search.selectRandomSelectState" clearable placeholder="全部">
                                <template>
                                    <el-option v-for="(item,index) in this.randomSelectStatus" :key="index" :value="index" :label="item"></el-option>
                                </template>
                            </el-select>
                        </div>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover class="input-style" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus" :content="search.tileID">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.tileID" @change="formatSearchInput()" clearable placeholder="可搜索多个网格编号">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">归属城市：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.cityName">
                            <el-input slot="reference" size="medium" v-model="search.cityName" clearable placeholder="搜索城市名称"></el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">用户查询：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.userSelect">
                            <el-input slot="reference" size="medium" v-model="search.userSelect" clearable placeholder="查询范围包括作业员、一检员、二检员">
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

        <!-- 列表、地图tab切换区 begin-->
        <div class="tab-area">
            <el-tabs v-model="showMode" type="card" @tab-click="handleClick">
                <el-tab-pane label="列表模式" name="List"></el-tab-pane>
                <el-tab-pane label="地图模式" name="Map" :disabled="!isSelectSubproject || !this.totalNumber"></el-tab-pane>
            </el-tabs>
            <div class="download">
                <form action="/api/query_total_tile_op_info" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='project_id' v-model="search.selectProjectID">
                    <input type="hidden" name='sub_project_id' v-model="search.selectSubprojectID">
                    <input type="hidden" name='operation_segment' v-model="search.selectSection">
                    <input type="hidden" name='status' v-model="search.selectState">
                    <input type="hidden" name='tile_id_list' v-model="search.tileID">
                    <input type="hidden" name='project_status' v-model="search.project_status">
                    <input type="hidden" name='sampling_status' v-model="search.selectRandomSelectState">
                    <input type="hidden" name='out_library_type' v-model="search.outLibraryType">
                    <input type="hidden" name='city_name' v-model="search.cityName">
                    <input type="hidden" name='query_or_export_data' value='5'>
                    <input type="hidden" name='path_name' value='作业网格管理'>
                    <input type="hidden" name='operator_name' v-model="search.userSelect">
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[0]" v-model="search.selectAllowInPassResult[0]">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[1]" v-model="search.selectAllowInPassResult[1]">
                    <input type="hidden" name="admittance_level[]" v-if="search.selectAllowInPassResult[2]" v-model="search.selectAllowInPassResult[2]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[0]" v-model="search.selectAllowInFailResult[0]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[1]" v-model="search.selectAllowInFailResult[1]">
                    <input type="hidden" name="admittance_reason[]" v-if="search.selectAllowInPassResult[2]" v-model="search.selectAllowInFailResult[2]">
                    <el-button class="left-button" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
            </div>
            <!-- 按钮区 begin-->
            <div class="button-area">
                <div v-show="search.selectSection !== '3000'">
                    <el-button class="right-div" type="primary" size="medium" :disabled="qualityAccessDisabled" @click="getRandomSelectInfos()">抽检</el-button>
                    <el-button class="right-div" v-popover:popover size="medium" :disabled="qualityAccessDisabled" @click.stop="openDialogRandomSelect()">随机抽检</el-button>
                    <el-button v-show="this.search.selectSection !== '38'" class="right-div" type="primary" size="medium" :disabled="accessDisabled" @click="SectionChange()">环节人工流转</el-button>
                    <el-button class="right-div" type="primary" size="medium" :disabled="accessDisabled" @click="assignTasks()">生成任务包</el-button>
                    <el-button class="right-div" v-show="this.search.selectSection==='38'" type="primary" size="medium" :disabled="accessDisabled" @click="Recommend()">接边推荐</el-button>
                </div>
                <div v-show="search.selectSection == '3000'">
                    <el-button v-show="this.search.selectSection !== '38'" class="right-div" type="primary" size="medium" :disabled="qualityAccessDisabled" @click="SectionChange()">环节人工流转</el-button>
                    <el-button class="right-div" type="primary" size="medium" :disabled="qualityAccessDisabled" @click="assignTasks()">生成任务包</el-button>
                </div>
            </div>
            <!-- 按钮区 end-->
            <div class="select-area">
                <el-checkbox v-model="selectAllFlag" @change="selectAll()">
                    <span class="select-number">全选</span>
                </el-checkbox>
                <span class="select-number">共
                    <b>{{totalNumber}}</b> 条</span>
                <span class="select-number">已选
                    <b> {{selectNumber}} </b>条记录</span>
            </div>
        </div>
        <!-- 列表、地图tab切换区 end-->
        <!-- 展示区 begin-->
        <div class="show-area">
            <!-- 地图展示区 begin-->
            <div v-show="showMode === 'Map'" class="map-area" v-bind:style="{height: global.mapHeight + 'px'}">
                <drawMap @drawMapInfo="drawMapInfo" @sendTilesInScreen="getTilesInScreen" @drawMapCall="drawMapCall" :tileList="tileList" :routerParams="routerParams" :haveLegend="haveLegend" ref="drawMap" :optionalList="optionalList"></drawMap>
            </div>
            <!-- 地图展示区 end-->
            <!-- 列表展示区 begin-->
            <div v-show="showMode !== 'Map'">
                <div class="table-div" v-if="search.selectSection == '3000'" key="table1">
                    <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="tilesTables" border style="width: 100%" @select="tileSelectionChange" @select-all="tileSelectionChange" @sort-change="sortTable">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip sortable="custom" width="105"></el-table-column>
                        <el-table-column fixed prop="orign_operation_task_id" show-overflow-tooltip label="所属任务包编号" width="120"></el-table-column>
                        <el-table-column fixed prop="tile_level" label="网格层级" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column fixed prop="priority_level" label="优先级" show-overflow-tooltip sortable="custom" width="90"></el-table-column>
                        <el-table-column prop="city_name" label="城市" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                        <!--<el-table-column prop="handle_status" label="点云识别+染色+车道线建模" show-overflow-tooltip min-width="220"></el-table-column>-->
                        <el-table-column prop="show_operation_segment" label="环节" show-overflow-tooltip width="105"></el-table-column>
                        <el-table-column prop="show_out_library_type" show-overflow-tooltip label="出库类型" width="120"></el-table-column>
                        <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_in_library_status" show-overflow-tooltip label="回库状态" width="120"></el-table-column>
                        <el-table-column prop="show_status" label="准入状态" show-overflow-tooltip width="135"></el-table-column>
                        <el-table-column prop="show_result" label="准入结果" show-overflow-tooltip width="135"></el-table-column>
                        <el-table-column prop="operation_sequence" label="总准入次数" show-overflow-tooltip width="95"></el-table-column>
                        <el-table-column prop="start_time" label="准入开始时间" show-overflow-tooltip width="160" sortable="custom"></el-table-column>
                        <el-table-column prop="end_time" label="准入结束时间" show-overflow-tooltip width="160" sortable="custom"></el-table-column>
                        <el-table-column prop="log_data_version" label="准入log版本" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="show_master_library_name" label="源母库" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="show_algorithm_version" label="算法类型" show-overflow-tooltip width="100"></el-table-column>
                        <el-table-column prop="data_standard_version" label="规范版本" show-overflow-tooltip width="100"></el-table-column>
                        <el-table-column prop="qc_rule_version" show-overflow-tooltip label="质检项版本" width="120"></el-table-column>
                        <el-table-column prop="qc_standard_version" show-overflow-tooltip label="质检标准版本" width="120"></el-table-column>
                        <el-table-column prop="show_generate_task_user" label="生成任务包用户" show-overflow-tooltip width="135"></el-table-column>
                        <el-table-column prop="generate_task_time" label="生成任务包时间" show-overflow-tooltip width="160" sortable="custom"></el-table-column>
                        <el-table-column prop="show_operator_name" label="作业员" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_qc_operator_name" label="一检员" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_second_qc_operator_name" label="二检员" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_assign_task_user" label="分配任务用户" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="assign_task_time" label="分配任务时间" show-overflow-tooltip width="160" sortable="custom"></el-table-column>
                        <el-table-column prop="hycl_result_tile_info.lane_geometry_length" label="后预处理数据量(km)" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="show_operation_user" label="操作用户" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column prop="operation_time" label="操作时间" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column prop="operation_context" label="操作内容" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                        <el-table-column prop="remark" label="标记" show-overflow-tooltip min-width="100"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" :disabled="accessDisabled" size="small" @click.native.prevent="editTile(scope.$index)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="table-div" v-else key="table2">
                    <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="tilesTables" border style="width: 100%" @select="tileSelectionChange" @select-all="tileSelectionChange" @sort-change="sortTable">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip sortable="custom" width="105"></el-table-column>
                        <el-table-column fixed prop="orign_operation_task_id" show-overflow-tooltip label="所属任务包编号" width="120"></el-table-column>
                        <el-table-column fixed prop="tile_level" label="网格层级" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column fixed prop="priority_level" label="优先级" show-overflow-tooltip sortable="custom" width="90"></el-table-column>
                        <el-table-column prop="city_name" label="城市" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                        <!--<el-table-column prop="handle_status" label="点云识别+染色+车道线建模" show-overflow-tooltip min-width="220"></el-table-column>-->
                        <el-table-column prop="show_operation_segment" label="环节" show-overflow-tooltip width="105"></el-table-column>
                        <el-table-column prop="show_operator_name" label="作业员" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_qc_operator_name" label="一检员" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_second_qc_operator_name" label="二检员" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_out_library_type" show-overflow-tooltip label="出库类型" width="120"></el-table-column>
                        <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_in_library_status" show-overflow-tooltip label="回库状态" width="120"></el-table-column>
                        <el-table-column prop="show_status" label="网格状态" show-overflow-tooltip width="135"></el-table-column>
                        <el-table-column prop="operation_sequence" label="总作业次数" show-overflow-tooltip width="95"></el-table-column>
                        <el-table-column prop="operating_task_id" label="当前返工/返修作业编号" show-overflow-tooltip width="170"></el-table-column>
                        <el-table-column prop="machine_check_task_id" show-overflow-tooltip label="当前机检编号" width="135" v-if="search.selectSection != '30'"></el-table-column>
                        <el-table-column prop="quality_checking_task_id" label="当前质检编号" show-overflow-tooltip width="105"></el-table-column>
                        <el-table-column prop="show_history_max_qc_round" label="历史最大质检轮数" show-overflow-tooltip width="135"></el-table-column>
                        <el-table-column prop="show_sampling_status" label="抽检状态" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="sampling_sequence" label="抽检次数" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="start_time" label="作业开始时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="end_time" label="质检通过时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                        <!--<el-table-column prop="log_data_version" label="质检log数据版本" show-overflow-tooltip width="150"></el-table-column>-->
                        <el-table-column prop="data_version_before_operation" show-overflow-tooltip label="作业前数据版本" width="130"></el-table-column>
                        <el-table-column prop="data_version_after_operation" show-overflow-tooltip label="作业后数据版本" width="130"></el-table-column>
                        <el-table-column prop="speed_limit_log_version_before_operation" v-if="search.selectSection=='34'" show-overflow-tooltip label="作业前限速批处理log版本" width="190"></el-table-column>
                        <el-table-column prop="speed_limit_log_version_after_operation" v-if="search.selectSection=='34'" show-overflow-tooltip label="作业后限速批处理log版本" width="190"></el-table-column>
                        <el-table-column prop="barrier_log_version_before_operation" v-if="search.selectSection=='34'" show-overflow-tooltip label="作业前护栏批处理log版本" width="190"></el-table-column>
                        <el-table-column prop="barrier_log_version_after_operation" v-if="search.selectSection=='34'" show-overflow-tooltip label="作业后护栏批处理log版本" width="190"></el-table-column>
                        <el-table-column prop="hycl_result_tile_info.lane_geometry_length" label="后预处理数据量(km)" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="operation_result_tile_info.lane_geometry_length" label="作业数据量(km)" show-overflow-tooltip width="130"></el-table-column>
                        <el-table-column prop="total_jb_mark_number" label="接边mark数" show-overflow-tooltip width="105"></el-table-column>
                        <el-table-column prop="current_jb_mark_number" label="已完成接边mark数" show-overflow-tooltip width="145"></el-table-column>
                        <el-table-column prop="connect_border_sequence" label="接边次数" show-overflow-tooltip width="80"></el-table-column>
                        <el-table-column prop="show_master_library_name" label="源母库" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="show_algorithm_version" label="算法类型" show-overflow-tooltip width="100"></el-table-column>
                        <el-table-column prop="data_standard_version" label="规范版本" show-overflow-tooltip width="100"></el-table-column>
                        <el-table-column prop="qc_rule_version" show-overflow-tooltip label="质检项版本" width="120"></el-table-column>
                        <el-table-column prop="qc_standard_version" show-overflow-tooltip label="质检标准版本" width="120"></el-table-column>
                        <el-table-column prop="show_generate_task_user" label="生成任务包用户" show-overflow-tooltip width="135"></el-table-column>
                        <el-table-column prop="generate_task_time" label="生成任务包时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_assign_task_user" label="分配任务用户" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="assign_task_time" label="分配任务时间" sortable="custom" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="show_operation_user" label="操作用户" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column prop="operation_time" label="操作时间" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column prop="operation_context" label="操作内容" show-overflow-tooltip width="140"></el-table-column>
                        <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                        <el-table-column prop="remark" label="标记" show-overflow-tooltip min-width="100"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" :disabled="accessDisabled" size="small" @click.native.prevent="editTile(scope.$index)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 表格分页 begin-->
                <div class="pagination-area">
                    <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="filter.currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="filter.perPage" layout="total, sizes, prev, pager, next, jumper" :total="totalNumber">
                    </el-pagination>
                </div>
                <!-- 表格分页 end-->
            </div>
            <!-- 列表展示区 end-->
        </div>
        <!-- 展示区 end-->
        <!-- 分配任务 begin-->
        <el-dialog title="生成任务包" :visible.sync="dialogAssignVisible" :close-on-click-modal="false">
            <el-form label-width="120px" :model="assignData" ref="assignData" class="demo-dynamic">
                <el-form-item label="网格列表" prop="tileIDS" :rules="[{ required: true, message: '请选择要生成任务包的网格', trigger: 'blur'},
                        { required: true, message: '请选择要生成任务包的网格', trigger: 'change'}]">
                    <el-input v-model="assignData.tileIDS" @blur="refreshSelectTiles(assignData.tileIDS)" placeholder="请选择要生成任务包的网格" disabled :change="formatAssignInput()" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择
                    <b>{{assignData.postTileS.length}}</b>条记录</p>
                <el-form-item label="环节" prop="selectTaskType" :rules="[{ required: true, message: '请选择环节', trigger: 'change'}]">
                    <el-select style="float: left" disabled v-model="assignData.selectTaskType" placeholder="选择环节" size="medium">
                        <template>
                            <el-option v-for="(item,index) in this.sectionList" :key="index" :value="index" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="作业员" v-if="assignData.selectTaskType !== '3000'">
                    <el-cascader :options="workerOptions" size="medium" v-model="selectWorkInfo" :change-on-select="ChangeOnselect" filterable class="left-div" placeholder="选择作业员" @visible-change="operatorVisible" @change="workerChange" :clearable="true" :show-all-levels="false"></el-cascader>
                </el-form-item>
                <el-form-item label="质检员" v-if="assignData.selectTaskType == '3000'">
                    <el-cascader :options="qcOptions" size="medium" v-model="selectQcInfo" :change-on-select="ChangeOnselect" filterable class="left-div" placeholder="选择质检员" @visible-change="operatorVisible" @change="workerChange" :show-all-levels="false" :clearable="true"></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAssigForm()">生成</el-button>
                    <el-button @click="dialogAssignVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 分配任务 end-->
        <!-- 环节流转 begin-->
        <el-dialog title="环节人工流转" :visible.sync="dialogSectionChangeVisible" :close-on-click-modal="false" @open="OpenFun">
            <el-form label-width="120px" :model="sectionChange" ref="sectionChange" class="demo-dynamic">
                <el-form-item label="网格列表" prop="tileIDS" :rules="[{ required: true, message: '请选择需要人工进行环节流转的网格ID', trigger: 'blur'},
                    { required: true, message: '请选择需要人工进行环节流转的网格ID', trigger: 'change'}]">
                    <el-input v-model="sectionChange.tileIDS" @blur="refreshSelectTiles(sectionChange.tileIDS)" type="textarea" :change="formatSectionChangeInput()" placeholder="请选择需要人工进行环节流转的网格ID，多个网格ID用分号分隔，仅可输入数字和分号" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择
                    <b>{{sectionChange.postTileS.length}}</b>条记录</p>
                <el-form-item label="当前环节" prop="currentTaskType" :rules="[{ required: true, message: '请选择环节', trigger: 'change'}]">
                    <el-select disabled v-model="sectionChange.currentTaskType" readonly style="float: left" placeholder="选择环节" @change="suggestNextType" size="medium">
                        <template>
                            <el-option v-for="(item,index) in this.sectionList" :key="index" :value="index" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="下一环节" prop="NextTaskType" :rules="[{ required: true, message: '请选择环节', trigger: 'change'}]">
                    <el-select v-model="sectionChange.NextTaskType" style="float: left" @change="linkJump" placeholder="选择环节" size="medium">
                        <el-option value="30" label="基础要素作业"></el-option>
                        <el-option value="32" label="基础要素接边"></el-option>
                        <el-option value="34" label="高阶要素作业"></el-option>
                        <el-option value="36" label="高阶要素接边"></el-option>
                        <el-option value="38" label="回库接边"></el-option>
                        <!--<el-option value="50" label="批处理"></el-option>-->
                        <!--<el-option value="51" label="护栏批处理"></el-option>  -->
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitSectionChange()">确定</el-button>
                    <el-button @click="dialogSectionChangeVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 环节流转 end-->
        <!-- 随机抽检 begin-->
        <el-popover ref="popover" trigger="manual" placement="bottom-start" width="450" v-model="dialogRandomSelect">
            <el-form status-icon :inline="true" label-width="120px" :model="randomSelect" ref="randomSelect" :rules="randomRule" class="demo-dynamic">
                <el-form-item label="随机抽检比例" prop="randomSelectRatio">
                    <el-input v-model="randomSelect.randomSelectRatio" placeholder="请输入小数形式的比例" :change="formatRandomRatio()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitRandomSection()">确定</el-button>
                    <!--<el-button @click="dialogRandomSelect = false">取消</el-button-->
                </el-form-item>
            </el-form>
        </el-popover>
        <!-- 随机抽检 end-->
        <!-- 抽检 begin-->
        <el-dialog title="抽检" :visible.sync="dialogSelectQualityCheck" :close-on-click-modal="false" width="70%">
            <el-row>
                <el-col :span="23" :offset="1">
                    <span style="float:left;margin:0px 0px 10px 10px;">抽中的网格列表</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-input v-model="finalQualityCheckTileInfos.selectTileList" type="textarea" style="width: 85%" readonly placeholder="抽中的网格列表" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23" :offset="1">
                    <span style="float:left;margin:10px;">未抽中的网格列表</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-input v-model="finalQualityCheckTileInfos.unselectTileList" type="textarea" style="width: 85%" readonly placeholder="未抽中的网格列表" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11" :offset="1">
                    <span style="float:left;margin:10px;">抽中网格数/待抽检网格总数：{{finalQualityCheckTileInfos.selectTileNumberRatioInWaitingTiles}}（{{finalQualityCheckTileInfos.hitTileNumber}}/{{finalQualityCheckTileInfos.waitTileNumber}}）</span>
                </el-col>
                <el-col :span="12">
                    <span style="float:left;margin:10px;">累计抽中网格数/网格总数：{{finalQualityCheckTileInfos.selectTileNumberRatioInTotalTiles}}（{{finalQualityCheckTileInfos.totalHitTileNumber}}/{{finalQualityCheckTileInfos.totalTileNumber}}）</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11" :offset="1">
                    <span style="float:left;margin:10px;">抽中网格数据里程/待抽检网格总数据里程：{{finalQualityCheckTileInfos.selectTileMileRatioInWaitingTiles}}（{{finalQualityCheckTileInfos.hitTileMileage}}/{{finalQualityCheckTileInfos.waitTileMileage}}）</span>
                </el-col>
                <el-col :span="12">
                    <span style="float:left;margin:10px;">累计抽中网格数据里程/网格总数据里程：{{finalQualityCheckTileInfos.selectTileMileRatioInTotalTiles}}（{{finalQualityCheckTileInfos.totalHitTileMileage}}/{{finalQualityCheckTileInfos.totalTileMileage}}）</span>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="primary" @click="submitQualityCheck()">确定</el-button>
                <el-button @click="dialogSelectQualityCheck = false">取消</el-button>
            </el-row>
        </el-dialog>
        <!-- 环节流转 end-->
        <!-- 编辑作业网格 begin-->
        <el-dialog title="编辑作业网格" :visible.sync="dialogEditTileVisible" :close-on-click-modal="false" width="600px">
            <el-form ref="editTile" :model="editTileData" :rules="editTileRules" label-width="100px" class="demo-dynamic">
                <el-form-item label="网格编号">
                    <el-col :span="16">
                        <el-input v-model="editTileData.tile_id" disabled size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属子项目">
                    <el-col :span="16">
                        <el-input v-model="editTileData.sub_project_name" disabled size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="规范版本" prop="data_standard_version">
                    <el-col :span="16">
                        <el-select style="float: left" placeholder="请选择规范版本" v-model="editTileData.data_standard_version" :disabled="editTileData.sub_project_process_type=='5'? false:true" size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.standardAllVersions" :key="index" :value="item" :label="item"></el-option>
                            </template>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="editTileData.memo"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditTile('editTile')">确定</el-button>
                    <el-button @click="dialogEditTileVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑作业网格 end-->
    </div>
</template>
<script>
import {
    trim,
    alertInfo,
    inputCheck,
    showDataSet,
    validateData,
    formatFloat5Value,
    resize,
    parentSonPassVal, // v_s: 这个方法是遍历data数据的方法
    reQpassVal, // 循环数组给请求赋值
    getSubString
} from "@/utils/daqian_tools";
var cityData = require("@/common/citydata.json");
import drawMap from "@/components/daqian_drawMap.vue";
import { setMapCity, drawCityBoundary } from "@/utils/daqian_drawtools";
import Vue from "vue";
import selectProject from "@/components/daqian_selectProject.vue";
import selectCheck from "@/components/daqian_selectCheck.vue"; // v_s: 引入自定义组件-项目状态
export default {
    components: {
        selectProject,
        selectCheck,
        drawMap
    },
    data() {
        var checkRatio = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("随机抽检比例不能为空"));
            }
            if (value > 1 || value < 0) {
                callback(new Error("随机抽检比例必须是0~1范围内的数值"));
            } else {
                callback();
            }
        };
        return {
            forArrSelectDiv: [
                {
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
            linkVal: -1,
            onSubjectStatus: 0,
            user_permission: sessionStorage.user_permission,
            collapseFlag: false,
            showMode: "List",
            formHeight: this.global.formHeight,
            search: {
                userId: sessionStorage.userid,
                selectProjectID: 0,
                selectSubprojectID: 0,
                selectSection: "3000",
                outLibraryType: "",
                selectState: "",
                selectAllowInPassResult: [],
                selectAllowInFailResult: [],
                tileID: "",
                selectRandomSelectState: "",
                sort_field_name: "tile_id desc",
                userSelect: "",
                project_status: "",
                cityName: ""
            },
            // city:'',
            isSelectSubproject: false,
            selectOperationSegmen: "3000",
            searchDatas: {},
            filter: {
                perPage: 10,
                currentPage: 1
            },
            totalNumber: 0, // 数据总数，随地图模式和列表模式变化而变化
            listModeTotalNumber: 0, // 列表模式下查询的数据总数 
            priorPage: 1,
            nowSelectSubprojectID: 0,
            tilesTable: [],
            pageSize: [10, 50, 100],
            multipleTileSelection: [],
            outLibraryAllTypes: {
                "20": "后预处理出库",
                "34": "作业出库",
                "38": "自动出库"
            },
            inLibraryAllStatus: {
                "1": "未回库",
                "2": "待回库",
                "3": "回库中",
                "4": "回库成功",
                "5": "回库失败",
                "6": "不回库"
            },
            sectionList: {
                "3000": "生产准入",
                "30": "基础要素作业",
                "32": "基础要素接边",
                "34": "高阶要素作业",
                "36": "高阶要素接边",
                "38": "回库接边"
            },
            allowInState: {
                "10": "未生成任务包",
                "12": "未分配质检员",
                "3001": "准入未开始",
                "3002": "准入中",
                "3003": "准入暂停",
                "3004": "准入通过",
                "3005": "准入不通过"
            },
            standardAllVersions: [
                "HD_V4.2.3",
                "HD_V4.2.1",
                "HD_V4.2.0",
                "HD_V4.1_PR",
                "HD_V4.1.0",
                "HD_V4.0.5_PR",
                "HD_V4.0.5"
            ],
            algorithmVersions: {
                "1": "旧",
                "2": "新"
            },
            dialogAssignVisible: false,
            assignData: {
                tileIDS: "",
                tileLevel: 0,
                dataNumber: 0,
                postTileS: [],
                selectTaskType: "30",
                selectWorker: "",
                selectQcWorker: "",
                subProjectID: 0
            },
            workerOptions: [],
            selectWorkInfo: [],
            qcOptions: [],
            selectQcInfo: [],
            accessDisabled: false,
            qualityAccessDisabled: false,
            dialogSectionChangeVisible: false,
            sectionChange: {
                tileIDS: "",
                tileLevel: 0,
                postTileS: [],
                currentTaskType: "30",
                NextTaskType: "32",
                subProjectID: 0
            },
            ChangeOnselect: false,
            projectChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
            isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
            havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认,即为选择全部项目
            showSelectProject: false, //是否可选择 false 可选择 true 不可选择
            resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
            dialogSectionChangeVisible: false,
            dialogRandomSelect: false, //是否显示随机抽检窗口 false不显示 true 显示
            randomSelect: {
                randomSelectRatio: 0.3,
                subProjectID: 0,
                selectTaskType: "30",
                randomSelectTileLists: {},
                randomSelectString: ""
            },
            randomRule: {
                randomSelectRatio: [
                    {
                        validator: checkRatio,
                        trigger: "blur"
                    }
                ]
            },
            finalQualityCheckTileInfos: {
                selectTileList: "",
                unselectTileList: "",
                hitTileNumber: 0,
                hitTileMileage: 0,
                waitTileNumber: 0,
                waitTileMileage: 0,
                totalHitTileNumber: 0,
                totalHitTileMileage: 0,
                totalTileNumber: 0,
                totalTileMileage: 0,
                selectTileNumberRatioInWaitingTiles: 0,
                selectTileMileRatioInWaitingTiles: 0,
                selectTileNumberRatioInTotalTiles: 0,
                selectTileMileRatioInTotalTiles: 0
            },
            dialogSelectQualityCheck: false,
            workStatus: {
                "1": "作业未开始",
                "2": "作业中",
                "3": "一检返工作业中",
                "4": "一检返修作业中",
                "5": "一检质检中",
                "6": "一检返工质检中",
                "7": "一检返修质检中",
                "8": "一检通过",
                "10": "未生成任务包",
                "11": "未分配作业员",
                "12": "未分配一检员",
                "13": "一检质检未开始",
                "14": "作业暂停",
                "15": "一检返工作业暂停",
                "16": "一检返修作业暂停",
                "17": "一检质检暂停",
                "18": "一检返工质检暂停",
                "19": "一检返修质检暂停",
                "20": "一检返工作业未开始",
                "21": "一检返修作业未开始",
                "103": "二检返工作业中",
                "104": "二检返修作业中",
                "105": "二检质检中",
                "106": "二检返工质检中",
                "107": "二检返修质检中",
                "108": "二检通过",
                "110": "未生成二检任务",
                "112": "未分配二检员",
                "113": "二检质检未开始",
                "115": "二检返工作业暂停",
                "116": "二检返修作业暂停",
                "117": "二检质检暂停",
                "118": "二检返工质检暂停",
                "119": "二检返修质检暂停",
                "120": "二检返工作业未开始",
                "121": "二检返修作业未开始",
                "2002": "机检排队中",
                "2003": "机检处理中",
                "2004": "机检完成",
                "2005": "机检失败",
                "3001": "准入未开始",
                "3002": "准入中",
                "3003": "准入暂停",
                "3004": "准入通过",
                "3005": "准入不通过"
            },
            randomSelectStatus: {
                "1": "待抽检",
                "2": "抽中",
                "3": "未抽中"
            },
            loading: true,
            emptyText: "查询中",
            editTileData: {},
            dialogEditTileVisible: false,
            cityOptions: cityData.children,
            selectedCitys: [],
            editTileRules: {
                city_name: [
                    {
                        required: true,
                        message: "请选择城市",
                        trigger: "change"
                    }
                ],
                data_standard_version: [
                    {
                        required: true,
                        message: "请选择规范版本",
                        trigger: "change"
                    }
                ]
            },
            selectAllFlag: false,
            selectNumber: 0,
            allTableData: [],
            tileList: [],
            routerParams: "assignments3000",
            tilesInScreen: {},
            selectProjectCityList: [], // 所选项目包含的城市列表
            haveLegend: true,
            optionalList: [], // 可选网格List
            assignmentsInfo: {
                "1": "未生成任务包",
                "2": "待作业",
                "3": "作业中",
                "4": "待一检",
                "5": "一检中",
                "6": "一检返工返修",
                "7": "待二检",
                "8": "二检中",
                "9": "二检返工返修",
                "10": "二检通过"
            },
            allowInInfo: {
                "10": "未生成任务包",
                "12": "未开始",
                "3001": "未开始",
                "3002": "准入中",
                "3003": "准入中",
                "3004": "通过",
                "3005": "不通过"
            },
            nowQueryTileData: {} // 当前筛选条件
        };
    },
    updated() {
        if (this.$refs.tilesTables) {
            this.$refs.tilesTables.clearSelection();
        }
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
        tableData: function() {
            if (this.tilesTable) {
                for (var val of this.tilesTable) {
                    val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                    val.show_master_library_name = showDataSet(val.master_library_id, val.master_library_name);
                    val.show_generate_task_user = showDataSet(val.generate_task_user_id, val.generate_task_user_name);
                    val.show_assign_task_user = showDataSet(val.assign_task_user_id, val.assign_task_user_name);
                    val.show_operation_user = showDataSet(val.operation_user_id, val.operation_user_name);
                    val.show_operator_name = showDataSet(val.operator_id, val.operator_name);
                    val.show_qc_operator_name = showDataSet(val.qc_operator_id, val.qc_operator_name);
                    val.show_second_qc_operator_name = showDataSet(
                        val.second_qc_operator_id,
                        val.second_qc_operator_name
                    );
                    val.show_operation_segment = this.sectionList[val.operation_segment];
                    val.show_out_library_type = this.outLibraryAllTypes[val.out_library_type];
                    val.show_in_library_status = this.inLibraryAllStatus[val.in_library_status];
                    val.show_algorithm_version = this.algorithmVersions[val.algorithm_version];
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
                    val.show_admittance_reason = "";
                    if (validateData(val.admittance_reason)) {
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
                if (this.tilesTable.length > this.filter.perPage) {
                    return this.tilesTable.slice(
                        (this.filter.currentPage - 1) * this.filter.perPage,
                        this.filter.currentPage * this.filter.perPage
                    );
                } else {
                    return this.tilesTable;
                }
            }
        }
    },
    created() {
        if (sessionStorage.userrole == 2) {
            this.qualityAccessDisabled = true;
        } else if (sessionStorage.userrole == 4) {
            this.accessDisabled = true;
        }
        if (sessionStorage.selectSectionWork) {
            this.search.selectSection = sessionStorage.selectSectionWork;
            if (this.search.selectSection === "3000") {
                this.routerParams = "assignments3000";
            } else {
                this.routerParams = "assignments";
            }
        }
        if (sessionStorage.tileID) {
            this.search.tileID = sessionStorage.tileID;
        }
    },
    mounted() {
        this.$nextTick(function() {
            resize();
        });
        this.operationUser();
    },
    methods: {
        getTilesInScreen: function(val) {
            this.tilesInScreen = val;
            if (this.showMode === "Map") {
                this.getVisibleTileInfo(this.tilesInScreen);
                let { zoomLevel } = this.tilesInScreen;
                // 如果当前地图级别达到绘制任务包边界的级别再查询任务包的数据
                let packageShowLevel = this.$refs.drawMap.layerOptions.baseTile11.tileCurPackageBoundary.showZoomLevel;
                // if (zoomLevel >= packageShowLevel) {
                this.getTaskPackageInfo(this.tilesInScreen);
                // }
            }
        },
        getVisibleTileInfo: function(obj) {
            let { tilesInScreen, flag } = obj;
            let queryData = {
                sub_project_id: this.nowQueryTileData.sub_project_id,
                operation_segment: this.nowQueryTileData.operation_segment,
                out_library_type: this.nowQueryTileData.out_library_type,
                status: this.nowQueryTileData.status,
                sampling_status: this.nowQueryTileData.sampling_status,
                tile_id: this.nowQueryTileData.tile_id_list,
                admittance_level: this.nowQueryTileData.admittance_level,
                admittance_reason: this.nowQueryTileData.admittance_reason,
                city_name: this.nowQueryTileData.city_name,
                operator_name: this.nowQueryTileData.operator_name,
                return_all: 1
            };
            let tilesArr = [];
            for (let tile of tilesInScreen) {
                tilesArr.push(tile.tileID);
            }
            queryData["tile_list"] = tilesArr.join(",");
            this.$http.post("/api/query_visible_tile_operation_info", queryData).then(response => {
                response = response.body;
                let data = response.data;
                if (data.errno === 0) {
                    let tileList = data.data.tile_list;
                    let filterTileList = data.data.filter_tile_list;
                    let outLibraryTileList = data.data.out_library_tile_list;
                    this.totalNumber = Number(data.data.total_filter_number);
                    // 循环得到可以选定的网格
                    let arr = [];
                    for (let item of tileList) {
                        item.isCurrent = 0;
                    }
                    for (let tile of filterTileList) {
                        for (let item of tileList) {
                            if (Number(item.tile_id) === Number(tile.tile_id)) {
                                item.isCurrent = 1;
                                break;
                            }
                        }
                    }
                    for (let item of tileList) {
                        // 获取当前可选择的网格
                        if (item.isCurrent === 1) {
                            arr.push(item.tile_id);
                        }
                    }
                    this.optionalList = arr;
                    let tileBoundaryArr = JSON.parse(JSON.stringify(tilesInScreen))
                    for (let tile of outLibraryTileList) {
                        for (let item of tileBoundaryArr) {
                            if (Number(item.tileID) === Number(tile.tile_id)) {
                                item.sub_project_id = queryData.sub_project_id;
                                break;
                            }
                        }
                    }
                    this.$refs.drawMap.drawTileProjectBoundary(tileBoundaryArr);
                    // 添加网格属性信息
                    if (flag === "detail") {
                        for (let tile of tileList) {
                            for (let item of tilesInScreen) {
                                if (Number(item.tileID) === Number(tile.tile_id)) {
                                    item.city = tile.city;
                                    item.operation_lane_geometry_length = tile.operation_lane_geometry_length;
                                    item.status = String(tile.status);
                                    item.operator_name = tile.operator_name;
                                    item.operator_id = tile.operator_id;
                                    item.qc_operator_name = tile.qc_operator_name;
                                    item.qc_operator_id = tile.qc_operator_id;
                                    item.second_qc_operator_name = tile.second_qc_operator_name;
                                    item.second_qc_operator_id = tile.second_qc_operator_id;
                                    // item.sub_project_id = this.selectSubprojectID;
                                    item.admittance_level = tile.admittance_level;
                                    item.admittance_reason = tile.admittance_reason;
                                    item.isCurrent = tile.isCurrent;
                                    item.out_library_type = this.outLibraryAllTypes[tile.out_library_type];
                                    break;
                                }
                            }
                        }
                        this.$refs.drawMap.drawBaseTileMethod(tilesInScreen, this.assignmentsFormatter);
                    } else if (flag === "simple") {
                        for (let tile of tileList) {
                            for (let item of tilesInScreen) {
                                if (Number(item.tileID) === Number(tile.tile_id)) {
                                    item.status = String(tile.status);
                                    item.admittance_level = tile.admittance_level;
                                    item.admittance_reason = tile.admittance_reason;
                                    item.isCurrent = tile.isCurrent;
                                    break;
                                }
                            }
                        }
                        this.$refs.drawMap.drawBaseTileMethod(tilesInScreen);
                    }
                } else {
                    this.$refs.drawMap.drawBaseTileMethod(tilesInScreen);
                }
            });
        },
        assignmentsFormatter: function(params) {
            let zoomLevel;
            if (this.$refs.drawMap) {
                zoomLevel = this.$refs.drawMap.chartsInstance
                    .getModel()
                    .getComponent("bmap")
                    .getBMap()
                    .getZoom();
            }
            let res = `${params.data.name}\n`;
            if (validateData(params.data.city)) {
                res += `城市：${params.data.city}\n`;
            }
            if (validateData(params.data.operation_lane_geometry_length)) {
                let data = formatFloat5Value(params.data.operation_lane_geometry_length);
                // res += `数据里程：${data} km\n`;
                let tempStr = `数据里程：${data} km`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            if (validateData(params.data.status)) {
                let status = params.data.status;
                let show_status = "";
                if (this.search.selectSection === "3000") {
                    show_status = this.allowInInfo[status];
                } else {
                    show_status = this.assignmentsInfo[status];
                }
                res += `环节状态：${show_status}\n`;

                if (validateData(params.data.admittance_level)) {
                    let admittance_level = params.data.admittance_level;
                    let admittance_reason = params.data.admittance_reason;
                    let show_result = "";
                    let show_admittance_level = "";
                    if (admittance_level == "1") {
                        show_admittance_level = "A类";
                    } else if (admittance_level == "2") {
                        show_admittance_level = "B类";
                    } else if (admittance_level == "3") {
                        show_admittance_level = "C类";
                    }
                    let show_admittance_reason = "";
                    if (validateData(admittance_reason)) {
                        for (var reasonVal of admittance_reason) {
                            if (reasonVal == "1") {
                                show_admittance_reason += "点云分层错位 ";
                            } else if (reasonVal == "2") {
                                show_admittance_reason += "预处理效果差 ";
                            } else if (reasonVal == "3") {
                                show_admittance_reason += "点云图片不清晰 ";
                            }
                        }
                    }
                    if (status === "3004") {
                        show_result = show_admittance_level;
                    } else if (status === "3005") {
                        show_result = show_admittance_reason;
                    }
                    if (show_result.length !== 0 && this.search.selectSection === "3000") {
                        // res += `准入结果：${show_result}\n`;
                        let tempStr = `准入结果：${show_result}`;
                        let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                        res += str;
                    }
                }
            }
            if ((validateData(params.data.out_library_type))) {
                let tempStr = `出库类型：${params.data.out_library_type}`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            if (validateData(params.data.operator_name)) {
                let tempStr = `作业员：${params.data.operator_name}(${params.data.operator_id})`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            if (validateData(params.data.qc_operator_name)) {
                let tempStr = `一检员：${params.data.qc_operator_name}(${params.data.qc_operator_id})`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            if (validateData(params.data.second_qc_operator_name)) {
                let tempStr = `二检员：${params.data.second_qc_operator_name}(${params.data.second_qc_operator_id})`;
                // if (Number(zoomLevel) === 12) {
                //     let subStr = getSubString(tempStr, 24).split(",");
                //     for (let item of subStr) {
                //         res += `${item}\n`;
                //     }
                // } else {
                //     let subStr = getSubString(tempStr, 48).split(",");
                //     for (let item of subStr) {
                //         res += `${item}\n`;
                //     }
                // }
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            return res;
        },
        getSubStringWithZoom: function(zoomLevel, tempStr) {
            let res = '';
            if (Number(zoomLevel) === 12) {
                let subStr = getSubString(tempStr, 22).split(",");
                for (let item of subStr) {
                    res += `${item}\n`;
                }
            } else {
                let subStr = getSubString(tempStr, 48).split(",");
                for (let item of subStr) {
                    res += `${item}\n`;
                }
            }
            return res;
        },
        drawMapCall: function(data) {
            if (this.showMode === "Map") {
                this.$refs.tilesTables.clearSelection();
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    this.multipleTileSelection[i] = [];
                }
                if (data.length) {
                    for (var index in this.tilesTable) {
                        var page = Math.floor(index / this.filter.perPage);
                        for (let val of data) {
                            if (this.tilesTable[index].tile_id == val) {
                                this.multipleTileSelection[page].push(this.tilesTable[index]);
                            }
                        }
                    }
                }
                this.selectNumber = data.length;
                this.selectAllFlag = this.selectNumber == this.totalNumber;
                // let multipleTileSelection = this.multipleTileSelection;
                // this.multipleTileSelection[this.filter.currentPage - 1] = [];
                // for (let tileId of data) {
                //     for (let item of this.tableData) {
                //         if (item.tile_id == tileId) {
                //             this.multipleTileSelection[this.filter.currentPage - 1].push(item);
                //         }
                //     }
                // }
            }
        },
        changeChecked: function() {
            // 自动选择功能  需要判断子项目ID
            if (validateData(this.nowSearchSubprojectID)) {
                this.multipleTileSelection[this.filter.currentPage - 1] = [];
                for (var tileID of this.tileList) {
                    for (var item of this.tableData) {
                        if (item.tile_id == tileID) {
                            this.multipleTileSelection[this.filter.currentPage - 1].push(item);
                        }
                    }
                }
            }
        },
        getTaskPackageInfo: function(obj) {
            let { tilesInScreen, flag } = obj;
            let queryData = {
                sub_project_id: this.nowSelectSubprojectID,
                operation_segment: this.search.selectSection
            };
            let tilesArr = [];
            for (let tile of tilesInScreen) {
                tilesArr.push(tile.tileID);
            }
            queryData["tile_list"] = tilesArr.join(",");
            this.$http.post("/api/query_visible_task_package_info", queryData).then(response => {
                response = response.body;
                let data = response.data;
                if (data.errno === 0) {
                    let tileList = data.data.tile_list;
                    for (let tile of tileList) {
                        for (let item of tilesInScreen) {
                            if (Number(item.tileID) === Number(tile.tile_id)) {
                                item.pre_orign_operation_task_id = tile.pre_orign_operation_task_id;
                                item.current_orign_operation_task_id = tile.current_orign_operation_task_id;
                                break;
                            }
                        }
                    }
                    this.$refs.drawMap.drawTilePackageBoundary(tilesInScreen);
                }
            });
        },
        handleClick(val) {
            if (val.name === "List") {
                this.totalNumber = this.listModeTotalNumber;
            } else if (val.name === "Map" && this.tilesTable.length != this.totalNumber) {
                this.searchTiles({
                    return_all: 1,
                    isSelect: 3
                });
            }
            if (val.name === "Map") {
                let boundaryStyle = {
                    strokeWeight: 1.5,
                    strokeColor: '#000',
                    // strokeColor: "#409EFF",
                    // strokeColor: '#DC143C',
                    fillOpacity: 0.1,
                    fillColor: "#409EFF"
                    // strokeStyle: 'dashed',
                };
                if (this.$refs.drawMap && this.selectProjectCityList) {
                    drawCityBoundary(
                        this.$refs.drawMap.chartsInstance,
                        this.selectProjectCityList,
                        true,
                        false,
                        boundaryStyle
                    );
                }
            }
        },
        drawMapInfo: function(data) {
            let that = data;
            // let boundaryStyle = {
            //     strokeWeight: 1.5,
            //     strokeColor: "#409EFF",
            //     // strokeColor: '#DC143C',
            //     fillOpacity: 0.1,
            //     fillColor: "#409EFF"
            //     // strokeStyle: 'dashed',
            // };
            // if (this.selectProjectCityList) {
            //     drawCityBoundary(that.chartsInstance, this.selectProjectCityList, true, false, boundaryStyle);
            // }

            // 设置地图默认展示城市为子项目下第一个网格所在城市
            let initCity = "";
            if (this.tilesTable.length) {
                initCity = this.tilesTable[0].city_name;
            }
            // 全选时不重新定位城市
            if (!this.selectAllFlag) {
                setMapCity(that, initCity);
            }
        },
        getSelectDatas: function() {
            let tileIDS = "";
            let tileString = "";
            let postTileIDS = [];
            let tileList = [];
            for (var val of this.multipleTileSelection) {
                if (val) {
                    for (var item of val) {
                        tileList.push({
                            tile_id: item.tile_id,
                            sub_project_id: item.sub_project_id,
                            tile_level: item.tile_level
                        });
                        postTileIDS.push(parseInt(item.tile_id));
                        if (tileIDS) {
                            tileIDS = tileIDS + ";" + item.tile_id;
                        } else {
                            tileIDS = item.tile_id;
                        }
                        if (item.update_wy_number === "0") {
                            if (tileString) {
                                tileString = tileString + "；" + item.tile_id;
                            } else {
                                tileString = item.tile_id;
                            }
                        }
                    }
                }
            }
            this.selectNumber = postTileIDS.length;
            this.selectAllFlag = this.selectNumber == this.totalNumber;
            this.tileList = postTileIDS;
            return {
                tileIDS: tileIDS,
                tileString: tileString,
                postTileIDS: postTileIDS,
                tileList: tileList
            };
        },
        openDialogRandomSelect: function() {
            if (this.onSubjectStatus == 4) {
                return alertInfo(this, "error", "完结的项目不支持随机抽检");
            }
            if (this.onSubjectStatus == 5) {
                return alertInfo(this, "error", "作废的项目不支持随机抽检");
            }
            if (this.onSubjectStatus == 6) {
                return alertInfo(this, "error", "暂停的项目不支持随机抽检");
            }
            if (!validateData(this.nowSelectSubprojectID)) {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                return;
            }
            this.dialogRandomSelect = !this.dialogRandomSelect;
        },
        Recommend: function() {
            if (this.onSubjectStatus == 4) {
                return alertInfo(this, "error", "完结的项目不支持接边推荐");
            }
            if (this.onSubjectStatus == 5) {
                return alertInfo(this, "error", "作废的项目不支持接边推荐");
            }
            if (this.onSubjectStatus == 6) {
                return alertInfo(this, "error", "暂停的项目不支持接边推荐");
            }
            if (this.nowSelectSubprojectID != "0") {
                if (this.tableData.length !== 0) {
                    let data = {
                        sub_project_id: this.tableData[0].sub_project_id,
                        operation_segment: this.search.selectSection
                    };
                    let url = "city_edge_recommend";
                    this.reqInten(url, data);
                }
            } else {
                alertInfo(this, "warning", "选择一个子项目进行筛选后才支持接边推荐!");
            }
        },
        reqInten: function(url, data) {
            this.$http.post("/api/" + url, data).then(res => {
                let { errno: error, msg, data: { edge_tile_list: data } } = res.body.data;
                if (error === 0 && data) {
                    alertInfo(this, "success", "接边推荐成功!");
                    this.searchTiles({
                        // 获取全部数据
                        return_all: 1,
                        isSelect: 2,
                        tileList: data.join(";")
                    });
                } else {
                    alertInfo(this, "error", "请求错误!" + msg);
                }
            });
        },
        changeEvent: function(val) {
            // v_s：调用项目状态赋值的方法
            // v_s: 方法参数 1、要遍历的数组2、要赋值的对象名称3、要赋的值4、赋值的方向（子传父，父传子）
            parentSonPassVal(this.forArrSelectDiv, "项目状态", val, "son_parent");
        },
        /*selectPassResultChange: function(val) {
                if (val.length > 1) {
                    var selectAllIndex = val.indexOf("");
                    if (selectAllIndex == 0) {
                        this.search.selectAllowInPassResult.splice(selectAllIndex,1);
                    } else if (selectAllIndex > 0) {
                        this.search.selectAllowInPassResult = [""];
                    }
                }
                this.dialogRandomSelect = !this.dialogRandomSelect;
            },
            selectFailResultChange: function(val) {
                if (val.length > 1) {
                    var selectAllIndex = val.indexOf("");
                    if (selectAllIndex == 0) {
                        this.search.selectAllowInFailResult.splice(selectAllIndex,1);
                    } else if (selectAllIndex > 0) {
                        this.search.selectAllowInFailResult = [""];
                    }
                }
            },*/
        editTile: function(index) {
            if (this.onSubjectStatus == 4) {
                return alertInfo(this, "error", "完结的项目不支持编辑");
            }
            if (this.onSubjectStatus == 5) {
                return alertInfo(this, "error", "作废的项目不支持编辑");
            }
            if (this.onSubjectStatus == 6) {
                return alertInfo(this, "error", "暂停的项目不支持编辑");
            }
            this.editTileData = JSON.parse(JSON.stringify(this.tableData[index]));
            let defaultCity = this.editTileData.city_name;
            for (let item of cityData.children) {
                if (item.value == defaultCity) {
                    this.selectedCitys = [defaultCity, defaultCity];
                    break;
                } else {
                    if (item.children) {
                        for (let childItem of item.children) {
                            if (childItem.value == defaultCity) {
                                this.selectedCitys = [item.value, defaultCity];
                                break;
                            }
                        }
                    }
                }
            }
            this.dialogEditTileVisible = true;
        },
        cityChange: function(val) {
            if (val.length == 2) {
                this.editTileData.city_name = val[1];
            } else if (val.length == 1) {
                this.editTileData.city_name = val[0];
            } else {
                this.editTileData.city_name = "";
            }
        },
        submitEditTile: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var editData = {
                        user_id: this.search.userId,
                        tile_id: this.editTileData.tile_id,
                        sub_project_id: this.editTileData.sub_project_id,
                        master_library_id: this.editTileData.master_library_id,
                        city_name: this.editTileData.city_name,
                        operation_segment: this.search.selectSection,
                        data_standard_version: this.editTileData.data_standard_version,
                        memo: this.editTileData.memo
                    };
                    this.$http.post("/api/modify_tile_info", editData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "作业网格信息编辑成功", () => {
                                this.dialogEditTileVisible = false;
                                this.searchTiles();
                            });
                        } else {
                            alertInfo(this, "error", "作业网格信息编辑失败，" + data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //查询网格信息
        searchTiles: function(arg) {
            this.assignData.selectTaskType = this.search.selectSection;
            this.sectionChange.currentTaskType = this.search.selectSection;
            this.sectionChange.subProjectID = this.search.selectSubprojectID;
            this.randomSelect.subProjectID = this.search.selectSubprojectID;
            this.randomSelect.selectTaskType = this.search.selectSection;
            this.nowSelectSubprojectID = this.search.selectSubprojectID;
            this.isSelectSubproject = validateData(this.search.selectSubprojectID);
            this.selectOperationSegmen = this.search.selectSection;
            this.emptyText = "查询中";
            var query_tilesdata = {
                project_status: reQpassVal(this.forArrSelectDiv, "项目状态"), // v_s: 项目状态
                user_id: sessionStorage.userid,
                operation_segment: this.search.selectSection,
                operation_sequence: 0,
                status: this.search.selectState,
                query_start_time: "",
                query_end_time: "",
                project_id: this.search.selectProjectID,
                sub_project_id: this.search.selectSubprojectID,
                sampling_status: this.search.selectRandomSelectState,
                out_library_type: this.search.outLibraryType,
                city_name: this.search.cityName,
                orign_operation_task_id: 0,
                tile_level: 0,
                query_or_export_data: 0,
                sort_field_name: this.search.sort_field_name,
                admittance_level: this.search.selectAllowInPassResult,
                admittance_reason: this.search.selectAllowInFailResult,
                page_index: this.filter.currentPage,
                page_size: this.filter.perPage,
                return_all: arg && arg.return_all ? arg.return_all : 2,
                operator_name: this.search.userSelect,
                tile_id_list: this.search.tileID
            };
            // this.nowQueryTileData = query_tilesdata;
            this.onSubjectStatus = reQpassVal(this.forArrSelectDiv, "项目状态");
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
            this.search.project_status = this.forArrSelectDiv[0].objectType; // v_s:给导出按钮执行赋值状态数据
            this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
            this.searchDatas.page_index = this.filter.currentPage;
            this.searchDatas.page_size = this.filter.perPage;
            this.nowQueryTileData = this.searchDatas;
            this.$http.post("/api/query_total_tile_op_info", this.searchDatas).then(
                response => {
                    this.loading = false;
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0 || data.errno === 7) {
                        if (data.errno === 7) {
                            this.emptyText = "未查询到符合条件的数据";
                        } else {
                            this.totalNumber = data.data.total_number;
                            this.listModeTotalNumber = this.totalNumber;
                            if (this.totalNumber == 0) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.emptyText = "加载中";
                            }
                            if (arg && arg.return_all) {
                                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                                this.tilesTable = Object.assign([], this.tilesTable, data.data.tile_operation_info);
                                if (arg && arg.return_all && arg.isSelect) {
                                    if (arg.isSelect === 1) {
                                        this.refreshSelectTiles(this.randomSelect.randomSelectString);
                                        this.getSelectDatas();
                                    } else if (arg.isSelect === 2) {
                                        this.refreshSelectTiles(arg.tileList);
                                        this.getSelectDatas();
                                    } else if (arg.isSelect === 3) {
                                        // 更新选择网格的存储及勾选状态
                                        this.refreshSelectTiles(this.tileList.join(';'));
                                    }
                                    return;
                                }
                                for (var i = 0; i < pagesNumber; i++) {
                                    this.multipleTileSelection[i] = this.tilesTable.slice(
                                        i * this.filter.perPage,
                                        (i + 1) * this.filter.perPage
                                    );
                                }
                                this.$refs.tilesTables.clearSelection();
                                this.tableData.forEach(row => {
                                    this.$refs.tilesTables.toggleRowSelection(row);
                                });
                                this.assignDataSet();
                            } else {
                                this.tilesTable = data.data.tile_operation_info;
                            }
                            this.$refs.drawMap.reset();
                            // this.changeChecked();
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
        onSearch: function(event) {
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.dialogRandomSelect = false;
            this.tileList = [];
            if (this.showMode === "Map") {
                this.showMode = "List";
            }
            this.searchTiles(event);
        },
        //刷新按钮响应事件
        onRefresh: function(event) {
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.search.selectState = "";
            this.search.selectRandomSelectState = "";
            this.search.outLibraryType = "";
            this.dialogRandomSelect = false;
            this.search.cityName = "";
            if (this.$refs.tilesTables) {
                this.$refs.tilesTables.clearSort();
            }
            this.search.sort_field_name = "tile_id desc";
            this.selectedCitys = [];
            this.search.userSelect = "";
            if (event !== "sectionChange") {
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
                this.searchTiles(); // selectSectionChange方法触发刷新时 调用查询信息的功能
            }
            this.tileList = [];
            if (this.showMode === "Map") {
                this.showMode = "List";
            }
        },
        selectSectionChange: function() {
            // Tabs标签页调用方法
            sessionStorage.selectSectionWork = this.search.selectSection;
            this.showMode = "List";
            this.onRefresh("sectionChange");
            if (this.search.selectSection === "3000") {
                this.routerParams = "assignments3000";
            } else {
                this.routerParams = "assignments";
            }
        },
        //查询输入框格式校验
        formatSearchInput: function() {
            this.search.tileID = inputCheck(this, this.search.tileID, 1);
            sessionStorage.tileID = this.search.tileID;
        },
        //排序
        sortTable: function(val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "tile_id desc";
            }
            this.onSearch();
        },
        //每页展示条数变化
        pageSizeChange: function(val) {
            this.multipleTileSelection = [];
            this.filter.perPage = val;
            this.onSearch({
                loading: true
            });
        },
        //页面切换
        pageCurrentChange: function(val) {
            this.priorPage = this.filter.currentPage;
            this.filter.currentPage = val;
            if(this.tilesTable.length == this.totalNumber){
                return
            };
            this.searchTiles({
                loading: true
            });
        },
        selectAll: function() {
            if (this.selectAllFlag) {
                this.searchTiles({
                    return_all: 1
                });
            } else {
                this.multipleTileSelection = [];
                this.$refs.tilesTables.clearSelection();
                this.assignDataSet();
            }
        },
        //勾选记录,单选或多选，按页存储
        tileSelectionChange: function(val, row) {
            //某行被点击后，将该页选中的信息存储到数组
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
            this.assignDataSet();
        },
        //读取选中网格数据，设置分配任务所需数据
        assignDataSet: function() {
            var tileIDS = "";
            this.assignData.postTileS = [];
            this.assignData.dataNumber = 1;
            let postTileIDS = [];
            if (this.multipleTileSelection) {
                for (var val of this.multipleTileSelection) {
                    if (val) {
                        for (var item of val) {
                            this.assignData.subProjectID = item.sub_project_id;
                            //this.assignData.dataNumber += item.data_number;
                            this.assignData.tileLevel = item.tile_level;
                            this.assignData.selectTaskType = item.operation_segment;
                            var tmpTile = {};
                            postTileIDS.push(parseInt(item.tile_id));
                            tmpTile.tile_id = item.tile_id;
                            tmpTile.tile_level = item.tile_level;
                            //tmpTile.data_number = item.data_number;
                            this.assignData.postTileS.push(tmpTile);
                            if (tileIDS) {
                                tileIDS = tileIDS + ";" + item.tile_id;
                            } else {
                                tileIDS = item.tile_id;
                            }
                        }
                    }
                }
                this.tileList = postTileIDS;
                this.assignData.tileIDS = tileIDS;
                this.selectNumber = this.assignData.postTileS.length;
                this.selectAllFlag = this.selectNumber == this.totalNumber;
            }
        },
        //生成任务包按钮响应函数
        assignTasks: function() {
            if (this.onSubjectStatus == 4) {
                return alertInfo(this, "error", "完结的项目不支持生成任务包");
            }
            if (this.onSubjectStatus == 5) {
                return alertInfo(this, "error", "作废的项目不支持生成任务包");
            }
            if (this.onSubjectStatus == 6) {
                return alertInfo(this, "error", "暂停的项目不支持生成任务包");
            }
            if (!validateData(this.nowSelectSubprojectID)) {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                return;
            }
            if (this.selectNumber == 0) {
                //判断是否选择了网格
                return alertInfo(this, "warning", "请选择一个或多个未生成任务包的网格");
            }
            for (let val of this.multipleTileSelection) {
                for (let item of val) {
                    if (item.status != "10") {
                        alertInfo(this, "warning", "图幅不是未生产任务包状态，请重新选择");
                        return;
                    }
                }
            }
            this.assignDataSet();
            //弹出对话框
            this.dialogAssignVisible = true;
            // 拉取作业员列表
            this.operationUser();
        },
        //读取选中网格数据，设置环节流转所需数据
        sectionChangeDataSet: function() {
            var tileIDS = "";
            this.sectionChange.postTileS = [];
            if (this.multipleTileSelection) {
                for (var val of this.multipleTileSelection) {
                    if (val) {
                        for (var item of val) {
                            this.sectionChange.tileLevel = item.tile_level;
                            this.sectionChange.postTileS.push(item.tile_id);
                            if (tileIDS) {
                                tileIDS = tileIDS + ";" + item.tile_id;
                            } else {
                                tileIDS = item.tile_id;
                            }
                        }
                    }
                }
                this.sectionChange.tileIDS = tileIDS;
            }
        },
        OpenFun: function() {
            this.linkVal = this.sectionChange.NextTaskType;
        },
        linkJump: function(val) {
            let num = Number(this.linkVal);
            let currentnum = Number(val);
            if(num !== 3000 && num <= val) {
                this.sectionChange.NextTaskType = val;
            } else {
                this.sectionChange.NextTaskType = this.linkVal;
                alertInfo(this, "error", "环节人工流转只允许向后流转！");
            }
        },
        //环节流转按钮响应
        SectionChange: function() {
            if (this.onSubjectStatus == 4) {
                return alertInfo(this, "error", "完结的项目不支持环节人工流转");
            }
            if (this.onSubjectStatus == 5) {
                return alertInfo(this, "error", "作废的项目不支持环节人工流转");
            }
            if (this.onSubjectStatus == 6) {
                return alertInfo(this, "error", "暂停的项目不支持环节人工流转");
            }
            if (!validateData(this.nowSelectSubprojectID)) {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                return;
            }
            this.sectionChangeDataSet();
            this.suggestNextType();
            this.dialogSectionChangeVisible = true;
        },
        suggestNextType: function() {
            //推荐下一环节的选择
            if (this.sectionChange.currentTaskType == "38") {
                this.sectionChange.NextTaskType = "38";
            } else if (this.sectionChange.currentTaskType == "3000") {
                this.sectionChange.NextTaskType = "30";
            } else {
                this.sectionChange.NextTaskType = "" + (parseInt(this.sectionChange.currentTaskType) + 2);
            }
        },
        //随机抽检按钮响应函数
        submitRandomSection: function() {
            if (!validateData(this.nowSelectSubprojectID)) {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                return;
            }
            this.$refs["randomSelect"].validate(valid => {
                if (valid) {
                    var postRandomSelectData = {
                        user_id: sessionStorage.userid,
                        sub_project_id: this.randomSelect.subProjectID,
                        operation_segment: this.randomSelect.selectTaskType,
                        qc_round: 2,
                        qc_sampling_ratio: this.randomSelect.randomSelectRatio,
                        sampling_detail_info_list: {},
                        refresh_or_confirm: 1
                    };
                    this.$http.post("/api/quality_check_sampling", postRandomSelectData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            this.randomSelect.randomSelectString = "";
                            if (data.data.sampling_detail_info_list) {
                                for (var key in data.data.sampling_detail_info_list) {
                                    if (this.randomSelect.randomSelectString) {
                                        this.randomSelect.randomSelectString +=
                                            ";" + data.data.sampling_detail_info_list[key].hit_tile_list.join(";");
                                    } else {
                                        this.randomSelect.randomSelectString += data.data.sampling_detail_info_list[
                                            key
                                        ].hit_tile_list.join(";");
                                    }
                                    this.refreshSelectTiles(this.randomSelect.randomSelectString);
                                }
                                this.searchTiles({
                                    return_all: 1,
                                    isSelect: 1
                                });
                            }
                            alertInfo(
                                this,
                                "success",
                                "随机抽检成功，随机抽检比例为：" + this.randomSelect.randomSelectRatio,
                                () => {
                                    this.dialogRandomSelect = false;
                                }
                            );
                        } else {
                            alertInfo(this, "error", "随机抽检失败，" + data.msg);
                        }
                        this.dialogRandomSelect = false;
                    });
                }
            });
        },
        //根据勾选网格信息获取占比信息
        getRandomSelectInfos: function() {
            if (this.onSubjectStatus == 4) {
                return alertInfo(this, "error", "完结的项目不支持抽检");
            }
            if (this.onSubjectStatus == 5) {
                return alertInfo(this, "error", "作废的项目不支持抽检");
            }
            if (this.onSubjectStatus == 6) {
                return alertInfo(this, "error", "暂停的项目不支持抽检");
            }
            if (!validateData(this.nowSelectSubprojectID)) {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
                return;
            }
            this.randomSelect.randomSelectTileLists = {};
            if (this.multipleTileSelection) {
                for (var val of this.multipleTileSelection) {
                    if (val) {
                        for (var item of val) {
                            if (this.randomSelect.randomSelectTileLists[item.orign_operation_task_id]) {
                                this.randomSelect.randomSelectTileLists[
                                    item.orign_operation_task_id
                                ].hit_tile_list.push(item.tile_id);
                            } else {
                                this.randomSelect.randomSelectTileLists[item.orign_operation_task_id] = {
                                    hit_tile_list: [item.tile_id]
                                };
                            }
                        }
                    }
                }
            }
            var postRandomSelectInfoData = {
                user_id: sessionStorage.userid,
                sub_project_id: this.randomSelect.subProjectID,
                operation_segment: this.randomSelect.selectTaskType,
                qc_round: 2,
                qc_sampling_ratio: "",
                sampling_detail_info_list: this.randomSelect.randomSelectTileLists,
                refresh_or_confirm: 2
            };
            this.$http.post("/api/quality_check_sampling", postRandomSelectInfoData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    this.randomSelect.randomSelectString = "";
                    this.finalQualityCheckTileInfos.selectTileList = "";
                    this.finalQualityCheckTileInfos.unselectTileList = "";
                    this.finalQualityCheckTileInfos.hitTileNumber = data.data.hit_tile_number;
                    this.finalQualityCheckTileInfos.hitTileMileage = data.data.hit_tile_mileage;
                    this.finalQualityCheckTileInfos.waitTileNumber = data.data.wait_tile_number;
                    this.finalQualityCheckTileInfos.waitTileMileage = data.data.wait_tile_mileage;
                    this.finalQualityCheckTileInfos.totalHitTileNumber = data.data.total_hit_tile_number;
                    this.finalQualityCheckTileInfos.totalHitTileMileage = data.data.total_hit_tile_mileage;
                    this.finalQualityCheckTileInfos.totalTileNumber = data.data.total_tile_number;
                    this.finalQualityCheckTileInfos.totalTileMileage = data.data.total_tile_mileage;
                    this.finalQualityCheckTileInfos.selectTileNumberRatioInWaitingTiles =
                        data.data.wait_sampling_hit_tile_number_ratio;
                    this.finalQualityCheckTileInfos.selectTileMileRatioInWaitingTiles =
                        data.data.wait_sampling_hit_tile_mileage_ratio;
                    this.finalQualityCheckTileInfos.selectTileNumberRatioInTotalTiles =
                        data.data.total_hit_tile_number_ratio;
                    this.finalQualityCheckTileInfos.selectTileMileRatioInTotalTiles =
                        data.data.total_hit_tile_mileage_ratio;
                    //根据返回结果分别存储
                    if (data.data.sampling_detail_info_list) {
                        for (var key in data.data.sampling_detail_info_list) {
                            //选中的
                            if (this.randomSelect.randomSelectString) {
                                if (data.data.sampling_detail_info_list[key].hit_tile_list.length) {
                                    this.randomSelect.randomSelectString +=
                                        ";" + data.data.sampling_detail_info_list[key].hit_tile_list.join(";");
                                }
                            } else {
                                this.randomSelect.randomSelectString += data.data.sampling_detail_info_list[
                                    key
                                ].hit_tile_list.join(";");
                            }
                            //未选中的
                            if (this.finalQualityCheckTileInfos.unselectTileList) {
                                if (data.data.sampling_detail_info_list[key].unhit_tile_list.length) {
                                    this.finalQualityCheckTileInfos.unselectTileList +=
                                        ";" + data.data.sampling_detail_info_list[key].unhit_tile_list.join(";");
                                }
                            } else {
                                this.finalQualityCheckTileInfos.unselectTileList += data.data.sampling_detail_info_list[
                                    key
                                ].unhit_tile_list.join(";");
                            }
                        }
                        this.finalQualityCheckTileInfos.selectTileList = this.randomSelect.randomSelectString;
                        //将选中的勾选
                        if (this.randomSelect.randomSelectString) {
                            this.refreshSelectTiles(this.randomSelect.randomSelectString);
                        }
                    }
                    this.dialogSelectQualityCheck = true;
                } else {
                    alertInfo(this, "error", "查询占比信息失败，" + data.msg);
                }
            });
        },
        submitQualityCheck: function() {
            var submitRandomSelectInfoData = {
                user_id: sessionStorage.userid,
                sub_project_id: this.randomSelect.subProjectID,
                operation_segment: this.randomSelect.selectTaskType,
                qc_round: 2,
                qc_sampling_ratio: "",
                sampling_detail_info_list: this.randomSelect.randomSelectTileLists,
                refresh_or_confirm: 3
            };
            this.$http.post("/api/quality_check_sampling", submitRandomSelectInfoData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(this, "success", "二检抽检成功，抽检编号：" + data.data.sampling_task_id, () => {
                        this.dialogSelectQualityCheck = false;
                        this.onSearch();
                    });
                } else {
                    alertInfo(this, "error", "二检抽检失败，" + data.msg);
                }
            });
        },
        //生成并分配任务包的输入内容校验
        formatAssignInput: function() {
            this.assignData.tileIDS = inputCheck(this, this.assignData.tileIDS, 2);
        },
        //环节人工流转的输入内容校验
        formatSectionChangeInput: function() {
            this.sectionChange.tileIDS = inputCheck(this, this.sectionChange.tileIDS, 2);
        },
        formatRandomRatio: function() {
            var regex = /^[0-9.]+$/;
            if (this.randomSelect.randomSelectRatio) {
                if (!regex.test(this.randomSelect.randomSelectRatio)) {
                    //alert('用户名可用!');
                    this.$message({
                        message: "存在非法字符",
                        type: "warning",
                        duration: 1000
                    });
                }
            }
        },
        //对输入网格在列表内进行相应勾选
        refreshSelectTiles: function(str) {
            var inputTileIds = str.split(";");
            var tableIDs = [];
            for (var val of this.tilesTable) {
                tableIDs.push(val.tile_id);
            }
            var notExistArray = [];
            var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
            //对于当前页中原先选中如今未选中的取消选中状态
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
                    var inpage = Math.floor(tableindex / this.filter.perPage); //判断网格在第几页
                    // console.log(this.multipleTileSelection[inpage]);
                    if (this.multipleTileSelection[inpage]) {
                        //网格所在页是否已有选中的网格
                        // console.log(this.multipleTileSelection[inpage].length);
                        if (this.multipleTileSelection[inpage].length) {
                            var thisPageSelectIDs = [];
                            for (var seltile of this.multipleTileSelection[inpage]) {
                                thisPageSelectIDs.push(seltile.tile_id);
                            }
                            var index = thisPageSelectIDs.indexOf(sel);
                            // console.log('在选中数组中的位置'+index);
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
                                    for (let i in this.tableData) {
                                        if (this.tableData[i].tile_id == this.tilesTable[tableindex].tile_id) {
                                            this.$refs.tilesTables.toggleRowSelection(this.tableData[i]);
                                        }
                                    }
                                }
                            }
                        } else {
                            this.multipleTileSelection[inpage] = this.tilesTable.slice(tableindex, tableindex + 1);
                            if (this.filter.currentPage === inpage + 1) {
                                for (let i in this.tableData) {
                                    if (this.tableData[i].tile_id == this.tilesTable[tableindex].tile_id) {
                                        this.$refs.tilesTables.toggleRowSelection(this.tableData[i]);
                                    }
                                }
                            }
                        }
                    } else {
                        //网格所在页没有已选中网格
                        this.multipleTileSelection[inpage] = this.tilesTable.slice(tableindex, tableindex + 1);
                        if (this.filter.currentPage === inpage + 1) {
                            for (let i in this.tableData) {
                                if (this.tableData[i].tile_id == this.tilesTable[tableindex].tile_id) {
                                    this.$refs.tilesTables.toggleRowSelection(this.tableData[i]);
                                }
                            }
                        }
                        //console.log(this.multipleTileSelection[inpage]);
                    }
                } else {
                    if (sel) {
                        notExistArray.push(sel);
                    }
                }
            }
            var notexistString = "";
            if (notExistArray.length) {
                notexistString = notExistArray.join("；");
                alertInfo(this, "warning", "不存在的网格ID：" + notexistString);
            }
            this.assignDataSet();
            this.sectionChangeDataSet();
        },
        //生成任务并分配
        submitAssigForm: function() {
            this.assignDataSet();
            this.$refs["assignData"].validate(valid => {
                if (valid) {
                    this.submitAssigFormData();
                }
            });
        },
        submitAssigFormData: function() {
            var postassignData = {
                user_id: sessionStorage.userid,
                operator_id: this.assignData.selectWorker,
                qc_operator_id: this.assignData.selectQcWorker,
                sub_project_id: this.assignData.subProjectID,
                operation_task_id: 0,
                operation_segment: this.assignData.selectTaskType,
                data_number: this.assignData.dataNumber,
                tile_level: this.assignData.tileLevel,
                tile_number: this.assignData.postTileS.length,
                tile_list: this.assignData.postTileS
            };
            this.$http.post("/api/operation_task_assign", postassignData).then(response => {
                response = response.body;
                var data = response.data;
                if (data) {
                    if (data.errno === 0) {
                        if (data.data.operation_segment !== "3000") {
                            alertInfo(this, "success", "生成任务包成功，作业员ID：" + data.data.operator_id, () => {
                                this.dialogAssignVisible = false;
                                this.onSearch();
                            });
                        } else {
                            alertInfo(this, "success", "生成任务包成功，质检员ID：" + data.data.qc_operator_id, () => {
                                this.dialogAssignVisible = false;
                                this.onSearch();
                            });
                        }
                    } else {
                        alertInfo(this, "error", "生成任务包失败，" + data.msg);
                    }
                }
            });
        },
        //流转函数
        submitSectionChange: function() {
            const strNum = (this.sectionChange.NextTaskType - 2).toString();
            //  v_s: 判断是否选择了该环节的所有网格
            if (this.totalNumber != "0" && this.totalNumber == this.selectNumber) {
                // 这里要给一个参数发送给后端让其支持跨环节流转
            } else {
                // selectSection 当前环节    NextTaskType用户选择的环节
                //  判断用户选择的环节是否是推荐的环节  strNum :用户所选择的环节
                if (this.search.selectSection !== strNum) {
                    // v_s: 判断是否是跨环节流转
                    if (!(this.sectionChange.NextTaskType == "30" && this.search.selectSection == "3000")) {
                        return alertInfo(this, "warning", "只有该环节所有网格全部选中后才支持跨环节流转！");
                    }
                }
            }
            this.sectionChangeDataSet();
            this.$refs["sectionChange"].validate(valid => {
                if (valid) {
                    var postassignData = {
                        user_id: sessionStorage.userid,
                        sub_project_id: this.sectionChange.subProjectID,
                        segment_from: this.sectionChange.currentTaskType,
                        segment_to: this.sectionChange.NextTaskType,
                        tile_level: this.sectionChange.tileLevel,
                        tile_list: this.sectionChange.postTileS
                    };
                    this.$http.post("/api/operation_segment_from_to", postassignData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "环节人工流转成功", () => {
                                this.dialogSectionChangeVisible = false;
                                this.onSearch();
                            });
                        } else {
                            alertInfo(this, "error", "环节人工流转失败，" + data.msg);
                        }
                    });
                }
            });
        },
        //选择的作业员和质检员变化时的响应函数
        workerChange: function(val) {
            if (val.length === 2) {
                if (this.assignData.selectTaskType !== "3000") {
                    Vue.set(this.selectWorkInfo, 0, val[0]);
                    Vue.set(this.selectWorkInfo, 1, val[1]);
                    this.assignData.selectWorker = val[1];
                    this.assignData.selectQcWorker = "";
                } else {
                    Vue.set(this.selectQcInfo, 0, val[0]);
                    Vue.set(this.selectQcInfo, 1, val[1]);
                    this.assignData.selectQcWorker = val[1];
                    this.assignData.selectWorker = "";
                }
            } else {
                this.selectWorkInfo = [];
                this.selectQcInfo = [];
                this.assignData.selectWorker = "";
                this.assignData.selectQcWorker = "";
            }
        },
        //级联选择框内，依据是否有下属作业员，判定作业组长是否可点击
        operatorVisible: function(val) {
            if (val) {
                if (this.ChangeOnselect === false) {
                    for (var item of this.workerOptions) {
                        if (!item.children.length) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    }
                    for (var item of this.qcOptions) {
                        if (!item.children.length) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    }
                }
            }
        },
        //获取作业员信息
        operationUser: function() {
            this.workerOptions = [];
            this.qcOptions = [];
            let userId = {
                user_return_all: 1 //v_s: 后端接口字段改了
            };
            this.$http.post("/api/query_all_user", userId).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    data.data.operation_headman_user_info.forEach((headInfo, index) => {
                        var workerUser = [];
                        headInfo.user_info.forEach((userInfo, index) => {
                            workerUser.push({
                                label: userInfo.user_name,
                                value: String(userInfo.user_id)
                            });
                        });
                        this.workerOptions.push({
                            label: headInfo.user_name,
                            value: String(headInfo.user_id),
                            children: workerUser
                        });
                    });
                    data.data.qc_headman_user_info.forEach((headInfo, index) => {
                        var qcUser = [];
                        headInfo.user_info.forEach((userInfo, index) => {
                            qcUser.push({
                                label: userInfo.user_name,
                                value: String(userInfo.user_id)
                            });
                        });
                        this.qcOptions.push({
                            label: headInfo.user_name,
                            value: String(headInfo.user_id),
                            children: qcUser
                        });
                    });
                }
            });
        },
        SelectProjects: function(data) {
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
                this.searchTiles();
            }
            this.getProjectCityList(this.search.selectProjectID, this.search.selectSubprojectID);
        },
        updateProjectStatus: function(data) {
            this.resetselectProjectData = false;
        },
        getProjectCityList: function(selectProjectID, selectSubprojectID) {
            this.selectProjectCityList = [];
            this.$http
                .post("/api/query_project_info", {
                    user_id: sessionStorage.userid,
                    project_id: selectProjectID,
                    sub_project_id: selectSubprojectID,
                    query_type: 2 //查询项目的城市信息
                })
                .then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        this.selectProjectCityList = data.data.city_list;
                    } else {
                        // messageInfo(this, "error", "获取所选项目的城市列表失败, 错误码：" + data.errno, 0, true);
                    }
                });
        }
    }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.el-popover,
.el-popper {
    z-index: 10000001 !important;
}
</style>

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

    .selectSectionDiv {
        margin: 0 0 15px 10px;
        width: $width;
        text-align: left;
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
        width: 240px;
    }

    .tab-area {
        width: $width;
        margin: 10px auto 0px auto;
        padding: 8px 15px 0px 15px;
        background: #fff;
        position: relative;
    }
    .download {
        position: absolute;
        top: 0;
        left: 215px;
        pointer-events: auto;
    }
    .button-area {
        margin: -65px auto 0px auto;
        position: absolute;
        right: 20px;
        pointer-events: auto;
    }
    .show-area {
        width: $width;
        margin: 0px 0px 10px 0px;
        padding: 0px 0 30px 0;
        background: #fff;
        opacity: 1;
        .btn-list {
            width: 97%;
            height: 40px;
            margin: 20px auto 0px auto;
        }
        span {
            float: left;
            font-size: 20px;
            text-align: left;
            line-height: 40px;
            font-weight: bold;
            margin: 5px 10px 5px 10px;
        }
        .span-left {
            margin: 5px 0px 5px 0px;
        }
        .span-right {
            margin: 5px 10px 5px 0px;
        }
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
            width: $width;
            padding: 0px 15px 0px 15px;
        }
        .pagination-area {
            width: $width;
            text-align: right;
            margin: 30px 0px 0px 0;
            padding-right: 15px;
        }
        .map-area {
            width: $width;
            padding: 0px 15px 0px 15px;
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

    .tipInfo {
        text-align: left;
        width: 100%;
        margin: -10px 0 5px 120px;
    }
}
</style>
