﻿﻿var bdata;
var billId;
var userInfo;
var ip;
var curBtn,app_content;
var fileId;
var filepath = "download/arFiles";
summerready = function() {
	$("#opinionArea").css({"z-index":-1});
	ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	//var curStatus = summer.pageParam.curStatus;
	var curStatus = summer.getStorage("curStatus");
	if (userInfo) {//有数据
		bdata = summer.getStorage("bdata");
		billId = bdata["BILL_ID"];
		loadData(billId);
		//loadArProcess(billId);
		$(".mark").hide();
		$(".tishi").hide();
		
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
	//上传附件按钮
	$('#uploadfile').on('click', function(){
		$('.mark1').show();
		setTimeout(function(){
			$('.dialog').css('bottom','0')
		},50)
		
	})
	//取消
	$('#cancel').on('click', function(){
		$('.mark1').hide();
		$('.dialog').css('bottom','-190px')
	})
	//拍照
	$('#photograph').on('click', function(){
		var params = ['android.permission.CAMERA','android.permission.READ_PHONE_STATE','android.permission.WRITE_EXTERNAL_STORAGE']
		summer.getPermission(params,  function(args){
			summer.openCamera({
				callback : function(args){
					UM.showLoadingBar({
						"text" : "上传中···",
						"icons" : "ti-loading"
					});
			        summer.multiUpload({
					    fileArray : [
					    	{
					    		fileURL : args.imgPath,
					        	type : "image/jpeg",
					        	name : "img"
					    	}
					    ],
					    params : {
					    	type: 'upload'
					    },
					    headers : {},
					    SERVER : "http://" + ip + "/FS/services/billService/commitAttch?type=upload&billId="+billId,
					    timeout : 1000
					}, function (ret){
					    getFileList()
				    	UM.hideLoadingBar();
					}, function (err){
					    alert("上传失败");
					    UM.hideLoadingBar();
					});
					$('.mark1').hide();
					$('.dialog').css('bottom','-190px')
			    }
			})
		})
	})
	//添加附件
	$('#addFile').on('click', function(){
	    summer.openPhotoAlbum({
			type : "multiple",//支持选多张图片
			callback : function(args){
				UM.showLoadingBar({
					"text" : "上传中···",
					"icons" : "ti-loading"
				});
		        var imgPaths = args.imgPaths
		        var imgArr = []
		        imgPaths.forEach(function(v,i){
		        	imgArr.push({
				        fileURL : v.imgPath,
				        type : "image/jpeg",
				        name : "img"+i
				    })
		        })
		        summer.multiUpload({
				    fileArray : imgArr,
				    params : {
				    	type: 'upload'
				    },
				    headers : {},
				    SERVER : "http://" + ip + "/FS/services/billService/commitAttch?type=upload&billId="+billId,
				    timeout : 9999
				}, function (ret){
				    getFileList()
				    UM.hideLoadingBar();
				}, function (err){
				    alert("上传失败");
				    UM.hideLoadingBar();
				});
				$('.mark1').hide();
				$('.dialog').css('bottom','-190px')
		    }
		})
	})
}
/**
 * 公用的下载（不含批量下载）
 * @param 下载地址 url
 * @param 存放路径 filepath
 * @param 是否覆盖 bool
 * @param 下载的元素 obj
 */
function download(url, filepath, bool, filename) {
	//UM.alert("准备下载：" + filepath + "   " + filename);
	var params = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"];
	summer.getPermission(params, function(args) {
		//成功返回OK
		summer.download({
			"url" : url,
			"locate" : filepath,
			"filename" : filename,
			"override" : bool,
			"callback" : "downloadCallBack()"
		});
	}, function(args) {
		UM.alert(args);
		//失败返回illegal access
	})
}

function downloadCallBack(args) {
	var filename = args.filename;
	if (args.isfinish) {
		var params = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"];
		summer.getPermission(params, function(args) {
			//成功返回OK 
			var filetype = filename.split(".").pop();
			summer.openFile({
				"filename" : filename, //文件名
				"filetype" : filetype, //文件格式
				"filepath" : filepath	//文件路径
			});
		}, function(args) {
			UM.alert("获取权限失败：" + args);
			//失败返回illegal access
		})
	}
}


function loadData(billId) {
	/*UM.showLoadingBar({
		"text" : "正在加载基本信息、费用项……",
		"icons" : "ti-loading"
	});*/
	//加载基本信息
	/*$("#billNo").text(bdata["BILL_NO"]);
	$("#inputDate").text(bdata["INPUT_DATE_TOSTRING"]);
	$("#reason").text(bdata["REASON"]);
	$("#checkMoney").text(util.changeTwoDecimal(bdata["CHECK_MONEY"]));
	$("#statusName").text(bdata["BILL_STATUS_NAME"]);
	$("#remark").text(bdata["REMARK"]);*/
	$("#billTypeTitle").text(bdata["BILL_TYPE_TITLE"]);

	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "BILL_ID=" + billId;
	urlParam += "&UID=" + userInfo.uid;
	urlParam += "&CLIENT=MOBILE";
	getFileList()
	/**
	 * 加载基本信息和费用项信息
	 */
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/selectByBillIdMobile?" + urlParam,
		success : function(data) {
			if (data.resultCode == 1) {
				var inputDate=new Date(data.rows.INPUT_DATE);
				var inputDateStr=inputDate.getFullYear() + '-' + (inputDate.getMonth() + 1) + '-' + inputDate.getDate();
				$("#appName").text(data.rows.APP_NAME);
				$("#billNo").text(data.rows.BILL_NO);
				$("#billType").text(data.rows.BILL_TYPE_NAME);
				$("#checkMoney").text(util.changeTwoDecimal(data.rows.CHECK_MONEY));
				$("#inputDate").text(inputDateStr);
				$("#orgName").text(data.rows.ORG_NAME);
				$("#reason").text(data.rows.REASON);
				$("#remark").text(data.rows.REMARK);
				$("#projectName").text(data.rows.PROJECT_NAME);
				var billBasicData;
				var billBasicDataNew = [];
				billBasicData = data.rows.billCommonMap;
					//组装最后结果
					for (var i in billBasicData) {
						billBasicDataNew.push({
							"BASIC_KEY" : i,
							"BASIC_VALUE" : billBasicData[i]
						});
					}
				var listgroupText = doT.template($("#arBasic-tmpl").text());
				$("#arBasic").html(listgroupText(billBasicDataNew));
			
				var billDeData;
				var billDeDataNew = [];
				//如果有外币显示外币，没有外币显示本币--start-----------------
				if (JSON.stringify(data.rows.bill_expense_foreign) != "{}" && data.rows.bill_expense_foreign != undefined) {
					billDeData = data.rows.bill_expense_foreign;
					billDeData=objKeySort(billDeData); //费用项key排序
					//组装最后结果
					for (var i in billDeData) {
						billDeDataNew.push({
							"EXPENSE_NAME" : i.split("&", 1)+'('+i.split("&", 2)[1]+')',
							"MONEY" : util.changeTwoDecimal(billDeData[i].currencyMoney) + billDeData[i].currencyKind
						});
					}
				} else {
					billDeData = data.rows.bill_expense;
					billDeData=objKeySort(billDeData); //费用项key排序
					//组装最后结果
					for (var i in billDeData) {
						billDeDataNew.push({
							"EXPENSE_NAME" : i,
							"MONEY" : util.changeTwoDecimal(billDeData[i]) + "元"
						});
					}
				}
				//如果有外币显示外币，没有外币显示本币--end---------------
				var listgroupText = doT.template($("#listgroup-tmpl").text());
				$("#umListGroupRow").html(listgroupText(billDeDataNew));
				
				
				/*****************报销明细信息 start**************************/
				var billRecnoDataNew=[];             //声明一维数组 
				billRecnoData = data.rows.billRecnoMap;
				billRecnoData=objKeySort(billRecnoData); //报销明细key排序
				//组装最后结果
				for (var i in billRecnoData) {
					billRecnoDataNew[i]=new Array();        //声明二维数组
					var curRow=billRecnoData[i];
					for(j in curRow){
						billRecnoDataNew[i].push({
							"EXPENSE_NAME" : j,
							"MONEY" : typeof(curRow[j])=="number"?util.changeTwoDecimal(curRow[j]):curRow[j]
						}) ;
					}
				}
				billRecnoDataNew=clearArrayNullItem(billRecnoDataNew);
				console.log(JSON.stringify(billRecnoDataNew));
				var arInfogroupText = doT.template($("#arInfo-tmpl").text());
				$("#arInfoGroupRow").html(arInfogroupText(billRecnoDataNew));
				/*****************报销明细信息 end**************************/
			}else{
				UM.alert(data.rows);
			}
			
			/**
			 * 加载预算信息
			 */
			$.ajax({
				type : "get",
				async : false,
				url : "http://" + userInfo.ip + "/FS/services/billService/selectBgByBillIdMobile?" + urlParam,
				success : function(data) {
					if (data.resultCode == 1) {
						var billBgDataNew=[];             //声明一维数组 
						billBgData = data.rows;
						//组装最后结果
						for (var i in billBgData) {
							billBgDataNew[i]=new Array();        //声明二维数组
							var curRow=billBgData[i];
							for(j in curRow){
								billBgDataNew[i].push({
									"GL_INFO_NAME" : j,
									"GL_INFO_VALUE" : curRow[j]
								}) ;
							}
						}
						billBgDataNew=clearArrayNullItem(billBgDataNew);
						console.log(JSON.stringify(billBgDataNew));
						var listgroupText = doT.template($("#glinfo-tmpl").text());
						$("#glinfoRow").html(listgroupText(billBgDataNew));
					}else{
						UM.alert(data.rows);
					}
				}
			});

		},
		error : function(data) {
			UM.alert(data.statusText);
		}
	});

	//UM.hideLoadingBar();
}
// 获取附件列表
function getFileList () {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var url = "http://" + ip + "/FS/services/billService/selectFileMapByBillId";
	var param = "BILL_ID=" + billId // + "&CO_CODE=" + userInfo.coCode + "&CLIENT=MOBILE";
	$.ajax({
		type : "get", //请求方式
		url : url + "?" + param, //url地址
		success : function(data) {//成功回调
			console.log(data.rows)
			var list = data.rows
			$('#fileList').html()
			var listStr = ''
			list.forEach((v,i)=>{
				listStr += `
					<li class='list' fileId=${v.fileId} fileName=${v.fileName}>
						<div style='width: 80%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>
							<span>${v.fileName}</span>
						</div>
						
						<div style='text-align: center;width: 20%;padding-top:5px'>
							<span class='ti-zoom-in downFile'></span>
							<span class='ti-trash delFile' style='margin-left:8px'></span>
						</div>
					</li>
				`
			})
			$('#fileList').html(listStr)
			//预览
			$('.downFile').on('click',function(){
				var fileName = $(this).parents('.list').attr('fileName')
				var fileType = fileName.split(".").pop();
				fileId = $(this).parents('.list').attr('fileId')
				var fileParam = "ID=" + encodeURIComponent(encodeURIComponent(fileId));
				fileParam += "&CO_CODE=" + summer.getStorage("coCode");
				fileParam += "&CLIENT=MOBILE&UID=" + summer.getStorage("uid");
				fileParam += "&fileType=" + fileType;
				fileParam += "&fileName=" + encodeURIComponent(encodeURIComponent(fileName));
				//debugger
				//console.log("http://" + ip + "/FS/services/billService/downloadFile?" + fileParam);
				//download("http://" + ip + "/FS/services/billService/downloadFile?" + fileParam, filepath, true,fileName); 
				summer.setStorage('module','billService');
				summer.openWin({
					id : 'attachFile',
					url : 'html/attachFile.html',
					reload : true,
					pageParam : {
						billId : fileId
					}
				});
			})
			//删除
			$('.delFile').on('click',function(){
				fileId = $(this).parents('.list').attr('fileId')
				UM.confirm({
				    title: '友情提示：',
				    text: '您确定要删除该附件吗？',
				    btnText: ["取消", "确定"],
				    overlay: true,
				    ok: function () {
						$.ajax({
							url:"http://" + ip + "/FS/services/billService/deleteAttch?fileId=" + fileId,
							type:'post',
							success:function(res){
								getFileList()
							},
							error:function(err){
								UM.alert(err)
							}
						})
				    },
				    cancle: function () {
				    	return false;
				    }
				});
				
			})
		},
		error : function(response) {//失败回调
			UM.alert("查询出错");
			UM.hideLoadingBar();
		}
	});
}

//排序的函数
function objKeySort(arys) { 
var oldstr=JSON.stringify(arys);
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();　　 
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for(var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]]; 
        //向新创建的对象中按照排好的顺序依次增加键值对

    }
    var newstr=JSON.stringify(newObj);
    return newObj; //返回排好序的新对象
}

/**
 * 清除数组中的空元素 
 */
function clearArrayNullItem(array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == "" || typeof (array[i]) == "undefined") {
			array.splice(i, 1);
			i = i - 1;

		}

	}
	return array;
}


/**
 * 加载报销系统实时查询的流程跟踪，移动审批用
 */
function loadArProcess(billId) {
	/*UM.showLoadingBar({
		"text" : "正在流程跟踪……",
		"icons" : "ti-loading"
	});*/
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "BILL_ID=" + billId;
	urlParam += "&CO_CODE=" + userInfo.coCode;
	urlParam += "&UID=" + userInfo.uid;
	urlParam += "&CLIENT=MOBILE";
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/billService/selectTraceInfo?" + urlParam,
		success : function(data) {
			var traceInfo = data.rows;
			for (var p in traceInfo) {
			if(traceInfo[p].hasOwnProperty("description")){
			}else{
			traceInfo[p].description="";
			}
				var actionname = traceInfo[p].actionName;
				if (actionname != undefined && actionname.indexOf('流向') > -1) {
					traceInfo[p].actionName = '通过';
				} else if (actionname == undefined) {
					traceInfo[p].actionName = '待处理';
				}
				var executeTime = traceInfo[p].executeTime;
				if (executeTime == undefined || executeTime.length == 0) {
					traceInfo[p].executeTime = "";
				}
			}
			var ViewModel = function() {
			};
			var viewModel = new ViewModel();
			viewModel.data = ko.observableArray(traceInfo);
			ko.applyBindings(viewModel);
		}
	});
	
	//UM.hideLoadingBar();
}