/**
 * @author 王德雷
 * @description 结算组件
 */


const settlement = Vue.component('settlement', {
    props: ["fouthzonelist"],
    template: `
           <div class="detail settlement">
                <van-cell :value="title" />
                <van-cell
                    v-for="(item,index) in billList"
                    :key="index"
                    :title="item[0].value" 
                    :value="'￥' + item[0].money"
                    is-link 
                    :to="{ name: 'settlementDetails', params: { detail: item } }" /> 
                <router-link :to="{name:'settlemetMethod', params: {fouthzonelist} }" tag="div" class="increaseBtn">
                        <div> 
                        <i class="iconfont icon-tianjia"></i><span> 新增{{title}}</span>
                        </div>
                </router-link>
                <div class="total">
                    <span>合计：</span>
                    <span>￥{{total}}</span>
                </div> 
           </div>
       `,
    data() {
        return {
            title: '结算信息',
            billList: [],
            total: 0
        }
    },
    created() {
        if (summer.getStorage('saveSettlementInfo')) {
            let saveSettlementInfo = JSON.parse(summer.getStorage('saveSettlementInfo'))
            let saveSettlementInfoArr = []
            saveSettlementInfo.forEach(item => {
                saveSettlementInfoArr.push(item.list.concat(item.pzlist))
            })
            saveSettlementInfoArr.forEach(item => {
                item.forEach(detail => {
                    if(detail.infoId === 'money') {
                        item[0].money = parseToThousandth(detail.value)
                        this.total += Number(detail.value)
                    }
                })
            })
            this.total = parseToThousandth(this.total)
            saveSettlementInfoArr.forEach((item, index) => {
                if(!item.length) {
                    saveSettlementInfoArr.splice(index, 1)
                }
            })
            this.billList = saveSettlementInfoArr
        }
    }
})
