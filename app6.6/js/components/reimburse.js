/**
 * @description 报销单页面组件
 * pageType: new-新建，edit-编辑
 * billType: 单据类型 
 */

createScript("./js/components/common/nav.js")
createScript("./js/components/common/base_info.js")
createScript("./js/components/common/detailOfCharge/index.js")
createScript("./js/components/common/settlement/index.js")

var reimburse = `
    <div class="bill">
        <navBar :title="title"></navBar>
        <div class="section">
            <baseInfo :firstzoneMap="list.firstzoneMap" ref="baseInfo"></baseInfo>
            <deatil-of-charge :thirdzoneMap="list.thirdzoneMap" :list="expense_List"></deatil-of-charge>
            <settlement :fouthzonelist="list.fouthzonelist"></settlement>
        </div>
        <van-button v-if="pageType == 'new'" class="confrimBtn" type="info" @click="save">保存</van-button>
        <div v-else class="flex footer" style="align-items:center">
           <van-button v-for="(item,index) in btnList" 
             :key="index" 
             class="editBtn" 
             plain 
             type="info"
             @click="clickBtn(item.name)"
             >
             {{item.name}}
             </van-button>
        </div>
    </div>

`
var reimburse = Vue.component("reimburse", {
    template: reimburse,
    data() {
        return {
            title: "",
            list: {},
            pageType: '',
            btnList: [{ name: "修改" }, { name: "保存" }, { name: "提交" }, { name: "删除" }],
            loanList: [],
            expense_List:[]
        }
    },
    mounted() {
        const billType = this.$route.query.billType
        this.pageType = this.$route.query.pageType
        console.log(this.pageType)
        this.title = this.$route.query.name
        // if (billType) {
        //     const billTypeList = {}
        //     billTypeList.billType = billType
        //     billTypeList.pageType = this.pageType
        //     billTypeList.name = this.title
        //     summer.setStorage('billTypeList', JSON.stringify(billTypeList))
        // } 
     

        if (summer.getStorage('rows')) {
            // 在保存成功和返回上一页的时候需清除
            this.list = JSON.parse(summer.getStorage('rows'))
            return
        }
       
         
        const param = `CO_CODE=101&BILL_TYPE=${billType}&ND=2019`
        const url = `http://10.10.66.8:9899/FS/services/billService/getArInfoList?${param}`
        console.log(url)
        const that = this
        this.$nextTick(() => {
            $.ajax({
                type: "get",
                async: false,
                url: url,
                error: function (data) {
                    console.log(data);
                },
                success: function (data) {
                    if (data.resultCode == "1") {
                        that.list = data.rows;
                        console.log(data);
                        summer.setStorage('rows', JSON.stringify(data.rows))
                        if (data.rows.thirdzoneMap) {
                            localStorage.cargeList = JSON.stringify(data.rows.thirdzoneMap)
                        }
                    } else {
                        alert(data.rows);
                    }
                }
            })
        })
        console.log(this)
    },
    methods: {
        clickBtn(name) {
            switch (name) {
                case '修改':
                    this.modify()
                    break;
                case '保存':
                    this.save()
                    break;
                case '提交':
                    this.submit()
                    break;
                case '删除':
                    this.delete()
                    break;
                default:
                    break;
            }
        },
        // 修改
        modify() {

        },
        // 保存
        save() {
            // 封装保存数据，第一区固定项放在ArBill字段中，第三区固定项放在expenseList字段中，第四区固定项放在arCashList字段中，所以配置项放在infoList字段中
            let ArBill = {
                appId: summer.getStorage('userId') || 'sa', //当前登陆人
                inputorId: summer.getStorage('userId') || 'sa', //当前登录人
                inputDate: '', //插入日期，新增时使用“”
                billType: summer.getStorage('billType'),
                accountId: '',
                nd: 2019, //年度
                isCarry: "N",
                billStatus: 10,
                jdMoney: 0,
                checkMoney: 100,
                printTimes: 0,
                applyPrintTimes: 0,
                projectCode: '*'
            }
            const { gdList: firstGdList, pzList: firstPzList } = this.$refs.baseInfo.baseInfoModel
            
            // 校验第一区的必填项
            let isChecked = true
            let firstFiledList = firstGdList.concat(firstPzList)
            for (let i = 0; i < firstFiledList.length; i++) {
                if (firstFiledList[i].isNotEmpty === 'Y' || !firstFiledList[i].isNotEmpty) {
                    if (!firstFiledList[i].infoId.startsWith('APP') && !firstFiledList[i].infoId.startsWith('LOAN')) {
                        if (firstFiledList[i].infoName !== '经费来源' && !firstFiledList[i].org.trim()) {
                            vant.Notify({ type: 'danger', message: `${firstFiledList[i].infoName}不能为空` })
                            isChecked = false
                            break
                        }
                    }
                }
            }

            if (!isChecked) return
            firstGdList.forEach(item => {
                ArBill[item.infoId] = item.org
            })
            // console.log(ArBill)

            let infoList = []
            // 第一区配置项
            firstPzList.forEach(item => {
                if (!item.infoId.startsWith('APP') && !item.infoId.startsWith('LOAN')) {
                    infoList.push({
                        infoId: item.infoId,
                        belongTable: item.show_Area + '00',
                        value: item.org,
                        recNo: 1
                    })
                }
            })
            // 第一区的请款信息和借款信息可以从缓存中获取，请款和借款列表接口做好后再调试
            // console.log(JSON.parse(summer.getStorage('appCheckedList')))

            // 第三区数据
            let expenseList = []
            if (summer.getStorage('expense_List')) {
                const expense_List = JSON.parse(summer.getStorage('expense_List'))
                expense_List.forEach(item => {
                    let { gdList: thirdGdList, pzList: thirdPzList } = item.value[0]
                    // 固定项
                    // thirdGdList.forEach(list => {
                    //     list.children.forEach(children => {
                    //         expenseList.push(children)
                    //     })
                    // })
                    // 配置项
                    thirdPzList.forEach((list, index) => {
                        infoList.push({
                            infoId: list.infoId,
                            belongTable: list.show_Area + '00',
                            value: list.value,
                            recNo: index
                        })
                    })
                })
            }

            // console.log(infoList)
            // 第四区数据
            let arCashList = []
            if (summer.getStorage('saveSettlementInfo')) {
                let saveSettlementInfo = JSON.parse(summer.getStorage('saveSettlementInfo'))
                saveSettlementInfo.forEach((item, index) => {
                    // 固定项
                    item.list.forEach(detail => {
                        if( detail.infoName !== '结算方式' ) {
                            arCashList.push(detail)
                        }
                    })
                    // 配置项
                    item.pzlist.forEach((detail) => {
                        infoList.push({
                            infoId: detail.infoId,
                            belongTable: detail.show_Area + '00',
                            value: detail.value,
                            recNo: index
                        })
                    })
                })
            }

            let params = {
                ArBill,
                infoList,
                expenseList,
                arCashList
            }

            console.log(params)

            $.ajax({
                type: 'post',
                url: 'http://10.10.66.8:9899/FS/services/billService/arBillSave_common',
                // async: false,
                data: "datapaa=" + JSON.stringify(params),
                success(res) {
                    console.log(res)
                    if (res.resultCode === '1') {
                        vant.Toast.success('保存成功');
                    }
                },
                error(err) {
                    console.log(err)
                }
            })
        },
        // 提交
        submit() {

        },
        // 删除
        delete() {

        }
    },
})