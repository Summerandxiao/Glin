/**
 * @author 王德雷
 * @description 请款信息、借款信息公共组件
 */

importCss('./css/components/loanInformation.css')

const loanInformation = Vue.component('loanInformation', {
    template: `
        <div class="loan-information bill">
            <navBar :title="title"></navBar>
            <van-checkbox-group class="section" v-model="result" ref="checkboxGroup">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <van-cell 
                        v-for="(item, index) in list" 
                        :key="item.id" 
                        @click="toggle(index)">
                        <div class="item-box">
                            <van-checkbox
                                :name="item.id"
                                ref="checkboxes"
                            />
                            <div class="right-item">
                                <div class="loan-bill">
                                    <span class="title">{{billTitle}}</span>
                                    <span class="billno">{{item.billNo}}</span>
                                </div>
                                <div class="meeting-title">{{item.title}}</div>
                                <div class="loan-info">
                                    <div class="loan-info-box">
                                        <p>借款金额</p>
                                        <p>￥{{item.loanAmount | parseToThousandth}}</p>
                                    </div>
                                    <div class="loan-info-box">
                                        <p>借款金额</p>
                                        <p>￥{{item.loanAmount | parseToThousandth}}</p>
                                    </div>
                                </div>
                                <div class="write-off">
                                    <div class="write-off-title">
                                        <van-icon name="edit" />
                                        <span>本次冲销金额</span>
                                    </div>
                                    <div>￥{{item.writeOffAmount | parseToThousandth}}</div>
                                </div>
                            </div>
                        </div>
                    </van-cell>
                </van-list>
            </van-checkbox-group>
            <div class="operation">
                <div class="operation-box">
                    <van-checkbox v-model="checked" @change="toggleAll">已选({{result.length}})</van-checkbox>
                    <van-button round plain type="info" @click="confirm">确认</van-button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            title: '借款信息',
            list: [],
            loading: false,
            finished: false,
            result: [],
            checked: false,
            billTitle: '个人借款单',
            billType: ''
        }
    },
    created() {
        const { params } = this.$route
        if (params.billList) {
            params.billList.forEach(item => {
                this.result.push(item.id)
            })
        }

        this.billType = params.billType
        if (this.billType === 'loan') {
            this.title = '借款信息'
            this.billTitle = '个人借款单'
        } else if (this.billType === 'app') {
            this.title = '请款信息'
            this.billTitle = '个人请款单'
        }
    },
    watch: {
        billType(newV) {
            if (newV === 'loan') {
                this.title = '借款信息'
                this.billTitle = '个人借款单'
            } else if (newV === 'req') {
                this.title = '请款信息'
                this.billTitle = '个人请款单'
            }
        }
    },
    methods: {
        onLoad() {
            // 异步更新数据
            // setTimeout 仅做示例，真实场景中一般为 ajax 请求
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    this.list.push({
                        id: this.list.length,
                        billNo: 'JBDK2129911' + i,
                        title: '关于宁波经费超支沟通会' + i,
                        loanAmount: 101876 + i,
                        writeOffAmount: 121101876 + i
                    });
                }

                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.list.length >= 40) {
                    this.finished = true;
                }
            }, 1000);
        },
        toggle(index) {
            this.$refs.checkboxes[index].toggle();
        },
        toggleAll() {
            if (this.checked) {
                this.$refs.checkboxGroup.toggleAll(true);
            } else {
                this.$refs.checkboxGroup.toggleAll();
            }
        },
        confirm() {
            let checkedList = this.list.filter(item => this.result.indexOf(item.id) !== -1)
            if (this.billType === 'app') {
                summer.setStorage('appCheckedList', JSON.stringify(checkedList))
            } else if (this.billType === 'loan') {
                summer.setStorage('loanCheckedList', JSON.stringify(checkedList))
            }
           //返回上一页 
            this.$router.back(-1)
        }
    }
})