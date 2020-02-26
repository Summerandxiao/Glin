/**
 * @author 王德雷
 * @description 借款、请款结算详情组件
 */

importCss('./css/components/loanInformation.css')

const loanDetail = Vue.component('loanDetail', {
    template: `
        <div calss="loan-detail bill">
            <navBar :title="title"></navBar>
            <van-cell-group class="section">
                <van-cell 
                    v-for="item in details"
                    :key="item.label"
                    :title="item.title" 
                    :value="item.value" />
            </van-cell-group>
        </div>
     `,
    data() {
        return {
            title: '借款结算详情',
            details: []
        }
    },
    created() {

        let { billType, detail } = this.$route.params
        if (billType === 'loan') {
            this.title = '借款结算详情'
        } else if (billType === 'app') {
            this.title = '请款结算详情'
        }

        this.details = [{
            title: '借款单类型',
            value: '个人借款单'
        }, {
            title: '借款单名称',
            value: detail.title
        }, {
            title: '借款金额',
            value: parseToThousandth(detail.loanAmount)
        }, {
            title: '借款余额',
            value: parseToThousandth(12910)
        }, {
            title: '本次冲销金额',
            value: parseToThousandth(detail.writeOffAmount)
        }]
    }
})