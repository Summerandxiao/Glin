﻿//var ip = '10.4.40.110:8080';//本机测试环境
//var ip = '10.10.65.103:7919';
//var ip = '123.103.9.38:7073';
var ip = localStorage.getItem("ip");
//='127.0.0.1:8080';
//公司测试环境
//var portalIp = '10.15.0.155:7002';//A++地址

summerready = function() {
	if (summer.getStorage('img')) {
		$("#img_my").attr('src', summer.getStorage('img'));
	}
	//ip = summer.getStorage("ip");
	if (!ip) {
		summer.openWin({
			id : "netConfig",
			url : "html/netConfig.html",
			reload : true,
			isKeep : false,
		});
	} else {
		var objects = $("#netConfigMsg").children("span");
		for (var i = 0; i < objects.length; i++) {
			//遍历span标签,移除span
			objects[i].remove();
		}
		$("#netConfigMsg").append('<span style="color:#00a1ea">' + ip + '</span>');
		updateAppCheck();
	}
	if (summer.getStorage('userInfo_local')) {//有数据
		var userInfo_local = JSON.parse(summer.getStorage('userInfo_local'));
		var isSavePass = document.getElementById('isSavePass');
		var isAutoLogin = document.getElementById('isAutoLogin');
		isSavePass.checked = userInfo_local.isSavePass;
		//设置checked的状态
		isAutoLogin.checked = userInfo_local.isAutoLogin;
		$("#user").val(userInfo_local.userId);
		$("#password").val(userInfo_local.userPass);
		if (isAutoLogin.checked) {
			userLogin();
		}
	}
	$('#login').click(function() {
		userLogin();
	});

	$("#netConfigSet").click(function() {
	  location.href="netConfig.html"
		// summer.openWin({
		// 	id : "netConfig",
		// 	url : "html/netConfig.html",
		// 	reload : true,
		// 	isKeep : false,
		// });
	});

	document.addEventListener("backbutton", onBackKeyDown, false);
	//监听返回键
}
var userLogin = function() {
	//ip = summer.getStorage("ip");
	ip = localStorage.getItem("ip");
	var objects = $("#netConfigMsg").children("span");
	for (var i = 0; i < objects.length; i++) {
		//遍历span标签,移除span
		objects[i].remove();
	}
	$("#netConfigMsg").append('<span style="color:#00a1ea">' + ip + '</span>');
	//  summer.setStorage("ip", ip);
	//summer.setStorage("portalIp", portalIp);
	var appVersion = 'V1.0';
	var user = $("#user").val();
	var password = $("#password").val();
	var paramStr = "username=" + encodeURIComponent(encodeURIComponent(user));
	paramStr += "&password=" + encodeURIComponent(password) + "&CLIENT=MOBILE";
	if ('' == user) {
		$('#errorInfo').html('<font color="red">请输入用户名!</font>');
		return;
	}
	if ('' == password) {
		$('#errorInfo').html('<font color="red">请输入密码!</font>');
		return;
	}
	var registration_id = summer.getStorage("registration_id");
	paramStr += "&registration_id=" + registration_id;
	if (false) {//不要手机串号绑定功能
		var deviceid = summer.getDeviceInfo().deviceid;
		paramStr += "&deviceid=" + deviceid;
		//	if (summer.getAppStorage("deviceid") == null) {
		//		alert("当前设备id为：" + deviceid + ",请立即记录并发送给管理员，管理员登记后方可登录！");
		//		summer.setAppStorage("deviceid", deviceid);
		//		return;
		//	} else {
		//alert("appStorage:" + summer.getAppStorage("deviceid"));
		//	}
		if (summer.getStorage("deviceid") == null) {
			alert("当前设备id为：" + deviceid + ",请立即记录并发送给管理员，管理员登记后方可登录！");
			summer.setStorage("deviceid", deviceid);
			return;
		}
	}

	UM.showLoadingBar({
		text : "正在加载",
		icons : 'ti-reload',
	});

	/*var url = 'http://' + ip + '/FS';
	console.log("url ==" + url);
	$.ajax(url, {
	data : "",
	dataType : 'jsonp',
	crossDomain : true,
	timeout : 3000, //超时时间，毫秒
	complete : function(data) {
	if (data.status == 200) {*/
	//	alert("服务可用");
	console.log("http://" + ip + "/FS/loginServlet?" + paramStr);
	$.ajax({
		type : "POST",
		async : false,
		dataType : "jsonp",
		jsonp : "jsonpCallback",
		url : "http://" + ip + "/FS/loginServlet?" + paramStr,
		error : function(data) {
			UM.alert('登录出错：网络连接失败，请连接指定网络，或联系系统管理员。'+JSON.stringify(data));
			UM.hideLoadingBar();
		},
		success : function(data) {
			if (data.resultCode == "1") {
				UM.toast({
					"title" : "友情提示：",
					"text" : "登录成功，请稍后",
					"duration" : 3000
				});
				$('#errorInfo').html('');
				var userData = data.rows;
				var userInfo_local = {
					uid : userData.ID,
					userId : userData.USER_CODE,
					userName : userData.USER_NAME,
					coCode : userData.CO_CODE,
					coName : userData.CO_NAME,
					orgCode : userData.ORG_CODE,
					orgName : userData.ORG_NAME,
					nd : userData.ND,
					userPass : password,
					userMobile : userData.USER_MOBILE,
					userType : userData.USER_TYPE,
					ip : ip,
					appVersion : appVersion,
					isSavePass : $("#isSavePass").is(':checked'),
					isAutoLogin : $("#isAutoLogin").is(':checked')
				};
				console.log(userInfo_local);
				summer.setStorage("userInfo_local", JSON.stringify(userInfo_local));
				summer.setStorage("islogout", true);
				summer.setStorage("isSavePass", $("#isSavePass").is(':checked'));
				summer.setStorage("isAutoLogin", false);
				//summer.setStorage("registration_id", $("#registration_id").val());
				summer.setStorage("userId", user);
				summer.setStorage("nd", userData.ND);
				summer.setStorage("userType", userData.USER_TYPE);
				//summer.setStorage("deviceid", userData.IMEI);
				//window.location.href="Index.html?"+paramStr+"&id=login&backurl="+window.location.href;
				UM.hideLoadingBar();
				/*****android 手机需注释掉，ios 放开 start ******/
				/*summer.openWin({
				id : 'wait',
				url : 'html/wait.html',
				reload : true
				});*/
				/*****android 手机需注释掉，ios 放开 end******/
				summer.openWin({
					id : 'index',
					url : 'index.html',
					reload : true,
					isKeep : false
				});
				// var indexUrl = location.href.split("6/")[0]+"6/index.html"
                //  window.location.href = indexUrl
			} else {
				alert(data.rows);
				UM.hideLoadingBar();
			}
		}
	});

	/*} else if (data.statusText == "timeout" && data.status == 0) {
	 //alert("服务不可用");
	 UM.hideLoadingBar();
	 alert(data.status+data.statustext+"服务不可用,请联系管理员");
	 } else if (data.status == 404) {
	 UM.hideLoadingBar();
	 UM.toast({
	 title : '提示：',
	 text : '找不到可用的服务,请联系管理员',
	 duration : 2000
	 });
	 /**	UM.alert({
	 title: '找不到可用的服务,请联系管理员',
	 btnText: ["取消", "确定"],
	 overlay: true,
	 ok: function () {
	 $this.parent().next().children('.form-control').val('已点击');
	 }
	 });

	 //alert("找不到可用的服务,请联系管理员");
	 } else {
	 UM.hideLoadingBar();
	 UM.toast({
	 title : '提示：',
	 text : '找不到可用的服务,请联系管理员',
	 duration : 2000
	 });
	 }
	 }
	 });*/
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

/**
 * APP版本更新检查
 */
function updateAppCheck() {
	$.ajax({
		type : "POST",
		async : false,
		dataType : "json",
		url : "http://" + ip + "/FS/services/appVersionService/getAppVersionInfo?",
		success : function(data) {
			if (data.resultCode == "1") {
				var versionData = data.rows;
				var serverVersionInfo = versionData[0];
				// 如果当前应用版本和服务器最新版本不一致 则提示是否更新应用
				var versionInfo = eval("(" + summer.getAppVersion() + ")");
				//alert("手机版本：" + versionInfo.versionName + "\n" + "服务器版本：" + serverVersionInfo.VERSION_CODE);
				//var isOK = parseInt(versionData[0].APP_VERSION) > parseInt(versionInfo.versionName);
				if (serverVersionInfo.VERSION_CODE > versionInfo.versionName) {
					//alert("可以升级啦!");
					UM.confirm({
						title : '软件版本更新',
						text : '检测到新版本' + serverVersionInfo.VERSION_CODE + '，立即更新？',
						btnText : ["下次再说", "立即更新"],
						overlay : true,
						ok : function() {
							updateMobileApproval(serverVersionInfo);
						},
						cancle : function() {
							var userInfo_local = JSON.parse(summer.getStorage('userInfo_local'));
							var isSavePass = document.getElementById('isSavePass');
							var isAutoLogin = document.getElementById('isAutoLogin');
							isSavePass.checked = userInfo_local.isSavePass;
							//设置checked的状态
							isAutoLogin.checked = userInfo_local.isAutoLogin;
							$("#user").val(userInfo_local.userId);
							$("#password").val(userInfo_local.userPass);
							if (isAutoLogin.checked) {
								userLogin();
							}
							return;
						}
					});
				} else {
					//	alert("无需升级啦");
					var userInfo_local = JSON.parse(summer.getStorage('userInfo_local'));
					var usercode = userInfo_local.userId;
					var userpass = userInfo_local.userPass;
					var isSavePass = userInfo_local.isSavePass;
					var isAutoLogin = userInfo_local.isAutoLogin;
					if (usercode && userpass && isSavePass) {
						$("#user").val(usercode);
						$("#password").val(userpass);
					}
					if (usercode && userpass && isAutoLogin) {
						userLogin();
					}
				}
			}
		}
	});
}

/**
 * 根据手机系统类型更新android或者ios应用
 */
function updateMobileApproval(versionData) {
	var os = summer.getSysInfo();
	if (os.systemType == "android") {
		//alert("android:" + versionData.ANDROID_URL);
		var androidUrl = "http://" + versionData.ANDROID_URL + "/FS/app/android/native/install/FS_QUERY.apk";
		alert(androidUrl);
		summer.upgradeApp({
			url : androidUrl
		}, function(ret) {
			//alert("下载更新成功");
		}, function(ret) {
			alert("下载更新失败");
		});
	} else if (os.systemType == "ios") {
		alert("ios:" + versionData.IOS_URL);
		var iosUrl = "itms-services://?action=download-manifest&url=https://mbs.yyuap.com:443/ump/portalservice/download/" + versionData.IOS_URL + "/FS_Query_IUAP.plist";
		alert(iosUrl);
		summer.upgradeApp({
			url : iosUrl
		}, function(ret) {
			//alert("下载更新成功");
		}, function(ret) {
			alert("下载更新失败");
		});
		return;
	}
}
