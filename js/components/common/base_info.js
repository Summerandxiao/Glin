//基本信息

var baseinfomation=` 
<div class='detail' v-if="infoList">
      <van-cell :value="blockTitle" />
         <!-- dataType=12 下拉框选项 -->
        <div class="detail-items ">
          <div class="van-cell__title van-field__label">
            <span style="color: red">*</span>
            <span >报销部门</span>
          </div>
          <div style="position: relative ">
            <input class="detail-input" placeholder="请选择报销部门"
              v-model="value"
              @focus="focusOrg"
              @blur="blurOrg($event)"
              >
            <div class="pay-account" v-if="ifShowOrg">
              <!--实现部门可编辑可筛选-->
              <div v-for="item in departOrg" :key="item.sourceCode" class="account-name" @touchstart="chooseDepart(item)">{{item.sourceName}}</div>
            </div>
          </div>
        </div>
        <van-field class="field-name" required label="报销人" value="董鼠应" readonly  />
        <van-field class="field-name" v-model="starttime" clearable label="出发时间" placeholder="请选择时间" @focus="start" />
        <van-field class="field-name" v-model="endtime" clearable label="结束时间" placeholder="请选择时间" @focus="end" />
        <van-field class="field-name" v-model="text" label="报销事由" placeholder="请输入报销事由" /> 
        <!--预算指标-->
        <van-collapse v-model="activeNames">
          <van-collapse-item title="预算指标" name="2" :value="budget">
            <van-cell  v-if="budgetList" v-for="(item,index) in  budgetList" 
             :key="index" :title="item.itemName" :value="item.totalMoney"
              is-link to="settlementDetails" />
             <div class="detail-items "> 
             <van-button type="info" @click="choseBudget">选择预算指标</van-button>
             </div>
          </van-collapse-item>
        </van-collapse>

            <!--开始时间-->
             <van-popup v-model="show" position="bottom":style="{ height: '30%' }">
                <van-datetime-picker
                    v-model="currentStartDate"
                    type="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="startConfirm"
                    @cancel="startCancel"
                />
             </van-popup>
             <!--结束时间-->
             <van-popup v-model="show1" position="bottom" :style="{ height: '30%' }">
              <van-datetime-picker
               v-model="currentEndDate"
               type="date"
               :min-date="minDate"
               :max-date="maxDate"
               @confirm="endConfirm"
               @cancel="endCancel"
             />
           </van-popup>     
      

</div>` 
var baseInfo = Vue.component("baseInfo",{
    template:baseinfomation,
    props:["infoList"],
    data(){
        return{
            activeNames: ['1'],
            ifShowOrg: false, // 是否显示报销部门列表
            blockTitle:"基本信息",
            text: '',
            //选择时间
            show: false,
            show1: false,
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentStartDate: new Date(),
            currentEndDate: new Date(),
            starttime: "",
            endtime:'',
            //baseFormData:,
            username:'',
             value:"",
             departOrg:[
               {sourceName:"企划部",sourceCode:2019045486} ,
               {sourceName:"财务部",sourceCode:2019433994},
               {sourceName:"服务部",sourceCode:2019239499},
               {sourceName:"产品部",sourceCode:2019348843}
              ], //部门列表
             //     预算指标相关   
             budget:'0.00',
             budgetList:[]
            
        }
    },
    created(){
        //查看预算指标
        var budgetChecked = JSON.parse(localStorage.getItem('targetChecked'))
        if(budgetChecked){
          this.budgetList.push(budgetChecked) 
          this.budget =  budgetChecked.totalMoney
        }
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
        endConfirm() {
           this.show1 = false;
           let date =  this.currentEndDate
           this.endtime= date.getFullYear() +
           "/" +
           (Number(date.getMonth()) + 1) +
           "/" +
           date.getDate()
            
          },
          startConfirm() {
            this.show = false;
            let date =  this.currentStartDate
            this.starttime= date.getFullYear() +
            "/" +
            (Number(date.getMonth()) + 1) +
            "/" +
            date.getDate()
             
           },
          // 点击取消
          startCancel() {
            this.show = false;
          },
          endCancel() {
            this.show1 = false;
          },
          start() {
            this.show = true;
          },
          end(){
            this.show1 = true;
          }
    }

})
