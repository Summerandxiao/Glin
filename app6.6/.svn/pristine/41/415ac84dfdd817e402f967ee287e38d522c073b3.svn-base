summerready = function() {
	$("#clearArSearch").on("click", function() {
		UM.alert("重置查询条件");
	});
}
var arSearch = angular.module('arSearch', []);
arSearch.controller('arSearchCtr', function($scope, $http) {
	var ip = summer.getStorage("ip");
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
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
	//获取弹框里面部门的数据
	$http.get('http://' + ip + '/FS/services/orgService/selectOrgTreeJSON?nd=' + userInfo.nd).success(function(data) {
		console.log(data);
		$scope.filterWinBuMenData = data.rows;
	});
	//获取单据类别数据
	$.ajax({
		"type" : "get", //请求方式
		"url" : "http://" + userInfo.ip + "/FS/services/billService/selectBillTypeInFSArBill?nd=" + userInfo.nd, //url地址
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

	//弹框确定的方法
	$scope.filterOkBtn = function() {
		summer.openWin({
			id : 'upComing',
			url : 'html/upComing.html',
			reload : true,
			isKeep:false
		});
		//表单信息存到storage ,upcoming 再查
		var searchCondition={};
		searchCondition.startDate=$("#startDate").val();
		searchCondition.endDate=$("#endDate").val();
		searchCondition.billType=$("#billTypeSelect").val();
		searchCondition.billNo=$("#billNo").val();
		searchCondition.inputorId=$("#inputorId").val();
		searchCondition.inputorName=$("#inputorName").val();
		searchCondition.minMoney=$("#minMoney").val();
		searchCondition.maxMoney=$("#maxMoney").val();
		searchCondition.reason=$("#reason").val();
		summer.setStorage("arSearch", JSON.stringify(searchCondition));
		summer.closeFrame({
			id : 'arSearch'
		});
	};
});
