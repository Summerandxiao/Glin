/**
 * @author 王德雷
 * @description 结算方式组件
 */

const settlemetMethod = Vue.component('settlemetMethod', {
    template: `
        <div class="settlement-method bill">
            <navBar :title="title"></navBar>
            <div class="section">
                <van-cell :title="item.title" is-link :to="{path: '/settlementInfo', query: {name:item.name}}" v-for="item in list" :key="item.name" />
            </div>
        </div>
    `,
    data() {
        return {
            title: '选择结算方式',
            radio: '1',
            list: []
        }
    },
    created() {
        this.list = [{
            title: '汇款转账',
            name: 'transferAccounts'
        }, {
            title: '公务卡',
            name: 'officialCard'
        }, {
            title: '支票',
            name: 'check'
        }, {
            title: '现金',
            name: 'cash'
        }]
    },
})  
