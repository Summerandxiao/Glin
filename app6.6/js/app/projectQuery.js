var rows,
    nd,
    userInfo,
    selectCompany,
    unit = 1,
    is2year = '0';
//默认非跨年
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	if (summer.getStorage('userInfo_local')) {//有数据
		nd = summer.getStorage("nd");
		userInfo = JSON.parse(summer.getStorage('userInfo_local'));
		loadCompany();
	//	loadData();
		//从FS加载数据
		$("#thisYear").text(nd);
		$("#lastYear").text(Number(nd) - 1);
		$("#blastYear").text(Number(nd) - 2);
		$("#thisYear").attr("class", "btn um-btn-info");

		$("#unit").on("change", function(event) {
			unit = this.value;
		});

		var bntLink = $("#yearGroup");
		bntLink.on("click", function(e) {//点击日期时间
			var target = e.target;
			var parent = $summer.closest(target, '.btn');
			nd = summer.getStorage("nd");
			if (parent) {
				var btnId = parent.id;
				//按照年份
				if ("lastYear" == btnId) {
					nd = Number(nd) - 1;
					$("#thisYear").attr("class", "btn");
					$("#blastYear").attr("class", "btn");
					$("#lastYear").attr("class", "btn um-btn-info");
				} else if ("blastYear" == btnId) {
					nd = Number(nd) - 2;
					$("#thisYear").attr("class", "btn");
					$("#lastYear").attr("class", "btn");
					$("#blastYear").attr("class", "btn um-btn-info");
				} else {
					nd = Number(nd)
					$("#lastYear").attr("class", "btn");
					$("#blastYear").attr("class", "btn");
					$("#thisYear").attr("class", "btn um-btn-info");
				}
				loadCompany();
			//	loadData();
				//从FS加载数据
			}
		});
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
function loadCompany() {
	$("#proCompany").empty();
	var urlParam = "fiscal=" + nd;
	urlParam += "&userid=" + userInfo.userId;
	urlParam += "&CLIENT=MOBILE";
	urlParam += "&UID=" + userInfo.uid;
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/fundQueryService/selectuserProjectCocode_Mobile?" + urlParam,
		success : function(data) {
			if (data.total > 0) {
				for (var i = 0; i < data.total; i++) {
					var item = data.rows[i];
					$("#proCompany").append("<option  value=" + item.ID + ">" + item.VALUE + "</option>");
				}
				$("#proCompany option:first").prop("selected", 'selected');
				selectCompany = $("#proCompany option:selected").val();
				loadData();
				$("#proCompany").on("change", function(event) {
					selectCompany = this.value;
					loadData();
				});
			} else {
				selectCompany = '';
				loadData();
				UM.toast({
					title : '友情提示：',
					text : '登录人在当前年度没有可显示的预算单位',
					duration : 3000
				});
			}

		}
	});
}

function loadData() {
	$('#conditions').hide();
	UM.showLoadingBar({
		text : "加载中",
		icons : 'ti-loading',
	});
	var urlParam = "fiscal=" + nd;
	urlParam += "&co_code=" + selectCompany;
	urlParam += "&userid=" + userInfo.userId;
	urlParam += "&CLIENT=MOBILE";
	urlParam += "&UID=" + userInfo.uid;
	urlParam += "&report=projectfund";
	urlParam += "&user_co_code=" + selectCompany;
	urlParam += "&unit=" + unit;
	urlParam += "&protype=" + is2year;
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/fundQueryService/selectitemBudgetPayout_Mobile?" + urlParam,
		success : function(data) {
			rows=data.rows;
			var proData = data.rows;
			var evalText = doT.template($("#projectQueryList").text());
			$("#proQueryContent").html(evalText(proData));
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
	listLink.on("click", function(e) {//项目经费明细穿透（按项目/按月份汇总）
		var target = e.target;
		var parent = $summer.closest(target, '.um-listview-row');
		if (parent) {
			var id = parent.id;
			var bdata = rows[id];
			bdata.proCocode=selectCompany;//选择的单位
			bdata.proNd=nd;//选择的年度
			summer.setStorage("bdata", bdata);//保存点击的数据 在报销详情页取出
			summer.openWin({
				id : 'projectPayoutQuery',
				url : 'html/projectPayoutQuery.html',
				reload : true,
			});
			UM.hideLoadingBar();
		}
	});
}
