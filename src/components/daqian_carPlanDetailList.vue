<template>
    <div class="carPlanDetailList">
        <!-- 外业任务列表 begin-->
        <div class="table-div" v-show="notAllowInSection">
            <slot name="headPlate"></slot>
            <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="carPlanTable" border style="width: 100%" @select="carPlanSelectionChange" @select-all="SelectionAllChange" @sort-change="sortTable">
                <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
                <el-table-column fixed prop="car_day_id" label="车天编号" sortable="custom" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column fixed prop="storage_task_id" label="存储编号" show-overflow-tooltip min-width="80"></el-table-column>
                <!--<el-table-column fixed prop="" label="任务长度" sortable width="120"></el-table-column>-->
                <el-table-column fixed prop="city" label="城市" show-overflow-tooltip min-width="65"></el-table-column>
                <el-table-column prop="show_field_plan_name" label="所属外业计划" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="show_gp_status" label="挂盘状态" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column prop="show_field_qc_status" label="外业质检状态" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="show_field_plan_qc_status" label="外业计划质检状态" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column prop="show_calibration_status" label="标定参数状态" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="show_field_plan_coverage" label="计划覆盖度" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="base_station_id" label="基站编号" show-overflow-tooltip min-width="80"></el-table-column>
                <!--<el-table-column prop="" label="标定数据" width="100"></el-table-column>
                <el-table-column prop="" label="采集人" width="100"></el-table-column>-->
                <el-table-column prop="end_time" label="提交日期" sortable="custom" show-overflow-tooltip min-width="155"></el-table-column>
                <el-table-column prop="field_qc_end_time" label="外业质检时间" sortable="custom" show-overflow-tooltip min-width="160"></el-table-column>
                <el-table-column prop="field_plan_qc_end_time" label="外业计划审核时间" sortable="custom" show-overflow-tooltip min-width="175"></el-table-column>
                <el-table-column prop="data_number" label="实际公里数" show-overflow-tooltip min-width="95"></el-table-column>
                <el-table-column prop="description" label="任务详情" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column prop="return_sequence" label="打回次数" sortable="custom" show-overflow-tooltip min-width="105"></el-table-column>
                <el-table-column prop="return_reason" label="打回原因" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="return_solution" label="解决方案" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="show_return_segment" label="打回阶段" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="show_return_user_name" label="打回用户" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="return_time" label="打回时间" sortable="custom" show-overflow-tooltip min-width="155"></el-table-column>
                <el-table-column prop="classify_number" label="归类次数" sortable="custom" min-width="105">
                    <template slot-scope="scope">
                        <el-button @click="handleClassifyNumberClick(scope.row)" type="text" size="small">{{scope.row.classify_number}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="return_memo" label="打回备注" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="memo" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column fixed="right" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" :disabled="editDisabled" @click.native.prevent="editCarDay(scope.$index)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-div" v-show="!notAllowInSection">
            <div class="select-area">
                    <el-checkbox v-model="selectAllFlag" @change="selectAll()"><span class="select-number">全选</span></el-checkbox>
                    <span class="select-number">总共 <b>{{totalNumber}}</b> 条</span>
                    <span class="select-number">已选择<b> {{selectNumber}} </b>条记录</span>
                </div>
            <el-table :empty-text="emptyText" v-loading="loading" element-loading-text="拼命查询中" :max-height="formHeight" element-loading-spinner="el-icon-loading" element-loading-background="rgba(80, 80, 80, 0.8)" :data="tableData" ref="carPlanAllowInTable" border style="width: 100%" @select="carPlanSelectionChange" @select-all="carPlanSelectionChange" @sort-change="sortTable">
                <el-table-column fixed type="selection" width="55"></el-table-column>
                <el-table-column fixed prop="car_day_id" label="车天编号" show-overflow-tooltip width="180"></el-table-column>
                <el-table-column fixed prop="storage_task_id" label="存储编号" show-overflow-tooltip width="80"></el-table-column>
                <el-table-column prop="city" label="城市" show-overflow-tooltip width="65"></el-table-column>
                <el-table-column prop="show_field_plan_name" label="所属外业计划" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="show_sub_project_name" show-overflow-tooltip label="所属子项目" width="150"></el-table-column>
                <el-table-column prop="show_project_name" label="所属主项目" show-overflow-tooltip width="135"></el-table-column>
                <el-table-column prop="show_sub_project_process_type" show-overflow-tooltip label="项目类型" width="90"></el-table-column>
                <el-table-column prop="show_sub_project_type" show-overflow-tooltip label="流程类型" width="100"></el-table-column>
                <el-table-column prop="show_task_type" show-overflow-tooltip label="来源类型" width="120"></el-table-column>
                <el-table-column prop="show_handle_status" label="准入状态" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column prop="show_field_qc_status" label="外业质检状态" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="handle_host_name" label="准入处理机器" show-overflow-tooltip min-width="105"></el-table-column>
                <el-table-column prop="start_time" label="准入开始时间" sortable="custom" show-overflow-tooltip width="155"></el-table-column>
                <el-table-column prop="end_time" label="准入结束时间" sortable="custom" show-overflow-tooltip width="155"></el-table-column>
                <el-table-column prop="log_version" label="准入log版本" show-overflow-tooltip min-width="105"></el-table-column>
                <el-table-column prop="log_download_url" label="准入log下载地址" show-overflow-tooltip width="135"></el-table-column>
                <el-table-column prop="show_op_status" label="准入人工标记结果" show-overflow-tooltip min-width="135"></el-table-column>
                <el-table-column prop="op_date" label="准入标记时间" sortable="custom" show-overflow-tooltip min-width="155"></el-table-column>
                <el-table-column prop="show_op_user" label="准入标记用户" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="show_allow_out_handle_status" label="准出状态" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column prop="show_allow_out_op_status" label="准出人工标记结果" show-overflow-tooltip min-width="135"></el-table-column>
                <el-table-column prop="allow_out_op_date" label="准出标记时间" sortable="custom" show-overflow-tooltip min-width="155"></el-table-column>
                <el-table-column prop="classify_time" label="归类时间" sortable="custom" show-overflow-tooltip min-width="155"></el-table-column>
                <el-table-column prop="show_classify_user" label="归类用户" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="show_return_user_name" label="打回用户" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="return_sequence" label="打回次数" sortable="custom" show-overflow-tooltip min-width="105"></el-table-column>
                <el-table-column prop="return_time" label="打回时间" sortable="custom" show-overflow-tooltip min-width="155"></el-table-column>
                <el-table-column prop="return_reason" label="打回原因" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="return_solution" label="解决方案" show-overflow-tooltip min-width="100"></el-table-column>
                <!-- <el-table-column fixed="right" label="操作" width="80">
                    <template slot-scope="scope" v-if="!editDisabled">
                        <el-button type="text" size="small" :disabled="scope.row.handle_status == 6? false:true" @click.native.prevent="allowInMark(scope.$index)">标记</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>

        <!-- 表格分页 begin-->
        <div class="pagination-area">
            <el-pagination @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="filter.currentPage" :page-sizes="[10,20,50,100,1000]" background :page-size="filter.perPage" layout="total, sizes, prev, pager, next, jumper" :total="totalNumber">
            </el-pagination>
        </div>
        <!-- 表格分页 end-->
        <!--    外业任务列表 end-->

        <!-- 编辑外业任务 begin-->
        <el-dialog title="编辑外业任务" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form ref="inCarDay" :model="inCarDay" label-width="100px" class="demo-dynamic">
                <el-form-item label="任务名称">
                    <el-col :span="16">
                        <el-input v-model="inCarDay.car_day_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="任务长度" >
                        <el-col :span="16"><el-input disabled></el-input></el-col>
                    </el-form-item>-->
                <el-form-item label="所在城市">
                    <el-col :span="16">
                        <!--<el-input v-model="inCarDay.city" disabled></el-input>-->
                        <el-cascader style="float:left" :options="options" size="large" filterable v-model="edit.showCity" @change="editCityChange" :show-all-levels="false" placeholder="请选择城市"></el-cascader>
                    </el-col>
                </el-form-item>
                <el-form-item label="基站编号">
                    <el-col :span="16">
                        <el-input v-model="inCarDay.base_station_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="存储编号">
                    <el-col :span="16">
                        <el-input v-model="inCarDay.storage_task_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="标定数据">
                        <el-col :span="16"><el-input disabled></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="采集人">
                        <el-col :span="16"><el-input disabled></el-input></el-col>
                    </el-form-item>-->
                <el-form-item label="提交日期">
                    <el-col :span="18">
                        <el-date-picker format type="datetime" v-model="inCarDay.end_time" disabled placeholder="选择完成时间" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="实际公里数">
                    <el-col :span="16">
                        <el-input v-model="inCarDay.data_number" :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="任务详情">
                    <el-col :span="16">
                        <el-input v-model="inCarDay.description" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="挂盘状态">
                    <el-col :span="8">
                        <el-col :span="22">
                            <el-select style="float: left" disabled v-model="inCarDay.gp_status">
                                <el-option value="1" label="挂盘中"></el-option>
                                <el-option value="2" label="已完成"></el-option>
                                <el-option value="3" label="失败"></el-option>
                            </el-select>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" v-model="inCarDay.memo" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitEditForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inCarDay')">重置</el-button>-->
                    <el-button @click="dialogEditVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑外业任务 end-->
        <!-- 外业任务准入人工标记 begin-->
        <el-dialog title="外业任务准入人工标记" :visible.sync="dialogAllowInMarkVisible" :close-on-click-modal="false">
            <el-form ref="allowInMarkData" :model="allowInMarkData" label-width="100px" class="demo-dynamic">
                <p class="left-title">所属子项目：{{allowInMarkData.sub_project_name}}（{{allowInMarkData.sub_project_id}}）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;车天编号：{{allowInMarkData.carPlanID}}</p>
                <el-form-item label="标记结果" required>
                    <div style="float:left;display:inline-block;">
                        <el-radio v-model="allowInMarkData.allowInResult" label="2">通过</el-radio>
                        <el-radio v-model="allowInMarkData.allowInResult" label="3">作废</el-radio>
                        <el-radio v-model="allowInMarkData.allowInResult" label="4">替换</el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="标记原因">
                    <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" v-model="allowInMarkData.allowInReason" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="submitAllowInMarkForm()">确定</el-button>
                    <!--<el-button @click="resetForm('inCarDay')">重置</el-button>-->
                    <el-button @click="dialogAllowInMarkVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 外业任务准入人工标记 end-->
    </div>
</template>

<script>
import { trim, alertInfo, showDataSet } from "@/utils/daqian_tools";
import router from "@/router";
var cityData = require("@/common/citydata.json");
export default {
    props: {
        carPlanData: {
            type: Object
        },
        classifycarPlan: false,
        editDisabled: false,
        resetSelectionCarday: false,
        clearSort: false,
        loading: true,
        notAllowInSection: true,
        emptyText: ""
    },
    data() {
        return {
            formHeight: this.global.formHeight,
            filter: {
                perPage: 10,
                currentPage: 1
            },
            sort_field_name: "",
            totalNumber: 0,
            priorPage: 1,
            carPlanTable: [],
            multipleCarPlanSelection: [],
            CarPlanSelection: [],
            inCarDay: [],
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
            edit: {
                city: "",
                showCity: []
            },
            dialogEditVisible: false,
            options: cityData.children,
            dialogAllowInMarkVisible: false,
            allowInMarkData: {
                carPlanID: "",
                allowInResult: "2",
                allowInReason: ""
            },
            selectAllFlag: false,
            selectNumber: 0,
            allTableData: []
        };
    },
    watch: {
        resetSelectionCarday: function(val, oldval) {
            if (val) {
                this.multipleCarPlanSelection = [];
                this.filter.currentPage = 1;
                this.$emit("updateSelectCarPlan", this.multipleCarPlanSelection);
                this.$emit("updateMultipleSelectionStatus", false);
            }
        },
        clearSort: function(val, oldval) {
            if (val) {
                if (this.notAllowInSection) {
                    this.$refs.carPlanTable.clearSort();
                } else {
                    this.$refs.carPlanAllowInTable.clearSort();
                }
                this.$emit("updateClearSortStatus", false);
            }
        }
    },
    updated() {
        this.notAllowInSection
            ? this.$refs.carPlanTable.clearSelection()
            : this.$refs.carPlanAllowInTable.clearSelection();
        var tmpSelectData = this.multipleCarPlanSelection[this.filter.currentPage - 1];
        if (tmpSelectData) {
            let arr = JSON.parse(JSON.stringify(tmpSelectData));
            for (var sel of tmpSelectData) {
                for (let index in this.tableData) {
                    if (JSON.stringify(sel) === JSON.stringify(this.tableData[index])) {
                        if (this.notAllowInSection) {
                            this.$refs.carPlanTable.toggleRowSelection(this.tableData[index]);
                        } else {
                            this.$refs.carPlanAllowInTable.toggleRowSelection(this.tableData[index]);
                        }
                    }
                }
            }
            this.multipleCarPlanSelection[this.filter.currentPage - 1] = arr;
        }
         this.getSelectDatas();
    },
    computed: {
        tableData: function() {
            if (this.carPlanData.errno === 0) {
                if (this.notAllowInSection) {
                    if (this.carPlanData.data.gp_info) {
                        this.carPlanTable = this.carPlanData.data.gp_info;
                    }
                } else {
                    if (this.carPlanData.data.wy_allow_in_info_list) {
                        this.carPlanTable = this.carPlanData.data.wy_allow_in_info_list;
                    }
                }
              
                this.totalNumber = Number(this.carPlanData.data.total_number);
                for (var val of this.carPlanTable) {
                    /*if (val.handle_segment == '1') {
                            val.show_handle_segment = "外业任务挂盘";
                        } else if (val.handle_segment == '2') {
                            val.show_handle_segment = "外业任务准入";
                        }*/
                    if (this.notAllowInSection) {
                        if (val.gp_status == "1") {
                            val.show_gp_status = "挂盘中";
                        } else if (val.gp_status === "2") {
                            val.show_gp_status = "已完成";
                        } else if (val.gp_status === "3") {
                            val.show_gp_status = "失败";
                        }

                        if (val.calibration_status == "1") {
                            val.show_calibration_status = "未开始";
                        } else if (val.calibration_status == "4") {
                            val.show_calibration_status = "上传完成";
                        }

                        if (val.field_qc_status == "1") {
                            val.show_field_qc_status = "未开始";
                        } else if (val.field_qc_status == "4") {
                            val.show_field_qc_status = "合格";
                        } else if (val.field_qc_status == "6") {
                            val.show_field_qc_status = "作废";
                        } else if (val.field_qc_status == "7") {
                            val.show_field_qc_status = "打回";
                        } else if (val.field_qc_status == "8") {
                            val.show_field_qc_status = "复审中";
                        }

                        if (val.field_plan_qc_status == "1") {
                            val.show_field_plan_qc_status = "待审核";
                        } else if (val.field_plan_qc_status == "3") {
                            val.show_field_plan_qc_status = "审核中";
                        } else if (val.field_plan_qc_status == "4") {
                            val.show_field_plan_qc_status = "审核完成";
                        }
                        if (val.field_plan_coverage) {
                            val.show_field_plan_coverage = (val.field_plan_coverage * 100).toFixed(2) + "%";
                        }

                        if (val.return_segment == "2") {
                            val.show_return_segment = "外业准入";
                        } else if (val.return_segment == "12") {
                            val.show_return_segment = "前预处理准出";
                        }

                        val.show_field_plan_name = showDataSet(val.field_plan_id, val.field_plan_name);

                        val.show_return_user_name = showDataSet(val.return_user_id, val.return_user_name);
                    } else {
                        val.show_project_name = showDataSet(val.project_id, val.project_name);
                        val.show_return_user_name = showDataSet(val.return_user_id, val.return_user_name);
                        val.show_field_plan_name = showDataSet(val.field_plan_id, val.field_plan_name);
                        if (val.field_qc_status == "1") {
                            val.show_field_qc_status = "未开始";
                        } else if (val.field_qc_status == "4") {
                            val.show_field_qc_status = "合格";
                        } else if (val.field_qc_status == "6") {
                            val.show_field_qc_status = "作废";
                        } else if (val.field_qc_status == "7") {
                            val.show_field_qc_status = "打回";
                        } else if (val.field_qc_status == "8") {
                            val.show_field_qc_status = "复审中";
                        }
                        val.show_sub_project_name = showDataSet(val.sub_project_id, val.sub_project_name);
                        val.show_op_user = showDataSet(val.op_user_id, val.op_user_name);
                        val.show_classify_user = showDataSet(val.classify_user_id, val.classify_user_name);
                        val.show_source_sub_project_name = showDataSet(
                            val.source_sub_project_id,
                            val.source_sub_project_name
                        );

                        val.show_sub_project_type = this.subProjectAllTypes[val.sub_project_type];
                        val.show_sub_project_process_type = this.subProjectProcessAllTypes[
                            val.sub_project_process_type
                        ];
                        if (val.task_type === "2") {
                            val.show_task_type = "新增";
                        } else if (val.task_type === "1") {
                            val.show_task_type = "继承";
                        }
                        if (val.handle_status == "1") {
                            val.show_handle_status = "未开始";
                        } else if (val.handle_status == "2") {
                            val.show_handle_status = "排队中";
                        } else if (val.handle_status == "3") {
                            val.show_handle_status = "准入中";
                        } else if (val.handle_status == "4") {
                            val.show_handle_status = "通过";
                        } else if (val.handle_status == "5") {
                            if (val.fail_description) {
                                val.show_handle_status = "失败，原因：" + val.fail_description;
                            } else {
                                val.show_handle_status = "失败，原因：无";
                            }
                        } else if (val.handle_status == "6") {
                            if (val.fail_description) {
                                val.show_handle_status = "不通过，原因：" + val.fail_description;
                            } else {
                                val.show_handle_status = "不通过，原因：无";
                            }
                        }
                        if (val.allow_out_handle_status == "1") {
                            val.show_allow_out_handle_status = "未开始";
                        } else if (val.allow_out_handle_status == "2") {
                            val.show_allow_out_handle_status = "排队中";
                        } else if (val.allow_out_handle_status == "3") {
                            val.show_allow_out_handle_status = "准出中";
                        } else if (val.allow_out_handle_status == "4") {
                            val.show_allow_out_handle_status = "通过";
                        } else if (val.allow_out_handle_status == "5") {
                            if (val.fail_description) {
                                val.show_allow_out_handle_status = "失败，原因：" + val.fail_description;
                            } else {
                                val.show_allow_out_handle_status = "失败，原因：无";
                            }
                        } else if (val.allow_out_handle_status == "6") {
                            if (val.fail_description) {
                                val.show_allow_out_handle_status = "不通过，原因：" + val.fail_description;
                            } else {
                                val.show_allow_out_handle_status = "不通过，原因：无";
                            }
                        }
                        if (val.op_status == "1") {
                            val.show_op_status = "未标记";
                        } else if (val.op_status == "2") {
                            if (val.op_remark) {
                                val.show_op_status = "通过，原因：" + val.op_remark;
                            } else {
                                val.show_op_status = "通过，原因：无";
                            }
                        } else if (val.op_status == "3") {
                            if (val.op_remark) {
                                val.show_op_status = "作废，原因：" + val.op_remark;
                            } else {
                                val.show_op_status = "作废，原因：无";
                            }
                        } else if (val.op_status == "4") {
                            if (val.op_remark) {
                                val.show_op_status = "替换，原因：" + val.op_remark;
                            } else {
                                val.show_op_status = "替换，原因：无";
                            }
                        }
                        if (val.allow_out_op_status == "1") {
                            val.show_allow_out_op_status = "未标记";
                        } else if (val.allow_out_op_status == "2") {
                            if (val.allow_out_op_remark) {
                                val.show_allow_out_op_status = "通过，原因：" + val.allow_out_op_remark;
                            } else {
                                val.show_allow_out_op_status = "通过，原因：无";
                            }
                        } else if (val.allow_out_op_status == "3") {
                            if (val.allow_out_op_remark) {
                                val.show_allow_out_op_status = "作废，原因：" + val.allow_out_op_remark;
                            } else {
                                val.show_allow_out_op_status = "作废，原因：无";
                            }
                        } else if (val.allow_out_op_status == "4") {
                            if (val.allow_out_op_remark) {
                                val.show_allow_out_op_status = "替换，原因：" + val.allow_out_op_remark;
                            } else {
                                val.show_allow_out_op_status = "替换，原因：无";
                            }
                        } else if (val.allow_out_op_status == "5") {
                            if (val.allow_out_op_remark) {
                                val.show_allow_out_op_status = "删除归类，原因：" + val.allow_out_op_remark;
                            } else {
                                val.show_allow_out_op_status = "删除归类，原因：无";
                            }
                        }
                    }
                }
            } else {
                this.carPlanTable = [];
                this.totalNumber = 0;
            }
            return this.carPlanTable;
        }
    },
    methods: {
        sortTable: function(val) {
            if (val.order === "descending") {
                this.sort_field_name = val.prop + " desc";
            } else if (val.order === "ascending") {
                this.sort_field_name = val.prop + " asc";
            } else if (!val.order && this.notAllowInSection) {
                this.sort_field_name = "end_time desc";
            } else if (!val.order && !this.notAllowInSection) {
                this.sort_field_name = "";
            }
            this.$emit("sortSearch", this.sort_field_name);
        },
        handleClassifyNumberClick: function(row) {
            router.push({
                name: "preProcess",
                params: {
                    car_day_id: row.car_day_id
                }
            });
        },
        pageSizeChange: function(val) {
            this.multipleCarPlanSelection = [];
            this.filter.perPage = val;
            this.resetSelect();
            this.$emit("carPlanPageChange", {
                page_index: this.filter.currentPage,
                page_size: this.filter.perPage,
                loading: true
            });
        },
        pageCurrentChange: function(val) {
            this.priorPage = this.filter.currentPage;
            this.filter.currentPage = val;
            if (this.allTableData.length > 0) {
                this.carPlanData.data.wy_allow_in_info_list = this.allTableData[this.filter.currentPage - 1];
                return;
            }
            this.$emit("carPlanPageChange", {
                page_index: this.filter.currentPage,
                page_size: this.filter.perPage,
                loading: true
            });
        },
        selectAll: function() {
            if (this.selectAllFlag) {
                this.$emit("carPlanPageChange", { isAll: 1 });
            } else {
                this.multipleCarPlanSelection = [];
                this.$refs.carPlanAllowInTable.clearSelection();
                this.selectNumber = 0;
            }
        },
        afterSelectAll: function(val) {
            let arrData=val.data.wy_allow_in_info_list;
            var pagesNumber = Math.ceil(val.data.total_number / this.filter.perPage);
            for (var i = 0; i < pagesNumber; i++) {
                this.multipleCarPlanSelection[i] = arrData.slice(
                    i * this.filter.perPage,
                    (i + 1) * this.filter.perPage
                );
            }
            this.allTableData = Object.assign(
                [],
                this.allTableData,
                this.multipleCarPlanSelection
            );
            this.carPlanData.data.wy_allow_in_info_list = this.allTableData[this.filter.currentPage - 1];
        },
        getSelectDatas: function() {
            let num = 0;
            for(let val of this.multipleCarPlanSelection){
                num += val.length;
            }
            this.selectNumber = num;
            if(num===0){
                this.selectAllFlag=false
            }else{
                this.selectAllFlag = this.selectNumber == this.totalNumber;
            }
        },
        toData:function(){
            this.$emit("updateSelectCarPlan", this.multipleCarPlanSelection);
        },
        resetSelect:function(){
             this.selectAllFlag = false;
             this.allTableData = [];
        },
        carPlanSelectionChange: function(val) {
            var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
            for (var i = 0; i < pagesNumber; i++) {
                if (i == this.filter.currentPage - 1) {
                    this.multipleCarPlanSelection[this.filter.currentPage - 1] = val;
                } else {
                    if (typeof this.multipleCarPlanSelection[i] == "undefined") {
                        this.multipleCarPlanSelection[i] = [];
                    }
                }
            }
            this.getSelectDatas();
            this.$emit("updateSelectCarPlan", this.multipleCarPlanSelection);
        },
        SelectionAllChange: function(val) {
            if (val.length) {
                var pagesNumber = Math.ceil(this.totalNumber / this.filter.perPage);
                for (var i = 0; i < pagesNumber; i++) {
                    this.multipleCarPlanSelection[i] = this.carPlanTable.slice(
                        i * this.filter.perPage,
                        (i + 1) * this.filter.perPage
                    );
                }
            } else {
                this.multipleCarPlanSelection = [];
            }
            this.$emit("updateSelectCarPlan", this.multipleCarPlanSelection);
        },
        editCarDay: function(index) {
            this.inCarDay = JSON.parse(JSON.stringify(this.tableData[index]));
            this.edit.showCity = [];
            this.inCarDay.city = this.inCarDay.city.replace(/市/g, "");
            for (var thisProvince of this.options) {
                if (thisProvince.children) {
                    for (var thisCity of thisProvince.children) {
                        if (thisCity.value == this.inCarDay.city) {
                            this.edit.showCity = [thisProvince.value, thisCity.value];
                        }
                    }
                } else {
                    if (thisProvince.value == this.inCarDay.city) {
                        this.edit.showCity = [thisProvince.value];
                    }
                }
            }
            if (this.edit.showCity.length == 2) {
                this.edit.city = this.edit.showCity[1];
            } else if (this.edit.showCity.length == 1) {
                this.edit.city = this.edit.showCity[0];
            } else {
                this.edit.city = this.inCarDay.city;
            }
            this.dialogEditVisible = true;
        },
        submitEditForm: function(formName) {
            var queryEditData = {
                user_id: sessionStorage.userid,
                car_day_id: this.inCarDay.car_day_id,
                city: this.edit.city,
                memo: trim(this.inCarDay.memo)
            };
            this.$http.post("/api/modify_wy_task", queryEditData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(this, "success", "外业任务编辑成功", () => {
                        this.$emit("refreashCarPlan", "true");
                        this.dialogEditVisible = false;
                    });
                } else {
                    alertInfo(this, "error", "外业任务编辑失败" + data.msg);
                }
            });
        },
        allowInMark: function(index) {
            var thisRowData = JSON.parse(JSON.stringify(this.tableData[index]));
            this.allowInMarkData.carPlanID = thisRowData.car_day_id;
            this.allowInMarkData.sub_project_id = thisRowData.sub_project_id;
            if (this.allowInMarkData.sub_project_id) {
                this.allowInMarkData.sub_project_name = thisRowData.sub_project_name;
            } else {
                this.allowInMarkData.sub_project_name = "无";
            }
            this.dialogAllowInMarkVisible = true;
        },
        submitAllowInMarkForm: function() {
            var queryAllowInMarkData = {
                user_id: sessionStorage.userid,
                car_day_id: this.allowInMarkData.carPlanID,
                handle_segment: 2,
                op_status: this.allowInMarkData.allowInResult,
                op_remark: trim(this.allowInMarkData.allowInReason)
            };
            this.$http.post("/api/modify_wy_valid_status", queryAllowInMarkData).then(response => {
                response = response.body;
                var data = response.data;
                if (data.errno === 0) {
                    alertInfo(this, "success", "标记成功，车天编号：" + data.data.car_day_id, () => {
                        this.$emit("refreashCarPlan", "true");
                        this.dialogAllowInMarkVisible = false;
                    });
                } else {
                    alertInfo(this, "error", "标记失败，" + data.msg);
                }
            });
        },
        editCityChange: function(val) {
            if (val.length == 2) {
                this.edit.city = val[1];
            } else if (val.length == 1) {
                this.edit.city = val[0];
            } else {
                this.edit.city = this.inCarDay.city;
            }
        }
    }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
.carPlanDetailList {
    overflow: auto;
    width: $width;
    height: 100%;
    .table-div {
        width: 95%;
        margin: 10px auto 0px auto;
    }
    .pagination-area {
        width: 95%;
        text-align: right;
        margin: 30px 0 0px 0;
    }
    .left-title {
        text-align: left;
        padding: 0 0 20px 30px;
        width: 100%;
    }
}
</style>
