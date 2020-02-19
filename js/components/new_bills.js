//选择新增的报销单/申请单类型
createScript("../js/components/common/nav.js")
var newBills = `
<div class="bill">
    <navBar :title='title'></navBar>
    <div class="flex section">
       <router-link  v-for="(item,index) in list" :key="index"
         :to="{  path: kind=='reim'? '/reimburse' : '/application' ,query:{type:item.type,kind:kind,pageType:pageType} }" class="typeList" tag="div">
          <div> 
              <img :src="item.img"></i>
              <span> {{item.title}}</span>
           </div>
        </router-link>
    </div>
</div>

`
var newBills = Vue.component("newBills",{
     template:newBills,
     data(){
         return{
             title:"单据类型",
             kind:"reim",
             pageType:'new',
             list:[
                {title:"差旅费报销单",type:"travel",img:"../img/toDo.png"},
                {title:"车辆维修报销单",type:"car",img:"../img/ckhs.png"},
                {title:"个人经费报销单",type:"personal",img:"../img/sjqk.png"},
                {title:"项目经费报销单",type:"item",img:"../img/zfcg.png"}
             ]
         }
     },
     created(){
          let billType = this.$route.query.type
          this.kind = billType
          console.log(this)
          if(billType == "apply"){
             this.list=[
                {title:"差旅费申请单",type:"travel",img:"../img/toDo.png"},
                {title:"车辆维修申请单",type:"car",img:"../img/ckhs.png"},
                {title:"个人经费申请单",type:"personal",img:"../img/sjqk.png"},
                {title:"项目经费申请单",type:"item",img:"../img/zfcg.png"}
             ]
          }
          console.log(this)
          let wid = px2rem(60)+"rem"
          let hei = px2rem(80)+"rem"
          let fsize =  px2rem(16)+"rem"
          this.$nextTick(()=>{
              $(".typeList").css({'width':wid,'height':hei,"font-size":fsize})
              
           })
        
     }
})