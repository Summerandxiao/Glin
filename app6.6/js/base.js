
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

// 封装ajax请求
function request(url, method = 'GET', params, baseUrl='https://www.fastmock.site/mock/3d01df2e5e53f793c3c7f7fd87a905e0/api') {
    // const baseUrl = 'https://www.fastmock.site/mock/3d01df2e5e53f793c3c7f7fd87a905e0/api'
    return new Promise((reslove, reject) => {
        $.ajax({
            url: `${baseUrl}${url}`,
            data: params,
            dataType: 'jsonp',
            // async: false,
            success(res) {
                reslove(res)
            },
            error(err) {
                reject(err)
            }
        })
    })
}

//index.js里的方法
function openNewWin(id, compoId, title) {
	//判断是否有登录系统
	if (summer.getStorage('userInfo_local')) {//有数据
		console.log("登录中");
		//alert("登陆中");
		summer.openWin({
			id : id,
			url : 'html/' + id + '.html',
			reload : true,
			pageParam : {
				compoId : compoId,
				title : title
			}
		});

	} else {
		//alert("跳转到登陆");

		//跳转到登录页面
		summer.openWin({
			id : 'login',
			url : 'html/login.html',
			reload : true,
			isKeep : false,
			pageParam : {
				compoId : '',
				title : '登录'
			}
		});
	}

}
//billsList.js里获取search的条件
function getArSearch(arsearchCondition){
    arsearchCondition.startDate=$("#startDate").val();  //起始日期
    arsearchCondition.endDate=$("#endDate").val();     //结束日期
    arsearchCondition.billType=$("#billTypeSelect").val(); //单据类型
    arsearchCondition.billNo=$("#billNo").val();//单据号
    arsearchCondition.inputorId=$("#inputorId").val(); //报销人编码
    arsearchCondition.appName=$("#inputorName").val();//报销人
    arsearchCondition.minMoney=$("#minMoney").val();//最小金额
    arsearchCondition.maxMoney=$("#maxMoney").val();//最大金额
    arsearchCondition.reason=$("#reason").val();//事由
}

