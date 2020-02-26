summerready = function() {
	if (summer.getStorage('userInfo_local')) {
		var userInfo_local = JSON.parse(summer.getStorage('userInfo_local'));
		var isSavePass = document.getElementById('isSavePass');
		var isAutoLogin = document.getElementById('isAutoLogin');
		isSavePass.checked = userInfo_local.isSavePass;
		//设置checked的状态
		isAutoLogin.checked = userInfo_local.isAutoLogin;
		$("#user").val(userInfo_local.userId);
		$("#password").val(userInfo_local.userPass);
		//alert($("#isSavePass").is(':checked'));
	}

	$('#login').click(function() {
		//var ip = '10.4.40.110:8080';//本机测试环境
		var ip = '123.103.9.38:7071';//公司测试环境
		//本机测试环境
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

		UM.showLoadingBar({
			text : "正在加载",
			icons : 'ti-reload',
		});
		
		
		
		$('#errorInfo').html('');
		//var userData = "{'resultCode':'1','rows':{'USER_PASS':'c4ca4238a0b923820dcc509a6f75849b','nd':2017,'USER_NAME':'系统管理员','USER_CODE':'sa','ID':'-1111112017','ND':2017},'total':0}";
		var data = '{"resultCode":"1","rows":{"USER_PASS":"c4ca4238a0b923820dcc509a6f75849b","nd":2017,"USER_NAME":"系统管理员","USER_CODE":"sa","ID":"-1111112017","ND":2017},"total":0}';
		data = JSON.parse(data);
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
		summer.setStorage("username", user);
		summer.setStorage("password", password);

		//window.location.href="Index.html?"+paramStr+"&id=login&backurl="+window.location.href;
		UM.hideLoadingBar();
		summer.openWin({
			id : 'index',
			url : 'index.html',
			pageParam : {
				username : 'sa',
				passwrod : '1212'
			}
		});
	});

}

