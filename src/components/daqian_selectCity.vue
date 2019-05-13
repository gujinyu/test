<template>
    <el-cascader :options="cityOptions" v-model="selectedCitys" size="medium" placeholder="全部" filterable @change="searchCityChange"
        :clearable="isClearable" :render-format="format" :show-all-levels="false"> 
    </el-cascader>
</template>

<script>
    var cityData = require('../common/citydata.json');
    export default {
        props: {
            resetselectCityData: false,
            isClearable: true
        },
        data() {
            return {
                selectCity: '',
                cityOptions: cityData.children,
                selectedCitys: []
            }
        },
        watch: {
            resetselectCityData: function (val, oldVal) {
                if (val) {
                    this.selectedCitys = [];
                    this.$emit('updateCityStatus', false);
                }
            }
        },
        methods: {
            searchCityChange: function (val) {
                if (val.length == 2) {
                    this.selectCity = val[1];
                } else if (val.length == 1) {
                    this.selectCity = val[0];
                } else {
                    this.selectCity = '';
                }
                this.selectedCitys = val;
                this.$emit("selectCitys", this.selectCity);
            },
            format(labels, selectedData) {
                const index = labels.length - 1;
                const data = selectedData[index] || false;
                if (data && data.code) {
                    return labels[index];
                }
                return labels[index];
            }
        }
    }
</script>