var bdata;
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	var userInfo = summer.getStorage('userInfo_local');
	if (userInfo) {//有数据
		bdata = summer.getStorage("bdata");
		var billId = bdata["BILL_ID"];
		var instanceId = bdata["INSTANCE_ID"];
		var nd = userInfo.nd;
		var userId = userInfo.userId;
		var coCode = userInfo.coCode;
		var uid = userInfo.uid;
		loadData(billId);
		loadBudgetData(billId);
		loadFSProcess(instanceId);
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
function loadData(billId) {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "bill_id=" + billId;
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/selectBillDetail?" + urlParam,
		success : function(data) {
			var billDeData = data.rows;
			var billDeDataNew = [];
			//组装最后结果
			for (var i in billDeData) {
				billDeData[i].INFO_VALUE = util.changeTwoDecimal(billDeData[i].INFO_VALUE);
				var infoType = billDeData[i].INFO_TYPE;
				if (infoType == "2") {
					billDeDataNew.push(billDeData[i]);
				}
			}

			var inputDate;
			if (bdata["INPUT_DATE_STRING"] != null || bdata["INPUT_DATE_STRING"] != undefined) {
				inputDate = bdata["INPUT_DATE_STRING"];
			} else {
				inputDate = bdata["INPUT_DATE_TOSTRING"];
			}
			$("#inputDate").text(inputDate);
			$("#reason").text(bdata["REASON"]);
			$("#checkMoney").text(util.changeTwoDecimal(bdata["CHECK_MONEY"]));
			$("#stausName").text(bdata["BILL_STATUS_NAME"]);
			//	$("#budgetStr").text(billDeData[0].BUDGETSTR);

			var listgroupText = doT.template($("#listgroup-tmpl").text());
			$("#umListGroupRow").html(listgroupText(billDeDataNew));
		}
	});
}

/**
 * 加载FS从报销系统同步过来的预算数据
 * @param {Object} billId
 */
function loadBudgetData(billId) {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "BILL_ID=" + billId;

	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/getBudgetData?" + urlParam,
		success : function(data) {
			if (data.resultCode == 1) {
				var rows = data.rows.length;
				var billBgDataShow = new Array(rows);
				//声明一维数组
				for (var i = 0; i < rows; i++) {
					var billBgData = data.rows[i];
					billBgDataShow[i] = new Array();
					//声明二维数组
					for (var key in billBgData) {
						var tempData = billBgData[key].split('@@@');
						if (tempData[0] != "" && tempData[0] != undefined) {
							billBgDataShow[i].push({
								"GL_INFO_NAME" : tempData[0],
								"GL_INFO_VALUE" : tempData[1]
							});
						}
					}
				}
				var arBggroupText = doT.template($("#arBg-tmpl").text());
				$("#arBgGroupRow").html(arBggroupText(billBgDataShow));
			}
		}
	});
};

/**
 * 加载FS从报销系统同步过来的流程跟踪 ，我的报销用
 * @param {Object} instanceId
 */
function loadFSProcess(instanceId) {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "INSTANCE_ID=" + instanceId;

	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/getWfnoteData?" + urlParam,
		success : function(data) {
			var billDeData = data.rows;
			var jsonArray = $.toJSON(billDeData);
			//转化JSON字符串
			jsonArray = JSON.parse(jsonArray);
			//转化为JavaScript对象
			console.log(billDeData);
			var ViewModel = function() {
			};
			var viewModel = new ViewModel();
			viewModel.data = ko.observableArray(jsonArray);
			ko.applyBindings(viewModel);
		}
	});
};

