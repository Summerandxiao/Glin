var bdata;
var billId;
var userInfo;
var ip;
var curBtn,app_content;
//基本信息
var basic ={};
var basicIndex= 0;
// 报销明细
var clickIndex = 0;
var dest_detail = {};
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
var dest_bill = {}
var billIndex = 0

summerready = function() {
	//清除缓存
	summer.rmStorage("dest_cash");
    summer.rmStorage("dest_detail");
	summer.rmStorage("dest_transfer");
	summer.rmStorage("dest_bizcard");
	ip = summer.getStorage('ip');
	var url = 'http://' + ip +'/FS';
	
	//获取缓存中的值 基本信息
	userInfo = JSON.parse(summer.getStorage('userInfo_local'))
	if(userInfo){//有数据
		$("#orgCode").val(userInfo.orgName),//报销部门
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
	
	// 报销明细确定 
	$('#dest_detail_confirm').on('click', function() {
		var bx_money = $('#goDest .form-control').eq(1).val()
		if ('' == bx_money) {
			UM.alert('报销金额不能为空');
			return;
		}
		var dest_detail_obj = {
			KZ_CONTEXT: $('#goDest .form-control').eq(0).val(), // 开支内容
			money_baoxiao: $('#goDest .form-control').eq(1).val(), // 报销金额
			checkMoney: $('#goDest .form-control').eq(2).val(), // 核定金额
			remark_baoxiao: $('#goDest .form-control').eq(3).val(), // 备注
		}
		dest_detail[`id${clickIndex}`] = dest_detail_obj
		summer.setStorage('dest_detail', JSON.stringify(dest_detail))
		$('#transportation .money-count').eq(clickIndex).text(dest_detail_obj.money_baoxiao)//传回报销金额
		$('#transportation .um-media-heading').eq(clickIndex).text('开支内容：' + dest_detail_obj.KZ_CONTEXT)//传回开支内容
		$('#goDest .um-back').trigger('click')
		total = 0
		for(var key in dest_detail) {//遍历删除后剩余的value的值  
			total += Number(dest_detail[key].money_baoxiao)//累加
		}
		$("#basicMessage #moneyGroup").val(total)
	})
	
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
	// 写入缓存
	$('#transportation').on('click', '.um-listgroup-row', function() {
		clickIndex = $(this).index()
		console.log(clickIndex)
		$('#goDest .form-control').val('')//清空缓存中报销明细的数据
		if(summer.getStorage('dest_detail')) {
			var dest_detail = JSON.parse(summer.getStorage('dest_detail'))
			if(dest_detail[`id${clickIndex}`]) {
				var obj = dest_detail[`id${clickIndex}`]
				$('#goDest .form-control').eq(0).val(obj.KZ_CONTEXT)
				$('#goDest .form-control').eq(1).val(obj.money_baoxiao)
				$('#goDest .form-control').eq(2).val(obj.checkMoney)
				$('#goDest .form-control').eq(3).val(obj.remark_baoxiao)
			}
		}
		
	})
	
	//报销明细中 填写报销金额 带出核定金额
	$('#goDest #money_baoxiao').on('blur', function() {
		$('#goDest #checkMoney').val($(this).val())
	})
	//报销明细中删除 左划
	var listview = UM.listview('#transportation')
	listview.on('itemSwipeLeft', function(sender,args){
		sender.showItemMenu(args.$target);
	});
	//报销明细中删除 方式事件
	listview.on('itemDelete', function(sender, args) {
    	//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即//rowIndex(行索引)和$target(目标行的jquery对象)
	    args.$target.slideUp(500, function() {
	        console.log(args)
	        var j = args.rowIndex //记录删除的ID值
	        if(summer.getStorage('dest_detail')) {//判断拿到的缓存是否有值
				//var baoxiao = JSON.parse(summer.getStorage('dest_detail'))
				delete dest_detail[`id${j}`]//删除对用的 value的值
				total = 0 //重新定义报销明细总计的变量
				for(var key in dest_detail) {//遍历删除后剩余的value的值  
					total += Number(dest_detail[key].money_baoxiao)//累加
				}
				$("#basicMessage .form-control").eq(4).val(total)//赋值给 基本信息中的合计
				summer.setStorage('dest_detail', JSON.stringify(dest_detail));
			}
	    });
	});
	// 现金明细确定
	$('#dest_xianjin_bth').on('click', function() {
		var ca_money = $('#cash .form-control').eq(0).val()
		if ('' == ca_money) {
			UM.alert('金额不能为空');
			return;
		}
		var expen_content = $('#cash .form-control').eq(1).val()
		if ('' == expen_content || null == expen_content) {
			UM.alert('收支不能为空');
			return;
		}
		var dest_xianjin_obj = {
			cash_money: $('#cash .form-control').eq(0).val(), // 金额
			expenditure_content: $('#cash .form-control').eq(1).val(), // 收支
			cash_remark: $('#cash .form-control').eq(2).val(), // 备注
		}
		dest_cash[`id${xianjianIndex}`] = dest_xianjin_obj
		summer.setStorage('dest_cash', JSON.stringify(dest_cash))
		$('#cashGroup .money-count').eq(xianjianIndex).text(dest_xianjin_obj.cash_money)//传回
		//UM.page.back()
		//$('#goDest_xj').removeClass()
		//$('#goDest_xj').addClass('um-page')
		$('#cash .um-back').trigger('click')
		cashs = 0 //记录现金所有记录总和
		for(var key in dest_cash) {//遍历删除后剩余的value的值  
			cashs += Number(dest_cash[key].cash_money)//累加
		}
		$("#cashGroup .um-box-vc #cashs").text(cashs)//总和传回主页面
		
		
	})
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
	})
	$('#cashGroup').on('click', '.um-listgroup-row', function( ) {
		xianjianIndex = $(this).index()
		console.log(xianjianIndex)
		$('#cash .form-control').val('')//清空缓存中现金明细的数据
		if(summer.getStorage('dest_cash')) {
			var dest_cash = JSON.parse(summer.getStorage('dest_cash'))
			if(dest_cash[`id${xianjianIndex}`]) {
				var obj = dest_cash[`id${xianjianIndex}`]
				$('#cash .form-control').eq(0).val(obj.cash_money)
				$('#cash .form-control').eq(1).val(obj.expenditure_content)
				$('#cash .form-control').eq(2).val(obj.cash_remark)
			}
		}
	})
	//结算信息中 现金删除 左划
	var cash_delete = UM.listview('#cashGroup')
	cash_delete.on('itemSwipeLeft', function(sender,args){
		sender.showItemMenu(args.$target);
	});
	//现金中删除 方式事件
	cash_delete.on('itemDelete', function(sender, args) {
    	//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即//rowIndex(行索引)和$target(目标行的jquery对象)
	    args.$target.slideUp(500, function() {
	        console.log(args)
	        var j = args.rowIndex //记录删除的ID值
	        if(summer.getStorage('dest_cash')) {//判断拿到的缓存是否有值
				delete dest_cash[`id${j}`]//删除对用的 value的值
				cashs = 0 //重新定义报销明细总计的变量
				for(var key in dest_cash) {//遍历删除后剩余的value的值  
					cashs += Number(dest_cash[key].cash_money)//累加
				}
				console.log(cashs)
				$("#cashGroup .um-box-vc #cashs").text(cashs)//总和传回主页面
				summer.setStorage('dest_cash', JSON.stringify(dest_cash));
			}
	    });
	});
	
	//转账人信息
		 var paramStrgetBkCurrentAccList = "CO_CODE=043001";
		 $.ajax({
		  type : "get",
		  async : false,
		  url : "http://" + ip + "/FS/services/billService/getBkCurrentAcc?" + paramStrgetBkCurrentAccList,
		  error : function(data) {
		   console.log(data);
		  },
		  success : function(data) {
		   if (data.resultCode == "1") {
		    var userData = data.rows;
		    console.log(data);
		    console.log(userData);
		    //遍历下拉框数据Demo
				$('#receiveAccountId').one('click', function() {
					var html = ''
					userData.forEach(item => {
						html += `
							<option value="${item.CO_CODE}">${item.BANK_ACC_NAME}</option>
						`
					})
					$('#receiveAccountId').html(html)
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
		    					console.log(obj)
		    					var cardNo_select = obj.val;
		    					for (var i = 0; i < data.rows.length; i++) {
								    if(cardNo_select == data.rows[i].BANK_ACC_NAME){//确定后 拿出卡号 对比得到对应的value
										console.log(data.rows[i])
										break;
							    	}
								}
		    				}
		    			})
		    		);
		    	})
		   } else {
		    alert(data.rows);
		   }
	 	}
	});
	// 转账明细确定  调取接口拿到对应人员的值  判断收款方户名 是否存在  存在-赋对应的值  不存在为空字符串
	$('#dest_transfer_bth').on('click', function() {
		var dest_transfer_obj = {
			receiveAccountId: $('#transfer .form-control').eq(1).val(), // 收款方户名 
			transfer_money: $('#transfer .form-control').eq(2).val(), // 金额
			receiveAccount : '',
			receiveBank : '',
			correspbank : '', 
			accID : '',  
			receiveBankCode : '' ,
		}
		dest_transfer[`id${transferIndex}`] = dest_transfer_obj
		summer.setStorage('dest_transfer', JSON.stringify(dest_transfer))
		$('#transferGroup .um-media-heading').eq(transferIndex).text('收款方户名：' + dest_transfer_obj.receiveAccountId)//传回收款方户名 
		$('#transferGroup .money-count').eq(transferIndex).text(dest_transfer_obj.transfer_money)//传回金额
		$('#transfer .um-back').trigger('click')
		
		transfers = 0 //记录转账 所有记录总和
		for(var key in dest_transfer) {//遍历删除后剩余的value的值  
			transfers += Number(dest_transfer[key].transfer_money)//累加
		}
		$("#transferGroup .um-box-vc #transfers").text(transfers)//总和传回主页面
	})
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
		)
	})
	$('#transferGroup').on('click', '.um-listgroup-row', function( ) {
		transferIndex = $(this).index()
		console.log(transferIndex)
		$('#transfer .form-control').val('')//清空缓存中转账明细的数据
		if(summer.getStorage('dest_transfer')) {
			var dest_transfer = JSON.parse(summer.getStorage('dest_transfer'))
			if(dest_transfer[`id${transferIndex}`]) {
				var obj = dest_transfer[`id${transferIndex}`]
				$('#transfe .form-control').eq(0).val(obj.receiveAccountId)
				$('#transfe .form-control').eq(1).val(obj.transfer_money)
			}
		}
	})
	//结算信息中 转账删除 左划
	var transfer_delete = UM.listview('#transferGroup')
	transfer_delete.on('itemSwipeLeft', function(sender,args){
		sender.showItemMenu(args.$target);
	});
	//转账中删除 方式事件
	transfer_delete.on('itemDelete', function(sender, args) {
    	//这是可以编写行删除逻辑，参数sender即为当前列表实例对象，args对象有2个属性，即//rowIndex(行索引)和$target(目标行的jquery对象)
	    args.$target.slideUp(500, function() {
	        console.log(args)
	        var j = args.rowIndex //记录删除的ID值
	        if(summer.getStorage('dest_transfer')) {//判断拿到的缓存是否有值
				delete dest_transfer[`id${j}`]//删除对用的 value的值
				transfes = 0 //重新定义报销明细总计的变量
				for(var key in dest_transfer) {//遍历删除后剩余的value的值  
					transfes += Number(dest_transfer[key].transfer_money)//累加
				}
				$("#transferGroup .um-box-vc #transfers").text(transfers)//总和传回主页面
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
	//公务卡信息
	var paramStrselectCardInfoList = "CO_CODE=043001&USER_NAME=董鼠应&ND=2019";
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + ip + "/FS/services/billService/selectCardInfoList?" + paramStrselectCardInfoList,
		error : function(data) {
			console.log(data);
		},
		success : function(data) {
			if (data.resultCode == "1") {
				var userData = data.rows;
				console.log(data);
				console.log(userData);
				//遍历下拉框数据Demo
				$('#userName').one('click', function() {
					var html = ''
					userData.forEach(item => {
						html += `
							<option value="${item.cardNo}">${item.userName}</option>
						`
					})
					$('#userName').html(html)
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
		    					for (var i = 0; i < data.rows.length; i++) {
								    if(cardNo_select == data.rows[i].cardNo){//确定后 拿出卡号 对比得到对应的value
										console.log(data.rows[i]);
										$('#userName_dummy').val(data.rows[i].userName)
										$('#cardNo').val(data.rows[i].cardNo)
										$('#userId').val(data.rows[i].userId)
										$('#orgCode').val(data.rows[i].orgCode)
										break;
								  	 	}
									}
			    				}
			    			})
			    		);
					})
				} else {
					alert(data.rows);
					alert('卡信息失败');
				}
			}
		});
	})
	
	// 公务卡明细确定
	$('#bizcard_bth').on('click', function() {
		var biz_cardNo = $('#dest_bizcard .form-control').eq(1).val()
		if ('' == biz_cardNo || null == biz_cardNo) {
			UM.alert('卡号不能为空');
			return;
		}
		var biz_money = $('#dest_bizcard .form-control').eq(2).val()
		if ('' == biz_money) {
			UM.alert('报销金额不能为空');
			return;
		}
		var dest_bizcard_obj = {
			userName: $('#userName_dummy').val(), // 持卡人姓名 
			cardNo: $('#dest_bizcard .form-control').eq(1).val(), // 卡号
			bizcard_money: $('#dest_bizcard .form-control').eq(2).val(), // 报销金额
			userId : $('#userId').val(), 
			orgCode : $('#orgCode').val(),
		}
		dest_bizcard[`id${bizcardIndex}`] = dest_bizcard_obj
		summer.setStorage('dest_bizcard', JSON.stringify(dest_bizcard))
		$('#bizcardGroup .um-media-heading').eq(bizcardIndex).text('持卡人姓名：' + dest_bizcard_obj.userName)//传回收款方户名 
		$('#bizcardGroup .money-count').eq(bizcardIndex).text(dest_bizcard_obj.bizcard_money)//传回金额
		$('#bizcard .um-back').trigger('click')
		
		bizcards = 0 //记录公务卡所有记录总和
		for(var key in dest_bizcard) {//遍历删除后剩余的value的值  
			bizcards += Number(dest_bizcard[key].bizcard_money)//累加
		}
		$("#bizcardGroup .um-box-vc #bizcards").text(bizcards)//总和传回主页面
	})
	//公务卡存值			
	$('#bizcardGroup').on('click', '.um-listgroup-row', function( ) {
		bizcardIndex = $(this).index()
		console.log(bizcardIndex)
		$('#bizcard .form-control').val('')//清空缓存中公务卡明细的数据
		if(summer.getStorage('dest_bizcard')) {
			var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'))
			if(dest_bizcard[`id${bizcardIndex}`]) {
				var obj = dest_bizcard[`id${bizcardIndex}`]
				$('#bizcard .form-control').eq(0).val(obj.userName)
				$('#bizcard .form-control').eq(1).val(obj.cardNo)
				$('#bizcard .form-control').eq(2).val(obj.bizcard_money)
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
	        console.log(args)
	        var j = args.rowIndex //记录删除的ID值
	        if(summer.getStorage('dest_bizcard')) {//判断拿到的缓存是否有值
				
				delete dest_bizcard[`id${j}`]//删除对用的 value的值
				bizcards = 0 //重新定义报销明细总计的变量
				for(var key in dest_bizcard) {//遍历删除后剩余的value的值  
					bizcards += Number(dest_bizcard[key].bizcard_money)//累加
				}
				$("#bizcardGroup .um-box-vc #bizcards").text(bizcards)//总和传回主页面
				summer.setStorage('dest_bizcard', JSON.stringify(dest_bizcard));
			}
	    });
	});
	
	//用款申请单
	var paramStrselectApplyListByConditionList4Mobile = "CO_CODE=043001&BILL_TYPE=EXP_OUTLAY&ND=2019&APP_ID=dongsy";
	$.ajax({
		type : "get",
		async : false,
		url : "http://" + ip + "/FS/services/billService/selectApplyListByConditionList4Mobile?" + paramStrselectApplyListByConditionList4Mobile,
		error : function(data) {
			console.log(data);
		},
		success : function(data) {
			if (data.resultCode == "1") {
				var userData = data.rows;
				//console.log(data);
				console.log(userData);
				var html = '<option value="">请选择</option>'
				for (var i = 0; i < data.rows.length; i++) {
					console.log(data.rows[i].avaliableMoney);
				    if(0 != data.rows[i].avaliableMoney){
						html += `
							<option value="${data.rows[i].billId}">${data.rows[i].billNo}(${data.rows[i].reason})</option>
							`
				    }
				}
				$('#applyBillList').html(html)
				var opt = {
	    			'date': {
	    				preset: 'date'
	    			},
	    			'select': {
	    			   preset: 'select'
	    		   }
	    		};
	    		$('#applyBillList').scroller('destroy').scroller(
	    			$.extend(opt['select'], {
	    				theme: "ios7",
	    				mode: "scroller",
	    				display: "bottom",
	    				animate: "",
	    				onSelect: function(val, obj) {//公务卡下拉框确定按钮
	    					console.log(obj)
	    					var cardNo_select = obj.values[0];
	    					for (var i = 0; i < data.rows.length; i++) {
							    if(cardNo_select == data.rows[i].billId){//确定后 拿出卡号 对比得到对应的value
									//console.log(data.rows[i]);
									$('#usedMoney').val(data.rows[i].checkMoney)
									$('#avaliableMoney').val(data.rows[i].avaliableMoney)
									$('#billId').val(data.rows[i].billId)
									var dest_bill_obj = {
										billId: $('#billId').val(), // 需要回传至后台的 billId
									}
									dest_bill[`id${billIndex}`] = dest_bill_obj
									summer.setStorage('dest_bill', JSON.stringify(dest_bill))
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
	// 保存功能
	$('#approve').on('click',function(){
	//校验基本信息不能为空
		var orgCode = $("#orgCode").val() //报销部门
		var appId = $("#appId").val() //报销人
		var reason = $("#reason").val() //报销事由
		var ticketCount = $("#ticketCount").val() //票据张数
		if ('' == orgCode) {
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
		if(total != sumMoney){
			UM.alert('错误：报销明细总计与结算信息总计不相等');
			return;
		}
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
		var basic_data_obj = {
			billType : "EXP_OUTLAY",
			coCode : userInfo.coCode,
			coName : userInfo.coName,
			nd : userInfo.nd,
			orgCode : userInfo.orgCode,//报销部门
		    orgName : userInfo.orgName,
		    appId : userInfo.userId,//报销人
		    appName : userInfo.userName, 
			inputorName : userInfo.userName,
			reason : $("#basicMessage .form-control").eq(2).val(),//报销事由
			ticketCount : $("#basicMessage .form-control").eq(3).val(),//票据张数
			heji : $("#basicMessage .form-control").eq(4).val(),//合计
			remark : $("#basicMessage .form-control").eq(5).val(),//备注
			inputorId : userInfo.userId
			
		}
		
		params.firstzonelist = basic_data_obj
		params.firstzonelist.applyBillList = dest_bill_arr
		// 报销明细
		if(summer.getStorage('dest_detail')) {
			var dest_detail = JSON.parse(summer.getStorage('dest_detail'))
			var dest_detail_arr = []
			for(var key in dest_detail) {
				dest_detail_arr.push(dest_detail[key])
			}
		}
		
		params.thirdzonelist = dest_detail_arr
		
		// 结算信息 1.现金
		if(summer.getStorage('dest_cash')) {
			var dest_cash = JSON.parse(summer.getStorage('dest_cash'))
			var dest_cash_arr = []
			for(var key in dest_cash) {
				dest_cash_arr.push(dest_cash[key])
			}
		}
		
		//2.转账
		if(summer.getStorage('dest_transfer')) {
			var dest_transfer = JSON.parse(summer.getStorage('dest_transfer'))
			var dest_transfer_arr = []
			for(var key in dest_transfer) {
				dest_transfer_arr.push(dest_transfer[key])
			}
		}
		//3.公务卡
		if(summer.getStorage('dest_bizcard')){
			var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'))
			var dest_bizcard_arr = []
			for(var key in dest_bizcard) {
				dest_bizcard_arr.push(dest_bizcard[key])
			}
		}
		params.fouthzonelist = {}
		params.fouthzonelist.cash = dest_cash_arr
		params.fouthzonelist.transfer = dest_transfer_arr
		params.fouthzonelist.bizcard = dest_bizcard_arr
		console.log(params)
		var paa = JSON.stringify(params);
 		var datapaa = "datapaa=" + paa;
			
		$.ajax({
			type: 'POST',
			data: datapaa,
			url : "http://" + ip + "/FS/services/billService/arBillSave",
			dataType: 'json',
			success: function(res) {
				console.log(res)
				if(res.resultCode == "1"){
					var obj = res.rows.BILL_NO
					if(typeof obj == "undefined" || obj == null || obj == ""){
						UM.alert('保存成功')	
					}else{
						UM.alert('保存失败 ： 系统异常')						
					}
				}else{
					UM.alert('保存失败 ： 服务器异常')
				}
			},
			error: function(err) {
				console.log(err)
				UM.alert('保存出错：网络连接失败，请连接指定网络，或联系系统管理员。')
			}
		})
	})
	
	// 提交功能
	$('#backInput').on('click', function() {
		
		console.log($("#userid_biz").val())
		//校验基本信息不能为空
		var orgCode = $("#orgCode").val() //报销部门
		var appId = $("#appId").val() //报销人
		var reason = $("#reason").val() //报销事由
		var ticketCount = $("#ticketCount").val() //票据张数
		if ('' == orgCode) {
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
		if(total != sumMoney){
			UM.alert('错误：报销明细总计与结算信息总计不相等');
			return;
		}
		var params = {} //封装请求数据
		if(summer.getStorage('dest_bill')) {
			var dest_bill = JSON.parse(summer.getStorage('dest_bill'))
			var dest_bill_arr = []
			for(var key in dest_bill) {
				dest_bill_arr.push(dest_bill[key])
			}
		}
		//基本信息
		var basic_data_obj = {
			billType : "EXP_OUTLAY",
			coCode : userInfo.coCode,
			coName : userInfo.coName,
			nd : userInfo.nd,
			orgCode : userInfo.orgCode,//报销部门
		    orgName : userInfo.orgName,
		    appId : userInfo.userId,//报销人
		    appName : userInfo.userName, 
			inputorName : userInfo.userName,
			reason : $("#basicMessage .form-control").eq(2).val(),//报销事由
			ticketCount : $("#basicMessage .form-control").eq(3).val(),//票据张数
			heji : $("#basicMessage .form-control").eq(4).val(),//合计
			remark : $("#basicMessage .form-control").eq(5).val(),//备注
			inputorId : userInfo.userId
		}
		
		params.firstzonelist = basic_data_obj
		params.firstzonelist.applyBillList = dest_bill_arr
		// 报销明细
		if(summer.getStorage('dest_detail')) {
			var dest_detail = JSON.parse(summer.getStorage('dest_detail'))
			var dest_detail_arr = []
			for(var key in dest_detail) {
				dest_detail_arr.push(dest_detail[key])
			}
		}
		
		params.thirdzonelist = dest_detail_arr
		
		// 结算信息 1.现金
		if(summer.getStorage('dest_cash')) {
			var dest_cash = JSON.parse(summer.getStorage('dest_cash'))
			var dest_cash_arr = []
			for(var key in dest_cash) {
				dest_cash_arr.push(dest_cash[key])
			}
		}
		
		//2.转账
		if(summer.getStorage('dest_transfer')) {
			var dest_transfer = JSON.parse(summer.getStorage('dest_transfer'))
			var dest_transfer_arr = []
			for(var key in dest_transfer) {
				dest_transfer_arr.push(dest_transfer[key])
			}
		}
		//3.公务卡
		if(summer.getStorage('dest_bizcard')){
			var dest_bizcard = JSON.parse(summer.getStorage('dest_bizcard'))
			var dest_bizcard_arr = []
			for(var key in dest_bizcard) {
				dest_bizcard_arr.push(dest_bizcard[key])
			}
		}
		params.fouthzonelist = {}
		params.fouthzonelist.cash = dest_cash_arr
		params.fouthzonelist.transfer = dest_transfer_arr
		params.fouthzonelist.bizcard = dest_bizcard_arr
		console.log(params)
		var paa = JSON.stringify(params);
 		var datapaa = "datapaa=" + paa;
			
		$.ajax({
			type: 'POST',
			data: datapaa,
			url : "http://" + ip + "/FS/services/billService/arBillSaveAndAudit",
			dataType: 'json',
			success: function(res) {
				console.log(res)
				if(res.resultCode == "1"){
					var obj = res.rows.BILL_NO
					if(typeof obj == "undefined" || obj == null || obj == ""){
						UM.alert('提交成功')	
					}else{
						UM.alert('提交失败 ： 系统异常')						
					}
				}else{
					UM.alert('提交失败 ： 服务器异常')
				}
				
			},
			error: function(err) {
				console.log(err)
				UM.alert('提交失败')
			}
		})
	})	

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

