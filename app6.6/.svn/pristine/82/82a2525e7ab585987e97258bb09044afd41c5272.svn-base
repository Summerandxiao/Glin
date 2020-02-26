var faCode;
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	if (summer.getStorage('userInfo_local')) {//有数据
		var nd = summer.getStorage("nd");
		faCode = summer.getStorage("faCode");
		var checkQty = summer.getStorage("checkQty");//3
		$("#sum").text(checkQty);
		var checklistData = summer.getStorage("checklistData");
		var row;
		console.log(checklistData.data.length);
		for(var i=0;i<checklistData.data.length;i++){
			row = checklistData.data[i];
			if(faCode==row.FA_CODE){//取出匹配的资产编码
				row.checkQty = checkQty;//设置匹配资产的数量 扫描的数量
				summer.setStorage("checklistData",checklistData);//及时把数量存到本地缓存
				break;
			}else{
				row=null;
			}
		}
		var assetsListText = doT.template($("#assetsList-tmpl").text());
		if(row){
			$("#assetsList").html(assetsListText(row));
		}

		$("#number").blur(function(){//手动输入数字 同步更新盘点总数
		 	var number = $("#number").val();
			number = parseInt(number);
			if(!isNaN(number)){
				$("#sum").text(number);
			}
		});
		
		//暂时保存在手机缓存里 等联网后可以在盘点任务也没提交到资产
		$("#temporary").on("click",function(e){//暂存
			var number = $("#number").val();
			for(var i=0;i<checklistData.data.length;i++){
				row = checklistData.data[i];
				if(faCode==row.FA_CODE){//取出匹配的资产编码
					row.checkQty = number;//设置匹配资产的数量
					summer.setStorage("checklistData",checklistData);//及时把数量存到本地缓存
					UM.alert(checklistData.data[i].FA_CODE+"****"+checklistData.data[i].checkQty);
					break;
				}
			}
			
			summer.openWin({
				id : "checkAssets",
				url : 'html/checkAssets.html',
				isKeep : false,
				pageParam : {
					fromPage : 'checkAssetsDetail'
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


function reduceNum(){
	var number = $("#number").val();
	number = parseInt(number);
	if(!isNaN(number)&&number>0){
		$("#number").val(number-1);
		$("#sum").text(number-1);
	}
}



function addNum(){
	var number = $("#number").val();
	number = parseInt(number);
	if(!isNaN(number)){
		$("#number").val(number+1);
		$("#sum").text(number+1);
	}
}
