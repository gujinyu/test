<template>
    <div class="userInfo">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:102px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectDiv">
                        <span class="align-right">用户角色：</span>
                        <el-select size="medium" v-model="search.user_role" clearable>
                            <template>
                                <el-option v-for="(item,index) in this.roleTypeOptions" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">所属组长：</span>
                        <Cascader :data="headManOptions" v-model="headManDatas" size='large' filterable placeholder="全部"
                            :render-format="format" @on-change="headManChange">
                        </Cascader>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">入职城市：</span>
                        <el-select size="medium" v-model="search.entry_city" clearable placeholder="全部">
                            <el-option value='北京' label="北京"></el-option>
                            <el-option value='上海' label="上海"></el-option>
                            <el-option value='顺德' label="顺德"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">在职状态：</span>
                        <el-select size="medium" v-model="search.status" clearable placeholder="全部">
                            <el-option value='1' label="在职"></el-option>
                            <el-option value='2' label="离职"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">所属公司：</span>
                        <el-popover class="input-style-1" placement="bottom-end" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.company">
                            <el-input slot="reference" v-model="search.company" size="medium" placeholder="搜索所属公司，支持模糊搜索"
                                clearable>
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">所属公司：</span>
                        <el-input class="input-style-1" v-model="search.company" size="medium" clearable placeholder="搜索所属公司,支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">用户姓名：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件"
                            trigger="focus" :content="search.user_name">
                            <el-input class="input-style-1" slot="reference" size="medium" v-model="search.user_name"
                                clearable placeholder="搜索用户名称，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <!-- <div class="selectDiv">
                        <span class="align-right">用户姓名：</span>
                        <el-input class="input-style-1" v-model="search.user_name" size="medium" clearable placeholder="搜索用户姓名,支持模糊搜索">
                        </el-input>
                    </div> -->
                    <div class="selectDiv">
                        <span class="align-right">用户编号：</span>
                        <el-input slot="reference" class="input-style" v-model="search.user_id" size="medium" clearable
                            placeholder="搜索用户编号" @change="formatSearchInput()">
                        </el-input>
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
        <div class="table-area">
            <!-- 用户列表 begin-->
            <div class="btn-list">
                <span class="titlespan">用户管理</span>
                <form action="/api/query_user_list" enctype='application/json'>
                    <input type="hidden" name='user_id' v-model="search.user_id">
                    <input type="hidden" name='user_name' v-model="search.user_name">
                    <input type="hidden" name='user_role' v-model="search.user_role">
                    <input type="hidden" name='login_account_name' v-model="search.login_account_name">
                    <input type="hidden" name='user_headman_id' v-model="search.user_headman_id">
                    <input type="hidden" name='status' v-model="search.status">
                    <input type="hidden" name='entry_city' v-model="search.entry_city">
                    <input type="hidden" name='company' v-bind:value="search.company">
                    <input type="hidden" name='export' value='1'>
                    <input type="hidden" name='path_name' value='用户管理'>
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain
                        native-type="submit">导出</el-button>
                </form>
                <el-button class="right-div" type="primary" plain size="medium" :disabled="accessDisabled" @click="batchCreateUser()"><i
                        class="el-icon-upload el-icon--right"></i>批量添加</el-button>
                <el-button class="right-div" type="primary" size="medium" :disabled="accessDisabled" @click="createUser()">添加用户</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" ref="UserInfotable"
                    :data="tableData" border style="width: 100%" @sort-change="sortTable">
                    <el-table-column fixed prop="user_id" show-overflow-tooltip min-width="80px" sortable="custom"
                        label="编号"></el-table-column>
                    <el-table-column fixed prop="user_name" show-overflow-tooltip min-width="80px" label="姓名"></el-table-column>
                    <el-table-column fixed prop="user_role_name" show-overflow-tooltip min-width="80px" label="角色"></el-table-column>
                    <el-table-column prop="login_account_name" show-overflow-tooltip min-width="150px" label="账号"></el-table-column>
                    <el-table-column prop="show_user_headman_name" show-overflow-tooltip min-width="80px" label="组长"></el-table-column>
                    <el-table-column prop="status_text" show-overflow-tooltip min-width="80px" label="在职状态"></el-table-column>
                    <el-table-column prop="company" show-overflow-tooltip min-width="80px" label="所属公司"></el-table-column>
                    <el-table-column prop="entry_city" show-overflow-tooltip min-width="100px" label="入职城市"></el-table-column>
                    <el-table-column prop="entry_date" show-overflow-tooltip min-width="160px" label="入职时间"></el-table-column>
                    <el-table-column prop="entry_interval" show-overflow-tooltip min-width="110px" sortable="custom"
                        label="在职时长"></el-table-column>
                    <el-table-column prop="leave_date" show-overflow-tooltip min-width="160px" label="离职时间"></el-table-column>
                    <el-table-column prop="show_update_user" show-overflow-tooltip min-width="100px" label="操作用户"></el-table-column>
                    <el-table-column prop="update_date" show-overflow-tooltip min-width="160px" sortable="custom" label="操作时间"></el-table-column>
                    <el-table-column prop="memo" show-overflow-tooltip min-width="60px" label="备注"></el-table-column>
                    <el-table-column fixed="right" label="操作" min-width="100px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="accessDisabled" @click="editUserWin(scope.$index)">编辑</el-button>
                            <el-button type="text" size="small" :disabled="accessDisabled || scope.row.user_role == 2 || scope.row.user_role == 4 || scope.row.user_role == 5"
                                @click="deleteUser(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--用户列表 end-->
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="currentPage"
                    :page-sizes="[10,20,50,100,1000]" :page-size="perPage" background layout="total, sizes, prev, pager, next, jumper"
                    :total="this.totalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </div>
        <!-- 添加用户 begin-->
        <el-dialog title="添加用户" :close-on-click-modal="false" :visible.sync="dialogCreateVisible">
            <el-form ref="createUserInfo" :model="createUserInfo" :rules="createRules" :label-width="formLabelWidth">
                <el-form-item label="姓名" prop="user_name">
                    <el-col :span="18">
                        <el-input v-model="createUserInfo.user_name" clearable @change="suggestAccount()" placeholder="请填写用户姓名"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="账号" prop="login_account_name">
                    <el-col :span="18">
                        <el-input v-model="createUserInfo.login_account_name" clearable placeholder="请填写用户账号，仅允许数字、字母、-、_、.、@"
                            @change="accountCheck"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码" prop="login_passwd">
                    <el-col :span="18">
                        <el-input v-model="createUserInfo.login_passwd" clearable placeholder="请设置用户密码，格式为8位数字"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="角色" prop="user_role">
                    <el-col :span="7">
                        <el-select style="float:left" v-model="createUserInfo.user_role" placeholder="请选择角色" @change="selectRoles()">
                            <template>
                                <el-option v-for="(item,index) in this.roleTypeOptions" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属组长" v-if="createUserInfo.user_role === '1' || createUserInfo.user_role === '3'">
                    <el-col :span="9">
                        <template v-if="createUserInfo.user_role === '1'">
                            <el-select style="float:left" v-model="createUserInfo.user_headman_id" placeholder="请选择所属组长">
                                <el-option v-for="(item,index) in operationHeadManUserInfo" :key="index" :label="item.user_name"
                                    :value="item.user_id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else>
                            <el-select style="float:left" v-model="createUserInfo.user_headman_id" placeholder="请选择所属组长">
                                <el-option v-for="(item,index) in this.checkHeadManUserInfo" :key="index" :label="item.user_name"
                                    :value="item.user_id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-col>
                </el-form-item>
                <el-form-item label="在职状态" prop="status">
                    <el-col :span="9">
                        <el-select style="float:left" v-model="createUserInfo.status" disabled placeholder="请选择入职状态">
                            <el-option value='1' label="在职"></el-option>
                            <el-option value='2' label="离职"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属公司">
                    <el-col :span="18">
                        <el-input v-model="createUserInfo.company" clearable placeholder="请填写用户所属公司"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="入职城市" prop="entry_city">
                    <el-col :span="9">
                        <el-select style="float:left" v-model="createUserInfo.entry_city" placeholder="请选择入职城市">
                            <el-option value='北京' label="北京"></el-option>
                            <el-option value='上海' label="上海"></el-option>
                            <el-option value='顺德' label="顺德"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="入职时间" prop="entry_date">
                    <el-col :span="18">
                        <el-date-picker v-model="createUserInfo.entry_date" type="date" format :clearable="isclearable"
                            value-format="yyyy-MM-dd" style="width: 100%;" size="medium" :picker-options="pickerOptions0"
                            placeholder="选择入职时间">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="createUserInfo.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitCreateForm('createUserInfo')">确定</el-button>
                    <el-button @click="dialogCreateVisible = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 添加用户 end-->
        <!-- 批量添加用户 begin-->
        <el-dialog title="批量添加用户" :close-on-click-modal="false" :visible.sync="dialogBatchCreateVisible" width="600px">
            <el-form ref="createUserInfo" :model="createUserInfo" :rules="createRules" label-width="100px">
                <el-form-item label="文件模版">
                    <form action="/api/import_user" enctype='application/json'>
                        <input type="hidden" name='download_template' v-bind:value="1">
                        <el-button style="float:left" type="primary" plain size="small" native-type="submit">
                            <i class="el-icon-download el-icon--right"></i>模版下载
                        </el-button>
                    </form>
                </el-form-item>
                <el-form-item label="上传文件">
                    <el-upload style="float:left" class="upload-demo" drag :limit="1" :on-exceed="handleExceed"
                        :before-upload="beforeUpload" accept=".csv" :file-list="fileList" action="">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传csv文件，且文件大小不超过1M</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="importUser()">确定</el-button>
                    <el-button @click="dialogBatchCreateVisible = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 添加用户 end-->
        <!-- 编辑用户 begin-->
        <el-dialog title="编辑用户" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form ref="editUserInfo" :model="editUser" :rules="editRules" :label-width="formLabelWidth">
                <el-form-item label="姓名" prop="user_name">
                    <el-col :span="18">
                        <el-input v-model="editUser.user_name" clearable></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="账号">
                    <el-col :span="18">
                        <el-input v-model="editUser.login_account_name" :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="新密码" prop="login_passwd">
                    <el-col :span="18">
                        <el-input v-model="editUser.login_passwd" clearable placeholder="若无需设置新密码，该项请留空"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="角色">
                    <el-col :span="7">
                        <el-select style="float:left" disabled v-model="editUser.user_role" placeholder="请选择角色">
                            <template>
                                <el-option v-for="(item,index) in this.roleTypeOptions" :key="index" :value="index"
                                    :label="item"></el-option>
                            </template>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属组长" v-if="editUser.user_role === '1' || editUser.user_role === '3'" prop="user_headman_id">
                    <el-col :span="9">
                        <template v-if="editUser.user_role === '1'">
                            <el-select style="float:left" v-model="editUser.user_headman_id" placeholder="请选择所属组长">
                                <el-option v-for="(item,index) in this.operationHeadManUserInfo" :key="index" :label="item.user_name"
                                    :value="item.user_id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else>
                            <el-select style="float:left" v-model="editUser.user_headman_id" placeholder="请选择所属组长">
                                <el-option v-for="(item,index) in this.checkHeadManUserInfo" :key="index" :label="item.user_name"
                                    :value="item.user_id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属公司">
                    <el-col :span="16">
                        <el-input v-model="editUser.company" clearable placeholder="请填写用户所属公司"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="在职状态" prop="status">
                    <el-col :span="9">
                        <el-select style="float:left" v-model="editUser.status" @change="StatusChange" placeholder="请选择入职状态">
                            <el-option value='1' label="在职"></el-option>
                            <el-option value='2' label="离职"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="入职城市" prop="entry_city">
                    <el-col :span="9">
                        <el-select style="float:left" v-model="editUser.entry_city" placeholder="请选择入职城市">
                            <el-option value='北京' label="北京"></el-option>
                            <el-option value='上海' label="上海"></el-option>
                            <el-option value='顺德' label="顺德"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="入职时间" prop="entry_date">
                    <el-col :span="18">
                        <el-date-picker v-model="editUser.entry_date" type="date" format :clearable="isclearable"
                            value-format="yyyy-MM-dd" style="width: 100%;" size="medium" :picker-options="pickerOptions0"
                            placeholder="选择入职时间">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="离职时间" prop="leave_date" v-if="editUser.status === '2'">
                    <el-col :span="18">
                        <el-date-picker v-model="editUser.leave_date" type="date" format :clearable="isclearable"
                            value-format="yyyy-MM-dd" style="width: 100%;" size="medium" :picker-options="pickerOptions1"
                            placeholder="选择离职时间">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editUser.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitEditForm('editUserInfo')">确定</el-button>
                    <el-button @click="dialogEditVisible = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--  编辑用户 end-->

    </div>
</template>

<script>
    import {
        trim,
        alertInfo,
        inputCheck,
        showDataSet,
        transformstartDateNoTime,
        messageInfo,
        resize
    } from "@/utils/daqian_tools";
    import Vue from "vue";
    import selectCity from "@/components/daqian_selectCity.vue";
    import CSV from "comma-separated-values";
    export default {
        data() {
            return {
                formHeight: this.global.formHeight,
                collapseFlag: false,
                accessDisabled: false,
                userGroup: {
                    user_id: sessionStorage.userid
                },
                fileList: [],
                search: {
                    user_id: "",
                    user_name: "",
                    user_role: "",
                    login_account_name: "",
                    user_headman_id: "",
                    status: "",
                    entry_city: "",
                    company: "",
                    sort_field_name: "user_id desc"
                },
                searchDatas: {},
                headManDatas: [],
                headManOptions: [{
                        label: "作业组长",
                        value: 1,
                        children: []
                    },
                    {
                        label: "质检组长",
                        value: 2,
                        children: []
                    }
                ],
                roleTypeOptions: {
                    "1": "作业员",
                    "2": "作业组长",
                    "3": "质检员",
                    "4": "质检组长",
                    "5": "管理员"
                },
                operationHeadManUserInfo: [],
                checkHeadManUserInfo: [],
                dialogEditVisible: false,
                dialogCreateVisible: false,
                dialogBatchCreateVisible: false,
                userInfo: [],
                editUser: [],
                perPage: 10,
                currentPage: 1,
                totalNumber: 0,
                change: true,
                formLabelWidth: "100px",
                createUserInfo: {
                    user_id: "",
                    user_name: "",
                    login_passwd: "12345678",
                    login_account_name: "",
                    user_role: "",
                    user_headman_id: "",
                    status: "1",
                    entry_city: "北京",
                    company: "",
                    entry_date: transformstartDateNoTime(new Date())
                },
                createRules: {
                    user_name: [{
                        required: true,
                        message: "请填写用户姓名",
                        trigger: "blur"
                    }],
                    login_account_name: [{
                            required: true,
                            message: "请填写用户账号",
                            trigger: "blur"
                        },
                        {
                            min: 4,
                            max: 30,
                            message: "长度在 4 到 30 个字符",
                            trigger: "blur"
                        }
                    ],
                    login_passwd: [{
                            required: true,
                            message: "请设置8位用户密码",
                            trigger: "blur"
                        },
                        {
                            min: 8,
                            max: 8,
                            message: "密码长度需为8位",
                            trigger: "blur"
                        }
                    ],
                    status: [{
                        required: true,
                        message: "请选择状态",
                        trigger: "change"
                    }],
                    entry_city: [{
                        required: true,
                        message: "请选择入职城市",
                        trigger: "change"
                    }],
                    entry_date: [{
                        required: true,
                        message: "请选择入职时间",
                        trigger: "change"
                    }],
                    user_role: [{
                        required: true,
                        message: "请选择用户角色",
                        trigger: "change"
                    }],
                    user_headman_id: [{
                        required: true,
                        message: "请选择所属组长",
                        trigger: "change"
                    }]
                },
                editRules: {
                    user_name: [{
                        required: true,
                        message: "请填写用户姓名",
                        trigger: "blur"
                    }],
                    status: [{
                        required: true,
                        message: "请选择状态",
                        trigger: "change"
                    }],
                    entry_city: [{
                        required: true,
                        message: "请选择入职城市",
                        trigger: "change"
                    }],
                    login_passwd: [{
                        min: 8,
                        max: 8,
                        message: "密码长度需为8位",
                        trigger: "blur"
                    }],
                    entry_date: [{
                        required: true,
                        message: "请选择入职时间",
                        trigger: "change"
                    }],
                    user_headman_id: [{
                        required: true,
                        message: "请选择所属组长",
                        trigger: "change"
                    }],
                    leave_date: [{
                        required: true,
                        message: "请选择离职时间",
                        trigger: "change"
                    }]
                },
                isclearable: false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                pickerOptions1: {
                    disabledDate: time => {
                        return (
                            transformstartDateNoTime(time.getTime()) < transformstartDateNoTime(this.editUser.entry_date) ||
                            time.getTime() > Date.now()
                        );
                    }
                },
                loading: true,
                emptyText: "查询中",
                perPage: 10,
                currentPage: 1
            };
        },
        computed: {
            tableData: function () {
                if (this.userInfo) {
                    for (var val of this.userInfo) {
                        val.show_user_headman_name = showDataSet(val.user_headman_id, val.user_headman_name);
                        val.show_update_user = showDataSet(val.update_user_id, val.update_user_name);
                    }
                    return this.userInfo
                }
            }
        },
        created() {
            this.onSearch();
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
        },
        mounted() {
            this.$nextTick(function () {
                resize()
            })
        },
        methods: {
            headManChange: function (val) {
                if (val) {
                    this.search.user_headman_id = parseInt(val[1]);
                } else {
                    this.search.user_headman_id = "";
                }
            },
            format(labels, selectedData) {
                const index = labels.length - 1;
                const data = selectedData[index] || false;
                if (data && data.code) {
                    return labels[index];
                }
                return labels[index];
            },
            formatSearchInput: function () {
                this.search.user_id = inputCheck(this, this.search.user_id, 1);
            },
            onSearch: function (event) {
                this.searchUser();
                this.searchHeadManUserInfo("workHeadMan");
                this.searchHeadManUserInfo("checkHeadMan");
            },
            onRefresh: function (event) {
                this.search.user_id = "";
                this.search.user_name = "";
                this.search.user_role = "";
                this.search.login_account_name = "";
                this.headManDatas = [];
                this.search.user_headman_id = "";
                this.$refs.UserInfotable.clearSort();
                this.search.sort_field_name = "user_id desc";
                this.search.status = "";
                this.search.entry_city = "";
                this.search.company = "";
                this.searchUser();
            },
            //查询用户信息
            searchUser: function (arg) {
                this.emptyText = "查询中";
                var query_user = {
                    user_id: this.search.user_id,
                    user_name: this.search.user_name,
                    user_role: this.search.user_role,
                    login_account_name: this.search.login_account_name,
                    user_headman_id: this.search.user_headman_id,
                    status: this.search.status,
                    entry_city: this.search.entry_city,
                    company: this.search.company,
                    sort_field_name: this.search.sort_field_name,
                    page_size: this.perPage,
                    page_index: this.currentPage,
                    return_all: 2,
                    noIntercept: true //拦截器校验 true为不拦截该请求 
                };
                if (!(arg && arg.loading)) {
                    if (!(arg && arg.return_all)) {
                        this.userInfo = [];
                        this.totalNumber = 0;
                        this.searchDatas = query_user;
                    }
                    this.currentPage = 1;
                    this.loading = true;
                }
                this.searchDatas.page_size = this.perPage;
                this.searchDatas.page_index = this.currentPage;
                this.$http.post("/api/query_user_list", this.searchDatas).then(
                    response => {
                        this.loading = false;
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0 || data.errno === 7) {
                            if (data.errno === 7) {
                                this.userInfo = [];
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.userInfo = data.data.user_list;
                                this.totalNumber = data.data.user_number;
                                if (this.totalNumber == 0) {
                                    this.emptyText = "未查询到符合条件的数据";
                                } else {
                                    this.emptyText = "加载中";
                                }
                            }
                        } else {
                            this.userInfo = [];
                            this.emptyText = "查询失败";
                        }
                    },
                    response => {
                        // 响应错误回调
                        this.userInfo = [];
                        this.loading = false;
                        this.emptyText = "查询失败";
                    }
                );
            },
            searchHeadManUserInfo: function (searchType) {
                var query_user = {
                    user_id: "",
                    user_name: "",
                    user_role: "",
                    login_account_name: "",
                    status: 1,
                    page_size: this.perPage,
                    page_index: this.currentPage,
                    return_all: 1,
                    noIntercept: true //拦截器校验 true为不拦截该请求 
                };
                if (searchType === "workHeadMan") {
                    query_user.user_role = "2";
                } else if (searchType === "checkHeadMan") {
                    query_user.user_role = "4";
                }
                this.$http.post("/api/query_user_list", query_user).then(response => {
                    this.loading = false;
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        if (searchType === "workHeadMan") {
                            this.operationHeadManUserInfo = [].concat(data.data.user_list);
                            this.setHeadManUserInfo(this.operationHeadManUserInfo, 0);
                        } else if (searchType === "checkHeadMan") {
                            this.checkHeadManUserInfo = [].concat(data.data.user_list);
                            this.setHeadManUserInfo(this.checkHeadManUserInfo, 1);
                        }
                    }
                });
            },
            setHeadManUserInfo: function (HeadManInfo, i) {
                if (HeadManInfo.length) {
                    this.headManOptions[i].children = [];
                    for (var val of HeadManInfo) {
                        let tmp = {
                            label: "",
                            value: 0
                        };
                        tmp.label = val.user_name;
                        tmp.value = val.user_id;
                        this.headManOptions[i].children.push(tmp);
                    }
                }
            },
            createUser: function (formName) {
                this.dialogCreateVisible = true;
                if (this.$refs["createUserInfo"]) {
                    this.$refs["createUserInfo"].resetFields();
                }
            },
            suggestAccount: function () {
                if (this.createUserInfo.login_account_name === "") {
                    this.createUserInfo.login_account_name = pinyinUtil.getPinyin(this.createUserInfo.user_name, "",
                        false);
                }
            },
            accountCheck: function () {
                inputCheck(this, this.createUserInfo.login_account_name, 6);
            },
            submitCreateForm: function (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (
                            this.createUserInfo.user_role === "2" ||
                            this.createUserInfo.user_role === "4" ||
                            this.createUserInfo.user_role === "5"
                        ) {
                            this.createUserInfo.user_headman_id = 0;
                        }
                        var createUserData = {
                            user_id: sessionStorage.userid,
                            login_passwd: this.createUserInfo.login_passwd,
                            login_account_name: trim(this.createUserInfo.login_account_name),
                            user_name: trim(this.createUserInfo.user_name),
                            user_headman_id: this.createUserInfo.user_headman_id,
                            user_role: this.createUserInfo.user_role,
                            memo: trim(this.createUserInfo.memo),
                            entry_date: this.createUserInfo.entry_date,
                            company: this.createUserInfo.company,
                            entry_city: this.createUserInfo.entry_city,
                            status: this.createUserInfo.status
                        };
                        this.$http.post("/api/add_user", createUserData).then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                alertInfo(this, "success", "用户添加成功", () => {
                                    this.dialogCreateVisible = false;
                                    this.onSearch();
                                });
                            } else {
                                alertInfo(this, "error", "用户添加失败，" + data.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            selectRoles: function (val) {
                //新增用户时，若选择角色为作业员，作业组长默认选择作业组长第一项
                if (this.createUserInfo.user_role === "1") {
                    if (this.operationHeadManUserInfo.length !== 0) {
                        this.createUserInfo.user_headman_id = this.operationHeadManUserInfo[0].user_id;
                        this.createUserInfo.user_real_id = this.createUserInfo.user_headman_id;
                    }
                }
                //新增用户时，若选择角色为质检员，作业组长默认选择质检组长第一项
                if (this.createUserInfo.user_role === "3") {
                    if (this.checkHeadManUserInfo.length !== 0) {
                        this.createUserInfo.user_headman_id = this.checkHeadManUserInfo[0].user_id;
                        this.createUserInfo.user_real_id = this.createUserInfo.user_headman_id;
                    }
                }
            },
            editUserWin: function (index) {
                this.editUser = JSON.parse(JSON.stringify(this.tableData[index]));
                if (this.editUser) {
                    this.editUser.user_role = this.editUser.user_role.toString();
                    if (this.editUser.status === "0") {
                        this.editUser.status = "";
                    }
                    if (this.editUser.entry_date === "0000-00-00 00:00:00") {
                        this.editUser.entry_date = "";
                    }
                    if (this.editUser.leave_date === "0000-00-00 00:00:00") {
                        this.editUser.leave_date = "";
                    }
                }
                this.dialogEditVisible = true;
            },
            StatusChange: function (val) {
                if (val === "2" && this.editUser.leave_date === "") {
                    this.editUser.leave_date = transformstartDateNoTime(new Date());
                } else if (val === "1") {
                    this.editUser.leave_date = "";
                }
            },
            deleteUser: function (index) {
                let deleteUserId = this.tableData[index].user_id;
                this.$confirm("是否确认要删除该用户?", "提示", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    type: "warning"
                }).then(() => {
                    this.submitdeleteInfo(deleteUserId);
                });
            },
            submitdeleteInfo: function (deleteUserId) {
                var delectUserData = {
                    user_id: sessionStorage.userid,
                    id: deleteUserId
                };
                this.$http.post("/api/delete_user", delectUserData).then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "用户删除成功", () => {
                            this.onSearch();
                        });
                    } else {
                        alertInfo(this, "error", "用户删除失败，" + data.msg);
                    }
                });
            },
            submitEditForm: function (formData) {
                this.$refs[formData].validate(valid => {
                    if (valid) {
                        var modifyUserData = {
                            modify_user_id: this.editUser.user_id,
                            user_id: sessionStorage.userid,
                            login_account_name: this.editUser.login_account_name,
                            user_name: this.editUser.user_name,
                            login_passwd: this.editUser.login_passwd,
                            user_role: this.editUser.user_role,
                            user_headman_id: this.editUser.user_headman_id,
                            memo: trim(this.editUser.memo),
                            entry_date: this.editUser.entry_date,
                            entry_city: this.editUser.entry_city,
                            company: this.editUser.company,
                            status: this.editUser.status,
                            leave_date: this.editUser.leave_date
                        };
                        this.$http.post("/api/modify_user", modifyUserData).then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                alertInfo(this, "success", "用户修改成功", () => {
                                    this.dialogEditVisible = false;
                                    this.onSearch();
                                });
                            } else {
                                alertInfo(this, "error", "用户修改失败，" + data.msg);
                            }
                        });
                    }
                });
            },
            batchCreateUser: function () {
                this.dialogBatchCreateVisible = true;
            },
            handleExceed(files, fileList) {
                messageInfo(this, "warning", "当前限制只能选择 1 个文件，若要变更，请先删除已上传文件", 3000);
            },
            beforeUpload: function (file) {
                this.fileList = [];
                if (file.size > 1024 * 1024) {
                    messageInfo(this, "error", "CSV 文件过大", 2000);
                    return false;
                }
                this.fileList.push({
                    name: file.name
                });
                const fileReader = new FileReader();
                fileReader.readAsText(file, "gb2312");
                fileReader.onload = e => {
                    const csvData = e.target.result;
                    const data = this.parseCSV(csvData);
                    this.userGroup.import = data;
                    if (!data) {
                        messageInfo(this, "error", "CSV 文件解析失败", 1500);
                        return false;
                    }
                    if (data.length === 0) {
                        messageInfo(this, "error", "数据文件不包含数据", 1500);
                    }
                };
                return false;
            },
            parseCSV: function (str) {
                const data = new CSV(str, {
                    header: false
                }).parse();
                const len = data.length;
                const result = [];
                for (let i = 1; i < len; i += 1) {
                    const row = [];
                    const size = data[i].length;
                    for (let j = 0; j < size; j += 1) {
                        row.push(data[i][j].toString().trim());
                    }
                    result.push(row);
                }
                return result;
            },
            importUser: function () {
                if (this.fileList.length === 0) {
                    this.userGroup = {};
                }
                let userGroup = this.userGroup;
                const loading = this.$loading({
                    lock: true,
                    text: "批量添加中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                this.$http.post("/api/import_user", userGroup).then(response => {
                    loading.close();
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        alertInfo(this, "success", "用户批量添加成功", () => {
                            this.dialogBatchCreateVisible = false;
                            this.onSearch();
                            this.fileList = [];
                        });
                    } else {
                        this.fileList = [];
                        alertInfo(this, "error", "用户批量添加失败，" + data.msg);
                    }
                });
            },
            sortTable: function (val) {
                if (val.order === "descending") {
                    this.search.sort_field_name = val.prop + " desc";
                } else if (val.order === "ascending") {
                    this.search.sort_field_name = val.prop + " asc";
                } else {
                    this.search.sort_field_name = "user_id desc";
                }
                this.searchUser();
            },
            pageSizeChange: function (val) {
                this.perPage = val;
                this.searchUser({
                    loading: true
                })
            },
            pageCurrentChange: function (val) {
                this.currentPage = val;
                this.searchUser({
                    loading: true
                })
            }
        }
    };

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    // @media screen and (min-width:1680px) {
    //     .more {
    //         display: none;
    //     }
    // }

    .userInfo {
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
            margin: 10px 0px;
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
