<template>
    <div class="mainProject">
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea">
                    <div class="selectDiv">
                        <span class="align-right">主项目名称：</span>
                        <el-popover class="input-style" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.projectName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.projectName" clearable placeholder="搜索主项目名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="operation">
                        <el-button type="primary" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-area">
            <div class="btn-list">
                <span class="span-left">主项目列表</span>
                <form action="/api/query_project" enctype="application/json">
                    <input type="hidden" name="user_id" v-model="search.userid">
                    <input type="hidden" name="project_name" v-model="search.projectName">
                    <input type="hidden" name="query_or_export_data" value="60">
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
                <el-button class="right-div" type="primary" :disabled="accessDisabled" size="medium" @click="dialogCreateMainProjectVisible = true">新建</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>

            <div class="table-div">
                <div class="select-area">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" ref="mainProjectTables" :data="tableDatas" border style="width: 100%" @sort-change="sortTable">
                    <el-table-column fixed prop="project_id" show-overflow-tooltip label="编号" min-width="100" sortable="custom"></el-table-column>
                    <el-table-column fixed prop="project_name" show-overflow-tooltip label="名称" min-width="140"></el-table-column>
                    <el-table-column prop="project_explain" show-overflow-tooltip label="说明" min-width="140"></el-table-column>
                    <el-table-column prop="inprogress_project_number" show-overflow-tooltip label="进行中项目" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleProjectClick(scope.row, 3)" type="text" size="small">{{scope.row.inprogress_project_number}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pause_project_number" show-overflow-tooltip label="暂停项目" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleProjectClick(scope.row, 6)" type="text" size="small">{{scope.row.pause_project_number}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="end_project_number" show-overflow-tooltip label="完结项目" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleProjectClick(scope.row, 4)" type="text" size="small">{{scope.row.end_project_number}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="invalid_project_number" show-overflow-tooltip label="作废项目" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleProjectClick(scope.row, 5)" type="text" size="small">{{scope.row.invalid_project_number}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation_context" label="操作内容" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column prop="show_operation_user" label="操作用户" show-overflow-tooltip min-width="130"></el-table-column>
                    <el-table-column prop="operation_time" label="操作时间" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column fixed="right" label="操作" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="clickRowInfo(scope.row,'edit')">编辑</el-button>
                            <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="clickRowInfo(scope.row,'delete')">删除</el-button>
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
            <!-- 新建主项目 begin -->
            <el-dialog title="新建主项目" :visible.sync="dialogCreateMainProjectVisible" :close-on-click-modal="false" width="600px">
                <el-form label-width="150px" :model="createProject" :rules="createRules" ref="createProject" class="demo-dynamic">
                    <el-form-item label="主项目名称" prop="projectName">
                        <el-col :span="16">
                            <el-input v-model="createProject.projectName" placeholder="请输入主项目名称"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="说明" prop="projectExplain">
                        <el-col :span="16">
                            <el-input v-model="createProject.projectExplain" placeholder="请输入说明"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label-width="10px">
                        <el-button type="primary" @click="createMainProject()">确定</el-button>
                        <el-button @click="dialogCreateMainProjectVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 新建主项目 end-->
            <!-- 编辑主项目 begin -->
            <el-dialog title="编辑主项目" :visible.sync="dialogEditMainProjectVisible" :close-on-click-modal="false" width="600px">
                <el-form label-width="150px" :model="editProject" :rules="editRules" ref="editProject" class="demo-dynamic">
                    <el-form-item label="主项目名称" prop="projectName">
                        <el-col :span="16">
                            <el-input v-model="editProject.projectName" placeholder="请输入主项目名称"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="说明" prop="projectExplain">
                        <el-col :span="16">
                            <el-input v-model="editProject.projectExplain" placeholder="请输入说明"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label-width="10px">
                        <el-button type="primary" @click="editMainProject()">确定</el-button>
                        <el-button @click="dialogEditMainProjectVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 编辑主项目 end-->
        </div>
    </div>
</template>
<script>
import {
    validateData,
    alertInfo,
    showDataSet
} from "@/utils/daqian_tools";
import router from "@/router";
export default {
    data() {
        return {
            formHeight: this.global.formHeight,

            search: {
                userid: sessionStorage.userid,
                projectName: "",
                sort_field_name: "project_id desc"
            },
            loading: true,
            emptyText: "查询中",
            filter: {
                perPage: 10,
                currentPage: 1
            },
            mainProjectTables: [],
            totalNumber: 0,
            accessDisabled: false,
            searchDatas: [],
            dialogCreateMainProjectVisible: false,
            dialogEditMainProjectVisible: false,
            createProject: {
                projectName: "",
                projectExplain: ""
            },
            editProject: {
                projecId: "",
                projectName: "",
                projectExplain: ""
            },
            createRules: {
                projectName: [
                    {
                        required: true,
                        message: "请输入主项目",
                        trigger: "blur"
                    }
                ],
                projectExplain: [
                    {
                        required: true,
                        message: "请输入说明",
                        trigger: "blur"
                    }
                ],
            },
            editRules: {
                projectName: [
                    {
                        required: true,
                        message: "请输入主项目",
                        trigger: "blur"
                    }
                ],
                projectExplain: [
                    {
                        required: true,
                        message: "请输入说明",
                        trigger: "blur"
                    }
                ],
            }
        }
    },
    computed:{
        tableDatas:function(){
            this.mainProjectTables.forEach(val=>{
                val.show_operation_user = showDataSet(val.operation_user_id,val.operation_user)
            })
            return this.mainProjectTables;
        }
    },
    mounted() {
        this.searchProject();
    },
    methods: {
        onSearch: function () {
            this.searchProject();
        },
        onRefresh: function () {
            this.search.projectName = "";
            this.$refs.mainProjectTables.clearSort();
            this.searchProject();
        },
        searchProject: function (arg) {
            this.emptyText = "查询中";
            let queryProjectData = {
                project_name: this.search.projectName,
                sort_field_name: this.search.sort_field_name,
                page_index: this.filter.currentPage,
                page_size: this.filter.perPage,
                return_all: 2
            };
            if (!(arg && arg.loading)) {
                if (!(arg && arg.return_all)) {
                    this.mainProjectTables = [];
                    this.totalNumber = 0;
                    this.searchDatas = queryProjectData;
                }
                this.filter.currentPage = 1;
                this.loading = true;
            }
            this.searchDatas.page_index = this.filter.currentPage;
            this.searchDatas.page_size = this.filter.perPage;
            this.$http.post("/api/query_project", this.searchDatas).then(
                response => {
                    this.loading = false;
                    response = response.body;
                    let data = response.data;
                    if (data.errno === 0 || data.errno === 7) {
                        if (data.errno === 7) {
                            this.emptyText = "未查询到符合条件的数据";
                        } else {
                            this.mainProjectTables = data.data.project_info;
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
            )
        },
        createMainProject: function (val) {
            this.$refs["createProject"].validate((valid) => {
                if (valid) {
                    var createData = {
                        project_name: this.createProject.projectName,
                        project_explain: this.createProject.projectExplain,
                        query_or_export_data: 0
                    };
                    this.$http.post("/api/create_project", createData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "主项目创建成功，主项目编号:" + data.data.project_id, () => {
                                this.dialogCreateMainProjectVisible = false;
                                this.$refs["createProject"].resetFields();
                            });
                            this.onSearch();
                        } else {
                            alertInfo(this, "error", "主项目创建失败，" + data.msg);
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            })
        },

        editMainProject: function (val) {
            this.$refs["editProject"].validate((valid) => {
                if (valid) {
                    var editData = {
                        project_id: this.editProject.projecId,
                        project_name: this.editProject.projectName,
                        project_explain: this.editProject.projectExplain,
                    };
                    this.$http.post("/api/modify_project", editData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "主项目编辑成功", () => {
                                this.dialogEditMainProjectVisible = false;
                                this.$refs["editProject"].resetFields();
                            });
                            this.onSearch();
                        } else {
                            alertInfo(this, "error", "主项目编辑失败，" + data.msg);
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            })
        },
        sortTable: function (val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "project_id desc";
            }
            this.onSearch();
        },
        clickRowInfo: function (val, operation) {
            if (operation === "edit") {
                this.dialogEditMainProjectVisible = true;
                this.editProject.projectName = val.project_name;
                this.editProject.projecId = val.project_id;
                this.editProject.projectExplain = val.project_explain;
            } else if (operation === "delete") {
                this.$confirm("是否删除该主项目？", "提示", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    type: "warning"
                }).then(() => {
                    let editData = {
                        project_id: val.project_id
                    }
                    this.$http.post("/api/delete_project", editData).then(response => {
                        var data = response.body.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "主项目删除成功", () => {
                                this.onSearch();
                            });
                        } else {
                            alertInfo(this, "error", "主项目删除失败，" + data.msg);
                            return false;
                        }
                    });
                })
            }
        },
        // 跳转
        handleProjectClick: function (val, status) {
            router.push({
                name: "projectList",
                params: {
                    mainProjectId: Number(val.project_id),
                    status: status
                }
            });
        },
        sortTable: function (val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "project_id desc";
            }
            this.onSearch();
        },
        pageSizeChange: function (val) {
            this.filter.perPage = val;
            this.searchProject({
                loading: true
            })
        },
        pageCurrentChange: function (val) {
            this.filter.currentPage = val;
            this.searchProject({
                loading: true
            })
        }
    }
}
</script>
<style lang="scss" scoped>
$width: 100%;
$height: 100%;
.mainProject {
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
        .input-style {
            display: inline-block;
            width: 300px;
        }
        .operation {
            width: 200px;
            float: left;
        }
    }

    .table-area {
        width: $width;
        margin: 10px 0px 10px 0px;
        padding: 10px 0 30px 0;
        background: #fff;
        opacity: 1;
        .select-number {
            font-size: 16px;
        }
        .btn-list {
            width: 95%;
            height: 40px;
            margin: 0px auto 0px auto;
            span {
                float: left;
                font-size: 20px;
                text-align: left;
                line-height: 40px;
                font-weight: bold;
                margin: 5px 10px 5px 10px;
            }
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
        }

        .el-dropdown-link {
            margin: 5px 10px 5px 10px;
            font-size: 12px;
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
    .right-div {
        float: right;
        margin: 10px 10px 5px 0;
    }
}
</style>

