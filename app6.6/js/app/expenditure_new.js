﻿var billId;
var billNo;
var isSave;
var userInfo;
var ip;
// 报销明细
var clickIndex = 0;
var info_list = {};
info_list.kz_context={};//开支内容
var expense_List = {};
var dest_detail_sum = {};
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
	summer.rmStorage("dest_cash");//现金
    summer.rmStorage("info_list");//报销明细1
    summer.rmStorage("expense_List");//报销明细2
    summer.rmStorage("dest_detail_sum");//报销明细 
	summer.rmStorage("dest_transfer");//转账
	summer.rmStorage("dest_bizcard");//公务卡
	ip = summer.getStorage('ip');
	var url = 'http://' + ip +'/FS';
	
	//获取缓存中的值 基本信息
	console.log(summer.getStorage('userInfo_local'))
	userInfo = JSON.parse(summer.getStorage('userInfo_local'))
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
	// 新增报销明细
	$('#dateBtnGroup button').on('click', function() {
		$('#transportation .detail-btn').append(
			
			`<li class="um-listgroup-row um-listview-row">
				<a href="#goDest" class="um-list-item main-item go-dest-cost go-next-page um-swipe-action">
					<div class="um-list-item-inner">
						<div class="um-list-item-body">
							<h5 class="um-media-heading um-blue">填写报销明细</h5>
						</div>
						<div class="um-list-item-right">
							<span class="um-gray mr15 money-count">0.00</span>
						</div>
					</div>
					<div class="um-swipe-btns">
		                <span class="um-swie-btn um-delete"><span class="ti-trash" > &nbsp;删除</span></span>
		            </div>
				 </a>
			</li>`
		)
	})
	// 报销明细确定 
	$('#dest_detail_confirm').on('click', function() {
		var bx_money = $('#money_baoxiao').val();
		if ('' == bx_money) {
			UM.alert('报销金额不能为空');
			return;
		}
		//开支内容
		var kz_content = {
			infoId: "KZ_CONTEXT",
			belongTable: "EXPENSE_INFO00",
			recNo: `${clickIndex}`,
			value: $('#KZ_CONTEXT').val() // 开支内容
		}
		info_list.kz_context[`id${clickIndex}`] = kz_content;

		//城市间交通费金额
		var expense_detail = {
			expenseId: "NO_DEFINE",
		 	belongTable: "EXP_OUTLAY00", 
			recNo: `${clickIndex}`, 
			money: $('#money_baoxiao').val(), 
			currencyKind: "RMB", 
			exchangeRate: "1", 
			currencyMoney: $('#money_baoxiao').val(), 
			selfMoney: "0", 
			checkMoney: $('#checkMoney').val(), // 核定金额
			ticketCount: "0", 
			remark: $('#remark_baoxiao').val(), // 备注
			dependRemark: "", 
			budgetMoney: "", 
			standard: "0",  
			peopleNumber: "", 
			days: "",   
			quantity: "", 
			unitofQantity: "", 
			baoGanBalanceList: "", 
			tabName: "明细单据(1)", 
			tabId: "00", 
			expenseDate: ""
		};
		expense_List[`id${clickIndex}`]= expense_detail;
		
		var dest_detail_obj = {
			sum_money: $('#money_baoxiao').val(), // 总金额
		};		
		dest_detail_sum[`id${clickIndex}`] = dest_detail_obj;
		
		summer.setStorage('info_list', JSON.stringify(info_list));
		summer.setStorage('expense_List', JSON.stringify(expense_List));
		summer.setStorage('dest_detail_sum', JSON.stringify(dest_detail_sum));
		
		$('#transportation .money-count').eq(clickIndex).text(dest_detail_obj.sum_money);//传回报销金额
		$('#transportation .um-media-heading').eq(clickIndex).text('开支内容：' + kz_content.value);//传回开支内容
		$('#goDest .um-back').trigger('click');
		total = 0;
		for(var key in dest_detail_sum) {//遍历删除后剩余的value的值  
			total += Number(dest_detail_sum[key].sum_money);//累加
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
	
	// 写入缓存
	$('#transportation').on('click', '.um-listgroup-row', function() {
		clickIndex = $(this).index();
		//console.log(clickIndex);
		$('#goDest .form-control').val('');//清空缓存中报销明细的数据
		if(summer.getStorage('info_list')) {
			var info_list = JSON.parse(summer.getStorage('info_list'));
			var kz_content = info_list.kz_context[`id${clickIndex}`];
			if(kz_content){
				$('#KZ_CONTEXT').val(kz_content.value);
			}
		}
		if(summer.getStorage('expense_List')){
			var expense_List = JSON.parse(summer.getStorage('expense_List'));
			if(expense_List[`id${clickIndex}`]) {
				var obj = expense_List[`id${clickIndex}`];
				$('#money_baoxiao').val(obj.money);
				$('#checkMoney').val(obj.checkMoney);
				$('#remark_baoxiao').val(obj.remark);
			}
		}
	});
	
	//报销明细中 填写报销金额 带出核定金额
	$('#goDest #money_baoxiao').on('blur', function() {
		$('#goDest #checkMoney').val($(this).val())
	});
	//报销明细中删除 左划
	var listview = UM.listview('#transportation')
	listview.on('itemSwipeLeft', function(sender,args){
		sender.showItemMenu(args.$target);
	});
	//报销明细中删除 方式事件
	listview.on('itemDelete', function(sender, args) {
    	//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即//rowIndex(行索引)和$target(目标行的jquery对象)
	    args.$target.slideUp(500, function() {
	        //console.log(args)
	        var j = args.rowIndex; //记录删除的ID值
	        if(summer.getStorage('info_list')) {//判断拿到的缓存是否有值
				delete info_list[`id${j}`];//删除对用的 value的值
				summer.setStorage('info_list', JSON.stringify(info_list));
			}if(summer.getStorage('expense_List')){
				delete expense_List[`id${j}`];//删除对用的 value的值
				summer.setStorage('expense_List', JSON.stringify(expense_List));
			}if(summer.getStorage('dest_detail_sum')){
				delete dest_detail_sum[`id${j}`];//删除对用的 value的值
				total = 0; //重新定义报销明细总计的变量
				for(var key in dest_detail_sum) {//遍历删除后剩余的value的值  
					total += Number(dest_detail_sum[key].sum_money);//累加
				}
				$("#basicMessage .form-control").eq(4).val(total);//赋值给 基本信息中的合计
				summer.setStorage('dest_detail_sum', JSON.stringify(dest_detail_sum));
			}
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
			drCr: $('#expenditure_content option:selected').val(), // 现金-收支
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
		$('#cash .um-back').trigger('click');		
		cashs = 0; //记录现金所有记录总和
		for(var key in dest_cash) {//遍历删除后剩余的value的值  
			if(dest_cash[key].drCr == '-1') cashs += Number(dest_cash[key].money);//累加
			else cashs -= Number(dest_cash[key].money);
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
	        var j = args.rowIndex //记录删除的ID值
	        			
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
				delete dest_cash[`id${j}`]//删除对用的 value的值
				cashs = 0 //重新定义报销明细总计的变量
				for(var key in dest_cash) {//遍历删除后剩余的value的值  
					cashs += Number(dest_cash[key].money)//累加
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
									//console.log(userData[i].BANK_ACC_NAME);
									$('#receiveAccount').val(userData[i].BANK_ACC_CODE);//收款方账号
									$('#receiveBank').val(userData[i].BANK_NAME);//收款方开户行名称
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
			remark: "",//转账备注
			billTypeName: "",
			payCode: "",
			eachQuotaAmount: "",
			recNo: `${transferIndex}`*1 + cash_id,//转账-记录序号
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
		$('#transferGroup .um-media-heading').eq(transferIndex).text('收款方户名：' + $('#receiveAccountId_dummy').val())//传回收款方户名 
		$('#transferGroup .money-count').eq(transferIndex).text(dest_transfer_obj.money)//传回金额
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
		transferIndex = $(this).index()
		//console.log(transferIndex)
		$('#transfer .form-control').val('')//清空缓存中转账明细的数据
		if(summer.getStorage('dest_transfer')) {
			var dest_transfer = JSON.parse(summer.getStorage('dest_transfer'))
			if(dest_transfer[`id${transferIndex}`]) {
				var obj = dest_transfer[`id${transferIndex}`]
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
	        var j = args.rowIndex; //记录删除的ID值
	        
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
	})
	
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
					for(var i=0; i<userData.length;i++){
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
									//console.log(userData[i]);
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
		summer.setStorage('dest_bizcard', JSON.stringify(dest_bizcard))
		$('#bizcardGroup .um-media-heading').eq(bizcardIndex).text('持卡人姓名：' + $('#userName_dummy').val())//传回收款方户名 
		$('#bizcardGroup .money-count').eq(bizcardIndex).text(dest_bizcard_obj.money)//传回金额
		$('#bizcard .um-back').trigger('click');
		
		bizcards = 0 //记录公务卡所有记录总和
		for(var key in dest_bizcard) {//遍历删除后剩余的value的值  
			bizcards += Number(dest_bizcard[key].money)//累加
		}
		$("#bizcardGroup .um-box-vc #bizcards").text(bizcards)//总和传回主页面
		
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
		//console.log(bizcardIndex);
		$('#bizcard .form-control').val('');//清空缓存中公务卡明细的数据
		if(summer.getStorage('dest_bizcard')) {
			var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'))
			if(dest_bizcard[`id${bizcardIndex}`]) {
				var obj = dest_bizcard[`id${bizcardIndex}`]
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
				
				delete dest_bizcard[`id${j}`]//删除对用的 value的值
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
	var paramStrselectApplyListByConditionList4Mobile = "CO_CODE="+userInfo.coCode+"&BILL_TYPE=EXP_OUTLAY&ND="+curr+"&APP_ID="+userInfo.userId;
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
	
	if(billId == "undefined" || billId == null || billId == ""){
		document.getElementById("approve").addEventListener('click', fnSavebill, false); 
		document.getElementById("backInput").addEventListener('click', fnSubmitbill, false); 
	}else if(billId != "" && isSave == 1){
		document.getElementById("approve").removeEventListener('click', fnSavebill, false);
		document.getElementById("approve").style.color = "gray";
	}

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
	var  sumMoney ;//结算信息总计
	sumMoney = cashs +　transfers + bizcards;
	var totalmoney = $("#moneyGroup").val();
	//alert(sumMoney) //查看三个结算信息总金额
	if(totalmoney != sumMoney){
		UM.alert('错误：报销明细总计与结算信息总计不相等');
		return;
	}
	//var available_balance = $("#avaliableMoney").val();
	//if(totalmoney > available_balance){
		//UM.alert('错误：报销金额大于可用余额');
		//return;
	//}
 	var params = {} //封装请求数据
 	// 用款申请单
	if(summer.getStorage('dest_bill')) {
		var dest_bill = JSON.parse(summer.getStorage('dest_bill'))
		var dest_bill_arr = []
		for(var key in dest_bill) {
			dest_bill_arr.push(dest_bill[key])
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
		billType : "EXP_OUTLAY",
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
		remark : $("#basicMessage .form-control").eq(5).val(),//备注
	}
	
	params.ArBill = ArBill;
	params.applyBillList = dest_bill_arr;
	// 报销明细
	var infoList = [];
	if(summer.getStorage('info_list')) {
		var info_list = JSON.parse(summer.getStorage('info_list'));
		var kz_content = info_list.kz_context;
		if(kz_content){
			for(var key in kz_content) {
				infoList.push(kz_content[key]);
			}
		}
	}	
	//票据张数
	var ticketCount = {
		infoId: "ticketCount",
		belongTable: "EXPENSE_COMMON_INFO00",
		recNo: '0',
		value: $('#ticketCount').val() // 票据张数
	};	
	infoList.push(ticketCount);
	params.infoList = infoList;
	
	// 报销明细
	var expenseList = [];
	if(summer.getStorage('expense_List')) {
		var expense_List = JSON.parse(summer.getStorage('expense_List'));
		if(expense_List){
			for(var key in expense_List) {
				expenseList.push(expense_List[key]);
			}
		}
	}	
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
		var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'));
		var dest_bizcard_arr = [];
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
	var  sumMoney ;
	sumMoney = cashs +　transfers + bizcards;
	if(total != sumMoney){
		UM.alert('错误：报销明细总计与结算信息总计不相等');
		return;
	}
	//var available_balance = $("#avaliableMoney").val();
	//if(total > available_balance){
		//UM.alert('错误：报销金额大于可用余额');
		//return;
	//}
	
	var params = {} //封装请求数据
	if(summer.getStorage('dest_bill')) {
		var dest_bill = JSON.parse(summer.getStorage('dest_bill'))
		var dest_bill_arr = []
		for(var key in dest_bill) {
			dest_bill_arr.push(dest_bill[key])
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
		billType : "EXP_OUTLAY",
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
		remark : $("#basicMessage .form-control").eq(5).val(),//备注
		billId: billId,
		billNo: billNo	
	}
	
	params.ArBill = ArBill;
	params.applyBillList = dest_bill_arr;
	// 报销明细
	var infoList = [];
	if(summer.getStorage('info_list')) {
		var info_list = JSON.parse(summer.getStorage('info_list'));
		var kz_content = info_list.kz_context;
		if(kz_content){
			for(var key in kz_content) {
				infoList.push(kz_content[key]);
			}
		}
	}	
	//票据张数
	var ticketCount = {
		infoId: "ticketCount",
		belongTable: "EXPENSE_COMMON_INFO00",
		recNo: '0',
		value: $('#ticketCount').val() // 票据张数
	};	
	infoList.push(ticketCount);
	params.infoList = infoList;
	
	// 报销明细
	var expenseList = [];
	if(summer.getStorage('expense_List')) {
		var expense_List = JSON.parse(summer.getStorage('expense_List'));
		if(expense_List){
			for(var key in expense_List) {
				expenseList.push(expense_List[key]);
			}
		}
	}	
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
		var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'));
		var dest_bizcard_arr = [];
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