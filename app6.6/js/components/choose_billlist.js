//选择进入报销单或申请单列表
createScript("./js/components/common/nav.js")
//createScript("./css/components/index.css")
var bills = `

    <div id="win" class="bill">
        <div id="header" class="um-header header">
            <a class="um-header-right" id="msg" @click="goMessageList"><img src="./img/new/news.png">
                <span class="um-badge" id="msgNum" style="display:none; padding: 0px;font-size: 5px;"></span>
            </a>
            <h3>应用</h3>
        </div>
        <div id="content" class="um-content section" style="padding-top: 10px">
            <div style="width: 100%;margin-bottom: 10px;">
                <img src="./img/banner.png" width="100%" alt="" />
            </div>
            <div class="um-grid com-bg" id="menulist">
                <div class="um-grid-row tc" v-for="(item,index) in result" :key='index'>
                    <div class="um-box-center" @click="goList(it.APP_ID)" v-for="(it,index) in item" :key='it.APP_INDEX' :id="it.APP_ID">
                        <div class="menu-box">
                            <img :src="'img/new/'+it.OUT_ICON_M" />
                        </div>
                        <div class="distance">
                            {{it.MENU_NAME}}
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
        <div class="um-footer">
        <div class="um-footerbar">
            <a href="#" id="upComing" class="um-footerbar-item" @click="goUpComing">
                <div class="icon-toDo mb5"><span id="todomsgNum" class="um-badge"
                        style="background:red;color:white; position:relative;margin-left:60px;"></span>
                </div>
                <div class="f12 lh1">
                    待办
                </div>
            </a>

            <a href="#" class="um-footerbar-item active">
                <div class="icon-home mb5"></div>
                <div class="f12 lh1">
                    应用
                </div>
            </a>
            <!-- 	<a href="#" id="item0" class="um-footerbar-item">
            <div class="icon-msg mb5">
                <span class="um-badge" id="msgNum" style="font-size: 10.45px;display:none" ></span>
            </div>
            <div class="f12 lh1">
                消息
            </div> </a> -->
            <a href="#" id="MyInfo" class="um-footerbar-item" @click="goMyInfo">
                <div class="icon-me mb5"></div>
                <div class="f12 lh1">
                    我
                </div>
            </a>
        </div>
    </div>
        <!--  <navBar :title="title"></navBar>
    <div class="flex section">
    <router-link style="font-size:0.01rem" 
    v-for="(item,index) in list" tag="div"  
    :key="index"  class="typeList"  :to="{path:'/billList',query:{type:item.B_TYPE}}">
    <img :src="item.img"/>  
    <span>{{item.name}}</span>
    </router-link>
    </div>-->
    
</div>    
`
var chooseBills = Vue.component("chooseBills", {
    template: bills,
    data() {
        return {
            title: "应用",
            result: [],
            userInfo_local: {},
            url: ''
        }
    },
    created() {
        const ip = summer.getStorage('ip');
        this.url = 'http://' + ip + '/FS'
        const that = this
        this.$nextTick(() => {
            this.updateAppCheck(ip);
            if (summer.getStorage('userInfo_local')) {//有数据
                this.userInfo_local = JSON.parse(summer.getStorage('userInfo_local'));
                this.funcGoto();//显示未读消息条数 也是消息列表页面返回到index页面调用的方法
            } else {//无数据
                summer.openWin({
                    id: 'login',
                    url: 'html/login.html',
                    reload: true,
                    isKeep: false,
                    pageParam: {
                        compoId: '',
                        title: '登录'
                    }
                });
                alert("请先登录");
                return;
            }
            // 根据用户名做权限认证
            //alert("自动登陆,有数据");
            var param = "USER_CODE=" + this.userInfo_local.userId;
            param += "&USER_TYPE=" + summer.getStorage("userType");
            param += "&APP=yes";
            param += "&PARENT_CODE=110";
            $.ajax({
                type: "POST",
                async: false,
                url: "http://" + ip + "/FS/services/roleService/selectUserMenuList?" + param,
                success: function (data) {
                    console.log(data.rows)
                    for (var i = 0; i < data.rows.length; i += 4) {
                        that.result.push(data.rows.slice(i, i + 4));
                    }
                }
            })
        })
        var userInfo = JSON.parse(summer.getStorage('userInfo_local'));
		var	arsearchCondition={};
		arsearchCondition.startDate=$("#startDate").val();
		arsearchCondition.endDate=$("#endDate").val();
		arsearchCondition.billType=$("#billTypeSelect").val();
		arsearchCondition.billNo=$("#billNo").val();
		arsearchCondition.inputorId=$("#inputorId").val();
		arsearchCondition.inputorName=$("#inputorName").val();
		arsearchCondition.minMoney=$("#minMoney").val();
		arsearchCondition.maxMoney=$("#maxMoney").val();
		arsearchCondition.reason=$("#reason").val();
		//if(summer.getStorage('arSearch')){
			//arsearchCondition = JSON.parse(summer.getStorage('arSearch'));
		//}
		var curYear = new Date().getFullYear();
		var startDate;
		if (arsearchCondition.startDate == "" || arsearchCondition.startDate == undefined) {
			startDate = curYear + '-01-01';
		} else {
			startDate = arsearchCondition.startDate;
		}
		var endDate;
		if (arsearchCondition.endDate == "" || arsearchCondition.endDate == undefined) {
			endDate = curYear + '-12-31';
		} else {
			endDate = arsearchCondition.endDate;
		}
		var wfstatus,upstatus,fastatus;
		curStatus = 0;
		if (curStatus == 0) {
			wfstatus = "todo";
			upstatus="unaudit";
			fastatus="1";
			
		} 
		//权限参数
		//USER_CODE=userInfo.userId&USER_TYPE=userInfo.userType&APP=yes&PARENT_CODE=011
		var userTypeNew = userInfo.userType == undefined ? "" : userInfo.userType;
		var urlParam = "USER_CODE=" + userInfo.userId + "&USER_TYPE=" + userTypeNew + "&APP=yes&PARENT_CODE=111";
		urlParam += "&ar-WORKFLOW_STATUS=" + wfstatus;
		urlParam += "&ar-USERID=" + userInfo.userId;
		urlParam += "&ar-START_DATE=" + startDate;
		urlParam += "&ar-END_DATE=" + endDate;
		urlParam += "&ar-UID=" + userInfo.uid;
		urlParam += "&ar-CLIENT=MOBILE";
		//urlParam += "&ar-CO_CODE=" + userInfo.coCode;

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
			urlParam += "&ar-orgCode=" + arsearchCondition.orgCode;
		if (arsearchCondition.orgName != undefined && arsearchCondition.orgName != "")
			urlParam += "&ar-orgName=" + arsearchCondition.orgName;
		if (arsearchCondition.reason != undefined && arsearchCondition.reason != "")
			urlParam += "&ar-reason=" + arsearchCondition.reason;

		//参数2
		urlParam += "&fa-method=mobileInterface/searchTodoOrFinsh";
		urlParam += "&fa-billType=";
		urlParam += "&fa-pageIndex=" + "0";
		urlParam += "&fa-pageSize=" + "1000";
		urlParam += "&fa-status=" + fastatus;
		urlParam += "&fa-keyword=";
		urlParam += "&fa-userId=" + userInfo.userId;
		urlParam += "&fa-isDetail=" + "0";
		
		/********采购************************/
		urlParam += "&up-auditStatus=" + upstatus;
		urlParam += "&up-userId=" + userInfo.userId;
		//urlParam += "&up-userId=fujian" ;
		urlParam += "&up-nd=" + curYear;
		urlParam += "&up-coCode=" + userInfo.coCode;
        urlParam += "&up-CLIENT=MOBILE";
        $.getJSON(this.url + "/services/auditService/getAllAuditData?" + urlParam).success(function(data) {
			$("#todomsgNum").text(data.rows[0].rows.length);
		}).error(function(data){
		});
 

    },
    methods: {
        funcGoto() {
            var param = "senderId=" + this.userInfo_local.userId
            param += "&sendStatus=2&wfStatus=0&isRead=1";
            console.log(param);
            //已发送 审核中 未读
            const messageUrl = this.url + "/services/pushService/getMessageCount?" + param
            $.getJSON(messageUrl, function (data) {
                if (data.resultCode == "1") {
                    if ("0" != data.rows) {
                        $("#msgNum").attr("style", "display:");
                        $("#msgNum").text(data.rows);
                    } else {
                        $("#msgNum").attr("style", "display:none");
                    }
                }
            })
        },
        //消息
        goMessageList(){
            summer.openWin({
                id : 'messageList',
                animation : {
                    type : "none", //动画类型（详见动画类型常量）
                    subType : "from_right", //动画子类型（详见动画子类型常量）
                    duration : 300 //动画过渡时间，默认300毫秒
                },
                url : 'html/messageList.html',
                reload : true,
                pageParam : {
                    title : '信息列表'
                }
            })
        },
        //代办
        goUpComing(){
            summer.openWin({
                id : 'upComing',
                url : 'html/upComing.html',
                reload:true,
                isKeep:false
            });
        },
        //我的
        goMyInfo(){
            summer.openWin({
                id : 'MyInfo',
                url : 'html/MyInfo.html',
                reload:true,
                isKeep:false
            });
        },
        //点击进入对应列表
        goList(id){
              console.log(id)
                if (id) {
                   if(id == "myBillQuery"){
                          console.log(this)
                          this.$router.push({path:'/billList',query:{type:"EXPENSE"}})
                    }else if(id == "myqkBill"){
                          this.$router.push({path:'/billList',query:{type:"APPLY"}})
                    }else{
                        summer.openWin({
                            id : id,
                            url : 'html/' + id + '.html',
                            reload : true,
                            pageParam : {
                                name : 'test'
                            }
                        })
                    }
                }
          
        },
        //根据手机系统类型更新android或者ios应用
        updateMobileApproval(versionData) {
            var os = summer.getSysInfo();
            if (os.systemType == "android") {
                //alert("android:" + versionData.ANDROID_URL);
                var androidUrl = "http://" + versionData.ANDROID_URL + "/FS/app/android/native/install/FS_QUERY.apk";
                //alert(androidUrl);
                summer.upgradeApp({
                    url : androidUrl
                }, function(ret) {
                    //alert("下载更新成功");
                }, function(ret) {
                    alert("下载更新失败");
                });
            } else if (os.systemType == "ios") {
                alert("ios:" + versionData.IOS_URL);
                var iosUrl = "itms-services://?action=download-manifest&url=https://mbs.yyuap.com:443/ump/portalservice/download/" + versionData.IOS_URL + "/FS_Query_IUAP.plist";
                alert(iosUrl);
                summer.upgradeApp({
                    url : iosUrl
                }, function(ret) {
                    //alert("下载更新成功");
                }, function(ret) {
                    alert("下载更新失败");
                });
                return;
            }
        },
        //* APP版本更新检查
        updateAppCheck(ip) {
            console.log(ip)
            $.ajax({
                type: "POST",
                async: false,
                dataType: "json",
                url: "http://" + ip + "/FS/services/appVersionService/getAppVersionInfo?",
                success: function (data) {
                    if (data.resultCode == "1") {
                        var versionData = data.rows;
                        var serverVersionInfo = versionData[0];
                        // 如果当前应用版本和服务器最新版本不一致 则提示是否更新应用
                        var versionInfo = eval("(" + summer.getAppVersion() + ")");
                        //alert("手机版本：" + versionInfo.versionName + "\n" + "服务器版本：" + serverVersionInfo.VERSION_CODE);
                        //var isOK = parseInt(versionData[0].APP_VERSION) > parseInt(versionInfo.versionName);
                        if (serverVersionInfo.VERSION_CODE > versionInfo.versionName) {
                            //alert("可以升级啦!");
                            UM.confirm({
                                title: '软件版本更新',
                                text: '检测到新版本' + serverVersionInfo.VERSION_CODE + '，立即更新？',
                                btnText: ["下次再说", "立即更新"],
                                overlay: true,
                                ok: function () {
                                    updateMobileApproval(serverVersionInfo);
                                },
                                cancle: function () {
                                    return;
                                }
                            });
                        } else {
                            return;
                        }
                    }
                }
            });
        }
    }
})