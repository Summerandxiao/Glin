var bdata;
var billId;
var userInfo;
var ip;
var curBtn,app_content;
summerready = function() {
	$("#opinionArea").hide();
	UM.showLoadingBar({
		"text" : "加载中",
		"icons" : "ti-loading"
	});
	ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var curStatus = summer.getStorage("curStatus");
	if (curStatus == 0) {
		$("#callback").hide();
		$("#approve").show();
		$("#retreat").show();
		$("#backInput").show();
	} else if (curStatus == 1) {
		$("#approve").hide();
		$("#retreat").hide();
		$("#backInput").hide();
		$("#callback").show();
	}
	if (userInfo) {//有数据
		bdata = summer.getStorage("bdata");
		billId = bdata["BILL_ID"];
		loadData(billId);
		UM.hideLoadingBar();

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

	$("#approve").on("click", function(e) {
		$("#app_content").val("同意");
		curBtn="approve";
		$("#opinionArea").show();
	});
	$("#retreat").on("click", function(e) {//退回上一岗
		$("#app_content").val("不同意");
		curBtn="retreat";
		$("#opinionArea").show();
	});
	$("#backInput").on("click", function(e) {//退回制单人
		$("#app_content").val("不同意");
		curBtn="backInput";
		$("#opinionArea").show();
	});
	$("#okBtn").on("click", function(e) {	
		app_content = encodeURIComponent(encodeURIComponent($("#app_content").val()));
		if (app_content == undefined || app_content == "") {
			UM.alert("请填写审批意见");
			return;
		}
		if("approve"==curBtn){
			approve();
		}else if("retreat"==curBtn){
			retreat();
		}else if("backInput"==curBtn){
			backInput();
		}
	});
	$("#cancelBtn").on("click", function(e) {
		$("#opinionArea").hide();
	});

	$("#callback").on("click", function() {
		$.getJSON("http://" + ip + "/FS/services/upService/callBack?BILL_ID=" + billId + "&CO_CODE=" + userInfo.coCode + "&USERID=" + userInfo.userId + "&UID=" + userInfo.uid + "&CLIENT=MOBILE", function(data) {
			if (data.resultCode == "1") {
				UM.alert("收回成功");
				summer.openWin({
					id : "upComing",
					url : "html/upComing.html",
					reload : true,
					isKeep:false
				});
			} else {
				UM.alert('收回失败,请核实!');
			}
		});
	});
}

function openAttachFile(){
	summer.setStorage('module','upService');
	summer.openWin({
		id : 'attachFile',
		url : 'html/attachFile.html',
		reload : true,
		pageParam : {
			billId : billId
		}
	});
}

function approve(){
	var approveUrl = 'http://' + ip + '/FS' + "/services/upService/commit";
	var param = "BILL_ID=" + billId + "&APPROVALOPINION=" + app_content + "&ND=" + userInfo.nd + "&USERID=" + userInfo.userId + "&CO_CODE=" + userInfo.coCode + "&UID=" + userInfo.uid + "&CLIENT=MOBILE";
	var approveUrl = approveUrl + "?" + param;
	$.ajax({
		type : "POST",
		async : false,
		url : approveUrl,
		success : function(data) {
			if (data.resultCode == "1") {
				UM.alert("审批通过");
				summer.openWin({
					id : "upComing",
					url : "html/upComing.html",
					reload : true,
					isKeep:false
				});
			} else {
				UM.alert('操作失败,请核实!');
			}
			$("#opinionArea").hide();
		}
	});
}

function retreat(){
	$.getJSON('http://' + ip + '/FS' + "/services/upService/untread?BILL_ID=" + billId + "&APPROVALOPINION=" + app_content + "&CO_CODE=" + userInfo.coCode + "&USERID=" + userInfo.userId + "&UID=" + userInfo.uid + "&CLIENT=MOBILE", function(data) {
		if (data.resultCode == "1") {
			UM.alert("退回上一岗成功");
			summer.openWin({
				id : "upComing",
				url : "html/upComing.html",
				reload : true,
				isKeep:false
			});
		} else {
			UM.alert('退回上一岗失败,请核实!');
		}
	});
	$("#opinionArea").hide();
}

function backInput(){
	$.getJSON("http://" + ip + "/FS/services/upService/untreadToFirst?BILL_ID=" + billId + "&APPROVALOPINION=" + app_content + "&CO_CODE=" + userInfo.coCode + "&USERID=" + userInfo.userId + "&UID=" + userInfo.uid + "&CLIENT=MOBILE", function(data) {
		if (data.resultCode == "1") {
			UM.alert('退回制单人成功!');
			summer.openWin({
				id : "upComing",
				url : "html/upComing.html",
				reload : true,
				isKeep:false
			});
		} else {
			UM.alert('退回制单人失败,请核实!');
		}
	});
	$("#opinionArea").hide();
}

function loadData(billId) {
	/*UM.showLoadingBar({
		"text" : "正在加载基本信息、费用项……",
		"icons" : "ti-loading"
	});*/
	//加载基本信息
	$("#billNo").text(bdata["BILL_NO"]);
	$("#orgName").text(bdata["ORG_NAME"]);
	$("#projTypeName").text(bdata["PROJ_TYPE_NAME"]);
	$("#projContent").text(bdata["PROJ_CONTENT"]);
	$("#purcTotalAmt").text(util.changeTwoDecimal(bdata["PURC_TOTAL_AMT"]));
	$("#statusName").text(bdata["BILL_STATUS_NAME"]);

	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "BILL_ID=" + billId;
	urlParam += "&UID=" + userInfo.uid;
	urlParam += "&CLIENT=MOBILE";
	/**
	 * 加载基本信息、商品信息
	 */
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/upService/getDetailByBillId?" + urlParam,
		success : function(data) {
			if (data.resultCode == 1) {
					$("#isOrgFund").text(data.rows.BILL_INFO.IS_ORG_FUND);
					$("#fundOrigin").text(data.rows.BILL_INFO.FUND_ORIGIN);
					$("#upReason").text(data.rows.BILL_INFO.UP_REASON);
					$("#budgetProject").text(data.rows.BILL_INFO.BUDGET_PROJECT);
					/*******商品信息start******/
					var billGoodsDataNew=[];             //声明一维数组 
					billGoodsData = data.rows.DETAIL;
					//billGoodsData=objKeySort(billGoodsData); //报销明细key排序
					//组装最后结果
					for (var i in billGoodsData) {
						billGoodsDataNew[i]=new Array();        //声明二维数组
						var curRow=billGoodsData[i];
						for(j in curRow){
							billGoodsDataNew[i].push({
								"KEY" : j,
								"VALUE" : typeof(curRow[j])=="number"?util.changeTwoDecimal(curRow[j]):curRow[j]
							}) ;
						}
					}
					billGoodsDataNew=clearArrayNullItem(billGoodsDataNew);
					var listgroupText = doT.template($("#upGoods-tmpl").text());
					$("#upGoodsGroupRow").html(listgroupText(billGoodsDataNew));
					/*******商品信息end**********/
					/*******资金信息start******/
					var billFundDataNew=[];             //声明一维数组 
					billFundData = data.rows.FUNDS;
					//组装最后结果
					for (var i in billFundData) {
						billFundDataNew[i]=new Array();        //声明二维数组
						var curRow=billFundData[i];
						for(j in curRow){
							billFundDataNew[i].push({
								"KEY" : j,
								"VALUE" : typeof(curRow[j])=="number"?util.changeTwoDecimal(curRow[j]):curRow[j]
							}) ;
						}
					}
					billFundDataNew=clearArrayNullItem(billFundDataNew);
					var listgroupText = doT.template($("#upFund-tmpl").text());
					$("#upFundGroupRow").html(listgroupText(billFundDataNew));
					/*******资金信息end**********/
					/******流程跟踪 start*********/
						var traceInfo = data.rows.ACTION_HISTORY;
			for (var p in traceInfo) {
			if(traceInfo[p].hasOwnProperty("description")){
			}else{
			traceInfo[p].description="";
			}
				var actionname = traceInfo[p].actionName;
				if (actionname != undefined && actionname.indexOf('流向') > -1) {
					traceInfo[p].actionName = '通过';
				} else if (actionname == undefined) {
					traceInfo[p].actionName = '待处理';
				}
				var executeTime = traceInfo[p].executeTime;
				if (executeTime == undefined || executeTime.length == 0) {
					traceInfo[p].executeTime = "";
				}
			}
			var ViewModel = function() {
			};
			var viewModel = new ViewModel();
			viewModel.data = ko.observableArray(traceInfo);
			ko.applyBindings(viewModel);
					/******流程跟踪 end*********/
			}

		},
		error : function(data) {
			UM.alert(data.statusText);
		}
	});

	//UM.hideLoadingBar();
}


//排序的函数
function objKeySort(arys) { 
var oldstr=JSON.stringify(arys);
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();　　 
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for(var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]]; 
        //向新创建的对象中按照排好的顺序依次增加键值对

    }
    var newstr=JSON.stringify(newObj);
    return newObj; //返回排好序的新对象
}

/**
 * 清除数组中的空元素 
 */
function clearArrayNullItem(array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == "" || typeof (array[i]) == "undefined") {
			array.splice(i, 1);
			i = i - 1;

		}

	}
	return array;
}


/**
 * 加载报销系统实时查询的流程跟踪，移动审批用
 */
function loadArProcess(billId) {
	/*UM.showLoadingBar({
		"text" : "正在流程跟踪……",
		"icons" : "ti-loading"
	});*/
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "BILL_ID=" + billId;
	urlParam += "&CO_CODE=" + userInfo.coCode;
	urlParam += "&UID=" + userInfo.uid;
	urlParam += "&CLIENT=MOBILE";
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/selectTraceInfo?" + urlParam,
		success : function(data) {
		
		}
	});
	
	//UM.hideLoadingBar();
}
