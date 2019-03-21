<template>
    <div class="table-div">
        <!-- 表格组件 -->
        <el-table :data="updateData" border style="width: 100%">
            <el-table-column type="index" label="编号" width="100">
            </el-table-column>
            <el-table-column v-for="ele in dataList" :key="ele" :label="ele">
                <template slot-scope="scope">{{ scope.row[ele] }}</template>
            </el-table-column>
        </el-table>
        <!-- 表格组件 -->
    </div>
</template>

<script>
export default {
    props: ['tableData','dataList','english'],
    data() {
        return {
            myTableData: [], // 表格显示的内容
        };
    },
    computed: {
        updateData: {
            get() {
                this.myTableData = [];
                this.tableData.forEach(ele => {
                    let obj = {};
                    this.dataList.forEach((val,i) => {
                        obj[val] = ele[this.english[i]];
                    })
                    this.myTableData.push(obj)
                });
                return this.myTableData;
            },
        },
    }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
$width: 100%;
$height: 100%;
.table-div {
    width: 95%;
    margin: 0 auto;
}

</style>
