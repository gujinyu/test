<template>
    <div class="randomCheckList">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea">
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
                            <el-radio-button label="">不限</el-radio-button>
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
                            @selectProjects="SelectProjects" :ChangeOnselect="ChangeOnselect" :isProjectClearable="isProjectClearable"
                            :havedefaultProject="havedefaultProject" :showSelectProject="showSelectProject"
                            :resetselectProjectData="resetselectProjectData"></selectProject>
                    </div>
                    <!--v_s: 添加项目状态筛选框 -->
                    <select-check @changeEvents="changeEvent" :forArrSelectDiv="forArrSelectDiv">
                    </select-check>
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus"
                            width="400" :content="search.tileID">
                            <el-input class="input-style-1" size="medium" slot="reference" v-model="search.tileID"
                                :change="formatTileIDSearchInput()" clearable placeholder="搜索网格编号">
                            </el-input>
                        </el-popover>
                        <el-button size="medium" type="primary" v-on:click="onSearch">筛选</el-button>
                        <el-button size="medium" type="primary" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 抽检列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">抽检列表</span>
                <!-- <span class="span-left">共找到</span>
                <span class="span-totalNumber">{{totalNumber}}</span>
                <span class="span-right">条抽检信息</span> -->
                <form action="/api/query_qc_sampling_info" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='project_id' v-model="search.selectProjectID">
                    <input type="hidden" name='sub_project_id' v-model="search.selectSubprojectID">
                    <input type="hidden" name='operation_segment' v-model="search.selectSection">
                    <input type="hidden" name='project_status' v-model="search.project_status">
                    <input type="hidden" name='qc_round' value="2">
                    <input type="hidden" name='start_time' value="">
                    <input type="hidden" name='end_time' value="">
                    <input type="hidden" name='tile_id_list' v-model="search.tileID">
                    <input type="hidden" name='query_or_export_data' value='30'>
                    <input type="hidden" name='path_name' value='抽检列表'>
                    <el-button class="left-button" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="randomCheckTables" border style="width: 100%" @select="randomCheckSelectionChange" @select-all="randomCheckSelectionChange">
                    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                    <el-table-column fixed prop="sampling_task_id" show-overflow-tooltip label="抽检编号" width="80"></el-table-column>
                    <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="所属子项目" width="120"></el-table-column>
                    <el-table-column prop="show_operation_segment" show-overflow-tooltip label="作业环节" width="105"></el-table-column>
                    <el-table-column prop="qc_round" label="质检轮数" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="show_project_status" label="项目状态" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="sampling_time" label="抽检时间" show-overflow-tooltip width="160"></el-table-column>
                    <el-table-column prop="show_user" label="抽检员" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="hit_tile_list" label="抽中网格列表" show-overflow-tooltip min-width="105"></el-table-column>
                    <el-table-column prop="hit_tile_number" label="抽中网格数" show-overflow-tooltip width="95"></el-table-column>
                    <el-table-column prop="wait_tile_number" label="待抽检网格数" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="hit_tile_number_ratio" label="抽中网格数占比" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="hit_tile_mileage" label="抽中网格里程（km）" show-overflow-tooltip width="170"></el-table-column>
                    <el-table-column prop="wait_tile_mileage" label="待抽检网格里程（km）" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="hit_tile_mileage_ratio" label="抽中网格里程占比" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="total_hit_tile_number" label="累计抽中网格数" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="total_tile_number" label="网格总数" show-overflow-tooltip width="80"></el-table-column>
                    <el-table-column prop="total_hit_tile_number_ratio" label="累计抽中网格数占比" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="total_hit_tile_mileage" label="累计抽中网格里程（km）" show-overflow-tooltip width="190"></el-table-column>
                    <el-table-column prop="total_tile_mileage" label="网格总里程（km）" show-overflow-tooltip width="140"></el-table-column>
                    <el-table-column prop="total_hit_tile_mileage_ratio" label="累计抽中网格里程占比" show-overflow-tooltip width="165"></el-table-column>
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
        <!--    抽检列表 end-->
    </div>
</template>

<script>
    import selectProject from '@/components/daqian_selectProject.vue'
    import {
        inputCheck,
        showDataSet,
        parentSonPassVal, // v_s: 这个方法是遍历data数据的方法
        reQpassVal //v_s: 循环数组给请求赋值
    } from '@/utils/daqian_tools'
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
                    objectType: "3", // v_s: 这个是项目状态的默认值
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
                search: {
                    userId: sessionStorage.userid,
                    selectProjectID: 0,
                    selectSubprojectID: 0,
                    selectSection: "",
                    tileID: "",
                    project_status: ""
                },
                searchDatas: {},
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                randomCheckTable: [],
                multipleRandomCheckSelection: [],
                ChangeOnselect: true, //是否每一级都可以选择，false 只允许选择最后一级 true 每一级均可选择，值会相应变化
                isProjectClearable: true, //是否允许删除项目，true 允许 false  不允许
                havedefaultProject: true, //是否具有默认子项目，true 有默认 false  无默认
                showSelectProject: false, //是否可选择 false 可选择 true 不可选择
                resetselectProjectData: false, //是否重置子项目信息 fasle 不重置 true 重置
                loading: true,
                emptyText: "查询中"
            };
        },
        updated() {
            return;
            if (this.filter.currentPage !== this.priorPage) {
                var tmpSelectData = this.multipleRandomCheckSelection[this.filter.currentPage - 1];
                if (tmpSelectData) {
                    for (var sel of tmpSelectData) {
                        var index = this.tableData.indexOf(sel);
                        if (index > -1) {
                            this.$refs.randomCheckTables.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
                this.priorPage = this.filter.currentPage;
            }
        },
        computed: {
            tableData: function () {
                if (this.randomCheckTable) {
                    for (var val of this.randomCheckTable) {
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_user = showDataSet(val.user_id, val.user_name);
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
                        if (val.operation_segment === "30") {
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
                    }
                    return this.randomCheckTable;
                }
            }
        },
        created() {
            if (sessionStorage.selectSectionWork) {
                this.search.selectSection = sessionStorage.selectSectionWork;
                if (this.search.selectSection === "3000") {
                    this.search.selectSection = "";
                }
            }
            if (sessionStorage.tileID) {
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
            searchRandomCheckInfo: function (arg) {
                this.emptyText = "查询中";
                var query_randomCheckList = {
                    project_status: reQpassVal(this.forArrSelectDiv, '项目状态'), // v_s: 项目状态
                    user_id: sessionStorage.userid,
                    operation_segment: this.search.selectSection,
                    qc_round: 2,
                    start_time: "",
                    end_time: "",
                    project_id: this.search.selectProjectID,
                    sub_project_id: this.search.selectSubprojectID,
                    tile_id_list: this.search.tileID,
                    query_or_export_data: 0,
                    page_size: this.filter.perPage,
                    page_index: this.filter.currentPage,
                    return_all: 2
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.randomCheckTable = [];
                        this.searchDatas = query_randomCheckList;
                    }
                    this.totalNumber = 0;
                    this.filter.currentPage = 1;
                    this.multipleRandomCheckSelection = [];
                    this.loading = true;
                }
                this.search.project_status = this.forArrSelectDiv[0].objectType; // v_s:给导出按钮执行赋值状态数据
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_index = this.filter.currentPage;
                this.searchDatas.page_size = this.filter.perPage;
                this.$http.post("/api/query_qc_sampling_info", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.randomCheckTable = data.data.sampling_info;
                                this.totalNumber = Number(data.data.total_number);
                                if (this.totalNumber == 0) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.emptyText = "加载中";
                                }
                            }
                        } else {
                            this.randomCheckTable = [];
                            this.emptyText = "查询失败";
                        }
                    },
                    response => {
                        // 响应错误回调
                        this.randomCheckTable = [];
                        this.loading = false;
                        this.emptyText = "查询失败";
                    }
                );
            },
            onSearch: function (event) {
                this.searchRandomCheckInfo();
            },
            onRefresh: function (event) {
                if (event !== 'sectionChange') {
                    // v_s: 方法参数 1、要遍历的数组2、要赋值的对象名称3、要赋的值4、赋值的方向（子传父，父传子）
                    parentSonPassVal(this.forArrSelectDiv, '项目状态', '3', 'son_parent');
                    this.search.tileID = '';
                    this.resetselectProjectData = true;
                } else {
                    this.searchRandomCheckInfo();
                }
            },
            selectSectionChange: function () {
                sessionStorage.selectSectionWork = this.search.selectSection;
                this.onRefresh("sectionChange");
            },
            pageSizeChange: function (val) {
                this.multipleRandomCheckSelection = [];
                this.filter.perPage = val;
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
                this.searchRandomCheckInfo({
                    loading: true
                });
            },
            randomCheckSelectionChange: function (val) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.filter.currentPage - 1) {
                        this.multipleRandomCheckSelection[this.filter.currentPage - 1] = val;
                    } else {
                        if (typeof this.multipleRandomCheckSelection[i] == "undefined") {
                            this.multipleRandomCheckSelection[i] = [];
                        }
                    }
                }
            },
            SelectProjects: function (data) {
                this.search.selectProjectID = data.project_id;
                this.search.selectSubprojectID = data.sub_project_id;
                if (data.init) {
                    this.searchRandomCheckInfo();
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

    .randomCheckList {
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
            .borderBottom {
                text-align: right;
                margin-bottom: 10px;
            }
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
            margin-right: 80px;
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

            .subTitle {
                float: right;
                margin-bottom: 10px;
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
