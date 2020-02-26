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

	$("#kpbh").text(adata["KPBH"]);
	$("#zcmc").text(adata["ZCMC"]);
	$("#lyrq").text(adata["LYRQ"]);
	$("#gzrq").text(adata["GZRQ"]);
	$("#pp").text(adata["PP"]);
	$("#zcjz").text(adata["ZCJZ"]);
	
}
