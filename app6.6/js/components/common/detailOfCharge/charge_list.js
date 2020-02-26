// 费用明细项  type:new 填写明细 check:查看详情页
createScript("./js/components/common/nav.js")
createScript("./js/components/common/combox.js")
var chargeList = `
<div class="bill">
   <navBar :title="chargeList.name"></navBar>
   <div class="section">
   <!--固定项-->
      <div v-for="(item,index) in chargeGDlist" :key="index">
         <van-collapse v-if="item.childrenList " v-model="activeNames">
               <van-collapse-item :title="item.infoName" :name="index">
                  <div v-for="(name,i) in item.childrenList" :key="i">
                     <van-field v-if="name.isNotEmpty"  v-model="chargeListModel.gdList[index].children[i].org"  :label="name.infoName" 
                        :placeholder="'请输入'+name.infoName"  required/>
                     <van-field v-else v-model="chargeListModel.gdList[index].children[i].org"   :label="name.infoName" 
                        :placeholder="'请输入'+name.infoName" />
                  </div>
               </van-collapse-item>
         </van-collapse>
      </div>
   <!--配置项-->
     <div v-for="(item,index) in chargeList.thirdzone_pzlist" :key="index">
          <div v-if=" item.fieldType == 'date' " >
               <van-field v-if="item.isNotEmpty == 'Y' " v-model="chargeListModel.pzList[index].org" :label="item.infoName" 
               :placeholder="'请输入'+item.infoName" required/>
               <van-field  v-model="chargeListModel.pzList[index].org"  v-else :label="item.infoName" 
               :placeholder="'请输入'+item.infoName" />
         </div>
         <div v-else-if=" item.fieldType == 'combox' " >
               <combox  v-on:getValue="getComboxValue($event,chargeListModel.pzList[index])" :comboxInfo="{
                              item:item,
                              org:chargeListModel.pzList[index].org
                              }
               "></combox>
         </div>
         <div v-else-if=" item.fieldType == 'mulcombox' " >
               <van-field  :label="item.infoName"  v-model="chargeListModel.pzList[index].org"
               :placeholder="'请输入'+item.infoName" />
         </div>
         <div v-else-if=" item.fieldType == 'tree' " >
               <van-field  :label="item.infoName"  v-model="chargeListModel.pzList[index].org"
               :placeholder="'请输入'+item.infoName" />
         </div>
         <div v-else >
            <van-field  v-model="chargeListModel.pzList[index].org"  v-if="item.isNotEmpty == 'Y' " :label="item.infoName" 
            :placeholder="'请输入'+item.infoName"  required/>
            <van-field  v-model="chargeListModel.pzList[index].org"  v-else :label="item.infoName" 
            :placeholder="'请输入'+item.infoName"  required/>
         </div>
     </div>
     
     
      
   </div>
   <van-button type="info" @click="conserve">保存</van-button>
   <!--   <div v-else>
   <van-field ref="choseCity" v-if="item.type== 'city' " 
      v-model="item.org" 
      :label="item.title" 
      :placeholder="'请选择'+item.title" 
      @focus="choseCity"/>
   <van-field  v-else 
      v-model="item.org" 
      :label="item.title" 
      :placeholder="'请输入'+item.title" 
      @focus="choseCity"/>
</div>-->
    <!--选择城市-->
    <van-popup v-model="show" position="bottom">        
    <van-area :area-list="areaList" ref="myArea"  
    @cancel="onCancel"
    @confirm="onConfirm"
    @change="onChange"/>    
 </van-popup>
   <!-- 选择时间
   <van-field class="field-name" v-model="starttime" clearable label="出发时间" placeholder="请选择时间" @focus="start" />
   <van-field class="field-name" v-model="endtime" clearable label="结束时间" placeholder="请选择时间" @focus="end" />
   -->
   <!--开始时间-->
   <van-popup v-model="showStartTime" position="bottom":style="{ height: '30%' }">
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
   <van-popup v-model="showEndTime" position="bottom" :style="{ height: '30%' }">
   <van-datetime-picker
      v-model="currentEndDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="endConfirm"
      @cancel="endCancel"
   />
</van-popup> 
   
</div>

`
var chargeList = Vue.component("chargeList", {
   template: chargeList,
   data() {
      return {
         activeNames: ['1'],
         type:'new',
         index:0,
         chargeGDlist: [],
         chargeList: {},
         chargeListModel: {  //van-field的v-model
            gdList: [],
            pzList: []
         },
         show: false,  //遮罩层显示或隐藏
         areaList: {
            province_list: {
               110000: '北京市',
               120000: '天津市'
            },
            city_list: {
               110100: '北京市',
               120100: '天津市',
            },
            county_list: {
               110101: '东城区',
               110102: '西城区',
               110105: '朝阳区',
               110119: '延庆区',
               120101: '和平区',
               120102: '河东区',
               120103: '河西区',
               120104: '南开区'
            }

         },      //自定义数据三级结构
         checkCity: '',
         //选择时间
         showStartTime: false,
         showEndTime: false,
         minDate: new Date(2020, 0, 1),
         maxDate: new Date(2025, 10, 1),
         currentStartDate: new Date(),
         currentEndDate: new Date(),
         starttime: "",
         endtime: '',
         chargeValue: [],
         chargeMoney: [],
         expense_List: []
      }
   },
   mounted() {
      this.type = this.$route.query.type
      this.index = this.$route.query.index
      if (summer.getStorage("expense_List")) {
         this.expense_List = JSON.parse(summer.getStorage("expense_List"))
      }
      let charge = JSON.parse(summer.getStorage("rows")).thirdzoneMap
      this.chargeList = charge
      let thirdzonelist = charge.thirdzonelist
      let thirdzone_pzlist = charge.thirdzone_pzlist
      let gdListArray = []
      this.chargeGDlist = this.pinzhuangList(thirdzonelist, gdListArray)
      console.log(this.type)
      if (this.type == "new") {
         console.log(this.chargeGDlist)
         this.chargeGDlist.forEach((item, index, array) => {
            this.chargeListModel.gdList.push({ children: [] })
            console.log(this.chargeListModel.gdList)
            item.childrenList.forEach(a =>
               this.chargeListModel.gdList[index].children.push({ org: '', infoId: a.infoId })
            )
         })
         this.chargeList.thirdzone_pzlist.forEach(item =>
            this.chargeListModel.pzList.push({ org: '', infoId: item.infoId })
         )
      } else {
         this.chargeListModel = this.expense_List[this.index].value[0]
      }
   },
   methods: {
      pinzhuangList(obj, array) {
         for (var k = 0; k < obj.length; k++) {
            const p_Code_Str = obj[k].p_Code_Str
            if (!p_Code_Str) {
               array.push(obj[k])
            }
         }

         for (var d = 0; d < array.length; d++) {
            const childrenList = []
            const infoId = array[d].infoId
            for (var c = 0; c < obj.length; c++) {
               const p_Code_Str2 = obj[c].p_Code_Str
               if (p_Code_Str2 == infoId) {
                  childrenList.push(obj[c])
               }
            }
            array[d].childrenList = childrenList
         }
         return array
      },

      endConfirm() {
         this.showEndTime = false;
         let date = this.currentEndDate
         this.endtime = date.getFullYear() +
            "/" +
            (Number(date.getMonth()) + 1) +
            "/" +
            date.getDate()

      },
      startConfirm() {
         this.showStartTime = false;
         let date = this.currentStartDate
         this.starttime = date.getFullYear() +
            "/" +
            (Number(date.getMonth()) + 1) +
            "/" +
            date.getDate()

      },
      // 点击取消
      startCancel() {
         this.showStartTime = false;
      },
      endCancel() {
         this.showEndTime = false;
      },
      start() {
         this.showStartTime = true;
      },
      end() {
         this.showEndTime = true;
      },
      choseCity() {
         this.show = true
      },
      //value=0改变省，1改变市，2改变区
      onChange(picker, index, value) {
         let val = picker.getValues();
         console.log(val)//查看打印
         let areaName = ''
         for (var i = 0; i < val.length; i++) {
            areaName = areaName + (i == 0 ? '' : '/') + val[i].name
         }
         this.carmodel = areaName
      },
      //确定选择城市
      onConfirm(val) {
         console.log(this.$refs.choseCity)
         console.log(val[0].name + "," + val[1].name + "," + val[2].name)
         this.show = false//关闭弹框
      },
      //取消选中城市
      onCancel() {
         this.show = false
         this.$refs.myArea.reset()// 重置城市列表
      },
      //点击保存
      conserve() {
         let value = []
         let money = []
        
         let outMoney = this.chargeListModel.pzList.filter(item => item.infoId.indexOf(".MONEY") >= 0)
         this.chargeListModel.gdList.forEach((item, index, arr) => {
            let inMoney = item.children.filter(item => item.infoId.indexOf(".MONEY") >= 0)
            console.log(inMoney)
            money.push(inMoney[0])
         })
         outMoney.forEach((item, index, arr) => {
            console.log(item)
            money.push(item)
         })
         //获取到填写的所有信息
         value = this.chargeListModel
         this.chargeValue.push(value)
         //获取到填的所有金额
         this.chargeMoney.push(money)
         // console.log(this.chargeValue)
         //console.log(this.chargeMoney)
         //计算总金额
         let toast = 0
         this.chargeMoney.forEach((item, index, arr) => {
            item.forEach((value, key, arr) => {
               toast += Number(value.org)
            })

         })

         let detailChargeObj = {}
         detailChargeObj.value = this.chargeValue
         detailChargeObj.money = parseToThousandth(toast)
         console.log(detailChargeObj)
       
         let detailChargeArray = []
         detailChargeArray.push(detailChargeObj)
         console.log(detailChargeArray)
         // const expense_List = summer.getStorage("expense_List")
         if (this.expense_List) {
            if(this.type=="new"){
               this.expense_List.push(detailChargeObj)
               summer.setStorage("expense_List", JSON.stringify(this.expense_List))
            }else{
               this.expense_List[this.index] = detailChargeObj
              summer.setStorage("expense_List", JSON.stringify(this.expense_List))
            }
            
         } else {
            summer.setStorage("expense_List", JSON.stringify(detailChargeArray))
         }
        this.$router.back(-1)
      },
      //获取combox取到的值
      getComboxValue($event, pzOrg) {
         pzOrg.org = $event
      }
   }
})