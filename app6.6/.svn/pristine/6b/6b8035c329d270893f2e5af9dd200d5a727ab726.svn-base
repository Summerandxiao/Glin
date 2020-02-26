var uid;
var ip;
//var uusername;
//var upassword;
var password;
var username;
var appVersion = 'V1.0';
summerready = function() {
	ip = summer.getStorage('ip');
	/*if (summer.getStorage('userInfo_local')) {//有数据
		uid = summer.getStorage('uid');
	}*/
	uid = summer.getStorage('uid');
	password = summer.getStorage('password');
	username = summer.getStorage('username');
	/*
	uusername = summer.getStorage("uusername");
	upassword = summer.getStorage("upassword");
	var paramStrOnePwd =  "&USER_CODE=" + uusername + "&USER_PASS=" +upassword;
	$.ajax({
			type : "POST",
			async : false,
			dataType : "json",
			url : "http://" + ip + "/FS/services/appVersionService/getUserInfo?"+ paramStrOnePwd,
			success : function(data) {
				if (data.resultCode == 1) {
					var versionData = data.rows;
					var c = $.isEmptyObject(data.rows);
					if(c){
						//kong
						UM.alert("登录失败");
						summer.openWin({
							id : 'login',
							url : 'html/login.html',
							reload : true,
							isKeep:false
						});
					}else{
						//not kong
						password = upassword;
						uid = versionData.ID;
					}
				} else {
					alert(data.rows);
					UM.hideLoadingBar();
				}
			}
		});
*/
};

function doSave() {
	//localStorage.setItem('password', '1')
	//var password = summer.getStorage('password');
	var old = $("#oldPass").val();
	var up = $("#newPass").val();
	var cup = $("#ConfirmPass").val();
	if (password != old) {
		UM.alert('原密码错误!');
		clearPwd();
		return;
	}
	if (up == null || up == "") {
		UM.alert('请输入新密码!');
		clearPwd();
		return;
	}
	if (up == null || up.length <8 || up.length > 16) {
		UM.alert('请输入8到16位密码！');
        return false;
    }
    var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
    if (!reg1.test(up)) {
    	UM.alert('密码只能输入数字和字母!');
        return false;
    }
    var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
    if (!reg.test(up)) {
    	UM.alert('密码必须包含数字和字母!');
        return false;
    }
	if (cup == null || cup == "") {
		UM.alert('请输入确认密码!');
		return;
	}
	if (up != cup) {
		UM.alert('新密码和确认密码不一致,请核实!');
		return;
	}
	
	var result = "{";
	result += "'ID':'" + uid + "',";
	result += "'USER_PASS':'" + cup + "'";
	result += "}";
	$.getJSON("http://" + ip + "/FS/services/userService/updateUser?data=" + encodeURIComponent(result), function(data) {
		if (data.resultCode == "1") {
			
			var user = username;
			var paramStr = "username=" + encodeURIComponent(encodeURIComponent(user));
			paramStr += "&password=" + encodeURIComponent(cup) + "&CLIENT=MOBILE";
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
					summer.openWin({
						id : 'login',
						url : 'html/login.html',
						reload : true,
						isKeep:false
					});
					return;
				}
			}
			$.ajax({
				type : "POST",
				async : false,
				dataType : "jsonp",
				jsonp : "jsonpCallback",
				url : "http://" + ip + "/FS/loginServlet?" + paramStr,
				error : function(data) {
					UM.alert('登录出错：网络连接失败，请连接指定网络，或联系系统管理员。');
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
						//android 手机需注释掉，ios 放开 start 
						//summer.openWin({
						//id : 'wait',
						//url : 'html/wait.html',
						//reload : true
						//});
						//android 手机需注释掉，ios 放开 end*
						summer.openWin({
							id : 'index',
							url : 'index.html',
							reload : true,
							isKeep : false
						});
		
					} else {
						alert(data.rows);
						UM.hideLoadingBar();
					}
				}
			});
			
			
			var paramStrOnePwd =  "&USER_CODE=" + username + "&USER_PASS=" +encodeURIComponent(cup);
			$.ajax({
				type : "POST",
				async : false,
				dataType : "json",
				url : "http://" + ip + "/FS/services/appVersionService/getUserInfologin?"+ paramStrOnePwd,
				success : function(data) {
					if (data.resultCode == 1) {
						var versionData = data.rows;
						var c = $.isEmptyObject(data.rows);
						if(c){
							//kong
							UM.alert("修改失败");
							summer.openWin({
								id : 'login',
								url : 'html/login.html',
								reload : true,
								isKeep:false
							});
						}else{
							//UM.alert("修改成功");
							alert("修改成功");
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
								userPass : cup,
								userMobile : userData.USER_MOBILE,
								userType : userData.USER_TYPE,
								ip : ip,
								appVersion : appVersion,
								isSavePass : $("#isSavePass").is(':checked'),
								isAutoLogin : $("#isAutoLogin").is(':checked')
							};
							summer.setStorage("userInfo_local", JSON.stringify(userInfo_local));
							summer.setStorage("islogout", true);
							summer.setStorage("isSavePass", $("#isSavePass").is(':checked'));
							summer.setStorage("isAutoLogin", false);
							//summer.setStorage("registration_id", $("#registration_id").val());
							summer.setStorage("userId", userData.ID);
							summer.setStorage("nd", userData.ND);
							summer.setStorage("userType", userData.USER_TYPE);
							//UM.hideLoadingBar();
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
						}
					} else {
						alert(data.rows);
						UM.hideLoadingBar();
					}
				}
			});
		} else {
			UM.alert("修改失败");
			summer.openWin({
				id : 'login',
				url : 'html/login.html',
				reload : true,
				isKeep:false
			});
		}
	});
};

function clearPwd() {//清空密码
	$("#oldPass").val("");
	$("#newPass").val("");
	$("#ConfirmPass").val("");
}