<template>
    <!-- v_s 经度和维度 -->
    <div>
        <div class="selectDiv" v-for="ele in datas" :key="ele.name">
            <span class="align-right">{{ele.name+'：'}}</span>
            <el-popover class="input-style-1" placement="bottom-start" :title="ele.tips" trigger="focus" :content="ele.value">
                <el-input class="input-style-1" slot="reference" size="medium" v-model="ele.value" clearable placeholder="请输入...">
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
$width: 100%;
$height: 100%;
.selectDiv {
    float: left;
    margin: 0 0 15px 25px;
}
.input-style {
    display: inline-block;
    margin-right: 82px;
    width: 400px;
}

.input-style-1 {
    display: inline-block;
    width: 300px;
}
</style>
