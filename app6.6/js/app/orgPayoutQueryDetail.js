var rows,
	unit = 1,
    userInfo;
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	if (summer.getStorage('userInfo_local')) {//有数据
		nd = summer.getStorage("nd");
		userInfo = JSON.parse(summer.getStorage('userInfo_local'));
		$("#unit").on("change", function(event) {
			unit = this.value;
		});
		loadData();
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
	}
}

function loadData() {
	$('#conditions').hide();
	UM.showLoadingBar({
		text : "加载中",
		icons : 'ti-loading',
	});
	var bdata=summer.getStorage("bdata");
	var urlParam ="fiscal="+bdata.orgNd;
	urlParam+="&org_code="+bdata.ORG_CODE;
	urlParam+="&co_code="+bdata.orgCocode;
	urlParam+="&userid="+userInfo.userId;
	urlParam+="&period="+bdata.period;
	urlParam+="&CLIENT=MOBILE";
	urlParam+="&UID="+userInfo.uid;
	urlParam += "&unit=" + unit;
	urlParam+="&report=orgfund";
	urlParam+="&user_co_code="+bdata.orgCocode;
	$.ajax({
		type : "get",
		async : false,
		url : "http://"+userInfo.ip+"/FS/services/fundQueryService/selectorgBudgetPayoutPeriodDetail_Mobile?"+urlParam,
		success : function(data) {
			rows=data.rows;
			var orgData = data.rows;
			orgData.ORG_NAME=bdata.ORG_NAME;
			orgData.MONTH=bdata.period;
			var evalText = doT.template($("#orgPayoutQueryList").text());
			$("#orgPayoutQueryContent").html(evalText(orgData));
			UM.hideLoadingBar();
		}
	});
}
