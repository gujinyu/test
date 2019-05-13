<template>
    <el-dialog :title="createLibform.title" :visible.sync="dialogFormVisible" :before-close="formHidden" 
    :close-on-click-modal="false"
    size="small"
        min-width="1000px" @open="OpenFun">
        <el-form ref="createLibform" :model="createLibform" :rules="createLibRules" label-width="140px" class="demo-dynamic">
            <div v-if="createLibform.title =='添加至成果库'" class="borderBox">
                <el-form-item :span="24" class="selectDivComponents" :label="ele.name+'：'" v-for="ele in forArrSelectDiv"
                    :key="ele.name">
                    <el-select v-model="ele.objectType" @change="changeEvent(ele.name,ele.objectType)" class="selectBox"
                        placeholder="请选择" size="medium">
                        <template>
                            <el-option v-for="(item,index) in ele.AllTypesSelect" :key="index" :value="index" :label="item"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </div>
            <div v-else>
                <el-form-item label="车厂" prop="carFactory" :rules="{
                        required: true, message: '车厂不能为空', trigger: 'blur'
                    }">
                    <el-col :span="16">
                        <el-input v-model="createLibform.carFactory" clearable size="medium"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="成果库名称" prop="name" :rules="{required: true, message: '成果库不能为空', trigger: 'blur'}">
                    <el-col :span="16">
                        <el-input v-model="createLibform.name" @change="libraryNameChange" clearable size="medium"></el-input>
                    </el-col>
                </el-form-item>
            </div>
            <el-form-item label="母库名称：" class="leftbox">
                <span>{{createLibform.selectSubProjectList[0].sub_project_name}}</span>
            </el-form-item>
            <el-form-item label="母库分支：" class="leftbox">
                <span>{{createLibform.selectSubProjectList[0].source_data_trunk}}</span>
            </el-form-item>
            <el-form-item v-for="(subProject) in createLibform.selectSubProjectList" :key="subProject.key">
                <el-form :ref="subProject" :model="subProject">
                    <el-form-item label="数据版本时间：">
                        <el-col>
                            <el-date-picker style="float:left;width:50%;" v-model="subProject.source_branch_time" type="datetime"
                                size="small" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0"
                                placeholder="选择数据版本时间">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="成果数据分支：" prop="destination_data_trunk" :rules="{required: true, message: '成果数据分支不能为空', trigger: 'blur'}">
                        <el-input v-model="subProject.destination_data_trunk" clearable size="small" @blur="triggerVadidate('createLibform')"></el-input>
                    </el-form-item>
                    <el-form-item label="网格列表：" style="margin-top:10px;">
                        <el-col>
                            <el-input v-model="subProject.tile_id_list" placeholder="请输入该子项目下要生成成果库的网格ID，多个网格ID用分号分隔，仅可输入数字和分号。"
                                :change="formatTileIDInput(subProject.tile_id_list)" type="textarea" :autosize="{ minRows: 5, maxRows: 5}">

                            </el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" :maxlength='255' placeholder="最多输入255个字符" :autosize="{ minRows: 2, maxRows: 4}"
                    v-model="createLibform.memo"></el-input>
            </el-form-item>
            <el-form-item label-width="80px">
                <el-button type="primary" @click="Determine">确定</el-button>
                <el-button @click="formHidden">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {
        inputCheck
    } from "@/utils/daqian_tools";
    import Vue from "vue";
    export default {
        props: ['sAndHidds', 'createLibform'],
        data() {
            return {
                comObjectType: '',
                forArrSelectDiv: [{ // v_s:这个是daqian_selectCheck.vue组件下拉菜单的数据结构
                        name: "车厂",
                        objectType: '', // v_s: 这个是项目状态的默认值
                        AllTypesSelect: {}
                    },
                    { // v_s:这个是daqian_selectCheck.vue组件下拉菜单的数据结构
                        name: "成果库名称",
                        objectType: '', // v_s: 这个是项目状态的默认值
                        results_library_id: '',
                        AllTypesSelect: {},
                    }
                ],
                obj: {},
                createLibRules: {
                    name: [{
                        required: true,
                        message: "请输入成果库名称",
                        trigger: "blur"
                    }]
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
            }
        },
        created() {
            this.reqCarlist();
        },
        computed: {
            dialogFormVisible: {
                get() {
                    return this.sAndHidds;
                },
            }
        },
        methods: {
            OpenFun: function () {
                if (this.createLibform.title == "添加至成果库") {
                    this.changeEvent();
                } else {
                    this.libraryNameChange();
                }
            },
            reqCarlist: function () {
                var queryResultLibraryData = {
                    results_library_id: 0,
                    results_library_name: "",
                    car_factory: "",
                    query_start_time: "",
                    query_end_time: "",
                    is_query_sub_library: 0,
                    query_or_export_data: 0,
                    page_size: 10,
                    page_index: 1,
                    return_all: 1
                };
                this.$http
                    .post("/api/query_results_library", queryResultLibraryData).then(res => {
                        let {
                            data: {
                                results_library_info: listArr
                            },
                            errno
                        } = res.body.data;
                        if (errno === 0 && listArr) {
                            for (var ele of listArr) {
                                if (!this.obj[ele.car_factory]) {
                                    var obj1 = {};
                                    obj1[ele.results_library_id] = ele.results_library_name;
                                    this.obj[ele.car_factory] = obj1;
                                    this.forArrSelectDiv[0].AllTypesSelect[ele.results_library_id] = ele.car_factory;
                                } else {
                                    this.obj[ele.car_factory][ele.results_library_id] = ele.results_library_name;
                                }
                            }
                        }
                        // 根据不同数据库车厂变化变化动态给车厂名称赋值
                        for (let i in this.forArrSelectDiv[0].AllTypesSelect) {
                            if (this.forArrSelectDiv[0].objectType){
                                break;
                            }
                            this.forArrSelectDiv[0].objectType = i;
                        }
                        // v_s:请求完之后先给成果库分支赋值
                        this.forArrSelectDiv[1].AllTypesSelect = this.obj[this.forArrSelectDiv[0].AllTypesSelect[
                            this.forArrSelectDiv[0].objectType]];
                        // 根据车厂变化动态给成果库名称赋值
                        for (let i in this.forArrSelectDiv[1].AllTypesSelect) {
                            if (this.forArrSelectDiv[1].objectType){
                                break;
                            }
                            this.forArrSelectDiv[1].objectType = i;
                        }
                    })
            },
            changeEvent: function (event, val) { // v_s: 选择车厂时 动态给成果库名称对象赋值
                var results_library_name = '';
                if (event == '车厂') {
                    this.forArrSelectDiv[1].objectType = val;
                    this.forArrSelectDiv[1].AllTypesSelect = this.obj[this.forArrSelectDiv[0].AllTypesSelect[val]];
                    results_library_name = this.forArrSelectDiv[1].AllTypesSelect[val]
                }
                if (event == '成果库名称') {
                    results_library_name = this.forArrSelectDiv[1].AllTypesSelect[val]
                }
                this.forArrSelectDiv[1].results_library_id = val?val:this.forArrSelectDiv[1].objectType;
                this.recommendFun(results_library_name);
            },
            //  生成成果库方法
            libraryNameChange: function (listName) {
                this.createLibform.selectSubProjectList = this.recommendDataTrunk(
                    this.createLibform.selectSubProjectList,
                    "source_data_trunk",
                    listName,
                    "destination_data_trunk",
                    "CG_"
                );
            },
            // 推荐成果数据分支函数
            recommendFun: function (name) {
                var listName = name || this.forArrSelectDiv[1].AllTypesSelect[this.forArrSelectDiv[1].objectType];
                if (this.createLibform.title == "添加至成果库") {
                    this.createLibform.selectSubProjectList = this.recommendDataTrunk(
                        this.createLibform.selectSubProjectList,
                        "source_data_trunk",
                        listName,
                        "destination_data_trunk",
                        "CG_"
                    );
                }
            },
            //推荐数据分支
            recommendDataTrunk: function (sourceList, sourceString, baseString, destinationString, prefixString) {
                var nowDate = new Date();
                var nowDay = nowDate.getFullYear();
                if (nowDate.getMonth() + 1 < 10) {
                    nowDay += "0" + (nowDate.getMonth() + 1);
                } else {
                    nowDay += "" + (nowDate.getMonth() + 1);
                }
                if (nowDate.getDate() < 10) {
                    nowDay += "0" + nowDate.getDate();
                } else {
                    nowDay += nowDate.getDate();
                }
                if (sourceList.length) {
                    for (var val of sourceList) {
                        //var tmpData_trunk = val.source_data_trunk.replace(/[-]/g,'_').replace(/[\/]/g,'');
                        var tmpData_trunk = val[sourceString].replace(/[-]/g, "_").replace(/[\/]/g, "");
                        var tmpDataTrunks = tmpData_trunk.split("_");
                        if (tmpDataTrunks.length > 1) {
                            if (!isNaN(tmpDataTrunks[tmpDataTrunks.length - 1])) {
                                if (tmpDataTrunks[tmpDataTrunks.length - 1].length > 2) {
                                    tmpDataTrunks.pop();
                                }
                            }
                        }
                        if (tmpDataTrunks[0] && tmpDataTrunks[0] + "_" === prefixString) {
                            prefixString = "";
                        }
                        tmpData_trunk = tmpDataTrunks.join("_");
                        if (baseString) {
                            Vue.set(
                                val,
                                destinationString,
                                prefixString + pinyinUtil.getFirstLetter(baseString) + "_" + tmpData_trunk +
                                "_" + nowDay
                            );
                        } else {
                            Vue.set(val, destinationString, prefixString + tmpData_trunk + "_" + nowDay);
                        }
                    }
                }
                return sourceList;
            },
            triggerVadidate: function (formName) {
                this.$refs[formName].validate();
            },
            formatTileIDInput: function (tmpString) {
                inputCheck(this, tmpString, 2);
            },
            formHidden: function () { // v_s: createLibform.Suffix：是组件复用是添加的后缀区分要执行的事件在父组件定义的
                this.$emit('formHidden' + this.createLibform.Suffix)
            },
            Determine: function () {
                this.$emit('submitCread' + this.createLibform.Suffix, [this.createLibform, this.forArrSelectDiv])
            },

        }
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    .borderBox{
        width:100%;
        height:135px;
    }
    .selectDivComponents {
        height: 40px;
    }

    .align-left {
        width: 140px;
        text-align: right;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .selectBox {
        width: 400px;
        float: left;
    }

    span {
        text-align: left;
        float: left;
    }

    .leftbox {
        text-align: left;
    }

</style>
