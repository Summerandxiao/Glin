//流程跟踪页面
// 费用明细项
var processTracking = `
<div>
    <navBar :title="title"></navBar>
    <van-steps direction="vertical" :active="active" active-color="#38f">
        <van-step>
            <h3>经办岗</h3>
            <van-panel title="张颖" desc="2016-07-12 12:40" status="已提交">
            </van-panel>
           
        </van-step>
        <van-step>
            <h3>部门主管</h3>
            <van-panel title="王丽" desc="2019-04-06 12:40" status="同意">
            </van-panel>
            <van-panel title="努尔古丽阿布杜卡迪尔" desc="2019-04-06 13:40" status="不同意">
                <div>
                     备注原因：狮吼功怕是奇偶及，锦江国际实际缴费开发开放，单据规划死灰复燃面积覅时候
                </div>
            </van-panel>
        </van-step>
        <van-step>
            <h3>财务会计</h3>
            <van-panel title="刘玉玲" desc="2016-07-12 14:40" status="待审">
            </van-panel>
        </van-step>
        <van-step>
            <h3>财务总监</h3>
            <van-panel title="张曼玉" desc="2016-07-12 14:40" status="待审">
            </van-panel>
        </van-step>
        </van-steps>
    
   
</div>

`
var processTracking = Vue.component("processTracking",{
     template:processTracking,
     data(){
         return{
             active:2,
            title:"流程跟踪",
            detailCharge:'0.00',
         }
     }
})