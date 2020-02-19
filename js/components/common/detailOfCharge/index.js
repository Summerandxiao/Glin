// 费用明细项
var deatilOfCharge = `
<div class="detail">
    <van-cell :title="blockTitle" :value="detailCharge"/>
    <router-link :to="{path:'/chargeList'}" tag="div" class="increaseBtn">
      <div> 
        <i class="iconfont icon-tianjia"></i><span> 新增{{blockTitle}}</span>
      </div>
    </router-link>
   
</div>

`
var deatilOfCharge = Vue.component("deatilOfCharge",{
     template:deatilOfCharge,
     data(){
         return{
            blockTitle:"费用明细",
            detailCharge:'0.00',
         }
     }
})