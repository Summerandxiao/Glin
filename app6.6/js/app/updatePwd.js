var uid;
var ip;
summerready = function() {
	ip = summer.getStorage('ip');
	if (summer.getStorage('userInfo_local')) {//有数据
		uid = summer.getStorage('uid');
	}
};

function doSave() {
	//localStorage.setItem('password', '1')
	var password = summer.getStorage('password');
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
			UM.alert("修改成功");
			summer.openWin({
	            id : 'MyInfo',
				url : 'html/MyInfo.html',
	            reload:true,
	        });
		} else {
			UM.alert("修改失败");
		}
	});
};

function clearPwd() {//清空密码
	$("#oldPass").val("");
	$("#newPass").val("");
	$("#ConfirmPass").val("");
}