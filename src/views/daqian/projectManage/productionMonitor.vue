<template>
    <div class="productionMonitor">
        <div class="selectArea">
            <div class="selectDiv">
                <span class="align-right">所属主项目：</span>
                 <selectMainProject @selectChange="projectChange" default="true" :projectId="search.mainProjectID"
                            @init="getProjectList" clearable>
                        </selectMainProject>
            </div>
            <div class="selectDiv">
                <span class="align-right">项目状态：</span>
                <el-select v-model="search.project_status" placeholder="全部" size="medium" @change="projectStatusChange">
                    <template>
                        <el-option v-for="(item,index) in this.projectStatus" :key="index" :value="index" :label="item"></el-option>
                    </template>
                </el-select>
            </div>
        </div>
        <div class="progeressArea h300">
            <div class="figureArea w37 h300">
                <div>
                    <h4 class="chart-title">外业进度监控</h4>
                </div>
                <div id="carPlanProgressDiv" class="figureStyle h250" style="display:block"></div>
                <div id="carPlanProgressDivNoDataDiv" class="figureStyle h250 no-data-text" style="display:none"></div>
            </div>
            <div class="figureArea w45 h300">
                <div>
                    <h4 class="chart-title">生产进度监控</h4>
                </div>
                <div id="projectProgressDiv" class="figureStyle h250" style="display:block"></div>
                <div id="projectProgressDivNoDataDiv" class="figureStyle h250 no-data-text" style="display:none"></div>
            </div>
            <div class="figureArea w16 h300 margin-right-none">
                <div>
                    <h4 class="chart-title">预处理详情</h4>
                </div>
                <div class="top10">
                    <template>
                        <span class="info-span" v-if="this.paintType[5].infoData.length">外业任务</span>
                        <p class="info-p" v-for="(item,index) in this.paintType[5].infoData" :key="index" v-if="index < 2">{{item.field}}：<span
                                class="size-16">{{item.value}}</span>个</p>
                        <!-- </template>
                    <template> -->
                        <span class="info-span" v-if="this.paintType[5].infoData.length">网格</span>
                        <p class="info-p" v-for="(item,index) in this.paintType[5].infoData" :key="index" v-if="index >= 2">{{item.field}}：<span
                                class="size-16">{{item.value}}</span>个</p>
                    </template>
                </div>
            </div>
        </div>
        <div class="progeressArea h350">
            <div class="figureArea w27 h350">
                <h4 class="chart-title">项目整体异常监控</h4>
                <div id="projectAbnormalDiv" class="figureStyle h300" style="display:block"></div>
                <div id="projectAbnormalDivNoDataDiv" class="figureStyle h300 no-data-text" style="display:none"></div>
            </div>

            <div class="figureArea w72 h350 margin-right-none">
                <div>
                    <h4 class="chart-title">项目异常类型分布</h4>
                </div>
                <div id="projectAbnormalDistributeDiv" class="figureStyle h300" style="display:block"></div>
                <div id="projectAbnormalDistributeDivNoDataDiv" class="figureStyle h300 no-data-text" style="display:none"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        trim,
        transformstartDate,
        transformEndDate,
        formatPercent
    } from '@/utils/daqian_tools'
    import {
        paintNoData,
        cancelPaintNoData
    } from '@/utils/daqian_nodata_response'
    import Vue from 'vue'
    import echarts from 'echarts';
    import selectMainProject from "@/components/daqian_selectMainProject.vue";
    export default {
        components: {
            selectMainProject
        },
        data() {
            return {
                accessDisabled: false,
                search: {
                    inProjectName: '',
                    mainProjectID: '',
                    selectCity: '',
                    //selectMergeState: '',
                    //selectPostconditioningState: '',
                    planTime: [],
                    startTime: '',
                    endTime: '',
                    sort_field_name: 'sub_project_id desc',
                    project_status: "3"
                },
                  projectStatus: {
                    "0": "全部",
                    "3": "进行中",
                    "4": "完结",
                    "5": "作废",
                    "6": "暂停"
                  },
                projectList: [],
                paintType: {
                    1: {
                        dataKey: 'wy_overall_statistics_info',
                        divId: 'carPlanProgressDiv',
                        seriesName: '外业任务',
                        memo: '异常指存在失败或不通过状态'
                    },
                    2: {
                        dataKey: 'sub_project_overall_statistics_info',
                        divId: 'projectAbnormalDiv',
                        seriesName: '子项目',
                        memo: '异常指存在失败或不通过状态'
                    },
                    3: {
                        dataKey: 'sub_project_abnormal_statistics_info',
                        divId: 'projectAbnormalDistributeDiv',
                        titleText: '项目异常类型分布',
                        xAxisName: '异常类型',
                        seriesName: '子项目',
                        memo: '异常指存在失败或不通过状态'
                    },
                    4: {
                        dataKey: 'sub_project_process_statistics_info',
                        divId: 'projectProgressDiv',
                        seriesName: '子项目',
                        memo: '生产进度指子项目内网格到达的最远环节'
                    },
                    5: {
                        dataKey: 'ycl_overall_statistics_info',
                        infoData: []
                    }
                }
            }
        },
        computed: {
            tableData: function () {
                for (var val of this.subprojectData) {
                    if (val.caiji_status === "1") {
                        val.show_caiji_status = "未开始";
                    } else if (val.caiji_status === "2") {
                        val.show_caiji_status = "采集中";
                    } else if (val.caiji_status === "3") {
                        val.show_caiji_status = "采集完成";
                    } else if (val.caiji_status === "4") {
                        val.show_caiji_status = "暂停";
                    }
                    if (val.sub_project_type === "2") {
                        val.show_sub_project_type = "多任务流程";
                    } else if (val.sub_project_type === "1") {
                        val.show_sub_project_type = "单任务流程";
                    }
                }
                return this.subprojectData.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
            }
        },
        mounted() {
            this.initSearchData();
            this.accessDisabled = eval(sessionStorage.roteAuthotity);
            //30秒查询一次
            this.intervalid = setInterval(() => {
                this.initSearchData();
            }, 60000);
        },
        beforeDestroy() {
            clearInterval(this.intervalid);
        },
        methods: {
            initSearchData: function () {
                for (var index in this.paintType) {
                    this.searchInfos(index);
                }
            },
            getProjectList: function (val) {
                this.projectList = val;
            },
            projectChange: function (val,all) {
                this.search.mainProjectID = val;
                this.searchInfos('2');
                this.searchInfos('3');
                this.searchInfos('4');
            },
            projectStatusChange: function (val) {
                this.search.project_status = val;
                this.searchInfos('2');
                this.searchInfos('3');
                this.searchInfos('4');
            },
            searchInfos: function (searchType) {
                var queryMonitorInfos = {
                    "user_id": sessionStorage.userid,
                    "project_id": this.search.mainProjectID,
                    "monitor_type": searchType,
                    "query_or_export_data": 0,
                    "project_status": this.search.project_status
                };

                this.$http.post('/api/query_monitor_info', queryMonitorInfos).then(response => {
                    response = response.body;
                    let data = response.data;
                    if (data.errno === 0) {
                        this.paintType[searchType].totalNumber = 0;
                        let info_data = data.data[this.paintType[searchType].dataKey];
                        for (var val of info_data) {
                            this.paintType[searchType].totalNumber += val.value;
                            val.name = val.field;
                        }
                        let total_number = this.paintType[searchType].totalNumber;
                        let projectName = ''
                        if (searchType !== '1') {
                            if (this.search.mainProjectID !== '') {
                                // debugger
                                for (let val of this.projectList) {
                                    if (this.search.mainProjectID === val.value) {
                                        projectName = val.label;
                                    }
                                }
                            } else {
                                projectName = '全部主项目';
                            }
                            if (this.search.project_status == "") {
                                projectName += `(状态：全部)`
                            } else {
                                projectName += `(状态：${this.projectStatus[this.search.project_status]})`
                            }
                        }
                        if (searchType === '3') {
                            if (this.paintType[searchType].divId) {
                                let div_id = this.paintType[searchType].divId;
                                let title_text = this.paintType[searchType].titleText;
                                let xAxis_name = this.paintType[searchType].xAxisName;
                                let series_name = this.paintType[searchType].seriesName;
                                let memo = this.paintType[searchType].memo;
                                cancelPaintNoData(div_id);
                                this.paintInfoBarFigure(div_id, title_text, memo, xAxis_name, series_name,
                                    info_data, projectName);
                            }
                        } else if (searchType === '5') {
                            this.paintType[searchType].infoData = info_data;
                        } else {
                            if (this.paintType[searchType].divId) {
                                let div_id = this.paintType[searchType].divId;
                                let series_name = this.paintType[searchType].seriesName;
                                let memo = this.paintType[searchType].memo;
                                cancelPaintNoData(div_id);
                                this.paintInfoPieFigure(div_id, series_name, memo, info_data, total_number,
                                    projectName);
                            }
                        }
                    } else {
                        if (searchType !== '5') {
                            if (this.paintType[searchType].divId) {
                                let div_id = this.paintType[searchType].divId;
                                paintNoData(div_id, data.errno);
                            }
                        }
                    }
                }, response => {
                    // 响应错误回调
                    if (searchType !== '5') {
                        if (this.paintType[searchType].divId) {
                            let div_id = this.paintType[searchType].divId;
                            paintNoData(div_id);
                        }
                    }
                });
            },
            paintInfoPieFigure: function (div_id, series_name, memo, info_data, total_number, project_name) {
                if (document.getElementById(div_id)) {
                    var charts = echarts.init(document.getElementById(div_id));
                    var option = {
                        title: [{
                            text: project_name,
                            textStyle: {
                                //    color: '#3b3b3b',          // 副标题文字颜色
                                fontSize: 14,
                            },
                            subtext: series_name + '总数：' + ' {b|' + total_number + '}个',
                            // x: 'left',
                            // y: 'top',
                            top: 0,
                            left: 0,
                            // bottom: '10%',
                            subtextStyle: {
                                //    color: '#3b3b3b',          // 副标题文字颜色
                                fontSize: 12,
                                rich: {
                                    b: {
                                        fontSize: 16,
                                        color: '#3b3b3b'
                                        // lineHeight: 33
                                    },
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#334455',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }

                            }
                        }, {
                            subtext: memo,
                            // left: '5%',
                            left: '8%',
                            y2: '8%'
                        }],
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c}个 ({d}%)"
                        },
                        legend: {
                            orient: 'ori',
                            x: 'right',
                            y: 'top',
                            //top: 30,
                            formatter: function (name) {
                                var total = 0;
                                var target;
                                for (var val of info_data) {
                                    total += val.value;
                                    if (val.name == name) {
                                        target = val.value;
                                    }
                                }
                                if (total) {
                                    return name + ' {b|' + target + '}个 ' + '{per|' + formatPercent(target /
                                        total) + '%}';
                                } else {
                                    return name + ' {b|' + target + '}个 ' + '{per|' + '0.00%}';
                                }
                            },
                            textStyle: {
                                rich: {
                                    b: {
                                        fontSize: 14,
                                        // lineHeight: 33
                                    },
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#334455',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        },
                        series: [{
                            name: series_name,
                            type: 'pie',
                            selectedMode: 'single',
                            center: ['27%', '50%'],
                            radius: ['35%', '55%'],
                            avoidLabelOverlap: true,
                            // labelLine: {
                            //     normal: {
                            //         length: 20,
                            //         length2: 40
                            //     }
                            // },
                            label: {
                                normal: {
                                    show: false,
                                    //formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                    formatter: '{b|{b}：}{c}{per|{d}%}  ',
                                    //formatter: '{b|{b}：}{c}  \n {per|{d}%}  ',
                                    //position: 'inner',
                                    backgroundColor: '#eee',
                                    borderColor: '#aaa',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    // shadowBlur:3,
                                    // shadowOffsetX: 2,
                                    // shadowOffsetY: 2,
                                    // shadowColor: '#999',
                                    // padding: [0, 7],
                                    rich: {
                                        a: {
                                            color: '#999',
                                            lineHeight: 22,
                                            align: 'center'
                                        },
                                        // abg: {
                                        //     backgroundColor: '#333',
                                        //     width: '100%',
                                        //     align: 'right',
                                        //     height: 22,
                                        //     borderRadius: [4, 4, 0, 0]
                                        // },
                                        hr: {
                                            borderColor: '#aaa',
                                            width: '100%',
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 14,
                                            lineHeight: 33
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            },
                            data: info_data
                        }]

                    };
                    charts.clear();
                    charts.setOption(option, true);
                }
            },
            paintInfoBarFigure: function (div_id, title_text, memo, xAxis_name, series_name, info_data, project_name) {
                if (document.getElementById(div_id)) {
                    var charts = echarts.init(document.getElementById(div_id));
                    var option = {
                        title: [{
                            text: project_name,
                            textStyle: {
                                //    color: '#3b3b3b',          // 副标题文字颜色
                                fontSize: 14,
                            },
                        }, {
                            subtext: memo,
                            // left: '5%',
                            left: '8%',
                            // x: 'left',
                            y2: '3%'
                        }],
                        dataset: {
                            dimensions: ['field', 'value'],
                            source: info_data
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            },
                            formatter: function (params) {
                                return params[0].name + '</br>' + params[0].seriesName + '：' + params[0].data
                                    .value + '个';
                            }
                        },
                        grid: {
                            x: 80,
                            y: 70,
                            x2: 80,
                            y2: 90,
                            borderWidth: 1
                        },
                        xAxis: {
                            type: 'category',
                            name: xAxis_name,
                            //nameLocation: 'center',
                            //nameGap: 25,
                            axisLabel: {
                                interval: 0,
                                rotate: -30,
                            }
                        },
                        yAxis: {
                            type: 'value',
                            name: series_name + '（个）',
                            //data: yAxis_data
                        },
                        series: {
                            name: series_name,
                            type: 'bar',
                            barWidth: '50%',
                            barMaxWidth: 40,
                            //data: info_data
                            encode: {
                                // 将 "field" 列映射到 X 轴。
                                x: 'field',
                                // 将 "value" 列映射到 Y 轴。
                                y: 'value'
                            }
                        }
                    };

                    charts.clear();
                    charts.setOption(option, true);

                }
            }
        }
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    $width: 100%;
    $height: 100%;

    .productionMonitor {
        height: $height;
        width: $width;

        .selectArea {
            margin-top: 0px;
            margin-bottom: 10px;
            width: $width;
            background: #fff;
            min-height: 50px;
            padding-top: 20px;
            opacity: 1;
            overflow: hidden;
        }

        .selectDiv {
            float: left;
            margin: 0 20px 15px 10px;
        }

        .align-right {
            text-align: right;
            min-width: 50px;
            display: inline-block;
            margin-left: 20px;
        }

        .progeressArea {
            width: $width;
        }

        .h350 {
            height: 330px;
        }

        .h300 {
            height: 280px;
        }

        .h250 {
            height: 250px;
        }

        .h200 {
            height: 200px;
        }

        .figureArea {
            float: left;
            margin: 0 1% 20px 0;
            background: #fff;
            opacity: 1;
        }

        .figureAreaBg {
            background: #fff;
            opacity: 1;
        }

        .w100 {
            width: 100%;
        }

        .w45 {
            width: 43%;
        }

        .w37 {
            width: 39%;
        }

        .w16 {
            width: 16%;
        }

        .w62 {
            width: 62%;
        }

        .w27 {
            width: 34%;
        }

        .w72 {
            width: 65%;
        }

        .margin-right-none {
            margin-right: 0 !important;
        }

        .chart-title {
            color: #293c55;
            overflow: hidden;
            font-weight: bolder;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 10px 10px 2px 10px;
            margin: 0;
            text-align: left;
            //font-weight: normal;
            font-size: 16px;
        }

        .info-p {
            // color: #aeaeae;
            color: #3b3b3b;
            font-size: 12px;
            text-align: left;
            line-height: 40px;
            padding-left: 30px;
        }

        .info-span {
            color: #3b3b3b;
            font-size: 14px;
            text-align: left;
            font-weight: bold;
            display: block;
            padding-left: 15px;
        }

        .size-16 {
            font-size: 16px;
            color: #3b3b3b;
        }

        .top10 {
            margin-top: 20px;
        }

        .figureStyle {
            margin: 0px 10px 0px 10px;
            padding-top: 10px;
        }

        .no-data-text {
            text-align: center;
            line-height: 290px;
        }

        .figureSelectDiv {
            height: 30px;
            width: 100%;
            margin: 0 0px 10px 30px;
        }

        .figureSelect {
            // float: right;
            width: 170px;
            margin-left: 10px;
        }

    }

</style>
