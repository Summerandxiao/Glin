// 费用明细项
createScript("../js/components/common/nav.js")
var chargeList = `
<div class="bill">
   <navBar :title="title"></navBar>
   <div class="section">
      <div v-for="(item,index) in chargeList" :key="index">
         <van-collapse v-if="item.list" v-model="activeNames">
               <van-collapse-item :title="item.title" :name="index">
                  <div v-for="(name,index) in item.list" :key="index">
                     <van-field v-if="name.isNotEmpty" v-model="item.org" :label="name.type" 
                        :placeholder="'请输入'+name.type"  required/>
                     <van-field v-else v-model="item.org" :label="name.type" 
                        :placeholder="'请输入'+name.type" />
                  </div>
               </van-collapse-item>
         </van-collapse>
         <div v-else>
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
         </div>
      </div>
   </div>
    <!--选择城市-->
    <van-popup v-model="show" position="bottom">        
    <van-area :area-list="areaList" ref="myArea"  
    @cancel="onCancel"
    @confirm="onConfirm"
    @change="onChange"/>    
 </van-popup>
   
</div>

`
var chargeList = Vue.component("chargeList",{
     template:chargeList,
     data(){
         return{
            activeNames: ['1'],
            title:"费用明细",
            chargeList:[],
            show: false,                                                     //遮罩层显示或隐藏
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
                    110106: '丰台区',
                    110107: '石景山区',
                    110108: '海淀区',
                    110109: '门头沟区',
                    110111: '房山区',
                    110112: '通州区',
                    110113: '顺义区',
                    110114: '昌平区',
                    110115: '大兴区',
                    110116: '怀柔区',
                    110117: '平谷区',
                    110118: '密云区',
                    110119: '延庆区',
                    120101: '和平区',
                    120102: '河东区',
                    120103: '河西区',
                    120104: '南开区',
                    120105: '河北区',
                    120106: '红桥区',
                    120110: '东丽区',
                    120111: '西青区',
                    120112: '津南区',
                    120113: '北辰区',
                    120114: '武清区',
                    120115: '宝坻区',
                    120116: '滨海新区',
                    120117: '宁河区',
                    120118: '静海区',
                    120119: '蓟州区',}
                    
             },      //自定义数据三级结构
            checkCity: ''
         }
     },
     created(){
        let par= "CO_CODE=043001"
        var url = `http://rap2api.taobao.org/app/mock/244126/FS/services/billService/getDetailCharge?${par}`
        console.log(url)
        var that = this
       this.$nextTick(()=>{
               $.getJSON(url,function(res){
                  that.chargeList = res.data
                  console.log(res)
               })
               
            }) 
           
     },
     methods: {
        choseCity(){
            this.show= true
        },
        computed:{

        },
       //value=0改变省，1改变市，2改变区
    onChange(picker, index, value){
      let val = picker.getValues();
      console.log(val)//查看打印
      let areaName = ''
      for (var i = 0; i < val.length; i++) {
        areaName = areaName+(i==0?'':'/')+val[i].name
      }
      this.carmodel = areaName
    },
    //确定选择城市
    onConfirm(val){
        console.log(this.$refs.choseCity)
      console.log(val[0].name+","+val[1].name +","+val[2].name)
      this.show = false//关闭弹框
    },
    //取消选中城市
    onCancel(){
       this.show = false
       this.$refs.myArea.reset()// 重置城市列表
    }
        //点击确定
       
}
})