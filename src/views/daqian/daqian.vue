<template>
    <div class="daqianIndex">
        <div class="top-nav">
            <el-row>
                <el-col :span="3">
                    <div class="logo" @click="backToIndex">
                        <img src="../../assets/img/logo-gaojing.png">
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="topnav">
                        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#324157" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
                            <el-menu-item index="1"><a>项目管理</a></el-menu-item>
                            <el-menu-item index="2"><a>生产资料管理</a></el-menu-item>
                            <el-menu-item index="3"><a>自动化处理</a></el-menu-item>
                            <el-menu-item index="4"><a>内业管理</a></el-menu-item>
                            <el-menu-item index="5"><a>成果管理</a></el-menu-item>
                            <el-menu-item index="6"><a>系统管理</a></el-menu-item>
                            <el-menu-item index="7"><a>在线工具</a></el-menu-item>
                        </el-menu>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="user-info" :title="username">
                        <span class="webSpan">大千平台&nbsp;&nbsp;</span>
                        <span class="username">{{userrole}}/{{username}}</span>
                        <span>|&nbsp;</span>
                        <span class="logoutSpan" @click="logout()">退出</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="main-container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import router from "@/router";
export default {
    name: "index",
    data() {
        return {
            userrole: "管理员",
            username: sessionStorage.username,
            activeIndex: "1",
            subProject: {},
            paths: [
                {
                    name: "projectManager"
                },
                {
                    name: "materialManager"
                },
                {
                    name: "autoProcessManager"
                },
                {
                    name: "operationStageManager"
                },
                {
                    name: "resultManager"
                },
                {
                    name: "systemManager"
                },
                {
                    name: "onlineToolsLeft"
                }
            ]
        };
    },
    created() {
        this.initial();
    },
    beforeUpdate() {
        this.initial();
    },
    methods: {
        //根据导航栏点击位置设置跳转链接
        handleSelect: function(key, keyPath) {
            for (var index in this.paths) {
                var tmpkey = key - 1;
                if (tmpkey == index) {
                    sessionStorage.currentPath = this.paths[index].name;
                    router.push(this.paths[index]);
                    break;
                }
            }
        },
        //退出登陆
        logout: function() {
            sessionStorage.clear();
            router.push({
                name: "login"
            });
        },
        //初始进入或刷新之后设置载入链接
        initial: function() {
            if (sessionStorage.username) {
                this.username = sessionStorage.username;
                if (
                    router.history.current.name === "materialManager" ||
                    router.history.current.name === "carPlanList" ||
                    router.history.current.name === "tileManage"
                ) {
                    this.activeIndex = "2";
                } else if (
                    router.history.current.name === "autoProcessManager" ||
                    router.history.current.name === "postPreProcess" ||
                    router.history.current.name === "preProcess" ||
                    router.history.current.name === "operationPostProcess"
                ) {
                    this.activeIndex = "3";
                } else if (
                    router.history.current.name === "operationStageManager" ||
                    router.history.current.name === "assignments" ||
                    router.history.current.name === "taskPackageList" ||
                    router.history.current.name === "operationTaskList" ||
                    router.history.current.name === "machineQualityCheckList" ||
                    router.history.current.name === "qualityCheckList" ||
                    router.history.current.name === "randomCheckList"
                ) {
                    this.activeIndex = "4";
                } else if (
                    router.history.current.name === "resultManager" ||
                    router.history.current.name === "resultLibrary" ||
                    router.history.current.name === "masterLibraryList" ||
                    router.history.current.name === "ReturnLibrary" ||
                    router.history.current.name === "masterLibraryTileList"
                ) {
                    this.activeIndex = "5";
                } else if (
                    router.history.current.name === "systemManager" ||
                    router.history.current.name === "checkRuleConfig" ||
                    router.history.current.name === "userList"
                ) {
                    this.activeIndex = "6";
                } else if (
                    router.history.current.name === "onlineToolsLeft" ||
                    router.history.current.name === "listMode" 
                    // router.history.current.name === "napMode"
                ) {
                    this.activeIndex = "7";
                } else {
                    this.activeIndex = "1";
                }
                if (sessionStorage.userrole == 2) {
                    this.userrole = "作业组长";
                } else if (sessionStorage.userrole == 4) {
                    this.userrole = "质检组长";
                } else if (sessionStorage.userrole == 5) {
                    this.userrole = "管理员";
                }
            } else {
                router.push({
                    name: "login"
                });
            }
        },
        backToIndex: function() {
            router.push({
                name: "index"
            });
        }
    }
};
</script>
<style lang="scss">
/* 全局样式---折叠样式*/
.select-area {
    text-align: left;
    height:26px;
    line-height:26px;
    // margin-left: 20px;
    .select-number{
        font-size: 16px;
        margin-right:10px;
    }
}
.select-area-1 {
    text-align: left;
    height:26px;
    line-height:26px;
    .select-number{
        font-size: 16px;
        margin-right:10px;
    }
}
.titlespan {
    float: left;
    font-size: 20px;
    font-weight: bold;
    margin: 13px 0 0 0;
}
.pagination-area {
    .select-area {
        p {
            width: 150px;
            text-align: left;
        }
        height: 30px;
        float: left;
        margin-left: 40px;
        display: flex;
        align-items: center;
    }
}

.open {
    display: flex;
    justify-content: flex-start;
    padding: 0 0 10px 0;

    .more {
        position: absolute;
        left: 50%;
        margin-top: 7px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #409eff;
        cursor: pointer;

        .arrow_down {
            width: 10px;
            height: 10px;
            margin-top: -4px;
            border-top: 1px solid #409eff;
            border-right: 1px solid #409eff;
            transform: rotate(135deg);
        }

        .arrow_up {
            width: 10px;
            height: 10px;
            margin-top: -4px;
            border-bottom: 1px solid #409eff;
            border-left: 1px solid #409eff;
            transform: rotate(135deg);
        }

        .moreRight {
            margin-left: 10px;
            line-height: 24px;
            height: 24px;
            text-align: center;
        }
    }

    .operation {
        margin: 0 30px;
    }
}
</style>
<style lang="scss" scoped rel="stylesheet/scss">
.daqianIndex {
    width: 100%;
    height: 100%;
}

.top-nav {
    width: 100%;
    min-width: 1200px;
    height: 60px;
    background-color: #324157;
    position: fixed;
    z-index: 101;

    p {
        color: #fff;
    }

    .topnav a {
        font-weight: bold;
        font-size: 16px;
    }
}

.user-info {
    height: 60px;
    line-height: 60px;
    color: #bfcbd9;
    padding-left: 20px;

    span {
        font-weight: bold;
        font-size: 15px;
        float: left;
    }

    .webSpan {
        color: #fff;
    }

    .username {
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .logoutSpan {
        cursor: pointer;
    }
}

.logo {
    margin: 10px 10px 0 10px;

    span {
        color: #fff;
        display: inline-block;
        font-weight: bold;
        font-size: 15px;
    }
}

.logo img {
    width: 100px;
    display: inline-block;
    cursor: pointer;
}
</style>
