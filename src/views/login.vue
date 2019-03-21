<template>
    <div class="daqian-login">
        <div class="header">
            <div class="logo">
                <span>欢迎访问高精地图服务平台</span>
            </div>
            <div class="splitline">
            </div>
        </div>
        <div class="login-form">
            <el-form ref="loginform" :model="loginform" label-width="100px" class="demo-dynamic">
                <el-form-item required prop="userName" :rules="[
            { required: true, message: '请输入账号', trigger: 'blur' }
            ]">
                    <el-col :span="18">
                        <el-input v-model="loginform.userName" autofocus @keyup.enter.native="signIn($event)">
                            <template slot="prepend">帐号</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item required prop="passWord" :rules="[
            { required: true, message: '请输入8位密码', trigger: 'blur' }]">
                    <el-col :span="18">
                        <el-input type="password" v-model="loginform.passWord" required @keyup.enter.native="signIn($event)">
                            <template slot="prepend">密码</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="4">
                        <label class="el-checkbox">
                            <span class="el-checkbox_input">
                                <input type="checkbox" v-model="loginform.rememberPassword">
                            </span>
                            <span class="el-checkbox_label">
                                <span>记住密码</span>
                            </span>
                        </label>
                    </el-col>
                    <el-col :span="5" :offset="9">
                        <el-button type="primary" class="btn-login" @click="signIn()">登录</el-button>
                    </el-col>
                </el-form-item>    
            </el-form>
        </div>
    </div>
</template>

<script>
    import router from '@/router';
    import {
        alertInfo,
        setCookie,
        getCookie,
        delCookie
    } from '@/utils/daqian_tools'
    export default {
        data() {
            return {
                loginform: {
                    userName: '',
                    passWord: '',
                    rememberPassword: false
                }
            }
        },
        mounted: function () {
            //读取cookie中的账号信息，如果有accountInfo的话，则说明该用户之前勾选了记住密码的功能，则需要自动填上账号密码  
            this.loadAccountInfo();
        },
        created() {
            let that = this;
            document.onkeydown = function (e) {
                e = e ? e : window.event;
                let key = e.which ? e.which : e.keyCode;
                if (key === 13 && router.history.current.name === 'login') {
                    that.signIn();
                }
            }
        },
        methods: {
            signIn: function () {
                var userName = this.loginform.userName;
                var userPwd = this.loginform.passWord;
                var accountInfo = "";
                accountInfo = userName + "&" + userPwd;
                this.$refs['loginform'].validate((valid) => {
                    if (valid) {
                        var queryLogin = {
                            "login_account_name": this.loginform.userName,
                            "login_passwd": this.loginform.passWord
                        };
                        this.$http.post('/api/user_login', queryLogin).then(response => {
                            response = response.body;
                            var data = response.data;
                            if (data.errno === 0) {
                                //如果登录成功，则把账号信息保存在cookie当中
                                if (this.loginform.rememberPassword) {
                                    //勾选记住密码，写入cookie 
                                    setCookie('accountInfo', accountInfo, 6 * 30 * 24 * 60);
                                } else {
                                    //没有勾选记住密码，删除账号cookie
                                    delCookie('accountInfo');
                                    this.loginform.userName = "";
                                    this.loginform.passWord = "";
                                }
                                var tmpUserinfo = data.data;
                                this.$emit('userSignIn', tmpUserinfo);
                            } else if (data.errno === 1 || data.errno === 2 || data.errno === 3) {
                                alertInfo(this, 'warning', data.msg);
                            } else {
                                alertInfo(this, 'error', '登陆失败，' + data.msg);
                            }
                        });
                    }
                });
            },
            loadAccountInfo: function () {
                let accountInfo = getCookie('accountInfo');
                //如果cookie里没有账号信息  
                if (Boolean(accountInfo) == false) {
                    return false;
                } else {
                    //如果cookie里有账号信息 
                    let userName = "";
                    let passWord = "";
                    let index = accountInfo.indexOf("&");
                    userName = accountInfo.substring(0, index);
                    passWord = accountInfo.substring(index + 1);
                    this.loginform.userName = userName;
                    this.loginform.passWord = passWord;
                    this.loginform.rememberPassword = true;
                }
            }
        }
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;

    .daqian-login {
        position: absolute;
        top: 40%;
        left: 50%;
        width: 500px;
        height: 330px;
        background: #fff;
        border: 1px solid #ccc;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border-radius: 6px;

        .header {
            .logo {
                padding: 20px 0 0 0;
                text-align: center;
                font-size: 25px;
                display: block;
                line-height: 70px;
                font-weight: 400px;
                color: #2b2b2b;
            }

            .splitline {
                width: 75%;
                margin-left: 12.5%;
                height: 1px;
                text-align: center;
                border-top: 1px solid #ccc;
                margin-bottom: 20px;
            }
        }

        .login-form {
            margin: auto;
            width: 100%;

            .el-checkbox {
                position: relative;
            }

            .el-checkbox_input {
                position: absolute;
                top: 1.5px;
            }

            .el-checkbox_label {
                padding-left: 28px;
            }
        }

        .btn-login {
            width: 100%;
        }
    }

</style>
