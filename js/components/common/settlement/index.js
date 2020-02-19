/**
 * @author 王德雷
 * @description 结算组件
 */


const settlement = Vue.component('settlement', {
   template: `
           <div class="detail settlement">
            <van-cell :value="title" />
            <van-cell title="转账" value="￥39.00" is-link to="/settlementDetails" /> 
            <router-link :to="{path:'/settlemetMethod'}" tag="div" class="increaseBtn">
                    <div> 
                    <i class="iconfont icon-tianjia"></i><span> 新增{{title}}</span>
                    </div>
            </router-link>
            <div class="total">
                <span>合计：</span>
                <span>￥929928</span>
            </div> 
           </div>
           
       `,

   data() {
       return {
           title: '结算信息',
           billList: [],
           amount: 919123
       }
   },
   created() {
      
   }
})