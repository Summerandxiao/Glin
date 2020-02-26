// y预算指标选择项目
var budgetItem = `
<div>
    <navBar :title='title'></navBar>
    <van-cell v-for="(item,index) in itemList" :key="index" 
    :title="item.itemName" is-link :to="{path:'/budgetList',query:{code:item.itemId} }" /> 
</div>

`
var budgetItem = Vue.component("budgetItem",{
     template:budgetItem,
     data(){
         return{
            title:"选择项目",
            itemList:[
                {itemName:"项目一",itemId:'1'},
                {itemName:"项目二",itemId:'2'},
                {itemName:"项目三",itemId:'3'},
                {itemName:"项目四",itemId:'4'}
            ]
         }
     }
})