summerready = function() {
	var userInfo_local;
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	updateAppCheck(ip);
	funcGoto = function() {
		var param = "senderId=" + userInfo_local.userId
		param += "&sendStatus=2&wfStatus=0&isRead=1";
		//已发送 审核中 未读
		$.getJSON(url + "/services/pushService/getMessageCount?" + param, function(data) {
			if (data.resultCode == "1") {
				if ("0" != data.rows) {
					$("#msgNum").attr("style", "display:");
					$("#msgNum").text(data.rows);
				} else {
					$("#msgNum").attr("style", "display:none");
				}
			}
		});
	}
	if (summer.getStorage('userInfo_local')) {//有数据
		userInfo_local = JSON.parse(summer.getStorage('userInfo_local'));
		//funcGoto();//显示未读消息条数 也是消息列表页面返回到index页面调用的方法
	} else {//无数据
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
		alert("请先登录");
		return;
	}

	// 根据用户名做权限认证
	//alert("自动登陆,有数据");
	var param = "USER_CODE=" + userInfo_local.userId;
	param += "&USER_TYPE=" + summer.getStorage("userType");
	param += "&APP=yes";
	param += "&PARENT_CODE=110";

	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + ip + "/FS/services/roleService/selectUserMenuList?" + param,
		success : function(data) {
			console.log(data.rows);
			var menulistText = doT.template($("#menulist-tmpl").text());
			$("#menulist").append(menulistText(data.rows));
		}
	});
	
	//取参数------------------开始
		//参数1
		var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
		var	arsearchCondition={};
		arsearchCondition.startDate=$("#startDate").val();
		arsearchCondition.endDate=$("#endDate").val();
		arsearchCondition.billType=$("#billTypeSelect").val();
		arsearchCondition.billNo=$("#billNo").val();
		arsearchCondition.inputorId=$("#inputorId").val();
		arsearchCondition.inputorName=$("#inputorName").val();
		arsearchCondition.minMoney=$("#minMoney").val();
		arsearchCondition.maxMoney=$("#maxMoney").val();
		arsearchCondition.reason=$("#reason").val();
		//if(summer.getStorage('arSearch')){
			//arsearchCondition = JSON.parse(summer.getStorage('arSearch'));
		//}
		var curYear = new Date().getFullYear();
		var startDate;
		if (arsearchCondition.startDate == "" || arsearchCondition.startDate == undefined) {
			startDate = curYear + '-01-01';
		} else {
			startDate = arsearchCondition.startDate;
		}
		var endDate;
		if (arsearchCondition.endDate == "" || arsearchCondition.endDate == undefined) {
			endDate = curYear + '-12-31';
		} else {
			endDate = arsearchCondition.endDate;
		}
		var wfstatus,upstatus,fastatus;
		curStatus = 0;
		if (curStatus == 0) {
			wfstatus = "todo";
			upstatus="unaudit";
			fastatus="1";
			
		} 
		//权限参数
		//USER_CODE=userInfo.userId&USER_TYPE=userInfo.userType&APP=yes&PARENT_CODE=011
		var userTypeNew = userInfo.userType == undefined ? "" : userInfo.userType;
		var urlParam = "USER_CODE=" + userInfo.userId + "&USER_TYPE=" + userTypeNew + "&APP=yes&PARENT_CODE=111";
		urlParam += "&ar-WORKFLOW_STATUS=" + wfstatus;
		urlParam += "&ar-USERID=" + userInfo.userId;
		urlParam += "&ar-START_DATE=" + startDate;
		urlParam += "&ar-END_DATE=" + endDate;
		urlParam += "&ar-UID=" + userInfo.uid;
		urlParam += "&ar-CLIENT=MOBILE";
		//urlParam += "&ar-CO_CODE=" + userInfo.coCode;

		if (arsearchCondition.billType != undefined && arsearchCondition.billType != "")
			urlParam += "&ar-billType=" + arsearchCondition.billType;
		if (arsearchCondition.minMoney != undefined && arsearchCondition.minMoney != "")
			urlParam += "&ar-minMoney=" + arsearchCondition.minMoney;
		if (arsearchCondition.maxMoney != undefined && arsearchCondition.maxMoney != "")
			urlParam += "&ar-maxMoney=" + arsearchCondition.maxMoney;
		if (arsearchCondition.appName != undefined && arsearchCondition.appName != "")
			urlParam += "&ar-appName=" + arsearchCondition.appName;
		if (arsearchCondition.appCode != undefined && arsearchCondition.appCode != "")
			urlParam += "&ar-appCode=" + arsearchCondition.appCode;
		if (arsearchCondition.billNo != undefined && arsearchCondition.billNo != "")
			urlParam += "&ar-billNo=" + arsearchCondition.billNo;
		if (arsearchCondition.orgCode != undefined && arsearchCondition.orgCode != "")
			urlParam += "&ar-orgCode=" + arsearchCondition.orgCode;
		if (arsearchCondition.orgName != undefined && arsearchCondition.orgName != "")
			urlParam += "&ar-orgName=" + arsearchCondition.orgName;
		if (arsearchCondition.reason != undefined && arsearchCondition.reason != "")
			urlParam += "&ar-reason=" + arsearchCondition.reason;

		//参数2
		urlParam += "&fa-method=mobileInterface/searchTodoOrFinsh";
		urlParam += "&fa-billType=";
		urlParam += "&fa-pageIndex=" + "0";
		urlParam += "&fa-pageSize=" + "1000";
		urlParam += "&fa-status=" + fastatus;
		urlParam += "&fa-keyword=";
		urlParam += "&fa-userId=" + userInfo.userId;
		urlParam += "&fa-isDetail=" + "0";
		
		/********采购************************/
		urlParam += "&up-auditStatus=" + upstatus;
		urlParam += "&up-userId=" + userInfo.userId;
		//urlParam += "&up-userId=fujian" ;
		urlParam += "&up-nd=" + curYear;
		urlParam += "&up-coCode=" + userInfo.coCode;
		urlParam += "&up-CLIENT=MOBILE";
		document.addEventListener('deviceready',function () {
		    // cordova.plugins.notification.badge is now available
		}, false);
		$.getJSON(url + "/services/auditService/getAllAuditData?" + urlParam).success(function(data) {
			var rowslength = data.rows[0].rows.length;
			$("#todomsgNum").text(rowslength);
			if(parseInt(rowslength) != 0){
				//设置消息数量
				cordova.plugins.notification.badge.set(rowslength, function(badge){});
			}else{
				//清除消息数量
				cordova.plugins.notification.badge.clear();
			}
		}).error(function(data){
		});
	
	
	var menuLink = $(".um-grid");
	menuLink.on("click", function(e) {
		var target = e.target;
		var parent = $summer.closest(target, '.um-box-center');
		if (parent) {
			summer.openWin({
				id : parent.id,
				url : 'html/' + parent.id + '.html',
				reload : true,
				pageParam : {
					name : 'test'
				}
			});
		}
	});

	//document.addEventListener("backbutton", onBackKeyDown, false);  //监听返回键

	//消息
	$('#msg').click(function() {
		summer.openWin({
			id : 'messageList',
			animation : {
				type : "none", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			url : 'html/messageList.html',
			reload : true,
			pageParam : {
				title : '信息列表'
			}
		});
	});

	//待办
	$("#upComing").on("click", function(e) {
		summer.openWin({
			id : 'upComing',
			url : 'html/upComing.html',
			reload:true,
			isKeep:false
		});
	});

	//我的
	$('#MyInfo').click(function() {
		summer.openWin({
			id : 'MyInfo',
			url : 'html/MyInfo.html',
			reload:true,
			isKeep:false
		});
	});
	var timer;
	timer = setInterval(
		function(){       
			$.getJSON(url + "/services/auditService/getAllAuditData?" + urlParam).success(function(data) {
				var rowslength = data.rows[0].rows.length;
				if(parseInt(rowslength) != 0){
					//设置消息数量
					cordova.plugins.notification.badge.set(rowslength, function(badge){
					});
				}else{
					//清除消息数量
					cordova.plugins.notification.badge.clear();
				}
			}).error(function(data){
			});
		},
		1800000	//10000 10s  1800000 30分钟	3600000 60分钟
	);
}
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
/**
 * APP版本更新检查
 */
function updateAppCheck(ip) {
	console.log(ip)
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
							return;
						}
					});
				} else {
					return;
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
		//alert(androidUrl);
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
