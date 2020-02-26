var adata;
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	if (summer.getStorage('userInfo_local')) {//有数据
		adata = summer.getStorage("adata");
		loadData();
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

function loadData(){
	$("#FATYPE_CODE").text(adata["FATYPE_CODE"]);
	$("#FATYPE_NAME").text(adata["FATYPE_NAME"]);
	$("#FA_CODE").text(adata["FA_CODE"]);
	$("#FA_NAME").text(adata["FA_NAME"]);
	$("#lyrq").text(adata["LYRQ"]);
	//$("#gzrq").text(adata["GZRQ"]);
	$("#USING_STATU_NAME").text(adata["USING_STATU_NAME"]);
	$("#COST").text(adata["COST"]);
	
}
