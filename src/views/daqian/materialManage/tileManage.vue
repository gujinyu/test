<template>
    <div class="tileManage">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:32px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectDiv">
                        <span class="align-right">所属项目：</span>
                        <selectProject class="cascader-select-style" @updateProjectStatus="updateProjectStatus" @selectProjects="SelectProjects" :ChangeOnselect="projectSelectOptions.changeOnselect" :isProjectClearable="projectSelectOptions.isProjectClearable" :havedefaultProject="projectSelectOptions.havedefaultProject" :showSelectProject="projectSelectOptions.showSelectProject" :resetselectProjectData="projectSelectOptions.resetselectProjectData" size="mini"></selectProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus" :content="search.tileID">
                            <el-input size="mini" slot="reference" v-model="search.tileID" :change="formatSearchInput()" clearable placeholder="请输入..."></el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">归属城市：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.tileID">
                            <el-input slot="reference" size="mini" v-model="search.city_name" clearable placeholder="搜索城市名称"></el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">出库状态：</span>
                        <el-select size="mini" v-model="search.outLibraryStatus" clearable placeholder="全部" class="widthBox">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.outLibraryAllStatus" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">出库类型：</span>
                        <el-select size="mini" v-model="search.outLibraryType" clearable placeholder="全部" class="widthBox">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.outLibraryAllTypes" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">回库状态：</span>
                        <el-select size="mini" v-model="search.inLibraryStatus" clearable placeholder="全部" class="widthBox">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.inLibraryAllStatus" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">项目类型：</span>
                        <el-select v-model="search.subProjectProcessType" placeholder="全部" clearable class="widthBox" size="mini">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.subProjectProcessAllTypes" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">项目状态：</span>
                        <el-select v-model="search.project_status" placeholder="全部" class="widthBox" size="mini">
                            <template>
                                <el-option v-for="(item,index) in this.datasMap.projectStatus" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">源子项目名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.sourceSubProjectName">
                            <el-input class="input-style" slot="reference" size="mini" v-model="search.sourceSubProjectName" clearable placeholder="请输入..."></el-input>
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
                        <el-button type="primary" size="mini" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="mini" v-on:click="onRefresh">刷新</el-button>
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
            <!-- 按钮区 begin-->
            <div class="button-area">
                <el-button class="right-div" type="primary" size="mini" @click="inLibrary()" :disabled="accessDisabled">回库</el-button>
                <el-button class="right-div" type="primary" size="mini" @click="outLibrary()" :disabled="accessDisabled">出库</el-button>
                <el-button class="right-div" type="primary" size="mini" @click="outLibrarySuggest()" :disabled="accessDisabled">出库推荐</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="select-area">
                <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                <span class="select-number">共 <b>{{totalNumber}}</b> 条</span>
                <span class="select-number">已选<b> {{tileList.length}} </b>条记录</span>
            </div>
        </div>
        <!-- 列表、地图tab切换区 end-->
        <!-- 展示区 begin-->
        <div class="show-area">
            <!-- 地图展示区 begin-->
            <div v-show="showMode === 'Map'" class="map-area" v-bind:style="{height: global.mapHeight + 'px'}">
                <drawMap @drawMapInfo="drawMapInfo" @sendTilesInScreen="getTilesInScreen" @drawMapCall="drawMapCall" :tileList="tileList" :routerParams="routerParams" :haveLegend="haveLegend" :optionalList="optionalList" ref="drawMap"></drawMap>
            </div>
            <div v-show="showMode !== 'Map'">
                <div class="table-div">
                    <el-table size="mini" :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="tilesTables" border style="width: 100%" @select="tileSelectionChange" @select-all="tileSelectionChange" @sort-change="sortTable">
                        <!--@cell-dblclick="showEditMemo"-->
                        <el-table-column fixed type="selection" width="55"></el-table-column>
                        <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip sortable="custom" width="105"></el-table-column>
                        <el-table-column fixed prop="city_name" show-overflow-tooltip label="城市" width="80"></el-table-column>
                        <el-table-column fixed prop="show_sub_project_name" label="所属子项目" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="show_project_name" label="所属主项目" show-overflow-tooltip width="95"></el-table-column>
                        <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                        <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                        <el-table-column prop="show_out_library_status" show-overflow-tooltip label="出库状态" width="120"></el-table-column>
                        <el-table-column prop="show_out_library_type" show-overflow-tooltip label="出库类型" width="120"></el-table-column>
                        <el-table-column prop="show_out_library_segment" show-overflow-tooltip label="出库阶段" width="120"></el-table-column>
                        <el-table-column prop="show_in_library_status" show-overflow-tooltip label="回库状态" width="120"></el-table-column>
                        <el-table-column prop="show_algorithm_version" show-overflow-tooltip label="算法类型" width="120"></el-table-column>
                        <el-table-column prop="data_standard_version" show-overflow-tooltip label="规范版本" width="120"></el-table-column>
                        <el-table-column prop="show_source_master_library_name" show-overflow-tooltip label="源母库" width="95"></el-table-column>
                        <el-table-column prop="show_build_network_sub_project" show-overflow-tooltip label="关联待构网子项目" width="135"></el-table-column>
                        <el-table-column prop="show_build_network_master_library" show-overflow-tooltip label="关联待构网母库" width="120"></el-table-column>
                        <el-table-column prop="update_wy_number" label="关联新增外业任务数" show-overflow-tooltip sortable="custom" width="175"></el-table-column>
                        <el-table-column prop="source_wy_number" label="关联继承外业任务数" show-overflow-tooltip sortable="custom" width="175"></el-table-column>
                        <el-table-column prop="update_wy_list" label="关联新增车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="update_storage_task_list" label="关联新增存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="source_wy_list" label="关联继承车天编号" show-overflow-tooltip width="160"></el-table-column>
                        <el-table-column prop="source_storage_task_list" label="关联继承存储编号" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column prop="show_results_sub_library_name" show-overflow-tooltip label="源子成果库" width="95"></el-table-column>
                        <el-table-column prop="show_source_sub_project_name" show-overflow-tooltip label="源子项目" width="105"></el-table-column>
                        <!-- <el-table-column prop="source_branch_time" show-overflow-tooltip label="源分支时间" width="160"></el-table-column> -->
                        <!-- <el-table-column prop="source_branch_version" show-overflow-tooltip label="源分支版本" width="95"></el-table-column> -->
                        <!-- <el-table-column prop="out_library_number" label="并行出库数" sortable="custom" show-overflow-tooltip width="115"></el-table-column> -->
                        <el-table-column prop="show_out_library_user" label="出库用户" show-overflow-tooltip width="115"></el-table-column>
                        <el-table-column prop="out_library_start_time" label="出库开始时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="out_library_end_time" label="出库结束时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="show_in_library_user" label="回库用户" show-overflow-tooltip width="115"></el-table-column>
                        <el-table-column prop="in_library_start_time" label="回库开始时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
                        <el-table-column prop="in_library_end_time" label="回库结束时间" show-overflow-tooltip sortable="custom" width="155"></el-table-column>
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
        <!-- 网格出库 begin-->
        <el-dialog title="网格出库配置" :visible.sync="dialogOutLibraryVisible" :close-on-click-modal="false">
            <el-form label-width="150px" :model="outLibraryData" ref="outLibraryData" class="demo-dynamic">
                <el-form-item label="项目类型">
                    <div style="float:left;display:inline-block;">
                        <b>{{outLibraryData.subProjecType}}</b>
                    </div>
                </el-form-item>
                <el-form-item label="出库类型" required>
                    <div style="float:left;display:inline-block;">
                        <el-radio-group v-model="outLibraryData.outLibraryType" size="mini">
                            <el-radio :label="20" :disabled="outAccess.processOutAccess">后预处理出库</el-radio>
                            <el-radio :label="34" :disabled="outAccess.operationOutAccess">作业出库</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="出库环节" required v-if="outLibrarySegmentShow">
                    <el-select v-model="outLibraryData.outLibrarySegment" style="float: left" placeholder="请选择出库环节" size="mini">
                        <template>
                            <el-option v-for="(item,index) in this.datasMap.outLibraryProcessSegment" :key="index" :value="index" :label="item" v-if="outLibraryData.outLibraryType === 20"></el-option>
                            <el-option v-for="(item,index) in this.datasMap.outLibraryOperationSegment" :key="index" :value="index" :label="item" v-if="outLibraryData.outLibraryType === 34"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="出库网格" prop="tileIDS" :rules="[{ required: true, message: '请选择或输入要进行出库的网格ID', trigger: 'blur'},
                        { required: true, message: '请选择或输入要进行出库的网格ID', trigger: 'change'}]">
                    <el-input v-model="outLibraryData.tileIDS" @blur="refreshSelectTiles(outLibraryData.tileIDS)" placeholder="请选择或输入要进行出库的网格ID，多个网格ID用分号分隔，仅可输入数字和分号" :change="formatOutLibraryTileInput()" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo-1" v-html="tipInfoMessage"></p>
                <el-form-item v-if="jbTileShow || this.nowLibraryType == 1&&this.nowSearchSubprojectType === '3'" label="外扩网格" prop="JbTileIDS">
                    <div style="float:left;display:inline-block;" v-if="this.nowLibraryType == 1&&this.nowSearchSubprojectType === '3'">
                        <el-radio-group v-model="isExtend" @change="extendEvents" size="small">
                            <el-radio-button :label="0">无</el-radio-button>
                            <el-radio-button :label="1">八邻域外扩</el-radio-button>
                        </el-radio-group>
                    </div>
                    <el-input v-if="jbTileShow" v-model="showJbTileList" readonly type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo-1" v-if="jbTileShow" v-html="jbTipInfoMessage"></p>
                <el-form-item>
                    <el-button type="primary" @click="submitOutLibraryForm()">出库</el-button>
                    <el-button @click="dialogOutLibraryVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 网格出库 end-->
        <!-- 网格回库 begin-->
        <el-dialog title="网格回库配置" :visible.sync="dialogInLibraryVisible" :close-on-click-modal="false">
            <el-form label-width="150px" :model="inLibraryData" ref="inLibraryData" class="demo-dynamic">
                <el-form-item label="回库类型" required>
                    <div style="float:left;display:inline-block;">
                        <el-radio-group v-model="inLibraryData.inLibraryType" size="mini">
                            <el-radio :label="1" :disabled="inAccess.returnLibray">回库</el-radio>
                            <el-radio :label="2" :disabled="inAccess.noReturnLibray">不回库</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item :label="inLibraryData.text" prop="tileIDS" :rules="[{ required: true, message: '请选择或输入要进行回库配置的网格ID', trigger: 'blur'},
                        { required: true, message: '请选择或输入要进行回库配置的网格ID', trigger: 'change'}]">
                    <el-input :readonly="returnLibrayReadonly" v-model="inLibraryData.tileIDS" @blur="refreshSelectTiles(inLibraryData.tileIDS)" placeholder="请选择或输入要进行回库配置的网格ID，多个网格ID用分号分隔，仅可输入数字和分号" :change="formatInLibraryTileInput()" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <p class="tipInfo-1" v-if="inLibraryData.inLibraryType === 1">提示：已选择
                    <b>{{inLibraryData.postTileIDS.length}}</b>个网格，该项目网格总计
                    <b>{{totalNumber}}</b>个,剩余
                    <b>{{totalNumber-inLibraryData.postTileIDS.length}}</b>个网格将自动设置为
                    <b>不回库</b>
                </p>
                <p class="tipInfo-1" v-if="inLibraryData.inLibraryType === 2">提示：已选择
                    <b>{{inLibraryData.postTileIDS.length}}</b>个网格，该项目网格总计
                    <b>{{totalNumber}}</b>个,剩余
                    <b>{{totalNumber-inLibraryData.postTileIDS.length}}</b>个网格未选择
                </p>
                <el-form-item>
                    <el-button type="primary" @click="submitInLibraryForm()">确定</el-button>
                    <el-button @click="dialogInLibraryVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 网格回库 end-->
    </div>
</template>

<script>
import drawMap from "@/components/daqian_drawMap.vue";
import selectProject from "@/components/daqian_selectProject.vue";
import { validateData, trim, alertInfo, inputCheck, showDataSet, resize, messageInfo, getSubString } from "@/utils/daqian_tools";
import { setMapCity, drawCityBoundary, dataConstruct } from "@/utils/daqian_drawtools";
import Vue from "vue";
export default {
    components: {
        selectProject,
        drawMap
    },
    data() {
        return {
            nowLibraryType: '',
            collapseFlag: false,
            showMode: "List",
            formHeight: this.global.formHeight,
            search: {
                userId: sessionStorage.userid,
                selectProjectID: 0,
                selectSubprojectID: 0,
                subProjectType: "",
                subProjectProcessType: "",
                outLibraryType: "",
                outLibraryStatus: "",
                inLibraryStatus: "",
                sourceSubProjectName: "",
                sort_field_name: "tile_id desc",
                tileID: "",
                project_status: "0" // v_s: 定义默认项目状态
            },
            searchDatas: {},
            nowSearchSubprojectID: 0,
            isSelectSubproject: false,
            nowSearchSubprojectType: "",
            nowSearchSubprojectOutStatus: "",
            nowQueryTileData: {}, // 当前筛选条件
            selectProjectCityList: [],// 所选项目包含的城市列表
            totalCityList: [],
            filterCityList: [],
            filter: {
                perPage: 10,
                currentPage: 1
            },
            totalNumber: 0, // 数据总数，随地图模式和列表模式变化而变化
            listModeTotalNumber: 0, // 列表模式下查询的数据总数
            priorPage: 1,
            tilesTable: [],
            multipleTileSelection: [],
            isExtend: 0,    
            outLibraryData: {
                suggestSelect: true,
                outLibraryType: 20,
                outLibrarySegment: "20",
                tileIDS: "",
                postTileIDS: []
            },
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
                outLibraryAllStatus: {
                    "1": "未出库",
                    "2": "出库排队",
                    "3": "出库中",
                    "4": "出库成功",
                    "5": "出库失败",
                    "6": "不出库"
                },
                inLibraryAllStatus: {
                    "1": "未回库",
                    "2": "回库排队",
                    "3": "回库中",
                    "4": "回库成功",
                    "5": "回库失败",
                    "6": "不回库"
                },
                outLibraryAllTypes: {
                    "20": "后预处理出库",
                    "34": "作业出库",
                    "38": "自动出库"
                },
                outLibraryProcessSegment: {
                    "20": "点云融合"
                    // "2001":"点云融合准出",
                    // "22":"点云融合人工调整与确认",
                    // "23":"P矩阵生成",
                    // "21":"点云识别+染色+车道线建模",
                    // "2101":"后预处理准出"
                },
                outLibraryOperationSegment: {
                    "30": "基础要素作业",
                    "32": "基础要素接边",
                    "34": "高阶要素作业",
                    "36": "高阶要素接边",
                    "38": "回库接边"
                },
                algorithmVersions: {
                    "1": "旧",
                    "2": "新"
                },
                projectStatus: {
                    "0": "全部",
                    "3": "进行中",
                    "4": "完结",
                    "5": "作废",
                    "6": "暂停"
                }
            },
            inLibraryData: {
                inLibraryType: 1,
                tileIDS: "",
                postTileIDS: [],
                text: "回库网格"
            },
            dialogOutLibraryVisible: false,
            dialogInLibraryVisible: false,
            accessDisabled: false,
            projectSelectOptions: {
                changeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false //是否重置子项目信息 fasle 不重置 true 重置
            },
            loading: true,
            emptyText: "查询中",
            outAccess: {
                processOutAccess: false,
                operationOutAccess: true
            },
            inAccess: {
                returnLibray: false,
                noReturnLibray: false
            },
            jbTileShow: false,
            tipInfoMessage: "",
            returnLibrayReadonly: false,
            allTableData: [],
            selectAllFlag: false,
            selectNumber: 0,
            userPermission: sessionStorage.user_permission,
            tileList: [],
            optionalList: [], // 可选网格List
            routerParams: "tileManage",
            haveLegend: true,
            tilesInScreen: {},
            lockStatusList: {
                "1": "未锁定",
                "2": "当前项目锁定",
                "3": "其他项目锁定"
            },
            outLibrarySegmentShow: false
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
        tableData: function () {
            for (var val of this.tilesTable) {
                val.show_sub_project_type = this.datasMap.subProjectAllTypes[val.sub_project_type];
                val.show_project_status = this.datasMap.projectStatus[val.project_status];
                val.show_sub_project_process_type = this.datasMap.subProjectProcessAllTypes[
                    val.sub_project_process_type
                ];
                val.show_out_library_type = this.datasMap.outLibraryAllTypes[val.out_library_type];
                if (val.out_library_type == 20) {
                    val.show_out_library_segment = this.datasMap.outLibraryProcessSegment[val.out_library_segment];
                } else if (val.out_library_type == 34 || val.out_library_type == 38) {
                    val.show_out_library_segment = this.datasMap.outLibraryOperationSegment[val.out_library_segment];
                }
                val.show_algorithm_version = this.datasMap.algorithmVersions[val.algorithm_version];
                val.show_out_library_status = this.datasMap.outLibraryAllStatus[val.out_library_status];
                val.show_in_library_status = this.datasMap.inLibraryAllStatus[val.in_library_status];
                val.show_out_library_user = showDataSet(val.out_library_user_id, val.out_library_user_name);
                val.show_in_library_user = showDataSet(val.in_library_user_id, val.in_library_user_name);
                val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                val.show_project_name = showDataSet(val.project_id, val.project_name);
                val.show_source_sub_project_name = showDataSet(val.source_sub_project_id, val.source_sub_project_name);
                val.show_results_sub_library_name = showDataSet(
                    val.source_results_sub_library_id,
                    val.source_results_sub_library_name
                );
                val.show_source_master_library_name = showDataSet(
                    val.source_master_library_id,
                    val.source_master_library_name
                );
                val.show_build_network_sub_project = showDataSet(
                    val.build_network_sub_project_id,
                    val.build_network_sub_project_name
                );
                val.show_build_network_master_library = showDataSet(
                    val.build_network_master_library_id,
                    val.build_network_master_library_name
                );
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
    },
    watch: {
        filterCityList: function (val, oldval) {
            this.drawSubProjectCityBoundary();
        }
    },
    created() {
        this.accessDisabled = eval(sessionStorage.roteAuthotity);
        if (sessionStorage.tileID) {
            this.search.tileID = sessionStorage.tileID;
        }
    },
    mounted() {
        this.$nextTick(function () {
            resize();
        });
    },
    methods: {
        drawSubProjectCityBoundary: function() {
            let boundaryStyleAllHaveData = {
                strokeWeight: 1.5,
                strokeColor: '#409EFF',
                // strokeColor: '#DC143C',
                fillOpacity: 0.1,
                fillColor: '#409EFF'
                // strokeStyle: 'dashed',
            };
            let boundaryStyleCurrentHaveData = {
                strokeWeight: 1.5,
                strokeColor: '#000',
                // strokeColor: '#DC143C',
                fillOpacity: 0.1,
                fillColor: '#409EFF'
                // strokeStyle: 'dashed',
            };
            if (this.$refs.drawMap) {
                // 先清除所有已绘制覆盖物，绘制该子项目下所有有数据城市轮廓
                drawCityBoundary(this.$refs.drawMap.chartsInstance, this.totalCityList, true, false, boundaryStyleAllHaveData);
                // 再绘制该子项目下当前筛选条件下涉及的有数据城市轮廓
                drawCityBoundary(this.$refs.drawMap.chartsInstance, this.filterCityList, false, false, boundaryStyleCurrentHaveData);
            }
        },
        getTilesInScreen: function (val) {
            this.tilesInScreen = val;
            if (this.showMode === 'Map') {
                this.getVisibleTileInfo(this.tilesInScreen);
            }
        },
        getVisibleTileInfo: function (obj) {
            this.totalCityList = [];
            this.filterCityList = [];
            this.totalNumber = 0;
            let { tilesInScreen, flag } = obj;
            let queryData = {
                sub_project_id: this.nowQueryTileData.sub_project_id,
                tile_id: this.nowQueryTileData.tile_id_list,
                sub_project_type: this.nowQueryTileData.sub_project_type,
                project_status: this.nowQueryTileData.project_status,
                sub_project_process_type: this.nowQueryTileData.sub_project_process_type,
                source_sub_project_name: this.nowQueryTileData.source_sub_project_name,
                out_library_type: this.nowQueryTileData.out_library_type,
                out_library_status: this.nowQueryTileData.out_library_status,
                in_library_status: this.nowQueryTileData.in_library_status,
                city_name: this.nowQueryTileData.city_name,
                return_all: 1
            };
            let tilesArr = [];
            for (let tile of tilesInScreen) {
                tilesArr.push(tile.tileID);
            }
            queryData["tile_list"] = tilesArr.join(",");
            this.$http.post("/api/query_visible_sub_project_tile_info", queryData).then(response => {
                response = response.body;
                let data = response.data;
                if (data.errno === 0) {
                    let tileList = data.data.tile_list;
                    this.totalNumber = Number(data.data.total_filter_number);
                    this.totalCityList = data.data.total_city_list;
                    this.filterCityList = data.data.filter_city_list;
                    let arr = [];
                    // 构造数据添加网格属性信息
                    if (flag === 'detail') {
                        for (let tile of tileList) {
                            // 获取当前可选择的网格
                            if (tile.is_current === 1) {
                                arr.push(tile.tile_id);
                            }
                            for (let item of tilesInScreen) {
                                if (Number(item.tileID) === Number(tile.tile_id)) {
                                    item["city"] = tile.city;
                                    item["relation_master_library_name"] = tile.relation_master_library_name;
                                    item["relation_results_library_name"] = tile.relation_results_library_name;
                                    item["relation_master_library_id"] = tile.relation_master_library_id;
                                    item["relation_results_library_id"] = tile.relation_results_library_id;
                                    item["isCurrent"] = tile.is_current;
                                    item["status"] = tile.out_library_lock;
                                    if (tile.out_library_lock == 2 && Number(this.nowSearchSubprojectID) !== Number(tile.relation_lock_sub_project_id)) {
                                        // 非当前项目锁定
                                        item["status"] = 3;
                                    }
                                    item['statusName'] = this.lockStatusList[item["status"]];
                                    item['relation_lock_sub_project_id'] = tile.relation_lock_sub_project_id;
                                    item['relation_lock_sub_project_name'] = tile.relation_lock_sub_project_name;
                                    item['out_library_type'] = this.datasMap.outLibraryAllTypes[tile.out_library_type];
                                    if (tile.out_library_type == 20) {
                                        item['out_library_status'] = this.datasMap.outLibraryProcessSegment[tile.out_library_segment];
                                    } else if (tile.out_library_type == 34 || tile.out_library_type == 38) {
                                        item['out_library_status'] = this.datasMap.outLibraryOperationSegment[tile.out_library_segment];
                                    }
                                    break;
                                }
                            }
                        }
                        // 设置为当前可选择网格
                        this.optionalList = arr;
                        if (this.$refs.drawMap) {
                            this.$refs.drawMap.drawBaseTileMethod(tilesInScreen, this.tileManagerformatter);
                        }
                    } else if (flag === 'simple') {
                        for (let tile of tileList) {
                            if (tile.is_current === 1) {
                                arr.push(tile.tile_id);
                            }
                            for (let item of tilesInScreen) {
                                if (Number(item.tileID) === Number(tile.tile_id)) {
                                    item["isCurrent"] = tile.is_current;
                                    item["status"] = tile.out_library_lock;
                                    if (tile.out_library_lock == 2 && Number(this.nowSearchSubprojectID) !== Number(tile.relation_lock_sub_project_id)) {
                                        // 非当前项目锁定
                                        item["status"] = 3;
                                    }
                                    break;
                                }
                            }
                        }
                        this.optionalList = arr;
                        if (this.$refs.drawMap) {
                            this.$refs.drawMap.drawBaseTileMethod(tilesInScreen);
                        }
                    }
                } else {
                    if (this.$refs.drawMap) {
                        this.$refs.drawMap.drawBaseTileMethod(tilesInScreen);
                    }
                }
            });
        },
        tileManagerformatter: function (params) {
            let zoomLevel;
            if (this.$refs.drawMap) {
                zoomLevel = this.$refs.drawMap.chartsInstance.getModel().getComponent("bmap").getBMap().getZoom();
            }
            let res = `${params.data.name}\n`;
            if (validateData(params.data.city)) {
                res += `城市：${params.data.city}\n`;
            }
            if (validateData(params.data.statusName)) {
                res += `锁定状态：${params.data.statusName}\n`;
            }
            if (validateData(params.data.out_library_type)) {
                let tempStr = `出库类型：${params.data.out_library_type}`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            if (validateData(params.data.out_library_status)) {
                let tempStr = `出库环节：${params.data.out_library_status}`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            if (validateData(params.data.relation_master_library_id)) {
                let tempStr = `关联母库：${params.data.relation_master_library_name}(id:${params.data.relation_master_library_id})`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            } else if (validateData(params.data.relation_results_library_id)) {
                let tempStr = `关联成果库：${params.data.relation_results_library_name}(id:${params.data.relation_results_library_id})`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            } else if (params.data.isCurrent === 1){
                res += `关联母库/成果库：无\n`
            }
            if (validateData(params.data.relation_lock_sub_project_id)) {
                let tempStr = `项目占用：${params.data.relation_lock_sub_project_name}(id:${params.data.relation_lock_sub_project_id})`;
                let str = this.getSubStringWithZoom(zoomLevel, tempStr);
                res += str;
            }
            return res;
        },
        getSubStringWithZoom: function(zoomLevel, tempStr) {
            let res = '';
            if (Number(zoomLevel) === 12) {
                let subStr = getSubString(tempStr, 24).split(",");
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
        handleClick: function(val) {
            if (val.name === 'List') {
                this.totalNumber = this.listModeTotalNumber;
            } else if(val.name === 'Map' && this.tilesTable.length != this.totalNumber) { 
                //当切换至地图模式时，需查询列表模式下全量数据，以保证可进行联动选择
                this.searchTiles({
                    return_all: 1,
                    isSelect: 3
                });
            }
        },
        formatSearchInput: function () {
            this.search.tileID = inputCheck(this, this.search.tileID, 1);
            sessionStorage.tileID = this.search.tileID;
        },
        drawMapInfo: function (data) {
            let that = data;
            let initCity = '北京市';
            // 设置地图默认定位至城市为子项目下第一个网格所在城市
            if (this.tilesTable.length) {
                initCity = this.tilesTable[0].city_name;
            }
            // 全选时不重新定位城市
            if (!this.selectAllFlag) {
                setMapCity(that, initCity);
            }
        },
        drawMapCall: function (data) {
            if (this.showMode === 'Map') {
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
                this.selectAllFlag = false;
                if (validateData(this.selectNumber)) {
                    this.selectAllFlag = this.selectNumber == this.totalNumber;
                }
            }
        },
        searchTiles: function (arg) {
            this.emptyText = "查询中";
            this.nowSearchSubprojectID = this.search.selectSubprojectID;
            this.isSelectSubproject = validateData(this.nowSearchSubprojectID);
            if (!(arg && arg.return_all && arg.isSelect)) {
                this.nowSearchSubprojectType = "";
                this.nowSearchSubprojectOutStatus = "";
                this.nowMasterLibraryId = "";
            }
            var query_tileData = {
                user_id: sessionStorage.userid,
                project_id: this.search.selectProjectID,
                sub_project_id: this.search.selectSubprojectID,
                sort_field_name: this.search.sort_field_name,
                tile_id_list: this.search.tileID,
                sub_project_type: this.search.subProjectType,
                project_status: this.search.project_status,
                sub_project_process_type: this.search.subProjectProcessType,
                out_library_type: this.search.outLibraryType,
                out_library_status: this.search.outLibraryStatus,
                in_library_status: this.search.inLibraryStatus,
                source_sub_project_name: this.search.sourceSubProjectName,
                city_name: this.search.city_name,
                page_index: this.filter.currentPage,
                page_size: this.filter.perPage,
                return_all: arg && arg.return_all ? arg.return_all : 2
            };
            // this.nowQueryTileData = query_tileData;
            if (!(arg && arg.loading)) {
                if (!(arg && arg.return_all)) {
                    this.tilesTable = [];
                    this.totalNumber = 0;
                    this.searchDatas = query_tileData;
                }
                this.filter.currentPage = 1;
                this.multipleTileSelection = [];
                this.loading = true;
            }
            this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
            this.searchDatas.page_index = this.filter.currentPage;
            this.searchDatas.page_size = this.filter.perPage;
            this.nowQueryTileData = this.searchDatas;
            // gu:修复点击出库的时候网格数目显示不正确的BUG
            if(this.isSelectSubproject){
                 this.searchDatas.return_all = 1;
            }
            this.$http.post("/api/query_sub_project_tile_info", this.searchDatas).then(
                response => {
                    this.loading = false;
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0 || data.errno === 7) {
                        if (data.errno === 7) {
                            this.emptyText = "未查询到符合条件的数据";
                        } else {
                            if (!(arg && arg.isSelect &&  arg.isSelect === 3)) {
                                this.totalNumber = Number(data.data.total_number);
                                this.listModeTotalNumber = this.totalNumber;
                            }
                            var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                            this.tilesTable = Object.assign([], this.tilesTable, data.data.tile_info_list);
                            if (arg && arg.return_all) {
                                if (arg && arg.return_all && arg.isSelect) {
                                    if (arg.isSelect === 1) {
                                        //推荐出库
                                        this.outLibrarySuggestAct(arg.tileList);
                                    } else if (arg.isSelect === 2) {
                                        //检查回库状态为0
                                        this.refreshSelectTiles(this.inLibraryData.tileIDS);
                                    } else if (arg.isSelect === 3) {
                                        // 更新选择网格的存储及勾选状态
                                        this.refreshSelectTiles(this.tileList.join(';'));
                                    } else if (arg.isSelect === 4) {
                                        //检查回库状态为11
                                        this.inLibraryData.inLibraryType = 2;
                                        this.inAccess.returnLibray = true;
                                        this.returnLibrayReadonly = true;
                                        this.dialogInLibraryVisible = true;
                                        let tileList = [];
                                        this.tilesTable.forEach((val)=>{
                                            tileList.push(val.tile_id);
                                        })
                                        this.inLibraryData.postTileIDS = tileList;
                                        this.inLibraryData.tileIDS = tileList.join(";");
                                        this.inLibraryData.text = "不回库网格";
                                        this.refreshSelectTiles(this.inLibraryData.tileIDS);
                                    }
                                    return;
                                }
                                for (var i = 0; i < pagesNumber; i++) {
                                    this.multipleTileSelection[i] = data.data.tile_info_list.slice(
                                        i * this.filter.perPage,
                                        (i + 1) * this.filter.perPage
                                    );
                                }
                                this.$refs.tilesTables.clearSelection();
                                this.tableData.forEach(row => {
                                    this.$refs.tilesTables.toggleRowSelection(row);
                                });
                                this.getSelectDatas();
                            } else {
                                this.tilesTable = data.data.tile_info_list;
                            }
                            if (this.totalNumber == 0) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.emptyText = "加载中";
                                if (validateData(this.nowSearchSubprojectID)) {
                                    this.nowSearchSubprojectType = data.data.sub_project_process_type;
                                    this.nowLibraryType = data.data.library_type;
                                    this.nowMasterLibraryId = this.tilesTable[0].source_master_library_id;
                                    this.nowSearchSubprojectOutStatus = this.tilesTable[0].out_library_status;
                                    this.nowProjectStatus = this.tilesTable[0].project_status;
                                    // 计算能够出库的网格 根据关联新增外业任务数大于0
                                    let num = 0;
                                    this.tilesTable.forEach((item)=>{
                                        if(item.update_wy_number && item.update_wy_number > 0){
                                            num++;
                                        }
                                    });
                                    this.canOutLibrary = num;
                                    if (this.$refs.drawMap) {
                                        this.$refs.drawMap.reset();
                                    }
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
        },
        onSearch: function (event) {
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.tileList = [];
            if (this.showMode === 'Map') {
                this.showMode = 'List';
            }
            this.searchTiles(event);
        },
        onRefresh: function (event) {
            // gu：当所属项目为主项目或全部时，项目状态为进行中；当为子项目时项目状态为全部
            if(validateData(this.search.selectSubprojectID)){
                this.search.project_status = "0";
            } else {
                this.search.project_status = "3";
            }
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.search.subProjectType = "";
            this.search.subProjectProcessType = "";
            this.search.outLibraryStatus = "";
            this.search.inLibraryStatus = "";
            this.search.outLibraryType = "";
            this.search.sourceSubProjectName = "";
            this.search.city_name = "";
            if (this.$refs.tilesTables) {
                this.$refs.tilesTables.clearSort();
            }
            this.search.sort_field_name = "tile_id desc";
            this.search.tileID = "";
            this.projectSelectOptions.resetselectProjectData = true;
            this.tileList = [];
            if (this.showMode === 'Map') {
                this.showMode = 'List';
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
            // 当查出全量数据的时候翻页不再发请求
            if(this.tilesTable.length == this.totalNumber){
                return
            };
            this.searchTiles({
                loading: true
            });
        },
        selectAll: function () {
            if (this.selectAllFlag) {
                this.searchTiles({
                    return_all: 1
                });
            } else {
                this.multipleTileSelection = [];
                this.$refs.tilesTables.clearSelection();
                this.getSelectDatas();
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
        //出库推荐
        outLibrarySuggest: function () {
            if (validateData(this.nowSearchSubprojectID)) {
                if (this.nowProjectStatus == "4") {
                    alertInfo(this, "warning", "完结项目不支持出库推荐");
                    return;
                }
                if (this.nowProjectStatus == "5") {
                    alertInfo(this, "warning", "作废项目不支持出库推荐");
                    return;
                }
                if (this.nowSearchSubprojectType === "3") {
                    alertInfo(this, "warning", "修复项目无推荐出库功能");
                } else if (this.nowSearchSubprojectType === "1") {
                    alertInfo(this, "warning", "常规项目无推荐出库功能");
                } else if (this.nowSearchSubprojectType == "2" || this.nowSearchSubprojectType === null) {
                    //目前只有更新项目才有推荐出库
                    let postOutLibraryData = {
                        sub_project_id: this.search.selectSubprojectID,
                        master_library_id: this.nowMasterLibraryId,
                        query_support: 1
                    };
                    this.$http.post("/api/query_tile_out_library_status", postOutLibraryData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            this.searchTiles({
                                return_all: 1,
                                isSelect: 1,
                                tileList: data.data.support_out_library_tile_list
                            });
                        } else {
                            alertInfo(this, "error", "推荐出库失败，" + data.msg);
                        }
                    });
                }
                if (this.nowSearchSubprojectType === "5") {
                    alertInfo(
                        this,
                        "warning",
                        "构网项目无需推荐出库，平台可自动出库；若自动出库失败，点击出库按钮重新触发即可"
                    );
                } else if (this.nowSearchSubprojectType === "") {
                    alertInfo(this, "warning", "该子项目暂不可出库");
                }
            } else {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
            }
        },
        outLibrarySuggestAct: function (arg = []) {
            let tileNumber = 0;
            var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
            //清空原先选择
            this.toggleCurrentPageSelectState();
            for (var i = 0; i < pagesNumber; i++) {
                this.multipleTileSelection[i] = [];
            }
            // 出库推荐选中
            for (var index in this.tilesTable) {
                var page = Math.floor(index / this.filter.perPage);
                for (let val of arg) {
                    if (this.tilesTable[index].tile_id == val) {
                        this.multipleTileSelection[page].push(this.tilesTable[index]);
                        tileNumber += 1;
                    }
                }
            }
            this.toggleCurrentPageSelectState();
            this.getSelectDatas();
            if (tileNumber === 0) {
                alertInfo(this, "warning", "该项目无可推荐出库的网格");
            } else {
                alertInfo(this, "success", "已推荐，请点击出库按钮进行下一步操作");
            }
        },
        toggleCurrentPageSelectState: function () {
            this.$refs.tilesTables.clearSelection();
            if (this.multipleTileSelection[this.filter.currentPage - 1]) {
                var tmpSelectData = this.multipleTileSelection[this.filter.currentPage - 1].concat();
                if (tmpSelectData) {
                    for (var sel of tmpSelectData) {
                        var index = this.tableData.indexOf(sel);
                        if (index > -1) {
                            this.$refs.tilesTables.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
            }
            this.getSelectDatas();
        },
        extendEvents: function (val) {
            if(this.isExtend === 1){
                let postOutLibraryData = {
                    sub_project_id: this.search.selectSubprojectID,
                    master_library_id: this.nowMasterLibraryId,
                    tile_list: this.outLibraryData.tileIDS.split(';'),
                    query_support: 0,
                    isExtend: 3 // v_s: 只验证外扩网格
                };
                this.$http.post("/api/query_tile_out_library_status", postOutLibraryData).then(res => {
                    res = res.body;
                    var data = res.data;
                    if (data.errno === 0) {
                        this.showJbTileList = data.data.jb_tile_list.join(";");
                        this.showJbTileListNumber = data.data.jb_tile_list.length;
                        this.jbTileShow = true;
                    } else {
                        this.isExtend = 0;
                        return alertInfo(this, "error", data.msg);
                    }
                })
            } else {
                this.jbTileShow = false;
            }
        },
        // 出库
        outLibrary: function () {
            if (validateData(this.nowSearchSubprojectID)) {
                if (this.nowProjectStatus == "4") {
                    alertInfo(this, "warning", "完结项目不支持出库");
                    return;
                }
                if (this.nowProjectStatus == "5") {
                    alertInfo(this, "warning", "作废项目不支持出库");
                    return;
                }
                this.outLibraryData.subProjecType = this.datasMap.subProjectProcessAllTypes[
                    this.nowSearchSubprojectType
                ];
                if (this.nowSearchSubprojectType === "1") {
                    // 常规项目出库
                    if (this.selectNumber === 0) {
                        alertInfo(this, "warning", "请先选择需要出库的网格");
                        return;
                    }
                    let selectData = this.getSelectDatas();
                    this.dialogOutLibraryVisible = true;
                    //控制外扩网格显示
                    this.jbTileShow = false;
                    this.outLibrarySegmentShow = false;
                    this.outLibraryData.postTileIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTileIDS)));
                    this.outLibraryData.tileIDS = selectData.tileIDS;
                    this.tipInfoMessage = `提示：共<b>${this.canOutLibrary}</b>个网格支持后预处理出库， 已选择<b>${
                        this.outLibraryData.postTileIDS.length
                        }</b>个网格，其他网格支持再次出库`;
                } else if (this.nowSearchSubprojectType === "2" || this.nowSearchSubprojectType === "3") {
                    //更新和修复项目出库前校验
                    if (this.selectNumber === 0) {
                        alertInfo(this, "warning", "请先选择需要出库的网格");
                        return;
                    }
                    let selectData = this.getSelectDatas();
                    let postOutLibraryData = {
                        sub_project_id: this.search.selectSubprojectID,
                        master_library_id: this.nowMasterLibraryId,
                        tile_list: selectData.postTileIDS,
                        query_support: 0,
                        isExtend: 2
                    };
                    this.$http.post("/api/query_tile_out_library_status", postOutLibraryData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            if (this.nowMasterLibraryId) { //判断是否是母库项目
                                this.showJbTileList = data.data.jb_tile_list.join(";");
                                this.showJbTileListNumber = data.data.jb_tile_list.length;
                            }
                            if (this.nowSearchSubprojectType === "2") {
                                // 更新项目
                                // 设置出库类型可否选择
                                this.outAccess.processOutAccess = false;
                                this.outAccess.operationOutAccess = true;
                                // 设置出库类型
                                this.outLibraryData.outLibraryType = 20;
                                // 设置默认出库阶段
                                this.outLibraryData.outLibrarySegment = "20";
                                this.dialogOutLibraryVisible = true;
                                this.outLibrarySegmentShow = false;
                                this.outLibraryData.postTileIDS = [].concat(
                                    JSON.parse(JSON.stringify(selectData.postTileIDS))
                                );
                                this.outLibraryData.tileIDS = selectData.tileIDS;
                                this.refreshSelectTiles(this.outLibraryData.tileIDS);
                                if (this.nowLibraryType == 2) {
                                    //成果更新项目
                                    // this.tipInfoMessage = `提示：共 <b>${
                                    //     this.totalNumber
                                    //     }</b> 个网格支持后预处理出库，已选择 <b>${
                                    //     this.outLibraryData.postTileIDS.length
                                    //     }</b> 个网格，其他网格不支持再次出库`;
                                    this.outLibraryData.subProjecType = "更新项目";
                                    this.tipInfoMessage = `提示：该项目网格总计<b>${this.totalNumber}</b>个， 已选择<b>${
                                        this.outLibraryData.postTileIDS.length
                                        }</b>个网格，其他未选择网格将自动 <b>作业出库</b>`;
                                    this.jbTileShow = false;
                                } else if (this.nowLibraryType == 1) {
                                    //母库更新项目
                                    this.outLibraryData.subProjecType = "更新项目";
                                    this.tipInfoMessage = `提示：共 <b>${
                                        this.canOutLibrary
                                        }</b> 个网格支持出库，已选择 <b>${
                                        this.outLibraryData.postTileIDS.length
                                        }</b> 个网格出库，其他网格不支持再次出库`;
                                    this.jbTileShow = true;
                                    this.jbTipInfoMessage = `提示：共 <b>${
                                        this.showJbTileListNumber
                                        }</b> 个网格自动出库到 <b>回库接边</b> 环节`;
                                }
                            } else if (this.nowSearchSubprojectType === "3") {
                                this.isExtend = 0;
                                // 修复项目
                                // 设置出库类型可否选择
                                this.outAccess.processOutAccess = true;
                                this.outAccess.operationOutAccess = false;
                                // 设置出库类型
                                this.outLibraryData.outLibraryType = 34;
                                // 设置默认出库阶段
                                this.outLibraryData.outLibrarySegment = "30";
                                this.dialogOutLibraryVisible = true;
                                this.outLibraryData.postTileIDS = [].concat(
                                    JSON.parse(JSON.stringify(selectData.postTileIDS))
                                );
                                this.outLibrarySegmentShow = true;
                                this.outLibraryData.tileIDS = selectData.tileIDS;
                                this.refreshSelectTiles(this.outLibraryData.tileIDS);
                                if (this.nowLibraryType == 2) {
                                    //成果修复项目
                                    this.outLibraryData.subProjecType = "修复项目";
                                    this.tipInfoMessage = `提示：共 <b>${
                                        this.totalNumber
                                        }</b> 个网格支持作业出库，已选择 <b>${
                                        this.outLibraryData.postTileIDS.length
                                        }</b> 个网格，其他网格不支持再次出库`;
                                    this.jbTileShow = false;
                                } else if (this.nowLibraryType == 1)  {
                                    //母库修复项目
                                    this.outLibraryData.subProjecType = "修复项目";
                                    this.tipInfoMessage = `提示：共 <b>${
                                        this.totalNumber
                                        }</b> 个网格支持出库，已选择 <b>${
                                        this.outLibraryData.postTileIDS.length
                                        }</b> 个网格出库，其他网格不支持再次出库`;
                                    this.jbTileShow = false;
                                    this.jbTipInfoMessage = `提示：共 <b>${
                                        this.showJbTileListNumber
                                        }</b> 个网格自动出库到  <b>回库接边</b> 环节`;
                                }
                            }
                        } else {
                            alertInfo(this, "error", "出库失败，" + data.msg);
                        }
                    });
                } else if (this.nowSearchSubprojectType === "5") {
                    if (this.nowSearchSubprojectOutStatus === "5") {
                        alertInfo(this, "success", "已触发自动出库");
                        this.postOutLibraryInfo();
                    } else {
                        alertInfo(this, "warning", "构网项目只有自动出库失败才可再次触发出库");
                    }
                } else if (this.nowSearchSubprojectType === "") {
                    alertInfo(this, "warning", "该子项目暂不可出库");
                }
            } else {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
            }
        },
        formatOutLibraryTileInput: function () {
            this.outLibraryData.tileIDS = inputCheck(this, this.outLibraryData.tileIDS, 2);
        },
        formatInLibraryTileInput: function () {
            // this.inLibraryData.tileIDS = inputCheck(this, this.inLibraryData.tileIDS, 2);
        },
        // 回库
        inLibrary: function () {
            //单选框默认值
            this.inAccess.returnLibray = false;
            if (validateData(this.nowSearchSubprojectID)) {
                if (this.nowProjectStatus == "4") {
                    alertInfo(this, "warning", "完结项目不支持回库");
                    return;
                }
                if (this.nowProjectStatus == "5") {
                    alertInfo(this, "warning", "作废项目不支持回库");
                    return;
                }
                if (this.nowSearchSubprojectType == "5") {
                    this.dialogInLibraryVisible = true;
                    let selectData = this.getSelectDatas();
                    this.inLibraryData.postTileIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTileIDS)));
                    this.inLibraryData.tileIDS = selectData.tileIDS;
                    this.refreshSelectTiles(this.inLibraryData.tileIDS);
                    this.inLibraryData.text = "回库网格";
                } else if (this.nowSearchSubprojectType == "2" || this.nowSearchSubprojectType == "3") {
                    let postOutLibraryData = {
                        sub_project_id: this.search.selectSubprojectID
                    };
                    // 更新和修复项目回库校验
                    this.$http.post("/api/in_library_check", postOutLibraryData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 11) {
                            //状态1
                            this.$confirm(
                                "网格回库接边二检通过或未生成任务包才支持回库，支持将该项目设置为永久不回库，是否继续？",
                                "提示",
                                {
                                    cancelButtonText: "取消",
                                    confirmButtonText: "确定",
                                    type: "warning"
                                }
                            )
                                .then(() => {
                                     this.searchTiles({
                                        return_all: 1,
                                        isSelect: 4
                                    });
                                })
                                .catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消回库",
                                        duration: 1500
                                    });
                                });
                        } else if (data.errno === 0) {
                            //状态3、4
                            this.inLibraryData.inLibraryType = 1;
                            this.inAccess.returnLibray = false;
                            this.returnLibrayReadonly = true;
                            this.dialogInLibraryVisible = true;
                            this.inLibraryData.tileIDS = data.data.tile_list.join(";");
                            this.inLibraryData.text = "回库网格";
                            this.refreshSelectTiles(this.inLibraryData.tileIDS);
                            this.searchTiles({
                                return_all: 1,
                                isSelect: 2
                            });
                        } else if (data.errno === 12) {
                            //状态2
                            alertInfo(this, "error", "待回库、回库中或回库成功不支持回库");
                        } else {
                            alertInfo(this, "error", data.msg);
                        }
                    });
                } else {
                    alertInfo(this, "warning", "该子项目不可回库");
                }
            } else {
                alertInfo(this, "warning", "请先选择一个子项目并进行筛选");
            }
        },
        //对输入网格在列表内进行相应勾选
        refreshSelectTiles: function (str) {
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
                    // console.log(this.multipleTileSelection[i]);
                    // console.log('length'+this.multipleTileSelection[i].length);
                    for (var j = 0; j < this.multipleTileSelection[i].length; j++) {
                        //console.log('j'+j);
                        //console.log(this.multipleTileSelection[i][j].tile_id);
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
                    // console.log('第'+tableindex+'个');
                    var inpage = Math.floor(tableindex / this.filter.perPage); //判断网格在第几页
                    // console.log('当前第'+inpage+'页');
                    // console.log(this.multipleTileSelection[inpage]);
                    if (this.multipleTileSelection[inpage]) {
                        //网格所在页是否已有选中的网格
                        if (this.multipleTileSelection[inpage].length) {
                            var thisPageSelectIDs = [];
                            for (var seltile of this.multipleTileSelection[inpage]) {
                                thisPageSelectIDs.push(seltile.tile_id);
                            }
                            var index = thisPageSelectIDs.indexOf(sel);
                            //console.log('在选中数组中的位置'+index);
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
                                    var currentpageindex = this.tableData.indexOf(this.tilesTable[tableindex]);
                                    if (currentpageindex > -1) {
                                        this.$refs.tilesTables.toggleRowSelection(this.tableData[currentpageindex]);
                                    }
                                }
                            }
                        } else {
                            this.multipleTileSelection[inpage] = this.tilesTable.slice(tableindex, tableindex + 1);
                            if (this.filter.currentPage === inpage + 1) {
                                var currentpageindex = this.tableData.indexOf(this.tilesTable[tableindex]);
                                if (currentpageindex > -1) {
                                    this.$refs.tilesTables.toggleRowSelection(this.tableData[currentpageindex]);
                                }
                            }
                        }
                    } else {
                        //网格所在页没有已选中网格
                        this.multipleTileSelection[inpage] = this.tilesTable.slice(tableindex, tableindex + 1);
                        if (this.filter.currentPage === inpage + 1) {
                            var currentpageindex = this.tableData.indexOf(this.tilesTable[tableindex]);
                            if (currentpageindex > -1) {
                                //console.log('切换第'+currentpageindex+'行选择状态');
                                this.$refs.tilesTables.toggleRowSelection(this.tableData[currentpageindex]);
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
            //console.log(this.multipleTileSelection);
            var notexistString = "";
            if (notExistArray.length) {
                //console.log(notExistArray.length);
                notexistString = notExistArray.join("；");
                alertInfo(this, "warning", "不存在的网格ID：" + notexistString);
            }
            var selectData = this.getSelectDatas();
            this.outLibraryData.postTileIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTileIDS)));
            this.outLibraryData.tileIDS = selectData.tileIDS;
            this.inLibraryData.postTileIDS = [].concat(JSON.parse(JSON.stringify(selectData.postTileIDS)));
            this.inLibraryData.tileIDS = selectData.tileIDS;
            if (this.nowSearchSubprojectType === "2") {
                if (this.outLibraryData.outLibraryType === 20 && selectData.tileString) {
                    // alertInfo(this, "warning", "以下网格不能进行后预处理出库：" + selectData.tileString);
                }
            }
        },
        getSelectDatas: function () {
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
        submitOutLibraryForm: function (val) {
            this.$refs["outLibraryData"].validate(valid => {
                if (valid) {
                    var selectData = this.getSelectDatas();
                    if (this.nowSearchSubprojectType === "1") {
                        // 常规项目出库
                        var postoperationData = {
                            tile_level: selectData.tileList[0].tile_level,
                            tile_list: selectData.tileList
                        };
                        this.$http.post("/api/hm_trigger_hycl", postoperationData).then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                alertInfo(this, "success", "出库成功", () => {
                                    this.dialogOutLibraryVisible = false;
                                    this.onSearch();
                                });
                            } else {
                                alertInfo(this, "error", "出库失败，" + data.msg);
                            }
                        });
                    } else {
                        // if (this.outLibraryData.outLibraryType === 20 && selectData.tileString) {
                        //     alertInfo(
                        //         this,
                        //         "warning",
                        //         "以下网格不能进行后预处理出库，请更改后重试：" + selectData.tileString
                        //     );
                        // } else {
                        this.postOutLibraryInfo();
                        // }
                    }
                }
            });
        },
        postOutLibraryInfo: function () {
            var postOutLibraryData = {
                user_id: sessionStorage.userid,
                out_library_type: this.outLibraryData.outLibraryType,
                out_library_segment: this.outLibraryData.outLibrarySegment,
                sub_project_id: this.nowSearchSubprojectID,
                tile_list: this.outLibraryData.postTileIDS,
                isExtend: this.isExtend
            };
            this.$http.post("/api/trigger_tile_out_library", postOutLibraryData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(this, "success", "网格出库触发成功", () => {
                        this.dialogOutLibraryVisible = false;
                        this.onSearch();
                    });
                } else {
                    alertInfo(this, "error", "网格出库触发失败，" + data.msg);
                }
            });
        },
        submitInLibraryForm: function () {
            this.$refs["inLibraryData"].validate(valid => {
                if (valid) {
                    if (this.inLibraryData.inLibraryType == "1") {
                        if (this.inLibraryData.postTileIDS.length !== this.totalNumber) {
                            this.$confirm("未选择该项目全部网格，未选择部分默认不回库，是否继续？", "提示", {
                                cancelButtonText: "取消",
                                confirmButtonText: "确定",
                                type: "warning"
                            })
                                .then(() => {
                                    this.postInLibraryInfo();
                                })
                                .catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消回库",
                                        duration: 1500
                                    });
                                });
                        } else {
                            this.$confirm("是否确认回库？", "提示", {
                                cancelButtonText: "取消",
                                confirmButtonText: "确定",
                                type: "warning"
                            })
                                .then(() => {
                                    this.postInLibraryInfo();
                                })
                                .catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消回库",
                                        duration: 1500
                                    });
                                });
                        }
                    } else if (this.inLibraryData.inLibraryType == "2") {
                        this.$confirm("该项目将设置为永久不回库，是否继续?", "提示", {
                            cancelButtonText: "取消",
                            confirmButtonText: "确定",
                            type: "warning"
                        })
                            .then(() => {
                                this.postInLibraryInfo();
                            })
                            .catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "已取消回库",
                                    duration: 1500
                                });
                            });
                    }
                }
            });
        },
        postInLibraryInfo: function () {
            var postInLibraryData = {
                user_id: sessionStorage.userid,
                in_library_type: this.inLibraryData.inLibraryType,
                sub_project_id: this.nowSearchSubprojectID,
                tile_list: this.inLibraryData.postTileIDS
            };
            this.$http.post("/api/trigger_tile_in_library", postInLibraryData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(this, "success", "网格回库触发成功", () => {
                        this.dialogInLibraryVisible = false;
                        this.onSearch();
                    });
                } else {
                    alertInfo(this, "error", "网格回库触发失败，" + data.msg);
                }
            });
        },
        SelectProjects: function (data) {
            this.search.selectProjectID = data.project_id;
            this.search.selectSubprojectID = data.sub_project_id;
            // gu：当所属项目为主项目或全部时，项目状态为进行中；当为子项目时项目状态为全部
            if(validateData(this.search.selectSubprojectID)){
                this.search.project_status = "0";
            } else {
                this.search.project_status = "3";
            }
            if (data.init) {
                this.onSearch();
            }
            // this.getProjectCityList(this.search.selectProjectID, this.search.selectSubprojectID);
        },
        updateProjectStatus: function (data) {
            this.projectSelectOptions.resetselectProjectData = false;
        },
        getProjectCityList: function (selectProjectID, selectSubprojectID) {
            this.selectProjectCityList = [];
            this.$http
                .post("/api/query_project_info", {
                    user_id: sessionStorage.userid,
                    project_id: selectProjectID,
                    sub_project_id: selectSubprojectID,
                    query_type: 2, //查询项目的城市信息
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
<style lang="scss">
.tileManage {
    .el-cascader {
        .el-cascader-label {
            line-height: 28px;
        }
        .el-input--medium .el-input__inner  {
                height: 28px;
        }
    }
}
</style>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;

.tileManage {
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
    // .table-div { // v_s: 类名重复定义 此类名不起作用
    //     width: 95%;
    //     margin: 0px auto 0px auto;
    // }
    .searchDiv {
        width: $width;
    }
    .selectArea {
        width: $width;
        overflow: hidden;
        .widthBox {
            width: 150px;
            height: 28px;
        }
    }
    .selectDiv {
        float: left;
        margin: 0 10px 5px 10px;
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
        margin-right: 82px;
        width: 150px;
    }
    .input-style-1 {
        display: inline-block;
        width: 150px;
    }
    .tab-area {
        width: $width;
        margin: 10px auto 0px auto;
        padding: 8px 15px 0px 15px;
        background: #fff;
        position: relative;
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
        margin: -10px 0 5px 150px;
    }
}
</style>