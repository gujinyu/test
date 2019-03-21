<template>
    <div>
        <div class="top-nav">
            <el-row>
                <el-col :span="3">
                    <div class="logo" @click="backToIndex">
                        <img src="../assets/img/logo-gaojing.png">
                    </div>
                </el-col>
                <el-col :span="4" :offset="17">
                    <div class="user-info" :title="username">
                        <span class="username">{{userrole}}/{{username}}</span>
                        <span>|&nbsp;</span>
                        <span class="logoutSpan" @click="logout()">退出</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="main-container">
            <el-col :span="7">
                <span class="spanSmall">数据生产</span>
                <div class="div-daqian" @click="daqianOnClick">
                    <span>大千平台</span>
                </div>
            </el-col>
            <el-col :span="7" :offset="1">
                <span class="spanSmall">统计分析</span>
                <div class="div-qianmu" @click="qianmuOnClick">
                    <span>千目平台</span>
                </div>
            </el-col>
            <el-col :span="7" :offset="1">
                <span class="spanSmall">编译发布</span>
                <div class="div-qiannuo" @click="qiannuoOnClick">
                    <span>千诺平台</span>
                </div>
            </el-col>
        </div>
    </div>
</template>

<script>
    import router from '@/router';
    export default {
        name: 'index',
        data() {
            return {
                userrole: '管理员',
                username: sessionStorage.username,
                activeIndex: '1',
                subProject: {}
            }
        },
        created() {
            this.initial();
        },
        beforeUpdate() {
            this.initial();
        },
        methods: {
            //退出登陆
            logout: function () {
                sessionStorage.clear();
                router.push({
                    name: 'login'
                });
            },
            //初始进入或刷新之后设置载入链接
            initial: function () {
                if (sessionStorage.username) {
                    this.username = sessionStorage.username;
                    if (sessionStorage.userrole == 2) {
                        this.userrole = '作业组长';
                    } else if (sessionStorage.userrole == 4) {
                        this.userrole = '质检组长';
                    } else if (sessionStorage.userrole == 5) {
                        this.userrole = '管理员';
                    }
                    router.push({
                        name: 'index'
                    });
                } else {
                    router.push({
                        name: 'login'
                    });
                }
            },
            daqianOnClick: function (event) {
                router.push({
                    name: 'daqian'
                });
                //跳转至大千平台
            },
            qianmuOnClick: function (event) {
                // router.push({name: 'qianmu'});
            },
            qiannuoOnClick: function (event) {
                // window.location.href = 'http://gzhxy-ns-map-had-preproc100.gzhxy.baidu.com:8080';
            },
            backToIndex: function () {
                router.push({
                    name: 'index'
                });
            }
        }
    }

</script>

<style lang="scss" scoped rel="stylesheet/scss">
    .top-nav {
        width: 100%;
        background-color: #324157;

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
        margin: 10px;
    }

    .logo img {
        width: 100px;
        display: inline-block;
    }

    .main-container {
        margin: 30px 40px 0 40px;

        span {
            display: block;
            width: 100%;
        }

        .spanSmall {
            display: block;
            padding: 15px 0 0 0;
            text-align: left;
            font-size: 25px;
            line-height: 20px;
            font-weight: 400px;
            color: #000;
            float: left;
            margin-left: 20px;
        }

        .div-daqian,
        .div-qianmu,
        .div-qiannuo {
            display: block;
            border: 1px solid;
            border-radius: 5px;
            float: left;
            margin: 50px;
            width: 300px;
            height: 150px;
            background: #4a86e8;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 35px 0 0 0;
            text-align: center;
            font-size: 25px;
            display: block;
            line-height: 70px;
            font-weight: 400px;
            color: #fff;
            cursor: pointer;
        }

        .div-qianmu {
            // background: #606266;
            background: #2f4554;
        }

        .div-qiannuo {
            background: #61a0a8;
            // background: #d48265;
        }
    }

</style>
