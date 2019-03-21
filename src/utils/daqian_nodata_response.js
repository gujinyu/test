/**
 * @file 绘制图像时，若无数据或查询失败的处理方法
 * @author wangchunhong<wangchunghong@baidu.com>
 */
/**
 * @param {string} divID 要绘制图形的div的ID
 * @param {number} errno 查询数据返回的错误码
 */
// 绘制无数据或查询失败的图形
export const paintNoData = function (divID, errno) {
    let noDataDivID = divID + 'NoDataDiv';
    if (document.getElementById(divID)) {
        document.getElementById(divID).style.display = 'none';
    }
    if (document.getElementById(noDataDivID)) {
        document.getElementById(noDataDivID).style.display = 'block';
        if (errno === 7) {
            document.getElementById(noDataDivID).innerHTML = '暂无数据';
        } else {
            document.getElementById(noDataDivID).innerHTML = '查询失败';
        }
    }
};
// 取消绘制无数据或查询失败的图形
export const cancelPaintNoData = function (divID) {
    let noDataDivID = divID + 'NoDataDiv';
    if (document.getElementById(divID)) {
        document.getElementById(divID).style.display = 'block';
    }
    if (document.getElementById(noDataDivID)) {
        document.getElementById(noDataDivID).style.display = 'none';
    }
};