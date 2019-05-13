<template>
    <div class="view-body">
        <div class="navigator">
            <div class="sidebarcontent">
                <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-daqian-ziyuan-xianxing"></i>
                            <span slot="title">项目列表</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1">子项目列表</el-menu-item>
                            <el-menu-item index="1-2">主项目列表</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-daqian-xitongzhuangtai"></i>
                            <span slot="title">进度管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1">项目进度</el-menu-item>
                            <el-menu-item index="2-2">网格进度</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="3" class="item-active-style">
                        <i class="el-icon-daqian-SQLshenhe"></i>
                        <span slot="title">生产监控</span>
                    </el-menu-item>
                </el-menu>
            </div>
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
            activeIndex: "1-1",
            paths: [{
                name: "projectList",
                key: "1-1"
            }, {
                name: "mainProjectList",
                key: "1-2"
            }, {
                name: "projectProgress",
                key: "2-1"
            }, {
                name: "tileProgress",
                key: "2-2"
            }, {
                name: "productionMonitor",
                key: "3"
            }]
        };
    },
    created() {
        this.init();
    },
    beforeUpdate() {
        this.init();
    },
    methods: {
        //根据导航栏点击位置设置跳转链接
        handleSelect: function (key, keyPath) {
            for (var index in this.paths) {
                if (this.paths[index].key === key) {
                    router.push(this.paths[index]);
                    break;
                }
            }
        },
        init: function () {
            if (sessionStorage.username) {
                 for (var index in this.paths) {
                    if (this.paths[index].name === router.history.current.name) {
                        this.activeIndex = this.paths[index].key;
                        break;
                    }
                }
            } else {
                router.push({
                    name: "login"
                });
            }
        }
    }
};

</script>
<style lang="scss" scoped rel="stylesheet/scss">
.view-body {
    position: absolute;
    width: 100%;
    min-width: 1200px;
    top: 60px;
    bottom: 0px;
    background-color: #f2f2f2;
    overflow: auto;
    overflow-x: hidden;
}

.navigator {
    position: fixed;
    top: 60px;
    padding-top: 30px;
    bottom: 0px;
    background-color: #293038;
    z-index: 102;
    width: 180px;
    float: left;

    .sidebarcontent {
        overflow: hidden;
    }
    .el-submenu {
        width: 180px;
        text-align: left;
    }
    .el-menu-item {
        width: 180px;
        text-align: left;
    }

    .item-active-style {
        color: #fff;
        background-color: #30b19b;
    }
}

.main-container {
    width: calc(100% - 180px);
    float: left;
    min-height: 940px;
    min-width: 1020px;
    background-color: #f2f2f2;
    margin: 0 0 0 180px;
    padding: 15px;
}
</style>
