var ip = '10.4.40.35:8080';
var userCode;
summerready = function() {
	alert("login start");
	var swrysfdm = summer.pageParam.swrysfdm;
	alert("swrysfdm:"+swrysfdm);
	var swrydm = summer.pageParam.swrydm;
	alert("swrydm:"+swrydm);
//	用户名
    userCode=summer.pageParam.swrydm;
	summer.setStorage("ip", ip);
	userLogin();
}
var userLogin = function() {
	UM.showLoadingBar({
		text : "正在加载",
		icons : 'ti-reload',
	});
	var paramStr = "uid=" + encodeURIComponent(encodeURIComponent(userCode));
	paramStr += "&CLIENT=MOBILE";
	var url = 'http://' + ip + '/FS';
	$.ajax(url, {
		data : "",
		dataType : 'jsonp',
		crossDomain : true,
		timeout : 3000, //超时时间，毫秒
		complete : function(data) {
			if (data.status == 200) {
				//	alert("服务可用");
				$.ajax({
					type : "POST",
					async : false,
					dataType : "jsonp",
					jsonp : "jsonpCallback",
					error : function(data) {
						alert('login' + JSON.stringify(data));
					},
					url : "http://" + ip + "/FS/loginServlet?" + paramStr,
					success : function(data) {
						if (data.resultCode == "1") {
							$('#errorInfo').html('');
							var userData = data.rows;
							//alert("userData:"+JSON.stringify(userData));
							var userInfo_local = {
								uid : userData.ID,
								userId : userData.USER_CODE,
								userName : userData.USER_NAME,
								coCode : userData.CO_CODE,
								coName : userData.CO_NAME,
								orgCode : userData.ORG_CODE,
								orgName : userData.ORG_NAME,
								nd : userData.ND,
								ip : ip,
								appVersion: 'v1'
							};
							summer.setStorage("userInfo_local", JSON.stringify(userInfo_local));
							summer.setStorage("islogout", true);
							summer.setStorage("userId", userCode);
							summer.setStorage("nd", userData.ND);
							UM.hideLoadingBar();
							summer.openWin({
								id : 'index',
								url : 'index.html',
								pageParam : {
									username : 'sa',
									passwrod : '1212'
								}
							});

						} else {
							alert(data.rows);
							UM.hideLoadingBar();
						}
					}
				});

			} else if (data.statusText == "timeout" && data.status == 0) {
				UM.hideLoadingBar();
				alert("服务不可用,请联系管理员");
			} else if (data.status == 404) {
				UM.hideLoadingBar();
				UM.toast({
					title : '提示：',
					text : '找不到可用的服务,请联系管理员',
					duration : 2000
				});
			} else {
				UM.hideLoadingBar();
				UM.toast({
					title : '提示：',
					text : '找不到可用的服务,请联系管理员',
					duration : 2000
				});
			}
		}
	});
}
function onBackKeyDown() {
	if (confirm("再点击一次退出!")) {
		summer.exitApp()
	};
	document.removeEventListener("backbutton", onBackKeyDown, false);
	//注销返回键
	var intervalID = setInterval(function() {
		clearInterval(intervalID);
		document.addEventListener("backbutton", onBackKeyDown, false);
		// 监听返回键
	}, 3000);
};
