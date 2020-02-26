var util = {
	getFirstMonthByNd : function(nd) {
		var yearMonth = nd + "-01";
		return yearMonth;
	},
	getLastMonthByNd : function(nd) {
		var yearMonth = nd + "-12";
		return yearMonth;
	},
	getCurrentSDate : function(type) {
		//默认开始时间当月第一天,结束时间当月最后一天
		var mydate = new Date();
		var year = new Date().getFullYear();
		var month = new Date().getMonth() + 1;

		var date = new Date();
		var curMonthDays = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
		var curMonthFirstDay = year + '-' + month;
		//当月第一天
		var curMonthLastDay = year + '-' + month;
		//当月最后一天
		return type == 'first' ? curMonthFirstDay : curMonthLastDay;
	},
	//获得当前日期上几个月index
	getSLastMonthYestdy : function(date, index) {
		var strYear = date.getFullYear();
		var strMonth = date.getMonth() + 1;
		if (strMonth - index <= 0) {
			strYear -= 1;
			strMonth = 12 - index + strMonth;
		} else {
			strMonth -= index;
		}
		datastr = strYear + '-' + strMonth;
		return datastr;
	},
	/**
	 * 获得当前日期
	 * @returns {String} 当前年、月、日的字符串 如‘2017-04-01’
	 */
	getCurrentDay : function() {
		var mydate = new Date();
		var year = mydate.getFullYear();
		var month = mydate.getMonth() + 1;
		var day = mydate.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		return year + '-' + month + '-' + day;
	},
	/**
	 * 获得起始日期
	 * @returns {String} 起始年、月、日的字符串 如‘2017-04-01’
	 */
	getStartDay : function(month) {
		var ndate = new Date();
        ndate.setMonth(ndate.getMonth() - month);
       
        var year = ndate.getFullYear();
		var month = ndate.getMonth() + 1;
		var day = ndate.getDate();
        
		if(month<10){
			month='0'+month;
		}
		if(day<10){
			day='0'+day;
		}
		return year + '-' + month + '-' + day;
	},
	changeTwoDecimal : function(money) {
		if (isNaN(money)) {
			return 0;
		}
		var f_x = parseFloat(money);
		var f_x = Math.round(money * 100) / 100;
		var s_x = f_x.toString();
		var pos_decimal = s_x.indexOf('.');
		if (pos_decimal < 0) {
			pos_decimal = s_x.length;
			s_x += '.';
		}
		while (s_x.length <= pos_decimal + 2) {
			s_x += '0';
		}
		return s_x;
	}
}

