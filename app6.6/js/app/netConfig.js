summerready = function() {
	if (summer.getStorage("ip")) {
		var ipArr = [];
		ipArr = summer.getStorage("ip").split(":");
		$("#ip").val(ipArr[0]);
		$("#port").val(ipArr[1]);
	}
	$("#save").on("click", function() {
		var url = $("#ip").val() + ":" + $("#port").val();
		console.log(url);
		//summer.setStorage("ip", url);
		localStorage.setItem("ip",url);
		UM.toast({
            "title" : "友情提示：",
            "text" : "保存成功",
            "duration" : 3000
        });
        summer.openWin({
            "id" : "login",
            "url" : "html/login.html",
            reload:true,
            isKeep:false
        });
	});
	$("#cancel").on("click", function() {
		summer.openWin({
            "id" : "login",
            "url" : "html/login.html",
            reload:true,
            isKeep:false
        });
	});
}