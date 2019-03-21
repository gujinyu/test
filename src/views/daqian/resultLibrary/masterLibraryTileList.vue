<template>
    <div class="masterLibraryTileList">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" @load="resize(102)" :style="collapseFlag?'height:100%':'height:102px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectDiv">
                        <span class="align-right">母库名称：</span>
                        <el-select size="medium" class="select-style" filterable v-model="search.masterLibraryName"
                            clearable placeholder="全部" :change="selectMasterLibrary()">
                            <template>
                                <el-option v-for="(item) in this.masterLibraryData" :key="item.master_library_id"
                                    :value="item.master_library_name" :label="item.master_library_name"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">锁定状态：</span>
                        <el-select size="medium" class="select-style" v-model="search.lockStatus" clearable placeholder="全部">
                            <template>
                                <el-option v-for="(item,index) in this.lockStatusList" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">算法类型：</span>
                        <el-select size="medium" class="select-style" v-model="search.algorithmVersion" clearable
                            placeholder="全部">
                            <template>
                                <el-option v-for="(item,index) in this.algorithmVersions" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">有无数据：</span>
                        <el-select size="medium" class="select-style" v-model="search.haveData" clearable placeholder="全部">
                            <template>
                                <el-option v-for="(item,index) in this.haveDataList" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">子项目类型：</span>
                        <el-select v-model="search.subProjectType" placeholder="全部" clearable size="medium">
                            <template>
                                <el-option v-for="(item,index) in this.subProjectAllTypes" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">城市名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.cityName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.cityName"
                                clearable placeholder="搜索城市名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">城市名称：</span>
                        <el-input class="input-style-1" size="medium" v-model="search.cityName" clearable placeholder="搜索城市，支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">规范版本：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.dataStandardVersion">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.dataStandardVersion"
                                clearable placeholder="搜索规范版本，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">规范版本：</span>
                        <el-input class="input-style-1" size="medium" v-model="search.dataStandardVersion" clearable
                            placeholder="搜索规范版本，支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">子项目名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.subProjectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.subProjectName"
                                clearable placeholder="搜索子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">子项目名称：</span>
                        <el-input class="input-style-1" size="medium" v-model="search.subProjectName" clearable
                            placeholder="搜索子项目，支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">网格编号：</span>
                        <el-popover class="input-style" placement="bottom-start" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件"
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
        <!-- 母库网格列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">母库网格列表</span>
                <form action="/api/query_master_library_tile" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='master_library_name' v-model="search.masterLibraryName">
                    <input type="hidden" name='sub_project_type' v-model="search.subProjectType">
                    <input type="hidden" name='sub_project_name' v-model="search.subProjectName">
                    <input type="hidden" name='city_name' v-model="search.cityName">
                    <input type="hidden" name='lock_status' v-model="search.lockStatus">
                    <input type="hidden" name='tile_id' v-model="search.tileID">
                    <input type="hidden" name='data_standard_version' v-model="search.dataStandardVersion">
                    <input type="hidden" name='algorithm_version' v-model="search.algorithmVersion">
                    <input type="hidden" name='have_data' v-model="search.haveData">
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name='query_or_export_data' value='1'>
                    <input type="hidden" name='path_name' value='母库网格列表'>
                    <el-button class="left-button" size="medium" :disabled="accessDisabled" type="primary" plain
                        native-type="submit">导出</el-button>
                </form>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData"
                    ref="tilesTable" border style="width: 100%" @select="tileSelectionChange" @select-all="tileSelectionChange"
                    @sort-change="sortTable">
                    <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
                    <el-table-column fixed prop="tile_id" label="网格编号" show-overflow-tooltip sortable="custom" width="105"></el-table-column>
                    <el-table-column fixed prop="show_master_library_name" label="母库名称" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="show_master_library_type" show-overflow-tooltip label="母库类型" width="100"></el-table-column>
                    <el-table-column prop="tile_level" label="网格层级" show-overflow-tooltip width="105"></el-table-column>
                    <el-table-column prop="city" show-overflow-tooltip label="城市" width="100"></el-table-column>
                    <el-table-column prop="out_library_lock" show-overflow-tooltip label="锁定状态" width="100"></el-table-column>
                    <el-table-column prop="show_sub_project_name" label="关联子项目" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="show_sub_project_type" label="子项目类型" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column prop="data_standard_version" show-overflow-tooltip label="规范版本" width="100"></el-table-column>
                    <el-table-column prop="stable_version" show-overflow-tooltip label="稳定版本" width="100"></el-table-column>
                    <el-table-column prop="show_algorithm_version" show-overflow-tooltip label="算法类型" width="100"></el-table-column>
                    <el-table-column prop="total_mileage" show-overflow-tooltip label="公里" sortable="custom" width="100"></el-table-column>
                    <!-- <el-table-column prop="road_branch" label="路网数据分支" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="road_branch_version" label="路网数据版本" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="tile_branch" label="点云数据分支" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="tile_branch_version" show-overflow-tooltip label="点云数据版本" width="120"></el-table-column>
                    <el-table-column prop="grid_branch" show-overflow-tooltip label="网格数据分支" width="120"></el-table-column>
                    <el-table-column prop="grid_branch_version" label="网格数据版本" show-overflow-tooltip width="120"></el-table-column> -->
                    <el-table-column prop="wy_task_num" label="关联外业任务数" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="wy_task_list" label="关联外业任务列表" show-overflow-tooltip width="155"></el-table-column>
                    <el-table-column prop="ny_update_time" show-overflow-tooltip label="内业更新日期" sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="wy_start_time" label="外业开始日期" show-overflow-tooltip sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="wy_update_time" label="外业结束日期" show-overflow-tooltip sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="show_have_data" label="有无数据" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip width="90"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="90">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editMasterLibraryTileInfo(scope.$index)">编辑</el-button>
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
        <!-- 母库网格列表 end-->
        <!-- 编辑母库网格信息 begin-->
        <el-dialog title="编辑母库网格" :visible.sync="dialogEditTileVisible" :close-on-click-modal="false" width="600px">
            <el-form ref="masterLibraryTile" :model="masterLibraryTileData" label-width="120px" class="demo-dynamic">
                <el-form-item label="网格编号" prop="tile_id">
                    <el-col :span="16">
                        <el-input size="medium" v-model="masterLibraryTileData.tile_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="母库名称">
                    <el-col :span="16">
                        <el-input size="medium" v-model="masterLibraryTileData.master_library_name" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联子项目">
                    <el-col :span="16">
                        <el-input size="medium" v-model="masterLibraryTileData.sub_project_name" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="城市">
                    <el-col :span="16">
                        <el-input size="medium" v-model="masterLibraryTileData.city" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" v-model="masterLibraryTileData.memo"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditTileForm()">确定</el-button>
                    <el-button @click="dialogEditTileVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑母库网格信息 end-->
    </div>
</template>

<script>
    import Vue from "vue";
    import {
        alertInfo,
        inputCheck,
        showDataSet,
        resize
    } from "@/utils/daqian_tools";
    export default {
        data() {
            return {
                formHeight: this.global.formHeight,
                collapseFlag: false,
                search: {
                    userId: sessionStorage.userid,
                    masterLibraryName: "",
                    cityName: "",
                    subProjectName: "",
                    subProjectType: "",
                    lockStatus: "",
                    algorithmVersion: "",
                    dataStandardVersion: "",
                    tileID: "",
                    haveData: "",
                    sort_field_name: ""
                },
                searchDatas: {},
                subProjectAllTypes: {
                    "1": "常规项目",
                    "2": "更新项目",
                    "3": "修复项目",
                    "5": "构网项目"
                },
                lockStatusList: {
                    "1": "未锁定",
                    "2": "锁定"
                },
                masterLibraryType: {
                    "1": "项目库",
                    "2": "基础库"
                },
                algorithmVersions: {
                    "1": "旧",
                    "2": "新"
                },
                haveDataList: {
                    "1": "无数据",
                    "2": "有数据"
                },
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                tilesTableData: [],
                masterLibraryTileData: {},
                dialogEditTileVisible: false,
                editMasterLibraryTile: [],
                multipleTileSelection: [],
                accessDisabled: false,
                loading: true,
                emptyText: "查询中",
                masterLibraryData: []
            };
        },
        computed: {
            tableData: function () {
                for (var val of this.tilesTableData) {
                    val.show_sub_project_type = this.subProjectAllTypes[val.sub_project_type];
                    val.show_master_library_name = showDataSet(val.master_library_id, val.master_library_name);
                    val.show_master_library_type = this.masterLibraryType[val.master_library_type];
                    // val.show_out_library_lock = this.lockStatusList[val.out_library_lock];
                    val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                    val.show_algorithm_version = this.algorithmVersions[val.algorithm_version];
                    val.show_have_data = this.haveDataList[val.have_data];
                }
                return this.tilesTableData;
            }
        },
        created() {
            this.getMasterLibrary();
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
            if (sessionStorage.masterLibraryName) {
                this.search.masterLibraryName = sessionStorage.masterLibraryName;
            }
            if (this.$route.params.master_library_name) {
                this.search.masterLibraryName = this.$route.params.master_library_name;
                this.$route.params.master_library_name = "";
            }
            this.queryMasterLibraryTile();
        },
        mounted() {
            this.$nextTick(function () {
                resize()
            })
        },
        methods: {
            selectMasterLibrary: function () {
                sessionStorage.masterLibraryName = this.search.masterLibraryName;
            },
            getMasterLibrary: function () {
                var queryMasterLibraryData = {
                    user_id: this.search.userId,
                    master_library_name: "",
                    master_library_type: "",
                    sort_field_name: "master_library_id desc",
                    details: "",
                    mark_status: "",
                    query_or_export_data: 0,
                    page_index: 1,
                    page_size: 10,
                    return_all: 1
                };
                this.$http.post("/api/query_master_library", queryMasterLibraryData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        this.masterLibraryData = data.data.master_library_list;
                    }
                });
            },
            sortTable: function (val) {
                if (val.order === "descending") {
                    this.search.sort_field_name = val.prop + " desc";
                } else if (val.order === "ascending") {
                    this.search.sort_field_name = val.prop + " asc";
                } else {
                    this.search.sort_field_name = "";
                }
                this.onSearch();
            },
            formatSearchInput: function () {
                this.search.tileID = inputCheck(this, this.search.tileID, 1);
            },
            onSearch: function (event) {
                this.queryMasterLibraryTile(event);
            },
            onRefresh: function () {
                this.search.masterLibraryName = "";
                this.search.subProjectName = "";
                this.search.subProjectType = "";
                this.search.cityName = "";
                this.search.lockStatus = "";
                this.search.tileID = "";
                this.search.dataStandardVersion = "";
                this.search.algorithmVersion = "";
                this.search.sort_field_name = "";
                this.search.haveData = "";
                this.$refs.tilesTable.clearSort();
                this.queryMasterLibraryTile();
            },
            queryMasterLibraryTile: function (arg) {
                this.emptyText = "查询中";
                var queryTileData = {
                    user_id: sessionStorage.userid,
                    master_library_name: this.search.masterLibraryName,
                    sub_project_name: this.search.subProjectName,
                    sub_project_type: this.search.subProjectType,
                    city_name: this.search.cityName,
                    lock_status: this.search.lockStatus,
                    tile_id: this.search.tileID,
                    data_standard_version: this.search.dataStandardVersion,
                    algorithm_version: this.search.algorithmVersion,
                    have_data: this.search.haveData,
                    query_or_export_data: 0,
                    sort_field_name: this.search.sort_field_name,
                    page_index: this.filter.currentPage,
                    page_size: this.filter.perPage,
                    return_all: 2
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.tilesTableData = [];
                        this.totalNumber = 0;
                        this.searchDatas = queryTileData;
                    }
                    this.filter.currentPage = 1;
                    this.multipleTileSelection = [];
                    this.loading = true;
                }
                this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
                this.searchDatas.page_index = this.filter.currentPage;
                this.searchDatas.page_size = this.filter.perPage;
                this.$http.post("/api/query_master_library_tile", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.tilesTableData = data.data.master_library_tile_list;
                                this.totalNumber = Number(data.data.total_number);
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
            },
            editMasterLibraryTileInfo: function (index) {
                this.masterLibraryTileData = JSON.parse(JSON.stringify(this.tableData[index]));
                this.dialogEditTileVisible = true;
            },
            submitEditTileForm: function () {
                var editTileData = {
                    user_id: sessionStorage.userid,
                    tile_id: parseInt(this.masterLibraryTileData.tile_id),
                    master_library_id: parseInt(this.masterLibraryTileData.master_library_id),
                    memo: this.masterLibraryTileData.memo
                };
                this.$http.post("/api/modify_master_library_tile_info", editTileData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "母库网格信息编辑成功", () => {
                            this.dialogEditTileVisible = false;
                            this.queryMasterLibraryTile();
                        });
                    } else {
                        alertInfo(this, "error", "母库网格信息编辑失败，" + data.msg);
                    }
                });
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
                this.queryMasterLibraryTile({
                    loading: true
                });
            }
        }
    };

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    //  @media screen and (min-width:2006px) {
    //     .more {
    //         display: none;
    //     }
    // }
    .masterLibraryTileList {
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
            min-width: 85px;
            display: inline-block;
            margin-left: 20px;
        }

        .input-style {
            display: inline-block;
            margin-right: 44px;
            width: 240px;
        }

        .input-style-1 {
            display: inline-block;
            width: 240px;
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

        .left-button {
            float: left;
            margin: 10px 0px 5px 10px;
        }
    }

</style>
