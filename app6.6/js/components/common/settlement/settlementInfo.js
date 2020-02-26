/**
 * @author 王德雷
 * @description 结算信息组件
 */

{/* <van-calendar v-model="isShowDate" @confirm="onConfirm" :show-confirm="false"/> */ }

importCss('./css/components/settlement.css')

// const baseUrl = 'https://www.fastmock.site/mock/3d01df2e5e53f793c3c7f7fd87a905e0/api'

const settlementInfo = Vue.component('settlementInfo', {
    template: `
        <div class="settlement-info bill">
            <navBar :title="title"></navBar>
            <van-cell-group class="section">
                <van-field
                    v-for="item in fieldList"
                    :key="item.infoName"
                    input-align="right"
                    :required=" (!item.isNotEmpty || item.isNotEmpty === 'Y') && item.infoName !== '结算方式' "
                    :readonly="item.infoName === '结算方式' || item.fieldType === 'combox1'"
                    :placeholder="item.fieldType === 'combox1' || item.fieldType === 'date' ? '请选择' + item.infoName : '请输入' + item.infoName"
                    v-model="item.value"
                    :type="item.fieldType"
                    :is-link="item.fieldType === 'combox1' || item.fieldType === 'date' ? true: false" 
                    :label="item.infoName"
                    @click="handleClickField(item)">
                </van-field>
                <van-field
                    v-for="item in pzlist"
                    :key="item.infoName"
                    input-align="right"
                    :required=" (!item.isNotEmpty || item.isNotEmpty === 'Y') && item.infoName !== '结算方式' "
                    :readonly = "item.infoName === '结算方式' || item.fieldType === 'combox1'"
                    :placeholder="item.fieldType === 'combox1' || item.fieldType === 'date' ? '请选择' + item.infoName : '请输入' + item.infoName"
                    v-model="item.value"
                    :type="item.fieldType"
                    :is-link="item.fieldType === 'combox1' || item.fieldType === 'date' ? true: false" 
                    :label="item.infoName"
                    @click="handleClickField(item)">
                </van-field>
            </van-cell-group>
            <van-popup v-model="isShowSelect" position="bottom" :style="{ height: '40%' }">
                <van-picker 
                    :columns="columns"
                    show-toolbar
                    @confirm="onPickerConfirm"
                    @cancel="isShowSelect=false"
                    v-show="isShowSelect"/>
            </van-popup>
            <van-popup v-model="isShowDate" position="bottom" :style="{ height: '40%' }">
                <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="onConfirm"
                />
            </van-popup>
            <van-button round type="info" @click="saveInfo">保存</van-button>
        </div>
     `,
    data() {
        return {
            title: '结算信息',
            fieldList: [],
            pzlist: [],
            isShowSelect: false,
            isShowDate: false,
            columns: [],
            recordList: [],
            filedName: '',
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),
            saveSettlementInfoArr: []
        }
    },
    methods: {
        saveInfo() {
            // 对必填项进行校验
            let isChecked = true
            let fieldArr = this.fieldList.concat(this.pzlist)
            for (let i = 0; i < fieldArr.length; i++) {
                if (fieldArr[i].isNotEmpty === 'Y' || !fieldArr[i].isNotEmpty) {
                    if (!fieldArr[i].value.trim()) {
                        vant.Notify({ type: 'danger', message: `${fieldArr[i].infoName}不能为空` })
                        isChecked = false
                        break
                    }
                }
            }
            // fieldArr.forEach(item => {
            //     if(!item.isNotEmpty || item.isNotEmpty === 'Y') {
            //         if(!item.value.trim()) {
            //             vant.Notify({ type: 'warning', message: `${item.infoName}不能为空` })
            //             return
            //         }
            //     }
            // })
            if (isChecked) {
                let saveSettlementInfo = summer.getStorage('saveSettlementInfo')
                if (saveSettlementInfo) {
                    this.saveSettlementInfoArr = JSON.parse(saveSettlementInfo)
                }
                this.saveSettlementInfoArr.push({
                    list: this.fieldList,
                    pzlist: this.pzlist
                })
                summer.setStorage('saveSettlementInfo', JSON.stringify(this.saveSettlementInfoArr))
                //const billTypeInfo = JSON.parse(summer.getStorage("billTypeList"))
                //  this.$router.push({
                //      name: 'reimburse',
                //      query:{billType:billTypeInfo.billType , pageType:billTypeInfo.pageType , name:billTypeInfo.name}
                //  })
                this.$router.go(-2)
            }
        },
        handleClickField(item) {
            return false
            if (item.fieldType !== 'combox' && item.fieldType !== 'date') return
            if (item.fieldType === 'combox') {
                this.isShowSelect = true
                if (this.filedName === 'bizcard') {
                    let data = {
                        CO_CODE: '',
                        USER_NAME: '',
                        ND: ''
                    }
                    // 获取公务卡的信息
                    request('/services/billService/selectCardInfoList', data)
                        .then(res => {
                            this.recordList = res.recordList
                            this.columns = this.recordList.map(item => item.userName)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else if (this.filedName === 'transfer') {
                    let data = { CO_CODE: '' }
                    // 获取汇款转账的信息
                    request('/services/billService/getBkCurrentAcc_publicCommon', data)
                        .then(res => {
                            this.recordList = res.recordList
                            this.columns = this.recordList.map(item => item.BANK_ACC_NAME)
                        })
                        .catch(err => {
                            console.log(res)
                        })
                }
            } else if (item.fieldType === 'date') {
                this.isShowDate = true
            }
        },
        onPickerConfirm(value, index) {
            let result = this.fieldList.filter(item => item.fieldType === 'combox')[0]
            result.value = value
            if (this.filedName === 'transfer' || this.filedName === 'bizcard') {
                let res = this.fieldList.filter(item => item.infoId === 'cardNo')
                if (res.length) {
                    res[0].value = this.recordList[index].cardNo
                }
            }
            this.isShowSelect = false
        },
        formatDate(date) {
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        },
        onConfirm(date) {
            let result = this.fieldList.filter(item => item.type === 'datepicker')[0]
            result.value = this.formatDate(date)
            this.isShowDate = false
        }
    },
    created() {
        let { name, list, pzlist, title } = this.$route.params
        this.filedName = name
        // console.log(name, detail)
        list = list.filter(item => item.infoName)
        list.forEach(item => {
            item.value = ''
        })
        list.unshift({
            infoName: '结算方式',
            value: title
        })
        this.fieldList = list

        pzlist = pzlist.filter(item => item.infoName)
        pzlist.forEach(item => {
            item.value = ''
        })
        this.pzlist = pzlist
    }
})
