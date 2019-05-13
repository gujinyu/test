<template>
    <el-cascader v-if="size" class="widthBox" :options="projectOptions" v-model="projectDatas" filterable :change-on-select="ChangeOnselect" placeholder="全部" @change="ProjectChange" :clearable="isProjectClearable" :render-format="format" :disabled="showSelectProject" size="mini" :show-all-levels="false">
    </el-cascader>
    <el-cascader v-else class="widthBox" :options="projectOptions" v-model="projectDatas" filterable :change-on-select="ChangeOnselect" placeholder="全部" @change="ProjectChange" :clearable="isProjectClearable" :render-format="format" :disabled="showSelectProject" size="medium" :show-all-levels="false">
    </el-cascader>
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
        isStorage: true,
        size: ""
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
        resetselectProjectData: function (val, oldval) {
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
            handler: function (val, oldval) {
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
                // if (this.ChangeOnselect === false) {
                for (var item of val) {
                    if (!item.children.length) {
                        Vue.set(item, "disabled", true);
                    } else {
                        Vue.set(item, "disabled", false);
                    }
                }
                // }
            },
            deep: true
        }
    },
    created() {
        this.$emit("selectProjects", {
            project_id: this.storageSubSelectProjectID != 0 ? 0 : parseInt(this.storageSelectProjectID),
            sub_project_id: parseInt(this.storageSubSelectProjectID),
            init: true
        });
        this.getProjectList();
    },
    methods: {
        getProjectList: function () {
            this.$http
                .post("/api/query_project_info", {
                    user_id: sessionStorage.userid,
                    project_status: "3,4,6", // gu:只返回状态为进行中、完结、暂停的子项目
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
        selectDefaultProject: function () {
            // 选择上次选择的
            if (this.storageSelectProjectID) {
                let isExised = false;
                for(let item of this.projectOptions){
                    if(item.value == this.storageSelectProjectID && item.children.length > 0) {
                        isExised = true;
                        break;
                    }
                }
                // 当主项目不存在的时候并且子项目不存在
                if (!isExised && this.storageSubSelectProjectID == 0) {
                    this.storageSelectProjectID = 0;
                    Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                    Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                    setCookie("selectProjectID", this.storageSelectProjectID, 6 * 30 * 24 * 60);
                }
                if (this.storageSelectProjectID > 0 && this.storageSubSelectProjectID > 0) {
                    // 当有主项目又有子项目
                    for (var pro of this.projectOptions) {
                        if (pro.value === parseInt(this.storageSelectProjectID)) {
                            if (pro.children.length) {
                                Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                                Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                                this.initProject = false;
                            }
                        }
                        // gu:校验子项目是否存在于返回的子项目列表中
                        for (let val of pro.children) {
                            if (val.value == this.storageSubSelectProjectID) {
                                if(this.storageSelectProjectID != pro.value) {
                                    this.storageSelectProjectID = pro.value;
                                    setCookie("selectProjectID", this.storageSelectProjectID, 6 * 30 * 24 * 60);
                                    Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                                    Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                                    // this.$emit("selectProjects", {
                                    //     project_id: parseInt(this.storageSelectProjectID),
                                    //     sub_project_id: parseInt(this.storageSubSelectProjectID),
                                    //     init: true
                                    // });
                                }
                                return;
                            }
                        }
                    }
                    // gu:当存储的子项目id不在返回的列表中,强制选中当前存储主项目下的第一个子项目
                    for (let item of this.projectOptions) {
                        if (item.value == this.storageSelectProjectID) {
                            if (item.children.length > 0) {
                                this.storageSubSelectProjectID = item.children[0].value;
                            } else if (item.children.length == 0) {
                                // gu:当目前的主项目下没有子项目的时候就默认首个有子项目的主项目下的第一个子项目；
                                for (let item of this.projectOptions) {
                                    if (item.children.length > 0) {
                                        this.storageSelectProjectID = item.value;
                                        this.storageSubSelectProjectID = item.children[0].value;
                                        break;
                                    }
                                }
                            }
                            Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                            Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                            setCookie("selectProjectID", this.storageSelectProjectID, 6 * 30 * 24 * 60);
                            setCookie("selectSubprojectID", this.storageSubSelectProjectID, 6 * 30 * 24 * 60);
                            this.$message({
                                message: '子项目已不在可选范围内，已重新选择其他子项目',
                                type: 'warning'
                            });
                            this.$emit("selectProjects", {
                                project_id: 0,
                                sub_project_id: parseInt(this.storageSubSelectProjectID),
                                init: true
                            });
                            return;
                        }
                    }
                } else if (this.storageSelectProjectID > 0 && this.storageSubSelectProjectID == 0) {
                    // 当有主项目没有子项目
                    Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                    //对于必须选择一个子项目的页面
                    if (router.history.current.name === "operationPostProcess" || router.history.current.name === "tileProgress") {
                        for (var pro of this.projectOptions) {
                            if (pro.value === parseInt(this.storageSelectProjectID)) {
                                if (pro.children.length) {
                                    this.storageSubSelectProjectID = pro.children[0].value;
                                    Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                                    this.$emit("selectProjects", {
                                        project_id: parseInt(this.storageSelectProjectID),
                                        sub_project_id: parseInt(this.storageSubSelectProjectID),
                                        init: true
                                    });
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
                    if (router.history.current.name === "operationPostProcess" || router.history.current.name === "tileProgress") {
                         // gu:当目前的主项目下没有子项目的时候就默认首个有子项目的主项目下的第一个子项目；
                        for(let item of this.projectOptions){
                            if (item.children.length > 0) {
                                this.storageSelectProjectID = item.value;
                                this.storageSubSelectProjectID = item.children[0].value;
                                Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                                Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                                this.$emit("selectProjects", {
                                    project_id: this.storageSelectProjectID,
                                    sub_project_id: this.storageSubSelectProjectID,
                                    init: true
                                });
                                this.initProject = false;
                                break;
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
                }
            } else {
                // gu:当没有主项目的时候选择第一个主项目下的第一个子项目
                for(let item of this.projectOptions){
                    if (item.children.length > 0) {
                        this.storageSelectProjectID = item.value;
                        this.storageSubSelectProjectID = item.children[0].value;
                        Vue.set(this.projectDatas, 0, parseInt(this.storageSelectProjectID));
                        Vue.set(this.projectDatas, 1, parseInt(this.storageSubSelectProjectID));
                        this.$emit("selectProjects", {
                            project_id: this.storageSelectProjectID,
                            sub_project_id: this.storageSubSelectProjectID,
                            init: true
                        });
                        this.initProject = false;
                        break;
                    }
                }
                return subprojectData;
            }
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
            if (!this.isStorage) {
                setCookie("selectProjectID", this.storageSelectProjectID, 6 * 30 * 24 * 60);
                setCookie("selectSubprojectID", this.storageSubSelectProjectID, 6 * 30 * 24 * 60);
            }
        },
        ProjectChange: function (val) {
            if (val.length === 2) {
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
