var bill;
summerready = function() {
	var ip = summer.getStorage('ip');
	var url = 'http://' + ip + '/FS';
	if (summer.getStorage('userInfo_local')) {//有数据
		var billId = summer.getStorage("bdata").BILL_ID
		loadData(billId);
		lcgz()
		var status = summer.getStorage("status")
		if (status == 0) {
			$("#box").show()
		} else {
			$("#box").hide()
		}
		
		$("#billApprove").on("click",function(){
			setTimeout(function(){
				$('.um-modal input').val('同意')
			}, 300)
			UM.prompt({
			    text: '您确定要审批单据吗？',
			    btnText: ["否", "是"],
			    overlay: true,
			    ok: function (data) {
			        billApproveData(data);
			    },
			    cancle: function () {
			        console.log("取消了呢");
			    }
			});
		});
		
		$("#reject").on("click",function(){
			UM.confirm({
			    text: '您确定要退回单据吗？',
			    btnText: ["否", "是"],
			    overlay: true,
			    ok: function () {
			        rejectData();
			    },
			    cancle: function () {
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
function lcgz () {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "&billId=" + summer.getStorage("bdata").BILL_ID
		urlParam += "&method=mobileInterface/getWFRecords";	
	$.ajax({
		type : "POST",
		//async : false,
		url : "http://" + userInfo.ip + "/FS/services/fcFaService/getWFRecords?" + urlParam,
		success : function(data) {
			let gzData = JSON.parse(data.rows)
			if(gzData.flag == 'success') {
				console.log(gzData.data.rows)
				var lcData = gzData.data.rows
				var str = ''
					for (var i=0;i<lcData.length;i++) {
						console.log(lcData[i])
						str += `
							<li  style='padding-left:40px;font-size:14px;line-height:26px;padding-right: 40px;' class='lc'>
		    					<div style="display: flex;justify-content: space-between;padding-left:15px;padding-top:10px;border-left:2px dotted green;position:relative">
		    						<span class='tubiao'></span>
		    						<span style='color:#787878'>${lcData[i].OPERATION_NAME}</span><span style='color:#222222'>${lcData[i].ACTION_TYPE_NAME}</span>
		    					</div>
		    					<div style="display: flex;justify-content: space-between;padding-left:15px;padding-bottom:10px;border-left:2px dotted green;border-bottom:1px solid #ccc">
		    						<span style='color:#787878'>${lcData[i].OPERATION_REMARK}</span><span style='color:#222222'>${lcData[i].OPERATION_DATE}</span>
		    					</div>
		    				</li>
						`
					}
					$('#lcgz').html(str)
				}
				
			}
		})
}
function loadData(billId) {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var billType = summer.getStorage('billType')
	console.log(billId)
	urlParam = "billId=" + billId + "&businessTypeCode=" + billType
	urlParam += "&method=mobileInterface/getBillInfo";
	console.log(urlParam)
	$.ajax({
		type : "POST",
		//async : false,
		url : "http://" + userInfo.ip + "/FS/services/fcFaService/getBillInfo?" + urlParam,
		success : function(data) {
		console.log(data);
			if(data.rows){
				console.log(data.rows)
				var billInfo = data.rows.billInfo
				var details = data.rows.details
				var str1 = ''
				for (var key in billInfo) {
					str1 += `
						<li class="um-listgroup-row" style='padding-left:40px'>
	    						<div class="um-list-item-inner">
	    							<div class="um-list-item-body">
	    								<span class="f14 fl">${key}</span>
	                                    <span  class="f14 fr">${billInfo[key]}</span>
	    							</div>
	    						</div>
	    				</li>
					`
				}
				$('#billInfo').html(str1)
				var str2 = '';
				if(details){
					for (var i = 0; i < details.length; i++) {
						str2 += '<ul>'
						for(var k in details[i]) {
							str2 += `
				    				 <li class="um-listgroup-row" style='padding-left:40px'>
				                            <div class="um-list-item-inner">
				                                <div class="um-list-item-body">
				                                    <span class="f14 fl">${k}</span>
				                                    <span class="f14 fr">${details[i][k]}</span>
				                                </div>
				                            </div>
				                    </li>
							`
						}
						str2 += '</ul>'
					}
				}
				$('#umListGroupRow').html(str2)
			}
		}
	});
}

function billApproveData(data) {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "&billId=" + summer.getStorage("bdata").BILL_ID;//userInfo.userId;
	urlParam += "&billType=" + summer.getStorage('billType');
	urlParam += "&userCode=" + userInfo.userId;
	urlParam += "&actionType=" + 'AUDIT';
	urlParam += "&year=" + userInfo.nd;
	urlParam += "&opinion=" + data;
	urlParam += "&method=mobileInterface/billApprove";
	
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/fcFaService/billApprove?" + urlParam,
		success : function(data) {
			var returnData = JSON.parse(data.rows);
			console.log(returnData)
			if (returnData['flag'] == "success"){
				UM.toast({
                    "text" : "审核成功",
                    "duration" : 3000
                });
                $("#box").hide()
                lcgz()
			}
		}
	});
}

function rejectData() {
	var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	var urlParam = "&billId=" + summer.getStorage("bdata").BILL_ID;//userInfo.userId;
	urlParam += "&billType=" + summer.getStorage('billType');
	urlParam += "&userCode=" + userInfo.userId;
	urlParam += "&actionType=" + 'BACK';
	urlParam += "&year=" + userInfo.nd;
	urlParam += "&method=mobileInterface/billApprove";
	
	$.ajax({
		type : "POST",
		async : false,
		url : "http://" + userInfo.ip + "/FS/services/fcFaService/billApprove?" + urlParam,
		success : function(data) {
			var returnData = JSON.parse(data.rows);
			if (returnData['flag'] == "success"){
				UM.toast({
                    "text" : "退回成功",
                    "duration" : 3000
                });
			}
			$("#box").hide()
			lcgz()
		}
	});
}