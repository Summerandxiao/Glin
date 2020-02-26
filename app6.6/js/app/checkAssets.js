﻿var numCache = new Map();
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	if (summer.getStorage('userInfo_local')) {//有数据
		var nd = summer.getStorage("nd");
		//loadData(nd);
		//从缓存中取待盘点任务 保证设备离线可用
		var checklistData = summer.getStorage("checklistData");
		if (!checklistData || "undefined" == checklistData || "" == checklistData) {
		//alert("非缓存");
			//调用资产接口获取待盘点任务列表
			loadData(nd);
			checklistData = summer.getStorage("checklistData");
		}else{
		//alert("缓存");
		}

		var checklistText = doT.template($("#checklist-tmpl").text());
		if (checklistData && checklistData.length > 0) {
			$("#checklist").html(checklistText(checklistData));
		}

		$("#scanning").on("click", function(e) {//扫描二维码
			var faCode;
			//资产id
			var checkQty;
			//资产数量
			summer.openScanner({
				callback : function(args) {
					//   $summer.alert("扫描结果："+args.umdcode);
					//扫描返回值  会返回id和数量
					var data = JSON.parse(args.umdcode);
					if (!args.umdcode.SHUL) {//若无数量 默认是1
						checkQty = parseInt("1");
					} else {
						checkQty = parseInt(data.SHUL);
					}
					faCode = data.ASSET_CODE;
					//   faCode="CL1992000001";
					summer.setStorage("faCode", faCode);
					//扫描到的资产编码
					summer.setStorage("checkQty", checkQty);
					//扫描到的数量
					//打开新的窗口
					summer.openWin({
						id : "checkAssetsDetail",
						url : 'html/checkAssetsDetail.html',
						pageParam : {
							name : 'test'
						}
					});
				}
			});
		});

		$("#checkAssetsBack").on("click", function(e) {
			if (summer.pageParam) {
				var fromPage = summer.pageParam.fromPage;
				if ("checkAssetsDetail" == fromPage) {
					//直接返回index页面
					summer.openWin({
						id : "index",
						url : 'index.html',
						animation : {
							type : "movein", //动画类型（详见动画类型常量）
							subType : 'from_left', //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						},
						isKeep : false, //打开新窗口 关闭旧窗口
						pageParam : {
							name : 'test'
						}
					});

				} else {
					summer.closeWin();
				}
			} else {
				summer.closeWin();
			}
		});

		//提交到资产之后  清空本地缓存
		$("#submit").on("click", function() {
			checklistData = summer.getStorage("checklistData");
			UM.confirm({
				title : '友情提示：',
				text : '您确定提交本页数据吗？',
				btnText : ["否", "是"],
				overlay : true,
				ok : function() {
					console.log(checklistData);
					submitData(checklistData);
				},
				cancle : function() {
					console.log("取消了呢");
				}
			});

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
function loadData(nd) {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "ND=" + nd;
	//TODO 获取登录用户和的部门等编码参数
	//urlParam+="&co_code="+_application.userInfo.coCode;
	urlParam += "&userId=" + userInfo.userId;
	urlParam += "&method=mobileInterface/getCheckAssetsList";
	urlParam += "&orgId=" + userInfo.coCode;
	urlParam += "&orgCode=" + userInfo.coCode;
	urlParam += "&depCode=" + userInfo.orgCode;
	//urlParam += "&orgId=2033700&orgCode=2033700&depCode=35";
	//urlParam += "&orgId=31ee7c24-7e1a-41a3-b554-292b1b8c296b&orgCode=152033&depCode=15203304";

	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/fcFaService/getCheckAssetsList?" + urlParam,
		success : function(data) {
			if (data.rows && data.rows != "{}") {
				var rows = JSON.parse(data.rows);
				var row;
				for (var i = 0; i < rows.data.length; i++) {
					row = rows.data[i];
					row.FATYPE_ID = row.FATYPE_CODE.substring(0, 1);
					row.checkQty = 0;
				}
				summer.setStorage("checklistData", rows.data);
			}

		}
	});
}

function submitData(checklistData) {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "userId=" + userInfo.userId;
	urlParam += "&orgCode=" + userInfo.coCode;
	urlParam += "&orgId=" + userInfo.coCode;
	var newData = [];
	var param={};
	param.userId=userInfo.userId;
	param.orgCode=userInfo.coCode;
	param.orgId=userInfo.coCode;
	newData.push(param);
	//最终提交到资产的数据 只提交id和checkQty
	var checklistData = summer.getStorage('checklistData')
	var row = {};
	for(var i=0;i<checklistData.length;i++){
		row.id = checklistData[i].ID;
		row.checkQty = checklistData[i].CHECK_QTY;
		newData.push(row);
		row={};
	}
	//根据加减号数量设置的缓存，提交数据
	/*numCache.forEach(function(value, key, map) {
		row.id = key;
		row.checkQty = value;
		newData.push(row);
		row = {};
	})*/
	var submitData = {
		userId : userInfo.userId,
		method : "mobileInterface/saveCheckResultList",
		newData : $summer.jsonToStr(newData)
	};

	$.ajax({
		type : "POST",
		data : submitData,
		async : false,
		timeout:2000,
		url : "http://" + userInfo.ip + "/FS/services/fcFaService/saveCheckResultList?" + urlParam,
		success : function(data) {
			UM.toast({
					title : '提示：',
					text : '提交成功',
					duration : 2000
				});
			summer.setStorage("checklistData", "");
			//清空本地缓存
			summer.openWin({
				id : "checkAssets",
				url : 'html/checkAssets.html',
				isKeep : false,
				pageParam : {
					name : 'test'
				}
			});
		},
		error:function(jqXHR, textStatus, errorThrown){
			UM.toast({
				title : '提示：',
				text : jqXHR.responseText  +'提交失败',
				duration : 2000
			});
		}
	});
}

function reduceNum(e) {
	var id = $(e).parents("li").attr("id");
	console.log(id);
	var data = summer.getStorage("checklistData")
	var number = $(e).val();
	number = parseInt(number);
	number--;
	if (!isNaN(number) && number > 0) {
		$(e).val(number);
	}
	for (var i=0;i<data.length;i++){
		if(data[i].ID == id){
			data[i].CHECK_QTY = number
		}
	}
	summer.setStorage("checklistData", data);
}

function addNum(e) {
	var id = $(e).parents("li").attr("id");
	console.log(id);
	var number = $(e).val();
	var data = summer.getStorage("checklistData")
	number = parseInt(number);
	number++;
	if (!isNaN(number)) {
		$(e).val(number);
	}
	for (var i=0;i<data.length;i++){
		if(data[i].ID == id){
			console.log(data[i])
			data[i].CHECK_QTY = number
		}
	}
	summer.setStorage("checklistData", data);
}