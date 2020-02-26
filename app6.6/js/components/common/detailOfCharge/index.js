// 费用明细项
var deatilOfCharge = `
<div class="detail" v-if="thirdzoneMap">
    <van-cell :title="thirdzoneMap.name"/>
    <van-swipe-cell>
      <van-cell v-for="(item,index) in expense_ListArray"  :key="index"
          :title="thirdzoneMap.name" 
          :value=" '￥'+ item.money "
          is-link :to="{ path :'/chargeList' , query : { type :'check' ,index : index} }" />
      <van-button slot="right" square text="删除" type="danger" class="delete-button" @click="delCharge(index)"/>
    </van-swipe-cell>
    
    <router-link :to="{ path :'/chargeList' , query : { type :'new' } }" tag="div" class="increaseBtn">
      <div> 
        <i class="iconfont icon-tianjia"></i><span> 新增{{thirdzoneMap.name}}</span>
      </div>
    </router-link>
    <div class="total">
      <span>合计：</span>
      <span class="totalMoney ">￥{{total | parseToThousandth}}</span>
   </div>
</div>

`
var deatilOfCharge = Vue.component("deatilOfCharge",{
     props:["thirdzoneMap"],
     template:deatilOfCharge,
     data(){
         return{
            blockTitle:"费用明细",
            total: 0,
            expense_ListArray:[]
         }
     },
     created(){
       console.log(this)
       const expense_List = summer.getStorage("expense_List")
         if(expense_List){
             this.expense_ListArray = JSON.parse(expense_List)
             this.expense_ListArray.forEach(  item => 
                    this.total += item.money
             )
         }
     },
     methods:{
      delCharge(index){
        this.$dialog.confirm({
              message: '确定删除吗？'
          }).then(() => {
              this.expense_ListArray.splice(index, 1)
              summer.setStorage("expense_List",JSON.stringify(this.expense_ListArray))
            //  console.log(this)
          }).catch(() => {
              // on cancel
          })
      }
     }
})