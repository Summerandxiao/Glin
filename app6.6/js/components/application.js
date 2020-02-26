/**
 * @description 请款单单页面组件
 * pageType: new-新建，edit-编辑
 * billType: 单据类型
 */
var application = `
   <div class="bill">
        <navBar :title="title"></navBar>
        <div class="section">
            <baseInfo :firstzoneMap="list.firstzoneMap"></baseInfo>
            <deatil-of-charge :thirdzoneMap="list.thirdzoneMap"></deatil-of-charge>
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
var application = Vue.component("application",{
    template:application,
    data(){
        return{
            title:"请款单页面",
            pageType:'',
            list:[],
            btnList:[{name:"修改"},{name:"保存"},{name:"提交"},{name:"删除"}]
        }
    },
    mounted(){
        const billType = this.$route.query.billType
        this.pageType = this.$route.query.pageType
        console.log(this.pageType)
        this.title = this.$route.query.name
        if (summer.getStorage('rows')||summer.getStorage('expense_List')) {
            // 在保存成功和返回上一页的时候需清除
            summer.rmStorage('rows')
            summer.rmStorage('expense_List')
        }

        const param = `CO_CODE=101&BILL_TYPE=${billType}&ND=2019`
        const url = `http://10.10.66.8:9899/FS/services/billService/getArInfoList?${param}`
        console.log(url)
        const that = this
        this.$nextTick(() => {
            $.ajax({
                type: "get",
                async: false,
                url: url,
                error: function (data) {
                    console.log(data);
                },
                success: function (data) {
                    if (data.resultCode == "1") {
                        that.list = data.rows;
                        console.log(data);
                        summer.setStorage('rows', JSON.stringify(data.rows))
                    } else {
                        alert(data.rows);
                    }
                }
            })
        })
        console.log(this)


        
          
     }
})