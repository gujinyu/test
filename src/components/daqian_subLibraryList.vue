<template>
    <div class="subLibraryList">
        <!-- 成果库下子项目列表 begin-->
        <div class="table-div">
            <el-table :data="tableData" ref="subLibraryTable" border style="width: 100%">
                <el-table-column fixed prop="results_sub_library_id" show-overflow-tooltip label="子成果库id" min-width="120"></el-table-column>
                <el-table-column fixed prop="results_sub_library_name" show-overflow-tooltip label="子成果库名称" min-width="130"></el-table-column>
                <el-table-column prop="project_name" show-overflow-tooltip label="源主项目" min-width="120"></el-table-column>
                <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="源子项目" min-width="120"></el-table-column>
                <el-table-column prop="master_library_name" show-overflow-tooltip label="源母库" min-width="120"></el-table-column>
                <el-table-column prop="city_name" show-overflow-tooltip label="城市" min-width="80"></el-table-column>
                <el-table-column prop="data_standard_version" show-overflow-tooltip label="规范版本" min-width="120"></el-table-column>
                <el-table-column prop="generate_time" label="生成时间" show-overflow-tooltip min-width="160"></el-table-column>
                <el-table-column prop="generate_time_stamp" show-overflow-tooltip label="时间戳" min-width="100"></el-table-column>
                <el-table-column prop="source_data_trunk" show-overflow-tooltip label="源数据分支" min-width="130"></el-table-column>
                <el-table-column prop="destination_data_trunk" label="成果数据分支" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column prop="show_user" label="生成用户" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="tile_id_list" label="网格列表" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column prop="show_release_status" label="发布状态" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="show_branch_copy_status" label="数据拷贝状态" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="branch_copy_start_time" label="拷贝开始时间" show-overflow-tooltip width="155"></el-table-column>
                <el-table-column prop="branch_copy_end_time" label="拷贝完成时间" show-overflow-tooltip width="155"></el-table-column>
                <el-table-column prop="branch_copy_host_name" label="拷贝机器" show-overflow-tooltip width="80"></el-table-column>
                <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="scope.row.release_status === '2'" :disabled="accessDisabled"
                            @click.native.prevent="editInfo(scope.$index,1)">发布</el-button>
                        <el-button type="text" size="small" v-if="scope.row.release_status === '1'" :disabled="accessDisabled"
                            @click.native.prevent="editInfo(scope.$index,2)">不发布</el-button>
                        <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editResultLibraryInfo(scope.$index)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="filter.currentPage"
                    :page-sizes="[10,20,50,100,1000]" background :page-size="filter.perPage" layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </div>
        <!-- 成果库下子项目列表 end-->
        <!-- 编辑子成果库信息 begin-->
        <el-dialog title="编辑子成果库信息" :visible.sync="dialogEditVisible" :close-on-click-modal="false" :append-to-body="true"
            :center="true">
            <el-form ref="inResultLibrary" :model="inResultLibrary" :rules="editRules" label-width="120px" class="demo-dynamic">
                <el-form-item label="子成果库编号">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inResultLibrary.results_sub_library_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="子成果库名称">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inResultLibrary.results_sub_library_name" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="发布状态" prop="release_status">
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inResultLibrary.release_status" placeholder="请选择发布状态"
                            size="medium">
                            <el-option value='1' label="发布"></el-option>
                            <el-option value='2' label="不发布"></el-option>
                        </el-select>
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
        <!-- 编辑子成果库信息 end-->
    </div>
</template>

<script>
    import {
        showDataSet,
        alertInfo
    } from '@/utils/daqian_tools'
    export default {
        props: {
            subLibraryData: {
                type: Object
            }
        },
        data() {
            return {
                filter: {
                    perPage: 10,
                    currentPage: 1
                },
                totalNumber: 0,
                priorPage: 1,
                subLibraryTable: [],
                accessDisabled: false,
                dialogEditVisible: false,
                editRules: {
                    release_status: [{
                        required: true,
                        message: '请设置发布状态',
                        trigger: 'change'
                    }]
                },
                inResultLibrary: [],
            }
        },
        created() {
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
        },
        updated() {
            if (this.filter.currentPage !== this.priorPage) {
                this.priorPage = this.filter.currentPage;
            }
        },
        computed: {
            tableData: function () {
                this.subLibraryTable = this.subLibraryData.results_library_info[0].results_sub_library_info;
                this.totalNumber = this.subLibraryTable.length;
                // this.filter.currentPage = 1;
                if (this.totalNumber) {
                    for (var val of this.subLibraryTable) {
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_user = showDataSet(val.user_id, val.user_name);
                        val.master_library_name = showDataSet(val.master_library_id, val.master_library_name);
                        if (val.release_status === '1') {
                            val.show_release_status = '发布';
                        } else if (val.release_status === '2') {
                            val.show_release_status = '不发布';
                        }
                        if (val.branch_copy_status === '1') {
                            val.show_branch_copy_status = "未开始";
                        } else if (val.branch_copy_status === '2') {
                            val.show_branch_copy_status = "排队中";
                        } else if (val.branch_copy_status === '3') {
                            val.show_branch_copy_status = "处理中";
                        } else if (val.branch_copy_status === '4') {
                            val.show_branch_copy_status = "完成";
                        } else if (val.branch_copy_status === '5') {
                            val.show_branch_copy_status = "失败";
                            if (val.branch_copy_fail_description) {
                                val.show_branch_copy_status = "失败，原因：" + val.branch_copy_fail_description;
                            } else {
                                val.show_branch_copy_status = "失败，原因：无";
                            }
                        }
                    }

                }
                return this.subLibraryTable.slice((this.filter.currentPage - 1) * this.filter.perPage, this.filter.currentPage *
                    this.filter.perPage);
            }
        },
        methods: {
            pageSizeChange: function (val) {
                this.filter.perPage = val;
            },
            pageCurrentChange: function (val) {
                this.priorPage = this.filter.currentPage;
                this.filter.currentPage = val;
            },
            editResultLibraryInfo: function (index) {
                this.inResultLibrary = JSON.parse(JSON.stringify(this.tableData[index]));
                this.dialogEditVisible = true;
            },
            submitEditForm: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var queryEditData = {
                            "user_id": sessionStorage.userid,
                            "results_sub_library_id": this.inResultLibrary.results_sub_library_id,
                            "release_status": this.inResultLibrary.release_status,
                            "memo": this.inResultLibrary.memo
                        };
                        this.$http.post('/api/modify_results_sub_library_info', queryEditData).then(
                            response => {
                                response = response.body;
                                var data = response.data;
                                if (data.errno === 0) {
                                    alertInfo(this, 'success', '子成果库信息编辑成功', () => {
                                        this.dialogEditVisible = false;
                                        this.$emit('refreshSubLibrary', 'true');
                                    });
                                } else {
                                    alertInfo(this, 'error', '子成果库信息编辑失败，' + data.msg, () => {
                                        this.dialogEditVisible = false;
                                        this.$emit('refreshSubLibrary', 'true');
                                    });
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            editInfo: function (index, releaseStatus) {
                let rowInfo = JSON.parse(JSON.stringify(this.tableData[index]));
                let msg = '';
                if (releaseStatus === 1) {
                    msg = '发布';
                } else {
                    msg = '不发布';
                }
                this.$confirm('是否确认' + msg + '该子成果库?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.submitReleaseInfo(rowInfo.results_sub_library_id, releaseStatus);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + msg,
                        duration: 1500
                    });
                });

            },
            submitReleaseInfo: function (subLibraryId, releaseStatus) {
                var queryEditData = {
                    "user_id": sessionStorage.userid,
                    "results_sub_library_id": subLibraryId,
                    "release_status": releaseStatus
                };
                this.$http.post('/api/modify_results_sub_library_info', queryEditData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, 'success', '子成果库的发布状态修改成功', () => {
                            this.$emit('refreshSubLibrary', 'true');
                        });
                    } else {
                        alertInfo(this, 'error', '子成果库的发布状态修改失败，' + data.msg, () => {
                            this.$emit('refreshSubLibrary', 'true');
                        });
                    }
                });
            },
        }
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;

    // .el-form-item__content {
    //     text-align: center;
    // }
    .subLibraryList {
        overflow: auto;
        width: $width;
        height: 100%;

        .table-div {
            width: 95%;
            margin: 20px auto 0px auto;
        }

        .pagination-area {
            width: 95%;
            text-align: right;
            margin: 30px 0 0px 0;
        }
    }

</style>
