<template>
    <div class="view-body">
        <div class="navigator">
            <div class="sidebarcontent">
                <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect"
                    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-daqian-ziyuan-xianxing"></i>
                            <span>母库成果</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1">母库列表</el-menu-item>
                            <el-menu-item index="1-2">母库网格列表</el-menu-item>
                            <el-menu-item index="1-3">母库回库记录</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="2">
                        <i class="el-icon-daqian-kucun"></i>
                        <span slot="title">发布成果</span>
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
                        name: "masterLibraryList",
                        key: "1-1"
                    },
                    {
                        name: "masterLibraryTileList",
                        key: "1-2"
                    },
                    {
                        name: "ReturnLibrary",
                        key: "1-3"
                    },
                    {
                        name: "resultLibrary",
                        key: "2"
                    }
                ]
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

        .el-submenu {
            width: 180px;
            text-align: left;
        }

        .sidebarcontent {
            overflow: hidden;
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
