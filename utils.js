// 创建dom元素
function createEle (eleName,classArr,styleObj) {
    var dom = document.createElement(eleName);

    for(var i = 0; i < classArr.length; i ++) {
        dom.classList.add(classArr[i]);
    };

    for(var key in styleObj) {
        dom.style[key] = styleObj[key];
    };

    return dom;
};

// 存取数据
// 存
function setLocal (key,value) {
    if(typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key,value);
};
//取
function getLocal (key) {
    var value = localStorage.getItem(key);
    if(value === null) {
        return value;
    };
    if(value[0] === '[' || value[0] === '{') {
        return JSON.parse(value);
    };
    return value;
};

//小于10的数前面加0
function formatNum (num) {
    if(num < 10) {
        return '0' + num;
    };
    return num;
};