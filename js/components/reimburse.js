/**
 * @description 报销单页面组件
 * pageType: new-新建，edit-编辑
 * billType: 单据类型 
 */

createScript("../js/components/common/nav.js")
createScript("../js/components/common/base_info.js")
createScript("../js/components/common/loan/loan.js")
createScript("../js/components/common/detailOfCharge/index.js")
createScript("../js/components/common/settlement/index.js")
createScript("../js/components/common/fileList/index.js")
var reimburse = `
    <div class="bill">
        <navBar :title="title"></navBar>
        <div class="section">
            <baseInfo :infoList="list.baseRemlist"></baseInfo>
            <!--请款信息-->
            <loan></loan>
            <!--借款信息-->
            <loan></loan>
            <deatil-of-charge></deatil-of-charge>
            <settlement></settlement>
            <fileList></fileList>
        </div>
        <van-button v-if="pageType == 'new'" class="confrimBtn" type="info" >保存</van-button>
        <div v-else class="flex footer" style="align-items:center">
           <van-button v-for="(item,index) in btnList" 
             :key="index" 
             class="editBtn" 
             plain 
             type="info" 
             >
             {{item.name}}
             </van-button>
        </div>
    </div>

`
var reimburse = Vue.component("reimburse",{
    template:reimburse,
    data(){
        return{
            title:"",
            list:[],
            pageType:'',
            btnList:[{name:"修改"},{name:"保存"},{name:"提交"},{name:"删除"}]
        }
    },
    mounted(){
        const type = this.$route.query.type
        const pageType = this.$route.query.pageType
        console.log(type,pageType)
        this.pageType = pageType
        const url = `http://rap2api.taobao.org/app/mock/241527/${type}`
        console.log(url)
        const that = this
       this.$nextTick(()=>{
               $.getJSON(url,function(res){
                   console.log(res)
                  that.list = res.officialdata.reimlist
                   that.title = res.officialdata.title
                  console.log(res)
               })
               
            })
        
          
     }
})