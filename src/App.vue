<template>
    <div id="app">
        <router-view @userSignIn="userSignIn"></router-view>
    </div>
</template>

<script>
    import router from './router';
    export default {
        name: 'app',
        created() {
            this.init();
        },
        beforeUpdate() {
            this.init();
        },
        methods: {
            userSignIn: function (userinfo) {
                if (userinfo) {
                    sessionStorage.userid = userinfo.user_id;
                    sessionStorage.userrole = userinfo.user_role;
                    sessionStorage.username = userinfo.user_name;
                    sessionStorage.user_headman_id = userinfo.user_headman_id;
                    sessionStorage.user_permission = userinfo.user_permission;
                    if (sessionStorage.userrole == 5) {
                        sessionStorage.roteAuthotity = false;
                    } else {
                        sessionStorage.roteAuthotity = true;
                    }
                }
                if (sessionStorage.userid) {
                    router.push({
                        name: 'index'
                    });
                } else {
                    router.push({
                        name: 'login'
                    });
                }
            },
            init: function () {
                if (router.history.current.name) {
                    router.push({
                        name: router.history.current.name
                    });
                } else {
                    router.push({
                        name: 'login'
                    });
                }
            }
        }
    }

</script>

<style lang="scss" rel="stylesheet/scss">
    #app {
        font-family: Arial, Microsoft Yahei, \\5FAE\8F6F\96C5\9ED1, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 0px;
        background-color: #fff;
        font-size: 14px;
        width: 100%;
        min-width: 1080px;
    }

    /*链接样式*/
    a {
        color: #7e8c8d;
        display: block;
    }

    /** 修改iview 组件样式*/
    .ivu-input {
        border: 1px solid #bfcbd9;
    }

    .ivu-cascader .ivu-cascader-menu-item {
        font-size: 14px !important;
    }
    .el-tooltip__popper{
        max-width: 300px;
        overflow-wrap: break-word;
    }
    .ivu-cascader {
        display: inline-block;
    }

    .ivu-select-dropdown,
    .ivu-cascader-label {
        text-align: left;
    }

    /** 修改element-ui组件样式*/
    .el-transfer-panel__list {
        float: left;
    }

    .el-transfer-panel__item {
        float: left;
        min-width: 100px;
    }

    .el-transfer-panel__item .el-checkbox__input {
        text-indent: -60px;
    }

    .el-transfer-panel .el-transfer-panel__footer .el-checkbox {
        /* padding-left: 20px; */
        padding-right: 20px;
        color: #8391a5;
    }

    .el-date-editor--daterange.el-input,
    .el-date-editor--daterange.el-input__inner,
    .el-date-editor--timerange.el-input,
    .el-date-editor--timerange.el-input__inner {
        width: 100%;
    }

    .el-table th>.cell {
        font-weight: bold;
        color: #234677;
        text-align: center;
    }

    .el-table th {
        background-color: #fff;
    }

    body .el-table th.gutter {
        display: table-cell !important;
    }

    body .el-table colgroup.gutter {
        display: table-cell !important;
    }

    .el-table__empty-block {
        min-height: 150px;
    }

    .el-table__empty-text {
        width: 160px;
        text-align: center;
        position: absolute;
        left: 50%;
        margin-left: -80px;
        font-weight: bold;
    }
    /* 解决element-ui 升级到2.7.0版本的时候，表格文字不居中的问题 */
    .el-table .cell{
        text-align: center;
    }
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table__body tr.hover>td {
        background-color: initial !important;
    }

    .el-table__body tr.current-row>td {
        background-color: initial !important;
    }

    .form-table .el-table__empty-text {
        left: 50%;
        font-weight: bold;
    }

    .el-form-item__content {
        text-align: center;
    }

    .el-message-box__status+.el-message-box__message {
        word-break: break-all;
    }

    /** 修改bmap组件样式*/
    .BMap_cpyCtrl a,
    .sel_city_hotcity a,
    #sel_city_letter_list a {
        display: inline !important;
    }
    .citylist_popup_main .city_content_top {
        padding-top: 6px !important;
    }
    #city_ctrl_form {
        top: 5px !important;
    }
    .el-cascader-menu::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
    }
    .el-cascader-menu::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        height: 10px;
    }
    .el-cascader-menu::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        border-radius: 20px;
    }
    /** 修复全局loading的时候页面内容会隐藏*/
    #body {
        position: static !important;
    }
</style>
