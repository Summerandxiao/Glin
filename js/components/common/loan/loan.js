/**
 * @author 王德雷
 * @description 借款/请款组件
 */

importCss('../css/components/loanInformation.css')

const loan = Vue.component('loan', {
    template: `
        <div class="detail loan">
               <van-cell :value="title" />
                <van-cell
                    is-link
                    @click="clickCell"
                   >
                    <div class="big-title">
                        会
                    </div>
                    <div class="text">
                        <p>BIO291019293</p>
                        <P>关于湖南经费超值沟通会议研讨</P>
                    </div>
                    <span class="account">￥390</span>
                </van-cell>
                    <router-link :to="{path:'/loanInformation'}" tag="div" class="increaseBtn">
                    <div> 
                    <i class="iconfont icon-tianjia"></i><span> 新增{{title}}</span>
                    </div>
                </router-link>
            <div class="total">
                <span>合计：</span>
                <span>￥929928</span>
            </div>
        </div>
     `,
    props: ['billType'],
    data() {
        return {
            title: '请款信息',
            list: [],
            loading: false,
            finished: false
        }
    },
    methods: {
        clickCell() {
            this.$router.push({
                name: "loanDetail",
                params: {
                    // billType: this.billType
                    billType: 'req'
                }
            })
        }
    },
    created() {
        if (this.billType === 'req') {
            this.title = '请款信息'
        } else if (this.billType === 'loan') {
            this.title = '冲销借款'
        }
    },
    watch: {
        billType(newV) {
            if (newV === 'req') {
                this.title = '请款信息'
            } else if (newV === 'loan') {
                this.title = '冲销借款'
            }
        }
    }
})