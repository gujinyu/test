<template>
    <div class="subProject">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:100px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectDiv">
                        <span class="align-right">所属主项目：</span>
                        <selectMainProject @selectChange="search.mainProjectID = $event" :projectId="search.mainProjectID" @init="searchProject" clearable ref="selectMainProject">
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
                        <span class="align-right">子项目编号：</span>
                        <el-popover class="input-style" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus" :content="search.subProjectId">
                            <el-input class="input-style-1" slot="reference" size="medium" :change="formatSearchInput()" v-model="search.subProjectId" clearable placeholder="一次可以搜索多个子项目编号">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">子项目名称：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.inProjectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.inProjectName" clearable placeholder="搜索子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">补采状态：</span>
                        <el-select v-model="search.wy_collection_status" placeholder="全部" clearable size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.allWyCollectionStatus" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">规范版本：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.dataStandardVersion">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.dataStandardVersion" clearable placeholder="搜索规范版本，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">质检项版本：</span>
                        <el-select v-model="search.qc_rule_version" clearable placeholder="全部" size="medium">
                            <template>
                                <el-option v-for="(item) in QcRuleVersionData" :key="item.qc_rule_version" :value="item.qc_rule_version" :label="item.qc_rule_version"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">质检标准版本：</span>
                        <el-select v-model="search.qc_standard_version" clearable placeholder="全部" size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.qcStandardVersionDatas" :key="index" :value="item" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">出入库状态：</span>
                        <el-select v-model="search.in_out_library_status" clearable placeholder="全部" size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.inOutLibraryStatusDatas" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">外业采集时间：</span>
                        <el-date-picker size="medium" style="width:300px;" v-model="search.planTime" @change="selectDateChange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">城市名称：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔或条件查询" trigger="focus" :content="search.selectCity">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.selectCity" clearable placeholder="搜索城市名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">源子项目名称：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.sourceSubProjectName">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.sourceSubProjectName" clearable placeholder="搜索源子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">源子成果库名称：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.sourceSubLibararyName">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.sourceSubLibararyName" clearable placeholder="搜索源子成果库名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">数据分支：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.roadBranch">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.roadBranch" clearable placeholder="搜索数据分支，支持模糊搜索">
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
                        <div class="moreRight">{{!collapseFlag?"展开":"折叠"}}</div>
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
            <div class="btn-list">
                <span class="titlespan">项目列表</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{pageInfo.totalNumber}}</span>
                <span class="span-right">个子项目</span> -->
                <form action="/api/query_sub_project" enctype="application/json">
                    <input type="hidden" name="project_id" v-model="search.mainProjectID">
                    <input type="hidden" name="sub_project_name" v-model="search.inProjectName">
                    <input type="hidden" name="city_name" v-model="search.selectCity">
                    <input type="hidden" name="data_standard_version" v-model="search.dataStandardVersion">
                    <input type="hidden" name="source_sub_project_name" v-model="search.sourceSubProjectName">
                    <input type="hidden" name="source_results_sub_library_name" v-model="search.sourceSubLibararyName">
                    <input type="hidden" name="sub_project_process_type" v-model="search.subProjectProcessType">
                    <input type="hidden" name="query_start_time" v-bind:value="search.startTime">
                    <input type="hidden" name="query_end_time" v-bind:value="search.endTime">
                    <input type="hidden" name="query_or_export_data" value="1">
                    <input type="hidden" name="path_name" value="项目列表">
                    <input type="hidden" name="sort_field_name" v-model="search.sort_field_name">
                    <input type="hidden" name="wy_collection_status" v-model="search.wy_collection_status">
                    <input type="hidden" name="sub_project_id" v-model="search.subProjectId">
                    <input type="hidden" name="road_branch" v-model="search.roadBranch">
                    <input type="hidden" name="project_status" v-model="search.project_status">
                    <input type="hidden" name="qc_rule_version" v-model="search.qc_rule_version">
                    <!-- <input type="hidden" name="qc_standard_version" v-model="search.qc_standard_version"> -->
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
                <el-dropdown class="right-div menu-el-dropdown">
                    <el-button type="primary" size="medium" :disabled="accessDisabled">发布成果库
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="menu-el-dropdown-menu">
                        <el-dropdown-item class="menu-center" @click.native="addSubLibrary()">添加至成果库</el-dropdown-item>
                        <el-dropdown-item class="menu-center-last" @click.native="createLibrary()">生成成果库</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button class="right-div" type="primary" :disabled="accessDisabled" size="medium" @click="statusManger()">状态管理</el-button>
                <el-button class="right-div" type="primary" :disabled="accessDisabled" size="medium" @click="createSubproject()">新建子项目</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{pageInfo.totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="subProjecttable" border style="width: 100%" @select="subProjectSelectionChange" @select-all="subProjectSelectionChange" @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="sub_project_id" show-overflow-tooltip label="子项目编号" sortable="custom" width="120"></el-table-column>
                    <el-table-column fixed prop="sub_project_name" show-overflow-tooltip label="子项目名称" width="135"></el-table-column>
                    <el-table-column prop="city_name" show-overflow-tooltip label="城市" width="80"></el-table-column>
                    <el-table-column prop="show_project_name" show-overflow-tooltip label="所属主项目" width="135"></el-table-column>
                    <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                    <el-table-column prop="priority_level" label="优先级" show-overflow-tooltip sortable="custom" width="90"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="in_out_library_status_text" label="出入库状态" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="show_host_group" label="机器组编号" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="show_machine_type" label="机器类型" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="data_standard_version" show-overflow-tooltip label="规范版本" width="90"></el-table-column>
                    <el-table-column prop="qc_rule_version" show-overflow-tooltip label="质检项版本" width="120"></el-table-column>
                    <el-table-column prop="car_day_count" label="新增外业任务数" show-overflow-tooltip sortable="custom" width="145"></el-table-column>
                    <el-table-column prop="plan_start_time" label="外业采集开始时间" show-overflow-tooltip width="155"></el-table-column>
                    <el-table-column prop="plan_end_time" label="外业采集结束时间" show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="data_trunk_name" show-overflow-tooltip label="数据分支" width="90"></el-table-column>
                    <el-table-column prop="show_master_library_name" show-overflow-tooltip label="源母库" width="95"></el-table-column>
                    <el-table-column prop="show_results_library_name" show-overflow-tooltip label="源成果库" width="95"></el-table-column>
                    <el-table-column prop="show_user" label="创建用户" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="create_end_time" label="创建时间" show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="150">
                        <template slot-scope="scope">
                            <!-- <el-button @click.native.prevent="showSubprojectCarPlan({index:scope.$index})" type="text" size="small">查看</el-button> -->
                            <el-button type="text" size="small" :disabled="accessDisabled || scope.row.project_status == 5" @click.native.prevent="editSubproject(scope.$index)">编辑</el-button>
                            <el-dropdown>
                                <el-button class="el-dropdown-link" size="small" type="text" :disabled="accessDisabled">补采相关
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item class="center" @click.native.prevent="addCollectionTask(scope.$index)">补采上传</el-dropdown-item>
                                    <el-dropdown-item class="center" @click.native.prevent="showCollectionTaskResult({index:scope.$index})">补采详情</el-dropdown-item>
                                    <el-dropdown-item class="center" @click.native.prevent="downloadCollectionTaskResult(scope.$index)">补采下载</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="pageInfo.currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="pageInfo.perPage" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </div>
        <!-- 子项目列表 end-->
        <!-- 弹窗 begin-->
        <!-- 新建子项目 begin-->
        <el-dialog title="新建子项目" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" width="800px">
            <el-form ref="createform" :model="createform" :rules="createRules" label-width="120px" class="demo-dynamic">
                <el-form-item label="所属主项目" prop="mainProjectID">
                    <el-col :span="8">
                        <el-col :span="23">
                            <selectMainProject @selectChange="createform.mainProjectID = $event" placeholderValue="请选择所属主项目" default="true">
                            </selectMainProject>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="子项目名称" prop="name">
                    <el-col :span="16">
                        <el-input v-model="createform.name" placeholder="请填写子项目名称" @change="suggestSubprojectName()" clearable size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="项目类型" prop="subProjectProcessType">
                    <el-col :span="8">
                        <el-col :span="23">
                            <el-select style="float: left" v-model="createform.subProjectProcessType" @change="subProjectProcessTypeChange" placeholder="请选择" size="medium">
                                <el-option value='1' label="常规项目"></el-option>
                                <el-option value='2' label="更新项目"></el-option>
                                <el-option value='3' label="修复项目"></el-option>
                                <el-option value='5' label="构网项目"></el-option>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <div v-if="createform.subProjectProcessType !== '1'">
                    <el-form-item label="来源库类型" prop="sourceType">
                        <el-col :span="8">
                            <el-col :span="23">
                                <el-select style="float: left" v-model="createform.sourceType" placeholder="请选择" size="medium" @change="sourceLibraryChange">
                                    <el-option value='1' label="母库"></el-option>
                                    <el-option value='2' label="成果库" v-if="createform.subProjectProcessType !== '5'"></el-option>
                                </el-select>
                            </el-col>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="来源成果库" class="is-required" v-if="createform.sourceType === '2'">
                        <el-col :span="24">
                            <el-col :span="4">
                                <el-select style="float:left;width:100%" size="medium" v-model="createform.carFactory" placeholder="选择车厂" @change="libararyDataSet('createform')">
                                    <template>
                                        <el-option v-for="(item,index) in this.librarys" :key="index" :value="index" :label="index"></el-option>
                                    </template>
                                </el-select>
                            </el-col>
                            <el-col :span="6" :offset="1" v-if="createform.carFactory">
                                <el-select style="float:left;width:100%" size="medium" v-model="createform.libraryId" placeholder="选择成果库" @change="selectLibraryChange('createform')">
                                    <template>
                                        <el-option v-for="(item,index) in this.librarys[createform.carFactory]" :key="index" :value="index" :label="item.results_library_name"></el-option>
                                    </template>
                                </el-select>
                            </el-col>
                            <el-col :span="6" :offset="1" v-if="createform.libraryId">
                                <el-select style="float:left;width:100%" size="medium" v-model="createform.subLibraryId" placeholder="选择子成果库" @change="subLibraryNameChange">
                                    <template>
                                        <el-option v-for="(item,index) in this.librarys[createform.carFactory][createform.libraryId].sub_libarary_list" :key="index" :value="item.results_sub_library_id" :label="item.results_sub_library_name"></el-option>
                                    </template>
                                </el-select>
                            </el-col>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="来源母库" prop="masterLibraryId" v-if="createform.sourceType === '1'">
                        <el-col :span="8">
                            <el-cascader size="medium" style="float: left;" v-model="createform.masterLibraryId" :options="createform.sourceMasterlibraryDataInfo" :show-all-levels="false"></el-cascader>
                        </el-col>
                    </el-form-item>
                </div>
                <el-form-item class="is-required" label="待构网数据" v-if="createform.subProjectProcessType === '5'">
                    <el-upload style="float:left" class="upload-demo" drag :limit="1" :on-exceed="handleExceed" :before-upload="beforeUploadSourceFile" accept=".csv" :on-remove="removeFile" :file-list="sourceFileList" action="">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传csv文件，且文件大小不超过1M</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="规范版本" prop="StandardVersion" :required="createform.subProjectProcessType !== '5'" v-if="createform.subProjectProcessType !== '5'">
                    <el-col :span="8">
                        <el-col :span="23">
                            <el-select v-model="createform.StandardVersion" style="float: left" clearable placeholder="请选择规范版本" size="medium">
                                <template>
                                    <el-option v-for="(item,index) in this.datasMap.standardAllVersions" :key="index" :value="item" :label="item"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检项版本" prop="qcRuleVersion">
                    <el-col :span="8">
                        <el-col :span="23">
                            <el-select v-model="createform.qcRuleVersion" style="float: left" clearable placeholder="请选择质检项版本" size="medium">
                                <template>
                                    <el-option v-for="item in QcRuleVersionData" :key="item.qc_rule_version" :value="item.qc_rule_version" :label="item.qc_rule_version"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检标准版本" prop="qcStandardVersion">
                    <el-col :span="8">
                        <el-col :span="23">
                            <el-select v-model="createform.qcStandardVersion" style="float: left" clearable placeholder="请选择质检标准版本" size="medium">
                                <template>
                                    <el-option v-for="(item,index) in this.datasMap.qcStandardVersionDatas" :key="index" :value="item" :label="item"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <!-- v_s: 数据分支要一直显示 -->
                <el-form-item label="数据分支" prop="dataBranch" v-if="createform.subProjectProcessType === '1' || createform.subProjectProcessType === '2' ||createform.subProjectProcessType === '3' || createform.subProjectProcessType === '5' || createform.sourceType === '2'">
                    <el-col :span="16">
                        <el-input :maxlength='128' clearable v-model="createform.dataBranch" placeholder="请填写数据分支，最多128个字符" size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="继承子项目编号" prop="inherit_sub_project_id_list" v-if="createform.subProjectProcessType === '1'">
                    <el-col>
                        <el-input v-model="createform.inherit_sub_project_id_list" @blur="getSubProjectCount(createform.inherit_sub_project_id_list)" :change="formatSubProjectIdInput()" placeholder="请输入子项目要继承的项目ID，ID可用分号、逗号、空格分隔，仅可输入数字、分号、逗号、空格。" type="textarea" :autosize="{ minRows: 5, maxRows: 5}">
                        </el-input>
                    </el-col>
                </el-form-item>
                <p class="tipInfo-1" v-if="createform.subProjectProcessType === '1'">提示：已输入
                    <b>{{inheritSubProjectCount}}</b>个子项目ID
                </p>
                <el-form-item label="机器组编号">
                    <el-select style="float: left;width: 350px" v-model="createform.machineNo" clearable placeholder="请选择机器组编号" size="medium">
                        <el-option v-for="item in this.machineIDs" :key="item.host_group_id" :label="'编号：'+ item.host_group_id+' '+'， 机器组详情：'+item.host_group_description" :value="item.host_group_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机器类型" prop="machineType">
                    <el-select style="float: left" v-model="createform.machineType" placeholder="请选择机器类型" size="medium">
                        <el-option value="1" label="CPU"></el-option>
                        <el-option value="2" label="GPU"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="算法参数">
                    <el-col :span="16">
                        <el-input v-model="createform.algorithmParameters" clearable size="medium" placeholder="请填写算法参数"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="优先级" prop="priorityLevel">
                    <el-col :span="8">
                        <el-col :span="23">
                            <el-select style="float: left" v-model="createform.priorityLevel" size="medium">
                                <el-option v-for="n in 400" :label="n" :value="n" :key="n"></el-option>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="质检类型配置">
                    <el-row style="text-align:left">
                        <el-radio-group v-model="radio2" size="mini" @change="programme">
                            <el-radio :label="3" border>方案1</el-radio>
                            <el-radio :label="6" border>方案2</el-radio>
                            <el-radio :label="9" border>方案3</el-radio>
                        </el-radio-group>
                    </el-row>
                    <el-col v-for="(ele,index) in forData" :key="index">
                        <el-form-item label-width="100px" :label="ele.name">
                            <el-row style="text-align:left">
                                <el-radio-group v-model="ele.value">
                                    <el-radio v-for="(val,index) in ele.forList" :key="index" :label="val.value" :disabled="val.value !== ele.value">{{val.name}}</el-radio>
                                </el-radio-group>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="createform.remarks"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitCreateForm('createform')">确定</el-button>
                    <!-- <el-button @click="resetForm('createform')">重置</el-button>-->
                    <el-button @click="dialogCreateVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 新建子项目 end-->
        <!-- 查看子项目下外业任务 begin-->
        <el-dialog title="外业任务列表" :visible.sync="dialogShowTaskVisible" :close-on-click-modal="false" width="80%">
            <el-col :span="6" :offset="12">
                <p class="right">所属子项目编号：{{inSubProject.sub_project_id}}</p>
            </el-col>
            <el-col :span="6">
                <p>所属子项目名称：{{inSubProject.sub_project_name}}</p>
            </el-col>
            <carPlanDetailList @carPlanPageChange="showSubprojectCarPlan" :carPlanData="carPlanData" :editDisabled="true" :notAllowInSection="true"></carPlanDetailList>
        </el-dialog>
        <!-- 查看子项目下外业任务 end-->
        <!-- 编辑子项目 begin-->
        <el-dialog title="编辑子项目" :visible.sync="dialogEditVisible" :close-on-click-modal="false" width="800px">
            <el-form ref="inSubProject" :model="inSubProject" :rules="editRules" label-width="120px" class="demo-dynamic">
                <el-form-item label="子项目编号">
                    <el-col :span="16">
                        <el-input v-model="inSubProject.sub_project_id" :disabled="true" size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="子项目名称" prop="sub_project_name">
                    <el-col :span="16">
                        <el-input v-model="inSubProject.sub_project_name" clearable size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="项目类型">
                    <el-col :span="8">
                        <el-col :span="23">
                            <el-select style="float: left" v-model="inSubProject.sub_project_process_type" :disabled="true" placeholder="请选择" size="medium">
                                <template>
                                    <el-option v-for="(item,index) in this.datasMap.subProjectProcessAllTypes" :key="index" :value="index" :label="item"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属主项目" prop="project_name">
                    <el-col :span="16">
                        <el-input :disabled="true" v-model="inSubProject.project_name" size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="规范版本" prop="data_standard_version" v-if="inSubProject.sub_project_process_type !== '5'">
                    <el-col :span="7">
                        <el-select style="float: left;width:427px;" class="overv" :title="inSubProject.data_standard_version" placeholder="请选择规范版本" v-model="inSubProject.data_standard_version" size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.standardAllVersions" :key="index" :value="item" :label="item"></el-option>
                            </template>
                        </el-select>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="数据分支">
                    <el-col :span="16"><el-input v-model="inSubProject.data_trunk_name" :disabled="true" size="medium"></el-input></el-col>
                </el-form-item>
                <el-form-item label="点云分支">
                    <el-col :span="16"><el-input v-model="inSubProject.tile_branch" :disabled="true" size="medium"></el-input></el-col>
                </el-form-item>
                <el-form-item label="网格分支">
                    <el-col :span="16"><el-input v-model="inSubProject.grid_branch" :disabled="true" size="medium"></el-input></el-col>
                </el-form-item> -->
                <el-form-item label="优先级" prop="priority_level">
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inSubProject.priority_level" size="medium">
                            <el-option v-for="n in 400" :label="n" :value="n" :key="n"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="inSubProject.memo"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditForm('inSubProject')">确定</el-button>
                    <!--<el-button @click="resetForm('inSubProject')">重置</el-button>-->
                    <el-button @click="dialogEditVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑子项目 end-->
        <!-- 生成成果库 begin-->
        <el-dialog title="生成成果库" :visible.sync="dialogCreateLibraryVisible" :close-on-click-modal="false" size="small" min-width="1000px">
            <el-form ref="createLibform" :model="createLibform" :rules="createLibRules" label-width="140px" class="demo-dynamic">
                <el-form-item label="车厂" prop="carFactory" :rules="{
                        required: true, message: '车厂不能为空', trigger: 'blur'
                    }">
                    <el-col :span="16">
                        <el-input v-model="createLibform.carFactory" clearable size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="成果库名称" prop="name" :rules="{required: true, message: '成果库不能为空', trigger: 'blur'}">
                    <el-col :span="16">
                        <el-input v-model="createLibform.name" clearable @change="libraryNameChange('createLibform')" size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item v-for="(subProject, index) in createLibform.selectSubProjectList" :label="'子项目' + (index+1)+'：'" :key="subProject.key">
                    <el-form class="subProjectSelected" :ref="subProject" :model="subProject">
                        <el-form-item label="名称：">
                            <span>{{subProject.sub_project_name}}</span>
                        </el-form-item>
                        <el-form-item label="源数据分支：">
                            <span>{{subProject.source_data_trunk}}</span>
                        </el-form-item>
                        <el-form-item label="数据版本时间：">
                            <el-col>
                                <el-date-picker style="float:left;width:50%;" v-model="subProject.source_branch_time" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0" placeholder="选择数据版本时间">
                                </el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="成果数据分支：" prop="destination_data_trunk" :rules="{required: true, message: '成果数据分支不能为空', trigger: 'blur'}">
                            <el-input v-model="subProject.destination_data_trunk" clearable size="small" @blur="triggerVadidate('createLibform')"></el-input>
                        </el-form-item>
                        <el-form-item label="网格列表：" style="margin-top:10px;">
                            <el-col>
                                <el-input v-model="subProject.tile_id_list" placeholder="请输入该子项目下要生成成果库的网格ID，多个网格ID用分号分隔，仅可输入数字和分号。" :change="formatTileIDInput(subProject.tile_id_list)" type="textarea" :autosize="{ minRows: 5, maxRows: 5}">

                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="createLibform.memo"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitCreateLibraryForm('createLibform')">确定</el-button>
                    <!-- <el-button @click="resetForm('createform')">重置</el-button>-->
                    <el-button @click="dialogCreateLibraryVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 生成成果库 end-->
        <!-- 添加至成果库 begin-->
        <el-dialog title="添加至成果库" :visible.sync="dialogAddSubLibraryVisible" :close-on-click-modal="false" size="small" min-width="1000px">
            <el-form ref="addSubLibform" :model="addSubLibform" label-width="140px" class="demo-dynamic">
                <el-form-item label="车厂" prop="carFactory">
                    <el-col :span="16">
                        <el-select style="float:left;width:100%" size="medium" v-model="addSubLibform.carFactory" placeholder="全部" @change="libararyDataSet('addSubLibform')">
                            <template>
                                <el-option v-for="(item,index) in this.librarys" :key="index" :value="index" :label="index"></el-option>
                            </template>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="成果库名称" prop="libraryId">
                    <el-col :span="16">
                        <el-select style="float:left;width:100%" size="medium" v-model="addSubLibform.libraryId" placeholder="全部" @change="libraryNameChange('addSubLibform')">
                            <template>
                                <el-option v-for="(item,index) in this.librarys[addSubLibform.carFactory]" :key="index" :value="index" :label="item.results_library_name"></el-option>
                            </template>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item v-for="(subProject, index) in addSubLibform.selectSubProjectList" :label="'子项目' + (index+1)+'：'" :key="subProject.key">
                    <el-form class="subProjectSelected" :ref="subProject" :model="subProject">
                        <el-form-item label="名称：">
                            <span>{{subProject.sub_project_name}}</span>
                        </el-form-item>
                        <el-form-item label="源数据分支：">
                            <span>{{subProject.source_data_trunk}}</span>
                        </el-form-item>
                        <el-form-item label="数据版本时间：">
                            <el-col>
                                <el-date-picker style="float:left;width:50%;" v-model="subProject.source_branch_time" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0" placeholder="选择数据版本时间">
                                </el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="成果数据分支：" prop="destination_data_trunk" :rules="{required: true, message: '成果数据分支不能为空', trigger: 'blur'}">
                            <el-input v-model="subProject.destination_data_trunk" clearable size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="网格列表：" style="margin-top:10px;">
                            <el-col>
                                <el-input v-model="subProject.tile_id_list" placeholder="请输入该子项目下要生成成果库的网格ID，多个网格ID用分号分隔，仅可输入数字和分号。" :change="formatTileIDInput(subProject.tile_id_list)" type="textarea" :autosize="{ minRows: 5, maxRows: 5}">
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="createLibform.memo"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitAddLibraryForm('addSubLibform')">确定</el-button>
                    <!-- <el-button @click="resetForm('createform')">重置</el-button>-->
                    <el-button @click="dialogAddSubLibraryVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 生成成果库 end-->
        <!-- 上传补采资料 begin-->
        <el-dialog title="上传补采资料" :visible.sync="dialogAddCollectionTaskVisible" :close-on-click-modal="false" width="600px">
            <div style="margin-bottom:20px;overflow:hidden">
                <span class="right-span" :title="addCollectionTaskForm.sub_project_id">所属子项目编号：{{addCollectionTaskForm.sub_project_id}}</span>
                <span class="right-span" :title="addCollectionTaskForm.sub_project_name">所属子项目名称：{{addCollectionTaskForm.sub_project_name}}</span>
            </div>
            <el-form ref="addCollectionTaskForm" :model="addCollectionTaskForm" label-width="120px" class="demo-dynamic">
                <el-form-item label="上传文件">
                    <el-upload style="float:left" class="upload-demo" drag :limit="1" :before-upload="beforeUpload" accept=".zip" :file-list="fileList" :on-exceed="handleExceed" action="">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>，只能上传ZIP文件
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="addCollectionTaskForm.memo"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitaddCollectionTaskForm()">确定</el-button>
                    <el-button @click="dialogAddCollectionTaskVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑补采资料 end-->
        <!-- 查看补采详情 begin-->
        <el-dialog title="补采详情" :visible.sync="dialogShowCollectTaskVisible" :close-on-click-modal="false" width="1071px">
            <div style="margin-bottom:20px;overflow:hidden">
                <span class="right-span" :title="collectTaskInfo.memo">补采备注：{{collectTaskInfo.memo}}</span>
                <span class="right-span" :title="taskInfoData.sub_project_id">所属子项目编号：{{taskInfoData.sub_project_id}}</span>
                <span class="right-span" :title="taskInfoData.sub_project_name">所属子项目名称：{{taskInfoData.sub_project_name}}</span>
            </div>
            <el-form label-width="130px" class="demo-dynamic">
                <el-form-item label="补采外业任务列表">
                    <el-input class="wylist" type="textarea" readonly placeholder="外业任务列表" :autosize="{ minRows: 5, maxRows: 5}" v-model="wy_task_lists"></el-input>
                </el-form-item>
            </el-form>
            <p class="tipInfo-1">提示：总共有
                <b>{{wy_task_lists_arr.length}}</b>条补采外业任务（去重后）
            </p>
            <div class="table-div">
                <el-table :data="collectTableData" ref="collectData" border style="width: 100%">
                    <!-- <el-table-column type="expand">
                    <template  slot-scope="props">
                        <el-form label-position="left" inline class="table-expand">
                            <el-form-item>
                                <span style="font-weight:600">关联外业任务：</span>
                                <div style="line-height:20px;vertical-align:baseline;display:inline-block">{{props.row.wy_task_list}}</div>
                            </el-form-item>
                        </el-form>
                    </template>
          </el-table-column>-->
                    <el-table-column prop="link_id" show-overflow-tooltip label="link编号" width="170"></el-table-column>
                    <el-table-column prop="dist" show-overflow-tooltip label="城市" width="100"></el-table-column>
                    <el-table-column prop="length" show-overflow-tooltip label="长度（m）" width="100"></el-table-column>
                    <el-table-column prop="show_field_plan_name" show-overflow-tooltip label="所属外业计划" width="160"></el-table-column>
                    <el-table-column prop="ny_problem_desc" show-overflow-tooltip label="内业状态" width="100"></el-table-column>
                    <el-table-column prop="wy_problem_desc" label="外业状态" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column prop="solution" label="解决方案" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column prop="wy_task_list" label="关联外业任务" show-overflow-tooltip width="200"></el-table-column>
                </el-table>
            </div>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="subpageSizeChange" @current-change="subpageCurrentChange" :current-page="pageInfo.subCurrentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="pageInfo.subPerPage" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.subTotalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </el-dialog>
        <!-- 查看补采详情 end-->
        <!-- 项目状态管理start -->
        <el-dialog title="项目状态管理" width="600px" :visible.sync="statusMangerVisible" :close-on-click-modal="false">
            <el-form label-width="120px">
                <el-form-item label="项目列表：">
                    <el-input type="textarea" readonly placeholder="选中的项目" v-model="projectStatusListShow" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo-1">提示：已选择
                    <b>{{projectStatusList.length}}</b> 条记录
                </p>
                <el-form-item label="当前状态：">
                    <p class="text-left">{{showProjectStatus}}</p>
                </el-form-item>
                <el-form-item label="目标状态：">
                    <el-select style="float:left;" v-model="emitStatus" placeholder="已作废不可修改" size="medium" :disabled="projectStatusDisabled">
                        <template>
                            <el-option v-for="(item,index) in this.datasMap.projectStatusChange" :key="index" :value="index" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="beforesubmitProjectStatus()">确定</el-button>
                    <el-button @click="statusMangerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {
    trim,
    transformstartDate,
    transformEndDate,
    validateData,
    alertInfo,
    inputCheck,
    showDataSet,
    messageInfo,
    showDescription
} from "@/utils/daqian_tools";
let cityData = require("@/common/citydata.json");
import Vue from "vue";
import CSV from "comma-separated-values";
import selectCity from "@/components/daqian_selectCity.vue";
import carPlanDetailList from "@/components/daqian_carPlanDetailList.vue";
import selectMainProject from "@/components/daqian_selectMainProject.vue";
import { types } from "util";
import { setTimeout } from 'timers';
export default {
    components: {
        carPlanDetailList,
        selectCity,
        selectMainProject
    },
    data() {
        var validateDataVersion = (rule, value, callback) => {
            if (this.createform.subProjectProcessType !== "5") {
                if (value === "") {
                    callback(new Error("请选择规范版本"));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var validateCity = (rule, value, callback) => {
            if (this.createform.subProjectProcessType !== "5") {
                if (value === "") {
                    callback(new Error("请选择城市"));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            // inspectTypeConfigure: {}, // 质检类型配置
            // radio2: 3,
            // forData: [{
            //         name: '基础要素作业',
            //         value: 3,
            //         forList: [{ name:'全流程质检', value: 3 }, { name:'全流程差分质检', value: 6 }, { name:'返修差分质检', value: 9 }]
            //     },{
            //         name: '基础要素接边',
            //         value: 3,
            //         forList: [{ name:'全流程质检', value: 3 }, { name:'全流程差分质检', value: 6 }, { name:'返修差分质检', value: 9 }]
            //     },{
            //         name: '高阶要素作业',
            //         value: 3,
            //         forList: [{ name:'全流程质检', value: 3 }, { name:'全流程差分质检', value: 6 }, { name:'返修差分质检', value: 9 }]
            //     },{
            //         name: '高阶要素接边',
            //         value: 6,
            //         forList: [{ name:'全流程质检', value: 3 }, { name:'全流程差分质检', value: 6 }, { name:'返修差分质检', value: 9 }]
            //     },{
            //         name: '回库接边',
            //         value: 9,
            //         forList: [{ name:'全流程质检', value: 3 }, { name:'全流程差分质检', value: 6 }, { name:'返修差分质检', value: 9 }]
            //     }
            // ],
            collapseFlag: false,
            accessDisabled: false,
            sourceFileList: [],
            fileList: [],
            formHeight: this.global.formHeight,
            statusMangerVisible: false,
            emitStatus: "",
            search: {
                user_id: sessionStorage.userid,
                inProjectName: "",
                mainProjectID: "",
                selectCity: "",
                subProjectType: "",
                subProjectProcessType: "",
                dataStandardVersion: "",
                sourceSubProjectName: "",
                sourceSubLibararyName: "",
                planTime: [],
                startTime: "",
                endTime: "",
                wy_collection_status: "",
                subProjectId: "",
                roadBranch: "",
                sort_field_name: "sub_project_id desc",
                project_status: "3",
                in_out_library_status: ""
            },
            searchDatas: {},
            projectStatusList: [],
            projectStatusListShow: "",
            showProjectStatus: "",
            projectStatusDisabled: true,
            cityOptions: cityData.children,
            selectedCitys: [],
            pageInfo: {
                perPage: 10,
                currentPage: 1,
                priorPage: 1,
                totalNumber: 0,
                subPerPage: 10,
                subCurrentPage: 1,
                subTotalNumber: 0
            },
            datasMap: {
                subProjectProcessAllTypes: {
                    "1": "常规项目",
                    "2": "更新项目",
                    "3": "修复项目",
                    "5": "构网项目"
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
                allCreateStatus: {
                    "2": "排队中",
                    "3": "创建中",
                    "4": "创建成功",
                    "5": "创建失败"
                },
                allWyCollectionStatus: {
                    "1": "待处理",
                    "2": "处理中",
                    "3": "完成"
                },
                qcStandardVersionDatas: {
                    "1": "2.4",
                    "2": "2.3",
                    "3": "2.1",
                    "4": "2.0"
                },
                projectStatus: {
                    "0": "全部",
                    "3": "进行中",
                    "4": "完结",
                    "5": "作废",
                    "6": "暂停"
                },
                projectStatusChange: {},
                inOutLibraryStatusDatas: {
                    "out_library_status_1": "未出库",
                    "out_library_status_2": "出库排队",
                    "out_library_status_3": "出库中",
                    "out_library_status_5": "出库失败",
                    "in_library_status_1": "未回库",
                    "in_library_status_2": "回库排队",
                    "in_library_status_3": "回库中",
                    "in_library_status_4": "回库成功",
                    "in_library_status_5": "回库失败",
                    "in_library_status_6": "不回库"
                }
            },
            dialogShowTaskVisible: false,
            dialogEditVisible: false,
            dialogCreateVisible: false,
            dialogCreateLibraryVisible: false,
            dialogAddSubLibraryVisible: false,
            dialogAddCollectionTaskVisible: false,
            dialogShowCollectTaskVisible: false,
            createform: {
                mainProjectID: "",
                name: "",
                subProjectType: "2",
                subProjectProcessType: "1",
                sourceType: "2",
                carFactory: "",
                libraryId: "",
                libraryName: "",
                subLibraryId: "",
                subLibraryName: "",
                masterLibraryId: [],
                sourceResultlibraryDataInfo: [],
                sourceMasterlibraryDataInfo: [],
                selectCity: "",
                StandardVersion: "",
                dataBranch: "",
                priorityLevel: 5,
                remarks: "",
                inherit_sub_project_id_list: "",
                machineNo: "",
                machineType: "1",
                algorithmParameters: "",
                csv_data: [],
                qcStandardVersion: "2.4",
                qcRuleVersion: ""
            },
            machineIDs: [],
            inheritSubProjectCount: 0,
            createLibform: {
                name: "",
                carFactory: "",
                memo: "",
                selectSubProjectList: []
            },

            addSubLibform: {
                libraryId: "",
                libraryName: "",
                carFactory: "",
                selectSubProjectList: []
            },
            librarys: {},
            createRules: {
                mainProjectID: [
                    {
                        required: true,
                        message: "请选择所属主项目",
                        trigger: "change"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请填写子项目名称",
                        trigger: "blur"
                    }
                ],
                subProjectProcessType: [
                    {
                        required: true,
                        message: "请选择项目类型",
                        trigger: "change"
                    }
                ],
                sourceType: [
                    {
                        required: true,
                        message: "请选择来源库类型",
                        trigger: "change"
                    }
                ],
                selectCity: [
                    //   { required: true, message: '请选择城市', trigger: 'change' }
                    {
                        validator: validateCity,
                        trigger: "change"
                    }
                ],
                masterLibraryId: [
                    {
                        required: true,
                        message: "请选择来源母库",
                        trigger: "change"
                    }
                ],
                StandardVersion: [
                    {
                        validator: validateDataVersion,
                        trigger: "change"
                    }
                ],
                dataBranch: [
                    {
                        required: true,
                        message: "请输入数据分支",
                        trigger: "blur"
                    }
                ],
                machineType: [
                    {
                        required: true,
                        message: "请选择机器类型",
                        trigger: "change"
                    }
                ],
                priorityLevel: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择优先级",
                        trigger: "change"
                    }
                ],
                qcRuleVersion: [
                    {
                        required: true,
                        message: "请选择质检项版本",
                        trigger: "change"
                    }
                ],
                qcStandardVersion: [
                    {
                        required: true,
                        message: "请选择质检标准版本",
                        trigger: "change"
                    }
                ],
                remarks: []
            },
            createLibRules: {
                name: [
                    {
                        required: true,
                        message: "请输入成果库名称",
                        trigger: "blur"
                    }
                ]
            },
            inSubProject: [],
            editRules: {
                sub_project_name: [
                    {
                        required: true,
                        message: "请输入子项目名称",
                        trigger: "blur"
                    }
                ],
                priority_level: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择优先级",
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
            subprojectData: [],
            carPlanData: {},
            multipleSubProjectSelection: [],
            // resetselectCityData: false,
            isCreatCityClearable: false,
            // isSearchCityClearable: true,
            addCollectionTaskForm: {
                show_sub_project_name: "",
                sub_project_id: "",
                sub_project_name: "",
                plan_id: "",
                memo: ""
            },
            collectDetail: {},
            loading: true,
            emptyText: "查询中",
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            collectTaskInfo: [],
            wy_task_lists: "",
            wy_task_lists_arr: [],
            taskInfoData: [],
            allTableData: [],
            selectAllFlag: false,
            selectNumber: 0,
            resetMainProject: false,
            QcRuleVersionData: [],
            userPermission: sessionStorage.user_permission
        };
    },
    computed: {
        tableData: function() {
            for (var val of this.subprojectData) {
                val.show_sub_project_process_type = this.datasMap.subProjectProcessAllTypes[
                    val.sub_project_process_type
                ];
                val.show_create_status = this.datasMap.allCreateStatus[val.create_status];
                val.show_project_status = this.datasMap.projectStatus[val.project_status];
                val.show_wy_collection_status = this.datasMap.allWyCollectionStatus[val.wy_collection_status];
                if (val.machine_type === "1") {
                    val.show_machine_type = "CPU";
                } else if (val.machine_type === "2") {
                    val.show_machine_type = "GPU";
                }
                val.show_project_name = showDataSet(val.project_id, val.project_name);
                val.show_user = showDataSet(val.user_id, val.user_name);
                val.show_source_sub_project_name = showDataSet(val.source_sub_project_id, val.source_sub_project_name);
                val.show_source_project_name = showDataSet(val.source_project_id, val.source_project_name);
                val.show_results_sub_library_name = showDataSet(
                    val.source_results_sub_library_id,
                    val.source_results_sub_library_name
                );
                val.show_results_library_name = showDataSet(
                    val.source_results_library_id,
                    val.source_results_library_name
                );
                val.show_master_library_name = showDataSet(
                    val.source_master_library_id,
                    val.source_master_library_name
                );
                val.show_host_group = showDescription(
                    "编号",
                    val.host_group_id,
                    "机器组详情",
                    val.host_group_description
                );
                val.show_flow_version = showDescription(
                    "版本",
                    val.algorithm_series_id,
                    "环境版本详情",
                    val.algorithm_series_description
                );
                // val.show_algorithm_version = showDescription('版本',val.algorithm_version,'算法版本详情',val.algorithm_version_description);
            }
            return this.subprojectData;
        },
        collectTableData: function() {
            for (var val of this.collectTaskInfo) {
                val.show_field_plan_name = showDataSet(val.field_plan_id, val.field_plan_name);
            }
            return this.collectTaskInfo.slice(
                (this.pageInfo.subCurrentPage - 1) * this.pageInfo.subPerPage,
                this.pageInfo.subCurrentPage * this.pageInfo.subPerPage
            );
        }
    },
    mounted() {
        // this.searchProject();
        this.queryQcRuleVersionData();
        this.accessDisabled = eval(sessionStorage.roteAuthotity);
    },
    updated() {
        this.$refs.subProjecttable.clearSelection();
        var tmpSelectData = this.multipleSubProjectSelection[this.pageInfo.currentPage - 1];
        if (tmpSelectData) {
            let arr = JSON.parse(JSON.stringify(tmpSelectData));
            for (var sel of tmpSelectData) {
                for (let index in this.tableData) {
                    if (JSON.stringify(sel) === JSON.stringify(this.tableData[index])) {
                        this.$refs.subProjecttable.toggleRowSelection(this.tableData[index]);
                    }
                }
            }
            this.multipleSubProjectSelection[this.pageInfo.currentPage - 1] = arr;
        }
    },
    methods: {
        // programme: function (val) {
        //     // 给了方案改数组和默认值
        //     let arr3 = [3,3,3,6,9];
        //     let arr6 = [6,6,6,6,9];
        //     let arr9 = [9,3,9,9,9];
        //     this.forData.map((ele,index) =>{
        //         if(val == 3){
        //             ele.value = arr3[index]
        //         }
        //         if(val == 6){
        //             ele.value = arr6[index]
        //         }
        //         if(val == 9){
        //             ele.value = arr9[index]
        //         }
        //     })
        // },
        formatSearchInput: function() {
            this.search.subProjectId = inputCheck(this, this.search.subProjectId, 1);
        },
        queryQcRuleVersionData: function() {
            let queryQcConfig = {
                user_id: sessionStorage.userid
            };
            this.$http.post("/api/query_qc_rule_version", queryQcConfig).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    this.QcRuleVersionData = data.data.qc_rule_version_list;
                    if (this.QcRuleVersionData.length > 0) {
                        this.createform.qcRuleVersion = this.QcRuleVersionData[0].qc_rule_version;
                    }
                }
            });
        },
        flowVersionChange: function(value) {
            if (value) {
                for (let item of this.flowVersions) {
                    if (value == item.algorithm_series_id) {
                        this.createform.showFlowVersion = showDescription(
                            "版本",
                            item.algorithm_series_id,
                            "环境版本详情",
                            item.algorithm_series_description
                        );
                        break;
                    }
                }
            }
        },
        suggestSubprojectName: function() {
            if (this.createform.dataBranch === "") {
                this.createform.dataBranch = pinyinUtil.getPinyin(this.createform.name, "", false);
            }
        },
        collapseChange(val) {
            this.collapseFlag = Boolean(val);
        },
        rowClick(row, event, column) {
            this.$refs.collectData.toggleRowExpansion(row);
        },
        selectDateChange: function(val) {
            if (val) {
                this.search.startTime = transformstartDate(this.search.planTime[0]);
                this.search.endTime = transformEndDate(this.search.planTime[1]);
            } else {
                this.search.startTime = "";
                this.search.endTime = "";
            }
        },
        searchProject: function(arg) {
            var querySubProjectData = {
                project_id: this.search.mainProjectID,
                sub_project_name: trim(this.search.inProjectName),
                city_name: this.search.selectCity,
                data_standard_version: this.search.dataStandardVersion,
                query_start_time: this.search.startTime,
                query_end_time: this.search.endTime,
                sort_field_name: this.search.sort_field_name,
                source_sub_project_name: this.search.sourceSubProjectName,
                source_results_sub_library_name: this.search.sourceSubLibararyName,
                sub_project_process_type: this.search.subProjectProcessType,
                wy_collection_status: this.search.wy_collection_status,
                sub_project_id: this.search.subProjectId,
                road_branch: this.search.roadBranch,
                query_or_export_data: 0,
                page_index: this.pageInfo.currentPage,
                page_size: this.pageInfo.perPage,
                return_all: arg && arg.return_all ? arg.return_all : 2,
                project_status: this.search.project_status,
                qc_rule_version: this.search.qc_rule_version,
                // qc_standard_version: this.search.qc_standard_version,
                in_out_library_status: this.search.in_out_library_status
            };
            if (!(arg && arg.loading)) {
                if (!(arg && arg.return_all)) {
                    this.subprojectData = [];
                    this.pageInfo.totalNumber = 0;
                    this.searchDatas = querySubProjectData;
                }
                this.pageInfo.currentPage = 1;
                this.multipleSubProjectSelection = [];
                this.loading = true;
            }
            this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
            this.searchDatas.page_index = this.pageInfo.currentPage;
            this.searchDatas.page_size = this.pageInfo.perPage;
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
                            this.pageInfo.totalNumber = Number(data.data.total_number);
                            if (arg && arg.return_all) {
                                var pagesNumber = Math.ceil(this.pageInfo.totalNumber / this.pageInfo.perPage);
                                for (var i = 0; i < pagesNumber; i++) {
                                    this.multipleSubProjectSelection[i] = data.data.sub_project_info.slice(
                                        i * this.pageInfo.perPage,
                                        (i + 1) * this.pageInfo.perPage
                                    );
                                }
                                this.allTableData = Object.assign(
                                    [],
                                    this.allTableData,
                                    this.multipleSubProjectSelection
                                );
                                if (this.allTableData.length > 0) {
                                    this.subprojectData = this.allTableData[0];
                                }
                                this.$refs.subProjecttable.clearSelection();
                                this.tableData.forEach(row => {
                                    this.$refs.subProjecttable.toggleRowSelection(row);
                                });
                                this.getSelectDatas();
                            } else {
                                this.subprojectData = data.data.sub_project_info;
                            }
                            if (this.pageInfo.totalNumber == 0) {
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
        onSearch: function(event) {
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.statusMangerVisible = false;
            this.searchProject(event);
        },
        onRefresh: function(event) {
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.search.mainProjectID = "2";
            this.search.inProjectName = "";
            this.search.selectCity = "";
            this.search.planTime = [];
            this.search.startTime = "";
            this.search.endTime = "";
            this.search.subProjectType = "";
            this.search.subProjectProcessType = "";
            this.search.sourceSubProjectName = "";
            this.search.sourceSubLibararyName = "";
            this.search.wy_collection_status = "";
            this.search.dataStandardVersion = "";
            this.search.roadBranch = "";
            this.search.subProjectId = "";
            this.search.project_status = "3";
            // this.resetselectCityData = true;
            this.$refs.subProjecttable.clearSort();
            this.search.sort_field_name = "sub_project_id desc";
            this.$refs.selectMainProject.reset();
            this.searchProject();
        },
        showSubprojectCarPlan: function(arg) {
            if (arg && arg.index > -1) {
                this.inSubProject = JSON.parse(JSON.stringify(this.tableData[arg.index]));
            }
            var query_carPlandata = {
                user_id: sessionStorage.userid,
                project_id: this.inSubProject.project_id,
                sub_project_id: this.inSubProject.sub_project_id,
                guilei_status: 0,
                gp_status: 0,
                query_start_time: "",
                query_end_time: "",
                city_name: "",
                page_index: arg.page_index ? arg.page_index : 1,
                page_size: arg.page_size ? arg.page_size : 10,
                return_all: 2
            };
            this.$http.post("/api/query_total_gp_status", query_carPlandata).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    this.dialogShowTaskVisible = true;
                    this.carPlanData = Object.assign({}, this.carPlanData, data);
                } else if (data.errno === 7) {
                    alertInfo(this, "warning", "该项目下没有外业任务");
                } else {
                    alertInfo(this, "error", "查询外业任务失败，" + data.msg);
                }
            });
        },
        sortTable: function(val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "sub_project_id desc";
            }
            this.onSearch();
        },
        addCollectionTask: function(index) {
            this.addCollectionTaskFormData = JSON.parse(JSON.stringify(this.tableData[index]));
            if (
                this.addCollectionTaskFormData.wy_collection_status == 1 ||
                this.addCollectionTaskFormData.wy_collection_status == 2
            ) {
                alertInfo(this, "warning", "已经下发补采任务，补采完成后可再次下发补采任务");
            } else {
                this.addCollectionTaskForm.memo = "";
                this.addCollectionTaskForm.show_sub_project_name = showDataSet(
                    this.addCollectionTaskFormData.sub_project_id,
                    this.addCollectionTaskFormData.sub_project_name
                );
                this.addCollectionTaskForm.sub_project_id = this.addCollectionTaskFormData.sub_project_id;
                this.addCollectionTaskForm.sub_project_name = this.addCollectionTaskFormData.sub_project_name;
                let subId = {
                    sub_project_id: this.addCollectionTaskForm.sub_project_id
                };
                this.$http.post("/api/query_plan_id_list", subId).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        this.addCollectionTaskForm.plan_id = data.data.plan_id;
                        this.dialogAddCollectionTaskVisible = true;
                    } else {
                        alertInfo(this, "error", "获取子项目关联外业计划失败，" + data.msg);
                    }
                });
            }
        },
        editSubproject: function(index) {
            this.inSubProject = JSON.parse(JSON.stringify(this.tableData[index]));
            this.dialogEditVisible = true;
        },
        showCollectionTaskResult: function(arg) {
            if (typeof arg.index != "undefined") {
                this.taskInfoData = JSON.parse(JSON.stringify(this.tableData[arg.index]));
            }
            let queryCollectionTaskData = {
                user_id: sessionStorage.userid,
                sub_project_id: this.taskInfoData.sub_project_id,
                page_size: arg.page_size ? arg.page_size : 10,
                page_index: arg.page_index ? arg.page_index : 1,
                return_all: 1
            };
            this.$http.post("/api/query_collection_task_info", queryCollectionTaskData).then(response => {
                this.collectTaskInfo = [];
                this.wy_task_lists_arr = [];
                this.wy_task_lists = "";
                this.pageInfo.subTotalNumber = 0;
                this.pageInfo.subCurrentPage = 1;
                var wy_task_lists = "";
                response = response.body;
                let data = response.data;
                if (data.errno === 0) {
                    this.dialogShowCollectTaskVisible = true;
                    this.collectTaskInfo = data.data.collection_task_info[0].collection_task_detail_info;
                    this.pageInfo.subTotalNumber = data.data.collection_task_info[0].total_number;
                    this.collectTaskInfo.memo = data.data.collection_task_info[0].memo;
                    for (let item of this.collectTaskInfo) {
                        if (item.wy_task_list) {
                            if (wy_task_lists) {
                                if (wy_task_lists.indexOf(item.wy_task_list) == -1) {
                                    wy_task_lists = wy_task_lists + "," + item.wy_task_list;
                                    this.wy_task_lists_arr.push(item.wy_task_list);
                                }
                            }
                        }
                        this.wy_task_lists = wy_task_lists;
                    }
                } else if (data.errno === 7) {
                    alertInfo(this, "error", "该项目下没有补采资料");
                } else {
                    alertInfo(this, "error", data.msg);
                }
            });
        },
        downloadCollectionTaskResult: function(index) {
            let downloadQueryData = JSON.parse(JSON.stringify(this.tableData[index]));
            let subId = {
                sub_project_id: downloadQueryData.sub_project_id
            };
            this.$http.post("/api/download_file_url", subId).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    let a = document.createElement("a");
                    a.href = data.data.url;
                    a.click();
                } else if (data.errno === 7) {
                    alertInfo(this, "error", "该项目下没有补采资料");
                } else {
                    alertInfo(this, "error", data.msg);
                }
            });
        },
        beforeUpload: function(file) {
            this.fileList = [];
            this.fileList.push({
                name: file.name
            });
            let fd = new FormData();
            fd.append("file", file);
            fd.append("user_id", this.search.user_id);
            fd.append("sub_project_id", this.addCollectionTaskForm.sub_project_id);
            fd.append("plan_id", this.addCollectionTaskForm.plan_id);
            this.UploadData = fd;
            return false;
        },
        handleExceed(files, fileList) {
            messageInfo(this, "warning", "当前限制只能选择 1 个文件，若要变更，请先删除已上传文件", 3000);
        },
        beforeUploadSourceFile: function(file) {
            this.sourceFileList = [];
            if (file.size > 1024 * 1024) {
                messageInfo(this, "error", "CSV 文件过大", 2000);
                return false;
            }
            this.sourceFileList.push({
                name: file.name
            });
            const fileReader = new FileReader();
            fileReader.readAsText(file, "gb2312");
            fileReader.onload = e => {
                const csvData = e.target.result;
                const data = this.parseCSV(csvData);
                this.createform.csv_data = data;
                if (!data) {
                    messageInfo(this, "error", "CSV 文件解析失败", 1500);
                    return false;
                }
                if (data.length === 0) {
                    messageInfo(this, "error", "数据文件不包含数据", 1500);
                }
                let tileNum = 0;
                for (let i = 1; i < data.length; i++) {
                    if (validateData(data[i][1])) {
                        let haveNoData = 0;
                        for (let item of data[i][1].split(",")) {
                            if (item == "") {
                                haveNoData++;
                            }
                        }
                        tileNum += data[i][1].split(",").length - haveNoData;
                    } else {
                        messageInfo(this, "error", "第" + (i + 1) + "行网格编号为空", 3000);
                        return false;
                    }
                }
                messageInfo(this, "sussess", "该csv文件共上传" + tileNum + "个网格", 3000);
            };
            return false;
        },
        parseCSV: function(str) {
            str = str.replace(/[，]/g, ",");
            const data = new CSV(str, {
                header: false,
                cellDelimiter: ","
            }).parse();
            const len = data.length;
            const result = [];
            for (let i = 0; i < len; i += 1) {
                const row = [];
                const size = data[i].length;
                for (let j = 0; j < size; j += 1) {
                    row.push(data[i][j].toString().trim());
                }
                result.push(row);
            }
            return result;
        },
        removeFile: function(file, fileList) {
            this.createform.csv_data = [];
        },
        createSubproject: function() {
            this.dialogCreateVisible = true;
            //查询机器组编号
            var queryMachineID = {
                user_id: sessionStorage.userid
            };
            this.$http.post("/api/query_all_host_group", queryMachineID).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    this.machineIDs = data.data.host_group_list;
                }
            });
            this.getLibraryList(2, "createform");
            this.getMasterLibraryList();
        },
        getMasterLibraryList: function() {
            var queryMasterLibraryData = {
                user_id: sessionStorage.userid,
                mark_status: 1,
                query_or_export_data: 0,
                return_all: 1,
                page_index: 1,
                page_size: 10
            };
            this.$http.post("/api/query_master_library", queryMasterLibraryData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    if (data.data.master_library_list.length) {
                        let handleData = [
                            {
                                //生成级联组件需要的数据
                                value: "1",
                                label: "项目库",
                                children: []
                            },
                            {
                                value: "2",
                                label: "基础库",
                                children: []
                            }
                        ];
                        for (let val of data.data.master_library_list) {
                            let josnData = {
                                value: val.master_library_id,
                                label: val.master_library_name
                            };
                            if (val.master_library_type === "1") {
                                handleData[0].children.push(josnData);
                            } else if (val.master_library_type === "2") {
                                handleData[1].children.push(josnData);
                            }
                        }
                        this.createform.sourceMasterlibraryDataInfo = handleData;
                        if (handleData[0].children.length > 0) {
                            this.createform.masterLibraryId = ["1", handleData[0].children[0].value];
                        } else if (handleData[1].children.length > 0) {
                            this.createform.masterLibraryId = ["2", handleData[1].children[0].value];
                        }
                    }
                }
            });
        },
        subProjectProcessTypeChange: function(val) {
            this.createform.dataBranch = "";
            if (this.$refs["createform"]) {
                this.$refs["createform"].clearValidate();
            }
            // 推荐数据分支
            // subProjectProcessType 2 更新项目 3 修复项目 5 构网项目
            if (val === "2" || val === "3") {
                this.createform.sourceType = "1";
                this.suggestSubprojectName();
            } else if (val === "5") {
                this.createform.sourceType = "1";
                this.suggestSubprojectName();
            } else if (val === "1") {
                this.suggestSubprojectName();
            }
        },
        sourceLibraryChange: function(val) {
            // sourceType 1 母库 2 成果库
            if (val === "2" && this.createform.sourceResultlibraryDataInfo.length > 0) {
                if (this.createform.subProjectProcessType === "2") {
                    this.createform.sourceResultlibraryDataInfo = this.recommendDataTrunk(
                        this.createform.sourceResultlibraryDataInfo,
                        "source_data_trunk",
                        "",
                        "GX_destination_data_trunk",
                        "GX_"
                    );
                    this.createform.dataBranch = this.createform.sourceResultlibraryDataInfo[0].GX_destination_data_trunk;
                } else if (this.createform.subProjectProcessType === "3") {
                    this.createform.sourceResultlibraryDataInfo = this.recommendDataTrunk(
                        this.createform.sourceResultlibraryDataInfo,
                        "source_data_trunk",
                        "",
                        "XF_destination_data_trunk",
                        "XF_"
                    );
                    this.createform.dataBranch = this.createform.sourceResultlibraryDataInfo[0].XF_destination_data_trunk;
                }
            }
        },
        createLibrary: function() {
            // 获取选择子项目信息
            let selectData = this.getSelectDatas();
            let nationalFlag = false;
            if (validateData(selectData)) {
                for (let item of selectData) {
                    if (item.sub_project_process_type == "5") {
                        nationalFlag = true;
                        alertInfo(this, "warning", "构网项目暂不支持生成成果库");
                        return;
                    }
                }
                if (!nationalFlag) {
                    // 成果数据分支推荐
                    this.createLibform.selectSubProjectList = this.recommendDataTrunk(
                        selectData,
                        "source_data_trunk",
                        this.createLibform.name,
                        "destination_data_trunk",
                        "CG_"
                    );
                    this.dialogCreateLibraryVisible = true;
                }
            } else {
                alertInfo(this, "warning", "请选择要生成成果库的子项目");
            }
        },
        // 添加至成果库按钮响应函数
        addSubLibrary: function() {
            // 获取选择子项目信息
            let selectData = this.getSelectDatas();
            let nationalFlag = false;
            if (validateData(selectData)) {
                for (let item of selectData) {
                    if (item.sub_project_process_type == "5") {
                        nationalFlag = true;
                        alertInfo(this, "warning", "构网项目暂不支持添加至成果库");
                        return;
                    }
                }
                if (!nationalFlag) {
                    this.addSubLibform.selectSubProjectList = selectData;
                    // 获取最新成果库列表信息并推荐分支
                    this.getLibraryList(0, "addSubLibform");
                    this.dialogAddSubLibraryVisible = true;
                }
            } else {
                alertInfo(this, "warning", "请选择要添加至成果库的子项目");
            }
        },
        submitaddCollectionTaskForm: function() {
            if (this.fileList.length === 0) {
                alertInfo(this, "error", "请上传补采资料");
            } else {
                let memo = this.addCollectionTaskForm.memo;
                this.UploadData.append("memo", memo);
                this.$http.post("/api/collection_field_task", this.UploadData).then(response => {
                    response = response.body;
                    let data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "补采资料上传成功", () => {
                            this.dialogAddCollectionTaskVisible = false;
                            this.fileList = [];
                            this.onSearch();
                        });
                    } else if (data.errno === 11) {
                        this.$confirm("问题层所属城市与项目所属城市不一致,是否继续？", "提示", {
                            cancelButtonText: "取消",
                            confirmButtonText: "确定",
                            type: "warning"
                        })
                            .then(() => {
                                this.UploadData.append("not_check_city", 1);
                                this.$http.post("/api/collection_field_task", this.UploadData).then(response => {
                                    response = response.body;
                                    let data = response.data;
                                    if (data.errno === 0) {
                                        alertInfo(this, "success", "补采资料上传成功", () => {
                                            this.dialogAddCollectionTaskVisible = false;
                                            this.fileList = [];
                                            this.onSearch();
                                        });
                                    } else {
                                        this.fileList = [];
                                        alertInfo(this, "error", "补采资料上传失败，" + data.msg);
                                    }
                                });
                            })
                            .catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "已取消上传补采资料",
                                    duration: 1500
                                });
                            });
                    } else {
                        this.fileList = [];
                        alertInfo(this, "error", "补采资料上传失败，" + data.msg);
                    }
                });
            }
        },
        statusManger: function() {
            let selectData = this.getSelectDatas();
            let list = [];
            if (validateData(selectData)) {
                // 循环校验status是否相同
                for (let i in selectData) {
                    if (i > 0) {
                        if (selectData[i - 1].project_status !== selectData[i].project_status) {
                            alertInfo(this, "warning", "请选择相同状态项目");
                            return;
                        }
                    }
                    list.push(selectData[i].sub_project_id);
                }
                let status = selectData[0].project_status;
                this.sourceProjectStatus = status;
                if (status === "5") {
                    alertInfo(this, "warning", "已作废项目不可修改为其他状态");
                    return;
                }
                this.projectStatusDisabled = false;
                this.statusMangerVisible = true;
                this.showProjectStatus = this.datasMap.projectStatus[status];
                this.projectStatusList = list;
                this.projectStatusListShow = list.join(";");
                if (status === "3") {
                    this.datasMap.projectStatusChange = {
                        "4": "完结",
                        "5": "作废",
                        "6": "暂停"
                    };
                    this.emitStatus = "4";
                } else if (status === "4") {
                    this.datasMap.projectStatusChange = {
                        "3": "进行中"
                    };
                    this.emitStatus = "3";
                } else if (status === "6") {
                    this.datasMap.projectStatusChange = {
                        "3": "进行中",
                        "6": "暂停"
                    };
                    this.emitStatus = "3";
                }
            } else {
                alertInfo(this, "warning", "请先选择");
            }
        },
        beforesubmitProjectStatus: function() {
            if (this.emitStatus === "5") {
                this.$confirm("修改为作废后将删除所有资料，是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.submitProjectStatus();
                });
            } else {
                this.submitProjectStatus();
            }
        },
        submitProjectStatus: function() {
            let queryEditData = {
                user_id: sessionStorage.userid,
                sub_project_id: this.projectStatusList.join(","),
                source_project_status: this.sourceProjectStatus,
                project_status: this.emitStatus,
                edit_type: 2
            };
            this.$http.post("/api/modify_sub_project", queryEditData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(this, "success", "项目状态修改成功", () => {
                        this.statusMangerVisible = false;
                        setTimeout(()=>{
                            this.onSearch();
                        })
                    });
                } else {
                    alertInfo(this, "error", "项目状态修改失败，" + data.msg);
                }
            });
        },
        getSelectDatas: function() {
            let selectSubProjectList = [];
            for (var val of this.multipleSubProjectSelection) {
                for (var item of val) {
                    selectSubProjectList.push({
                        sub_project_id: item.sub_project_id,
                        sub_project_process_type: item.sub_project_process_type,
                        sub_project_name: item.sub_project_name,
                        source_data_trunk: item.data_trunk_name,
                        project_status: item.project_status,
                        source_branch_time: "",
                        destination_data_trunk: "",
                        tile_id_list: ""
                    });
                }
            }
            this.selectNumber = selectSubProjectList.length;
            this.selectAllFlag = this.selectNumber == this.pageInfo.totalNumber;
            return selectSubProjectList;
        },
        // 查询获取最新成果库列表信息
        // query_sub_info 0 不查询子成果库信息 1查询子成果库信息
        // data_set_type 'addSubLibform' 添加至成果库操作时 'createform' 新建项目时
        getLibraryList: function(query_sub_info, data_set_type) {
            var queryResultLibraryData = {
                //"user_id":sessionStorage.userid,
                results_library_id: 0,
                results_library_name: "",
                car_factory: "",
                query_start_time: "",
                query_end_time: "",
                is_query_sub_library: query_sub_info,
                query_or_export_data: 0,
                page_index: 1,
                page_size: 10,
                return_all: 1
            };
            this.$http.post("/api/query_results_library", queryResultLibraryData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    if (data.data.results_library_info.length) {
                        this.librarys = {};
                        // 构造车厂、成果库、子成果库三级数据结构
                        for (var val of data.data.results_library_info) {
                            if (this.librarys[val.car_factory]) {
                                this.librarys[val.car_factory][val.results_library_id] = {
                                    results_library_name: val.results_library_name,
                                    sub_libarary_list: val.results_sub_library_info
                                };
                            } else {
                                var tmpLibInfo = {};
                                tmpLibInfo[val.results_library_id] = {
                                    results_library_name: val.results_library_name,
                                    sub_libarary_list: val.results_sub_library_info
                                };
                                this.librarys[val.car_factory] = tmpLibInfo;
                            }
                        }
                        // 设置默认车厂
                        let carFactory = data.data.results_library_info[0].car_factory;
                        this.libararyDataSet(data_set_type, carFactory);
                    }
                }
            });
        },
        // 新建子项目或者添加至成果库功能中，选择车厂变化时响应函数
        libararyDataSet: function(data_set_type, carFactory) {
            // 设置默认车厂
            if (carFactory) {
                this[data_set_type].carFactory = carFactory;
            }
            // 设置该车厂下默认选择的成果库
            this[data_set_type].libraryId = "";
            if (this[data_set_type].carFactory) {
                let libraryList = this.librarys[this[data_set_type].carFactory];
                for (var key in libraryList) {
                    if (!this[data_set_type].libraryId) {
                        // 默认选择的成果库ID
                        this[data_set_type].libraryId = key;
                    }
                }
                // 默认选择的成果库名称
                this[data_set_type].libraryName = libraryList[this[data_set_type].libraryId].results_library_name;
                if (data_set_type === "addSubLibform") {
                    // 以选择的成果库名称，推荐成果数据分支
                    this[data_set_type].selectSubProjectList = this.recommendDataTrunk(
                        this[data_set_type].selectSubProjectList,
                        "source_data_trunk",
                        this[data_set_type].libraryName,
                        "destination_data_trunk",
                        "CG_"
                    );
                } else if (data_set_type === "createform") {
                    // 设置该成果库下默认选择的子成果库
                    this.selectLibraryChange(data_set_type);
                }
            }
        },
        // 新建子项目时，选择成果库变化的响应函数
        selectLibraryChange: function(data_set_type) {
            this.createform.sourceResultlibraryDataInfo = [];
            // 获取所选择车厂及成果库下的子成果库列表
            let subLibraryList = this.librarys[this.createform.carFactory][this.createform.libraryId].sub_libarary_list;
            if(subLibraryList.length != 0){ // v_s: 不加判断新建子项目时会报错
                // 设置默认选择子成果库信息
                this.createform.subLibraryId = subLibraryList[0].results_sub_library_id;
                this.createform.subLibraryName = subLibraryList[0].results_sub_library_name;
                // 推荐成果更新数据分支
                this.createform.sourceResultlibraryDataInfo.push(subLibraryList[0]);
            }
            // subProjectProcessType 2 更新项目 3 修复项目
            if (this.createform.subProjectProcessType === "2") {
                this.createform.sourceResultlibraryDataInfo = this.recommendDataTrunk(
                    this.createform.sourceResultlibraryDataInfo,
                    "source_data_trunk",
                    "",
                    "GX_destination_data_trunk",
                    "GX_"
                );
                this.createform.dataBranch = this.createform.sourceResultlibraryDataInfo[0].GX_destination_data_trunk;
            } else if (this.createform.subProjectProcessType === "3") {
                this.createform.sourceResultlibraryDataInfo = this.recommendDataTrunk(
                    this.createform.sourceResultlibraryDataInfo,
                    "source_data_trunk",
                    "",
                    "XF_destination_data_trunk",
                    "XF_"
                );
                this.createform.dataBranch = this.createform.sourceResultlibraryDataInfo[0].XF_destination_data_trunk;
            }
        },
        // 新建子项目时，选择子成果库变化的响应函数
        subLibraryNameChange: function(val) {
            this.createform.sourceResultlibraryDataInfo = [];
            let subLibraryList = this.librarys[this.createform.carFactory][this.createform.libraryId].sub_libarary_list;
            for (let item of subLibraryList) {
                if (item.results_sub_library_id === val) {
                    this.createform.sourceResultlibraryDataInfo.push(item);
                }
            }
            // recommendDataTrunk
            // subProjectProcessType 2 更新项目 3 修复项目
            if (this.createform.subProjectProcessType === "2") {
                this.createform.sourceResultlibraryDataInfo = this.recommendDataTrunk(
                    this.createform.sourceResultlibraryDataInfo,
                    "source_data_trunk",
                    "",
                    "GX_destination_data_trunk",
                    "GX_"
                );
                this.createform.dataBranch = this.createform.sourceResultlibraryDataInfo[0].GX_destination_data_trunk;
            } else if (this.createform.subProjectProcessType === "3") {
                this.createform.sourceResultlibraryDataInfo = this.recommendDataTrunk(
                    this.createform.sourceResultlibraryDataInfo,
                    "source_data_trunk",
                    "",
                    "XF_destination_data_trunk",
                    "XF_"
                );
                this.createform.dataBranch = this.createform.sourceResultlibraryDataInfo[0].XF_destination_data_trunk;
            }
        },
        formatTileIDInput: function(tmpString) {
            inputCheck(this, tmpString, 2);
        },
        // 生成成果库或添加至成果库时，成果库名称变化的响应函数
        libraryNameChange: function(data_set_type) {
            if (data_set_type === "addSubLibform") {
                let libraryList = this.librarys[this[data_set_type].carFactory];
                this[data_set_type].libraryName = libraryList[this[data_set_type].libraryId].results_library_name;
                this[data_set_type].selectSubProjectList = this.recommendDataTrunk(
                    this[data_set_type].selectSubProjectList,
                    "source_data_trunk",
                    this[data_set_type].libraryName,
                    "destination_data_trunk",
                    "CG_"
                );
            } else if (data_set_type === "createLibform") {
                this[data_set_type].selectSubProjectList = this.recommendDataTrunk(
                    this[data_set_type].selectSubProjectList,
                    "source_data_trunk",
                    this[data_set_type].name,
                    "destination_data_trunk",
                    "CG_"
                );
            }
        },

        // 提交新建子项目信息
        submitCreateForm: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // for(let ele of this.forData) { // v_s:质检类型配置赋值
                    //     this.inspectTypeConfigure[ele.name] = ele.value;
                    // }
                    // 常规项目
                    if (this.createform.subProjectProcessType === "1") {
                        this.postCreateProjectInfo();
                    } else if (
                        this.createform.subProjectProcessType === "2" ||
                        this.createform.subProjectProcessType === "3"
                    ) {
                        // 来源母库
                        if (this.createform.sourceType === "1") {
                            this.postCreateProjectInfo();
                        } else if (this.createform.sourceType === "2") {
                            // 来源成果库
                            this.postCreateProjectInfo();
                        }
                    } else if (this.createform.subProjectProcessType === "5") {
                        if (this.createform.csv_data.length === 0) {
                            alertInfo(this, "error", "请上传待构网数据");
                        } else {
                            this.postCreateProjectInfo();
                        }
                    }
                } else {
                    return false;
                }
            });
        },
        postCreateProjectInfo: function() {
            var queryCreateData = {
                project_id: this.createform.mainProjectID,
                sub_project_name: trim(this.createform.name),
                sub_project_process_type: this.createform.subProjectProcessType,
                source_results_sub_library_id: this.createform.sourceType === "1" ? "" : this.createform.subLibraryId,
                library_type: this.createform.sourceType,
                source_master_library_id:
                    this.createform.sourceType === "2" ? "" : this.createform.masterLibraryId.length > 1 ? this.createform.masterLibraryId[1] : "",
                data_trunk_name: trim(this.createform.dataBranch), // v_s: 数据分支要返回
                data_standard_version: this.createform.StandardVersion,
                priority_level: this.createform.priorityLevel,
                memo: trim(this.createform.remarks),
                inherit_sub_project_id_list: this.createform.inherit_sub_project_id_list,
                car_day_id_list: "",
                host_group_id: this.createform.machineNo,
                machine_type: this.createform.machineType,
                algorithm_parameters: this.createform.algorithmParameters,
                csv_data: this.createform.csv_data,
                algorithm_series_id: this.createform.flowVersion,
                qc_rule_version: this.createform.qcRuleVersion,
                qc_standard_version: this.createform.qcStandardVersion
            };
            this.$http.post("/api/create_sub_project", queryCreateData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(this, "success", "子项目创建成功，子项目编号:" + data.data.sub_project_id, () => {
                        this.dialogCreateVisible = false;
                        if (this.search.mainProjectID) {
                            this.search.mainProjectID = this.createform.mainProjectID;
                        }
                    });
                    this.onSearch();
                } else {
                    alertInfo(this, "error", "子项目创建失败，" + data.msg);
                    return false;
                }
            });
        },
        // 提交编辑子项目信息
        submitEditForm: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var queryEditData = {
                        user_id: sessionStorage.userid,
                        sub_project_id: this.inSubProject.sub_project_id,
                        sub_project_name: trim(this.inSubProject.sub_project_name),
                        priority_level: this.inSubProject.priority_level,
                        data_standard_version: this.inSubProject.data_standard_version,
                        memo: trim(this.inSubProject.memo),
                        edit_type: 1
                    };
                    this.$http.post("/api/modify_sub_project", queryEditData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "子项目编辑成功", () => {
                                this.dialogEditVisible = false;
                            });
                            this.onSearch();
                        } else {
                            alertInfo(this, "error", "子项目编辑失败，" + data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        // 提交生成成果库信息
        submitCreateLibraryForm: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var queryCreatLibraryData = {
                        user_id: sessionStorage.userid,
                        results_library_name: this.createLibform.name,
                        car_factory: this.createLibform.carFactory,
                        sub_project_list: this.createLibform.selectSubProjectList,
                        memo: trim(this.createLibform.memo)
                    };
                    this.$http.post("/api/generate_results_library", queryCreatLibraryData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(
                                this,
                                "success",
                                "成果库生成成功，成果库编号：" + data.data.results_library_id,
                                () => {
                                    this.dialogCreateLibraryVisible = false;
                                    this.onSearch();
                                }
                            );
                        } else {
                            alertInfo(this, "error", "成果库生成失败，" + data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        // 提交添加至成果库信息
        submitAddLibraryForm: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var queryAddLibraryData = {
                        user_id: sessionStorage.userid,
                        results_library_id: this.addSubLibform.libraryId,
                        results_library_name: this.addSubLibform.libraryName,
                        car_factory: this.addSubLibform.carFactory,
                        sub_project_list: this.addSubLibform.selectSubProjectList,
                        memo: trim(this.createLibform.memo)
                    };
                    this.$http.post("/api/add_sub_results_library", queryAddLibraryData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(
                                this,
                                "success",
                                "成功添加至成果库，子成果库编号：" + data.data.sub_results_library_id,
                                () => {
                                    this.dialogAddSubLibraryVisible = false;
                                    this.onSearch();
                                }
                            );
                        } else {
                            alertInfo(this, "error", "添加至成果库失败，" + data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //推荐数据分支
        recommendDataTrunk: function(sourceList, sourceString, baseString, destinationString, prefixString) {
            var nowDate = new Date();
            var nowDay = nowDate.getFullYear();
            if (nowDate.getMonth() + 1 < 10) {
                nowDay += "0" + (nowDate.getMonth() + 1);
            } else {
                nowDay += "" + (nowDate.getMonth() + 1);
            }
            if (nowDate.getDate() < 10) {
                nowDay += "0" + nowDate.getDate();
            } else {
                nowDay += nowDate.getDate();
            }
            if (sourceList.length) {
                for (var val of sourceList) {
                    //var tmpData_trunk = val.source_data_trunk.replace(/[-]/g,'_').replace(/[\/]/g,'');
                    var tmpData_trunk = val[sourceString].replace(/[-]/g, "_").replace(/[\/]/g, "");
                    var tmpDataTrunks = tmpData_trunk.split("_");
                    if (tmpDataTrunks.length > 1) {
                        if (!isNaN(tmpDataTrunks[tmpDataTrunks.length - 1])) {
                            if (tmpDataTrunks[tmpDataTrunks.length - 1].length > 2) {
                                tmpDataTrunks.pop();
                            }
                        }
                    }
                    if (tmpDataTrunks[0] && tmpDataTrunks[0] + "_" === prefixString) {
                        prefixString = "";
                    }
                    tmpData_trunk = tmpDataTrunks.join("_");
                    if (baseString) {
                        Vue.set(
                            val,
                            destinationString,
                            prefixString + pinyinUtil.getFirstLetter(baseString) + "_" + tmpData_trunk + "_" + nowDay
                        );
                    } else {
                        Vue.set(val, destinationString, prefixString + tmpData_trunk + "_" + nowDay);
                    }
                }
            }
            return sourceList;
        },
        triggerVadidate: function(formName) {
            this.$refs[formName].validate();
        },
        subProjectSelectionChange: function(val) {
            this.multipleSubProjectSelection[this.pageInfo.currentPage - 1] = val;
            var pagesNumber = Math.ceil(this.pageInfo.totalNumber / this.pageInfo.perPage);
            for (var i = 0; i < pagesNumber; i++) {
                if (i == this.pageInfo.currentPage - 1) {
                    this.multipleSubProjectSelection[i] = val;
                } else {
                    if (typeof this.multipleSubProjectSelection[i] == "undefined") {
                        this.multipleSubProjectSelection[i] = [];
                    }
                }
            }
            this.getSelectDatas();
        },
        pageSizeChange: function(val) {
            this.multipleSubProjectSelection = [];
            this.pageInfo.perPage = val;
            this.onSearch({
                loading: true
            });
        },
        pageCurrentChange: function(val) {
            this.pageInfo.priorPage = this.pageInfo.currentPage;
            this.pageInfo.currentPage = val;
            if (this.allTableData.length > 0) {
                this.subprojectData = this.allTableData[val - 1];
                return;
            }
            this.searchProject({
                loading: true
            });
        },
        selectAll: function() {
            if (this.selectAllFlag) {
                this.searchProject({
                    return_all: 1
                });
            } else {
                this.multipleSubProjectSelection = [];
                this.$refs.subProjecttable.clearSelection();
                this.getSelectDatas();
            }
        },
        subpageSizeChange: function(val) {
            this.pageInfo.subPerPage = val;
        },
        subpageCurrentChange: function(val) {
            this.pageInfo.subCurrentPage = val;
        },
        // updateCityStatus: function (data){
        //     this.resetselectCityData = false;
        // },
        // selectSearchCitys: function (data){
        //     this.search.selectCity = data;
        // },
        createCityChange: function(val) {
            if (val.length == 2) {
                this.createform.selectCity = val[1];
            } else if (val.length == 1) {
                this.createform.selectCity = val[0];
            } else {
                this.createform.selectCity = "";
            }
        },
        // 继承子项目输入校验
        formatSubProjectIdInput: function() {
            this.createform.inherit_sub_project_id_list = inputCheck(
                this,
                this.createform.inherit_sub_project_id_list,
                7
            );
        },
        formatPlanIdInput: function() {
            this.addCollectionTaskForm.plan_id = inputCheck(this, this.addCollectionTaskForm.plan_id, 7);
        },
        formatLinkListIdInput: function() {
            this.addCollectionTaskForm.link_id = inputCheck(this, this.addCollectionTaskForm.link_id, 7);
        },

        getSubProjectCount: function(val) {
            let inheritSubProject = trim(val).split(/[,; ]/);
            let num = 0;
            for (let val of inheritSubProject) {
                if (!val) {
                    num++;
                }
            }
            this.inheritSubProjectCount = inheritSubProject.length - num;
        }
    }
};
</script>
<style lang="scss">
.subProject {
    .overv {
        .el-input {
            .el-input__inner {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }

    .el-cascader .el-input__inner {
        width: 320px;
    }

    .text-left {
        text-align: left;
    }
}
</style>
<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;

.el-dropdown-menu__item {
    font-size: 12px;
    color: #409eff;
}
.menu-el-dropdown {
    vertical-align: top;
}

.menu-el-dropdown-menu {
    padding: 0px;
}
::-webkit-scrollbar {
    display: none;
}

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    float: left;
    text-align: left;
    max-height: 100px;
    word-break: break-all;
    overflow-x: hidden;
    overflow-y: scroll;
}

.menu-center {
    text-align: center;
    border-bottom: 1px solid #ccc;
    min-width: 115px;
    color: #606266;
    font-size: 14px;
}

.menu-center-last {
    text-align: center;
    min-width: 115px;
    color: #606266;
    font-size: 14px;
}
.center {
    text-align: center;
    min-width: 90px;
}

.pagination-area {
    width: 95%;
    text-align: right;
    margin: 30px 0 0px 0;
}

.subProject {
    height: $height;
    width: $width;
    overflow: auto;

    .searchArea {
        width: $width;
        min-height: 50px;
        padding-top: 10px;
        background: #fff;
        display: flex;
        opacity: 1;
    }

    .searchDiv {
        width: $width;
        height: 100%;
    }

    .selectArea {
        margin-top: 10px;
        width: $width;
        overflow: hidden;
    }

    .selectDiv {
        float: left;
        margin: 0 15px 15px 10px;
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
        // margin-right: 82px;
        width: 300px;
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

        .el-dropdown-link {
            margin: 5px 10px 5px 10px;
            font-size: 12px;
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
        max-width: 300px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 15px;
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

    .right {
        text-align: right;
        margin-bottom: 20px;
    }

    .tipInfo-1 {
        text-align: left;
        width: 100%;
        margin: -10px 0 5px 120px;
    }

    .subProjectSelected {
        width: 100%;
        float: left;

        span {
            text-align: left;
            float: left;
        }
    }
}
</style>
