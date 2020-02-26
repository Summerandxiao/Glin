/*EXPENSE报销单/APPLY申请单列表
 *status: 0--未提交，1--已提交
*/
createScript("./js/components/common/nav.js")
createScript("./js/components/filter.js")
var billList = `
<div class="bill">
    
    <navBar :title="title"></navBar>
    <van-tabs v-model="status">
      <!--未提交-->
      <van-tab title="未提交" >
        <van-search  v-model="value"  shape="round" placeholder="请输入单据编号、报销人、报销事由" input-align="center" @focus="filterData"/>
        <!--滚动列表-->
        <van-list  class="section" v-model="loading":finished="finished" finished-text="没有更多了" @load="onLoad">
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
            <van-button slot="right" square text="取消" type="default" class="cancel-button"/>
            <van-button slot="right" square text="删除" type="danger" class="delete-button"  @click="delCard(index)" />
        </van-swipe-cell>  
      </van-list>
      </van-tab>
      <van-tab title="已提交">
        <van-search  v-model="value"  shape="round" placeholder="请输入单据编号、报销人、报销事由" input-align="center"/>
        <!--滚动列表-->
        <van-list  class="section" v-model="loading":finished="finished" finished-text="没有更多了" @load="onLoad">
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
      </van-tab>
    </van-tabs>

     <router-link class="footer increaseBtn" :to="{path:'/newBills',query:{B_TYPE:b_type} }" tag="div">
      <div> 
        <i class="iconfont icon-tianjia"></i><span> {{increase}}</span>
      </div>
    </router-link>
    <!--删选条件区域-->
     <filterData v-if="showFilter" @getParm="getParm($event)"></filterData>
</div>

`
var billList = Vue.component("billList", {
  template: billList,
  data() {
    return {
      status: 0,
      title: "报销单",
      increase: "新增报销单",
      b_type: "EXPENSE",
      bill_type_list:'EXP_',
      listName: "报销单列表",
      ip:"",
      value: '',
      reimList: [],
      loading: false,
      finished: false,
      pageType: "edit",
      showFilter:false,
      userInfo:{},
      arsearchCondition:{
        appName: "",
        billNo: "",
        billType: "",
        endDate: "",
        inputorId: undefined,
        maxMoney: "",
        minMoney: "",
        reason: "",
        startDate: ""
      }
    }
  },
  created() {
    this.userInfo = JSON.parse(summer.getStorage('userInfo_local'))
    this.ip = summer.getStorage("ip")
    console.log(this.ip)
    let that = this
    this.b_type = this.$route.query.type
    // this.listType = billType
    if (this.b_type == "APPLY") {
      this.increase = "新增申请单"
      this.title = "申请单"
      this.listName = "申请单列表"
      bill_type_list = "APPLY_"
    }
    let hei = px2rem(50) + "rem"
    let fsize = px2rem(16) + "rem"
    this.$nextTick(() => {
        $(".increaseBtn").css({
          'height': hei,
          'position': 'fixed',
          "bottom": "0px",
          "font-size": fsize,
          "line-height": hei
        })
    })
    console.log(this.arsearchCondition)
  },
  updated(){
    this.initMethod(this.status)
  },
  methods: {
    //初始化列表
    initMethod(status){
      if(status == 0 || status == 1) {
        localStorage.setItem("status", status)
      }
      const arsearchCondition = this.arsearchCondition
      var curYear = new Date().getFullYear()
      var startDate
      if (arsearchCondition.startDate == "" || arsearchCondition.startDate == undefined) {
        startDate = curYear + '-01-01';
      } else {
        startDate = arsearchCondition.startDate;
      }
      var endDate
      if (arsearchCondition.endDate == "" || arsearchCondition.endDate == undefined) {
        endDate = curYear + '-12-31';
      } else {
        endDate = arsearchCondition.endDate;
      }
      var wfstatus                  // upstatus,fastatus;
      if (status == 0) {
           wfstatus = "todo";//未提交  
        } else if (status == 1) {
           wfstatus = "done";//已提交
        }
        //权限参数
		//USER_CODE=userInfo.userId&USER_TYPE=userInfo.userType&APP=yes&PARENT_CODE=011
    
		var userTypeNew = this.userInfo.userType == undefined ? "" : this.userInfo.userType;
    var urlParam = "USER_CODE=" + this.userInfo.userId + "&USER_TYPE=" + userTypeNew + 
    "&APP=yes&PARENT_CODE=111";
		urlParam += "&ar-WORKFLOW_STATUS=" + wfstatus;
		urlParam += "&ar-USERID=" + this.userInfo.userId;
		urlParam += "&ar-START_DATE=" + startDate;
		urlParam += "&ar-END_DATE=" + endDate;
		urlParam += "&ar-UID=" + this.userInfo.uid;
		urlParam += "&ar-CLIENT=MOBILE";
		//urlParam += "&BILL_TYPE=EXP_"; //报销单     APPLY_//申请单
		urlParam += `&BILL_TYPE=${this.bill_type_list}`;  
		urlParam += "&ar-CO_CODE=101" //+ this.userInfo.coCode;  //（？？？注释了还加不加）

		if (arsearchCondition.billType != undefined && arsearchCondition.billType != "")
			urlParam += "&ar-billType=" + arsearchCondition.billType;
		if (arsearchCondition.minMoney != undefined && arsearchCondition.minMoney != "")
			urlParam += "&ar-minMoney=" + arsearchCondition.minMoney;
		if (arsearchCondition.maxMoney != undefined && arsearchCondition.maxMoney != "")
			urlParam += "&ar-maxMoney=" + arsearchCondition.maxMoney;
		if (arsearchCondition.appName != undefined && arsearchCondition.appName != "")
			urlParam += "&ar-appName=" + arsearchCondition.appName;
		if (arsearchCondition.appCode != undefined && arsearchCondition.appCode != "")
			urlParam += "&ar-appCode=" + arsearchCondition.appCode;
		if (arsearchCondition.billNo != undefined && arsearchCondition.billNo != "")
			urlParam += "&ar-billNo=" + arsearchCondition.billNo;
		if (arsearchCondition.orgCode != undefined && arsearchCondition.orgCode != "")
			urlParam += "&ar-orgCode=" + arsearchCondition.orgCode; //选择的部门
		if (arsearchCondition.orgName != undefined && arsearchCondition.orgName != "")
			urlParam += "&ar-orgName=" + arsearchCondition.orgName;
		if (arsearchCondition.reason != undefined && arsearchCondition.reason != "")
      urlParam += "&ar-reason=" + arsearchCondition.reason;
      
      console.log(urlParam)
      const url = 'http://' + this.ip + '/FS/services/auditService/getAllAuditData_glga?' + urlParam
      console.log(url)
      $.ajax({
        type : "get",
        async : false,
        url : url,
        error : function(data) {
          console.log(data);
        },
        success : function(data) {
          //console.log(data.rows[1].rows.length)
          console.log(data.rows)
          if (data.resultCode == "1") {
            var userData = data.rows;
            console.log(data);
          } else {
            alert(data.rows);
          }
        }
      });

    },
    //显现筛选框
    filterData(){
        this.showFilter = true
    },
    //获得筛选框中的参数1
    getParm($event){
        console.log($event)
        this.arsearchCondition = $event
    },
    //点击列表进入编辑页
    goEdit(kind) {
      const billType = this.$route.query.type;
      if (billType == "reim") {
        this.$router.push({ path: "/reimburse", query: { type: kind, pageType: this.pageType } })
      } else {
        this.$router.push({ path: "/application", query: { type: kind, pageType: this.pageType } })
      }
    },
    //提交
    submit() {
      alert("提交")
    },
    //删除
    delCard(index) {
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
    processTrack() {
      this.$router.push({ path: '/processTracking' })
    }
  }
})