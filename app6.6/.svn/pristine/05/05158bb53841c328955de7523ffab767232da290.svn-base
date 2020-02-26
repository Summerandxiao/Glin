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
	var bdata = summer.getStorage("bdata");
	var urlParam = "fiscal=" + bdata.proNd;
	urlParam += "&project_code=" + bdata.PROJECT_CODE;
	urlParam += "&co_code=" + bdata.proCocode;
	urlParam += "&userid=" + userInfo.userId;
	urlParam += "&CLIENT=MOBILE";
	urlParam += "&UID=" + userInfo.uid;
	urlParam += "&unit=" + unit;
	urlParam += "&report=projectfund";
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/fundQueryService/selectitemBudgetPayoutPeriod_Mobile?" + urlParam,
		success : function(data) {
			rows = data.rows;
			var proData = data.rows;
			proData.PROJECT_NAME = bdata.PROJECT_NAME;
			var evalText = doT.template($("#proPayoutQueryList").text());
			$("#proPayoutQueryContent").html(evalText(proData));
			UM.hideLoadingBar();
		}
	});
}

function subgo(obj) {
	UM.showLoadingBar({
		text : "加载中",
		icons : 'ti-loading',
	});
	var listLink = $(".um-listview-row");
	listLink.on("click", function(e) {//项目经费明细+凭证信息 穿透
		var target = e.target;
		var parent = $summer.closest(target, '.um-listview-row');
		if (parent) {
			var id = parent.id;
			//var bdata = rows[id];
			var bdata = summer.getStorage("bdata");
			bdata.period = rows[id].PERIOD;
			//月份
			console.log(bdata);
			summer.setStorage("bdata", bdata);
			//保存点击的数据 在报销详情页取出
			summer.openWin({
				id : 'projectPayoutQueryDetail',
				url : 'html/projectPayoutQueryDetail.html',
				reload : true,
				pageParam : {
					name : 'test'
				}
			});
			UM.hideLoadingBar();
		}
	});
}
