var userInfo,
//coCode,
    curStatus = 0;
var ip = localStorage.getItem("ip");
var arr=[];
//查询条件
summerready = function() {
	//ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	if (userInfo) {//有数据
		//coCode = userInfo.coCode;
	} else {
		summer.closeToWin({
			id : 'login',
			url : 'html/login.html'
		});
	}

	//我的
	$("#MyInfo").on("click", function(e) {
		summer.openWin({
			id : 'MyInfo',
			url : 'html/MyInfo.html',
			pageParam : {
				name : 'test'
			},
			reload : true,
			isKeep:false
		});
	});
	//应用
	$("#index").on("click", function(e) {
		summer.openWin({
			id : 'index',
			url : 'index.html',
			pageParam : {
				status : 0
			},
			isKeep:false
		});
	});
	
};

var app = angular.module('myApp', []);
app.controller('ctrlForm', function($scope, $http) {
	/*$scope.filterShow = false;
	 //控制部门树窗口的打开隐藏
	 $scope.filterBumen = "";
	 $scope.active = true;
	 $scope.fuzhi = function(obj) {
	 $scope.filterBumen = obj.id+obj.text;
	 $scope.filterShow = false;
	 };*/
	//全选
	$scope.qx = function () {
		for(var i = 0; i < $('.data input').length; i++){
			$('.data input')[i].checked=!$('.qx').is(':checked')
		}
	}
	//单选
	$scope.dx = function () {
		setTimeout(function(){
			var num = 0
			for(var i = 0; i < $('.data input').length; i++){
				if($('.data input')[i].checked){
					num++
				}
			}
			if(num == $('.data input').length){
				$('.qx')[0].checked = true
			}else {
				$('.qx')[0].checked = false
			}
		},0)
	}
	//批量审核
	$scope.plsh = function () {
		var arr1=[]
		for(var i = 0; i < $('.data input').length; i++){
			if($('.data input')[i].checked){
				arr1.push($('.data input')[i].getAttribute('billid'))
			}
		}
		console.log(arr)
		arr = arr1
		if(arr.length==0){
			UM.alert('请至少选择一条报销单据')
		} else {
			$("#app_content").val("同意");
			$("#opinionArea").css({"z-index":10});
			$("#opinionArea").show();
		}
	}
	// 确定批量审核
	$scope.qd = function () {
		///df/access/public/mobileInterface
		//billApproveBatch
		//var approveUrl = 'http://' + ip + '/FS' + "/services/billService/commitAndPush";
		//fcfa/approvalBatch/billApproveBatch
		var approveUrl = 'http://' + ip + '/FS' + "/services/fcFaService/billApproveBatch";
		//var approveUrl = 'http://' + ip + "/FS/services/fcFaService/searchTodoOrFinsh";
		var param = "BILL_ID=" + arr + "&APPROVALOPINION=" + $('#app_content').val() + "&ND=" + userInfo.nd + "&USERID=" + userInfo.userId + "&CO_CODE=" + userInfo.coCode + "&UID=" + userInfo.uid + "&CLIENT=MOBILE";
		var approveUrl = approveUrl + "?" + param;
		$.ajax({
			type : "POST",
			async : false,
			url : approveUrl,
			success : function(data) {
			console.log(data)
				if (data.resultCode == "1") {
					UM.alert({
					    title: '',
					    text: '审批通过',
					    btnText: ["取消", "确定"],
					    overlay: true,
					    ok: function () {
					        $scope.initMethod()
					    },
					    cancle: function () {
					        $scope.initMethod()
					    }
					})
				} else {
					UM.alert(data.rows);
				}
				$("#opinionArea").hide();
				$("#opinionArea").css({"z-index":-2});
			}
		});
	}
	// 取消批量审核
	$scope.qux = function () {
		$("#opinionArea").css({"z-index":-2});
		$("#opinionArea").hide();
	}
	/*页面初始化的方法，也就是点击未处理和已处理所触发的方法*/
	$scope.angularData1 = [];
	$scope.initMethod = function(status) {
		if(status == 0 || status == 1) {
			localStorage.setItem("status", status);
		}
		$('#arconditions').hide();
		if(status==0||status==1){
			curStatus = status;
			if (status==1){
				$scope.xs = false
			}else{
				$scope.xs = true
			}
		}
		UM.showLoadingBar({
			text : "加载中",
			icons : 'ti-loading',
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
		arsearchCondition.appName=$("#inputorName").val();
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
		if (curStatus == 0) {
			wfstatus = "todo";
			upstatus="unaudit";
			fastatus="1";
			$scope.active = true;
		} else if (curStatus == 1) {
			wfstatus = "done";
			upstatus="audit";
			fastatus="2";
			$scope.active = false;
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
		
		//取参数------------------结束

		$http.get('http://' + ip + '/FS/services/auditService/getAllAuditData?' + urlParam).success(function(data) {
			//UM.alert("data:"+JSON.stringify(data.rows));
			//console.log(data.rows[1].rows.length)
			console.log(data.rows);
			if (data.rows.length === 0) {
				$('#bgBox').show()
				$('.exp').hide()
				//$('#arSearch').hide()
			}else if (data.rows.length > 1){
				if(data.rows[0].rows.length > 0 || data.rows[1].rows.length > 0 ) {
					$('#bgBox').hide()
					$('.exp').show()
					//$('#arSearch').show()
				} else {
					setTimeout(function(){
						$('#bgBox').show()
						$('.exp').hide()
						//$('#arSearch').hide()
					},100)
				}
			}else {
				if(data.rows[0].rows.length > 0 ) {
					$('#bgBox').hide()
					$('.exp').show()
					//$('#arSearch').show()
				} else {
					setTimeout(function(){
						$('#bgBox').show()
						$('.exp').hide()
						//$('#arSearch').hide()
					},100)
				}
			}
			
			$scope.angularData1 = data.rows;
			UM.hideLoadingBar();
			//$scope.$apply();
		}).error(function(data){
			UM.alert(data+"error");	
			UM.hideLoadingBar();	
		});
	};
	$scope.initMethod(0);
	//每一个LI点击的方法
	
	$scope.currentLi = function(title, obj) {
		//console.log(title);
		console.log(obj);
		var billsType = obj.child[0].APP_VALUE;//单据类型
		//alert(billsType)
		var billId = obj.BILL_ID; //BFA78E01FFFFFFFFAAA6CC4600000001
		var paramgetBillDetailByBillId = "BILL_NO="+billId;
		$.ajax({
			type : "get",
			async : false,
			url : "http://" + ip + "/FS/services/billService/getBillDetailByBillId_common?" + paramgetBillDetailByBillId,
			error : function(data) {
				console.log(data);
			},
			success : function(data) {
				if (data.resultCode == "1") {
					var billData = data.rows;
					if(billsType == "经费报销单"){//经费报销单
						//location.href = 'expenditure_edit.html';
						summer.openWin({
							id : 'expenditure_edit',
							url : 'html/expenditure_edit.html',
							reload:true,
							pageParam : {//通过pageParam来传递需要的参数
								billData : billData//单据详细信息
							}
						});
					}else if(billsType == "差旅费报销单"){
						//location.href = 'travelexpense_edit.html';
						summer.openWin({
							id : 'travelexpense_edit',
							url : 'html/travelexpense_edit.html',
							reload:true,
							pageParam : {//通过pageParam来传递需要的参数
								billData : billData//单据详细信息
							}
						});
					}else if(billsType == "公务用车维护费报销单"){
						//location.href = 'officialcar_edit.html';
						summer.openWin({
							id : 'officialcar_edit',
							url : 'html/officialcar_edit.html',
							reload:true,
							pageParam : {//通过pageParam来传递需要的参数
								billData : billData//单据详细信息
							}
						});
					}else if(billsType == "公务接待费报销单"){
						//location.href = 'officialbusiness_edit.html';
						summer.openWin({
							id : 'officialbusiness_edit',
							url : 'html/officialbusiness_edit.html',
							reload:true,
							pageParam : {//通过pageParam来传递需要的参数
								billData : billData//单据详细信息
							}
						});
					}else if(billsType == "会议费报销单"){
						//location.href = 'meetingfee_edit.html';
						summer.openWin({
							id : 'officialbusiness_edit',
							url : 'html/meetingfee_edit.html',
							reload:true,
							pageParam : {//通过pageParam来传递需要的参数
								billData : billData//单据详细信息
							}
						});
					}else if(billsType == "培训费报销单"){
						//location.href = 'trainingexpense_edit.html';
						summer.openWin({
							id : 'trainingexpense_edit',
							url : 'html/trainingexpense_edit.html',
							reload:true,
							pageParam : {//通过pageParam来传递需要的参数
								billData : billData//单据详细信息
							}
						});
					}else{
						UM.alert('此类单据不支持修改及查看');
					}
				} else {
					alert(data.rows);
				}
			}
		});
	};

	//赛选弹框里面部门树的数据
	$scope.showMod = function() {
		$('#arconditions').show();
	}
	$scope.filterShow = false;
	//控制部门树窗口的打开隐藏
	$scope.filterBumen = "";
	//赛选按钮点击的方法
	$scope.filterWinBuMenData = [];
	$scope.active = true;
	$scope.fuzhi = function(obj) {
		$scope.filterBumen = obj.id + obj.text;
		$scope.filterShow = false;
	};
	var userInfo=JSON.parse(summer.getStorage('userInfo_local'));
	//获取弹框里面部门的数据
	$http.get('http://' + ip + '/FS/services/orgService/selectOrgTreeJSON?nd=' + userInfo.nd).success(function(data) {
		console.log(data);
		$scope.filterWinBuMenData = data.rows;
	}).error(function(data){
		UM.alert(data+":org_error");	
	});
	//获取单据类别数据
	$.ajax({
		"type" : "get", //请求方式
		"url" : "http://" + ip + "/FS/services/billService/selectBillTypeInFSArBill?nd=" + userInfo.nd, //url地址
		success : function(data) {
			if (data.resultCode == 1) {
				//console.log(data.rows);
				for (var i = 0; i < data.rows.length; i++) {
					$("#billTypeSelect").append("<option value='" + data.rows[i].BILL_TYPE + "'>" + data.rows[i].BILL_TYPE_NAME + "</option>");
				}
			}
		},
		error : function(data) {
			UM.alert("查询单据类型出错：" + data);
		}
	});

	$scope.clearArSearch=function(){
		var curYear = new Date().getFullYear();
		$("#startDate").val(curYear+"-01-01");
		$("#endDate").val(curYear+"-12-31");
		$("#billTypeSelect").val(null);
		$("#billNo").val(null);
		$("#orgName").val(null);
		$("#inputorId").val(null);
		$("#inputorName").val(null);
		$("#minMoney").val(null);
		$("#maxMoney").val(null);
		$("#reason").val(null);
	}
	
});
