// y预算指标选择指标
var budgetList = `
<div class="bill budget">
    <navBar :title='title'></navBar>
    <van-checkbox-group class="section" v-model="result" ref="checkboxGroup">
        <van-checkbox class="card" v-for="(item,index) in targetList" 
        :name="index" :key="index"  ref="checkboxes" @click="toggle(index,item.targetId)">
        <div class="label">
             <p class="card-title">{{item.targetName}}</p>
             <p>{{item.targetId}}</p>
            </div>
            <p>{{item.targetKey}}</p>
            <div class="req">
                <p class="money-detail">
                    <span>{{item.targetToast.toastName}}</span>
                    <span>￥{{item.targetToast.toastMoney}}</span>
                </p>
                <p class="money-detail">
                    <span>{{item.targetAvail.avaliName}}</span>
                    <span>￥{{item.targetAvail.availMoney}}</span>  
                </p>
            </div>
            <div class="used">
                <span>{{item.targetUsed.usedName}}</span>
                <span>￥{{item.targetUsed.usedMoney}}</span>
            </div>
            
        </van-checkbox>
    </van-checkbox-group>
   <!-- <div class="card">
   
    </div>-->
       <div class="footer">
        <ul class="checkArea">
            <li>
                <van-checkbox v-model="check" @click="checkAll">已选{{checked}}</van-checkbox>
                
            </li>
            <li>
                <van-button type="info" @click="sendTofather">确认</van-button>
            </li>
        </ul>
        </div>
</div>

`
var budgetList = Vue.component("budgetList",{
     template:budgetList,
     data(){
         return{
            title:"选择指标",
            result: [],
            check:false,
            checked:0,
            targetData:{},
            codeName:"",
           
            dataArr:[],
            targetList:[
                {
                    targetName:"指标编码",
                    targetId:'JBDK21212882',
                    targetKey:"指标关键要素",
                    targetToast:{
                        hasMoney:"Y",
                        toastName:"指标总额",
                        toastMoney:"101876.01",
                    },
                    targetAvail:{
                        hasMoney:"Y",
                        avaliName:"可用金额",
                        availMoney:"101876.00",
                    },
                    targetUsed:{
                        hasMoney:"Y",
                        usedName:"本次使用金额",
                        usedMoney:"101876.07",
                    }    
                },
                {
                    targetName:"指标编码",
                    targetId:'JACK2129911',
                    targetKey:"指标关键要素",
                    targetToast:{
                        hasMoney:"Y",
                        toastName:"指标总额",
                        toastMoney:"101876.00",
                    },
                    targetAvail:{
                        hasMoney:"Y",
                        avaliName:"可用金额",
                        availMoney:"101876.00",
                    },
                    targetUsed:{
                        hasMoney:"Y",
                        usedName:"本次使用金额",
                        usedMoney:"101876.03",
                    }    
                },
                {
                    targetName:"指标编码",
                    targetId:'JPVK2129911',
                    targetKey:"指标关键要素",
                    targetToast:{
                        hasMoney:"Y",
                        toastName:"指标总额",
                        toastMoney:"101876.00",
                    },
                    targetAvail:{
                        hasMoney:"Y",
                        avaliName:"可用金额",
                        availMoney:"101876.00",
                    },
                    targetUsed:{
                        hasMoney:"Y",
                        usedName:"本次使用金额",
                        usedMoney:"101876.30",
                    }    
                }
            ]
         }
     },
     created(){
           const  itemId = this.$route.query.code
           console.log(itemId)
           this.codeName = `项目${itemId}`
     },
     methods:{
         //选择某一项
        toggle(index,targetId) {
            console.log(this.$refs)
            const checkBox = this.$refs.checkboxes[index]
            if(checkBox.checked){
                this.checked--
                if( this.checked < 0 ){
                    this.checked = 0 
                }
                for(var i = 0 ; i < this.dataArr.length ; i++){
                    if(this.dataArr[i].targetId == targetId){
                       this.dataArr.splice(i,1)
                    }
               }
            }else{
                this.checked++
                this.dataArr.push(this.targetList[index] )
                if(this.checked == this.targetList.length){
                    console.log(this.$refs.checkboxGroup)
                    this.check= true
                }
               
            }
          
         
          },
          //全选反选
        checkAll() {
            this.check=!this.check
            console.log(this.check)
            if(this.check){
                this.$refs.checkboxGroup.toggleAll(true);
                this.checked = this.targetList.length
                this.dataArr = this.targetList
            }else{
                this.$refs.checkboxGroup.toggleAll();
                this.checked = 0
                this.dataArr = []
            }
          
          },
          sendTofather(){
            // this.$emit('func'd,this.dataArr)
            let usedTotal = 0
            let availTotal = 0
            let toastTotal = 0
            console.log(usedTotal)
            for( var i = 0 ; i < this.dataArr.length ; i++ ){
               let usedMoney = Number(this.dataArr[i].targetUsed.usedMoney)
               let availMoney = Number(this.dataArr[i].targetAvail.availMoney)
               let toastMoney = Number(this.dataArr[i].targetToast.toastMoney)
                console.log(usedMoney)
                usedTotal += usedMoney
                availTotal += availMoney
                toastTotal += toastMoney
                
            //   / usedTotal += parseInt(usedMoney)
            }
            usedTotal = returnFloat(usedTotal)
            availTotal = returnFloat(availTotal)
            toastTotal = returnFloat(toastTotal)
            console.log(usedTotal)
            this.targetData.itemName = this.codeName
            this.targetData.dataList = this.dataArr
            this.targetData.totalMoney = usedTotal
            this.targetData.availMoney = availTotal
            this.targetData.toastMoney = toastTotal
            localStorage.targetChecked = JSON.stringify(this.targetData)
            console.log(this.targetData)
            window.history.go(-2)
           // this.$router.push({path:"/newReim"});
          }
     }
    
})