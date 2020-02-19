/**
 * @author 王德雷
 * @description 结算信息组件
 */

importCss('../css/components/settlement.css')

const settlementInfo = Vue.component('settlementInfo', {
    template: `
        <div class="settlement-info bill">
            <navBar :title="title"></navBar>
            <van-cell-group class="section">
                <van-field
                    v-for="item in fieldList"
                    :key="item.label"
                    :readonly="item.label === '结算方式' || item.type === 'select' || item.type === 'datepicker' ? true : false"
                    input-align="right"
                    :placeholder="item.type === 'select' || item.type === 'datepicker' ? '请选择' + item.label : '请输入' + item.label"
                    v-model="item.value"
                    :type="item.type"
                    :is-link="item.type === 'select' || item.type === 'datepicker' ? true: false" 
                    :label="item.label"
                    @click="handleClickField(item)">
                </van-field>
            </van-cell-group>
            <van-popup v-model="isShowSelect" position="bottom" :style="{ height: '30%' }">
                <van-picker :columns="columns" @change="onChange" v-show="isShowSelect"/>
            </van-popup>
            <van-calendar v-model="isShowDate" @confirm="onConfirm" :show-confirm="false"/>
            <van-button round type="info" @click="saveInfo">保存</van-button>
        </div>
     `,
    data() {
        return {
            title: '结算信息',
            fieldList: [],
            isShowSelect: false,
            isShowDate: false,
            columns: ['张三', '李四', '王五']
        }
    },
    methods: {
        saveInfo() {
            console.log(this.fieldList)
        },
        handleClickField(item) {
            if (item.type !== 'select' && item.type !== 'datepicker') return
            if (item.type === 'select') {
                this.isShowSelect = true
                if (item.label === '持卡人') {
                    this.columns = ['张三', '李四', '王五']
                } else if (item.label === '支票类型') {
                    this.columns = ['转账支票', '现金支票', '信汇', '电汇', '内转']
                }else if(item.label === '收支') {
                    this.columns = ['领款', '退回']
                }
            } else if (item.type === 'datepicker') {
                this.isShowDate = true
            }
        },
        onChange(picker, value, index) {
            let result = this.fieldList.filter(item => item.type === 'select')[0]
            result.value = value
            this.isShowSelect = false
        },
        formatDate(date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        },
        onConfirm(date) {
            let result = this.fieldList.filter(item => item.type === 'datepicker')[0]
            result.value = this.formatDate(date)
            this.isShowDate = false
        }
    },
    created() {
        const { name } = this.$route.query
        switch (name) {
            case 'transferAccounts':
                this.fieldList = [{
                    label: '结算方式',
                    value: '汇款转账',
                    type: 'text'
                }, {
                    label: '户名',
                    value: '',
                    type: 'text'
                }, {
                    label: '账号',
                    value: '',
                    type: 'number'
                }, {
                    label: '开户行',
                    value: '',
                    type: 'text'
                }, {
                    label: '金额',
                    value: '',
                    type: 'number'
                }]
                break
            case 'officialCard':
                this.fieldList = [{
                    label: '结算方式',
                    value: '公务卡',
                    type: 'text'
                }, {
                    label: '持卡人',
                    value: '',
                    type: 'select'
                }, {
                    label: '卡号',
                    value: '',
                    type: 'number'
                }, {
                    label: '消费日期',
                    value: '',
                    type: 'datepicker'
                }, {
                    label: '金额',
                    value: '',
                    type: 'number'
                }]
                break
            case 'check':
                this.fieldList = [{
                    label: '结算方式',
                    value: '支票',
                    type: 'text'
                }, {
                    label: '金额',
                    value: '',
                    type: 'number'
                }, {
                    label: '支票类型',
                    value: '',
                    type: 'select'
                }, {
                    label: '支票号',
                    value: '',
                    type: 'number'
                }, {
                    label: '收款单位',
                    value: '',
                    type: 'text'
                }, {
                    label: '备注',
                    value: '',
                    type: 'text'
                }]
                break
            case 'cash':
                this.fieldList = [{
                    label: '结算方式',
                    value: '现金',
                    type: 'text'
                },{
                    label: '金额',
                    value: '',
                    type: 'number'
                },{
                    label: '收支',
                    value: '',
                    type: 'select'
                },{
                    label: '备注',
                    value: '',
                    type: 'text'
                }]
                break
            default:
                break;
        }

    }
})