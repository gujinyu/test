<template>
    <div class="selectDivBox">
        <!-- v_s: 下拉菜单封装 -->
        <div v-for="(ele,index) in myforArrSelect" :key="index">
            <span>{{ele.name+'：'}}</span>
            <el-select class="input-style-1" v-model="ele.objectType" placeholder="请选择" size="medium">
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
        computed: {
            myforArrSelect: {
                get()　{
                    return this.forArrSelectDiv
                }
            }
        }
    }
</script>

<style>
.selectDivBox {
    float: left;
    margin: 0 0 15px 30px;
}

.input-style-1 {
    display: inline-block;
    width: 240px;
}
</style>