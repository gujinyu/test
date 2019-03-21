<template>
    <div class="resultLibrary">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea">
                    <!-- 筛选条件 begin-->
                    <div class="selectDiv">
                        <span class="align-right">车厂：</span>
                        <el-popover placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                            :content="search.carFactory">
                            <el-input style="width:300px" slot="reference" size="medium" v-model="search.carFactory"
                                clearable placeholder="搜索车厂名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">车厂：</span>
                        <el-input style="width:300px;" v-model="search.carFactory" size="medium" clearable placeholder="搜索车厂，支持模糊搜索">
                        </el-input>
                    </div> -->

                    <div class="selectDiv">
                        <span class="align-right">成果库名称：</span>
                        <el-popover placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus"
                            :content="search.LibraryName">
                            <el-input style="width:300px" slot="reference" size="medium" v-model="search.LibraryName"
                                clearable placeholder="搜索成果库名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right" style="margin-left:20px;">成果库名称：</span>
                        <el-input style="width:300px;" v-model="search.LibraryName" size="medium" clearable placeholder="搜索成果库名称，支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right" style="margin-left:20px;">生产成果库日期：</span>
                        <el-date-picker class="date-style" v-model="search.planTime" @change="selectDateChange" type="daterange"
                            size="medium" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 成果库列表 begin-->
        <div class="table-area">
            <div class="btn-list">
                <span class="titlespan">成果库列表</span>
            </div>
            <div class="segmenting-line"></div>
            <!-- 按钮区 begin-->
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="resultLibrarytable" border style="width: 100%" @select="resultLibrarySelectionChange"
                    @select-all="resultLibrarySelectionChange">
                    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                    <el-table-column prop="results_library_id" show-overflow-tooltip label="成果库编号" min-width="110"></el-table-column>
                    <el-table-column prop="results_library_name" show-overflow-tooltip label="成果库名称" min-width="130"></el-table-column>
                    <el-table-column prop="car_factory" show-overflow-tooltip label="车厂" min-width="100"></el-table-column>
                    <el-table-column prop="results_sub_library_number" label="子成果库个数" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="release_results_sub_library_number" label="子成果库发布个数" show-overflow-tooltip
                        min-width="150"></el-table-column>
                    <el-table-column prop="total_tile_number" label="发布网格总数" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="total_mileage" label="总里程（km）" show-overflow-tooltip min-width="140"></el-table-column>
                    <el-table-column prop="generate_time" label="生成成果库时间" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column prop="user_id" label="生成成果库用户ID" show-overflow-tooltip min-width="150"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="showSubLibarary(scope.$index)" type="text" size="small">查看</el-button>
                            <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editResultLibraryInfo(scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>
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
        <!-- 成果库列表 end-->
        <!-- 弹窗 begin-->
        <!-- 查看成果库下子成果库 begin-->
        <el-dialog title="子成果库列表" :visible.sync="dialogShowVisible" :close-on-click-modal="false" width="75%">
            <el-col :span="6" :offset="12">
                <p class="right">所属成果库编号：{{inResultLibrary.results_library_id}}</p>
            </el-col>
            <el-col :span="6">
                <p>所属成果库名称：{{inResultLibrary.results_library_name}}</p>
            </el-col>
            <subLibraryList :subLibraryData="subLibraryData" @refreshSubLibrary="refreshSubLibrary"></subLibraryList>
        </el-dialog>
        <!-- 查看成果库下子成果库 end-->
        <!-- 编辑成果库信息 begin-->
        <el-dialog title="编辑成果库信息" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form ref="inResultLibrary" :model="inResultLibrary" :rules="editRules" label-width="120px" class="demo-dynamic">
                <el-form-item label="成果库编号">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inResultLibrary.results_library_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="成果库名称" prop="results_library_name">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inResultLibrary.results_library_name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="车厂" prop="car_factory">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inResultLibrary.car_factory"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" v-model="inResultLibrary.memo"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditForm('inResultLibrary')">确定</el-button>
                    <el-button @click="dialogEditVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑成果库信息 end-->

    </div>
</template>

<script>
    import {
        transformstartDate,
        transformEndDate,
        alertInfo
    } from "@/utils/daqian_tools";
    import subLibraryList from "@/components/daqian_subLibraryList.vue";
    export default {
        components: {
            subLibraryList
        },
        data() {
            return {
                formHeight: this.global.formHeight,
                accessDisabled: false,
                search: {
                    LibraryName: "",
                    carFactory: "",
                    planTime: [],
                    startTime: "",
                    endTime: ""
                },
                searchDatas: {},
                perPage: 10,
                currentPage: 1,
                priorPage: 1,
                totalNumber: 0,
                dialogEditVisible: false,
                editRules: {
                    results_library_name: [{
                        required: true,
                        message: "请填写成果库名称",
                        trigger: "blur"
                    }],
                    car_factory: [{
                        required: true,
                        message: "请输入车厂",
                        trigger: "blur"
                    }]
                },
                dialogShowVisible: false,
                inResultLibrary: [],
                resultLibraryData: [],
                subLibraryData: {},
                multipleLibrarySelection: [],
                loading: true,
                emptyText: "查询中"
            };
        },
        computed: {
            tableData: function () {
                return this.resultLibraryData;
            }
        },
        created() {
            this.searchResultLibrary();
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
        },
        updated() {
            if (this.currentPage !== this.priorPage) {
                var tmpSelectData = this.multipleLibrarySelection[this.currentPage - 1];
                if (tmpSelectData) {
                    for (var sel of tmpSelectData) {
                        var index = this.tableData.indexOf(sel);
                        if (index > -1) {
                            this.$refs.resultLibrarytable.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
                this.priorPage = this.currentPage;
            }
        },
        methods: {
            selectDateChange: function (val) {
                if (val) {
                    this.search.startTime = transformstartDate(this.search.planTime[0]);
                    this.search.endTime = transformEndDate(this.search.planTime[1]);
                } else {
                    this.search.startTime = "";
                    this.search.endTime = "";
                }
            },
            searchResultLibrary: function (arg) {
                this.emptyText = "查询中";
                var queryresultLibraryData = {
                    //"user_id":sessionStorage.userid,
                    results_library_id: 0,
                    results_library_name: this.search.LibraryName,
                    car_factory: this.search.carFactory,
                    query_start_time: this.search.startTime,
                    query_end_time: this.search.endTime,
                    is_query_sub_library: 0,
                    query_or_export_data: 0,
                    page_index: this.currentPage,
                    page_size: this.perPage,
                    return_all: arg && arg.return_all ? arg.return_all : 2
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.resultLibraryData = [];
                        this.searchDatas = queryresultLibraryData;
                    }
                    this.totalNumber = 0;
                    this.currentPage = 1;
                    this.multipleLibrarySelection = [];
                    this.loading = true;
                }
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_index = this.currentPage;
                this.searchDatas.page_size = this.perPage;
                this.$http.post("/api/query_results_library", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.resultLibraryData = data.data.results_library_info;
                                this.totalNumber = data.data.total_number;
                                if (this.totalNumber == 0) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.emptyText = "加载中";
                                }
                            }
                        } else {
                            this.resultLibraryData = [];
                            this.emptyText = "查询失败";
                        }
                    },
                    response => {
                        // 响应错误回调
                        this.resultLibraryData = [];
                        this.loading = false;
                        this.emptyText = "查询失败";
                    }
                );
            },
            onSearch: function (event) {
                this.searchResultLibrary(event);
            },
            onRefresh: function (event) {
                this.search.LibraryName = "";
                this.search.carFactory = "";
                this.search.planTime = [];
                this.search.startTime = "";
                this.search.endTime = "";
                this.searchResultLibrary();
            },
            showSubLibarary: function (index) {
                this.inResultLibrary = JSON.parse(JSON.stringify(this.tableData[index]));
                var query_SubLibraryData = {
                    //"user_id":sessionStorage.userid,
                    results_library_id: this.inResultLibrary.results_library_id,
                    is_query_sub_library: 1,
                    query_or_export_data: 0,
                    page_size: 10,
                    page_index: 1,
                    return_all: 1
                };
                this.$http.post("/api/query_results_library", query_SubLibraryData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        if (
                            data.data.results_library_info.length &&
                            data.data.results_library_info[0].results_sub_library_info.length
                        ) {
                            this.subLibraryData = Object.assign({}, this.subLibraryData, data.data);
                            this.dialogShowVisible = true;
                        } else {
                            alertInfo(this, "success", "该成果库里没有子成果库");
                        }
                    } else {
                        alertInfo(this, "error", "查询子成果库失败，" + data.msg);
                    }
                });
            },
            editResultLibraryInfo: function (index) {
                this.inResultLibrary = JSON.parse(JSON.stringify(this.tableData[index]));
                this.dialogEditVisible = true;
            },
            submitEditForm: function (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var queryEditData = {
                            user_id: sessionStorage.userid,
                            result_library_id: parseInt(this.inResultLibrary.results_library_id),
                            result_library_name: this.inResultLibrary.results_library_name,
                            car_factory: this.inResultLibrary.car_factory,
                            memo: this.inResultLibrary.memo
                        };
                        this.$http.post("/api/modify_result_library", queryEditData).then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                alertInfo(this, "success", "成果库信息编辑成功", () => {
                                    this.dialogEditVisible = false;
                                    this.searchResultLibrary();
                                });
                            } else {
                                alertInfo(this, "error", "成果库信息编辑失败，" + data.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            refreshSubLibrary: function (data) {
                if (data) {
                    var query_SubLibraryData = {
                        //"user_id":sessionStorage.userid,
                        results_library_id: this.inResultLibrary.results_library_id,
                        is_query_sub_library: 1,
                        query_or_export_data: 0,
                        page_size: 10,
                        page_index: 1,
                        return_all: 1
                    };
                    this.$http.post("/api/query_results_library", query_SubLibraryData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            if (
                                data.data.results_library_info.length &&
                                data.data.results_library_info[0].results_sub_library_info.length
                            ) {
                                this.subLibraryData = Object.assign({}, this.subLibraryData, data.data);
                            }
                        } else {
                            alertInfo(this, "error", "查询子成果库失败，" + data.msg);
                        }
                    });
                }
            },
            resultLibrarySelectionChange: function (val) {
                this.multipleLibrarySelection[this.currentPage - 1] = val;
                var pagesNumber = Math.ceil(this.totalNumber / this.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    if (i == this.currentPage - 1) {
                        this.multipleLibrarySelection[i] = val;
                    } else {
                        if (typeof this.multipleLibrarySelection[i] == "undefined") {
                            this.multipleLibrarySelection[i] = [];
                        }
                    }
                }
            },
            pageSizeChange: function (val) {
                this.multipleLibrarySelection = [];
                this.perPage = val;
                this.onSearch({
                    loading: true
                });
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.currentPage;
                this.currentPage = val;
                this.searchResultLibrary({
                    loading: true
                });
            }
        }
    };

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    .resultLibrary {
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

        .align-right {
            text-align: right;
            min-width: 60px;
            display: inline-block;
        }

        .cascader-select-style {
            width: 300px;
        }

        .date-style {
            margin-right: 82px;
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
    }

</style>
