/**
 * @author 王德雷
 * @description 借款/请款组件
 */

importCss('./css/components/loanInformation.css')

const loan = Vue.component('loan', {
    template: `
        <div class="detail loan">
               <van-cell :value="title" />
                <van-cell
                    v-for="item in billList"
                    :key="item.id"
                    is-link
                    @click="clickCell(item)"
                   >
                    <div class="big-title">
                        {{billText}}
                    </div>
                    <div class="text">
                        <p>{{item.billNo}}</p>
                        <P>{{item.title}}</P>
                    </div>
                    <span class="account">￥{{item.loanAmount | parseToThousandth}}</span>
                </van-cell>
                 <router-link :to="{ name:'loanInformation', params: { billList, billType } }" tag="div" class="increaseBtn">
                    <div> 
                    <i class="iconfont icon-tianjia"></i><span> 新增{{title}}</span>
                    </div>
                </router-link>
            <div class="total">
                <span>合计：</span>
                <span class="totalMoney ">￥{{total | parseToThousandth}}</span>
            </div>
        </div>
     `,
    props: ['loanInfo', 'list'],
    data() {
        return {
            title: '请款信息',
            loading: false,
            finished: false,
            billList: [],
            billText: '请',
            infoId: '',
            billType: '',
            total: 0
        }
    },
    methods: {
        clickCell(item) {
            this.$router.push({
                name: "loanDetail",
                params: {
                    billType: this.billType,
                    detail: item
                }
            })
        }
    },
    created() {
        console.log(this.list)
        if (this.list) {
            this.billList = this.list
            this.list.forEach(item => {
                this.total += item.loanAmount
            })
        }
        this.infoId = this.loanInfo.item.infoId
        if (this.infoId.startsWith('APP')) {
            // 请款
            this.billType = 'app'
            this.billText = '请'
        } else if (this.infoId.startsWith('LOAN')) {
            // 借款
            this.billType = 'loan'
            this.billText = '借'
        }
    }
})