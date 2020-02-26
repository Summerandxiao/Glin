var nd,
    mo,
    sdata,
    coCode,
    userInfo,
    selectPayNoMo;
//coCode='141016602001';
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	if (userInfo) {//有数据
		sdata = summer.getStorage("sdata");
		nd = sdata["YEAR"];
		mo = sdata["MO"];
		coCode = userInfo.coCode;
		loadPayNoMo();
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
function loadPayNoMo() {
	$("#payNoMo").empty();
	var prsType = summer.getStorage("prsType");
	var param = "ND=" + nd + "&CO_CODE=" + coCode + "&EMP_CODE=" + userInfo.userId + "&MO=" + mo + "&PRTYPE_CODE=" + prsType;
	$.getJSON("http://" + userInfo.ip + "/FS/services/salaryService/selectPaylistPayNoMo?" + param, function(data) {
		console.log(data.rows);
		if (data.total > 0) {
			for (var i = 0; i < data.total; i++) {
				var item = data.rows[i];
				$("#payNoMo").append("<option  value=" + item.ID + ">" + item.TEXT + "</option>");
			}
			$("#payNoMo option:first").prop("selected", 'selected');
			selectPayNoMo = $("#payNoMo option:selected").val();
			loadData();
			$("#payNoMo").on("change", function(event) {
				selectPayNoMo = this.value;
				loadData();
			});
		} else {
			/* UM.toast({
			 title : '友情提示：',
			 text : '登录人在当前没有可显示的工资类别',
			 duration : 3000
			 }); */
		}
	});

}

function loadData() {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "ND=" + nd;
	urlParam += "&IS_DISPLAY=Y";
	urlParam += "&co_code=" + coCode;
	urlParam += "&PRTYPE_CODE=" + summer.getStorage("prsType");
	urlParam += "&userId=" + userInfo.userId;
	urlParam += "&PERIODS=" + mo + "&PERIODE=" + mo;

	if (selectPayNoMo != '0') {
		urlParam += "&pay_no_mo=" + selectPayNoMo;
	}

	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/salaryService/selectSalaryListYD?" + urlParam,
		success : function(data) {
			if (data.rows.length <= 0) {
				UM.toast({
					title : '提示：',
					text : '登录人在当前批次没有可显示的工资',
					duration : 2000
				});
			}
			sdata = data.rows[0];
			console.log(sdata);
			$.ajax({
				type : "get",
				async : false,
				url : "http://" + userInfo.ip + "/FS/services/salaryService/selectSalaryDetailType?" + urlParam,
				success : function(data) {
					var salaryDeData = data.rows;
					for (var i in salaryDeData) {
						var prItemCode = salaryDeData[i].PRITEM_CODE;
						if (prItemCode && prItemCode.indexOf('PR_PAYLIST_N') != -1) {
							salaryDeData[i].PRITEM_CALC_TYPE = changeTwoDecimal(sdata[prItemCode]);
						} else if (sdata[prItemCode] != undefined) {
							salaryDeData[i].PRITEM_CALC_TYPE = sdata[prItemCode];
						}
					}

					var salaryDeDataNew = [];
					//组装最后结果

					for (var i in salaryDeData) {
						var prItemCode = salaryDeData[i].PRITEM_CODE;
						if (prItemCode && prItemCode.indexOf('PR_PAYLIST_N') != -1) {
							salaryDeData[i].PRITEM_CALC_TYPE = changeTwoDecimal(sdata[prItemCode]) + '元';
						} else if (sdata[prItemCode] != undefined) {
							salaryDeData[i].PRITEM_CALC_TYPE = sdata[prItemCode];
						}
						//金额为0的不显示
						if (prItemCode && sdata[prItemCode] != 0 && sdata[prItemCode] != undefined) {
							salaryDeDataNew.push(salaryDeData[i]);
						}
					}
					$("#name").text(sdata["EMP_NAME"]);
					$("#month").text(sdata["YEAR"] + "年-" + sdata["MO"] + "月");
					$("#pr_paylist_c00").text(sdata["PR_PAYLIST_C00"]);
					//$("#prs_level").text(sdata["PRS_LEVEL"]);
					//$("#prs_type").text(sdata["PRS_TYPE"]);
					//console.log(salaryDeDataNew);

					var listgroupText = doT.template($("#salaryDetail-tmpl").text());
					$("#salaryDetailRow").html(listgroupText(salaryDeDataNew));
					//console.log(salaryDeDataNew);
				}
			});
			summer.rmStorage("mobileSalaryRedList");
			$.ajax({
				type : "get",
				async : false,
				url : "http://" + userInfo.ip + "/FS/services/salaryService/selectRedSalaryListByMobile?" + urlParam,
				success : function(data) {
					console.log(data.rows);
					summer.setStorage("mobileSalaryRedList", data.rows);
				}
			});
		}
	});

}

function changeTwoDecimal(money) {
	if (isNaN(money)) {
		return money;
	}
	var f_x = parseFloat(money);

	var f_x = Math.round(money * 100) / 100;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + 2) {
		s_x += '0';
	}
	return s_x;
} 