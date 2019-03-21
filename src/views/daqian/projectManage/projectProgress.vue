<template>
    <div class="projectProgress">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:102px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectDiv">
                        <span class="align-right">所属主项目：</span>
                        <selectMainProject @selectChange="search.mainProjectID = $event" @init="searchProject"
                            clearable ref="selectMainProject">
                        </selectMainProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">流程类型：</span>
                        <el-select v-model="search.subProjectType" placeholder="全部" clearable size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.subProjectAllTypes" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">项目类型：</span>
                        <el-select v-model="search.subProjectProcessType" placeholder="全部" clearable size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.subProjectProcessAllTypes" :key="index"
                                    :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">项目状态：</span>
                        <el-select v-model="search.project_status" placeholder="全部" size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.projectStatus" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">生产进度：</span>
                        <el-select v-model="search.subProjectProgressStatus" size="medium" clearable placeholder="全部">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.progressStatus" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">异常状态：</span>
                        <el-select v-model="search.subProjectErrorStatus" size="medium" clearable placeholder="全部">
                            <el-option value='1' label="无"></el-option>
                            <el-option value='2' label="有"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">异常类型：</span>
                        <el-select v-model="search.subProjectErrorType" size="medium" clearable placeholder="全部">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.errorType" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <!-- <div class="selectDiv">
            <el-button type="primary" v-show="!collapseFlag" v-on:click="onSearch" @click.stop size="medium">筛选</el-button>
            <el-button type="primary" v-show="!collapseFlag" v-on:click="onRefresh" @click.stop size="medium">刷新</el-button>
          </div> -->
                    <div class="selectDiv">
                        <span class="align-right">城市名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.selectCity">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.selectCity"
                                clearable placeholder="搜索城市名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>


                    <!-- <div class="selectDiv">
                        <span class="align-right">源子项目名称：</span>
                        <el-input class="input-style-1" size="medium" v-model="search.sourceSubProjectName" clearable
                            placeholder="搜索源子项目名称，支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">源子项目名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.sourceSubProjectName">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.sourceSubProjectName"
                                clearable placeholder="搜索源子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>

                    <!-- <div class="selectDiv">
                        <span class="align-right">子项目名称：</span>
                        <el-input class="input-style" v-model="search.inProjectName" size="medium" clearable
                            placeholder="搜索子项目名称，支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">子项目名称：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.inProjectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.inProjectName"
                                clearable placeholder="搜索子项目名称，支持模糊搜索">
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
                    <input type="hidden" name='city_name' v-model="search.selectCity">
                    <input type="hidden" name='source_sub_project_name' v-model="search.sourceSubProjectName">
                    <input type="hidden" name='sub_project_type' v-model="search.subProjectType">
                    <input type="hidden" name='sub_project_process_type' v-model="search.subProjectProcessType">
                    <input type="hidden" name='progress_status' v-model="search.subProjectProgressStatus">
                    <input type="hidden" name='overall_status' v-model="search.subProjectErrorStatus">
                    <input type="hidden" name='abnormal_status' v-model="search.subProjectErrorType">
                    <input type="hidden" name='query_or_export_data' value='2'>
                    <input type="hidden" name='path_name' value='项目进度'>
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name='project_status' v-model="search.project_status">
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain
                        native-type="submit">导出</el-button>
                </form>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    :max-height="formHeight" ref="subProjecttable" border style="width: 100%" :row-class-name="tableRowClassName"
                    :cell-style="changeColColor" @select="subProjectSelectionChange" @select-all="subProjectSelectionChange"
                    @sort-change="sortTable">
                    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                    <el-table-column fixed prop="sub_project_id" label="子项目编号" show-overflow-tooltip sortable="custom"
                        width="120"></el-table-column>
                    <el-table-column fixed prop="sub_project_name" show-overflow-tooltip label="子项目名称" width="100"></el-table-column>
                    <el-table-column fixed prop="show_progress_status" show-overflow-tooltip label="生产进度" width="80"></el-table-column>
                    <el-table-column fixed prop="show_overall_status" show-overflow-tooltip label="异常状态" width="80"></el-table-column>
                    <el-table-column fixed prop="show_abnormal_status" show-overflow-tooltip label="异常类型" width="80"></el-table-column>
                    <el-table-column prop="city_name" show-overflow-tooltip label="城市" width="80"></el-table-column>
                    <el-table-column prop="show_project_name" show-overflow-tooltip label="所属主项目" width="135"></el-table-column>
                    <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                    <el-table-column prop="show_project_status" show-overflow-tooltip label="项目状态" width="90"></el-table-column>
                    <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                    <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目" width="105"></el-table-column>
                    <el-table-column prop="car_day_count" label="新增外业任务数" show-overflow-tooltip sortable="custom" width="145"></el-table-column>
                    <el-table-column prop="source_car_day_count" label="继承外业任务数" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column label="图片识别（外业任务数）">
                        <el-table-column prop="image_recognition_info.wy_task_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="image_recognition_info.wy_task_doing_number" label="识别中" width="65"></el-table-column>
                        <el-table-column prop="image_recognition_info.wy_task_complete_number" label="已完成" width="65"></el-table-column>
                        <el-table-column prop="image_recognition_info.wy_task_fail_number" label="失败" sortable="custom"
                            width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="点云拼接+P矩阵（外业任务数）">
                        <el-table-column prop="dypj_pjz_info.wy_task_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="dypj_pjz_info.wy_task_doing_number" label="拼接中" width="65"></el-table-column>
                        <el-table-column prop="dypj_pjz_info.wy_task_complete_number" label="已完成" width="65"></el-table-column>
                        <el-table-column prop="dypj_pjz_info.wy_task_fail_number" label="失败" sortable="custom" width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="前预处理准出">
                        <el-table-column prop="qycl_allow_out_info.wy_task_un_start_number" label="未开始" width="65"></el-table-column>
                        <el-table-column prop="qycl_allow_out_info.wy_task_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="qycl_allow_out_info.wy_task_doing_number" label="处理中" width="65"></el-table-column>
                        <el-table-column prop="qycl_allow_out_info.wy_task_complete_number" label="通过" width="50"></el-table-column>
                        <el-table-column prop="qycl_allow_out_info.wy_task_not_ok_number" label="不通过" sortable="custom"
                            width="90"></el-table-column>
                        <el-table-column prop="qycl_allow_out_info.wy_task_fail_number" label="失败" sortable="custom"
                            width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="网格出库">
                        <el-table-column prop="out_library.out_library_un_start_number" label="未出库" width="65"></el-table-column>
                        <el-table-column prop="out_library.out_library_line_up_number" label="待出库" width="65"></el-table-column>
                        <el-table-column prop="out_library.out_library_doing_number" label="出库中" width="65"></el-table-column>
                        <el-table-column prop="out_library.out_library_complete_number" label="出库成功" width="80"></el-table-column>
                        <el-table-column prop="out_library.out_library_fail_number" label="出库失败" sortable="custom"
                            width="115"></el-table-column>
                        <el-table-column prop="out_library.out_library_not_out_number" label="不出库" width="65"></el-table-column>
                    </el-table-column>
                    <el-table-column label="网格回库">
                        <el-table-column prop="in_library.in_library_un_start_number" label="未回库" width="65"></el-table-column>
                        <el-table-column prop="in_library.in_library_line_up_number" label="待回库" width="65"></el-table-column>
                        <el-table-column prop="in_library.in_library_doing_number" label="回库中" width="65"></el-table-column>
                        <el-table-column prop="in_library.in_library_complete_number" label="回库成功" width="80"></el-table-column>
                        <el-table-column prop="in_library.in_library_fail_number" label="回库失败" sortable="custom" width="115"></el-table-column>
                        <el-table-column prop="in_library.in_library_not_in_number" label="不回库" width="65"></el-table-column>
                    </el-table-column>
                     <el-table-column label="点云语义分割">
                        <el-table-column prop="featrue_match_info.tile_un_human_touch_number" label="未触发" width="65"></el-table-column>
                        <el-table-column prop="featrue_match_info.tile_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="featrue_match_info.tile_doing_number" label="融合中" width="65"></el-table-column>
                        <el-table-column prop="featrue_match_info.tile_complete_number" label="完成且达标" width="95"></el-table-column>
                        <el-table-column prop="featrue_match_info.tile_fail_number" label="失败" width="95"></el-table-column>
                    </el-table-column>
                    <el-table-column label="点云融合（网格数）">
                        <el-table-column prop="dy_mix_info.tile_un_human_touch_number" label="未触发" width="65"></el-table-column>
                        <el-table-column prop="dy_mix_info.tile_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="dy_mix_info.tile_doing_number" label="融合中" width="65"></el-table-column>
                        <el-table-column prop="dy_mix_info.tile_complete_number" label="完成且达标" width="95"></el-table-column>
                        <el-table-column prop="dy_mix_info.tile_not_ok_number" label="完成未达标" width="95"></el-table-column>
                        <el-table-column prop="dy_mix_info.tile_fail_number" label="失败" sortable="custom" width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="点云融合准出">
                        <el-table-column prop="dyrh_allow_out_info.tile_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="dyrh_allow_out_info.tile_doing_number" label="处理中" width="65"></el-table-column>
                        <el-table-column prop="dyrh_allow_out_info.tile_complete_number" label="通过" width="50"></el-table-column>
                        <el-table-column prop="dyrh_allow_out_info.tile_not_ok_number" label="不通过" sortable="custom"
                            width="90"></el-table-column>
                        <el-table-column prop="dyrh_allow_out_info.tile_fail_number" label="失败" sortable="custom" width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="点云融合人工调整与确认（网格数）">
                        <el-table-column prop="dy_manual_adjustment_info.tile_un_start_number" label="未开始" width="65"></el-table-column>
                        <el-table-column prop="dy_manual_adjustment_info.tile_doing_number" label="人工处理中" width="95"></el-table-column>
                        <el-table-column prop="dy_manual_adjustment_info.tile_complete_number" label="完成且达标" width="105"></el-table-column>
                        <el-table-column prop="dy_manual_adjustment_info.tile_not_ok_number" label="完成未达标" width="105"></el-table-column>
                        <el-table-column prop="dy_manual_adjustment_info.tile_fail_number" label="挂起" sortable="custom"
                            width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="P矩阵生成">
                        <el-table-column prop="hycl_pjz_info.tile_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="hycl_pjz_info.tile_doing_number" label="处理中" width="65"></el-table-column>
                        <el-table-column prop="hycl_pjz_info.tile_complete_number" label="已完成" width="65"></el-table-column>
                        <el-table-column prop="hycl_pjz_info.tile_fail_number" label="失败" sortable="custom" width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="点云识别+染色+车道线建模（网格数）">
                        <el-table-column prop="dysb_rs_lanejm_info.tile_line_up_number" label="排队中" width="70"></el-table-column>
                        <el-table-column prop="dysb_rs_lanejm_info.tile_doing_number" label="处理中" width="70"></el-table-column>
                        <el-table-column prop="dysb_rs_lanejm_info.tile_complete_number" label="已完成" width="70"></el-table-column>
                        <el-table-column prop="dysb_rs_lanejm_info.tile_fail_number" label="失败" sortable="custom" width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="后预处理准出">
                        <el-table-column prop="hycl_allow_out_info.tile_line_up_number" label="排队中" width="65"></el-table-column>
                        <el-table-column prop="hycl_allow_out_info.tile_doing_number" label="处理中" width="65"></el-table-column>
                        <el-table-column prop="hycl_allow_out_info.tile_complete_number" label="通过" width="50"></el-table-column>
                        <el-table-column prop="hycl_allow_out_info.tile_not_ok_number" label="不通过" sortable="custom"
                            width="90"></el-table-column>
                        <el-table-column prop="hycl_allow_out_info.tile_fail_number" label="失败" sortable="custom" width="75"></el-table-column>
                    </el-table-column>
                    <el-table-column label="生产准入">
                        <el-table-column prop="operation_allow_in.tile_un_generate_number" label="未生成任务包" width="105"></el-table-column>
                        <el-table-column prop="operation_allow_in.tile_qc_un_assign_number" label="未分配" width="105"></el-table-column>
                        <el-table-column prop="operation_allow_in.tile_un_start" label="未开始" width="65"></el-table-column>
                        <el-table-column prop="operation_allow_in.tile_doing" label="准入中" width="65"></el-table-column>
                        <el-table-column prop="operation_allow_in.tile_pause" label="暂停" width="50"></el-table-column>
                        <el-table-column prop="operation_allow_in.tile_pass" label="通过" width="50"></el-table-column>
                        <el-table-column prop="operation_allow_in.tile_un_pass" label="不通过" sortable="custom" width="90"></el-table-column>
                    </el-table-column>
                    <el-table-column label="基础要素作业环节（网格数）">
                        <el-table-column prop="basic_element_operation.tile_un_generate_operation_task_number" label="未生成任务包"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_operation.tile_un_assign_number" label="未分配作业员" width="105"></el-table-column>
                        <el-table-column prop="basic_element_operation.tile_first_operation_number" label="作业任务" width="80"></el-table-column>
                        <el-table-column prop="basic_element_operation.tile_first_fg_operation_number" label="一检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_operation.tile_first_fx_operation_number" label="一检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_operation.tile_second_fg_operation_number" label="二检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_operation.tile_second_fx_operation_number" label="二检返修作业"
                            width="105"></el-table-column>
                    </el-table-column>
                    <el-table-column label="基础要素质检环节（网格数）">
                        <el-table-column prop="basic_element_quality_check.tile_first_qc_un_assign_number" label="未分配一检员"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_first_qc_number" label="一检任务" width="80"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_first_fg_qc_number" label="一检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_first_fx_qc_number" label="一检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_first_qc_pass_number" label="一检通过"
                            width="80"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_second_qc_un_generate_number" label="未生成二检任务"
                            width="120"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_second_qc_un_assign_number" label="未分配二检员"
                            width="120"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_second_qc_number" label="二检任务" width="80"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_second_fg_qc_number" label="二检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_second_fx_qc_number" label="二检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_quality_check.tile_second_qc_pass_number" label="二检通过"
                            width="80"></el-table-column>
                    </el-table-column>
                    <el-table-column label="基础要素接边环节（网格数）">
                        <el-table-column prop="basic_element_jb_operation.tile_un_generate_operation_task_number" label="未生成任务包"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_un_assign_number" label="未分配作业员" width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_first_operation_number" label="作业任务"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_first_fg_operation_number" label="一检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_first_fx_operation_number" label="一检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_second_fg_operation_number" label="二检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_second_fx_operation_number" label="二检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_machine_check_line_up" label="机检排队中"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_machine_check_doing" label="机检中" width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_machine_check_complete" label="机检完成"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_operation.tile_machine_check_fail" label="机检失败" width="105"></el-table-column>
                    </el-table-column>
                    <el-table-column label="基础要素接边质检环节（网格数）">
                        <el-table-column prop="basic_element_jb_quality_check.tile_first_qc_un_assign_number" label="未分配一检员"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_first_qc_number" label="一检任务" width="80"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_first_fg_qc_number" label="一检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_first_fx_qc_number" label="一检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_first_qc_pass_number" label="一检通过"
                            width="80"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_second_qc_un_generate_number" label="未生成二检任务"
                            width="120"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_second_qc_un_assign_number" label="未分配二检员"
                            width="120"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_second_qc_number" label="二检任务" width="80"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_second_fg_qc_number" label="二检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_second_fx_qc_number" label="二检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="basic_element_jb_quality_check.tile_second_qc_pass_number" label="二检通过"
                            width="80"></el-table-column>
                    </el-table-column>
                    <!--<el-table-column label="限速批处理环节（网格数）">
                        <el-table-column prop="speed_limit_batch_process.tile_un_human_touch_number" label="未触发" width="100"></el-table-column>
                        <el-table-column prop="speed_limit_batch_process.tile_line_up_number" label="排队中" width="100"></el-table-column>
                        <el-table-column prop="speed_limit_batch_process.tile_doing_number" label="处理中" width="100"></el-table-column>
                        <el-table-column prop="speed_limit_batch_process.tile_complete_number" label="处理完成" width="100"></el-table-column>
                        <el-table-column prop="speed_limit_batch_process.tile_fail_number" label="处理失败" width="100"></el-table-column>
                    </el-table-column>
                    <el-table-column label="护栏批处理环节（网格数）">
                        <el-table-column prop="barrier_batch_process.tile_un_human_touch_number" label="未触发" width="100"></el-table-column>
                        <el-table-column prop="barrier_batch_process.tile_line_up_number" label="排队中" width="100"></el-table-column>
                        <el-table-column prop="barrier_batch_process.tile_doing_number" label="处理中" width="100"></el-table-column>
                        <el-table-column prop="barrier_batch_process.tile_complete_number" label="处理完成" width="100"></el-table-column>
                        <el-table-column prop="barrier_batch_process.tile_fail_number" label="处理失败" width="100"></el-table-column>
                    </el-table-column>-->
                    <el-table-column label="高阶要素作业环节（网格数）">
                        <el-table-column prop="senior_element_operation.tile_un_generate_operation_task_number" label="未生成任务包"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_un_assign_number" label="未分配作业员" width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_first_operation_number" label="作业任务" width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_first_fg_operation_number" label="一检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_first_fx_operation_number" label="一检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_second_fg_operation_number" label="二检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_second_fx_operation_number" label="二检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_machine_check_line_up" label="机检排队中" width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_machine_check_doing" label="机检中" width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_machine_check_complete" label="机检完成" width="105"></el-table-column>
                        <el-table-column prop="senior_element_operation.tile_machine_check_fail" label="机检失败" width="105"></el-table-column>
                    </el-table-column>
                    <el-table-column label="高阶要素质检环节（网格数）">
                        <el-table-column prop="senior_element_quality_check.tile_first_qc_un_assign_number" label="未分配一检员"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_first_qc_number" label="一检任务" width="80"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_first_fg_qc_number" label="一检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_first_fx_qc_number" label="一检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_first_qc_pass_number" label="一检通过"
                            width="80"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_second_qc_un_generate_number" label="未生成二检任务"
                            width="120"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_second_qc_un_assign_number" label="未分配二检员"
                            width="120"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_second_qc_number" label="二检任务" width="80"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_second_fg_qc_number" label="二检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_second_fx_qc_number" label="二检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_quality_check.tile_second_qc_pass_number" label="二检通过"
                            width="80"></el-table-column>
                    </el-table-column>
                    <el-table-column label="高阶要素接边环节（网格数）">
                        <el-table-column prop="senior_element_jb_operation.tile_un_generate_operation_task_number"
                            label="未生成任务包" width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_un_assign_number" label="未分配作业员" width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_first_operation_number" label="作业任务"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_first_fg_operation_number" label="一检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_first_fx_operation_number" label="一检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_second_fg_operation_number" label="二检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_second_fx_operation_number" label="二检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_machine_check_line_up" label="机检排队中"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_machine_check_doing" label="机检中" width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_machine_check_complete" label="机检完成"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_operation.tile_machine_check_fail" label="机检失败" width="105"></el-table-column>
                    </el-table-column>
                    <el-table-column label="高阶要素接边质检环节（网格数）">
                        <el-table-column prop="senior_element_jb_quality_check.tile_first_qc_un_assign_number" label="未分配一检员"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_first_qc_number" label="一检任务" width="80"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_first_fg_qc_number" label="一检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_first_fx_qc_number" label="一检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_first_qc_pass_number" label="一检通过"
                            width="80"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_second_qc_un_generate_number" label="未生成二检任务"
                            width="120"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_second_qc_un_assign_number" label="未分配二检员"
                            width="120"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_second_qc_number" label="二检任务"
                            width="80"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_second_fg_qc_number" label="二检返工质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_second_fx_qc_number" label="二检返修质检"
                            width="105"></el-table-column>
                        <el-table-column prop="senior_element_jb_quality_check.tile_second_qc_pass_number" label="二检通过"
                            width="80"></el-table-column>
                    </el-table-column>
                    <el-table-column label="回库接边环节（网格数）">
                        <el-table-column prop="city_jb_operation.tile_un_generate_operation_task_number"
                            label="未生成任务包" width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_un_assign_number" label="未分配" width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_first_operation_number" label="原始作业任务"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_first_fg_operation_number" label="一检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_first_fx_operation_number" label="一检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_second_fg_operation_number" label="二检返工作业"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_second_fx_operation_number" label="二检返修作业"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_machine_check_line_up" label="机检排队中"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_machine_check_doing" label="机检中" width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_machine_check_complete" label="机检完成"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_operation.tile_machine_check_fail" label="机检失败" width="105"></el-table-column>
                    </el-table-column>
                    <el-table-column label="回库接边质检（网格数）">
                        <el-table-column prop="city_jb_quality_check.tile_first_qc_un_assign_number" label="一检未分配" width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_first_qc_number" label="原始作业一检" width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_first_fg_qc_number" label="返工作业一检"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_first_fx_qc_number" label="返修作业一检"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_first_qc_pass_number" label="一检通过"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_second_qc_un_generate_number" label="二检任务未生成"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_second_qc_un_assign_number" label="二检任务未分配"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_second_qc_number" label="二检任务"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_second_fg_qc_number" label="返工作业二检" width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_second_fx_qc_number" label="返修作业二检"
                            width="105"></el-table-column>
                        <el-table-column prop="city_jb_quality_check.tile_second_qc_pass_number" label="二检通过" width="105"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="80"></el-table-column>
                </el-table>
            </div>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="currentPage"
                    :page-sizes="[10,20,50,100,1000]" background :page-size="perPage" layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNumber">
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
        resize,
        validateData

    } from "@/utils/daqian_tools";
    import selectCity from "@/components/daqian_selectCity.vue";
    import selectMainProject from "@/components/daqian_selectMainProject.vue";
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
                    selectCity: "",
                    planStartDate: "",
                    subProjectType: "",
                    subProjectProcessType: "",
                    sourceSubProjectName: "",
                    subProjectProgressStatus: "",
                    subProjectErrorStatus: "",
                    subProjectErrorType: "",
                    planEndDate: "",
                    sort_field_name: "sub_project_id desc",
                     project_status: "3"
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
                    }
                },
                multipleSubProjectSelection: [],
                resetselectCityData: false,
                isSearchCityClearable: true,
                progressTable: [],
                accessDisabled: false,
                loading: true,
                emptyText: "查询中"
            };
        },
        computed: {
            tableData: function () {
                this.progressTable = [];
                for (var val of this.subprojectData) {
                    var tmpProgressInfo = val.progress_info[0];
                    if (!tmpProgressInfo) {
                        tmpProgressInfo = {};
                    }
                    tmpProgressInfo.sub_project_id = val.sub_project_id;
                    tmpProgressInfo.sub_project_name = val.sub_project_name;
                    tmpProgressInfo.project_name = val.project_name;
                    tmpProgressInfo.city_name = val.city_name;
                    tmpProgressInfo.car_day_count = val.car_day_count;
                    tmpProgressInfo.source_car_day_count = val.source_car_day_count;
                    tmpProgressInfo.memo = val.memo;
                    tmpProgressInfo.show_sub_project_type = this.datasMap.subProjectAllTypes[val.sub_project_type];
                    tmpProgressInfo.show_project_status = this.datasMap.projectStatus[val.project_status];
                    tmpProgressInfo.show_sub_project_process_type = this.datasMap.subProjectProcessAllTypes[val.sub_project_process_type];
                    if (val.overall_status === 1) {
                        tmpProgressInfo.show_overall_status = "无";
                    } else if (val.overall_status === 2) {
                        tmpProgressInfo.show_overall_status = "有";
                    }
                    tmpProgressInfo.show_abnormal_status = "";
                    if (val.abnormal_status) {
                        for (var abnormal_status of val.abnormal_status) {
                            tmpProgressInfo.show_abnormal_status += this.datasMap.errorType[abnormal_status] + "；";
                        }
                    }
                    tmpProgressInfo.show_project_name = showDataSet(val.project_id, val.project_name);
                    tmpProgressInfo.show_progress_status = this.datasMap.progressStatus[val.progress_status];
                    tmpProgressInfo.show_source_sub_project_name = showDataSet(
                        val.source_sub_project_id,
                        val.source_sub_project_name
                    );
                    this.progressTable.push(tmpProgressInfo);
                }
                return this.progressTable
            }
        },
        mounted() {
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
            this.$nextTick(function () {
                resize()
            })
        },
        updated() {
            return
            if (this.currentPage !== this.priorPage) {
                var tmpSelectData = this.multipleSubProjectSelection[this.currentPage - 1];
                if (tmpSelectData) {
                    for (var sel of tmpSelectData) {
                        var index = this.tableData.indexOf(sel);
                        if (index > -1) {
                            this.$refs.subProjecttable.toggleRowSelection(this.tableData[index]);
                        }
                        tmpProgressInfo.show_project_name = showDataSet(
                            val.project_id,
                            val.project_name
                        );
                        tmpProgressInfo.show_progress_status = this.datasMap.progressStatus[
                            val.progress_status
                        ];
                        tmpProgressInfo.show_source_sub_project_name = showDataSet(
                            val.source_sub_project_id,
                            val.source_sub_project_name
                        );
                        this.progressTable.push(tmpProgressInfo);
                    }

                    return this.progressTable.slice(
                        (this.currentPage - 1) * this.perPage,
                        this.currentPage * this.perPage
                    );
                }
                this.priorPage = this.currentPage;
            }
        },
        methods: {
            tableRowClassName: function ({
                row,
                rowIndex
            }) {
                if (row.show_overall_status === "有") {
                    return "warning-row";
                } else {
                    return "";
                }
            },
            collapseChange(val) {
                this.collapseFlag = Boolean(val);
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
            searchProject: function (arg) {
                var querySubProjectData = {
                    //"user_id":sessionStorage.userid,
                    project_id: this.search.mainProjectID,
                    sub_project_name: trim(this.search.inProjectName),
                    city_name: this.search.selectCity,
                    query_start_time: "",
                    query_end_time: "",
                    sort_field_name: this.search.sort_field_name,
                    query_or_export_data: 10,
                    progress_status: this.search.subProjectProgressStatus,
                    overall_status: this.search.subProjectErrorStatus,
                    abnormal_status: this.search.subProjectErrorType,
                    source_sub_project_name: this.search.sourceSubProjectName,
                    sub_project_type: this.search.subProjectType,
                    sub_project_process_type: this.search.subProjectProcessType,
                    project_status: this.search.project_status,
                    page_index: this.currentPage,
                    page_size: this.perPage,
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
                                this.totalNumber = data.data.total_number;
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
                this.search.selectCity = "";
                this.search.planStartDate = "";
                this.search.planEndDate = "";
                this.search.subProjectProgressStatus = "";
                this.search.subProjectErrorStatus = "";
                this.search.subProjectErrorType = "";
                this.search.subProjectType = "";
                this.search.subProjectProcessType = "";
                this.search.sourceSubProjectName = "";
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
            selectSearchCitys: function (data) {
                this.search.selectCity = data;
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
    }

</style>
