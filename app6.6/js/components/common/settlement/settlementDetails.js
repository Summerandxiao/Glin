/**
 * @author 王德雷
 * @description 结算详情组件
 * billType: new-新建，edit-编辑
 * zoneTyPe: debuget--预算   settle--结算信息
 */
importCss('./css/components/settlement.css')
const settlementDetails = Vue.component('settlementDetails', {
    template: `
            <div class="settlement-detail bill">
                <navBar :title="title"></navBar>
                <div class="section">
                    <div class="settlement-amount">
                        <p class="title">本次结算金额</p>
                        <p class="amount">￥{{amount}}</p>
                    </div>
                    <van-list>
                        <van-cell 
                            v-for="(item,index) in billList" 
                            :key="index">
                            <span class="label">{{item.infoName}}</span>
                            <span class="bill-value">{{item.value}}</span>
                        </van-cell>
                    </van-list>
                </div>
            </div>    
        `,
    props: {
        billType: {
            type: String
        }
    },
    data() {
        return {
            title: '结算信息',
            billList: [],
            amount: 0
        }
    },
    created() {
        const { detail } = this.$route.params
        this.amount = detail[0].money
        this.billList = detail

        // 如果类型为新增，数据从浏览器缓存中获取；如果为编辑，数据从接口中获取
        if (this.billType === 'new') {

        } else if (this.billType === 'edit') {

        }
    }
})