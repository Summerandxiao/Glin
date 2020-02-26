//基本信息
createScript("./js/components/common/loan/loan.js")
createScript("./js/components/common/fileList/index.js")
var baseinfomation=` 
<div class='detail' v-if="firstzoneMap">
  <van-cell :value="firstzoneMap.name" />
  <!--固定项-->
  <div v-for="(item,index) in firstzoneMap.firstzonelist" :key="index">
      <div v-if="item.fieldType == 'text' ">
          <!--必填项 -->
          <van-field class="field-name" v-model="baseInfoModel.gdList[index].org" v-if="item.isNotEmpty === 'Y' || !item.isNotEmpty" required :label="item.infoName"
              :placeholder="'请输入'+item.infoName" />
          <van-field class="field-name" v-model="baseInfoModel.gdList[index].org" v-else :label="item.infoName" :placeholder="'请输入'+item.infoName" />
      </div>
  </div>
  <!--配置项-->
  <div v-if="firstzoneMap.firstzone_pzlist" v-for="(item,index) in firstzoneMap.firstzone_pzlist" :key="index">
      <div v-if="item.fieldType == 'text' ">
          <div v-if="item.infoId.indexOf('uploadF') == 0" >
              <fileList  :fileInfo="{
                item:item,
                org:baseInfoModel.pzList[index].org
                }"></fileList> 
          </div>
          <div v-else>
            <!--必填项-->
            <van-field class="field-name" v-model="baseInfoModel.pzList[index].org"  v-if="item.isNotEmpty == 'Y' " required :label="item.infoName"
                :placeholder="'请输入'+item.infoName" />
            <van-field class="field-name"  v-model="baseInfoModel.pzList[index].org" v-else :label="item.infoName" :placeholder="'请输入'+item.infoName" />
          </div>
        </div>
      <div v-else-if=" item.fieldType == 'combox' " >
          <combox v-on:getValue="getComboxValue($event,baseInfoModel.pzList[index])" :comboxInfo="{
                        item:item,
                        org:baseInfoModel.pzList[index].org
                        }
          "></combox>
      </div>
      <!--预算指标-->
     <van-collapse v-if="item.infoId.indexOf('BUDGET') == 0" v-model="activeNames">
        <van-collapse-item title="预算指标" name="2" :value="budget">
            <van-cell  v-if="budgetList" v-for="(item,index) in  budgetList" 
             :key="index" :title="item.itemName" :value="item.totalMoney"
              is-link to="settlementDetails" />
             <div class="detail-items "> 
             <van-button type="info" @click="choseBudget">选择预算指标</van-button>
             </div>
          </van-collapse-item>
        </van-collapse>
        <!--请款信息-->
        <div v-else-if="item.infoId.indexOf('APP') == 0" >
            <loan :loanInfo="{
              item:item,
              org:baseInfoModel.pzList[index].org
              }"
              :list="appList"></loan>
        </div>
        <!--借款信息-->
        <div v-else-if="item.infoId.indexOf('LOAN') == 0" >
          <loan :loanInfo="{
            item:item,
            org:baseInfoModel.pzList[index].org
            }"
            :list="loanList"></loan>
        </div>
        <!--附件信息
        <div v-else-if="item.infoId.indexOf('uploadF') == 0" >
           <fileList  :fileInfo="{
            item:item,
            org:baseInfoModel.pzList[index].org
            }"></fileList>--> 
        </div>
  </div>

</div>` 
var baseInfo = Vue.component("baseInfo",{
    template:baseinfomation,
    props:["firstzoneMap"],
    data(){
        return{
            activeNames: ['1'],
            ifShowOrg: false, // 是否显示报销部门列表
            text: '',
            baseInfoModel:{  //van-field的v-model
              gdList:[],
              pzList:[]
            },
            //baseFormData:,
            username:'',
           
             //     预算指标相关   
             budget:'0.00',
             budgetList:[],
             expenseList:[],
             appList: [],
             loanList: []
        }
    },
    created(){
        //查看预算指标
        var budgetChecked = JSON.parse(localStorage.getItem('targetChecked'))
        if(budgetChecked){
          this.budgetList.push(budgetChecked) 
          this.budget =  budgetChecked.totalMoney
        }
        if (summer.getStorage('appCheckedList')) {
            this.appList = JSON.parse(summer.getStorage('appCheckedList'))
        } else if (summer.getStorage('loanCheckedList')) {
            this.loanList = JSON.parse(summer.getStorage('loanCheckedList'))
        }
       
        if (summer.getStorage('baseInfoModel')) {
           this.baseInfoModel = JSON.parse(summer.getStorage('baseInfoModel'))
        }
      
    },
    updated(){
      summer.setStorage('baseInfoModel',JSON.stringify( this.baseInfoModel))
    },
    methods: {
     //预算指标相关
     choseBudget(){
        this.$router.push({path:"/budgetItem"})
     },
      focusOrg () {
        this.ifShowOrg = true
      },
      blurOrg (e) {
        this.ifShowOrg = false
      },
      inputOrg () {
        this.ifShowOrg = true
      },
      chooseDepart (item) {
        this.value = item.sourceName
       // this.change(item.sourceCode)
       
      },
      change (rgCode) {
      },
      //获取combox取到的值
      getComboxValue($event,pzOrg){
        pzOrg.org = $event
     }
        
    },
    watch: {
        "firstzoneMap": function (val) {
            for (var i = 0; i < val.firstzonelist.length; i++) {
                this.baseInfoModel.gdList.push({
                    org: '',
                    infoName: val.firstzonelist[i].infoName,
                    infoId: val.firstzonelist[i].infoId,
                    isNotEmpty: val.firstzonelist[i].isNotEmpty
                })
            }
            for (var j = 0; j < val.firstzone_pzlist.length; j++) {
                this.baseInfoModel.pzList.push({
                    org: '',
                    infoName: val.firstzone_pzlist[j].infoName,
                    infoId: val.firstzone_pzlist[j].infoId,
                    show_Area: val.firstzone_pzlist[j].show_Area,
                    isNotEmpty: val.firstzonelist[j].isNotEmpty
                })
            }}
        // }
    
    }
})
