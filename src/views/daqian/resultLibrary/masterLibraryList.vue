<template>
    <div class="masterLibraryList">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea">
                    <!-- 筛选条件 begin-->
                    <div class="clearfix">
                        <div class="selectDiv">
                            <span class="align-right">母库类型：</span>
                            <el-select size="medium" v-model="search.masterLibraryType" clearable placeholder="全部">
                                <template>
                                    <el-option v-for="(item,index) in this.masterLibraryTypeList" :key="index" :value="index" :label="item"></el-option>
                                </template>
                            </el-select>
                        </div>
                        <div class="selectDiv">
                            <span class="align-right">母库状态：</span>
                            <el-select size="medium" v-model="search.markStatus" clearable placeholder="全部">
                                <template>
                                    <el-option v-for="(item,index) in this.markStatusList" :key="index" :value="index" :label="item"></el-option>
                                </template>
                            </el-select>
                        </div>
                        <div class="selectDiv">
                            <span class="align-right">母库详情：</span>
                            <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.details">
                                <el-input class="input-style" slot="reference" size="medium" v-model="search.details" clearable placeholder="搜索母库详情，支持模糊搜索">
                                </el-input>
                            </el-popover>
                        </div>
                        <!-- <div class="selectDiv">
                            <span class="align-right">母库详情：</span>
                            <el-input class="input-style-1" size="medium" v-model="search.details" placeholder="搜索详情，支持模糊搜索">
                            </el-input>
                        </div> -->
                        <!-- <span>收缩</span> -->
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">母库名称：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.masterLibraryName">
                            <el-input class="input-style" slot="reference" size="medium" v-model="search.masterLibraryName" clearable placeholder="搜索母库名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                        <el-button type="primary" style="margin-left:80px" size="medium" v-on:click="onSearch">筛选</el-button>
                        <el-button type="primary" size="medium" v-on:click="onRefresh">刷新</el-button>
                    </div>

                </div>
            </div>
        </div>
        <!-- 筛选区 end-->
        <!-- 母库列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">母库列表</span>
                <form action="/api/query_master_library" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.userId">
                    <input type="hidden" name='master_library_name' v-model="search.masterLibraryName">
                    <input type="hidden" name='master_library_type' v-model="search.masterLibraryType">
                    <input type="hidden" name='details' v-model="search.details">
                    <input type="hidden" name='mark_status' v-model="search.markStatus">
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name='query_or_export_data' value='1'>
                    <input type="hidden" name='path_name' value='母库列表'>
                    <el-button class="left-button" size="medium" :disabled="accessDisabled" type="primary" plain native-type="submit">导出</el-button>
                </form>
                <el-button class="right-div" type="primary" :disabled="accessDisabled" size="medium" @click="createMasterLibrary()">新建母库</el-button>
                <!-- v_s: 添加按钮折叠 -->
                <el-dropdown class="right-div">
                    <el-button type="primary" size="medium" :disabled="accessDisabled">
                        发布成果库<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="center" @click.native="generateBank()">生成成果库</el-dropdown-item>
                        <el-dropdown-item class="center-last" @click.native="NewlyBank()">添加至成果库</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" :max-height="formHeight" element-loading-text="拼命查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="masterLibrarytable" border style="width: 100%" @select="masterLibrarySelectionChange" @select-all="masterLibrarySelectionChange" @sort-change="sortTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="master_library_id" show-overflow-tooltip label="母库编号" sortable="custom" width="105"></el-table-column>
                    <el-table-column fixed prop="master_library_name" show-overflow-tooltip label="母库名称" width="120"></el-table-column>
                    <el-table-column prop="show_master_library_type" show-overflow-tooltip label="母库类型" width="90"></el-table-column>
                    <el-table-column prop="show_mark_status" label="母库状态" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column prop="details" show-overflow-tooltip label="母库详情" width="120"></el-table-column>
                    <el-table-column prop="total_mileage" sortable="custom" show-overflow-tooltip label="公里" width="100"></el-table-column>
                    <el-table-column prop="total_tile_num" sortable="custom" show-overflow-tooltip label="网格数量" width="110">
                        <template slot-scope="scope">
                            <el-button @click="handleTileNumberClick(scope.row)" type="text" size="small">{{scope.row.total_tile_num}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="wy_task_num" sortable="custom" show-overflow-tooltip label="外业任务数" width="130"></el-table-column>
                    <el-table-column prop="data_standard_version" show-overflow-tooltip label="规范版本" width="110"></el-table-column>
                    <el-table-column prop="show_algorithm_version" show-overflow-tooltip label="算法类型" width="110"></el-table-column>
                    <el-table-column prop="road_branch" label="数据分支" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="ny_update_time" sortable="custom" label="内业更新时间" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="wy_start_time" sortable="custom" label="外业开始时间" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="wy_update_time" sortable="custom" label="外业结束时间" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="create_time" sortable="custom" label="创建时间" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="show_operation_user" label="操作用户" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="operation_time" label="操作时间" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editMasterLibrary(scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="perPage" layout="total, sizes, prev, pager, next, jumper" :total="totalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </div>
        <!-- 母库列表 end-->
        <!-- v_s:生成成果库begin -->
        <create-lib @formHiddenGenerate="formHidden" @submitCreadGenerate="Determine" :createLibform="parentData" :sAndHidds="fromBoxShow"></create-lib>
        <!-- v_s:生成成果库 end -->
        <!-- v_s:添加至成果库begin -->
        <create-lib @formHiddenAdd="addformHidden" @submitCreadAdd="addDetermine" :createLibform="addResuitBank" :sAndHidds="addResuitBankShow"></create-lib>
        <!-- v_s:添加至成果库 end -->
        <!-- 新建母库 begin-->
        <el-dialog title="新建母库" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" width="600px">
            <el-form ref="createform" :model="createform" :rules="createMasterLibraryRules" label-width="120px" class="demo-dynamic">
                <el-form-item label="母库名称" prop="masterLibraryName">
                    <el-col :span="16">
                        <el-input v-model="createform.masterLibraryName" @change="suggestDataBranch()" placeholder="请填写母库名称" clearable size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="母库类型" prop="masterLibraryType">
                    <el-col :span="8">
                        <el-col :span="23">
                            <el-select style="float: left" size="medium" v-model="createform.masterLibraryType" placeholder="请选择">
                                <template>
                                    <el-option v-for="(item,index) in this.masterLibraryTypeList" :key="index" :value="index" :label="item"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="数据分支" prop="data_branch">
                    <el-col :span="16">
                        <el-input :maxlength='128' clearable placeholder="请填写数据分支，最多128个字符" v-model="createform.data_branch" size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="母库详情" prop="details">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="createform.details"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="createform.memo"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitCreateForm('createform')">确定</el-button>
                    <el-button @click="dialogCreateVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 新建母库 end-->
        <!-- 编辑母库 begin-->
        <el-dialog title="编辑母库" :visible.sync="dialogEditVisible" :close-on-click-modal="false" width="600px">
            <el-form ref="editMasterLibrary" :model="editMasterLibraryForm" :rules="editMasterLibraryRules" label-width="100px" class="demo-dynamic">
                <el-form-item label="母库编号">
                    <el-col :span="16">
                        <el-input v-model="editMasterLibraryForm.master_library_id" :disabled="true" size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="母库名称" prop="master_library_name">
                    <el-col :span="16">
                        <el-input v-model="editMasterLibraryForm.master_library_name" clearable size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="母库类型" prop="master_library_type">
                    <el-col :span="16">
                        <el-select style="float: left" size="medium" v-model="editMasterLibraryForm.master_library_type" placeholder="请选择母库类型">
                            <template>
                                <el-option v-for="(item,index) in this.masterLibraryTypeList" :key="index" :value="index" :label="item"></el-option>
                            </template>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="母库状态" prop="mark_status">
                    <el-col :span="16">
                        <el-select style="float: left" v-model="editMasterLibraryForm.mark_status" @change="typeChange" :disabled="user_permission !== '1' && user_permission !== '2'" size="medium">
                            <el-option value='1' label="合格"></el-option>
                            <el-option value='2' label="作废"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="母库详情" prop="details">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="editMasterLibraryForm.details"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}" v-model="editMasterLibraryForm.memo"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditForm('editMasterLibrary')">确定</el-button>
                    <el-button @click="dialogEditVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑母库 end-->
    </div>
</template>

<script>
import { trim, validateData, alertInfo, showDataSet, parentSonPassVal } from "@/utils/daqian_tools";
import router from "@/router";
import Vue from "vue";
import createLib from "./daqian_createLibrary.vue";
export default {
    components: {
        createLib
    },
    data() {
        return {
            user_permission: sessionStorage.user_permission,
            formHeight: this.global.formHeight,
            accessDisabled: false,
            fromBoxShow: false, // v_s: 生成成果库的显示隐藏变量
            parentData: {
                // v_s: 生成成果库组件的数据
                title: "生成成果库",
                name: "", // 成果库名称
                carFactory: "", // v_s: 车厂
                memo: "", // 备注信息数据
                Suffix: "Generate", // 判断是生成成果库还是添加至成果库的后缀
                selectSubProjectList: [
                    {
                        destination_data_trunk: "", // v_s: 成果数据分支数据
                        source_branch_time: "", // 数据版本时间
                        source_data_trunk: "", // v_s: 母库分支数据
                        sub_project_name: "", // v_s: 母库名称数据
                        sub_project_process_type: "",
                        tile_id_list: "" // 网格列表数据
                    }
                ]
            },
            addResuitBankShow: false, // 添加至成果库弹出显示隐藏
            addResuitBank: {
                // v_s: 添加至成果库组件的数据
                title: "添加至成果库",
                name: "", // 成果库名称
                carFactory: "", // v_s: 车厂
                memo: "", // 备注信息数据
                Suffix: "Add", // 判断是生成成果库还是添加至成果库的后缀
                selectSubProjectList: [
                    {
                        master_library_id: "", // v_s: 母库id
                        destination_data_trunk: "", // v_s: 成果数据分支数据
                        source_branch_time: "", // 数据版本时间
                        source_data_trunk: "", // v_s: 母库分支数据
                        sub_project_name: "", // v_s: 母库名称数据
                        sub_project_process_type: "",
                        tile_id_list: "" // 网格列表数据
                    }
                ]
            },
            parentArr: [],
            tableList: [], // v_s: 获取用户选中的全部网格
            search: {
                userId: sessionStorage.userid,
                masterLibraryName: "",
                masterLibraryType: "",
                sort_field_name: "master_library_id desc",
                markStatus: "",
                details: ""
            },
            searchDatas: {},
            markStatusList: {
                "1": "合格",
                "2": "作废"
            },
            masterLibraryTypeList: {
                "1": "项目库",
                "2": "基础库"
            },
            createform: {
                masterLibraryName: "",
                masterLibraryType: "2",
                data_branch: "",
                details: "",
                memo: ""
            },
            createMasterLibraryRules: {
                masterLibraryName: [
                    {
                        required: true,
                        message: "请填写母库名称",
                        trigger: "blur"
                    }
                ],
                masterLibraryType: [
                    {
                        required: true,
                        message: "请选择母库类型",
                        trigger: "change"
                    }
                ],
                data_branch: [
                    {
                        required: true,
                        message: "请填写数据分支",
                        trigger: "blur"
                    }
                ],
                details: [
                    {
                        required: true,
                        message: "请填写母库详情",
                        trigger: "blur"
                    }
                ]
            },
            editMasterLibraryRules: {
                master_library_type: [
                    {
                        required: true,
                        message: "请选择母库类型",
                        trigger: "change"
                    }
                ],
                mark_status: [
                    {
                        required: true,
                        message: "请选择母库状态",
                        trigger: "change"
                    }
                ],
                master_library_name: [
                    {
                        required: true,
                        message: "请填写母库名称",
                        trigger: "blur"
                    }
                ],
                details: [
                    {
                        required: true,
                        message: "请填写母库详情",
                        trigger: "blur"
                    }
                ]
            },
            perPage: 10,
            currentPage: 1,
            priorPage: 1,
            totalNumber: 0,
            dialogCreateVisible: false,
            dialogEditVisible: false,
            loading: true,
            emptyText: "查询中",
            masterLibraryData: [],
            editMasterLibraryForm: {},
            selectNumber: 0,
            selectAllFlag: false,
            multipleMasterLibrarySelection: []
        };
    },
    computed: {
        tableData: function() {
            for (var val of this.masterLibraryData) {
                val.show_master_library_type = this.masterLibraryTypeList[val.master_library_type];
                val.show_mark_status = this.markStatusList[val.mark_status];
                val.show_operation_user = showDataSet(val.operation_user_id, val.operation_user);
                if (val.algorithm_version) {
                    val.show_algorithm_version = val.algorithm_version.replace(/1/g, "旧").replace(/2/g, "新");
                }
            }
            return this.masterLibraryData;
        }
    },
    created() {
        this.searchMasterLibrary();
        this.accessDisabled = eval(sessionStorage.roteAuthotity);
    },
    updated() {
        // v_s: 添加勾选状态保持方法
        // if (this.filter.currentPage !== this.priorPage) {
        //     if (this.multipleMasterLibrarySelection) {
        //         for (var sel of this.multipleMasterLibrarySelection) {
        //             for (var ele of sel) {
        //                 var index = this.tableData.indexOf(ele);
        //                 if (index > -1) {
        //                     this.$refs.masterLibrarytable.toggleRowSelection(this.tableData[index]);
        //                 }
        //             }
        //         }
        //     }
        //     this.priorPage = this.filter.currentPage;
        // }
        this.$refs.masterLibrarytable.clearSelection();
        var tmpSelectData = this.multipleMasterLibrarySelection[this.currentPage - 1];
        if (tmpSelectData) {
            let arr = JSON.parse(JSON.stringify(tmpSelectData));
            for (var sel of tmpSelectData) {
                for (let index in this.tableData) {
                    if (JSON.stringify(sel) === JSON.stringify(this.tableData[index])) {
                        this.$refs.masterLibrarytable.toggleRowSelection(this.tableData[index]);
                    }
                }
            }
            this.multipleMasterLibrarySelection[this.currentPage - 1] = arr;
        }
    },
    methods: {
        // 编辑母库修改母库状态是的方法
        typeChange: function (val) {
            if(val == '2') {
                this.$confirm('母库将永久设置为作废不支持变更，是否继续？', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }).catch(() => {
                        this.editMasterLibraryForm.mark_status = '1'
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });          
                });  
            }else if(val == '1') {
                this.editMasterLibraryForm.mark_status = '2'
                return alertInfo(this, "error", "修改为作废的子项目不能修改为合格!");
            }
        },
        permissionCheck: function(val) {
            // v_s: 母库状态修改时用户权限校验
            let user_permission = localStorage.getItem("user_permission");
            if (user_permission === "1" || user_permission !== "2") {
                this.editMasterLibraryForm.mark_status = val === "1" ? "2" : "1";
                return alertInfo(this, "error", "您当前没有接边推荐的权限!");
            }
        },
        resmanChangeList: function(DataVal) {
            if(this.tableList.length != 0){
                // v_s: 获取用户选择的所有母库
                this.tableList = [];
            }
            this.parentArr = [];
            this.multipleMasterLibrarySelection.forEach(ele => {
                if(ele.lenght != 0) {
                    ele.filter(val => {
                        if (val) {
                            this.parentArr.push(val)
                            this.tableList[0] = val;
                        }
                    });
                }
            });
            if(this.parentArr.length !== 1) {
                return alertInfo(this, "error", "一次仅支持选择一个母库"+DataVal.title);
            }
            if(this.tableList[0] && this.tableList[0].mark_status == '2') {
                return alertInfo(this, "error", "作废的母库不允许"+DataVal.title);
            }
            this.dataListfor(DataVal);
        },
        getSelectDatas: function () {
            let num = 0;
            for (let val of this.multipleMasterLibrarySelection) {
                num += val.length;
            }
            this.selectNumber = num;
            this.selectAllFlag = this.selectNumber == this.totalNumber;
        },
        dataListfor: function(DataVal) {
            if (DataVal == this.parentData) {
                if (this.tableList.length < 1) {
                    return alertInfo(this, "warning", "请选择一个要生成成果库的的母库");
                } else if (this.tableList.length > 1) {
                    return alertInfo(this, "warning", "每次只能选择一个要生成成果库的的母库");
                }
                this.fromBoxShow = true;
            } else {
                if (this.tableList.length < 1) {
                    return alertInfo(this, "warning", "请选择一个要添加至成果库的的母库");
                } else if (this.tableList.length > 1) {
                    return alertInfo(this, "warning", "每次只能选择一个要添加至成果库的的母库");
                }
                this.addResuitBankShow = true;
            }
            var masterBranchName = "";
            this.tableList.forEach(ele => {
                // v_s: 对选择的母库资料进行处理
                masterBranchName = ele.master_library_name;
                DataVal.selectSubProjectList.forEach(val => {
                    val.sub_project_name = ele.master_library_name;
                    val.source_data_trunk = ele.road_branch;
                    val.master_library_id = ele.master_library_id;
                });
            });
            // v_s: 调用获取网格id的请求 如果需要展示 列表数据id的话就调用这个方法
            // this.gettableId(masterBranchName,DataVal)
        },

        NewlyBank: function() {
            // 添加至成果库方法
            this.resmanChangeList(this.addResuitBank);
        },

        addformHidden: function() {
            // 添加至成果库子组件点击取消或差号时关闭弹窗口的方法
            this.addResuitBankShow = false;
        },
        addDetermine: function(val) {
            // 添加至成果库子组件点击确定时发送请求的方法
            // console.log(val, '添加至成果库');
            this.addResuitBankFun(val);
        },
        formHidden: function() {
            // 生成成果库子组件点击取消或差号时关闭弹窗口的方法
            this.fromBoxShow = false;
        },
        Determine: function(val) {
            // 生成成果库子组件点击确定时发送请求的方法
            // console.log(val, '生成成果库');
            this.generateRoBank(val);
        },
        generateBank: function() {
            // 生成成果库方法
            this.resmanChangeList(this.parentData);
        },
        suggestDataBranch: function() {
            if (this.createform.data_branch === "") {
                this.createform.data_branch = pinyinUtil.getPinyin(this.createform.masterLibraryName, "", false);
            }
        },
        // 生成成果库方法
        generateRoBank: function(val) {
            let req = {
                user_id: sessionStorage.userid, // 生成成果库的用户ID
                car_factory: val[0].carFactory,
                memo: val[0].memo, // 获取的备注信息
                results_library_name: val[0].name,
                source_type: 2, // 1子项目生成成果库 2母库生产成功库
                master_library_list: [
                    {
                        master_library_id: val[0].selectSubProjectList[0].master_library_id,
                        master_library_name: val[0].selectSubProjectList[0].sub_project_name, // 母库名称
                        source_data_trunk: val[0].selectSubProjectList[0].source_data_trunk, // 母库分支
                        source_branch_version: val[0].selectSubProjectList[0].source_branch_time, // 获取的时间
                        destination_data_trunk: val[0].selectSubProjectList[0].destination_data_trunk, // 成果库数据分支
                        tile_id_list: val[0].selectSubProjectList[0].tile_id_list
                    }
                ]
            };
            let url = "generate_results_library";
            let Tips = "生成";
            this.reqIntenList(url, req, Tips);
        },
        // 添加至成果库方法
        addResuitBankFun: function(val) {
            let req = {
                user_id: sessionStorage.userid, // 添加至果库的用户ID
                car_factory: val[1][0].AllTypesSelect[val[1][0].objectType], // v_s 车厂名称
                memo: val[0].memo, // 获取的备注信息
                results_library_name: val[1][1].AllTypesSelect[val[1][1].objectType], // 成果库名称
                results_library_id: val[1][1].results_library_id, // 成果库id
                source_type: 2, // 1子项目生成成果库 2母库生产成功库
                master_library_list: [
                    {
                        master_library_id: val[0].selectSubProjectList[0].master_library_id, // 母库分支id
                        master_library_name: val[0].selectSubProjectList[0].sub_project_name, // 母库名称
                        source_data_trunk: val[0].selectSubProjectList[0].source_data_trunk, // 母库分支
                        source_branch_version: val[0].selectSubProjectList[0].source_branch_time, // 获取的时间
                        destination_data_trunk: val[0].selectSubProjectList[0].destination_data_trunk, // 成果库数据分支
                        tile_id_list: val[0].selectSubProjectList[0].tile_id_list // 网格列表
                    }
                ]
            };
            let url = "add_sub_results_library";
            let Tips = "添加至";
            this.reqIntenList(url, req, Tips);
        },

        reqIntenList: function(url, data, type) {
            this.$http.post("/api/" + url, data).then(res => {
                if (res.body.data.errno === 0) {
                    let {
                        data: { results_library_id: data }
                    } = res.body.data;
                    alertInfo(this, "success", type + "成果库成功！", () => {
                        if(type == '生成'){  // 关闭对话框的方法
                            this.fromBoxShow = false;
                        }else{
                            this.addResuitBankShow = false;
                        }
                    });
                    this.searchMasterLibrary();
                } else {
                    alertInfo(this, "error", type + "成果库失败！" + res.body.data.msg);
                }
            });
        },

        handleTileNumberClick: function(row) {
            router.push({
                name: "masterLibraryTileList",
                params: {
                    master_library_name: row.master_library_name
                }
            });
        },
        onSearch: function(event) {
            this.selectAllFlag = false;
            this.searchMasterLibrary(event);
        },
        onRefresh: function(event) {
            this.selectAllFlag = false;
            this.search.masterLibraryName = "";
            this.search.masterLibraryType = "";
            this.search.details = "";
            this.search.markStatus = "";
            this.search.sort_field_name = "master_library_id desc";
            this.$refs.masterLibrarytable.clearSort();
            this.searchMasterLibrary();
        },
        searchMasterLibrary: function(arg) {
            this.emptyText = "查询中";
            var queryMasterLibraryData = {
                user_id: this.search.userId,
                master_library_name: this.search.masterLibraryName,
                master_library_type: this.search.masterLibraryType,
                sort_field_name: this.search.sort_field_name,
                details: this.search.details,
                mark_status: this.search.markStatus,
                query_or_export_data: 0,
                page_index: this.currentPage,
                page_size: this.perPage,
                return_all: 2
            };
            if (!(arg && arg.loading)) {
                if (!(arg && arg.return_all)) {
                    this.masterLibraryData = [];
                    this.totalNumber = 0;
                    this.searchDatas = queryMasterLibraryData;
                }
                this.currentPage = 1;
                this.multipleMasterLibrarySelection = [];
                this.loading = true;
            }
            this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
            this.searchDatas.page_index = this.currentPage;
            this.searchDatas.page_size = this.perPage;
            this.$http.post("/api/query_master_library", this.searchDatas).then(
                response => {
                    this.loading = false;
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0 || data.errno === 7) {
                        if (data.errno === 7) {
                            this.emptyText = "未查询到符合条件的数据";
                        } else {
                            this.masterLibraryData = data.data.master_library_list;
                            this.totalNumber = data.data.total_number;
                            if (this.totalNumber == 0) {
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.emptyText = "加载中";
                            }
                        }
                        this.getSelectDatas();
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
        createMasterLibrary: function() {
            this.dialogCreateVisible = true;
        },
        editMasterLibrary: function(index) {
            this.editMasterLibraryForm = JSON.parse(JSON.stringify(this.tableData[index]));
            this.dialogEditVisible = true;
        },
        submitCreateForm: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var creatData = {
                        user_id: this.search.userId,
                        master_library_name: trim(this.createform.masterLibraryName),
                        master_library_type: this.createform.masterLibraryType,
                        data_branch: this.createform.data_branch,
                        details: this.createform.details,
                        memo: trim(this.createform.memo)
                    };
                    this.$http.post("/api/create_master_library", creatData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "母库创建成功，母库编号:" + data.data.master_library_id, () => {
                                this.dialogCreateVisible = false;
                            });
                            this.searchMasterLibrary();
                        } else {
                            alertInfo(this, "error", "母库创建失败，" + data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },

        submitEditForm: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var editData = {
                        user_permission: this.user_permission, // v_s: 后端利用权限去判断
                        user_id: this.search.userId,
                        master_library_id: this.editMasterLibraryForm.master_library_id,
                        master_library_name: this.editMasterLibraryForm.master_library_name,
                        master_library_type: this.editMasterLibraryForm.master_library_type,
                        mark_status: this.editMasterLibraryForm.mark_status,
                        details: this.editMasterLibraryForm.details,
                        memo: this.editMasterLibraryForm.memo
                    };
                    this.$http.post("/api/modify_master_library", editData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "母库编辑成功", () => {
                                this.dialogEditVisible = false;
                                this.searchMasterLibrary();
                            });
                        } else {
                            alertInfo(this, "error", "母库编辑失败，" + data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        masterLibrarySelectionChange: function(val) {
            this.multipleMasterLibrarySelection[this.currentPage - 1] = val;
            var pagesNumber = Math.ceil(this.totalNumber / this.perPage);
            for (var i = 0; i < pagesNumber; i++) {
                if (i == this.currentPage - 1) {
                    this.multipleMasterLibrarySelection[i] = val;
                } else {
                    if (typeof this.multipleMasterLibrarySelection[i] == "undefined") {
                        this.multipleMasterLibrarySelection[i] = [];
                    }
                }
            }
            this.getSelectDatas();
        },
        sortTable: function(val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "master_library_id desc";
            }
            this.onSearch();
        },
        pageSizeChange: function(val) {
            this.multipleMasterLibrarySelection = [];
            this.perPage = val;
            this.onSearch({
                loading: true
            });
        },
        pageCurrentChange: function(val) {
            this.priorPage = this.currentPage;
            this.currentPage = val;
            this.searchMasterLibrary({
                loading: true
            });
        }
    }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;

.el-collapse {
    border: none;
}

.center {
    text-align: center;
    border-bottom: 1px solid #ccc;
    min-width: 115px;
}

.center-last {
    text-align: center;
    min-width: 115px;
}

.masterLibraryList {
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
        min-width: 50px;
        display: inline-block;
        margin-left: 20px;
    }

    .cascader-select-style {
        width: 300px;
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
        margin: 10px 0px;
        padding: 0 34px 30px;
        background: #fff;
        opacity: 1;

        .btn-list { 
            width: 100%;
            height: 40px;
            margin: 0px auto;
        }

        .span-left {
            margin: 5px 0px 5px 0px;
        }

        .span-right {
            margin: 5px 10px 5px 0px;
        }

        .segmenting-line {
            height: 1px;
            width: 100%;
            margin: 0px auto 0px auto;
            background-color: #ccc;
            overflow: hidden;
        }

        .table-div {
            width: 100%;
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