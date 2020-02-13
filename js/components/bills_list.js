//报销单/申请单列表
var billList = `
<div>
    <navBar :title="title"></navBar>
    <div style="font-size:0.01rem">{{listName}}</div>
    <router-link :to="{path:'/newBills',query:{type:listType} }" tag="div" class="increaseBtn">
      <div> 
        <i class="iconfont icon-tianjia"></i><span> {{increase}}</span>
      </div>
    </router-link>
</div>

`
var billList = Vue.component("billList",{
     template:billList,
     data(){
         return{
             title:"报销单",
             increase:"新增报销单",
             listType:'reim',
             listName:"报销单列表"
         }
     },
     created(){
         let billType = this.$route.query.type
         this.listType = billType
         if(billType=="apply"){
           this.increase = "新增申请单"
           this.title = "申请单"
           this.listName = "申请单列表"
         }
         let hei = px2rem(50)+"rem"
         let fsize =  px2rem(16)+"rem"
         this.$nextTick(()=>{
            $(".increaseBtn").css({
                'height':hei,
                'position':'fixed',
                "bottom":"0px",
                "font-size":fsize,
                "line-height":hei
            })
            
         })
     }
})