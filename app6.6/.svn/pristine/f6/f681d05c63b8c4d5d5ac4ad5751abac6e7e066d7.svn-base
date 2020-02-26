var bdata;
var billId;
var userInfo;
var ip;
var curBtn,app_content;
var is_show;
summerready = function() {
	$("#opinionArea").css({"z-index":-1});
	ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	//var curStatus = summer.pageParam.curStatus;
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
		bdata = summer.getStorage("bdata");
		var isSelf=bdata["IS_SELF"]>0?true:false;
		if(!isSelf){//单据填报为其他代报人
			$("#callback").hide();
			$("#approve").hide();
			$("#retreat").hide();
			$("#backInput").hide();
		}
	}
	if (userInfo) {//有数据
		bdata = summer.getStorage("bdata");
		billId = bdata["BILL_ID"];
		var billStatusName = bdata["BILL_STATUS_NAME"];
		if("未提交" == billStatusName){
			$("#callback").hide();
			$("#approve").hide();
			$("#retreat").hide();
			$("#backInput").hide();
		}
		
		var urlParamgetNextNodeIs_view = "BILL_ID=" + billId + "&USER_ID=" + userInfo.userId + "&NODESETTING_TYPE=IS_NEED_EXETOR";
		console.log("urlParamgetNextNodeIs_view:"+urlParamgetNextNodeIs_view);
		$.ajax({
			type : "get",
			async : false,
			url : "http://" + ip + "/FS/services/billService/getNextNodeIs_view?" + urlParamgetNextNodeIs_view,
			error : function(data) {
				console.log(data);
			},
			success : function(data) {
				if (data.resultCode == "1") {
					is_show = data.rows;
					console.log(is_show);
				} else {
					alert(data.rows);
				}
			}
		});
	
		//	var instanceId = bdata["INSTANCE_ID"];
		//	var nd = userInfo.nd;
		//	var userId = userInfo.userId;
		//	var coCode = userInfo.coCode;
		//	var uid = userInfo.uid;
		loadData(billId);
		loadArProcess(billId);
		$(".mark").hide();
		$(".tishi").hide();
		
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
		//is_show
		if(is_show){
			console.log("开启下一岗querynextperson()");
			querynextperson();
		}
		$("#app_content").val("同意");
		curBtn="approve";
		$("#opinionArea").css({"z-index":2});
		$("#opinionArea").show();
	});
	$("#retreat").on("click", function(e) {//退回上一岗
		$("#app_content").val("不同意");
		curBtn="retreat";
		$("#opinionArea").css({"z-index":2});
		$("#opinionArea").show();
	});
	$("#backInput").on("click", function(e) {//退回制单人
		$("#app_content").val("不同意");
		curBtn="backInput";
		$("#opinionArea").css({"z-index":2});
		$("#opinionArea").show();
	});
	$("#okBtn").on("click", function(e) {	
		app_content = $("#app_content").val();
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
		$("#opinionArea").css({"z-index":-1});
	});

	$("#callback").on("click", function() {
		console.log(userInfo)
		$.getJSON("http://" + ip + "/FS/services/billService/callBack?BILL_ID=" + billId + "&CO_CODE=" + userInfo.coCode + "&USERID=" + userInfo.userId + "&UID=" + userInfo.uid + "&CLIENT=MOBILE", function(data) {
			console.log(data)
			if (data.resultCode == "1") {
				UM.alert("收回成功");
				summer.openWin({
					id : "upComing",
					url : "html/upComing.html",
					reload : true,
					isKeep : false
				});
			} else {
				UM.alert(data.rows);
			}
		});
	});
}
function querynextperson(){
	bdata = summer.getStorage("bdata");
	billId = bdata["BILL_ID"];
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var approveUrl = 'http://' + ip + '/FS' + "/services/billService/getAllNextNodeExecutorListMobile_new";
	var param = "BILL_ID=" + billId +  "&ND=" + userInfo.nd + "&USERID=" + userInfo.userId + "&CO_CODE=" + userInfo.coCode  + "&CLIENT=MOBILE";
	var approveUrl = approveUrl + "?" + param;
	//获取单据号获取下一岗人员
	$.ajax({
		type : "get", //请求方式
		url : approveUrl, //url地址
		success : function(data) {
			if (data.resultCode == 1) {
				console.log(data.rows);
				if(data.rows.length != 0){
					$("#opinionAreaNextPerchind").show();
					var selectbox = document.getElementById("billTypeSelect");
					selectbox.removeChild(selectbox.options[0]);  //移除第一个选项
					for (var i = 0; i < data.rows.length; i++) {
						$("#billTypeSelect").append("<option value='" + data.rows[i].userId + "'>" + data.rows[i].userId+"——"+data.rows[i].userName + "</option>");
					}
				}
			}
		},
		error : function(data) {
			UM.alert("查询单据类型出错：" + data);
		}
	});
}
function openAttachFile(){
	summer.setStorage('module','billService');
	summer.openWin({
		id : 'attachFile',
		url : 'html/attachFile.html',
		reload : true,
		pageParam : {
			billId : billId
		}
	});
}

/**
 * 联查事前审批单等单据
 * 报销返回结果size=0，提示没有关联单据；size=1,直接打开明细；size>1，打开列表页面 
 */
function linkOtherBill(){
		$.ajax({
             type: "GET",
             url: "http://" + ip + "/FS/services/billService/getArBillRelation?billId="+billId,
             //data: {billId:billId},
             //dataType: "json",
             success: function(data){
             	if(data.resultCode==1){
			             if(data.rows.length==0){
							UM.toast({
								title : '提示：',
								text : '没有关联的单据',
								duration : 2000
							});
			             }else if(data.rows.length==1){
			                var linkBillId=data.rows[0].BILLID;
			             	var tijiaoData = {};
							tijiaoData["BILL_ID"] = linkBillId;
							tijiaoData["IS_SELF"] = -1;
							summer.setStorage("bdata", tijiaoData);
							summer.openWin({
								id : 'arAuditDetail',
								url : 'html/arAuditDetail.html',
								reload:true,
							});
			             }else if(data.rows.length>1){
			             	var linkBills=data.rows;
			             	console.log(JSON.stringify(linkBills));
			             	summer.setStorage('linkBills',linkBills);
			             	summer.openWin({
								id : 'linkBillList',
								url : 'html/linkBillList.html'
							});
			             }
                      }else{
	                      UM.toast({
									title : '提示：',
									text : '联查单据失败',
									duration : 2000
								});
	                      }
                      },
              error:function(XMLHttpRequest, textStatus, errorThrown){
              			UM.toast({
							title : '提示：',
							text : '联查单据失败',
							duration : 2000
						});
              }
         });
}

function approve(){
	var approveUrl = 'http://' + ip + '/FS' + "/services/billService/commitAndPush";
	var arr = []
	arr.push(billId)
	var nextperson = $("#billTypeSelect").val();//下一岗申请人billTypeSelect
	var param = "BILL_ID=" + arr + "&APPROVALOPINION=" + app_content + "&ND=" + userInfo.nd + "&USERID=" + userInfo.userId + "&CO_CODE=" + userInfo.coCode + "&UID=" + userInfo.uid + "&NEXT_PERSON=" + nextperson + "&CLIENT=MOBILE";
	var approveUrl = approveUrl + "?" + param;
	$.ajax({
		type : "POST",
		async : false,
		url : approveUrl,
		success : function(data) {
		console.log(data)
			if (data.resultCode == "1") {
				UM.alert("审批通过");
				summer.openWin({
					id : "upComing",
					url : "html/upComing.html",
					reload : true,
					isKeep : false
				});
			} else {
				UM.alert(data.rows);
			}
			$("#opinionArea").hide();
			$("#opinionArea").css({"z-index":-1});
		}
	});
}

function retreat(){
	$.getJSON('http://' + ip + '/FS' + "/services/billService/untread?BILL_ID=" + billId + "&APPROVALOPINION=" + app_content + "&CO_CODE=" + userInfo.coCode + "&USERID=" + userInfo.userId + "&UID=" + userInfo.uid + "&CLIENT=MOBILE", function(data) {
		if (data.resultCode == "1") {
			UM.alert("退回上一岗成功");
			summer.openWin({
				id : "upComing",
				url : "html/upComing.html",
				reload : true,
				isKeep : false
			});
		} else {
			UM.alert(data.rows);
		}
	});
	$("#opinionArea").hide();
	$("#opinionArea").css({"z-index":-1});
}

function backInput(){
	$.getJSON("http://" + ip + "/FS/services/billService/untreadToFirst?BILL_ID=" + billId + "&APPROVALOPINION=" + app_content + "&CO_CODE=" + userInfo.coCode + "&USERID=" + userInfo.userId + "&UID=" + userInfo.uid + "&CLIENT=MOBILE", function(data) {
		if (data.resultCode == "1") {
			UM.alert('退回制单人成功!');
			summer.openWin({
				id : "upComing",
				url : "html/upComing.html",
				reload : true,
				isKeep : false
			});
		} else {
			UM.alert(data.rows);
		}
	});
	$("#opinionArea").hide();
	$("#opinionArea").css({"z-index":-1});
}

function loadData(billId) {
	/*UM.showLoadingBar({
		"text" : "正在加载基本信息、费用项……",
		"icons" : "ti-loading"
	});*/
	//加载基本信息
	/*$("#billNo").text(bdata["BILL_NO"]);
	$("#inputDate").text(bdata["INPUT_DATE_TOSTRING"]);
	$("#reason").text(bdata["REASON"]);
	$("#checkMoney").text(util.changeTwoDecimal(bdata["CHECK_MONEY"]));
	$("#statusName").text(bdata["BILL_STATUS_NAME"]);
	$("#remark").text(bdata["REMARK"]);*/
	$("#billTypeTitle").text(bdata["BILL_TYPE_TITLE"]);

	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "BILL_ID=" + billId;
	urlParam += "&UID=" + userInfo.uid;
	urlParam += "&CLIENT=MOBILE";
	/**
	 * 加载基本信息和费用项信息
	 */
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/selectByBillIdMobile?" + urlParam,
		success : function(data) {
			if (data.resultCode == 1) {
				console.log(data.rows);
				var inputDate=new Date(data.rows.INPUT_DATE);
				var inputDateStr=inputDate.getFullYear() + '-' + (inputDate.getMonth() + 1) + '-' + inputDate.getDate();
				$("#appName").text(data.rows.APP_NAME);
				$("#billNo").text(data.rows.BILL_NO);
				$("#billType").text(data.rows.BILL_TYPE_NAME);
				$("#checkMoney").text(util.changeTwoDecimal(data.rows.CHECK_MONEY));
				$("#inputDate").text(inputDateStr);
				$("#orgName").text(data.rows.ORG_NAME);
				$("#reason").text(data.rows.REASON);
				$("#remark").text(data.rows.REMARK);
				$("#projectName").text(data.rows.PROJECT_NAME);
				var billBasicData;
				var billBasicDataNew = [];
				billBasicData = data.rows.billCommonMap;
					//组装最后结果
					for (var i in billBasicData) {
						billBasicDataNew.push({
							"BASIC_KEY" : i,
							"BASIC_VALUE" : billBasicData[i]
						});
					}
				var listgroupText = doT.template($("#arBasic-tmpl").text());
				$("#arBasic").html(listgroupText(billBasicDataNew));
			
				var billDeData;
				var billDeDataNew = [];
				//如果有外币显示外币，没有外币显示本币--start-----------------
				if (JSON.stringify(data.rows.bill_expense_foreign) != "{}" && data.rows.bill_expense_foreign != undefined) {
					billDeData = data.rows.bill_expense_foreign;
					billDeData=objKeySort(billDeData); //费用项key排序
					//组装最后结果
					for (var i in billDeData) {
						billDeDataNew.push({
							"EXPENSE_NAME" : i.split("&", 1)+'('+i.split("&", 2)[1]+')',
							"MONEY" : util.changeTwoDecimal(billDeData[i].currencyMoney) + billDeData[i].currencyKind
						});
					}
				} else {
					billDeData = data.rows.bill_expense;
					billDeData=objKeySort(billDeData); //费用项key排序
					//组装最后结果
					for (var i in billDeData) {
						billDeDataNew.push({
							"EXPENSE_NAME" : i,
							"MONEY" : util.changeTwoDecimal(billDeData[i]) + "元"
						});
					}
				}
				//如果有外币显示外币，没有外币显示本币--end---------------
				var listgroupText = doT.template($("#listgroup-tmpl").text());
				$("#umListGroupRow").html(listgroupText(billDeDataNew));
				
				
				/*****************报销明细信息 start**************************/
				var billRecnoDataNew=[];             //声明一维数组 
				billRecnoData = data.rows.billRecnoMap;
				billRecnoData=objKeySort(billRecnoData); //报销明细key排序
				//组装最后结果
				for (var i in billRecnoData) {
					billRecnoDataNew[i]=new Array();        //声明二维数组
					var curRow=billRecnoData[i];
					for(j in curRow){
						billRecnoDataNew[i].push({
							"EXPENSE_NAME" : j,
							"MONEY" : typeof(curRow[j])=="number"?util.changeTwoDecimal(curRow[j]):curRow[j]
						}) ;
					}
				}
				billRecnoDataNew=clearArrayNullItem(billRecnoDataNew);
				console.log(JSON.stringify(billRecnoDataNew));
				var arInfogroupText = doT.template($("#arInfo-tmpl").text());
				$("#arInfoGroupRow").html(arInfogroupText(billRecnoDataNew));
				/*****************报销明细信息 end**************************/
			}else{
				UM.alert(data.rows);
			}
			
			/**
			 * 加载预算信息
			 */
			$.ajax({
				type : "get",
				async : false,
				url : "http://" + userInfo.ip + "/FS/services/billService/selectBgByBillIdMobile?" + urlParam,
				success : function(data) {
					if (data.resultCode == 1) {
						var billBgDataNew=[];             //声明一维数组 
						billBgData = data.rows;
						//组装最后结果
						for (var i in billBgData) {
							billBgDataNew[i]=new Array();        //声明二维数组
							var curRow=billBgData[i];
							for(j in curRow){
								billBgDataNew[i].push({
									"GL_INFO_NAME" : j,
									"GL_INFO_VALUE" : curRow[j]
								}) ;
							}
						}
						billBgDataNew=clearArrayNullItem(billBgDataNew);
						console.log(JSON.stringify(billBgDataNew));
						var listgroupText = doT.template($("#glinfo-tmpl").text());
						$("#glinfoRow").html(listgroupText(billBgDataNew));
					}else{
						UM.alert(data.rows);
					}
				}
			});

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
			var traceInfo = data.rows;
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
		}
	});
	
	//UM.hideLoadingBar();
}
