<template>
    <!-- v_s 普通输入框 -->
    <div class="selectDivBox">
        <div v-for="ele in datas" :key="ele.name">
            <span>{{ele.name+'：'}}</span>
            <el-input class="input-style-1" slot="reference" size="medium" :disabled="ele.disabled" v-model="ele.value" clearable :placeholder="ele.tips">
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    props: ["rendDatas"],
    computed: {
        datas: {
            get()　{
                return this.rendDatas
            }
        }
    }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;
.selectDivBox {
    float: left;
    margin: 0 0 15px 30px;
}

.input-style-1 {
    display: inline-block;
    width: 240px;
}
</style>
