//选择进入报销单或申请单列表
createScript("../js/components/common/nav.js")
var bills = `
<div class="bill">
    <navBar :title="title"></navBar>
    <div class="flex section">
    <router-link style="font-size:0.01rem" 
    v-for="(item,index) in list" tag="div"  
    :key="index"  class="typeList"  :to="{path:'/billList',query:{type:item.type}}">
       <img :src="item.img"/>  
       <span>{{item.name}}</span>
    </router-link>
    </div>
    </div>
`
var chooseBills = Vue.component("chooseBills",{
    template:bills,
    data(){
        return{
            title:"选择单据列表",
            list:[
                {
                name:"我的申请单",
                type:"apply",
                img:"../img/qkd.png"
                },
               {
                name:"我的报销单",
                type:"reim",
                img:'../img/bxd.png'
            }]
        }
    },
    created(){
        let wid = px2rem(60)+"rem"
        let hei = px2rem(80)+"rem"
        this.$nextTick(()=>{
            $(".typeList").css({'width':wid,'height':hei})
         })
         
        
    },
    methods:{
        
    }
})