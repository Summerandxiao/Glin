
//获取页面url
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	var r = window.location.search.substr(1).match(reg);
   if (r!=null) return (r[2]); 
   else return null;
 }
 function back(){
	window.history.go(-1)
 }
 //js保留两位小数，自动补充零
 function returnFloat(value){
	var value=Math.round(parseFloat(value)*100)/100;
	var xsd=value.toString().split(".");
	if(xsd.length==1){
	value=value.toString()+".00";
	return value;
	}
	if(xsd.length>1){
	if(xsd[1].length<2){
	value=value.toString()+"0";
	}
	return value;
	}
   }

