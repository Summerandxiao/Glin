//新建报销单页面
var newReim = `
   <div>
   <navBar :title="title"></navBar>
   <div style="font-size:0.01rem">新增报销单页面</div>
</div>

`
var newReim = Vue.component("newReim",{
    template:newReim,
    data(){
        return{
            title:"新增报销单页面"
        }
    }
})