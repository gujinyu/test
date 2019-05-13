<template>
    <!-- v_s 经度和维度 -->
    <div>
        <div class="selectDiv" v-for="ele in datas" :key="ele.name">
            <span class="align-right">{{ele.name+'：'}}</span>
            <el-popover class="input-style-1" placement="bottom-start" :title="ele.tips" trigger="focus" :content="ele.value">
                <el-input class="input-style-1" slot="reference" size="medium" v-model="ele.value" clearable :placeholder="ele.placeholder">
                </el-input>
            </el-popover>
        </div>
    </div>
</template>

<script>
export default {
    props: ["coordinate"],
    computed: {
        datas: {
            get()　{
                return this.coordinate
            }
        }
    }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.selectDiv {
    float: left;
    margin: 0 0 5px 25px;
}

.input-style-1 {
    display: inline-block;
    width: 300px;
}
</style>
