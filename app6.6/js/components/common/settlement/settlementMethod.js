/**
 * @author 王德雷
 * @description 结算方式组件
 */

const settlemetMethod = Vue.component('settlemetMethod', {
    template: `
        <div class="settlement-method bill">
            <navBar :title="title"></navBar>
            <div class="section">
                <van-cell :title="item.title" is-link :to="{ name: 'settlementInfo', params: {name: item.name, title: item.title, list: item.list, pzlist: item.pzlist } }" v-for="item in list" :key="item.name" />
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
        let { fouthzonelist } = this.$route.params
        if (fouthzonelist) {
            summer.setStorage('fouthzonelist', JSON.stringify(fouthzonelist))
        } else {
            fouthzonelist = JSON.parse(summer.getStorage('fouthzonelist'))
        }
        
        for (const key in fouthzonelist) {
            if (fouthzonelist.hasOwnProperty(key)) {
                const element = fouthzonelist[key]
                this.list.push({
                    title: element.name,
                    name: key,
                    list: element.list,
                    pzlist: element.pzlist
                })
            }
        }
    },
})  
