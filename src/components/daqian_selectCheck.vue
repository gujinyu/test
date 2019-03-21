<template>
    <div>
        <!-- v_s: 下拉菜单封装 -->
        <div class="selectDivComponents" v-for="(ele,index) in forArrSelectDiv" :key="index">
            <span class="align-left">{{ele.name+'：'}}</span>
            <el-select v-model="comObjectType" @change="changeEvent" placeholder="请选择" size="medium">
                <template>
                    <el-option v-for="(item,index) in ele.AllTypesSelect" :key="index" :value="index" :label="item"></el-option>
                </template>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['forArrSelectDiv'],
        data() {
            return {
                comObjectType: '', // 目标状态的v-model值
            }
        },
        created() {
            this.loop();
        },
        watch: {
            forArrSelectDiv: { // v_s: 监听数据改变
                handler(newVal) {
                    this.loop(newVal);
                },
                deep: true
            }
        },
        methods: {
            changeEvent: function () {
                this.$emit('changeEvents', this.comObjectType)
            },
            loop: function (newVal=this.forArrSelectDiv) {
                newVal.forEach(ele => {
                    if (ele.name == '项目状态') {
                        this.comObjectType = ele.objectType;
                    }
                })
            }
        }
    }
</script>

<style>
    .selectDivComponents {
        float: left;
        margin: 0 20px 15px 10px;
    }

    .align-left {
        text-align: right;
        min-width: 50px;
        margin-left: 20px;
        display: inline-block;
    }
</style>