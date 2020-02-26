summerready = function() {
	if (summer.getStorage('userInfo_local')) {//有数据
		loadData();//从FS加载数据
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

function loadData(){
	var ip = summer.getStorage('ip');
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam="userCode=" + userInfo.userId;
	urlParam += "&tabId=FS_CLOTHING";
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + ip + "/FS/services/getDataService/getDataList?" + urlParam,
		success : function(data) {
			if (data.rows.length <= 0) {
				UM.toast({
					title : '提示：',
					text : '登录人没有被装数据',
					duration : 2000
				});
			}
			var listviewText = doT.template($("#listview-tmpl").text());
			$("#listview").html(listviewText(data.rows));  
		}
	});
}
