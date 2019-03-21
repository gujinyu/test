<template>
    <div class="ReturnLibrary">
        <div class="searchArea">
            <div class="searchDiv">
                <div class="clearfix">
                    <div class="selectDiv">
                        <span class="align-right">母库名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持母库名称筛选" trigger="focus" :content="search.originName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.originName" clearable placeholder="搜索母库名称">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">子项目名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持模糊筛选" trigger="focus" :content="search.sonObjectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.sonObjectName" clearable placeholder="搜索子项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">回库网格列表：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持模糊筛选" trigger="focus" :content="search.homeGridNum">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.homeGridNum" clearable placeholder="搜索回库网格列表，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                </div>

                <div class="open">
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
            <div class="btn-list">
                <span class="titlespan">母库回库列表</span>
            </div>
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :data="tableData" :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" ref="resultLibrarytable" border style="width: 100%">
                    <el-table-column fixed prop="id" label="回库编号" show-overflow-tooltip width="150">
                    </el-table-column>
                    <el-table-column prop="master_library_name" label="母库名称" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="sub_project_name" label="子项目名称" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="sub_project_process_type" label="子项目类型" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="in_library_status" label="回库状态" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="tile_count" label="回库网格数" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="tile_list" label="回库网格列表" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="in_library_times" label="回库请求次数" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="user_name" label="操作用户" show-overflow-tooltip min-width="100">
                    </el-table-column>
                    <el-table-column prop="in_library_start_time" label="回库开始时间" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="in_library_end_time" label="回库结束时间" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <el-table-column prop="avg_in_time" label="平均回库时长(分钟/网格)" show-overflow-tooltip min-width="120">
                    </el-table-column>
                    <!-- <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column> -->
                </el-table>
            </div>
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="filter.currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="filter.perPage" layout="total, sizes, prev, pager, next, jumper" :total="totalNumber">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { alertInfo } from "@/utils/daqian_tools";
export default {
    data() {
        return {
            accessDisabled: false,
            totalNumber: 0,
            loading: true,
            emptyText: "查询中",
            priorPage: 1,
            search: {
                originName: "",
                sonObjectName: "",
                homeGridNum: ""
            },
            tableData: [],
            filter: {
                perPage: 10,
                currentPage: 1
            }
        };
    },
    created() {
        this.reqAllDataList();
    },
    methods: {
        pageSizeChange(val) { // 每页显示的条数
            this.filter.perPage = val;
            this.reqAllDataList();
        },
        pageCurrentChange(val) { // 切页
            this.filter.currentPage = val;
            this.reqAllDataList();
        },
        onSearch: function(event) {
            // 筛选
            this.filter.currentPage = 1;
            this.reqAllDataList();
        },
        onRefresh: function() {
            // 刷新
            this.tableData = [];
            this.search.originName = "";
            this.search.sonObjectName = "";
            this.search.homeGridNum = "";
            this.reqAllDataList();
        },
        reqAllDataList: function() {
            this.emptyText = "查询中";
            let req = {
                user_id: sessionStorage.userid,
                master_library_name: this.search.originName,
                sub_project_name: this.search.sonObjectName,
                tile_id_list: this.search.homeGridNum,
                page_index: this.filter.currentPage,
                page_size: this.filter.perPage,
                return_all: 2
            };
            let url = "query_master_library_in_out_record";
            this.loading = true;
            this.reqIntenTableList(url, req, this.allList);
        },

        reqIntenTableList: function(url, req) {
            this.$http.post("/api/" + url, req).then( res => {
                this.loading = false;
                if (res.body.code == 11) {
                    this.emptyText = "您没有访问权限!";
                    return alertInfo(this, "warning", "您没有访问权限!");
                }
                let {
                    errno: error,
                    data: { master_library_records: data, total_number: num }
                } = res.body.data;
                this.totalNumber = Number(num);
                if (error === 0 && data) {
                    this.tableData = [];
                    this.tableData = data;
                }
                if (this.totalNumber == 0) {
                    this.emptyText = "未查询到符合条件的数据";
                } else {
                    this.emptyText = "加载中";
                }
            },
            res => {
                // 响应错误回调
                this.loading = false;
                this.emptyText = "查询失败";
            }
            );
        }
    }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;


.ReturnLibrary {
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

    .clearfix {
        overflow: hidden;
    }

    .searchDiv {
        width: $width;
    }

    .selectDiv {
        float: left;
        margin: 0 20px 15px 10px;
    }

    .align-right {
        text-align: right;
        min-width: 50px;
        display: inline-block;
        margin-left: 20px;
    }

    .input-style {
        display: inline-block;
        margin-right: 82px;
        width: 300px;
    }

    .input-style-1 {
        display: inline-block;
        width: 300px;
    }

    .table-area {
        width: $width;
        margin: 10px 0px 10px 0px;
        padding: 10px 0px 30px 0px;
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
}
</style>
