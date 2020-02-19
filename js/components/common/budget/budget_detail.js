// y预算指标详细信息(同结算方式详情页)
var budgetDetail = `
<div>
    <navBar :title='title'></navBar>
    
</div>

`
var budgetDetail = Vue.component("budgetDetail",{
     template:budgetDetail,
     data(){
         return{
            title:"预算指标",
           
         }
     }
})