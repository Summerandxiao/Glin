//新建请款单页面
var newApply = `
   <div>
   <navBar :title="title"></navBar>
   <div style="font-size:0.01rem">新增请款单页面</div>
</div>

`
var newApply = Vue.component("newApply",{
    template:newApply,
    data(){
        return{
            title:"新增请款单页面"
        }
    }
})