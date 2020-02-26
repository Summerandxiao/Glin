var rows,
    nd,
    userInfo,
    //curCoCode='141016602001',
    curCoCode,
    selectPrsType;
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	if (userInfo) {//有数据
		nd = summer.getStorage("nd");
		curCoCode=userInfo.coCode;
		loadPrsType();
		//loadData();
		//从FS加载数据
		$("#thisYear").text(nd);
		$("#lastYear").text(Number(nd) - 1);
		$("#blastYear").text(Number(nd) - 2);
		$("#thisYear").attr("class", "btn um-btn-info");

		var bntLink = $(".btn-group");
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
				loadPrsType();//查询工资单里的工资类别
			//	loadData();//从FS加载数据
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
function loadPrsType() {
	$("#prsType").empty();
	var listviewText = doT.template($("#listview-tmpl").text());
	$("#listview").html(listviewText([]));
	$("#totalAct").text(util.changeTwoDecimal(0));
	$("#totalPay").text(util.changeTwoDecimal(0));
	var param = "ND=" + nd + "&CO_CODE=" + curCoCode + "&EMP_CODE=" + userInfo.userId + "&PERIODS=1&PERIODE=12";
	$.getJSON("http://" + userInfo.ip + "/FS/services/salaryService/selectPrsTypeByUserCode?" + param, function(data) {
		if (data.total > 0) {
			for (var i = 0; i < data.total; i++) {
				var item = data.rows[i];
				$("#prsType").append("<option  value=" + item.id + ">" + item.text + "</option>");
			}
			$("#prsType option:first").prop("selected", 'selected');
			selectPrsType = $("#prsType option:selected").val();
			loadData();
			$("#prsType").on("change", function(event) {
				selectPrsType = this.value;
				loadData();
			});
		} else {
			UM.toast({
				title : '友情提示：',
				text : '登录人在当前年度没有可显示的工资类别',
				duration : 3000
			});
		}
	});

}

function loadData() {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var act;
	var pay;
	var temp1 = 0;
	var temp2 = 0;
	var payMoney = 0;
	var actMoney = 0;
	//var salaryType = "001";
	//默认001
	var urlParam = "ND=" + nd;
	//urlParam+="&co_code="+userInfo.coCode;
	urlParam += "&co_code="+curCoCode;
	urlParam += "&userId=" + userInfo.userId;
	urlParam += "&PRTYPE_CODE=" + selectPrsType;
	urlParam += "&PERIODS=1&PERIODE=12";
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/salaryService/selectSalaryListYD?" + urlParam,
		success : function(data) {
			if (data.rows.length <= 0) {
				UM.toast({
					title : '提示：',
					text : '登录人在当前年度没有可显示的工资',
					duration : 2000
				});
			}
			for (i in data.rows) {
				act = data.rows[i].ACT_ITEM_CODE;
				//实发工资
				pay = data.rows[i].PAY_ITEM_CODE;
				//应发工资
				//将实发工资、应发工资转换成具体值
				if (isNaN(act)) {
					temp1 = util.changeTwoDecimal(data.rows[i][act]);
					temp2 = util.changeTwoDecimal(data.rows[i][pay]);
					data.rows[i].ACT_ITEM_CODE = util.changeTwoDecimal(temp1);
					data.rows[i].PAY_ITEM_CODE = util.changeTwoDecimal(temp2);
					actMoney += Number(temp1);
					payMoney += Number(temp2);
				}
			}
			rows = data.rows;
			var listviewText = doT.template($("#listview-tmpl").text());
			$("#listview").html(listviewText(data.rows));
			$("#totalAct").text(util.changeTwoDecimal(actMoney));
			$("#totalPay").text(util.changeTwoDecimal(payMoney));

			listLinkClick();
			//监听点击工资列表事件
		}
	});
}

function listLinkClick() {
	var listLink = $(".um-listview-row");
	listLink.on("click", function(e) {//工资详情页
		var target = e.target;
		var parent = $summer.closest(target, '.um-listview-row');
		if (parent) {
			var id = parent.id;
			var sdata = rows[id];
			summer.setStorage("sdata", sdata);
			summer.setStorage("prsType", selectPrsType);
			//保存点击的数据 在工资详情页取出
			summer.openWin({
				id : 'salaryDetail',
				url : 'html/salaryDetail.html',
				reload : true,
				pageParam : {
					name : 'test'
				}
			});

		}
	});
}
