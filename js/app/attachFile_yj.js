//存放路径
//var filepath = "Download/arFiles";
var filepath = "download/arFiles";
var ip;
summerready = function() {
    var params = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"];
    summer.getPermission(params, function(args) {
        //成功返回OK
        
    }, function(args) {
        UM.alert(args);
        //失败返回illegal access
    })
	UM.showLoadingBar({
		text : "加载中",
		icons : 'ti-loading',
	});
	ip = summer.getStorage("ip");
	var billid = summer.pageParam.billId;
	//var billid = summer.getStorage("bdata")["BILL_ID"];
	var module = summer.getStorage("module");
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var url = "http://" + ip + "/FS/services/" + module + "/selectFileMapByBillId";
	var param = "BILL_ID=" + billid + "&CO_CODE=" + userInfo.coCode + "&CLIENT=MOBILE";
	$.ajax({
		type : "get", //请求方式
		url : url + "?" + param, //url地址
		success : function(data) {//成功回调
			if (data.resultCode == 1) {
				var map = data.rows;
				var attachFileData = map
				console.log(attachFileData);
				if (attachFileData.length == 0) {
					/*attachFileData = [{
					 "billId" : "",
					 "fileId" : "",
					 "fileName" : "无数据"
					 }];*/
					UM.toast({
						title : '提示：',
						text : '当前单据无附件',
						duration : 2000
					});
				}
				//Knockout绑定
				var ViewModel = function() {
				};
				var viewModel = new ViewModel();

				viewModel.data = ko.observableArray(attachFileData);
				ko.applyBindings(viewModel);

				//构造控件实例
				var listview = UM.listview("#listview");

				listview.on("itemClick", function(sender, args) {
					//alert("itemClick");
					var fileName = args.$target.attr("fileName");
					var fileParam = "ID=" + encodeURIComponent(encodeURIComponent(args.$target.attr("id")));
					fileParam += "&CO_CODE=" + summer.getStorage("coCode");
					fileParam += "&CLIENT=MOBILE&UID=" + summer.getStorage("uid");
					var url = "http://" + ip;
					var fileType = fileName.split(".").pop();
					fileParam += "&fileType=" + fileType;
					fileParam += "&fileName=" + encodeURIComponent(encodeURIComponent(fileName));
					url += "/FS/serviceImage/" + module + "/downloadFile?" + fileParam;
					console.log(fileName);
					console.log(fileParam);
					console.log(filepath);
					console.log(url);
					//是否覆盖
					var bool = true;
					download(url, filepath, bool, args.$target);
				});

			} else {
				UM.alert("查询附件失败");
			}
			UM.hideLoadingBar();
		},
		error : function(response) {//失败回调
			UM.alert("查询出错");
			UM.hideLoadingBar();
		}
	});

}
/**
 * 公用的下载（不含批量下载）
 * @param 下载地址 url
 * @param 存放路径 filepath
 * @param 是否覆盖 bool
 * @param 下载的元素 obj
 */
function download(url, filepath, bool, obj) {
	//alert("download");
	filename = obj.attr("fileName");
	//UM.alert("准备下载：" + filepath + "   " + filename);
    summer.download({
        "url" : url,
        "locate" : filepath,
        "filename" : filename,
        "override" : bool,
        "callback" : "downloadCallBack()"
    });
}

function downloadCallBack(args) {
	//alert("downloadCallBack");
	var filename = args.filename;
	if (args.isfinish) {
		/*var params = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"];
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
		})*/
        var filetype = filename.split(".").pop();
        summer.openFile({
            "filename" : filename, //文件名
            "filetype" : filetype, //文件格式
            "filepath" : filepath    //文件路径
        });
		//	UM.alert(filename + " 下载成功");
		/* setTimeout(function() {
		 //将filename.的格式解析
		 var filetype = filename.split(".").pop();
		 //UM.alert(filetype);
		 summer.openFile({
		 "filename" : filename, //文件名
		 "filetype" : filetype, //文件格式
		 "filepath" : filepath	//文件路径
		 });
		 }, 1000) */
	}
}

