var billId;
var billNo;
var billStatus;
var isSave = 0;
var userInfo;
var ip;
// 报销明细
var clickIndex = 0;
var detail_sum = {};//总计
var total;
//现金明细
var xianjianIndex = 0;
var dest_cash = {};
var cashs = 0;
//转账明细 
var dest_transfer = {};
var transferIndex = 0;
var transfers = 0;
//公务卡明细 
var dest_bizcard = {};
var bizcardIndex = 0;
var bizcards = 0;
//用款申请单
var dest_bill = {};
var billIndex = 0;
//年度
var curr = new Date().getFullYear();
summerready = function() {
	//清除缓存
	summer.rmStorage("dest_cash");
	summer.rmStorage("dest_transfer");
	summer.rmStorage("dest_bizcard");
	ip = summer.getStorage('ip');
	var url = 'http://' + ip +'/FS';
	
	//获取缓存中的值 基本信息
	userInfo = JSON.parse(summer.getStorage('userInfo_local'));
	if(userInfo){//有数据
		//console.log("用户信息"+JSON.stringify(userInfo));
		$("#orgName").val(userInfo.orgName),//报销部门
		$("#appId").val(userInfo.userName)//报销人
	}else{
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
	
	if(isSave == 0){
		document.getElementById("approve").addEventListener('click', fnSavebill, false); 
		document.getElementById("backInput").addEventListener('click', fnSubmitbill, false); 
	}else{
		document.getElementById("approve").removeEventListener('click', fnSavebill, false);
		document.getElementById("approve").style.color = "gray";
	}
	
	// 报销明细确定——住宿费
	$('#room_confirm').on('click', function() {
		var room_baoxiao = $('#room_baoxiao').val();
		if ('' == room_baoxiao) {
			UM.alert('报销金额不能为空');
			return;
		};
		//住宿费
		var detail_room_info = {
			"money": $('#room_baoxiao').val()
		}

		detail_sum[0] = detail_room_info;
		
		summer.setStorage('detail_sum', JSON.stringify(detail_sum));
		
		$('#room_fee').text('金额：' + $('#room_baoxiao').val());//传回出差人
		$('#goRoom .um-back').trigger('click');
		total = 0
		for(var key in detail_sum) {//遍历删除后剩余的value的值  
			total += Number(detail_sum[key].money);//累加
		}
		$("#basicMessage #moneyGroup").val(total);
		
		//自动带出结算信息-现金结算信息--------开始分割线
		var sum_cash = 0;
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			for(var key in dest_cash) {//遍历删除后剩余的value的值  
				if(key != 'id0') sum_cash += Number(dest_cash[key].money);//累加
			}
		}
		if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			if(sum_cash + transfers + bizcards > total){
				var dest_xianjin_obj0 = {
					settlementType: "1",
					money: sum_cash + transfers + bizcards - total, // 现金-金额
					currencyKind: "RMB",
					exchangeRate: "1",
					currencyMoney: sum_cash + transfers + bizcards - total, // 现金-金额
					chequeKind: "",
					chequeNo: "",
					bAccCode: "",
					receiveAccount: "",
					receiveAccountId: "",
					receiveBank: "",
					receiveBankAddr: "",
					payAccountId: "",
					payBankName: "",
					journalNo: "",
					drCr: 1, // 现金-收支
					bopCode: "",
					remark: "", // 现金-备注
					billTypeName: "",
					payCode: "",
					eachQuotaAmount: "",
					recNo: 0,//现金-记录序号
					accCodeFlag: "0",
					correspbank: "",
					correspBankAddr: "",
					iban: "",
					swift: "",
					COLLECT_PURPOSE: "",
					billDate: "",
					accountbookId: "",
					payID: "",
					accID: "",
					receiveBankCode: "",
					receiveBankCity: "",
					receiveBankNodeNo: "",
					receiveBankNodeName: "",
					setteMentNO: ""
				}
				$('#cashGroup .money-count').eq(0).text(sum_cash + transfers + bizcards - total);//传回
				$("#cashGroup .um-box-vc #cashs").text(sum_cash + sum_cash + transfers + bizcards - total);//现金小计
				cashs = sum_cash + sum_cash + transfers + bizcards - total;
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}else{
				var dest_xianjin_obj0 = {
					settlementType: "1",
					money: total - sum_cash - transfers - bizcards , // 现金-金额
					currencyKind: "RMB",
					exchangeRate: "1",
					currencyMoney: total - sum_cash - transfers - bizcards, // 现金-金额
					chequeKind: "",
					chequeNo: "",
					bAccCode: "",
					receiveAccount: "",
					receiveAccountId: "",
					receiveBank: "",
					receiveBankAddr: "",
					payAccountId: "",
					payBankName: "",
					journalNo: "",
					drCr: -1, // 现金-收支
					bopCode: "",
					remark: "", // 现金-备注
					billTypeName: "",
					payCode: "",
					eachQuotaAmount: "",
					recNo: 0,//现金-记录序号
					accCodeFlag: "0",
					correspbank: "",
					correspBankAddr: "",
					iban: "",
					swift: "",
					COLLECT_PURPOSE: "",
					billDate: "",
					accountbookId: "",
					payID: "",
					accID: "",
					receiveBankCode: "",
					receiveBankCity: "",
					receiveBankNodeNo: "",
					receiveBankNodeName: "",
					setteMentNO: ""
				}
				$('#cashGroup .money-count').eq(0).text(total - sum_cash - transfers - bizcards);//传回
				$("#cashGroup .um-box-vc #cashs").text(sum_cash + total - sum_cash - transfers - bizcards);//现金小计
				cashs = sum_cash + total - sum_cash - transfers - bizcards;
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
		}else{
			$('#cashGroup .detail-btn').append(
				`
				<li class="um-listgroup-row um-listview-row">
					<a href="#cash" class="um-list-item main-item go-next-page ">
						<div class="um-list-item-inner">
							<div class="um-list-item-body">
								<h5 class="um-media-heading um-blue">现金</h5>
							</div>
							<div class="um-list-item-right">
								<span class="um-gray mr15 money-count">`+total+`</span>
							</div>
						</div>
						<div class="um-swipe-btns">
			                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
			            </div>
					 </a>
				</li>
						
				`
			);
			var dest_xianjin_obj = {
				settlementType: "1",
				money: total, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: total, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			dest_cash[`id`+0] = dest_xianjin_obj;
			xianjianIndex++;
			summer.setStorage('dest_cash', JSON.stringify(dest_cash));	
			$("#cashGroup .um-box-vc #cashs").text(total);//现金小计
			cashs = total;
		}		
		//自动带出结算信息-现金结算信息--------结束分割线
	});
	
	//报销明细中 填写报销金额 带出核定金额——住宿费
	$('#goRoom #room_baoxiao').on('blur', function() {
		$('#goRoom #room_checkMoney').val($(this).val());
	});
	
	// 报销明细确定——伙食费
	$('#meal_confirm').on('click', function() {
		var meal_baoxiao = $('#meal_baoxiao').val();
		if ('' == meal_baoxiao) {
			UM.alert('报销金额不能为空');
			return;
		};
		//住宿费
		var detail_meal_info = {
			"money": $('#meal_baoxiao').val()
		}

		detail_sum[1] = detail_meal_info;
		
		summer.setStorage('detail_sum', JSON.stringify(detail_sum));
		
		$('#meal_fee').text('金额：' + $('#meal_baoxiao').val());//传回出差人
		$('#goMeal .um-back').trigger('click');
		total = 0
		for(var key in detail_sum) {//遍历删除后剩余的value的值  
			total += Number(detail_sum[key].money);//累加
		}
		$("#basicMessage #moneyGroup").val(total);
		
		//自动带出结算信息-现金结算信息--------开始分割线
		var sum_cash = 0;
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			for(var key in dest_cash) {//遍历删除后剩余的value的值  
				if(key != 'id0') sum_cash += Number(dest_cash[key].money);//累加
			}
		}
		if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			if(sum_cash + transfers + bizcards > total){
				var dest_xianjin_obj0 = {
					settlementType: "1",
					money: sum_cash + transfers + bizcards - total, // 现金-金额
					currencyKind: "RMB",
					exchangeRate: "1",
					currencyMoney: sum_cash + transfers + bizcards - total, // 现金-金额
					chequeKind: "",
					chequeNo: "",
					bAccCode: "",
					receiveAccount: "",
					receiveAccountId: "",
					receiveBank: "",
					receiveBankAddr: "",
					payAccountId: "",
					payBankName: "",
					journalNo: "",
					drCr: 1, // 现金-收支
					bopCode: "",
					remark: "", // 现金-备注
					billTypeName: "",
					payCode: "",
					eachQuotaAmount: "",
					recNo: 0,//现金-记录序号
					accCodeFlag: "0",
					correspbank: "",
					correspBankAddr: "",
					iban: "",
					swift: "",
					COLLECT_PURPOSE: "",
					billDate: "",
					accountbookId: "",
					payID: "",
					accID: "",
					receiveBankCode: "",
					receiveBankCity: "",
					receiveBankNodeNo: "",
					receiveBankNodeName: "",
					setteMentNO: ""
				}
				$('#cashGroup .money-count').eq(0).text(sum_cash + transfers + bizcards - total);//传回
				$("#cashGroup .um-box-vc #cashs").text(sum_cash + sum_cash + transfers + bizcards - total);//现金小计
				cashs = sum_cash + sum_cash + transfers + bizcards - total;
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}else{
				var dest_xianjin_obj0 = {
					settlementType: "1",
					money: total - sum_cash - transfers - bizcards , // 现金-金额
					currencyKind: "RMB",
					exchangeRate: "1",
					currencyMoney: total - sum_cash - transfers - bizcards, // 现金-金额
					chequeKind: "",
					chequeNo: "",
					bAccCode: "",
					receiveAccount: "",
					receiveAccountId: "",
					receiveBank: "",
					receiveBankAddr: "",
					payAccountId: "",
					payBankName: "",
					journalNo: "",
					drCr: -1, // 现金-收支
					bopCode: "",
					remark: "", // 现金-备注
					billTypeName: "",
					payCode: "",
					eachQuotaAmount: "",
					recNo: 0,//现金-记录序号
					accCodeFlag: "0",
					correspbank: "",
					correspBankAddr: "",
					iban: "",
					swift: "",
					COLLECT_PURPOSE: "",
					billDate: "",
					accountbookId: "",
					payID: "",
					accID: "",
					receiveBankCode: "",
					receiveBankCity: "",
					receiveBankNodeNo: "",
					receiveBankNodeName: "",
					setteMentNO: ""
				}
				$('#cashGroup .money-count').eq(0).text(total - sum_cash - transfers - bizcards);//传回
				$("#cashGroup .um-box-vc #cashs").text(sum_cash + total - sum_cash - transfers - bizcards);//现金小计
				cashs = sum_cash + total - sum_cash - transfers - bizcards;
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
		}else{
			$('#cashGroup .detail-btn').append(
				`
				<li class="um-listgroup-row um-listview-row">
					<a href="#cash" class="um-list-item main-item go-next-page ">
						<div class="um-list-item-inner">
							<div class="um-list-item-body">
								<h5 class="um-media-heading um-blue">现金</h5>
							</div>
							<div class="um-list-item-right">
								<span class="um-gray mr15 money-count">`+total+`</span>
							</div>
						</div>
						<div class="um-swipe-btns">
			                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
			            </div>
					 </a>
				</li>
						
				`
			);
			var dest_xianjin_obj = {
				settlementType: "1",
				money: total, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: total, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			dest_cash[`id`+0] = dest_xianjin_obj;
			xianjianIndex++;
			summer.setStorage('dest_cash', JSON.stringify(dest_cash));	
			$("#cashGroup .um-box-vc #cashs").text(total);//现金小计
			cashs = total;
		}		
		//自动带出结算信息-现金结算信息--------结束分割线
	});
	
	//报销明细中 填写报销金额 带出核定金额——伙食费
	$('#goMeal #meal_baoxiao').on('blur', function() {
		$('#goMeal #meal_checkMoney').val($(this).val());
	});	

	// 报销明细确定——其他费用
	$('#other_confirm').on('click', function() {
		var other_baoxiao = $('#other_baoxiao').val();
		if ('' == other_baoxiao) {
			UM.alert('报销金额不能为空');
			return;
		};
		//住宿费
		var detail_other_info = {
			"money": $('#other_baoxiao').val()
		}

		detail_sum[2] = detail_other_info;
		
		summer.setStorage('detail_sum', JSON.stringify(detail_sum));
		
		$('#other_fee').text('金额：' + $('#other_baoxiao').val());//传回出差人
		$('#goOther .um-back').trigger('click');
		total = 0
		for(var key in detail_sum) {//遍历删除后剩余的value的值  
			total += Number(detail_sum[key].money);//累加
		}
		$("#basicMessage #moneyGroup").val(total);
		
		//自动带出结算信息-现金结算信息--------开始分割线
		var sum_cash = 0;
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			for(var key in dest_cash) {//遍历删除后剩余的value的值  
				if(key != 'id0') sum_cash += Number(dest_cash[key].money);//累加
			}
		}
		if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			if(sum_cash + transfers + bizcards > total){
				var dest_xianjin_obj0 = {
					settlementType: "1",
					money: sum_cash + transfers + bizcards - total, // 现金-金额
					currencyKind: "RMB",
					exchangeRate: "1",
					currencyMoney: sum_cash + transfers + bizcards - total, // 现金-金额
					chequeKind: "",
					chequeNo: "",
					bAccCode: "",
					receiveAccount: "",
					receiveAccountId: "",
					receiveBank: "",
					receiveBankAddr: "",
					payAccountId: "",
					payBankName: "",
					journalNo: "",
					drCr: 1, // 现金-收支
					bopCode: "",
					remark: "", // 现金-备注
					billTypeName: "",
					payCode: "",
					eachQuotaAmount: "",
					recNo: 0,//现金-记录序号
					accCodeFlag: "0",
					correspbank: "",
					correspBankAddr: "",
					iban: "",
					swift: "",
					COLLECT_PURPOSE: "",
					billDate: "",
					accountbookId: "",
					payID: "",
					accID: "",
					receiveBankCode: "",
					receiveBankCity: "",
					receiveBankNodeNo: "",
					receiveBankNodeName: "",
					setteMentNO: ""
				}
				$('#cashGroup .money-count').eq(0).text(sum_cash + transfers + bizcards - total);//传回
				$("#cashGroup .um-box-vc #cashs").text(sum_cash + sum_cash + transfers + bizcards - total);//现金小计
				cashs = sum_cash + sum_cash + transfers + bizcards - total;
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}else{
				var dest_xianjin_obj0 = {
					settlementType: "1",
					money: total - sum_cash - transfers - bizcards , // 现金-金额
					currencyKind: "RMB",
					exchangeRate: "1",
					currencyMoney: total - sum_cash - transfers - bizcards, // 现金-金额
					chequeKind: "",
					chequeNo: "",
					bAccCode: "",
					receiveAccount: "",
					receiveAccountId: "",
					receiveBank: "",
					receiveBankAddr: "",
					payAccountId: "",
					payBankName: "",
					journalNo: "",
					drCr: -1, // 现金-收支
					bopCode: "",
					remark: "", // 现金-备注
					billTypeName: "",
					payCode: "",
					eachQuotaAmount: "",
					recNo: 0,//现金-记录序号
					accCodeFlag: "0",
					correspbank: "",
					correspBankAddr: "",
					iban: "",
					swift: "",
					COLLECT_PURPOSE: "",
					billDate: "",
					accountbookId: "",
					payID: "",
					accID: "",
					receiveBankCode: "",
					receiveBankCity: "",
					receiveBankNodeNo: "",
					receiveBankNodeName: "",
					setteMentNO: ""
				}
				$('#cashGroup .money-count').eq(0).text(total - sum_cash - transfers - bizcards);//传回
				$("#cashGroup .um-box-vc #cashs").text(sum_cash + total - sum_cash - transfers - bizcards);//现金小计
				cashs = sum_cash + total - sum_cash - transfers - bizcards;
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
		}else{
			$('#cashGroup .detail-btn').append(
				`
				<li class="um-listgroup-row um-listview-row">
					<a href="#cash" class="um-list-item main-item go-next-page ">
						<div class="um-list-item-inner">
							<div class="um-list-item-body">
								<h5 class="um-media-heading um-blue">现金</h5>
							</div>
							<div class="um-list-item-right">
								<span class="um-gray mr15 money-count">`+total+`</span>
							</div>
						</div>
						<div class="um-swipe-btns">
			                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
			            </div>
					 </a>
				</li>
						
				`
			);
			var dest_xianjin_obj = {
				settlementType: "1",
				money: total, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: total, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			dest_cash[`id`+0] = dest_xianjin_obj;
			xianjianIndex++;
			summer.setStorage('dest_cash', JSON.stringify(dest_cash));	
			$("#cashGroup .um-box-vc #cashs").text(total);//现金小计
			cashs = total;
		}		
		//自动带出结算信息-现金结算信息--------结束分割线
	});
	
	//报销明细中 填写报销金额 带出核定金额——其他费用
	$('#goOther #other_baoxiao').on('blur', function() {
		$('#goOther #other_checkMoney').val($(this).val());
	});	
		
	// 新增现金明细
	$('#dateBtnGroup_cash button').on('click', function() {
	
		$('#cashGroup .detail-btn').append(
			`
			<li class="um-listgroup-row um-listview-row">
				<a href="#cash" class="um-list-item main-item go-next-page ">
					<div class="um-list-item-inner">
						<div class="um-list-item-body">
							<h5 class="um-media-heading um-blue">现金</h5>
						</div>
						<div class="um-list-item-right">
							<span class="um-gray mr15 money-count">0.00</span>
						</div>
					</div>
					<div class="um-swipe-btns">
		                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
		            </div>
				 </a>
			</li>
					
			`
		)
	});
	// 现金明细确定
	$('#dest_xianjin_bth').on('click', function() {
		var ca_money = $('#cash_money').val();
		if ('' == ca_money) {
			UM.alert('金额不能为空');
			return;
		}
		var expen_content = $("#expenditure_content_dummy").val();
		if ('' == expen_content || null == expen_content) {
			UM.alert('收支不能为空');
			return;
		}
		if($('#expenditure_content_dummy').val()=="领取"){
			shouzhi = "-1";
		}else{
			shouzhi = "1";
		}
		var dest_xianjin_obj = {
			settlementType: "1",
			money: $('#cash_money').val(), // 现金-金额
			currencyKind: "RMB",
			exchangeRate: "1",
			currencyMoney: $('#cash_money').val(), // 现金-金额
			chequeKind: "",
			chequeNo: "",
			bAccCode: "",
			receiveAccount: "",
			receiveAccountId: "",
			receiveBank: "",
			receiveBankAddr: "",
			payAccountId: "",
			payBankName: "",
			journalNo: "",
			drCr: shouzhi, // 现金-收支
			bopCode: "",
			remark: $('#cash_remark').val(), // 现金-备注
			billTypeName: "",
			payCode: "",
			eachQuotaAmount: "",
			recNo: `${xianjianIndex}`,//现金-记录序号
			accCodeFlag: "0",
			correspbank: "",
			correspBankAddr: "",
			iban: "",
			swift: "",
			COLLECT_PURPOSE: "",
			billDate: "",
			accountbookId: "",
			payID: "",
			accID: "",
			receiveBankCode: "",
			receiveBankCity: "",
			receiveBankNodeNo: "",
			receiveBankNodeName: "",
			setteMentNO: ""
		}
		//console.log(dest_xianjin_obj);
		dest_cash[`id${xianjianIndex}`] = dest_xianjin_obj;
		summer.setStorage('dest_cash', JSON.stringify(dest_cash));
		$('#cashGroup .money-count').eq(xianjianIndex).text(dest_xianjin_obj.money);//传回
		//UM.page.back()
		//$('#goDest_xj').removeClass()
		//$('#goDest_xj').addClass('um-page')
		$('#cash .um-back').trigger('click');
		cashs = 0; //记录现金所有记录总和
		for(var key in dest_cash) {//遍历删除后剩余的value的值  
			cashs += Number(dest_cash[key].money);//累加
		}
		$("#cashGroup .um-box-vc #cashs").text(cashs);//总和传回主页面	
		
		//----自动带出结算信息-现金结算信息----开始分割线
		var sum_cash = 0;
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			for(var key in dest_cash) {//遍历删除后剩余的value的值  
				if(key != 'id0') sum_cash += Number(dest_cash[key].money);//累加
			}
		}
		var dest_xianjin_obj0;
		if(sum_cash + transfers + bizcards > total){
			dest_xianjin_obj0 = {
				settlementType: "1",
				money: sum_cash + transfers + bizcards - total , // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: sum_cash + transfers + bizcards - total, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: 1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(sum_cash + transfers + bizcards - total);//传回
			$("#cashGroup .um-box-vc #cashs").text(sum_cash + sum_cash + transfers + bizcards - total);//现金小计
			cashs = sum_cash + sum_cash + transfers + bizcards - total;
		}else{
			dest_xianjin_obj0 = {
				settlementType: "1",
				money: total - sum_cash - transfers - bizcards, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: total - sum_cash - transfers - bizcards, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(total - sum_cash - transfers - bizcards);//传回
			$("#cashGroup .um-box-vc #cashs").text(sum_cash + total - sum_cash - transfers - bizcards);//现金小计
			cashs = sum_cash + total - sum_cash - transfers - bizcards;
		}
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			delete dest_cash[`id0`]//删除对用的 value的值
			dest_cash[`id`+0] = dest_xianjin_obj0;
			summer.setStorage('dest_cash', JSON.stringify(dest_cash));
		}
		//----自动带出结算信息-现金结算信息----结束分割线	
	})

	$('#cashGroup').on('click', '.um-listgroup-row', function( ) {
		xianjianIndex = $(this).index();
		//console.log(xianjianIndex)
		$('#cash .form-control').val('');//清空缓存中现金明细的数据
		if(summer.getStorage('dest_cash')) {
			var dest_cash = JSON.parse(summer.getStorage('dest_cash'));
			if(dest_cash[`id${xianjianIndex}`]) {
				var obj = dest_cash[`id${xianjianIndex}`];
				$('#cash_money').val(obj.money);
				if(obj.drCr == "-1") $('#expenditure_content_dummy').val("领取");
				if(obj.drCr == "1") $('#expenditure_content_dummy').val("退回");
				$('#cash_remark').val(obj.remark);
			}
		}
	})
	//结算信息中 现金删除 左划
	var cash_delete = UM.listview('#cashGroup');
	cash_delete.on('itemSwipeLeft', function(sender,args){
		sender.showItemMenu(args.$target);
	});
	//现金中删除 方式事件
	cash_delete.on('itemDelete', function(sender, args) {
    	//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即//rowIndex(行索引)和$target(目标行的jquery对象)
	    args.$target.slideUp(500, function() {
	        //console.log(args)
	        var j = args.rowIndex ;//记录删除的ID值
	        
			//----自动带出结算信息-现金结算信息----开始分割线
			var dest_xianjin_obj0 = {
				settlementType: "1",
				money: dest_cash['id0'].money*1 + dest_cash[`id${j}`].money*1, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: dest_cash['id0'].money*1 + dest_cash[`id${j}`].money*1, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(dest_cash['id0'].money*1 + dest_cash[`id${j}`].money*1);//传回
	        cashs = cashs + dest_cash['id0'].money*1 + dest_cash[`id${j}`].money*1;
	        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
			//----自动带出结算信息-现金结算信息----结束分割线
			
	        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
				delete dest_cash[`id${j}`];//删除对用的 value的值
				cashs = 0; //重新定义报销明细总计的变量
				for(var key in dest_cash) {//遍历删除后剩余的value的值  
					cashs += Number(dest_cash[key].money);//累加
				}
				//console.log(cashs)
				$("#cashGroup .um-box-vc #cashs").text(cashs);//总和传回主页面
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
	    });
	});
	
	//转账人信息
	var paramStrgetBkCurrentAccList = "CO_CODE="+userInfo.coCode;
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + ip + "/FS/services/billService/getBkCurrentAcc_common?" + paramStrgetBkCurrentAccList,
		error : function(data) {
		   console.log(data);
		},
		success : function(data) {
		   if (data.resultCode == "1") {
		   		if(data.rows.bkCurrentAccList){
			    	var userData = $.parseJSON(data.rows.bkCurrentAccList);
			    	//console.log("转账户名信息："+JSON.stringify(userData));
			    	//遍历下拉框数据Demo
					var html = '<option value="">请选择</option>';
					for(var i=0; i<userData.length;i++){
						html += `
							<option value="`+userData[i].BANK_ACC_NAME+`">`+userData[i].BANK_ACC_NAME+`</option>
						`
					}
					$('#receiveAccountId').html(html);
		   		}
				var opt = {
		    		'date': {
		    			preset: 'date'
		    		},
		    		'select': {
		    			preset: 'select'
		    		 }
		    	};
		    	$('#receiveAccountId').scroller('destroy').scroller(
		    		$.extend(opt['select'], {
		    			theme: "ios7",
		    			mode: "scroller",
		    			display: "bottom",
		    			animate: "",
		    			onSelect: function(val, obj) {//转账下拉框确定按钮
		    				//console.log(obj)
		    				var cardNo_select = obj.values[0];
		    				for (var i = 0; i < userData.length; i++) {
								if(cardNo_select == userData[i].BANK_ACC_NAME){//确定后 拿出卡号 对比得到对应的value
									//console.log(userData[i].CO_CODE);
									$('#receiveAccount').val(userData[i].BANK_ACC_CODE);
									$('#receiveBank').val(userData[i].BANK_NAME);
									$('#correspbank').val(userData[i].CURRENT_CO_NAME);
									$('#accID').val(userData[i].ID);
									$('#receiveBankCode').val(userData[i].CO_CODE);
									break;
							    }
							}
		    			}
		    		})
		    	);
		   } else {
		    	alert(data.rows);
		   }
	 	}
	});
	// 新增转账明细
	$('#dateBtnGroup_transfer button').on('click', function() {
		$('#transferGroup .detail-btn').append(
			`
			<li class="um-listgroup-row um-listview-row">
				<a href="#transfer" class="um-list-item main-item go-next-page ">
					<div class="um-list-item-inner">
						<div class="um-list-item-body">
							<h5 class="um-media-heading um-blue">转账\汇款</h5>
						</div>
						<div class="um-list-item-right">
							<span class="um-gray mr15 money-count">0.00</span>
						</div>
					</div>
					<div class="um-swipe-btns">
		                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
		            </div>
				 </a>
			</li>
			`
		);
	});
	
	// 转账明细确定  调取接口拿到对应人员的值  判断收款方户名 是否存在  存在-赋对应的值  不存在为空字符串
	$('#dest_transfer_bth').on('click', function() {
		var cash_id;
		if(summer.getStorage('dest_cash')){
			var dest_cash = JSON.parse(summer.getStorage('dest_cash'));
			var dest_cash_arr = []
			for(var key in dest_cash) {
				dest_cash_arr.push(dest_cash[key]);
			}
			cash_id = dest_cash_arr.length;
		}else{
			cash_id =0;
		}
		
		var dest_transfer_obj = {
			settlementType: "3",//有待确认
			money: $('#transfer_money').val(), // 转账-金额
			currencyKind: "RMB",
			exchangeRate: "1",
			currencyMoney: $('#transfer_money').val(),  // 转账-金额
			chequeKind: "",
			chequeNo: "",
			bAccCode: "",
			receiveAccount: $('#receiveAccount').val(),//转账-收款方账号
			receiveAccountId: $('#receiveAccountId_dummy').val(), // 转账-收款方户名 
			receiveBank: $('#receiveBank').val(),//转账-开户行名称
			receiveBankAddr: "",
			payAccountId: "",
			payBankName: "",
			journalNo: "",
			drCr: "-1", // 现金-收支
			bopCode: "",
			remark: $('#transfer_remark').val(),//转账备注
			billTypeName: "",
			payCode: "",
			eachQuotaAmount: "",
			recNo: `${transferIndex}`*1+ cash_id,//转账-记录序号
			accCodeFlag: "0",
			correspbank: $('#correspbank').val(), 
			correspBankAddr: "",
			iban: "",
			swift: "",
			COLLECT_PURPOSE: "",
			billDate: "",
			accountbookId: "",
			payID: "",
			accID: $('#accID').val(),  
			receiveBankCode: $('#receiveBankCode').val(),
			receiveBankCity: "",
			receiveBankNodeNo: "",
			receiveBankNodeName: "",
			setteMentNO: ""
		}
		//console.log(dest_transfer_obj);
		dest_transfer[`id${transferIndex}`] = dest_transfer_obj;
		summer.setStorage('dest_transfer', JSON.stringify(dest_transfer));
		$('#transferGroup .um-media-heading').eq(transferIndex).text('收款方户名：' + $('#receiveAccountId_dummy').val());//传回收款方户名 
		$('#transferGroup .money-count').eq(transferIndex).text(dest_transfer_obj.money);//传回金额
		$('#transfer .um-back').trigger('click');
		
		transfers = 0; //记录转账 所有记录总和
		for(var key in dest_transfer) {//遍历删除后剩余的value的值  
			transfers += Number(dest_transfer[key].money);//累加
		}
		$("#transferGroup .um-box-vc #transfers").text(transfers);//总和传回主页面
		
		//----自动带出结算信息-现金结算信息----开始分割线
		var sum_cash = 0;//除第一个结算现金信息外的现金总和
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			for(var key in dest_cash) {//遍历删除后剩余的value的值  
				if(key != 'id0') sum_cash += Number(dest_cash[key].money);//累加
			}
		}
		var dest_xianjin_obj0;
		if(sum_cash + transfers + bizcards > total){
			dest_xianjin_obj0 = {
				settlementType: "1",
				money: sum_cash + transfers + bizcards - total , // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: sum_cash + transfers + bizcards - total, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: 1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(sum_cash + transfers + bizcards - total);//传回
			$("#cashGroup .um-box-vc #cashs").text(sum_cash + sum_cash + transfers + bizcards - total);//现金小计
			cashs = sum_cash + sum_cash + transfers + bizcards - total;
		}else{
			dest_xianjin_obj0 = {
				settlementType: "1",
				money: total - sum_cash - transfers - bizcards, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: total - sum_cash - transfers - bizcards, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(total - sum_cash - transfers - bizcards);//传回
			$("#cashGroup .um-box-vc #cashs").text(sum_cash + total - sum_cash - transfers - bizcards);//现金小计
			cashs = sum_cash + total - sum_cash - transfers - bizcards;
		}
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			delete dest_cash[`id0`]//删除对用的 value的值
			dest_cash[`id`+0] = dest_xianjin_obj0;
			summer.setStorage('dest_cash', JSON.stringify(dest_cash));
		}
		//----自动带出结算信息-现金结算信息----结束分割线
	});

	$('#transferGroup').on('click', '.um-listgroup-row', function( ) {
		transferIndex = $(this).index();
		//console.log(transferIndex)
		$('#transfer .form-control').val('');//清空缓存中转账明细的数据
		if(summer.getStorage('dest_transfer')) {
			var dest_transfer = JSON.parse(summer.getStorage('dest_transfer'));
			if(dest_transfer[`id${transferIndex}`]) {
				var obj = dest_transfer[`id${transferIndex}`];
				$('#receiveAccountId_dummy').val(obj.receiveAccountId);
				$('#receiveAccount').val(obj.receiveAccount);
				$('#receiveBank').val(obj.receiveBank);
				$('#correspbank').val(obj.correspbank);
				$('#accID').val(obj.accID);
				$('#receiveBankCode').val(obj.receiveBankCode);
				$('#transfer_money').val(obj.money);
				$('#transfer_remark').val(obj.remark);
			}
		}
	})
	//结算信息中 转账删除 左划
	var transfer_delete = UM.listview('#transferGroup');
	transfer_delete.on('itemSwipeLeft', function(sender,args){
		sender.showItemMenu(args.$target);
	});
	//转账中删除 方式事件
	transfer_delete.on('itemDelete', function(sender, args) {
    	//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即//rowIndex(行索引)和$target(目标行的jquery对象)
	    args.$target.slideUp(500, function() {
	        //console.log(args)
	        var j = args.rowIndex //记录删除的ID值
	        
			//----自动带出结算信息-现金结算信息----开始分割线
			var dest_xianjin_obj0 = {
				settlementType: "1",
				money: dest_cash['id0'].money*1 + dest_transfer[`id${j}`].money*1, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: dest_cash['id0'].money*1 + dest_transfer[`id${j}`].money*1, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(dest_cash['id0'].money*1 + dest_transfer[`id${j}`].money*1);//传回
	        $("#cashGroup .um-box-vc #cashs").text(cashs + dest_transfer[`id${j}`].money*1);//总和传回主页面
	        cashs = cashs + dest_transfer[`id${j}`].money*1;
	        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
			//----自动带出结算信息-现金结算信息----结束分割线
			
	        if(summer.getStorage('dest_transfer')) {//判断拿到的缓存是否有值
				delete dest_transfer[`id${j}`];//删除对用的 value的值
				transfers = 0; //重新定义报销明细总计的变量
				for(var key in dest_transfer) {//遍历删除后剩余的value的值  
					transfers += Number(dest_transfer[key].money);//累加
				}
				$("#transferGroup .um-box-vc #transfers").text(transfers);//总和传回主页面
				summer.setStorage('dest_transfer', JSON.stringify(dest_transfer));
			}
			
	    });
	});
	
	// 新增公务卡明细
	$('#dateBtnGroup_bizcard button').on('click', function() {
		$('#bizcardGroup .detail-btn').append(
			`
				<li class="um-listgroup-row um-listview-row">
				<a href="#bizcard" class="um-list-item main-item go-next-page">
					<div class="um-list-item-inner">
						<div class="um-list-item-body">
							<h5 class="um-media-heading um-blue">公务卡</h5>
						</div>
						<div class="um-list-item-right">
							<span class="um-gray mr15 money-count">0.00</span>
						</div>
					</div>
					<div class="um-swipe-btns">
		                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
		            </div>
				 </a>
			</li>
			`
		)		
	});
	
	var paramStrselectCardInfoList = "CO_CODE="+userInfo.coCode+"&USER_NAME="+userInfo.userName+"&ND="+curr;
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + ip + "/FS/services/billService/selectCardInfoList_common?" + paramStrselectCardInfoList,
		error : function(data) {
			console.log(data);
		},
		success : function(data) {
			if (data.resultCode == "1") {
				if(data.rows.arBusinessCardInfoList){
					var userData = $.parseJSON(data.rows.arBusinessCardInfoList);
					//console.log(data);
					//console.log(userData);
					var html = '<option value="">请选择</option>';
					for(var i=0; i < userData.length;i++){
						html += `
							<option value="`+userData[i].cardNo+`">`+userData[i].userName+`</option>
						`
					}
					$('#userName').html(html);
				}
				//遍历下拉框数据Demo
				var opt = {
	    			'date': {
	    				preset: 'date'
	    			},
	    			'select': {
	    			   preset: 'select'
	    		   }
	    		};
	    		$('#userName').scroller('destroy').scroller(
	    			$.extend(opt['select'], {
	    				theme: "ios7",
	    				mode: "scroller",
	    				display: "bottom",
	    				animate: "",
	    				onSelect: function(val, obj) {//公务卡下拉框确定按钮
	    					//console.log(obj)
    						var cardNo_select = obj.values[0];
	    					for (var i = 0; i < userData.length; i++) {
							    if(cardNo_select == userData[i].cardNo){//确定后 拿出卡号 对比得到对应的value
									//console.log(data.rows[i]);
									$('#userName_dummy').val(userData[i].userName);
									$('#cardNo').val(userData[i].cardNo);
									$('#userId').val(userData[i].userId);
									$('#orgCode').val(userData[i].orgCode);
									break;
						  	 	}
							}
	    				}
	    			})
	    		);
			} else {
				alert(data.rows);
				alert('卡信息失败');
			}
		}
	});
	
	// 公务卡明细确定
	$('#bizcard_bth').on('click', function() {
		var biz_cardNo = $('#cardNo').val();
		if ('' == biz_cardNo || null == biz_cardNo) {
			UM.alert('卡号不能为空');
			return;
		}
		var biz_money = $('#bizcard_money').val();
		if ('' == biz_money) {
			UM.alert('报销金额不能为空');
			return;
		}
		var dest_bizcard_obj = {
			recNo: `${bizcardIndex}`,//记录序号
			cardNo: $('#cardNo').val(), // 卡号
			userId : $('#userId').val(), 
			userName: $('#userName_dummy').val(), // 持卡人姓名 
			consumeDate: "",
			money: $('#bizcard_money').val(), // 报销金额
			authCode: "",
			isRepayment: "",
			inputUserid: "",
			merchantName: "",
			pepaymentNo: "",
			sumBillId: "",
			extendField1: "",
			extendField2: "",
			extendField3: "",
			receiveBank: "",
			receiveBankCity: "",
			receiveBankAddr: "",
			receiveBankNodeNo: "",
			receiveBankNodeName: "",
			payBankName: "",
			payAccountId: "",
			payCode: "",
			payId: "",
			accId: "",
			journalNo: "",
			creditcardMoney: "",
			accCode: "",
			accountBoookId: "",
			orgCode : $('#orgCode').val(),
			cardPurpose: ""
		}
		dest_bizcard[`id${bizcardIndex}`] = dest_bizcard_obj;
		//console.log(dest_bizcard_obj);
		summer.setStorage('dest_bizcard', JSON.stringify(dest_bizcard));
		$('#bizcardGroup .um-media-heading').eq(bizcardIndex).text('持卡人姓名：' + $('#userName_dummy').val());//传回收款方户名 
		$('#bizcardGroup .money-count').eq(bizcardIndex).text(dest_bizcard_obj.money);//传回金额
		$('#bizcard .um-back').trigger('click')
		
		bizcards = 0 ;//记录公务卡所有记录总和
		for(var key in dest_bizcard) {//遍历删除后剩余的value的值  
			bizcards += Number(dest_bizcard[key].money);//累加
		}
		$("#bizcardGroup .um-box-vc #bizcards").text(bizcards);//总和传回主页面
		
		//----自动带出结算信息-现金结算信息----开始分割线
		var sum_cash = 0;//除第一个结算现金信息外的现金总和
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			for(var key in dest_cash) {//遍历删除后剩余的value的值  
				if(key != 'id0') sum_cash += Number(dest_cash[key].money);//累加
			}
		}
		var dest_xianjin_obj0;
		if(sum_cash + transfers + bizcards > total){
			dest_xianjin_obj0 = {
				settlementType: "1",
				money: sum_cash + transfers + bizcards - total , // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: sum_cash + transfers + bizcards - total, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: 1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(sum_cash + transfers + bizcards - total);//传回
			$("#cashGroup .um-box-vc #cashs").text(sum_cash + sum_cash + transfers + bizcards - total);//现金小计
			cashs = sum_cash + sum_cash + transfers + bizcards - total;
		}else{
			dest_xianjin_obj0 = {
				settlementType: "1",
				money: total - sum_cash - transfers - bizcards, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: total - sum_cash - transfers - bizcards, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(total - sum_cash - transfers - bizcards);//传回
			$("#cashGroup .um-box-vc #cashs").text(sum_cash + total - sum_cash - transfers - bizcards);//现金小计
			cashs = sum_cash + total - sum_cash - transfers - bizcards;
		}
        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
			delete dest_cash[`id0`]//删除对用的 value的值
			dest_cash[`id`+0] = dest_xianjin_obj0;
			summer.setStorage('dest_cash', JSON.stringify(dest_cash));
		}
		//----自动带出结算信息-现金结算信息----结束分割线
	})
	//公务卡存值			
	$('#bizcardGroup').on('click', '.um-listgroup-row', function( ) {
		bizcardIndex = $(this).index();
		//console.log(bizcardIndex)
		$('#bizcard .form-control').val('');//清空缓存中公务卡明细的数据
		if(summer.getStorage('dest_bizcard')) {
			var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'));
			if(dest_bizcard[`id${bizcardIndex}`]) {
				var obj = dest_bizcard[`id${bizcardIndex}`];
				$('#userName_dummy').val(obj.userName);
				$('#cardNo').val(obj.cardNo);
				$('#bizcard_money').val(obj.money);
				$('#userId').val(obj.userId);
				$('#orgCode').val(obj.orgCode);
			}
		}
	})
	//结算信息中 公务卡删除 左划
	var bizcard_delete = UM.listview('#bizcardGroup')
	bizcard_delete.on('itemSwipeLeft', function(sender,args){
		sender.showItemMenu(args.$target);
	});
	//公务卡中删除 方式事件
	bizcard_delete.on('itemDelete', function(sender, args) {
    	//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即//rowIndex(行索引)和$target(目标行的jquery对象)
	    args.$target.slideUp(500, function() {
	        //console.log(args)
	        var j = args.rowIndex //记录删除的ID值
	        
			//----自动带出结算信息-现金结算信息----开始分割线
			var dest_xianjin_obj0 = {
				settlementType: "1",
				money: dest_cash['id0'].money*1 + dest_bizcard[`id${j}`].money*1, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: dest_cash['id0'].money*1 + dest_bizcard[`id${j}`].money*1, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: -1, // 现金-收支
				bopCode: "",
				remark: "", // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: 0,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			$('#cashGroup .money-count').eq(0).text(dest_cash['id0'].money*1 + dest_bizcard[`id${j}`].money*1);//传回
	        $("#cashGroup .um-box-vc #cashs").text(cashs + dest_bizcard[`id${j}`].money*1);//总和传回主页面
	        cashs = cashs + dest_bizcard[`id${j}`].money*1;
	        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
				delete dest_cash[`id0`]//删除对用的 value的值
				dest_cash[`id`+0] = dest_xianjin_obj0;
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
			//----自动带出结算信息-现金结算信息----结束分割线
			
	        if(summer.getStorage('dest_bizcard')) {//判断拿到的缓存是否有值
				
				delete dest_bizcard[`id${j}`];//删除对用的 value的值
				bizcards = 0; //重新定义报销明细总计的变量
				for(var key in dest_bizcard) {//遍历删除后剩余的value的值  
					bizcards += Number(dest_bizcard[key].money);//累加
				}
				$("#bizcardGroup .um-box-vc #bizcards").text(bizcards);//总和传回主页面
				summer.setStorage('dest_bizcard', JSON.stringify(dest_bizcard));
			}
	    });
	});
	
	//用款申请单
	var paramStrselectApplyListByConditionList4Mobile = "CO_CODE="+userInfo.coCode+"&BILL_TYPE=EXP_ENTERTAIN&ND="+curr+"&APP_ID="+userInfo.userId;
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + ip + "/FS/services/billService/selectApplyListByConditionList4Mobile_common?" + paramStrselectApplyListByConditionList4Mobile,
		error : function(data) {
			//console.log(data);
		},
		success : function(data) {
			if (data.resultCode == "1") {
				if(data.rows.arBillLoanList){
					var userData = $.parseJSON(data.rows.arBillLoanList);
					var html = '<option value="">请选择</option>';
					for (var i = 0; i < userData.length; i++) {
						//console.log(userData[i].avaliableMoney);
					    if(0 != userData[i].avaliableMoney){
							html += `
								<option value="${userData[i].billId}">${userData[i].reason}(${userData[i].billNo})</option>
								`
					    }
					}
					$('#applyBillList').html(html);
				}
					
				var opt = {
					'date' : {
						preset : 'date'
					},
					'select' : {
						preset : 'select'
					}
				};

	    		$('#applyBillList').scroller('destroy').scroller(
	    			$.extend(opt['select'], {
	    				theme: "ios7",
	    				mode: "scroller",
	    				display: "bottom",
	    				animate: "",
	    				onSelect: function(val, obj) {//公务卡下拉框确定按钮
	    					var sum_checkMoney = 0;
							var sum_avaliableMoney = 0;
							var apply_billId = [];
	    					$("#applyBillList option:selected").each(function () {
							     //console.log($(this).val());
							     apply_billId.push($(this).val());
							     for (var i = 0; i < userData.length; i++) {
								    if($(this).val() == userData[i].billId){//确定后 拿出卡号 对比得到对应的value
								    	sum_checkMoney += userData[i].checkMoney*1;
								    	sum_avaliableMoney += userData[i].avaliableMoney*1;
								  	}			
								 }
							})
							$('#usedMoney').val(sum_checkMoney);
							$('#avaliableMoney').val(sum_avaliableMoney);
	    					//console.log($('#billId').val());
							
							for(var i=0;i < apply_billId.length;i++){
								var dest_bill_obj = {
									billId: apply_billId[i], // 需要回传至后台的 billId
								}
								dest_bill[`id`+ i] = dest_bill_obj;
								summer.setStorage('dest_bill', JSON.stringify(dest_bill));	
							}
							//console.log("用款申请单："+JSON.stringify(dest_bill));
		    			}
		    		})
		    	);
			} else {
				alert(data.rows);
			}
		}
	});	
	
	//加载数据
	var billData = summer.pageParam.billData;
	if(billData){
		fnLoaddetailInfo(billData);//展示已保存信息
		getFileList();
	}

	//删除
	$('#delete').on('click',function(){
		 var paramgetBillDetailByBillId = "CO_CODE="+userInfo.coCode+"&BILL_ID="+billId;
		 UM.confirm({
		    title: '友情提示：',
		    text: '您确定要删除该条单据吗？',
		    btnText: ["取消", "确定"],
		    overlay: true,
		    ok: function () {
				 $.ajax({
				  	type : "get",
				  	async : false,
				  	url : "http://" + ip + "/FS/services/billService/deleteArBillByBillId?" + paramgetBillDetailByBillId,
				  	error : function(data) {
				   		console.log(data);
				   		UM.alert('删除失败');
				  	},
				  	success : function(data) {
				   		if (data.resultCode == "1") {
				    		var userData = data.rows;
				    		//console.log(userData);
							UM.alert('删除成功');
							//summer.openWin({
								//id : 'select_detail',
								//url : 'html/select_detail.html',
								//reload: true
							//});
							summer.closeToWin({
							    id: 'select_detail'
							});
				   		} else {
				    		UM.alert(data.rows);
				   		}
				  	}
				 });
		    },
		    cancle: function () {

		    }
		});
	});
	
	//上传附件按钮
	$('#uploadfile').on('click', function(){
		if(billId == "undefined" || billId == null || billId == ""){
			UM.alert("请先进行保存操作");
		}else{
			$('.mark1').show();
			setTimeout(function(){
				$('.dialog').css('bottom','0')
			},50);
		}		
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

//保存
function fnSavebill(){
	//校验基本信息不能为空
	var orgName = $("#orgName").val() //报销部门
	var appId = $("#appId").val() //报销人
	var reason = $("#reason").val() //报销事由
	var ticketCount = $("#ticketCount").val() //票据张数
	if ('' == orgName) {
		UM.alert('报销部门不能为空');
		return;
	}
	if ('' == appId) {
		UM.alert('报销人不能为空');
		return;
	}
	if ('' == reason) {
		UM.alert('报销事由不能为空');
		return;
	}
	if ('' == ticketCount) {
		UM.alert('票据张数不能为空');
		return;
	}
	//校验报销明细总计 = 结算信息 （现金+转账+公务卡）总计
	//total 转账明细总计 ，  cashs 现金总计 ，  transfers 转账总计 ， bizcards 公务卡总计
	var  sumMoney 
	sumMoney = cashs +　transfers + bizcards;
	//alert(sumMoney) //查看三个结算信息总金额
	var total_money = $("#moneyGroup").val();
	if(total_money != sumMoney){
		UM.alert('错误：报销明细总计与结算信息总计不相等');
		return;
	}
	//var available_balance = $("#avaliableMoney").val();
	//if(total_money*1 > available_balance*1){
		//UM.alert('错误：报销金额大于可用余额');
		//return;
	//}
 	var params = {} //封装请求数据
 	// 用款申请单
	if(summer.getStorage('dest_bill')) {
		var dest_bill = JSON.parse(summer.getStorage('dest_bill'));
		var dest_bill_arr = [];
		for(var key in dest_bill) {
			dest_bill_arr.push(dest_bill[key]);
		}
	}
	//基本信息
	var ArBill = {
		appId : userInfo.userId,//报销人
		inputorId : userInfo.userId,
		inputDate : "",
		reason : $("#reason").val(),//报销事由
		isCanPrint : "N",
		accountId : "",
		billType : "EXP_ENTERTAIN",
		coCode : userInfo.coCode,
		nd : userInfo.nd,
		isCarry : "N",
		billStatus : "10",
		checkMoney : $("#moneyGroup").val(),//合计
		orgCode : userInfo.orgCode,//报销部门
		jdMoney : "0",
	    printTimes : "0",
	    applyPrintTimes : "0", 
		projectCode : "*",
		remark : $("#remark").val(),//备注
		billId: billId,
		billNo: billNo	
	}
	
	params.ArBill = ArBill;
	params.applyBillList = dest_bill_arr;
	
	var infoList = [];
	var guestCompany = {//来客单位
		infoId: "ENTERTAIN_DANWEI",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#guest').val()
	};
	infoList.push(guestCompany);
	var jiedaiChushi = {//接待处室
		infoId: "JIEDAIDANWEI",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#receiveOffice').val()
	};
	infoList.push(jiedaiChushi);
	var days = {//天数
		infoId: "days",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#guest_days').val()
	};
	infoList.push(days);
	var peopleNumber = {//来客人数
		infoId: "peopleNumber",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#guest_num').val()
	};
	infoList.push(peopleNumber);
	var ticketCount = {//票据张数
		infoId: "ticketCount",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#ticketCount').val()
	};
	infoList.push(ticketCount);
	params.infoList = infoList;
	
	var expenseList = [];
	//住宿费
	var room_standard = $("#room_standard").val();
	if(room_standard == ""){
		room_standard = 0;
	}
	var room_baoxiao = $("#room_baoxiao").val();
	if(room_baoxiao == ""){
		room_baoxiao = 0;
	}
	var room_checkMoney = $("#room_checkMoney").val();
	if(room_checkMoney == ""){
		room_checkMoney = 0;
	}
	var room_remark = $("#room_remark").val();
	var expense_room_info = {
		"belongTable": "EXP_ENTERTAIN00",
		"budgetMoney": "", 
		"checkMoney": room_checkMoney, 
		"currencyMoney": room_baoxiao, 
		"currencyKind": "RMB", 
		"days": "0", 
		"days2": "",  
		"days3": "",   
		"dependRemark": "", 
		"exchangeRate": "1", 
		"expenseDate": "",
		"expenseId": "ROOM",
		"money": room_baoxiao, 
		"peopleNums": "", 
		"peopleNums2": "", 
		"peopleNums3": "", 
		"quantity": "", 
		"quantity2": "", 
		"recNo": "0", 
		"remark": room_remark ,
		"selfMoney": "0", 
		"standard": room_standard,
		"standard2": "0",
		"standard3": "0",
		"tabId": "00", 
		"tabName": "明细单据(1)", 
		"ticketCount": "0", 		
		"unitofQantity": "间",
		"unitofQantity2": "天",		
	};
	expenseList.push(expense_room_info);
	//伙食费	
	var meal_standard = $("#meal_standard").val();
	if(meal_standard == ""){
		meal_standard = 0;
	}
	var meal_baoxiao = $("#meal_baoxiao").val();
	if(meal_baoxiao == ""){
		meal_baoxiao = 0;
	}
	var meal_checkMoney = $("#meal_checkMoney").val();
	if(meal_checkMoney == ""){
		meal_checkMoney = 0;
	}
	var meal_remark = $("#meal_remark").val();	
	var expense_meal_info = {
		"belongTable": "EXP_ENTERTAIN00", 
		"budgetMoney": "", 
		"checkMoney": meal_checkMoney, 
		"currencyKind": "RMB", 
		"currencyMoney": meal_baoxiao, 
		"days": "0", 
		"days2": "",  
		"days3": "", 
		"dependRemark": "", 
		"exchangeRate": "1", 
		"expenseDate": "",
		"expenseId": "MEAL",
		"money": meal_baoxiao, 
		"peopleNums": "", 
		"peopleNums2": "", 
		"peopleNums3": "",  
		"quantity": "", 
		"quantity2": "", 
		"recNo": "1", 	
		"remark": meal_remark, 
		"selfMoney": "0", 		
		"standard": meal_standard,
		"standard2": "0",
		"standard3": "0",
		"tabId": "00", 
		"tabName": "明细单据(1)", 
		"ticketCount": "0", 
		"unitofQantity": "人",
		"unitofQantity2": "天",	
	};
	expenseList.push(expense_meal_info);
	//其他费用	
	var other_standard = $("#other_standard").val();
	if(other_standard == ""){
		other_standard = 0;
	}
	var other_baoxiao = $("#other_baoxiao").val();
	if(other_baoxiao == ""){
		other_baoxiao = 0;
	}
	var other_checkMoney = $("#other_checkMoney").val();
	if(other_checkMoney == ""){
		other_checkMoney = 0;
	}
	var other_remark = $("#other_remark").val();	
	var expense_other_info = {
		"belongTable": "EXP_ENTERTAIN00", 
		"budgetMoney": "", 
		"checkMoney": other_checkMoney, 
		"currencyKind": "RMB", 
		"currencyMoney": other_baoxiao, 
		"days": "0", 
		"days2": "",  
		"days3": "", 
		"dependRemark": "", 
		"exchangeRate": "1", 
		"expenseDate": "",
		"expenseId": "OTHER",
		"money": other_baoxiao, 
		"peopleNums": "", 
		"peopleNums2": "", 
		"peopleNums3": "",  
		"quantity": "", 
		"quantity2": "", 
		"recNo": "2", 	
		"remark": other_remark, 
		"selfMoney": "0", 		
		"standard": other_standard*1,
		"standard2": "0",
		"standard3": "0",
		"tabId": "00", 
		"tabName": "明细单据(1)", 
		"ticketCount": "0", 
		"unitofQantity": "次",
		"unitofQantity2": "",	
	};
	expenseList.push(expense_other_info);
	params.expenseList = expenseList;	
	
	var arCashList = [];//现金和转账信息汇总						
	// 结算信息 1.现金
	if(summer.getStorage('dest_cash')) {
		var dest_cash = JSON.parse(summer.getStorage('dest_cash'));
		for(var key in dest_cash) {
			arCashList.push(dest_cash[key]);
		}
	}
	
	//2.转账
	if(summer.getStorage('dest_transfer')) {
		var dest_transfer = JSON.parse(summer.getStorage('dest_transfer'));
		for(var key in dest_transfer) {
			arCashList.push(dest_transfer[key]);
		}
	}
	params.arCashList = arCashList;//现金和转账信息汇总
	
	//3.公务卡
	if(summer.getStorage('dest_bizcard')){
		var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'))
		var dest_bizcard_arr = []
		for(var key in dest_bizcard) {
			dest_bizcard_arr.push(dest_bizcard[key])
		}
	}
	params.businessCardList = dest_bizcard_arr;	
		
	var paa = JSON.stringify(params);
	var datapaa = "datapaa=" + paa;
		
	$.ajax({
		type: 'POST',
		data: datapaa,
		url : "http://" + ip + "/FS/services/billService/arBillSave_common",
		dataType: 'json',
		success: function(res) {
			//console.log(res)
			if(res.resultCode == "1"){
				billNo = res.rows.BILL_NO;
				billId = res.rows.BILL_ID;
				if(typeof billNo == "undefined" || billNo == null || billNo == ""){
					UM.alert('保存失败');	
				}else{
					isSave = 1;
					UM.alert({
					    title: '保存成功',
					    btnText: ["取消", "确定"],
					    overlay: true,
					    ok: function () {
							document.getElementById("approve").removeEventListener('click', fnSavebill, false);
							document.getElementById("approve").style.color = "gray";
					    }
					});
				}
			}else{
				UM.alert('保存失败');
			}
		},
		error: function(err) {
			console.log(err);
			UM.alert('保存失败');
		}
	})
}

//提交
function fnSubmitbill(){	
	//console.log($("#userid_biz").val())
	//校验基本信息不能为空
	var orgName = $("#orgName").val() //报销部门
	var appId = $("#appId").val() //报销人
	var reason = $("#reason").val() //报销事由
	var ticketCount = $("#ticketCount").val() //票据张数
	if ('' == orgName) {
		UM.alert('报销部门不能为空');
		return;
	}
	if ('' == appId) {
		UM.alert('报销人不能为空');
		return;
	}
	if ('' == reason) {
		UM.alert('报销事由不能为空');
		return;
	}
	if ('' == ticketCount) {
		UM.alert('票据张数不能为空');
		return;
	}
//校验报销明细总计 = 结算信息 （现金+转账+公务卡）总计
	//total 转账明细总计 ，  cashs 现金总计 ，  transfers 转账总计 ， bizcards 公务卡总计
	var  sumMoney 
	sumMoney = cashs +　transfers + bizcards;
	var total_money = $("#moneyGroup").val();
	if(total_money != sumMoney){
		UM.alert('错误：报销明细总计与结算信息总计不相等');
		return;
	}
	//var available_balance = $("#avaliableMoney").val();
	//if(total_money > available_balance){
		//UM.alert('错误：报销金额大于可用余额');
		//return;
	//}
	var params = {}; //封装请求数据
	if(summer.getStorage('dest_bill')) {
		var dest_bill = JSON.parse(summer.getStorage('dest_bill'));
		var dest_bill_arr = [];
		for(var key in dest_bill) {
			dest_bill_arr.push(dest_bill[key]);
		}
	}
	//基本信息
	var ArBill = {
		appId : userInfo.userId,//报销人
		inputorId : userInfo.userId,
		inputDate : "",
		reason : $("#reason").val(),//报销事由
		isCanPrint : "N",
		accountId : "",
		billType : "EXP_ENTERTAIN",
		coCode : userInfo.coCode,
		nd : userInfo.nd,
		isCarry : "N",
		billStatus : "10",
		checkMoney : $("#moneyGroup").val(),//合计
		orgCode : userInfo.orgCode,//报销部门
		jdMoney : "0",
	    printTimes : "0",
	    applyPrintTimes : "0", 
		projectCode : "*",
		remark : $("#remark").val(),//备注
		billId: billId,
		billNo: billNo	
	}
	
	params.ArBill = ArBill;
	params.applyBillList = dest_bill_arr;
	
	var infoList = [];
	var guestCompany = {//来客单位
		infoId: "ENTERTAIN_DANWEI",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#guest').val()
	};
	infoList.push(guestCompany);
	var jiedaiChushi = {//接待处室
		infoId: "JIEDAIDANWEI",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#receiveOffice').val()
	};
	infoList.push(jiedaiChushi);
	var days = {//天数
		infoId: "days",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#guest_days').val()
	};
	infoList.push(days);
	var peopleNumber = {//来客人数
		infoId: "peopleNumber",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#guest_num').val()
	};
	infoList.push(peopleNumber);
	var ticketCount = {//票据张数
		infoId: "ticketCount",
		belongTable: "EXPENSE_COMMON_INFO00", 
		recNo: "0", 
		value: $('#ticketCount').val()
	};
	infoList.push(ticketCount);
	params.infoList = infoList;
	
	var expenseList = [];
	//住宿费
	var room_standard = $("#room_standard").val();
	if(room_standard == ""){
		room_standard = 0;
	}
	var room_baoxiao = $("#room_baoxiao").val();
	if(room_baoxiao == ""){
		room_baoxiao = 0;
	}
	var room_checkMoney = $("#room_checkMoney").val();
	if(room_checkMoney == ""){
		room_checkMoney = 0;
	}
	var room_remark = $("#room_remark").val();
	var expense_room_info = {
		"belongTable": "EXP_ENTERTAIN00",
		"budgetMoney": "", 
		"checkMoney": room_checkMoney, 
		"currencyMoney": room_baoxiao, 
		"currencyKind": "RMB", 
		"days": "0", 
		"days2": "",  
		"days3": "",   
		"dependRemark": "", 
		"exchangeRate": "1", 
		"expenseDate": "",
		"expenseId": "ROOM",
		"money": room_baoxiao, 
		"peopleNums": "", 
		"peopleNums2": "", 
		"peopleNums3": "", 
		"quantity": "", 
		"quantity2": "", 
		"recNo": "0", 
		"remark": room_remark ,
		"selfMoney": "0", 
		"standard": room_standard,
		"standard2": "0",
		"standard3": "0",
		"tabId": "00", 
		"tabName": "明细单据(1)", 
		"ticketCount": "0", 		
		"unitofQantity": "间",
		"unitofQantity2": "天",		
	};
	expenseList.push(expense_room_info);
	//伙食费	
	var meal_standard = $("#meal_standard").val();
	if(meal_standard == ""){
		meal_standard = 0;
	}
	var meal_baoxiao = $("#meal_baoxiao").val();
	if(meal_baoxiao == ""){
		meal_baoxiao = 0;
	}
	var meal_checkMoney = $("#meal_checkMoney").val();
	if(meal_checkMoney == ""){
		meal_checkMoney = 0;
	}
	var meal_remark = $("#meal_remark").val();	
	var expense_meal_info = {
		"belongTable": "EXP_ENTERTAIN00", 
		"budgetMoney": "", 
		"checkMoney": meal_checkMoney, 
		"currencyKind": "RMB", 
		"currencyMoney": meal_baoxiao, 
		"days": "0", 
		"days2": "",  
		"days3": "", 
		"dependRemark": "", 
		"exchangeRate": "1", 
		"expenseDate": "",
		"expenseId": "MEAL",
		"money": meal_baoxiao, 
		"peopleNums": "", 
		"peopleNums2": "", 
		"peopleNums3": "",  
		"quantity": "", 
		"quantity2": "", 
		"recNo": "1", 	
		"remark": meal_remark, 
		"selfMoney": "0", 		
		"standard": meal_standard,
		"standard2": "0",
		"standard3": "0",
		"tabId": "00", 
		"tabName": "明细单据(1)", 
		"ticketCount": "0", 
		"unitofQantity": "人",
		"unitofQantity2": "天",	
	};
	expenseList.push(expense_meal_info);
	//其他费用	
	var other_standard = $("#other_standard").val();
	if(other_standard == ""){
		other_standard = 0;
	}
	var other_baoxiao = $("#other_baoxiao").val();
	if(other_baoxiao == ""){
		other_baoxiao = 0;
	}
	var other_checkMoney = $("#other_checkMoney").val();
	if(other_checkMoney == ""){
		other_checkMoney = 0;
	}
	var other_remark = $("#other_remark").val();	
	var expense_other_info = {
		"belongTable": "EXP_ENTERTAIN00", 
		"budgetMoney": "", 
		"checkMoney": other_checkMoney, 
		"currencyKind": "RMB", 
		"currencyMoney": other_baoxiao, 
		"days": "0", 
		"days2": "",  
		"days3": "", 
		"dependRemark": "", 
		"exchangeRate": "1", 
		"expenseDate": "",
		"expenseId": "OTHER",
		"money": other_baoxiao, 
		"peopleNums": "", 
		"peopleNums2": "", 
		"peopleNums3": "",  
		"quantity": "", 
		"quantity2": "", 
		"recNo": "2", 	
		"remark": other_remark, 
		"selfMoney": "0", 		
		"standard": other_standard,
		"standard2": "0",
		"standard3": "0",
		"tabId": "00", 
		"tabName": "明细单据(1)", 
		"ticketCount": "0", 
		"unitofQantity": "次",
		"unitofQantity2": "",	
	};
	expenseList.push(expense_other_info);
	params.expenseList = expenseList;	
	
	var arCashList = [];//现金和转账信息汇总						
	// 结算信息 1.现金
	if(summer.getStorage('dest_cash')) {
		var dest_cash = JSON.parse(summer.getStorage('dest_cash'));
		for(var key in dest_cash) {
			arCashList.push(dest_cash[key]);
		}
	}
	
	//2.转账
	if(summer.getStorage('dest_transfer')) {
		var dest_transfer = JSON.parse(summer.getStorage('dest_transfer'));
		for(var key in dest_transfer) {
			arCashList.push(dest_transfer[key]);
		}
	}
	params.arCashList = arCashList;//现金和转账信息汇总
	
	//3.公务卡
	if(summer.getStorage('dest_bizcard')){
		var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'))
		var dest_bizcard_arr = []
		for(var key in dest_bizcard) {
			dest_bizcard_arr.push(dest_bizcard[key])
		}
	}
	params.businessCardList = dest_bizcard_arr;	
	
	//console.log(params)
	var paa = JSON.stringify(params);
	var datapaa = "datapaa=" + paa;
		
	$.ajax({
		type: 'POST',
		data: datapaa,
		url : "http://" + ip + "/FS/services/billService/arBillSaveAndAudit_common",
		dataType: 'json',
		success: function(res) {
			//console.log(res)
			if(res.resultCode == "1"){
				billNo = res.rows.BILL_NO;
				billId = res.rows.BILL_ID;
				if(typeof billNo == "undefined" || billNo == null || billNo == ""){
					UM.alert('提交失败');	
				}else{
					UM.alert('提交成功');
					summer.closeToWin({
					    id: 'select_detail'
					});
				}
			}else{
				UM.alert('提交失败');	
			}
			
		},
		error: function(err) {
			console.log(err)
			UM.alert('提交失败')
		}
	});
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
			//console.log(data.rows)
			var list = data.rows
			$('#fileList').html()
			var listStr = ''
			if(billStatus!=10){
				list.forEach((v,i)=>{
					listStr += `
						<li class='list' fileId=${v.fileId} fileName=${v.fileName}>
							<div style='width: 80%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>
								<span>${v.fileName}</span>
							</div>
							
							<div style='text-align: center;width: 20%;padding-top:5px'>
								<span class='ti-zoom-in downFile'></span>
							</div>
						</li>
					`
				});
			}else{
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
				});
			}
			$('#fileList').html(listStr);
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
					id : 'attachFile_yj',
					url : 'html/attachFile_yj.html',
					reload : true,
					pageParam : {
						//billId : fileId,
						billId : billId
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


//加载信息
function fnLoaddetailInfo(billData){
	var ArBill = $.parseJSON(billData.ArBill);//字符串转json	
	//若单据状态billStatus为10，才可以进行修改
	//alert(ArBill.billStatus);
	billStatus = ArBill.billStatus;
	if(ArBill.billStatus!=10) $('#approveBtns').css("display","none");
	
	//billId,billNo
	billId = ArBill.billId;
	billNo = ArBill.billNo;
	//基本信息及用款申请单
	$("#orgName").val(ArBill.orgName);//报销部门
	$("#appId").val(ArBill.inputorName);//报销人
	$("#reason").val(ArBill.reason);//报销事由
	$("#moneyGroup").val(ArBill.checkMoney);//合计
	$("#remark").val(ArBill.remark);//备注	
	
	if(billData.applyBillList){//用款申请单
		var applyBillList = $.parseJSON(billData.applyBillList);
		var billIds=[];
		for(var i=0;i < applyBillList.length;i++){
			billIds.push(applyBillList[i].billId);
		}
		
	    //用款申请单
		var paramStrselectApplyListByConditionList4Mobile = "CO_CODE="+userInfo.coCode+"&BILL_TYPE=EXP_TRAFFIC&ND="+curr+"&APP_ID="+userInfo.userId;
		$.ajax({
			type : "get",
			async : false,
			url : "http://" + ip + "/FS/services/billService/selectApplyListByConditionList4Mobile_common?" + paramStrselectApplyListByConditionList4Mobile,
			error : function(data) {
				//console.log(data);
			},
			success : function(data) {
				if (data.resultCode == "1") {
					if(data.rows.arBillLoanList){
						var userData = $.parseJSON(data.rows.arBillLoanList);
						var html = '<option value="">请选择</option>';
						var sum_checkMoney = 0;
						var sum_avaliableMoney = 0;
						for (var i = 0; i < userData.length; i++) {
							//console.log(userData[i].avaliableMoney);
							if(userData[i].avaliableMoney != 0){
								html += `
									<option value="${userData[i].billId}">${userData[i].reason}(${userData[i].billNo})</option>
								`;
							    for(var j=0;j<billIds.length;j++){
							    	if(userData[i].billId == billIds[j]){
							    		sum_checkMoney += userData[i].checkMoney*1;
										sum_avaliableMoney += userData[i].avaliableMoney*1; 
							    	}
							    }				    
							}
						}
									 
						$('#usedMoney').val(sum_checkMoney);
						$('#avaliableMoney').val(sum_avaliableMoney);
						$('#applyBillList').html(html);
		  
						$('#applyBillList option').each(function () {
						    if (billIds.indexOf(this.value)!=-1) {
						    	this.setAttribute("selected","true");
						    }
						});  
						
						var opt = {
							'date' : {
								preset : 'date'
							},
							'select' : {
								preset : 'select'
							}
						};
		
			    		$('#applyBillList').scroller('destroy').scroller(
			    			$.extend(opt['select'], {
			    				theme: "ios7",
			    				mode: "scroller",
			    				display: "bottom",
			    				animate: "",
			    				onSelect: function(val, obj) {//公务卡下拉框确定按钮
			    					var sum_checkMoney = 0;
									var sum_avaliableMoney = 0;
									var apply_billId = [];
			    					$("#applyBillList option:selected").each(function () {
									     //console.log($(this).val());
									     apply_billId.push($(this).val());
									     for (var i = 0; i < userData.length; i++) {
										    if($(this).val() == userData[i].billId){//确定后 拿出卡号 对比得到对应的value
										    	sum_checkMoney += userData[i].checkMoney*1;
										    	sum_avaliableMoney += userData[i].avaliableMoney*1;
										  	}			
										}
									});
									$('#usedMoney').val(sum_checkMoney);
									$('#avaliableMoney').val(sum_avaliableMoney);
			    					//console.log($('#applyBillList_dummy').val());
									
									for(var i=0;i < apply_billId.length;i++){
										var dest_bill_obj = {
											billId: apply_billId[i], // 需要回传至后台的 billId
										}
										dest_bill[`id`+ i] = dest_bill_obj;
										summer.setStorage('dest_bill', JSON.stringify(dest_bill));	
									}
									//console.log("用款申请单："+JSON.stringify(dest_bill));
				    			}
				    		})
				    	);
					}
				} else {
					alert(data.rows);
				}
			}
		});	
	}
	
	var infoList = $.parseJSON(billData.infoList);	
	var expenseList = $.parseJSON(billData.expenseList);
	if(billData.arCashList){//现金及转账
		var arCashList = $.parseJSON(billData.arCashList);
		var transferList = [];//转账
		var cashList = [];//现金
		for(var i=0;i<arCashList.length;i++){
			if(arCashList[i].settlementType == 1){//现金
				cashList.push(arCashList[i]);
			}else{
				transferList.push(arCashList[i]);
			}
		}
		//结算信息-现金
		for(var i=0;i < cashList.length;i++){
			$('#cashGroup .detail-btn').append(
				`
				<li class="um-listgroup-row um-listview-row">
					<a href="#cash" class="um-list-item main-item go-next-page ">
						<div class="um-list-item-inner">
							<div class="um-list-item-body">
								<h5 class="um-media-heading um-blue">现金</h5>
							</div>
							<div class="um-list-item-right">
								<span class="um-gray mr15 money-count">`+cashList[i].money+`</span>
							</div>
						</div>
						<div class="um-swipe-btns">
			                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
			            </div>
					 </a>
				</li>
						
				`
			);
			var dest_xianjin_obj = {
				settlementType: "1",
				money: cashList[i].money, // 现金-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: cashList[i].money, // 现金-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: "",
				receiveAccountId: "",
				receiveBank: "",
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: cashList[i].drCr, // 现金-收支
				bopCode: "",
				remark: cashList[i].remark, // 现金-备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: i,//现金-记录序号
				accCodeFlag: "0",
				correspbank: "",
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: "",
				receiveBankCode: "",
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			}
			dest_cash[`id`+i] = dest_xianjin_obj;
			xianjianIndex++;
			summer.setStorage('dest_cash', JSON.stringify(dest_cash));	
			cashs += cashList[i].money;	
		}
		$("#cashGroup .um-box-vc #cashs").text(cashs);//现金小计
		
		//结算信息-转账
		for(var i=0;i < transferList.length;i++){
			$('#transferGroup .detail-btn').append(
				`
				<li class="um-listgroup-row um-listview-row">
					<a href="#transfer" class="um-list-item main-item go-next-page ">
						<div class="um-list-item-inner">
							<div class="um-list-item-body">
								<h5 class="um-media-heading um-blue">收款方户名：`+transferList[i].receiveAccountId+`</h5>
							</div>
							<div class="um-list-item-right">
								<span class="um-gray mr15 money-count">`+transferList[i].money+`</span>
							</div>
						</div>
						<div class="um-swipe-btns">
			                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
			            </div>
					 </a>
				</li>
				`
			);	
	
			var dest_transfer_obj = {
				settlementType: "3",//有待确认
				money: transferList[i].money, // 转账-金额
				currencyKind: "RMB",
				exchangeRate: "1",
				currencyMoney: transferList[i].money,  // 转账-金额
				chequeKind: "",
				chequeNo: "",
				bAccCode: "",
				receiveAccount: transferList[i].receiveAccount,//转账-收款方账号
				receiveAccountId: transferList[i].receiveAccountId, // 转账-收款方户名 
				receiveBank: transferList[i].receiveBank,//转账-开户行名称
				receiveBankAddr: "",
				payAccountId: "",
				payBankName: "",
				journalNo: "",
				drCr: "-1", // 现金-收支
				bopCode: "",
				remark: transferList[i].remark,//转账备注
				billTypeName: "",
				payCode: "",
				eachQuotaAmount: "",
				recNo: transferList[i].recNo,//转账-记录序号
				accCodeFlag: "0",
				correspbank: transferList[i].correspbank, 
				correspBankAddr: "",
				iban: "",
				swift: "",
				COLLECT_PURPOSE: "",
				billDate: "",
				accountbookId: "",
				payID: "",
				accID: transferList[i].accID,  
				receiveBankCode: transferList[i].receiveBankCode,
				receiveBankCity: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				setteMentNO: ""
			};
			dest_transfer[`id`+i] = dest_transfer_obj;
			transferIndex++;
			summer.setStorage('dest_transfer', JSON.stringify(dest_transfer));
			transfers+=transferList[i].money;
		}
		$("#transferGroup .um-box-vc #transfers").text(transfers);//转账小计
	}
	if(billData.businessCardList){//公务卡
		var businessCardList = $.parseJSON(billData.businessCardList);
		//结算信息-公务卡
		for(var i=0;i < businessCardList.length;i++){
			$('#bizcardGroup .detail-btn').append(
				`
					<li class="um-listgroup-row um-listview-row">
					<a href="#bizcard" class="um-list-item main-item go-next-page">
						<div class="um-list-item-inner">
							<div class="um-list-item-body">
								<h5 class="um-media-heading um-blue">持卡人姓名：`+businessCardList[i].userName+`</h5>
							</div>
							<div class="um-list-item-right">
								<span class="um-gray mr15 money-count">`+businessCardList[i].money+`</span>
							</div>
						</div>
						<div class="um-swipe-btns">
			                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
			            </div>
					 </a>
				</li>
				`
			);
			var dest_bizcard_obj = {
				recNo: i,//记录序号
				cardNo: businessCardList[i].cardNo, // 卡号
				userId : businessCardList[i].userId, 
				userName: businessCardList[i].userName, // 持卡人姓名 
				consumeDate: "",
				money: businessCardList[i].money, // 报销金额
				authCode: "",
				isRepayment: "",
				inputUserid: "",
				merchantName: "",
				pepaymentNo: "",
				sumBillId: "",
				extendField1: "",
				extendField2: "",
				extendField3: "",
				receiveBank: "",
				receiveBankCity: "",
				receiveBankAddr: "",
				receiveBankNodeNo: "",
				receiveBankNodeName: "",
				payBankName: "",
				payAccountId: "",
				payCode: "",
				payId: "",
				accId: "",
				journalNo: "",
				creditcardMoney: "",
				accCode: "",
				accountBoookId: "",
				orgCode : businessCardList[i].orgCode,
				cardPurpose: ""
			}
			dest_bizcard[`id`+i] = dest_bizcard_obj;
			bizcardIndex++;
			summer.setStorage('dest_bizcard', JSON.stringify(dest_bizcard));
			bizcards+=businessCardList[i].money;
		}
		$("#bizcardGroup .um-box-vc #bizcards").text(bizcards);//公务卡小计
	}
			
	//票据张数及车号
	for(var i=0;i < infoList.length;i++){
		if(infoList[i].infoId == "ENTERTAIN_DANWEI"){//来客单位
			$('#guest').val(infoList[i].value);
		}else if(infoList[i].infoId == "JIEDAIDANWEI"){//接待处室
			$('#receiveOffice').val(infoList[i].value);
		}else if(infoList[i].infoId == "days"){//天数
			$('#guest_days').val(infoList[i].value);
		}else if(infoList[i].infoId == "peopleNumber"){//来客人数
			$('#guest_num').val(infoList[i].value);
		}else if(infoList[i].infoId == "ticketCount"){//票据张数
			$('#ticketCount').val(infoList[i].value);
		}
	}
	
	//报销明细
	for(var i=0;i < expenseList.length;i++){
		if(expenseList[i].expenseId == "ROOM"){//住宿费
			$('#room_standard').val(expenseList[i].standard);
			$('#room_baoxiao').val(expenseList[i].money);
			$('#room_checkMoney').val(expenseList[i].checkMoney);
			$('#room_remark').val(expenseList[i].remark);
			$('#room_fee').text("金额："+expenseList[i].money);
			var detail_room_info = {
				"money": expenseList[i].money
			}
			detail_sum[0] = detail_room_info;
			summer.setStorage('detail_sum', JSON.stringify(detail_sum));
		}else if(expenseList[i].expenseId == "MEAL"){//伙食费
			$('#meal_standard').val(expenseList[i].standard);
			$('#meal_baoxiao').val(expenseList[i].money);
			$('#meal_checkMoney').val(expenseList[i].checkMoney);
			$('#meal_remark').val(expenseList[i].remark);
			$('#meal_fee').text("金额："+expenseList[i].money);
			var detail_meal_info = {
				"money": expenseList[i].money
			}
			detail_sum[1] = detail_meal_info;
			summer.setStorage('detail_sum', JSON.stringify(detail_sum));
		}else if(expenseList[i].expenseId == "OTHER"){//其他费用
			$('#other_standard').val(expenseList[i].standard);
			$('#other_baoxiao').val(expenseList[i].money);
			$('#other_checkMoney').val(expenseList[i].checkMoney);
			$('#other_remark').val(expenseList[i].remark);
			$('#other_fee').text("金额："+expenseList[i].money);
			var detail_other_info = {
				"money": expenseList[i].money
			}
			detail_sum[2] = detail_other_info;
			summer.setStorage('detail_sum', JSON.stringify(detail_sum));
		}
	}
}
