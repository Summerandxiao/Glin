var rows;
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	if (summer.getStorage('userInfo_local')) {//有数据
		var nd = summer.getStorage("nd");
		loadData(nd);//从FS加载数据
		$("#thisYear").text(nd);
		$("#lastYear").text(Number(nd)-1);
		$("#blastYear").text(Number(nd)-2);
		$("#thisYear").attr("class","btn um-btn-info");
		
		var bntLink = $(".btn-group");
		bntLink.on("click", function(e) {//点击日期时间
			var target = e.target;
			var parent = $summer.closest(target, '.btn');
			nd = summer.getStorage("nd");
			if (parent) {
				var btnId = parent.id;
				//按照年份 
				if("lastYear"==btnId){
					nd=Number(nd)-1;
					 $("#thisYear").attr("class","btn");
					 $("#blastYear").attr("class","btn");
					 $("#lastYear").attr("class","btn um-btn-info");
				}else if("blastYear"==btnId){
					nd=Number(nd)-2;
					 $("#thisYear").attr("class","btn");
					 $("#lastYear").attr("class","btn");
					 $("#blastYear").attr("class","btn um-btn-info");
				}else{
					nd=Number(nd)
					 $("#lastYear").attr("class","btn");
					 $("#blastYear").attr("class","btn");
					 $("#thisYear").attr("class","btn um-btn-info");
				}
				loadData(nd);//从FS加载数据
			}
		});
	} else {//无数据
		summer.openWin({
			id : 'login',
			url : 'html/login.html',
			pageParam : {
				compoId : '',
				title : '登录'
			}
		});
	}
}

function loadData(nd){
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam="userCode='" + userInfo.userId+"'";
	urlParam += "&tabId=FS_FUND";
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/getDataService/getDataList?" + urlParam,
		success : function(data) {
			if (data.rows.length <= 0) {
				UM.toast({
					title : '提示：',
					text : '登录人在当前年度没有可显示的资产',
					duration : 2000
				});
			}
			for (i in data.rows) {
				data.rows[i].COST=util.changeTwoDecimal(data.rows[i].COST);
			}
			rows=data.rows;
			var listviewText = doT.template($("#listview-tmpl").text());
			$("#listview").html(listviewText(data.rows));  
				
		}
	});
}

function subgo(obj){
	var thisObj = $(obj);  
    var id = thisObj.attr("id");
    var abata = rows[id];
	summer.setStorage("adata", abata);//保存点击的数据 在报销详情页取出
	summer.openWin({
		id : 'assetsDetail',
		url : 'html/assetsDetail.html',
		pageParam : {
			name : 'test'
		}
	});
};
