// 下拉框组件
var combox = `
<div  class="detail-items">
        <div class="van-cell__title van-field__label">
               <span v-if="comboxInfo.item.isNotEmpty == 'Y' " style="color: red">*</span>
               <span>{{comboxInfo.item.infoName}}</span>
            </div>
            <div style="position: relative ">
                  <input class="detail-input" :placeholder="'请选择'+comboxInfo.item.infoName" v-model="value"  @focus="focusOrg"
                     @blur="blurOrg($event)">
                  <div class="pay-account" v-if="ifShowOrg"> 
                     <!--实现部门可编辑可筛选-->
                     <div v-for="item in departOrg" :key="item.sourceCode" class="account-name"
                        @touchstart="chooseDepart(item)">{{item.sourceName}}</div>
                  </div>
            </div>
</div>

`
var combox = Vue.component("combox",{
     props:["comboxInfo"],
     template:combox,
     data(){
         return{
            ifShowOrg:false,
            departOrg:[
                {sourceName:"企划部",sourceCode:2019045486} ,
                {sourceName:"财务部",sourceCode:2019433994},
                {sourceName:"服务部",sourceCode:2019239499},
                {sourceName:"产品部",sourceCode:2019348843}
               ], //部门列表
               value:""
         }
     },
     created(){
       this.$nextTick(()=>{
        //console.log(this)
          this.value = this.comboxInfo.org
       })
         
      
     },
     methods:{
        focusOrg () {
            this.ifShowOrg = true
          },
          blurOrg (e) {
            this.ifShowOrg = false
           
            console.log(  this.value,"blur") //this.comboxInfo.org = this.value
            this.$emit("getValue",this.value)
           
          },
          inputOrg () {
            this.ifShowOrg = true
          },
          chooseDepart (item) {
            this.value = item.sourceName
            this.comboxInfo.org = this.value
            console.log(this)
           // this.comboxInfo.org =this.value
           // this.change(item.sourceCode)
           
          }
     }
})