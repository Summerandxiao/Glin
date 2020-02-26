var app = angular.module('linkBillList', []);
app.controller('ctrlForm', function($scope, $http) {
	var linkBillList = summer.getStorage('linkBills');
	$scope.linkBills=linkBillList;
	$scope.clickLi = function(row) {
		var tijiaoData = {};
		tijiaoData["BILL_ID"] = row.billId;
		tijiaoData["BILL_TYPE_TITLE"] = row.billTypeTitle;
		tijiaoData["IS_SELF"] = -1;
		summer.setStorage("bdata", tijiaoData);
		summer.openWin({
			id : 'arAuditDetail',
			url : 'html/arAuditDetail.html',
			reload:true,
		});
	}
});
