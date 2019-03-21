<template>
    <div class="view-body">
        <div class="navigator">
            <div class="sidebarcontent">
                <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect"
                    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="1">
                        <i class="el-icon-daqian-gonggeshitu"></i>
                        <span slot="title">作业网格管理</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-goods"></i>
                        <span slot="title">任务包列表</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="el-icon-daqian-renwu"></i>
                        <span slot="title">作业任务列表</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <i class="el-icon-daqian-shaixuanguolv"></i>
                        <span slot="title">质检任务列表</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-daqian-anzhuangshigong-xianxing"></i>
                        <span slot="title">自动质检列表</span>
                    </el-menu-item>
                    <el-menu-item index="6">
                        <i class="el-icon-daqian-SQLshenhe"></i>
                        <span slot="title">抽检列表</span>
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
    import router from '@/router';
    export default {
        name: 'index',
        data() {
            return {
                activeIndex: '1',
                paths: [{
                    name: 'assignments'
                }, {
                    name: 'taskPackageList'
                }, {
                    name: 'operationTaskList'
                }, {
                    name: 'machineQualityCheckList'
                }, {
                    name: 'qualityCheckList'
                }, {
                    name: 'randomCheckList'
                }]
            }
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
                    var tmpkey = key - 1;
                    if (tmpkey == index) {
                        //sessionStorage.currentPath = this.paths[index].name;
                        router.push(this.paths[index]);
                        break;
                    }
                }
            },
            init: function () {
                if (sessionStorage.username) {
                    if (router.history.current.name === 'assignments') {
                        this.activeIndex = '1';
                    } else if (router.history.current.name === 'taskPackageList') {
                        this.activeIndex = '2';
                    } else if (router.history.current.name === 'operationTaskList') {
                        this.activeIndex = '3';
                    } else if (router.history.current.name === 'machineQualityCheckList') {
                        this.activeIndex = '4';
                    } else if (router.history.current.name === 'qualityCheckList') {
                        this.activeIndex = '5';
                    } else if (router.history.current.name === 'randomCheckList') {
                        this.activeIndex = '6';
                    }
                } else {
                    router.push({
                        name: 'login'
                    });
                }
            }
        }
    }

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
        overflow-x: hidden
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

        .el-menu-item {
            width: 180px;
            text-align: left;
        }

        .el-menu-item.is-active {
            color: #fff;
            background-color: #30B19B;
        }
    }

    .main-container {
        width: calc(100% - 180px);
        float: left;
        min-height: 940px;
        min-width: 1080px;
        background-color: #f2f2f2;
        margin: 0 0 0 180px;
        padding: 15px;
    }

</style>
