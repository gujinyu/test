<template>
    <el-select @change="$emit('selectChange', $event)" size="medium" v-model="mainProjectID" :clearable="clearable"
        :placeholder="placeholder">
        <template>
            <el-option v-for="item in this.allMainProjectIDs" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </template>
    </el-select>
</template>
<script>
    import Vue from 'vue'
    import router from '@/router';
    export default {
        props: {
            default: true,
            defaultValue: 0,
            projectId: 0,
            clearable: true,
            placeholderValue: ""
        },
        data() {
            return {
                mainProjectID: "",
                placeholder: "全部",
                allMainProjectIDs: []
            }
        },
        created() {
            if (this.placeholderValue) {
                this.placeholder = this.placeholderValue;
            }
        },
        mounted() {
            this.getProjectList();
        },
        watch: {
            projectId: function (newVal) {
                this.mainProjectID = newVal;
            }
        },
        methods: {
            reset: function () {
                this.mainProjectID = Number(this.allMainProjectIDs[0].value);
                this.$emit("selectChange", this.mainProjectID);
            },
            getProjectList: function () {
                this.$http
                    .post("/api/query_project_info", {
                        user_id: sessionStorage.userid,
                        query_type: 1
                    })
                    .then(response => {
                        response = response.body
                        var data = response.data
                        if (data.errno === 0) {
                            let arr = [];
                            for (let val of data.data.project_list) {
                                arr.push({
                                    label: val.project_name,
                                    value: Number(val.project_id)
                                })
                            }
                            this.allMainProjectIDs = arr;
                            if (!this.default) {
                                if (arr.length > 0) {
                                    if (this.defaultValue) {
                                        this.mainProjectID = Number(this.defaultValue);
                                    } else {
                                        this.mainProjectID = Number(arr[0].value);
                                    }
                                    this.$emit("selectChange", this.mainProjectID);
                                }
                            }
                            this.$emit("init",arr);
                        } else {
                            this.$message({
                                message: "获取项目列表失败" + data.errno,
                                type: "error",
                                duration: 2000
                            });
                        }
                    })
            }
        }
    }

</script>
