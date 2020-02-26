var userInfo;
summerready = function() {
	if (summer.getStorage('userInfo_local')) {//有数据
		userInfo = JSON.parse(summer.getStorage('userInfo_local'));
		$("#userId").attr("value", userInfo.userId);
		$("#userName").attr("value", userInfo.userName);
		$("#coName").html(userInfo.coName);
		$("#userMobile").attr("value", userInfo.userMobile);
		$("#appVersion").attr("value", "版本 " + userInfo.appVersion);
	}
	if(summer.getStorage('img')){
		$("#img_my").attr('src',summer.getStorage('img'));
	}
	
	//修改头像
	$("#img_myinfo").on("click", function(e) {
		summer.openPhotoAlbum({
		    callback : function (args){
		        summer.setStorage("img", args.imgPath);
		        $("#img_my").attr('src',args.imgPath);
		    }
		});
	});

	//待办
	$("#upComing").on("click", function(e) {
		summer.openWin({
			id : 'upComing',
			url : 'html/upComing.html',
			reload : true,
			isKeep:false
		});
	});
	//应用
	$("#index").on("click", function(e) {
		summer.openWin({
			id : 'index',
			url : 'index.html',
			reload : true,
			isKeep:false
		});
	});

};

function updatePass() {
	var uid = userInfo.uid;
	var password = userInfo.userPass;
	console.log(uid + ":" + password);
	summer.setStorage("uid", uid);
	summer.setStorage("password", password);
	summer.openWin({
		id : 'updatePwd',
		url : 'html/updatePwd.html',
		reload : true,
		pageParam : {
			uid : 'uid',
			password : 'password'
		}
	});
};

function exit() {
	UM.confirm({
		title : '友情提示：',
		text : '您确定要退出系统吗？',
		btnText : ["取消", "确定"],
		overlay : true,
		ok : function() {
			localStorage.removeItem("userInfo_local");
			var url = summer.getStorage('ip');
			localStorage.clear();
			localStorage.setItem("ip",url);
			document.addEventListener('deviceready',function () {
			    // cordova.plugins.notification.badge is now available
			}, false);
			//清除消息数量
			cordova.plugins.notification.badge.clear();
			summer.openWin({
				id : 'login',
				url : 'html/login.html',
				reload : true,
				isKeep:false
			});
		},
		cancle : function() {
		}
	});
};

/**
 * 切换单位
 */
function initCompany() {
	summer.openWin({
		id : 'changeCompany',
		url : 'html/changeCompany.html',
		reload : true,
		isKeep:false
	});
}