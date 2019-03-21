<template>
    <div class="checkRuleConfig">
        <!-- 筛选区 begin-->
        <div class="searchArea">
            <div class="searchDiv">
                <div class="selectArea" :style="collapseFlag?'height:100%':'height:150px'">
                    <!-- 筛选条件 begin-->
                    <div class="selectSectionDiv">
                        <span class="align-right">配置类型：</span>
                        <el-select size="medium" @change="selectConfigTypeChange" v-model="search.selectConfigType">
                            <el-option value="1" label="准入准出质检规则"></el-option>
                            <el-option value="2" label="生产质检规则"></el-option>
                        </el-select>
                    </div>
                    <div class="selectSectionDiv" v-show="search.selectConfigType == '1'">
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium" @change="selectSectionChange">
                            <el-radio-button label="2">外业准入</el-radio-button>
                            <el-radio-button label="12">前预处理准出</el-radio-button>
                            <el-radio-button label="2001">点云融合准出</el-radio-button>
                            <el-radio-button label="2101">后预处理准出</el-radio-button>
                            <el-radio-button label="3000">生产准入</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="selectSectionDiv" v-show="search.selectConfigType == '2'">
                        <span class="align-right">选择环节：</span>
                        <el-radio-group v-model="search.selectSection" size="medium" @change="selectSectionChange">
                            <el-radio-button label="130">基础要素作业</el-radio-button>
                            <el-radio-button label="132">基础要素接边</el-radio-button>
                            <el-radio-button label="134">高阶要素作业</el-radio-button>
                            <el-radio-button label="136">高阶要素接边</el-radio-button>
                            <el-radio-button label="138">回库接边</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="selectDiv" v-show="search.selectConfigType == '2'">
                        <span class="align-right">主项目：</span>
                        <selectMainProject @selectChange="search.mainProjectID = $event" :clearable="false" ref="selectMainProject">
                        </selectMainProject>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">检查状态：</span>
                        <el-select size="medium" v-model="search.checkFlag" clearable placeholder="全部">
                            <el-option value='1' label="检查"></el-option>
                            <el-option value='2' label="不检查"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">质检要素：</span>
                        <el-select v-model="search.qc_element" clearable placeholder="全部" size="medium">
                            <el-option v-for="(item,index) in this.fieldRange.qc_element" :key="index" :value="item" :label="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">目标用户：</span>
                        <el-select v-model="search.target_user" clearable placeholder="全部" size="medium">
                            <!-- <el-option  v-for="(item,index) in this.fieldRange.target_user" :key="index" :value="item" :label="item">
                            </el-option> -->
                            <el-option value='生产' label="生产"></el-option>
                            <el-option value='研发' label="研发"></el-option>
                            <el-option value='工艺' label="工艺"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">质检类型：</span>
                        <el-select size="medium" v-model="search.is_error" clearable placeholder="全部">
                            <el-option value='1' label="必修"></el-option>
                            <el-option value='2' label="待查"></el-option>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">质检项版本：</span>
                        <el-select v-model="search.qc_rule_version" clearable placeholder="全部" size="medium">
                            <template>
                                <el-option v-for="(item) in QcRuleVersionData" :key="item.qc_rule_version" :value="item.qc_rule_version" :label="item.qc_rule_version"></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">质检简述：</span>
                        <el-popover class="input-style-1" placement="bottom-start" title="支持双向模糊查询，所有查询支持空格、分号、逗号(中英文)分隔多个查询条件" trigger="focus" :content="search.checkItemBriefDescribe">
                            <el-input slot="reference" size="medium" v-model="search.checkItemBriefDescribe" clearable placeholder="搜索质检简述，支持模糊搜索">
                            </el-input>
                        </el-popover>
                    </div>
                    <div class="selectDiv">
                        <span class="align-right">质检项编号：</span>
                        <el-popover class="input-style-1" placement="bottom-end" title="仅可输入数字、空格、分号、逗号，空格/分号/逗号分隔多个查询条件" trigger="focus" :content="search.checkItemID">
                            <el-input slot="reference" v-model="search.checkItemID" size="medium" placeholder="搜索质检项编号，支持模糊搜索" clearable :change="formatSearchInput()">
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
        <!-- 质检项列表 begin-->
        <div class="table-area">
            <!-- 按钮区 begin-->
            <div class="btn-list">
                <span class="titlespan">质检规则配置</span>
                <form action="/api/query_quality_check_rule" enctype='application/json'>
                    <input type="hidden" name='project_id' :value="search.selectConfigType == '2'?search.mainProjectID : 0">
                    <input type="hidden" name='user_id' v-model="search.user_id">
                    <input type="hidden" name='sub_project_id' v-model="search.sub_project_id">
                    <input type="hidden" name='handle_segment' v-model="search.selectSection">
                    <input type="hidden" name='check_flag' v-model="search.checkFlag">
                    <input type="hidden" name='brief' v-model="search.checkItemBriefDescribe">
                    <input type="hidden" name='rule_id_list' v-model="search.checkItemID">
                    <input type="hidden" name='sort_field_name' v-model="search.sort_field_name">
                    <input type="hidden" name='is_error' v-bind:value="search.is_error">
                    <input type="hidden" name='qc_element' v-model="search.qc_element">
                    <input type="hidden" name='target_user' v-model="search.target_user">
                    <input type="hidden" name='path_name' value='质检规则配置'>
                    <input type="hidden" name='query_or_export_data' v-model="search.query_or_export_data">
                    <input type="hidden" name="qc_rule_version" v-model="search.qc_rule_version">
                    <el-button class="left-button" :disabled="accessDisabled" size="medium" type="primary" plain native-type="submit">导出</el-button>
                </form>
                <el-dropdown class="right-div importDropdown" @command="importDropdown">
                    <el-button type="primary" :disabled="btnClickable">
                        导入
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="导入质检项">质检项</el-dropdown-item>
                        <el-dropdown-item command="导入质检项配置">质检项配置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button class="right-div" v-show="search.selectConfigType == '2'" type="primary" size="medium" :disabled="batchConfig||btnClickable" @click="batchConfigRuleCheck()">批量配置</el-button>
                <el-button class="right-div" type="primary" size="medium" v-show="!accessDisabled" :disabled="btnClickable" @click="configRuleCheckInfo()">配置</el-button>
                <el-button class="right-div" size="small" @click="cancelSubmitConfigCheckItemInfo()" v-show="btnClickable">取消</el-button>
                <el-button class="right-div" type="primary" size="small" @click="submitConfigCheckItemInfo()" v-show="btnClickable">确定</el-button>
            </div>
            <!-- 按钮区 end-->
            <div class="segmenting-line"></div>
            <div class="table-div">
                <div class="select-area-1">
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                </div>
                <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="checkRuleConfigtable" border style="width: 100%" @select="checkRuleConfigSelectionChange" @select-all="checkRuleConfigSelectionChange" @sort-change="sortTable">
                    <el-table-column fixed type="selection" width="55" :selectable="checkboxInit"></el-table-column>
                    <el-table-column fixed prop="rule_id" show-overflow-tooltip label="质检项编号" min-width="120" sortable="custom"></el-table-column>
                    <el-table-column fixed prop="qc_element" show-overflow-tooltip label="质检要素" min-width="80"></el-table-column>
                    <el-table-column fixed prop="show_is_error" label="质检类型" show-overflow-tooltip min-width="80"></el-table-column>
                    <el-table-column prop="target_user" show-overflow-tooltip label="目标用户" min-width="80"></el-table-column>
                    <el-table-column prop="brief" show-overflow-tooltip label="质检要求" min-width="120"></el-table-column>
                    <el-table-column prop="description" label="质检方法" show-overflow-tooltip min-width="150"></el-table-column>
                    <el-table-column prop="core_parameter" show-overflow-tooltip label="核心参数" min-width="80"></el-table-column>
                    <el-table-column prop="show_status" label="状态" show-overflow-tooltip min-width="60"></el-table-column>
                    <el-table-column prop="createtime" label="质检项创建时间" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column prop="online_time" label="生效时间" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column prop="offline_time" label="下线时间" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column prop="qc_rule_version" label="质检项版本" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column prop="show_import_type" label="导入类型" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column prop="show_operation_user" label="操作员" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="160"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="accessDisabled" @click.native.prevent="editCheckRuleInfo(scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 表格分页 begin-->
            <div class="pagination-area">
                <div class="select-area" v-show="btnClickable">
                    <p class="select-number">已选择<b> {{selectNumber}} </b>条记录</p>
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()">选择所有</el-checkbox>
                </div>
                <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="perPage" layout="total, sizes, prev, pager, next, jumper" :total="totalNumber">
                </el-pagination>
            </div>
            <!-- 表格分页 end-->
        </div>
        <!-- 质检项列表 end-->
        <!-- 配置变更确认 begin-->
        <el-dialog title="质检规则配置确认" :visible.sync="dialogConfigCheckItem" :close-on-click-modal="false">
            <el-form label-width="120px" class="demo-dynamic" :model="configChangeData" ref="confirmConfigChangeData">
                <el-form-item label="选中质检项" prop="checkItemIDS">
                    <el-input type="textarea" readonly placeholder="请选择该环节要应用的质检项" :autosize="{ minRows: 5, maxRows: 5}" v-model="configChangeData.checkItemIDS"></el-input>
                </el-form-item>
                <el-form-item label="新增检查项：">
                    <el-input type="textarea" readonly :autosize="{ minRows: 2, maxRows: 5}" v-model="configChangeData.addItemIDS"></el-input>
                </el-form-item>
                <el-form-item label="取消检查项：">
                    <el-input type="textarea" readonly :autosize="{ minRows: 2, maxRows: 5}" v-model="configChangeData.cancelItemIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">提示：已选择<b>{{configChangeData.selectItemsIDS.length}}</b>条记录；新增选择<b>{{configChangeData.addItemIDSArr.length}}</b>条；取消选择<b>{{configChangeData.cancelItemIDSArr.length}}</b>条</p>
                <el-form-item>
                    <el-button type="primary" @click="submitConfirmConfigForm()">确定</el-button>
                    <el-button @click="dialogConfigCheckItem = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 配置变更确认 end-->
        <!-- 编辑质检项 begin-->
        <el-dialog title="编辑质检项" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form ref="inCheckItem" :model="inCheckItem" label-width="140px" class="demo-dynamic">
                <el-form-item label="质检项编号">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inCheckItem.rule_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检要素">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inCheckItem.qc_element" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检类型" required>
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inCheckItem.is_error" placeholder="请选择" size="medium">
                            <el-option value='1' label="必修"></el-option>
                            <el-option value='2' label="待查"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="目标用户" prop="target_user" :rules="{required: true, message: '目标用户不能为空', trigger: 'blur'}"> -->
                <el-form-item label="目标用户" required>
                    <!-- <el-col :span="16"><el-input size="medium" v-model="inCheckItem.target_user"></el-input></el-col> -->
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inCheckItem.target_user" placeholder="请选择" size="medium">
                            <el-option value='生产' label="生产"></el-option>
                            <el-option value='研发' label="研发"></el-option>
                            <el-option value='工艺' label="工艺"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检要求">
                    <el-col :span="22">
                        <el-input size="medium" v-model="inCheckItem.brief" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检方法">
                    <el-col :span="22">
                        <el-input format size="medium" v-model="inCheckItem.description" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="核心参数">
                    <el-col :span="16">
                        <el-input size="medium" clearable v-model="inCheckItem.core_parameter" placeholder="请填写核心参数">
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="状态" required>
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inCheckItem.status" placeholder="请选择" size="medium">
                            <el-option value='1' label="有效"></el-option>
                            <el-option value='2' label="无效"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检项创建时间">
                    <el-col :span="18">
                        <el-date-picker format type="datetime" size="medium" v-model="inCheckItem.createtime" disabled style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditForm('inCheckItem')">确定</el-button>
                    <el-button @click="dialogEditVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑质检项 end-->
        <!-- 质检项列表 end-->
        <!-- 配置变更确认 begin-->
        <el-dialog title="质检规则配置确认" :visible.sync="dialogConfigCheckItem" :close-on-click-modal="false">
            <el-form label-width="120px" class="demo-dynamic" :model="configChangeData" ref="confirmConfigChangeData">
                <el-form-item label="选中质检项" prop="checkItemIDS">
                    <el-input type="textarea" readonly placeholder="请选择该环节要应用的质检项" :autosize="{ minRows: 5, maxRows: 5}" v-model="configChangeData.checkItemIDS"></el-input>
                </el-form-item>
                <el-form-item label="新增检查项：">
                    <el-input type="textarea" readonly :autosize="{ minRows: 2, maxRows: 5}" v-model="configChangeData.addItemIDS"></el-input>
                </el-form-item>
                <el-form-item label="取消检查项：">
                    <el-input type="textarea" readonly :autosize="{ minRows: 2, maxRows: 5}" v-model="configChangeData.cancelItemIDS"></el-input>
                </el-form-item>
                <p class="tipInfo">
                    提示：已选择
                    <b>{{configChangeData.selectItemsIDS.length}}</b>条记录；新增选择
                    <b>{{configChangeData.addItemIDSArr.length}}</b>条；取消选择
                    <b>{{configChangeData.cancelItemIDSArr.length}}</b>条
                </p>
                <el-form-item>
                    <el-button type="primary" @click="submitConfirmConfigForm()">确定</el-button>
                    <el-button @click="dialogConfigCheckItem = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 配置变更确认 end-->
        <!-- 编辑质检项 begin-->
        <el-dialog title="编辑质检项" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form ref="inCheckItem" :model="inCheckItem" label-width="140px" class="demo-dynamic">
                <el-form-item label="质检项编号">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inCheckItem.rule_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检要素">
                    <el-col :span="16">
                        <el-input size="medium" v-model="inCheckItem.qc_element" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检类型" required>
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inCheckItem.is_error" placeholder="请选择" size="medium">
                            <el-option value="1" label="必修"></el-option>
                            <el-option value="2" label="待查"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="目标用户" prop="target_user" :rules="{required: true, message: '目标用户不能为空', trigger: 'blur'}"> -->
                <el-form-item label="目标用户" required>
                    <!-- <el-col :span="16"><el-input size="medium" v-model="inCheckItem.target_user"></el-input></el-col> -->
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inCheckItem.target_user" placeholder="请选择" size="medium">
                            <el-option value="生产" label="生产"></el-option>
                            <el-option value="研发" label="研发"></el-option>
                            <el-option value="工艺" label="工艺"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检要求">
                    <el-col :span="22">
                        <el-input size="medium" v-model="inCheckItem.brief"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检方法">
                    <el-col :span="22">
                        <el-input format size="medium" v-model="inCheckItem.description"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="核心参数">
                    <el-col :span="16">
                        <el-input size="medium" clearable v-model="inCheckItem.core_parameter" placeholder="请填写核心参数"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="状态" required>
                    <el-col :span="7">
                        <el-select style="float: left" v-model="inCheckItem.status" placeholder="请选择" size="medium">
                            <el-option value="1" label="有效"></el-option>
                            <el-option value="2" label="无效"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检项创建时间">
                    <el-col :span="18">
                        <el-date-picker format type="datetime" size="medium" v-model="inCheckItem.createtime" disabled style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditForm('inCheckItem')">确定</el-button>
                    <el-button @click="dialogEditVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="批量配置" class="batchConfig" :visible.sync="batchConfig" center :close-on-click-modal="false">
            <div class="batchConfigView">
                <div class="batchConfigViewLeft">
                    <div class="batchConfigViewItem">
                        <span class="align-right">
                            <span class="start">*</span>源主项目：
                        </span>
                        <selectMainProject @selectChange="batchConfigDatas.src_project_id = $event" :clearable="false">
                        </selectMainProject>
                    </div>
                    <div class="batchConfigViewItem">
                        <span class="align-right">
                            <span class="start">*</span>选择环节：
                        </span>
                        <el-select size="medium" v-model="batchConfigDatas.src_segment">
                            <el-option value="130" label="基础要素作业"></el-option>
                            <el-option value="132" label="基础要素接边"></el-option>
                            <el-option value="134" label="高阶要素作业"></el-option>
                            <el-option value="136" label="高阶要素接边"></el-option>
                            <el-option value="138" label="回库接边"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="batchConfigViewCenter">
                    <i class="el-icon-back"></i>
                </div>
                <div class="batchConfigViewRight">
                    <div class="batchConfigViewItem">
                        <span class="align-right">
                            <span class="start">*</span>目标主项目：
                        </span>
                        <selectMainProject @selectChange="batchConfigDatas.dst_project_id = $event" :clearable="false">
                        </selectMainProject>
                    </div>
                    <div class="batchConfigViewItem">
                        <span class="align-right">
                            <span class="start">*</span>选择环节：
                        </span>
                        <el-select size="medium" v-model="batchConfigDatas.dst_segment">
                            <el-option value="130" label="基础要素作业"></el-option>
                            <el-option value="132" label="基础要素接边"></el-option>
                            <el-option value="134" label="高阶要素作业"></el-option>
                            <el-option value="136" label="高阶要素接边"></el-option>
                            <el-option value="138" label="回库接边"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="batchConfigEnter" style="margin-right:30px">确定</el-button>
                <el-button @click="batchConfig = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 编辑质检项 end-->
        <!-- 导入配置  开始 -->
        <el-dialog class="importCsv" :title="importCsvViewTitle" :visible.sync="importCsvView" center :close-on-click-modal="false">
            <el-upload class="upload-demo" drag :limit="1" :on-exceed="handleExceed" :before-upload="beforeUploadSourceFile" accept=".csv" :on-remove="removeFile" :file-list="sourceFileList" action>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传csv文件，且文件大小不超过1M</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="importQcRule()" style="margin-right:30px">确定</el-button>
                <el-button @click="importCsvView = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 导入配置  结束 -->
    </div>
</template>

<script>
import subLibraryList from "@/components/daqian_subLibraryList.vue";
import CSV from "comma-separated-values";
import selectMainProject from "@/components/daqian_selectMainProject.vue";
import { alertInfo, inputCheck, messageInfo, validateData, trim, showDataSet } from "@/utils/daqian_tools";
export default {
    components: {
        subLibraryList,
        selectMainProject
    },
    data() {
        return {
            user_permission:
                sessionStorage.user_permission == "1" || sessionStorage.user_permission == "3" ? true : false,
            formHeight: this.global.formHeight,
            accessDisabled: false,
            search: {
                user_id: sessionStorage.userid,
                selectConfigType: "1",
                selectSection: "2",
                mainProjectID: "0",
                sub_project_id: 0,
                checkItemID: "",
                checkItemBriefDescribe: "",
                checkFlag: "",
                is_error: "",
                sort_field_name: "rule_id desc",
                qc_element: "",
                target_user: "",
                query_or_export_data: 12,
                qc_rule_version: ""
            },
            searchDatas: {},
            perPage: 10,
            currentPage: 1,
            priorPage: 1,
            totalNumber: 0,
            checkRuleConfigData: [],
            multipleCheckItemSelection: [],
            loading: true,
            emptyText: "查询中",
            dialogConfigCheckItem: false,
            editable: false,
            btnClickable: false,
            configChangeData: {
                mainProjectID: "0",
                checkItemIDS: "",
                addItemIDS: "无",
                cancelItemIDS: "无",
                addItemIDSArr: [],
                cancelItemIDSArr: [],
                selectItemsIDS: [],
                postCheckItemIDS: []
            },
            fieldRange: {
                qc_element: [],
                target_user: []
            },
            inCheckItem: [],
            currentSearchMainProjectID: "0",
            dialogEditVisible: false,
            batchConfig: false,
            batchConfigDatas: {
                user_id: sessionStorage.userid,
                src_project_id: "",
                src_segment: "",
                dst_project_id: "",
                dst_segment: ""
            },
            importCsvView: false,
            sourceFileList: [],
            collapseFlag: false,
            selectNumber: 0,
            selectAllFlag: false,
            allTableData: [],
            csv_data: [],
            importCsvViewTitle: "",
            QcRuleVersionData: []
        };
    },
    computed: {
        tableData: function() {
            if (this.checkRuleConfigData) {
                for (var val of this.checkRuleConfigData) {
                    if (val.status == "1") {
                        val.show_status = "有效";
                    } else if (val.status == "2") {
                        val.show_status = "无效";
                    }
                    if (val.is_error == "1") {
                        val.show_is_error = "必修";
                    } else if (val.is_error == "2") {
                        val.show_is_error = "待查";
                    }
                    if (val.import_type == "1") {
                        val.show_import_type = "新增";
                    } else if (val.import_type == "2") {
                        val.show_import_type = "优化";
                    }
                    val.show_operation_user = showDataSet(val.update_user_id, val.update_user_name);
                }
                return this.checkRuleConfigData;
            }
        }
    },
    created() {
        this.searchcheckRuleConfig();
        this.accessDisabled = eval(sessionStorage.roteAuthotity);
        this.queryFieldRange();
        this.queryQcRuleVersionData();
    },
    updated() {
        this.$refs.checkRuleConfigtable.clearSelection();
        var tmpSelectData = this.multipleCheckItemSelection[this.currentPage - 1];
        if (tmpSelectData) {
            let arr = JSON.parse(JSON.stringify(tmpSelectData));
            for (var sel of tmpSelectData) {
                for (let i in this.tableData) {
                    if (JSON.stringify(sel) === JSON.stringify(this.tableData[i])) {
                        this.$refs.checkRuleConfigtable.toggleRowSelection(this.tableData[i]);
                    }
                }
            }
            this.multipleCheckItemSelection[this.currentPage - 1] = arr;
        }
    },
    methods: {
        selectConfigTypeChange: function() {
            this.onRefresh();
        },
        selectSectionChange: function() {
            this.searchcheckRuleConfig();
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
                }
            });
        },
        searchcheckRuleConfig: function(arg) {
            this.emptyText = "查询中";
            this.configChangeData.mainProjectID = this.search.mainProjectID;
            this.currentSearchMainProjectID = this.search.mainProjectID;
            var querycheckRuleConfigData = {
                user_id: sessionStorage.userid,
                project_id: this.search.selectConfigType != "2" ? "0" : this.search.mainProjectID,
                sub_project_id: 0,
                handle_segment: this.search.selectSection,
                check_flag: this.search.checkFlag,
                brief: this.search.checkItemBriefDescribe,
                rule_id_list: this.search.checkItemID,
                sort_field_name: this.search.sort_field_name,
                qc_element: this.search.qc_element,
                target_user: this.search.target_user,
                qc_rule_version: this.search.qc_rule_version,
                is_error: this.search.is_error,
                query_or_export_data: 0,
                page_index: this.currentPage,
                page_size: this.perPage,
                return_all: arg && arg.return_all ? arg.return_all : 2
            };
            if (!(arg && arg.loading)) {
                if (!(arg && arg.return_all)) {
                    this.checkRuleConfigData = [];
                    this.totalNumber = 0;
                    this.btnClickable = false;
                    this.editable = false;
                    this.searchDatas = querycheckRuleConfigData;
                }
                this.currentPage = 1;
                this.multipleCheckItemSelection = [];
                this.loading = true;
            }
            this.searchDatas.return_all = arg && arg.return_all ? arg.return_all : 2;
            this.searchDatas.page_index = this.currentPage;
            this.searchDatas.page_size = this.perPage;
            this.$http.post("/api/query_quality_check_rule", this.searchDatas).then(
                response => {
                    this.loading = false;
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0 || data.errno === 7) {
                        if (data.errno === 7) {
                            this.emptyText = "未查询到符合条件的数据";
                        } else {
                            this.totalNumber = Number(data.data.rule_number);
                            if (this.totalNumber == 0) {
                                this.checkRuleConfigData = [];
                                this.emptyText = "未查询到符合条件的数据";
                            } else {
                                this.emptyText = "加载中";
                            }
                            if (arg && arg.return_all) {
                                var pagesNumber = Math.ceil(this.totalNumber / this.perPage);
                                for (var i = 0; i < pagesNumber; i++) {
                                    this.allTableData[i] = data.data.quality_check_rule_info.slice(
                                        i * this.perPage,
                                        (i + 1) * this.perPage
                                    );
                                }
                                if (this.allTableData.length > 0) {
                                    this.checkRuleConfigData = this.allTableData[0];
                                }
                                this.selectItemInit(true);
                                return;
                            } else {
                                this.checkRuleConfigData = data.data.quality_check_rule_info;
                            }
                            this.selectItemInit();
                        }
                    } else {
                        this.checkRuleConfigData = [];
                        this.emptyText = "查询失败";
                    }
                },
                response => {
                    // 响应错误回调
                    this.checkRuleConfigData = [];
                    this.loading = false;
                    this.emptyText = "查询失败";
                }
            );
        },
        onSearch: function(event) {
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.searchcheckRuleConfig(event);
        },
        onRefresh: function(event) {
            this.selectNumber = 0;
            this.selectAllFlag = false;
            this.allTableData = [];
            this.$refs.selectMainProject.reset();
            if (this.search.selectConfigType == "2") {
                this.search.selectSection = "130";
                // this.search.mainProjectID = "2";
            } else {
                this.search.selectSection = "2";
                // this.search.mainProjectID = "0";
            }
            this.search.checkItemBriefDescribe = "";
            this.search.checkFlag = "";
            this.search.checkItemID = "";
            this.search.qc_element = "";
            this.search.target_user = "";
            this.search.is_error = "";
            this.btnClickable = false;
            this.search.qc_rule_version = "";
            this.editable = false;
            this.$refs.checkRuleConfigtable.clearSort();
            this.search.sort_field_name = "rule_id desc";
            this.searchcheckRuleConfig();
        },
        //查询输入框格式校验
        formatSearchInput: function() {
            this.search.checkItemID = inputCheck(this, this.search.checkItemID, 5);
        },
        sortTable: function(val) {
            if (val.order === "descending") {
                this.search.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.search.sort_field_name = val.prop + " asc";
            } else {
                this.search.sort_field_name = "rule_id desc";
            }
            this.onSearch();
        },
        checkboxInit: function(row, index) {
            if (this.editable) {
                return true; //可勾选
            } else {
                return false; //不可勾选
            }
        },
        selectItemInit: function(arg) {
            if (arg) {
                var pagesNumber = Math.ceil(this.totalNumber / this.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    this.multipleCheckItemSelection[i] = [];
                }
                for (var i in this.allTableData) {
                    for (let index in this.allTableData[i]) {
                        var page = Math.floor(index / this.perPage);
                        var InPageIndex = index % this.perPage;
                        if (this.allTableData[i][index].check_flag == 1) {
                            this.multipleCheckItemSelection[i].push(this.allTableData[i][index]);
                        }
                    }
                }
                this.priorPage = 0;
            } else {
                let arr = [];
                for (var index in this.checkRuleConfigData) {
                    if (this.checkRuleConfigData[index].check_flag == 1) {
                        arr.push(this.checkRuleConfigData[index]);
                    }
                }
                this.multipleCheckItemSelection[this.currentPage - 1] = arr;
            }
            this.getSelectDatas();
        },
        configRuleCheckInfo: function() {
            this.searchcheckRuleConfig({
                return_all: 1
            });
            this.editable = true;
            this.btnClickable = true;
        },
        batchConfigRuleCheck: function() {
            this.batchConfig = true;
        },
        cancelSubmitConfigCheckItemInfo: function() {
            this.dialogConfigCheckItem = false;
            this.btnClickable = false;
            this.editable = false;
        },
        submitConfigCheckItemInfo: function() {
            this.dialogConfigCheckItem = true;
            var checkItemIDS = "";
            this.configChangeData.postCheckItemIDS = [];
            this.configChangeData.selectItemsIDS = [];
            this.configChangeData.addItemIDS = "无";
            this.configChangeData.cancelItemIDS = "无";
            this.configChangeData.addItemIDSArr = [];
            this.configChangeData.cancelItemIDSArr = [];
            for (var val of this.multipleCheckItemSelection) {
                for (var item of val) {
                    this.configChangeData.postCheckItemIDS.push({
                        rule_id: item.rule_id, // 质检项ID
                        check_flag: 1,
                        target_user: item.target_user,
                        is_error: item.is_error,
                        core_parameter: item.core_parameter,
                        status: item.status
                    });
                    this.configChangeData.selectItemsIDS.push(item.rule_id);
                    if (checkItemIDS) {
                        checkItemIDS = checkItemIDS + "；" + item.rule_id;
                    } else {
                        checkItemIDS = item.rule_id;
                    }
                }
            }
            this.configChangeData.checkItemIDS = checkItemIDS;
            for (var val of this.allTableData) {
                for (var rule of val) {
                    var index = this.configChangeData.selectItemsIDS.indexOf(rule.rule_id);
                    if (index == -1) {
                        this.configChangeData.postCheckItemIDS.push({
                            rule_id: rule.rule_id, // 质检项ID
                            check_flag: 2,
                            target_user: rule.target_user,
                            is_error: rule.is_error,
                            core_parameter: rule.core_parameter,
                            status: rule.status
                        });
                        if (rule.check_flag == 1) {
                            this.configChangeData.cancelItemIDSArr.push(rule.rule_id);
                        }
                    } else {
                        if (rule.check_flag == 2) {
                            this.configChangeData.addItemIDSArr.push(rule.rule_id);
                        }
                    }
                }
            }
            if (this.configChangeData.cancelItemIDSArr.length) {
                this.configChangeData.cancelItemIDS = this.configChangeData.cancelItemIDSArr.join("；");
            }
            if (this.configChangeData.addItemIDSArr.length) {
                this.configChangeData.addItemIDS = this.configChangeData.addItemIDSArr.join("；");
            }
        },
        submitConfirmConfigForm: function() {
            this.$refs["confirmConfigChangeData"].validate(valid => {
                if (valid) {
                    var postConfirmConfigData = {
                        user_id: sessionStorage.userid,
                        project_id: this.search.selectConfigType != "2" ? "0" : this.configChangeData.mainProjectID,
                        sub_project_id: 0,
                        handle_segment: this.search.selectSection,
                        quality_check_rule_info: this.configChangeData.postCheckItemIDS
                    };
                    this.$http.post("/api/modify_quality_check_rule", postConfirmConfigData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "质检规则配置成功", () => {
                                this.dialogConfigCheckItem = false;
                                setTimeout(() => {
                                    this.searchcheckRuleConfig();
                                });
                            });
                        } else {
                            alertInfo(this, "error", "质检规则配置失败，" + data.msg);
                        }
                    });
                }
            });
        },
        checkRuleConfigSelectionChange: function(val) {
            this.multipleCheckItemSelection[this.currentPage - 1] = val;
            var pagesNumber = Math.ceil(this.totalNumber / this.perPage);
            for (var i = 0; i < pagesNumber; i++) {
                if (i == this.currentPage - 1) {
                    this.multipleCheckItemSelection[i] = val;
                } else {
                    if (typeof this.multipleCheckItemSelection[i] == "undefined") {
                        this.multipleCheckItemSelection[i] = [];
                    }
                }
            }
            this.getSelectDatas();
        },
        pageSizeChange: function(val) {
            this.multipleCheckItemSelection = [];
            this.perPage = val;
            this.onSearch({
                loading: true
            });
        },
        pageCurrentChange: function(val) {
            this.priorPage = this.currentPage;
            this.currentPage = val;
            if (this.allTableData.length > 0) {
                this.checkRuleConfigData = this.allTableData[val - 1];
                // this.selectItemInit();
                return;
            }
            this.searchcheckRuleConfig({
                loading: true
            });
        },
        getSelectDatas: function() {
            let num = 0;
            for (let index in this.multipleCheckItemSelection) {
                num += this.multipleCheckItemSelection[index].length;
            }
            this.selectNumber = num;
            this.selectAllFlag = this.selectNumber == this.totalNumber;
        },
        selectAll: function() {
            if (this.selectAllFlag) {
                this.multipleCheckItemSelection = Object.assign([], this.multipleCheckItemSelection, this.allTableData);
                // this.searchcheckRuleConfig({ return_all: 1 });
            } else {
                this.multipleCheckItemSelection = [];
                this.$refs.checkRuleConfigtable.clearSelection();
            }
            this.getSelectDatas();
        },
        queryFieldRange: function() {
            var queryFieldRangeData = {
                field_type: 1
            };
            this.$http.post("/api/query_field_range", queryFieldRangeData).then(response => {
                response = response.data.data;
                if (response.errno === 0) {
                    this.fieldRange.qc_element = response.data.qc_element;
                    this.fieldRange.target_user = response.data.target_user;
                }
            });
        },
        editCheckRuleInfo: function(index) {
            this.inCheckItem = JSON.parse(JSON.stringify(this.tableData[index]));
            this.dialogEditVisible = true;
        },
        submitEditForm: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let checkEditInfo = [
                        {
                            rule_id: this.inCheckItem.rule_id,
                            check_flag: this.inCheckItem.check_flag,
                            is_error: this.inCheckItem.is_error,
                            target_user: this.inCheckItem.target_user,
                            status: this.inCheckItem.status,
                            core_parameter: this.inCheckItem.core_parameter,
                            brief: this.inCheckItem.brief,
                            description: this.inCheckItem.description
                        }
                    ];
                    var postConfirmConfigData = {
                        user_id: sessionStorage.userid,
                        project_id: this.search.selectConfigType != "2" ? "0" : this.currentSearchMainProjectID,
                        sub_project_id: 0,
                        handle_segment: this.search.selectSection,
                        quality_check_rule_info: checkEditInfo
                    };
                    this.$http.post("/api/modify_quality_check_rule", postConfirmConfigData).then(response => {
                        response = response.body;
                        var data = response.data;
                        if (data.errno === 0) {
                            alertInfo(this, "success", "质检规则编辑成功", () => {
                                this.dialogEditVisible = false;
                                setTimeout(() => {
                                    this.searchcheckRuleConfig();
                                    this.queryFieldRange();
                                });
                            });
                        } else {
                            alertInfo(this, "error", "质检规则编辑失败，" + data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
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
                this.csv_data = data;
                if (!data) {
                    messageInfo(this, "error", "CSV 文件解析失败", 1500);
                    return false;
                }
                if (data.length === 0) {
                    messageInfo(this, "error", "数据文件不包含数据", 1500);
                } else {
                    //   messageInfo(
                    //     this,
                    //     "sussess",
                    //     "该csv文件共上传" + (Number(data.length) - 2) + "个配置",
                    //     3000
                    //   );
                }
            };
            return false;
        },
        parseCSV: function(str) {
            //   str = str.replace(/[，]/g, ",");
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
            this.csv_data = [];
        },
        importQcRule: function() {
            //导入质检
            if (this.sourceFileList.length == 0) {
                messageInfo(this, "warning", "请选择上传文件", 2000);
                return;
            } else if (this.csv_data.length == 0) {
                messageInfo(this, "warning", "文件信息为空", 2000);
                return;
            }
            let postConfig = {
                user_id: sessionStorage.userid,
                import: this.csv_data
            };
            //import_qc_rule_option 质检项配置
            //import_qc_rule 质检项
            let apiName = this.importCsvViewTitle == "导入质检项" ? "import_qc_rule" : "import_qc_rule_option";
            let name = this.importCsvViewTitle == "导入质检项" ? "质检项" : "质检项配置";
            this.$http.post("/api/" + apiName, postConfig).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(
                        this,
                        "success",
                        `共计<b> ${
                            data.data.qc_rule_count ? data.data.qc_rule_count : data.data.qc_rule_option_count
                        } </b>个${name}，导入成功`,
                        () => {
                            this.importCsvView = false;
                            this.sourceFileList = [];
                            this.csv_data = [];
                            this.onSearch();
                        }
                    );
                } else {
                    alertInfo(this, "error", data.msg);
                }
            });
        },
        importDropdown: function(val) {
            this.importCsvViewTitle = val;
            this.importCsvView = true;
        },
        //批量复制
        batchConfigEnter: function(event) {
            if (this.batchConfigDatas.src_project_id == "") {
                messageInfo(this, "warning", "请选择源主项目", 2000);
                return;
            } else if (this.batchConfigDatas.dst_project_id == "") {
                messageInfo(this, "warning", "请选择目标主项目", 2000);
                return;
            } else if (this.batchConfigDatas.src_segment == "" || this.batchConfigDatas.dst_segment == "") {
                messageInfo(this, "warning", "请选择环节", 2000);
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: "正在配置...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http.post("/api/qc_rule_option_duplicate", this.batchConfigDatas).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(
                        this,
                        "success",
                        `共计<b> ${data.data.qc_rule_option_count} </b>个配置，批量配置成功`,
                        () => {
                            this.batchConfig = false;
                            this.batchConfigDatas.src_segment = "";
                            this.batchConfigDatas.dst_segment = "";
                            this.batchConfigDatas.src_project_id = "";
                            this.batchConfigDatas.dst_project_id = "";
                            setTimeout(() => {
                                this.onSearch();
                            });
                        }
                    );
                    loading.close();
                } else {
                    alertInfo(this, "error", "批量配置失败，" + data.msg);
                    loading.close();
                }
            });
        }
    }
};
</script>
<style lang="scss">
.checkRuleConfig {
    .batchConfig {
        .el-dialog {
            width: 780px;
        }
    }

    .importDropdown {
        button {
            padding: 10px 14px;
        }
    }

    .importCsv {
        .el-dialog {
            width: 450px;

            .upload-demo {
                width: 350px;
                margin: auto;
            }
        }
    }
}
</style>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;

.checkRuleConfig {
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
        min-width: 93px;
        display: inline-block;

        .start {
            color: red;
        }
    }

    .cascader-select-style {
        width: 300px;
    }

    .input-style {
        display: inline-block;
        margin-right: 82px;
        width: 607px;
    }

    .input-style-1 {
        display: inline-block;
        width: 400px;
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
            margin: 0px auto;
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

    .tipInfo {
        text-align: left;
        width: 100%;
        margin: -10px 0 0 120px;
    }

    .batchConfigView {
        display: flex;
        justify-content: center;
        align-items: center;

        .batchConfigViewCenter {
            i {
                font-size: 30px;
                margin: 0 20px;
                margin-top: -20px;
                transform: rotate(180deg);
                color: #409efd;
            }
        }

        .batchConfigViewItem {
            margin-bottom: 20px;
        }
    }
}
</style>
