var userInfo;
summerready = function() {
	var ip = summer.getStorage("ip");
	var nd = summer.getStorage("nd");
	var userId = summer.getStorage("userId");
	var uid = summer.getStorage("uid");
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var coCode = userInfo.coCode;
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + ip + "/FS/services/fundQueryService/selectuserCocode_Mobile?fiscal=" + nd + "&userid=" + userId + "&CLIENT=MOBILE&UID=" + uid,
		success : function(data) {
			var result = {
				"list" : data.rows
			};
			var evalText = doT.template($("#list").text());
			$("#companylist").html(evalText(result));
			var radio = $("input[type='radio']");
			if (coCode == "undefined" || coCode == null) {
				radio.eq(0).attr("checked", true);
				summer.setStorage("coCode", radio.eq(0).attr("coCode"));
			} else {
				$("input[coCode='" + coCode + "']").attr("checked", true);
			}
		}
	});

	$("input:radio[name='um-leftRadio']").on("change", function() {
		var coCode=$("input[type='radio']:checked").attr("coCode");
		var coName=$("input[type='radio']:checked ~ span[id='coName']").html();
		userInfo.coCode=coCode;
		userInfo.coName=coName;
		summer.setStorage("userInfo_local", JSON.stringify(userInfo));
		summer.openWin({
			id : 'MyInfo',
			url : 'html/MyInfo.html',
			reload : true,
			isKeep : false
		});
	});

}
