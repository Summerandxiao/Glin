createScript("../js/components/common/budget.js")
createScript("../js/components/common/base_info.js")
createScript("../js/components/choose_billlist.js")
createScript("../js/components/bills_list.js")
createScript("../js/components/reimburse_new.js")
createScript("../js/components/new_bills.js")
createScript("../js/components/application_new.js")

var router = new VueRouter({
    routes:[{
        name:"chooseBills",
        path:"/",
        component:chooseBills,
          },
        {
          name:"billList",
          path:"/billList",
         component:billList
        },
        {
          name:"newBills",
          path:"/newBills",
         component:newBills
         },
         {
          name:"newReim",
          path:"/newReim",
         component:newReim
         },
         {
          name:"newApply",
          path:"/newApply",
         component:newApply
         },
         
         {
          name:"budget",
          path:"/budget",
         component:budget
         }
    ]
})
new Vue({
    el:"#app",
    router

})