//选择新增的报销单/申请单类型
createScript("./js/components/common/nav.js")
var newBills = `
<div class="bill">
    <navBar :title='title'></navBar>
    <div class="section billType-content">
      <div class="billType-cell" v-for='(item,index) in list' :key='index' >
        <van-cell  :title="item.name" is-link :to="{  path: item.parentCode =='EXPENSE'? '/reimburse' : '/application' ,query:{billType:item.code,pageType:pageType,name:item.name} }" />
        <div class='leftTitle'>{{item.name}}</div>
      </div>
      <!--<router-link  v-for="(item,index) in list" :key="index"
         :to="{  path: item.parentCode =='EXPENSE'? '/reimburse' : '/application' ,query:{billType:item.code,pageType:pageType,name:item.name} }" class="typeList" tag="div">
          <div> 
             
              <span> {{item.name}}</span>
           </div>
        </router-link> -->
    </div>
</div>

`
var newBills = Vue.component("newBills", {
   template: newBills,
   data() {
      return {
         title: "单据类型",
         pageType: 'new',

         list: [
            // { title: "差旅费报销单", billType: "EXP_TRIP", img: "../img/toDo.png" },
            // { title: "车辆维修报销单", billType: "EXP_TRAFFIC", img: "../img/ckhs.png" },
            // { title: "个人经费报销单", billType: "EXP_OUTLAY_GR", img: "../img/sjqk.png" },
            // { title: "项目经费报销单", billType: "EXP_OUTLAY", img: "../img/zfcg.png" }
         ]
      }
   },
   created() {
      const billType = this.$route.query.type
      const B_TYPE = this.$route.query.B_TYPE
      const that = this
      let wid = px2rem(60) + "rem"
      let hei = px2rem(80) + "rem"
      let fsize = px2rem(16) + "rem"
      this.$nextTick(() => {
         $(".typeList").css({ 'width': wid, 'height': hei, "font-size": fsize })
         var paramStr = `CO_CODE=101&B_TYPE=${B_TYPE}`
         //var paramStr = "CO_CODE=101&B_TYPE=APPLY";
         $.ajax({
            type: "get",
            async: false,
            url: "http://10.10.66.8:9899/FS/services/billService/getBillTypeList_publicCommon?" + paramStr,
            error: function (data) {
               console.log(data);
            },
            success: function (data) {
               if (data.resultCode == "1") {
                  const res = data.rows;
                  for(var i = 0 ; i < res.length ; i++){
                       that.list.push(JSON.parse(res[i]))
                  }
                  console.log(data);  
               } else {
                  alert(data.rows);
               }
            }
         })
      })

   }
})