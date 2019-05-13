<template>
    <div class="projectProgress">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea">
                    <!-- 筛选条件 begin-->
                    <div class="selectDiv">
                        <span class="align-right">所属主项目：</span>
                        <selectMainProject @selectChange="search.mainProjectID = $event" @init="searchProject" clearable ref="selectMainProject">
                        </selectMainProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">项目类型：</span>
                        <el-select v-model="search.subProjectProcessType" placeholder="全部" clearable size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.subProjectProcessAllTypes" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">项目状态：</span>
                        <el-select v-model="search.project_status" placeholder="全部" size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.projectStatus" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">负责人：</span>
                        <el-select filterable clearable placeholder="全部" v-model="search.charge_user" size="medium">
                            <el-option v-for="item in chargeUserData" :label="item.user_name" :value="item.user_id" :key="item.user_id"></el-option>
                        </el-select>
                        <!-- <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.charge_user">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.charge_user" clearable placeholder="搜索负责人，支持模糊搜索">
                            </el-input>
                        </el-popover> -->
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">子项目名称：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.inProjectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.inProjectName" clearable placeholder="搜索子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                </div>
                <div class="open">
                    <!-- <div class="more" @click="collapseFlag=!collapseFlag">
                        <div class="moreLeft" :style="collapseFlag?'margin-top:8px':'margin-top:-2px'">
                            <div :class="collapseFlag?'arrow_up':'arrow_down'"></div>
                            <div :class="collapseFlag?'arrow_up':'arrow_down'"></div>
                        </div>
                        <div class="moreRight">
                            {{!collapseFlag?"展开":"折叠"}}
                        </div>
                    </div> -->
                    <div class="operation">
                        <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>

            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 子项目列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">项目进度</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">个子项目</span> -->
                <form action="/api/query_sub_project" enctype='application/json'>
                    <input type="hidden" name='project_id' v-model="search.mainProjectID">
                    <input type="hidden" name='sub_project_name' v-model="search.inProjectName">
                    <input type="hidden" name='sub_project_process_type' v-model="search.subProjectProcessType">
                    <input type="hidden" name='query_or_export_data' value='2'>
                    <input type="hidden" name='path_name' value='项目进度'>
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name='project_status' v-model="search.project_status">
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <div class="progress-plain">
                        <div class="progress-plain-items">
                            <span class="gray"></span>
                            <p>未开始</p>
                        </div>
                        <div class="progress-plain-items">
                            <span class="yellow"></span>
                            <p>进行中</p>
                        </div>
                        <div class="progress-plain-items">
                            <span class="red"></span>
                            <p>异常</p>
                        </div>
                        <div class="progress-plain-items">
                            <span class="green"></span>
                            <p>已完成</p>
                        </div>
                    </div>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" :max-height="formHeight" ref="subProjecttable" border style="width: 100%" :row-class-name="tableRowClassName" :cell-style="changeColColor" @select="subProjectSelectionChange" @select-all="subProjectSelectionChange" @sort-change="sortTable">
                    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                    <el-table-column fixed prop="sub_project_id" label="编号" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column fixed prop="sub_project_name" show-overflow-tooltip label="名称" width="145">
                        <template slot-scope="scope">
                            <el-button @click="handleProjectClick(scope.row)" type="text" size="small">{{scope.row.sub_project_name}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="show_project_name" show-overflow-tooltip label="所属主项目" width="135"></el-table-column>
                    <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                    <el-table-column prop="show_project_status" show-overflow-tooltip label="项目状态" width="90"></el-table-column>
                    <el-table-column prop="priority_level" sortable="custom" label="优先级" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="car_day_count" label="外业任务数" show-overflow-tooltip width="145"></el-table-column>
                    <el-table-column prop="out_library_num" sortable="custom" label="出库网格" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="dy_fix_manual_adjustment_num" sortable="custom" label="人工融合网格" show-overflow-tooltip width="130"></el-table-column>
                    <el-table-column label="进度" width="3618">
                        <el-table-column label="图片识别" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="完成/全部">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.image_recognition_info">
                                    <p>{{`${scope.row.image_recognition_info.completed_number}/${scope.row.image_recognition_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.image_recognition_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.image_recognition_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.image_recognition_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.image_recognition_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="点云拼接" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="完成/全部">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.dypj_pjz_info">
                                    <p>{{`${scope.row.dypj_pjz_info.completed_number}/${scope.row.dypj_pjz_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.dypj_pjz_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.dypj_pjz_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.dypj_pjz_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.dypj_pjz_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="前预处理准出" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="通过/外业任务数">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.qycl_allow_out_info">
                                    <p>{{`${scope.row.qycl_allow_out_info.completed_number}/${scope.row.qycl_allow_out_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.qycl_allow_out_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.qycl_allow_out_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.qycl_allow_out_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.qycl_allow_out_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column label="出库" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="后处理出库\作业出库\自动出库">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.out_library">
                                    <p>{{`${scope.row.out_library.hycl_number}\\${scope.row.out_library.operation_number}\\${scope.row.out_library.auto_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.out_library.segment_status]}`">
                                        <div class="process" :style="{width:'100%'}">
                                            <p class="process-text">
                                                {{`${datasMap.segmentStatusText[scope.row.out_library.segment_status]}`}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="特征识别" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="完成/后处理出库网格">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.featrue_match_info">
                                    <p>{{`${scope.row.featrue_match_info.completed_number}/${scope.row.featrue_match_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.featrue_match_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.featrue_match_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.featrue_match_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.featrue_match_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="自动融合" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="完成/后处理出库网格">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.dy_mix_info">
                                    <p>{{`${scope.row.dy_mix_info.completed_number}/${scope.row.dy_mix_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.dy_mix_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.dy_mix_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.dy_mix_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.dy_mix_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="融合准出" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="通过/后处理出库网格">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.dyrh_allow_out_info">
                                    <p>{{`${scope.row.dyrh_allow_out_info.completed_number}/${scope.row.dyrh_allow_out_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.dyrh_allow_out_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.dyrh_allow_out_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.dyrh_allow_out_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.dyrh_allow_out_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="人工融合" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="完成/人工融合网格">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.dy_manual_adjustment_info">
                                    <p>{{`${scope.row.dy_manual_adjustment_info.completed_number}/${scope.row.dy_manual_adjustment_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.dy_manual_adjustment_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.dy_manual_adjustment_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.dy_manual_adjustment_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.dy_manual_adjustment_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="P矩阵生成" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="完成/人工融合网格">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.hycl_pjz_info">
                                    <p>{{`${scope.row.hycl_pjz_info.completed_number}/${scope.row.hycl_pjz_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.hycl_pjz_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.hycl_pjz_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.hycl_pjz_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.hycl_pjz_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="路网建模" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="完成/全部">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.dysb_rs_lanejm_info">
                                    <p>{{`${scope.row.dysb_rs_lanejm_info.completed_number}/${scope.row.dysb_rs_lanejm_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.dysb_rs_lanejm_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.dysb_rs_lanejm_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.dysb_rs_lanejm_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.dysb_rs_lanejm_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="后预处理准出" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="通过/后处理出库网格">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.hycl_allow_out_info">
                                    <p>{{`${scope.row.hycl_allow_out_info.completed_number}/${scope.row.hycl_allow_out_info.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.hycl_allow_out_info.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.hycl_allow_out_info.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.hycl_allow_out_info.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.hycl_allow_out_info.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="生产准入" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="通过/后处理出库网格">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.operation_allow_in">
                                    <p>{{`${scope.row.operation_allow_in.completed_number}/${scope.row.operation_allow_in.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.operation_allow_in.segment_status]}`">
                                        <div class="process" :style="{width:scope.row.operation_allow_in.segment_progress}">
                                            <p class="process-text">
                                                {{`${scope.row.operation_allow_in.segment_progress}`}}
                                            </p>
                                        </div>
                                        <p class="process-text">
                                            {{`${scope.row.operation_allow_in.segment_progress}`}}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="基础作业" show-overflow-tooltip width="150" :render-header="showTooltip" label-class-name="一次作业进度\一检通过进度\二检通过进度">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.basic_element_operation">
                                    <p>{{`${scope.row.basic_element_operation.first_operation_completed_progress}\\${scope.row.basic_element_operation.first_check_completed_progress}\\${scope.row.basic_element_operation.second_check_completed_progress}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.basic_element_operation.segment_status]}`">
                                        <div class="process" :style="{width:'100%'}">
                                            <p class="process-text-1">
                                                {{`${datasMap.segmentStatusText[scope.row.basic_element_operation.segment_status]}`}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="基础接边" show-overflow-tooltip width="150" :render-header="showTooltip" label-class-name="一次作业进度\一检通过进度\二检通过进度">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.basic_element_jb_operation">
                                    <p>{{`${scope.row.basic_element_jb_operation.first_operation_completed_progress}\\${scope.row.basic_element_jb_operation.first_check_completed_progress}\\${scope.row.basic_element_jb_operation.second_check_completed_progress}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.basic_element_jb_operation.segment_status]}`">
                                        <div class="process" :style="{width:'100%'}">
                                            <p class="process-text-1">
                                                {{`${datasMap.segmentStatusText[scope.row.basic_element_jb_operation.segment_status]}`}}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column label="高阶作业" show-overflow-tooltip width="150" :render-header="showTooltip" label-class-name="一次作业进度\一检通过进度\二检通过进度">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.senior_element_operation">
                                    <p>{{`${scope.row.senior_element_operation.first_operation_completed_progress}\\${scope.row.senior_element_operation.first_check_completed_progress}\\${scope.row.senior_element_operation.second_check_completed_progress}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.senior_element_operation.segment_status]}`">
                                        <div class="process" :style="{width:'100%'}">
                                            <p class="process-text-1">
                                                {{`${datasMap.segmentStatusText[scope.row.senior_element_operation.segment_status]}`}}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column label="高阶接边" show-overflow-tooltip width="150" :render-header="showTooltip" label-class-name="一次作业进度\一检通过进度\二检通过进度">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.senior_element_jb_operation">
                                    <p>{{`${scope.row.senior_element_jb_operation.first_operation_completed_progress}\\${scope.row.senior_element_jb_operation.first_check_completed_progress}\\${scope.row.senior_element_jb_operation.second_check_completed_progress}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.senior_element_jb_operation.segment_status]}`">
                                        <div class="process" :style="{width:'100%'}">
                                            <p class="process-text-1">
                                                {{`${datasMap.segmentStatusText[scope.row.senior_element_jb_operation.segment_status]}`}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="回库接边" show-overflow-tooltip width="120" :render-header="showTooltip" label-class-name="一次作业进度\一检通过进度\二检通过进度">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.city_jb_operation">
                                    <p>{{`${scope.row.city_jb_operation.first_operation_completed_progress}\\${scope.row.city_jb_operation.first_check_completed_progress}\\${scope.row.city_jb_operation.second_check_completed_progress}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.city_jb_operation.segment_status]}`">
                                        <div class="process" :style="{width:'100%'}">
                                            <p class="process-text">
                                                {{`${datasMap.segmentStatusText[scope.row.city_jb_operation.segment_status]}`}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="回库" show-overflow-tooltip width="120">
                            <template slot-scope="scope">
                                <div class="progress" v-if="scope.row.in_library">
                                    <p>{{`${scope.row.in_library.total_number}`}}</p>
                                    <div :class="`progress-body ${datasMap.segmentStatus[scope.row.in_library.segment_status]}`">
                                        <div class="process" :style="{width:'100%'}">
                                            <p class="process-text">
                                                {{`${datasMap.segmentStatusText[scope.row.in_library.segment_status]}`}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="show_charge_user" label="负责人" show-overflow-tooltip width="130"></el-table-column>
                </el-table>
            </div>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="perPage" layout="total, sizes, prev, pager, next, jumper" :total="totalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </div>
        <!-- 子项目列表 end-->
    </div>
</template>

<script>
import {
    trim,
    showDataSet,
    validateData,
    setCookie
} from "@/utils/daqian_tools";
import selectCity from "@/components/daqian_selectCity.vue";
import selectMainProject from "@/components/daqian_selectMainProject.vue";
import router from "@/router";
export default {
    components: {
        selectCity,
        selectMainProject
    },
    data() {
        return {
            formHeight: this.global.formHeight,
            collapseFlag: false,
            search: {
                inProjectName: "",
                mainProjectID: "",
                subProjectProcessType: "",
                sort_field_name: "sub_project_id desc",
                project_status: "3",
                charge_user_id: ""
            },
            searchDatas: {},
            perPage: 10,
            currentPage: 1,
            priorPage: 1,
            totalNumber: 0,
            subprojectData: [],
            carPlanData: {},
            datasMap: {
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
                progressStatus: {
                    "1": "前预处理",
                    "2": "后预处理",
                    "3": "生产准入",
                    "4": "基础要素作业",
                    "5": "基础要素接边",
                    "6": "高阶要素作业",
                    "7": "高阶要素接边",
                    "8": "回库接边"
                },
                errorType: {
                    "1": "图片识别异常",
                    "2": "点云拼接异常",
                    "3": "前预处理准出异常",
                    "9": "出库异常",
                    "4": "点云融合异常",
                    "5": "点云融合准出异常",
                    "6": "车道建模异常",
                    "7": "后预处理准出异常",
                    "8": "生产准入异常",
                    "10": "回库异常"
                },
                failCols: [
                    "image_recognition_info.wy_task_fail_number",
                    "dypj_pjz_info.wy_task_fail_number",
                    "qycl_allow_out_info.wy_task_not_ok_number",
                    "qycl_allow_out_info.wy_task_fail_number",
                    "dy_mix_info.tile_fail_number",
                    "dyrh_allow_out_info.tile_not_ok_number",
                    "dyrh_allow_out_info.tile_fail_number",
                    "dy_manual_adjustment_info.tile_fail_number",
                    "hycl_allow_out_info.tile_not_ok_number",
                    "hycl_pjz_info.tile_fail_number",
                    "dysb_rs_lanejm_info.tile_fail_number",
                    "hycl_allow_out_info.tile_fail_number",
                    "operation_allow_in.tile_un_pass",
                    "out_library.out_library_fail_number"
                ],
                projectStatus: {
                    "0": "全部",
                    "3": "进行中",
                    "4": "完结",
                    "5": "作废",
                    "6": "暂停"
                },
                progressInfo: {
                    image_recognition_info: "图片识别",
                    dypj_pjz_info: "点云拼接",
                    qycl_allow_out_info: "前预处理准出",
                    out_library: "出库",
                    featrue_match_info: "特征识别",
                    dy_mix_info: "自动融合",
                    dyrh_allow_out_info: "联合准出",
                    dy_manual_adjustment_info: "人工融合",
                    hycl_pjz_info: "P矩阵",
                    dysb_rs_lanejm_info: "路网建模",
                    hycl_allow_out_info: "后预处理准出",
                    operation_allow_in: "生产准入",
                    basic_element_operation: "基础作业",
                    basic_element_jb_operation: "基础接边",
                    senior_element_operation: "高阶作业",
                    senior_element_jb_operation: "高阶接边",
                    city_jb_operation: "回库接边",
                },
                segmentStatus: {
                    1: "gray",
                    2: "yellow",
                    3: "red",
                    4: "green"
                },
                segmentStatusText: {
                    1: "未开始",
                    2: "进行中",
                    3: "异常",
                    4: "已完成"
                },
            },
            multipleSubProjectSelection: [],
            resetselectCityData: false,
            isSearchCityClearable: true,
            progressTable: [],
            accessDisabled: false,
            loading: true,
            emptyText: "查询中",
            chargeUserData: []
        };
    },
    computed: {
        tableData: function () {
            this.progressTable = [];
            for (var val of this.subprojectData) {
                var tmpProgressInfo = val.progress_info;
                if (!tmpProgressInfo) {
                    tmpProgressInfo = {};
                }
                tmpProgressInfo.sub_project_id = val.sub_project_id;
                tmpProgressInfo.sub_project_name = val.sub_project_name;
                tmpProgressInfo.project_name = val.project_name;
                tmpProgressInfo.project_id = val.project_id;
                tmpProgressInfo.out_library_num = val.out_library_num;
                tmpProgressInfo.dy_fix_manual_adjustment_num = val.dy_fix_manual_adjustment_num;
                tmpProgressInfo.car_day_count = val.car_day_count;
                tmpProgressInfo.memo = val.memo;
                tmpProgressInfo.charge_user_name = val.charge_user_name;
                tmpProgressInfo.priority_level = val.priority_level;
                tmpProgressInfo.show_project_status = this.datasMap.projectStatus[val.project_status];
                tmpProgressInfo.show_sub_project_process_type = this.datasMap.subProjectProcessAllTypes[val.sub_project_process_type];
                tmpProgressInfo.show_project_name = showDataSet(val.project_id, val.project_name);
                tmpProgressInfo.show_charge_user = showDataSet(val.charge_user_id, val.charge_user_name);
                this.progressTable.push(tmpProgressInfo);
            }
            return this.progressTable
        }
    },
    mounted() {
        this.accessDisabled = eval(sessionStorage.roteAuthotity);
        this.queryChargeUser();
    },
    methods: {
        tableRowClassName: function ({
            row,
            rowIndex
        }) {

        },
        // collapseChange(val) {
        //     this.collapseFlag = Boolean(val);
        // },
        showTooltip: function (createElement, { column }) {
            return createElement(
                'el-tooltip',
                {
                    props: {
                        effect: 'dark',
                        placement: 'top',
                        content: column.labelClassName
                    },

                },
                [
                    createElement('span', {
                        style: {
                            fontWeight: 'bold',
                            color: '#234677'
                        }
                    }, [column.label])
                ]
            );
        },
        changeColColor: function ({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            for (var val of this.datasMap.failCols) {
                if (column.property === val) {
                    let prop = val.split(".");
                    if (row[prop[0]] && row[prop[0]][prop[1]]) {
                        if (eval("row." + val) > 0) {
                            return {
                                color: "red"
                            };
                        }
                    }
                }
                this.priorPage = this.currentPage;
            }
        },
        // 跳转
        handleProjectClick: function (val) {
            setCookie("selectProjectID", val.project_id, 6 * 30 * 24 * 60);
            setCookie("selectSubprojectID", val.sub_project_id, 6 * 30 * 24 * 60);
            let newHref = this.$router.resolve({
                name: "tileProgress",
                params: {
                    mainProjectId: Number(val.project_id),
                    subProjectId: Number(val.sub_project_id)
                }
            });
            window.open(newHref.href, "_blank")
        },
        searchProject: function (arg) {
            var querySubProjectData = {
                project_id: this.search.mainProjectID,
                sub_project_name: trim(this.search.inProjectName),
                sort_field_name: this.search.sort_field_name,
                query_or_export_data: 10,
                sub_project_process_type: this.search.subProjectProcessType,
                project_status: this.search.project_status,
                page_index: this.currentPage,
                page_size: this.perPage,
                charge_user_id: this.search.charge_user,
                return_all: arg && arg.return_all ? arg.return_all : 2
            };
            if (!(arg && arg.loading)) {
                if (!(arg && arg.return_all)) {
                    this.subprojectData = [];
                    this.totalNumber = 0;
                    this.searchDatas = querySubProjectData;
                }
                this.currentPage = 1;
                this.multipleSubProjectSelection = [];
                this.loading = true;
            }
            this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
            this.searchDatas.page_index = this.currentPage;
            this.searchDatas.page_size = this.perPage;
            this.emptyText = "查询中";
            this.$http.post("/api/query_sub_project", this.searchDatas).then(
                response => {
                    this.loading = false;
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0 || data.errno === 7) {
                        if (data.errno === 7) {
                            this.emptyText = "未查询到符合条件的数据";
                        } else {
                            this.subprojectData = data.data.sub_project_info;
                            this.totalNumber = Number(data.data.total_number);
                            if (this.totalNumber == 0) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.emptyText = "加载中";
                            }
                        }
                    } else {
                        this.subprojectData = [];
                        this.emptyText = "查询失败";
                    }
                },
                response => {
                    // 响应错误回调
                    this.subprojectData = [];
                    this.loading = false;
                    this.emptyText = "查询失败";
                }
            );
        },
        onSearch: function (event) {
            this.searchProject(event);
        },
        onRefresh: function (event) {
            this.search.project_status = '3';  // v_s: 刷新时修改默认项目状态
            this.search.mainProjectID = "";
            this.search.inProjectName = "";
            this.search.subProjectProcessType = "";
            this.search.charge_user = "";
            this.resetselectCityData = true;
            this.$refs.subProjecttable.clearSort();
            this.$refs.selectMainProject.reset();
            this.search.sort_field_name = "sub_project_id desc";
            this.searchProject();
        },
        sortTable: function (val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "sub_project_id desc";
            }
            this.onSearch();
        },
        subProjectSelectionChange: function (val) {
            this.multipleSubProjectSelection[this.currentPage - 1] = val;
            var pagesNumber = Math.ceil(this.totalNumber / this.perPage);
            for (var i = 0; i < pagesNumber; i++) {
                if (i == this.currentPage - 1) {
                    this.multipleSubProjectSelection[i] = val;
                } else {
                    if (typeof this.multipleSubProjectSelection[i] == "undefined") {
                        this.multipleSubProjectSelection[i] = [];
                    }
                }
            }
        },
        pageSizeChange: function (val) {
            this.multipleSubProjectSelection = [];
            this.perPage = val;
            this.onSearch({
                loading: true
            })
        },
        pageCurrentChange: function (val) {
            this.priorPage = this.currentPage;
            this.currentPage = val;
            this.searchProject({
                loading: true
            })
        },
        updateCityStatus: function (data) {
            this.resetselectCityData = false;
        },
        queryChargeUser: function (searchType) {
            var query_user = {
                user_role: 5,
                status: 1,
                page_size: 1,
                page_index: 10,
                return_all: 1,
                noIntercept: true //拦截器校验 true为不拦截该请求 
            };
            this.$http.post("/api/query_user_list", query_user).then(response => {
                var data = response.body.data;
                if (data.errno === 0) {
                    this.chargeUserData = data.data.user_list;
                }
            });
        }
    }
};

</script>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;

.projectProgress {
    height: $height;
    width: $width;
    overflow: auto;
    // .progress-height {
    //     // height: 40px;
    //     // width: 280px;
    // }

    .progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        // position: absolute;
        left: 0;
        top: 0;

        .progress-body {
            position: relative;
            border-radius: 40px;
            overflow: hidden;
            height: 20px;
            width: 100%;
            .process {
                position: absolute;
                height: 100%;
                color: white;
                overflow: hidden;
                z-index: 3;
            }
            .process-text {
                position: absolute;
                left: 50px;
                top: 50%;
                transform: translate(-50%, -50%);
                white-space: nowrap;
                border-radius: 40px;
            }
            .process-text-1 {
                position: absolute;
                left: 62px;
                top: 50%;
                transform: translate(-50%, -50%);
                white-space: nowrap;
                border-radius: 40px;
            }
        }
        .red {
            // background-color: rgba($color: red, $alpha: 0.3);
            border: 1px solid rgba($color: red, $alpha: 0.6);
            color: red;
            div {
                background-color: rgba($color: red, $alpha: 0.6);
            }
        }
        .yellow {
            // background-color: rgba($color: #ff8c00, $alpha: 0.3);
            border: 1px solid rgba($color: #ff8c00, $alpha: 0.8);
            color: #ff8c00;
            div {
                background-color: rgba($color: #ff8c00, $alpha: 0.8);
            }
        }
        .green {
            // background-color: rgba($color: green, $alpha: 0.3);
            border: 1px solid rgba($color: green, $alpha: 0.6);
            color: green;
            div {
                background-color: rgba($color: green, $alpha: 0.6);
            }
        }
        .gray {
            border: 1px solid rgba($color: gray, $alpha: 0.6);
            color: gray;
            div {
                background-color: rgba($color: gray, $alpha: 0.6);
            }
        }
    }

    .searchArea {
        width: $width;
        min-height: 50px;
        padding-top: 20px;
        background: #fff;
        opacity: 1;
    }

    .searchDiv {
        width: $width;
    }

    .selectArea {
        // margin-top: 10px;
        width: $width;
        overflow: hidden;
    }

    .selectDiv {
        float: left;
        margin: 0 20px 15px 10px;
    }

    .align-right {
        text-align: right;
        min-width: 84px;
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
            .select-area-1 {
                display: flex;
                .progress-plain {
                    display: flex;
                    flex: 1;
                    justify-content: flex-end;
                    margin-left: 40px;
                    margin-bottom: 5px;
                    margin-right: 10px;
                    .progress-plain-text {
                        flex: 1;
                        text-align: left;
                    }
                    .progress-plain-items {
                        p {
                            font-size: 12px;
                        }
                        span {
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            border-radius: 8px;
                            margin-right: 6px;
                        }
                        .green {
                            background-color: rgba($color: green, $alpha: 0.6);
                        }
                        .yellow {
                            background-color: rgba($color: #ff8c00, $alpha: 0.6);
                        }
                        .gray {
                            background-color: rgba($color: gray, $alpha: 0.6);
                        }
                        .red {
                            background-color: rgba($color: red, $alpha: 0.6);
                        }
                        display: flex;
                        align-items: center;
                        margin-right: 20px;
                        height: 20px;
                    }
                }
            }
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
}
</style>
<style lang="scss">
.projectProgress {
    .el-table td,
    .el-table th {
        padding: 6px 0;
    }
}
</style>
