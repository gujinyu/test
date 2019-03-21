<template>
    <Cascader class="widthBox" v-if="mediumSize" :data="projectOptions" v-model="projectDatas" filterable :change-on-select="ChangeOnselect" placeholder="全部" @on-change="ProjectChange" :clearable="isProjectClearable" :render-format="format" :disabled="showSelectProject">
    </Cascader>
    <Cascader class="widthBox" v-else :data="projectOptions" size='large' v-model="projectDatas" filterable :change-on-select="ChangeOnselect" placeholder="全部" @on-change="ProjectChange" :clearable="isProjectClearable" :render-format="format" :disabled="showSelectProject">
    </Cascader>
</template>
<script>
import Vue from "vue";
import router from "@/router";
import { setCookie, getCookie } from "@/utils/daqian_tools";
export default {
    props: {
        showSelectProject: false,
        resetselectProjectData: false,
        ChangeOnselect: true,
        isProjectClearable: true,
        havedefaultProject: false,
        mediumSize: false,
        isStorage: true
    },
    data() {
        return {
            selectProjectID: 0,
            selectSubprojectID: 0,
            initProject: true,
            storageSelectProjectID: getCookie("selectProjectID") ? getCookie("selectProjectID") : 0,
            storageSubSelectProjectID: getCookie("selectSubprojectID") ? getCookie("selectSubprojectID") : 0,
            projectDatas: [],
            projectOptions: [],
            reqDataList: [],
            sub_project_process_type: ''  // v_s: 添加一个子项目状态的数据
        };
    },
    watch: {
        resetselectProjectData: function(val, oldval) {
            if (val) {
                // 刷新触发
                if (this.havedefaultProject) {
                    this.storageSelectProjectID = getCookie("selectProjectID") ? getCookie("selectProjectID") : 0;
                    this.storageSubSelectProjectID = getCookie("selectSubprojectID")
                        ? getCookie("selectSubprojectID")
                        : 0;
                    this.selectDefaultProject();
                    this.$emit("selectProjects", {
                        project_id: parseInt(this.storageSelectProjectID),
                        sub_project_id: parseInt(this.storageSubSelectProjectID),
                        sub_project_process_type: this.sub_project_process_type,
                        init: true
                    });
                } else {
                    this.projectDatas = [];
                    this.$emit("selectProjects", {
                        project_id: 0,
                        sub_project_id: 0,
                        sub_project_process_type: '',
                        init: true
                    });
                }
                this.$emit("updateProjectStatus", false);
            }
        },
        projectOptions: {
            handler: function(val, oldval) {
                if (this.initProject) {
                    //判读是否需要初始设置选择
                    this.projectDatas = [];
                    if (this.havedefaultProject) {
                        //判断是否具有默认项,没有默认即为选择全部
                        this.selectDefaultProject();
                    } else {
                        this.$emit("selectProjects", {
                            project_id: 0,
                            sub_project_id: 0,
                            sub_project_process_type: this.sub_project_process_type,
                            init: true
                        });
                        this.initProject = false;
                    }
                }
                if (this.ChangeOnselect === false) {
                    for (var item of val) {
                        if (!item.children.length) {
                            Vue.set(item, "disabled", true);
                        } else {
                            Vue.set(item, "disabled", false);
                        }
                    }
                }
            },
            deep: true
        }
    },
    created() {
        // v_s: 这里的事件传递没有取消只是给变了位置现在在newValOne方法中
        this.getProjectList();
    },
    methods: {
        getProjectList: function() {
            this.$http
                .post("/api/query_project_info", {
                    user_id: sessionStorage.userid,
                    query_type: 0
                })
                .then(response => {
                    response = response.body;
                    var data = response.data;
                    if (data.errno === 0) {
                        let arr = [];
                        this.reqDataList = data.data.project_list;
                        for (let val of data.data.project_list) {
                            let children = [];
                            for (let i of val.sub_project_list) {
                                children.push({
                                    label: i.sub_project_name,
                                    value: Number(i.sub_project_id),
                                    sub_project_process_type1: this.sub_project_process_type,
                                });
                            }
                            arr.push({
                                label: val.project_name,
                                value: Number(val.project_id),
                                children: children
                            });
                        };
                        this.newValOne(this.storageSelectProjectID,this.storageSubSelectProjectID,'req');
                        this.projectOptions = arr;
                    } else {
                        this.$message({
                            message: "获取项目列表失败" + data.errno,
                            type: "error",
                            duration: 2000
                        });
                    }
                });
        },
        newValOne:function (prentId,subId,req) { // v_s: 给默认的子项目状态赋值
            for (let val of this.reqDataList) {
                if(val.project_id == prentId){
                    for(let ele of val.sub_project_list){
                        if(ele.sub_project_id == subId){
                            this.sub_project_process_type = ele.sub_project_process_type 
                        }
                    }
                }
            }
            if(req) {
                this.$emit("selectProjects", {  // v_s: 这是之前created里面的事件挪过来的
                    project_id: parseInt(this.storageSelectProjectID),
                    sub_project_id: parseInt(this.storageSubSelectProjectID),
                    sub_project_process_type: this.storageSubSelectProjectID==0?'': this.sub_project_process_type,
                    init: true
                });
            }
        },
        selectDefaultProject: function() {
            // 选择上次选择的
            if (this.storageSelectProjectID) {
                if (this.storageSelectProjectID > 0 && this.storageSubSelectProjectID > 0) {
                    for (var pro of this.projectOptions) {
                        if (pro.value === parseInt(this.storageSelectProjectID)) {
                            if (pro.children.length) {
                                Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                                Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                                // this.$emit("selectProjects", {
                                //     project_id: parseInt(this.storageSelectProjectID),
                                //     sub_project_id: parseInt(this.storageSubSelectProjectID),
                                //     init: true
                                // });
                                this.initProject = false;
                            }
                        }
                    }
                } else if (this.storageSelectProjectID > 0 && this.storageSubSelectProjectID == 0) {
                    Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                    this.projectDatas.push(parseInt(this.storageSelectProjectID));
                    //对于必须选择一个子项目的页面
                    if (router.history.current.name === "operationPostProcess") {
                        for (var pro of this.projectOptions) {
                            if (pro.value === parseInt(this.storageSelectProjectID)) {
                                if (pro.children.length) {
                                    this.storageSubSelectProjectID = pro.children[0].value;
                                    Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                                    // this.projectDatas.push(parseInt(this.storageSubSelectProjectID));
                                    // this.$emit("selectProjects", {
                                    //     project_id: parseInt(this.storageSelectProjectID),
                                    //     sub_project_id: parseInt(this.storageSubSelectProjectID),
                                    //     init: true
                                    // });
                                    this.initProject = false;
                                }
                            }
                        }
                    } else {
                        // this.$emit("selectProjects", {
                        //     project_id: parseInt(this.storageSelectProjectID),
                        //     sub_project_id: parseInt(this.storageSubSelectProjectID),
                        //     init: true
                        // });
                        this.initProject = false;
                    }
                } else {
                    if (router.history.current.name === "operationPostProcess") {
                        if (this.projectOptions[0].children.length) {
                            this.storageSelectProjectID = this.projectOptions[0].value;
                            Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                            // this.projectDatas.push(parseInt(this.storageSelectProjectID));
                            this.storageSubSelectProjectID = this.projectOptions[0].children[0].value;
                            Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                            // this.projectDatas.push(parseInt(this.storageSubSelectProjectID));
                            // this.$emit("selectProjects", {
                            //     project_id: parseInt(this.storageSelectProjectID),
                            //     sub_project_id: parseInt(this.storageSubSelectProjectID),
                            //     init: true
                            // });
                            this.initProject = false;
                        }
                    } else {
                        // this.$emit("selectProjects", {
                        //     project_id: parseInt(this.storageSelectProjectID),
                        //     sub_project_id: parseInt(this.storageSubSelectProjectID),
                        //     init: true
                        // });
                        this.initProject = false;
                        this.projectDatas = [];
                    }
                }
            } else {
                // 选择第一个
                if (this.projectOptions[0].children.length) {
                    this.storageSelectProjectID = this.projectOptions[0].value;
                    Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                    // this.projectDatas.push(parseInt(this.storageSelectProjectID));
                    this.storageSubSelectProjectID = this.projectOptions[0].children[0].value;
                    Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                    // this.projectDatas.push(parseInt(this.storageSubSelectProjectID));
                    // this.$emit("selectProjects", {
                    //     project_id: this.projectDatas[0],
                    //     sub_project_id: this.projectDatas[1],
                    //     init: true
                    // });
                    this.initProject = false;
                }
            }
            if (!this.isStorage) {
                setCookie("selectProjectID", this.storageSelectProjectID, 6 * 30 * 24 * 60);
                setCookie("selectSubprojectID", this.storageSubSelectProjectID, 6 * 30 * 24 * 60);
            }
        },
        ProjectChange: function(val) {
            if (val.length === 2) {
                this.newValOne(val[0],val[1])
                this.selectProjectID = parseInt(val[0]);
                this.selectSubprojectID = parseInt(val[1]);
            } else if (val.length === 1) {
                this.sub_project_process_type = '';
                this.selectProjectID = parseInt(val[0]);
                this.selectSubprojectID = 0;
            } else {
                this.sub_project_process_type = ''; // v_s: 没有选择子项目时制空子项目状态
                this.selectProjectID = 0;
                this.selectSubprojectID = 0;
            }
            if (this.selectProjectID) {
                Vue.set(this.projectDatas, 0, this.selectProjectID);
                Vue.set(this.projectDatas, 1, this.selectSubprojectID);
            } else {
                this.projectDatas = [];
            }
            if (!this.isStorage) {
                setCookie("selectProjectID", this.selectProjectID, 6 * 30 * 24 * 60);
                setCookie("selectSubprojectID", this.selectSubprojectID, 6 * 30 * 24 * 60);
            }

            this.$emit("selectProjects", {
                project_id: this.selectProjectID,
                sub_project_id: this.selectSubprojectID,
                sub_project_process_type: this.sub_project_process_type,
                init: false
            });
        },
        format(labels, selectedData) {
            this.$emit("selectProjectNames", {
                projectNames: labels
            });
            const index = labels.length - 1;
            const data = selectedData[index] || false;
            if (data && data.code) {
                return labels[index];
            }
            return labels[index];
        }
    }
};
</script>
<style lang="scss">
.cascader-select-style {
    .ivu-cascader-rel {
        .ivu-input {
            padding-left: 15px;
        }

        .ivu-cascader-label {
            padding-left: 15px;
            color: #606266;
        }
    }
}
</style>
