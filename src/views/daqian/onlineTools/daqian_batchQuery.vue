<template>
  <div class="dialogBox">
    <el-dialog class="importCsv" :title="importCsvViewTitle" :visible.sync="boxShowHidd" center :before-close="uploadHedden" :close-on-click-modal="false" width="450px" >
        <el-upload class="upload-demo" ref="upload" drag :limit="1" :on-exceed="handleExceed" :before-upload="beforeUploadSourceFile" accept=".csv" :on-remove="removeFile" :file-list="sourceFileList" action >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <div class="el-upload__tip boxStyle" slot="tip">只能上传csv文件 ( 表结构：经度、纬度 )，且文件大小不超过1M</div>
            <div class="el-upload__tip boxStyle" slot="tip">共上传{{num}}条有效记录</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="importQcRule" style="margin-right:30px">确定</el-button>
            <el-button @click="uploadHedden">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import CSV from "comma-separated-values";
import { wgsToTileID } from "@/utils/mesh.js";
import { alertInfo} from "@/utils/daqian_tools";
export default {
    props: ["importCsvView"],
    data() {
        return {
            importCsvViewTitle: "",
            sourceFileList: [],
            lonIndex: -1,
            dimIndex: -1,
            tile_levelIndex11: -1,
            tile_levelIndex13: -1,
            num: 0,
        };
    },
    computed:{
        boxShowHidd: {
            get() {
                return this.importCsvView
            },
            set() {
                // 数据导入成功后关闭弹窗
                this.uploadHedden();
            }
        }
    },
    watch: {
        boxShowHidd (val) {
            if(val == false){
                this.$refs.upload.clearFiles();
            }
        } 
    },

    methods: {
        handleExceed: function() {
            this.$message.warning(`当前限制选择 1 个文件,如果要上传其他文件请将已选择的文件删除`);
        },
        uploadHedden: function() {
            this.num = 0;
            this.$emit("uploadHedden");
        },
        parseCSV: function(str) {
            // v_s:获取到Excel表格中的全部数据
            //   str = str.replace(/[，]/g, ",");
            const data = new CSV(str, {
                header: false,
                cellDelimiter: ","
            }).parse();
            const len = data.length;
            const result = [];
            for (let i = 0; i < len; i += 1) {
                const row = [];
                const size = data[i].length;
                for (let j = 0; j < size; j += 1) {
                    row.push(data[i][j].toString().trim());
                }
                result.push(row);
            }
            return result;
        },
        beforeUploadSourceFile: function(file) {
            this.sourceFileList = [];
            if (file.size > 1024 * 1024) {
                alertInfo(this, "error", "CSV 文件过大", 2000);
                return false;
            }
            this.sourceFileList.push({
                name: file.name
            });
            const fileReader = new FileReader();
            fileReader.readAsText(file, "gb2312");
            fileReader.onload = e => {
                const csvData = e.target.result;
                const data = this.parseCSV(csvData);
                if (!data) {
                    alertInfo(this, "error", "CSV 文件解析失败", 1500);
                    return false;
                }
                if (data.length === 0) {
                    return alertInfo(this, "error", "数据文件不包含数据", 1500);
                }
                let array = data.slice(1);
                data[0].forEach((ele, index) => {
                    if (ele == "经度") {
                        this.lonIndex = index;
                    }
                    if (ele == "纬度") {
                        this.dimIndex = index;
                    }
                });
                array.forEach( ele=> {
                    if(-180<ele[this.lonIndex]&&ele[this.lonIndex]<180&&-90<ele[this.dimIndex]&&ele[this.dimIndex]<90) {
                        this.num ++ ;
                    }
                })
                this.csv_data = data;
            };
            return false;
        },
        removeFile: function(file, fileList) {
            this.num = 0;
            this.csv_data = [];
        },
        importQcRule: function() {
            // 导入经纬度
            if (this.sourceFileList.length == 0) {
                alertInfo(this, "warning", "请选择上传文件", 2000);
                return;
            } else if (this.csv_data.length == 0) {
                alertInfo(this, "warning", "文件信息为空", 2000);
                return;
            }
            // 关闭弹窗的数据赋值
            this.boxShowHidd = false;
            this.csv_data[0].forEach((ele, index) => {
                if (ele == "经度") {
                    this.lonIndex = index;
                }
                if (ele == "纬度") {
                    this.dimIndex = index;
                }
            });
            // v_s:判断导入的csv表格中是否有经度和纬度选项
            if(this.lonIndex == -1 || this.dimIndex == -1){
                return alertInfo(this, "error", "导入的CSV表格中必须要有 ‘经度’ 和 ‘纬度’ 表头");
            }
            let arr = this.csv_data.splice(1);
            let objData = [];
            let require = true; // 开闭原则判断是否要执行reqFun方法调用
            arr.forEach(ele => {
                // 判断坐标是否正确
                if(-180<ele[this.lonIndex]&&ele[this.lonIndex]<180&&-90<ele[this.dimIndex]&&ele[this.dimIndex]<90){
                    // 经纬度组成的对象
                    let lngLat = { lng: ele[this.lonIndex], lat: ele[this.dimIndex] };
                    // 11级对应的网格编号
                    let tatleList = wgsToTileID(lngLat, 11)+'';
                    // 13级对应的网格编号
                    let tatleList13 = wgsToTileID(lngLat, 13)+'';
                    objData.push({ tatleList, lng: ele[this.lonIndex], lat: ele[this.dimIndex], tatleList13 });
                }else{
                    require = false;
                    // 如果有多条不在查询范围内的只会报第一条
                    return alertInfo(this, "error", "经度："+ele[this.lonIndex]+'，'+"纬度："+ele[this.dimIndex]+"不在可查询范围内，请修改后再试！");
                }
            });
            if(require){
                this.$emit("reqFun", objData);
            }
        }
    }
};
</script>

<style scoped>
.upload-demo {
    width: 356px;
    margin: auto;
}
.boxStyle{
    text-align: center;
}
</style>
