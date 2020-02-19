/**
 * @author 王德雷
 * @description 结算详情组件
 * billType: new-新建，edit-编辑
 * zoneTyPe: debuget--预算   settle--结算信息
 */
importCss('../css/components/settlement.css')
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
                            v-for="item in billList" 
                            :key="item.id">
                            <span class="label">{{item.label}}</span>
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
            amount: 919123
        }
    },
    created() {
        this.billList = [{
            id: 1,
            label: '结算方式',
            value: '转账'
        },{
            id: 2,
            label: '户名',
            value: '张三'
        },{
            id: 3,
            label: '账号',
            value: '123456'
        },{
            id: 4,
            label: '开户行',
            value: '海淀支行'
        },{
            id: 5,
            label: '付款账户',
            value: '67890'
        }]

        this.amount = parseToThousandth(this.amount)

        // 如果类型为新增，数据从浏览器缓存中获取；如果为编辑，数据从接口中获取
        if(this.billType === 'new') {

        }else if(this.billType === 'edit') {

        }
    }
})