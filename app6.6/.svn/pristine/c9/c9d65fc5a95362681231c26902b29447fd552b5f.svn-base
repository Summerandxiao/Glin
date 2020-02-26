var isMore = 0;
summerready = function() {
	$("#billSearch").hide();
	var userInfo;
	//是否为更多选项
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	var tempBillList = [];
	if (summer.getStorage('userInfo_local')) {//有数据
		$("#oneMonth").attr("class", "btn um-btn-info");
		var endDate = util.getCurrentDay();
		var startDate = util.getStartDay(1);
		loadData(startDate, endDate);

		var bntLink = $("#dateBtnGroup");
		bntLink.on("click", function(e) {
			var target = e.target;
			var parent = $summer.closest(target, '.btn');
			if (parent) {
				var btnId = parent.id;
				//按照年份
				if ("threeMonth" == btnId) {
					startDate = util.getStartDay(3);
					$("#oneMonth").attr("class", "btn");
					$("#halfYear").attr("class", "btn");
					$("#oneYear").attr("class", "btn");
					$("#threeMonth").attr("class", "btn um-btn-info");
					$("#more").attr("class", "btn");
					isMore = 0;
					loadData(startDate, endDate);
				} else if ("halfYear" == btnId) {
					startDate = util.getStartDay(6);
					$("#oneMonth").attr("class", "btn");
					$("#threeMonth").attr("class", "btn");
					$("#oneYear").attr("class", "btn");
					$("#halfYear").attr("class", "btn um-btn-info");
					$("#more").attr("class", "btn");
					isMore = 0;
					loadData(startDate, endDate);
				} else if ("oneYear" == btnId) {
					startDate = util.getStartDay(12);
					$("#oneMonth").attr("class", "btn");
					$("#halfYear").attr("class", "btn");
					$("#threeMonth").attr("class", "btn");
					$("#oneYear").attr("class", "btn um-btn-info");
					$("#more").attr("class", "btn");
					isMore = 0;
					loadData(startDate, endDate);
				} else if ("oneMonth" == btnId) {
					startDate = util.getStartDay(1);
					$("#oneYear").attr("class", "btn");
					$("#halfYear").attr("class", "btn");
					$("#threeMonth").attr("class", "btn");
					$("#oneMonth").attr("class", "btn um-btn-info");
					$("#more").attr("class", "btn");
					isMore = 0;
					loadData(startDate, endDate);
				} else {
					$("#oneYear").attr("class", "btn");
					$("#halfYear").attr("class", "btn");
					$("#threeMonth").attr("class", "btn");
					$("#oneMonth").attr("class", "btn");
					$("#more").attr("class", "btn um-btn-info");
					isMore = 1;
					$("#billSearch").show();
				}
			}
		});

		$("#okBtn").on("click", function() {
			startDate = $("#startDate").val();
			endDate = $("#endDate").val();
			loadData(startDate, endDate);
			$("#billSearch").hide();
		});

		$("#cancelBtn").on("click", function() {
			$("#billSearch").hide();
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
function subgo(obj) {
	var thisObj = $(obj);
	var billId = thisObj.attr("billId");
	var tempBill;
	$.each(tempBillList, function(index, val) {
		$.each(val.value, function(i, value) {
			if (value.BILL_ID == billId) {
				tempBill = value;
			}
		});
	});
	summer.setStorage("bdata", tempBill);
	//保存点击的数据 在报销详情页取出
	summer.openWin({
		id : 'billDetail',
		url : 'html/billDetail.html',
		reload : true,
		pageParam : {
			name : 'test'
		}
	});
};

function loadData(startDate, endDate) {
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "INPUTOR_ID=" + userInfo.userId;
	//urlParam+="&co_code="+_application.userInfo.coCode;
	if (isMore == 0) {
		urlParam += "&ND=" + userInfo.nd;
	}
	urlParam += "&CLIENT=MOBILE";
	urlParam += "&billType=EXP";
	if (startDate != undefined && startDate != "") {
		urlParam += "&STARTDATE=" + startDate;
	}
	if (endDate != undefined && endDate != "") {
		urlParam += "&ENDDATE=" + endDate;
	}

	if (isMore == 1) {
		var billNo = $("#billNo").val();
		if (billNo != undefined && billNo != "") {
			urlParam += "&BILLNO=" + billNo;
		}
		var minMoney = $("#minMoney").val();
		if (minMoney != undefined && minMoney != "") {
			urlParam += "&MINMONEY=" + minMoney;
		}
		var maxMoney = $("#maxMoney").val();
		if (maxMoney != undefined && maxMoney != "") {
			urlParam += "&MAXMONEY=" + maxMoney;
		}
		var reason = $("#reason").val();
		if (reason != undefined && reason != "") {
			urlParam += "&REASON=" + encodeURIComponent(encodeURIComponent(reason));
		}
	}
	var billList = [];
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/selectBillList?" + urlParam,
		success : function(data) {
			if (data.rows.length <= 0) {
				UM.toast({
					title : '提示：',
					text : '没有可显示的报销单据',
					duration : 2000
				});
			} else if (data.resultCode == 0) {
				UM.toast({
					title : '提示：',
					text : '查询出错',
					duration : 2000
				});
				return;
			}
			var tableData = new Object();
			tableData.rows = data.rows;
			var groupObject = {};
			var valueTemp = null;
			var typeName = "";
			for (i in tableData.rows) {
				tableData.rows[i].CHECK_MONEY = util.changeTwoDecimal(tableData.rows[i].CHECK_MONEY);

				typeName = tableData.rows[i].BILL_TYPE_NAME;
				valueTemp = groupObject[typeName];
				if (valueTemp == null) {
					var buffer = new Array();
					groupObject[typeName] = buffer;
				}
				groupObject[typeName].push(tableData.rows[i]);
			}
			for (var type in groupObject) {
				if (type != "undefined")
					billList.push({
						"key" : type + " (" + groupObject[type].length + "笔)",
						"value" : groupObject[type]
					});
			}
			tempBillList = billList;
			var listviewText = doT.template($("#listview-tmpl").text());
			$("#listview").html(listviewText(billList));
			$.each(billList, function(index, val) {//已审核字体变为蓝色
				$.each(val.value, function(i, value) {
					if (value.BILL_STATUS_NAME == "结束") {
						$('span:contains(结束)').parent().parent().parent().css("color", "#007aff")
					}
				});
			});
		}
	});
}