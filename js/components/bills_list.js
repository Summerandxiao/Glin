//reim报销单/req申请单列表
createScript("../js/components/common/nav.js")
var billList = `
<div class="bill">
    
    <navBar :title="title"></navBar>
    
     
          <van-search 
            v-model="value"  shape="round"
            placeholder="请输入单据编号、报销人、报销事由"
            input-align="center"
          />
    
 
          <!--滚动列表-->
          <van-list  class="section"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
          <!--未提交-->
          <van-swipe-cell class="list-card" >
          <div class="cell-card">
            <div @click="goEdit('travel')" >
              <div class='remiList'>
                <span class="list-card-title">差旅费报销单</span>
                <span class="num">2019-03-10</span>
                <span class="date">未提交</span>
              </div>
              <div class='reason'>
                <span>宁波海事客户调研</span>
                <span>¥123,121.00</span>
              </div>
            </div>
              <div style="display:flex;justify-content:space-between;">
                <span></span>
                <van-button class="submitBtn" @click="submit"  plain round hairline type="info">提交</van-button>
              </div>
            
            </div> 
              <van-button
                slot="right"
                square
                text="取消"
                type="default"
                class="cancel-button"
              />
              <van-button
                slot="right"
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="delCard(index)"
               />
          </van-swipe-cell>
          <!--已提交-->
          <van-swipe-cell   class="list-card" >
              <div class="cell-card">
                <div  @click="goEdit('car')" >
                  <div class='remiList'>
                    <span class="list-card-title">车辆维修报销单</span>
                    <span class="num">2019-03-10</span>
                    <span class="date">审批中</span>
                  </div>
                  <div class='reason'>
                    <span>2季度通信费报销</span>
                    <span>¥123,121.00</span>
                  </div>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span></span>
                <van-button class="submitBtn"  plain round hairline type="default" @click="processTrack">流程</van-button>
              </div>
            
            </div>
          </van-swipe-cell>
          
        </van-list>

     <router-link class="footer increaseBtn" :to="{path:'/newBills',query:{type:listType} }" tag="div">
      <div> 
        <i class="iconfont icon-tianjia"></i><span> {{increase}}</span>
      </div>
    </router-link>
  
</div>

`
var billList = Vue.component("billList",{
     template:billList,
     data(){
         return{
             title:"报销单",
             increase:"新增报销单",
             listType:'reim',
             listName:"报销单列表",
             value:'',
             reimList:[],
             loading: false,
             finished: false,
             pageType:"edit"
         }
     },
     created(){
        let url = 'http://rap2api.taobao.org/app/mock/241527/reimburselist'
        let that =  this
         let billType = this.$route.query.type
         this.listType = billType
         if(billType=="apply"){
           this.increase = "新增申请单"
           this.title = "申请单"
           this.listName = "申请单列表"
         }
         let hei = px2rem(50)+"rem"
         let fsize =  px2rem(16)+"rem"
         this.$nextTick(()=>{
            $(".increaseBtn").css({
                'height':hei,
                'position':'fixed',
                "bottom":"0px",
                "font-size":fsize,
                "line-height":hei
            })
            $.getJSON(url,function(res){
              that.reimList=res.reimList;
               console.log(res)
            })
          })    
     },
     methods:{
       //点击列表进入编辑页
          goEdit(kind){
             const billType = this.$route.query.type;
             if( billType  == "reim" ){
               this.$router.push({path:"/reimburse",query:{type:kind,pageType:this.pageType}})
             }else{
              this.$router.push({path:"/application",query:{type:kind,pageType:this.pageType}})
             }
          },
          //提交
          submit(){
                alert("提交")
          },
       //删除
       delCard(index){
            this.$dialog.confirm({
                message: '确定删除吗？'
              }).then(() => {
                  //this.fileList.splice(index,1)
                  console.log(this)
              }).catch(() => {
                // on cancel
              })
        },
        onLoad() {
          // 异步更新数据
          // setTimeout 仅做示例，真实场景中一般为 ajax 请求
          // setTimeout(() => {
          //   for (let i = 0; i < 10; i++) {
          //     this.list.push(this.list.length + 1);
          //   }
    
            // 加载状态结束
            this.loading = false;
    
            // 数据全部加载完成
        //     if (this.list.length >= 40) {
        //       this.finished = true;
        //     }
        //   }, 1000);
         },
         //查看流程
         processTrack(){
             this.$router.push({path:'/processTracking'})
         }
     }
})