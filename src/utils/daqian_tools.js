/**
 * @file common tools
 * @author wangchunhong<wangchunghong@baidu.com>
 */
// 遍历赋值函数
// v_s: 方法参数 1、要遍历的数组2、要赋值的对象名称3、要赋的值4、赋值的方向（子传父，父传子）
export const parentSonPassVal = function (daList, target, value, direction) {
    if (direction === 'son_parent') { // 赋值方式子-父
        daList.forEach(ele => {
            if (ele.name === target) {
                ele.objectType = value;
            }
        });
    }
};
// 发送请求时循环赋值的函数
// 参数1、要遍历的数组，参数2、选择的值去作比较
export const reQpassVal = function (daList, name) {
    for (let i = 0; i < daList.length; i++) {
        if (daList[i].name === name) {
            return daList[i].objectType;
        }
    }
};
// 转换开始日期格式
export const transformstartDate = function (date) {
    if (date) {
        let tmpdate = new Date(date);
        return tmpdate.getFullYear() + '-' + (tmpdate.getMonth() + 1) + '-' + tmpdate.getDate() + ' 00:00:00';
    } else {
        return '';
    }
};
// 转化结束日期格式
export const transformEndDate = function (date) {
    if (date) {
        let tmpdate = new Date(date);
        return tmpdate.getFullYear() + '-' + (tmpdate.getMonth() + 1) + '-' + tmpdate.getDate() + ' 23:59:59';
    } else {
        return '';
    }
};
export const transformstartDateNoTime = function (date) {
    if (date) {
        let tmpdate = new Date(date);
        let theMonth = tmpdate.getMonth() + 1;
        if (theMonth < 10) {
            theMonth = '0' + theMonth;
        }
        let theDate = tmpdate.getDate();
        if (theDate < 10) {
            theDate = '0' + theDate;
        }
        return tmpdate.getFullYear() + '-' + theMonth + '-' + theDate;
    } else {
        return '';
    }
};
// 转化结束日期格式
export const transformEndDateNoTime = function (date) {
    if (date) {
        let tmpdate = new Date(date);
        return tmpdate.getFullYear() + '-' + (tmpdate.getMonth() + 1) + '-' + tmpdate.getDate();
    } else {
        return '';
    }
};
// 去除字符串前后空格
export const trim = function (str) {
    if (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    } else {
        return str;
    }
};
// 数字格式转换
export const formatPercent = function (value) {
    if (value == null) {
        return value;
    }
    return (parseFloat(value) * 100).toFixed(2);
};

export const formatFloat = function (value) {
    if (value == null) {
        return value;
    }
    return (parseFloat(value)).toFixed(2);
};

export const format = function (value) {
    return value;
};
// x轴，y轴label格式化，超过5个字符使用省略号代替
export const formatLabel = function (value) {
    let valueTxt = '';
    if (value.length > 5) {
        valueTxt = value.substring(0, 5) + '...';
    } else {
        valueTxt = value;
    }
    return valueTxt;
};
// 数据是否为空校验
export const validateData = function (value) {
    let type = typeof (value);
    if (!value) {
        return false;
    } else if (type === 'object' && !Object.keys(value).length) {
        return false;
    } else if (type === 'Array' && !value.length) {
        return false;
    } else {
        return true;
    }
};
// 弹窗提示
export const alertInfo = function (that, type, msg, confirmCallBack) {
    that.$alert(msg, '提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        type: type,
        showClose: false
    }).then(
        () => {
            if (typeof (confirmCallBack) === 'function') {
                confirmCallBack();
            }
        }
    );
};
// 消息提示
export const messageInfo = function (that, type, msg, duration, showClose) {
    that.$message({
        message: msg,
        type: type,
        duration: duration,
        showClose: showClose
    });
};
// 非法输入提示
export const inputCheck = function (that, inputString, checkType) {
    let regex = '';
    if (checkType === 1) {
        // 查询输入框，数字，分隔符 空格
        inputString = inputString.replace(/[;]/g, '；');
        inputString = inputString.replace(/[,]/g, '，');
        regex = /^[0-9；， ]+$/;
    } else if (checkType === 2) {
        // 操作选择输入框，数字，分隔符
        inputString = inputString.replace(/[；]/g, ';');
        regex = /^[0-9;]+$/;
    } else if (checkType === 3) {
        // 操作选择输入框，数字，字母，分隔符
        inputString = inputString.replace(/[，]/g, ',');
        inputString = inputString.replace(/[；]/g, ';');
        regex = /^[a-zA-Z0-9;,]+$/;
    } else if (checkType === 4) {
        // 查询输入框，数字，字母，分隔符，星号，中英文逗号
        inputString = inputString.replace(/[;]/g, '；');
        regex = /^[a-zA-Z0-9_；* ，,]+$/;
    } else if (checkType === 5) {
        // 查询输入框，数字，星号，分隔符
        inputString = inputString.replace(/[;]/g, '；');
        inputString = inputString.replace(/[,]/g, '，');
        regex = /^[0-9； ，]+$/;
    } else if (checkType === 6) {
        // 用户账户输入框，数字，字母，下划线，短横线，@，点
        regex = /^[a-zA-Z0-9_\-.@]+$/;
    } else if (checkType === 7) {
        // 操作输入框，中文分号转化为英文分号
        inputString = inputString.replace(/[；]/g, ';');
        inputString = inputString.replace(/[，]/g, ',');
        inputString = inputString.replace(/\s+/g, ' ');
        regex = /^[0-9;,；， ]+$/;
    } else if (checkType === 8) {
        inputString = inputString.replace(/[，]/g, ',');
        regex = /^[a-zA-Z0-9_,]+$/;
    }
    if (inputString) {
        if (!inputString.match(regex)) {
            messageInfo(that, 'warning', '存在非法字符', 1000);
        }
    }
    return inputString;
};
// 表格展示数据处理
export const showDataSet = function (id, name) {
    let showString = '';
    if (validateData(name)) {
        if (validateData(id)) {
            showString = `${name}（id: ${id}）`;
        } else {
            showString = name;
        }
    } else if (validateData(id) && id !== '0') {
        showString = `id: ${id}`;
    }
    return showString;
};
// 拼接数据展示
export const showDescription = function (id, idValue, detail, detailValue) {
    let showString = '';
    showString = `${id}：${validateData(idValue) ? idValue : '无'}，
    ${detail}：${validateData(detailValue) ? detailValue : '无'}`;
    return showString;
};
// 设置cookie
export const setCookie = function (cName, value, expiremMinutes) {
    let exdate = new Date();
    exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000);
    document.cookie = cName + '=' + escape(value) + ((expiremMinutes == null) ? '' : ';expires=' + exdate.toGMTString());
};
// 读取cookie
export const getCookie = function (cName) {
    if (document.cookie.length > 0) {
        let cStart = document.cookie.indexOf(cName + '=');
        if (cStart !== -1) {
            cStart = cStart + cName.length + 1;
            let cEnd = document.cookie.indexOf(';', cStart);
            if (cEnd === -1) {
                cEnd = document.cookie.length;
            }
            return unescape(document.cookie.substring(cStart, cEnd));
        }
    }
    return '';
};
// 删除cookie
export const delCookie = function (cName) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(cName);
    if (cval !== null) {
        document.cookie = cName + '=' + cval + ';expires=' + exp.toGMTString();
    }
};
export const resize = function (val = 102) {
    let fnc = function () {
        if (document.getElementsByClassName('more')[0]) {
            document.getElementsByClassName('more')[0].style.display = 'none';
            let ele = document.getElementsByClassName('selectArea')[0].scrollHeight;
            if (ele === val) {
                document.getElementsByClassName('more')[0].style.display = 'none';
            } else {
                document.getElementsByClassName('more')[0].style.display = 'flex';
            }
        }
    };
    fnc();
    window.addEventListener('resize', fnc);
};
// 将包含中英文长度的字符串，按照一定长度截取为多个子字符串
export const getSubString = function (str, len) {
    let regexp = /[^\x00-\xff]/g; // 正在表达式匹配中文
    // 当字符串字节长度小于指定的字节长度时
    if (str.replace(regexp, 'aa').length <= len) {
        return str;
    }
    // 假设指定长度内都是中文
    let m = Math.floor(len / 2);
    for (let i = m, j = str.length; i < j; i++) {
        // 当截取字符串字节长度满足指定的字节长度
        if (str.substring(0, i).replace(regexp, 'aa').length >= len) {
            // return [str.substring(0, i), str.substring(i, str.length + 1)];
            // getSubString(str.substring(i, str.length + 1), len);
            return str.substring(0, i) + ',' + getSubString(str.substring(i, str.length + 1), len);
        }
    }
};
// 保留小数点5位
export const formatFloat5Value = function (value) {
    if (value == null) {
        return value;
    }
    return (parseFloat(value * 1)).toFixed(5);
};
