
//获取页面url
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    else return null;
}
function back() {
    window.history.go(-1)
}

// 创建script标签，便于在js文件中引入其他js文件
function createScript(url) {
    var newscript = document.createElement('script');
    newscript.setAttribute('type', 'text/javascript');
    newscript.setAttribute('src', url);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(newscript);
}

function importCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
}

//js保留两位小数，自动补充零
function returnFloat(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}

// 将数字转化为千分位，默认保留2位小数
function parseToThousandth(s, point = 2) {
    var noNegative = true;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(point) + "";
	if(parseFloat(s) < 0){
		s = Math.abs(s).toFixed(2) + "";
		noNegative = false;
	}
	
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i++) {
		if(i%3==2&&i!=l.length-1){
			t+=l[i]+",";
		}else{
			t+=l[i]+""; //加上空格
		}
	}
	return (noNegative?"":"-") + t.split("").reverse().join("") + "." + r;
}

