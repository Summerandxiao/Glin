//头部导航
var navBar = `
<div class="header">
    <van-nav-bar
    :title="title"
    left-text="返回"
    right-text="按钮"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
    />
   </div> `
var navBar =  Vue.component("navBar",{
        template:navBar,
        props:['title'],
        data(){
            return{
               // title:title
            }
        },
        methods:{
            onClickLeft() {
              this.$router.go(-1)
              },
              onClickRight() {
                alert('按钮');
              }
        }
})