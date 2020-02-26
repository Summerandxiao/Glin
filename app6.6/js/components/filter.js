//筛选条件
var filterData = `
<div id="arconditions" class="conditions clearfix">
		<div class="clearfix" style="padding: 0 10px">
			<ul class="um-list" style="margin-top: 10px;">
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								起始日期
							</div>
							<div class="um-list-item-right">
								<input id="startDate" type="date" name="date" class="form-control">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								结束日期
							</div>
							<div class="um-list-item-right">
								<input id="endDate" type="date" name="date" class="form-control">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner" style="position:relative;">
							<div class="um-list-item-left pl10">
								部门
							</div>
							<div class="um-list-item-right">
								<input type="text" ng-click="filterShow = !filterShow" ng-model="filterBumen" class="form-control" id="orgName">
							</div>
						</div>
					<!--	<div id="filterTree" ng-show="filterShow">
							<ul>
								<li data-id="{{filterWinBuMenData[0].id}}">
									<p>
										<span class="icon"></span><b>{{filterWinBuMenData[0].text}}</b>
									</p>
									<ul ng-show="filterWinBuMenData.children.length != 0">
										<li ng-repeat="item in filterWinBuMenData[0].children | filter:filterBumen">
											<p data-id="{{item.id}}">
												<span class="icon"></span><b>{{item.id+item.text}}</b>
											</p>
											<ul ng-show="item.children.length != 0">
												<li ng-repeat="it in item.children | filter:filterBumen">
													<p data-id="{{it.id}}"  ng-click="fuzhi(it)">
														<span class="icon"></span><b>{{it.id+it.text}}</b>
													</p>
												</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</div>-->
					</div>
				</li>
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								单据类型
							</div>
							<div class="um-list-item-right" >
								<!-- <input type="text"  id='billTypeSelect_dummy'/> -->
								<select id='billTypeSelect' class="itemSelect form-control">
									<option value="">全部</option>
								</select>
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								单据号
							</div>
							<div class="um-list-item-right">
								<input type="text" class="form-control" id="billNo">
							</div>
						</div>
					</div>
				</li>
				<!-- <li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								报销人编码
							</div>
							<div class="um-list-item-right">
								<input type="text" class="form-control" id="inputorId">
							</div>
						</div>
					</div>
				</li> -->
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								报销人
							</div>
							<div class="um-list-item-right">
								<input type="text" class="form-control" id="inputorName">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								金额
							</div>
							<div class="um-list-item-right">
								<input type="text" style="width: 60px;" class="form-control" placeholder="最小金额" id="minMoney">
							</div>
								—
							<div class="um-list-item-right">
								<input type="text" style="width: 60px;margin-left:13px" class="form-control" placeholder="最大金额" id="maxMoney">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="um-list-item">
						<div class="um-list-item-inner">
							<div class="um-list-item-left pl10">
								事由
							</div>
							<div class="um-list-item-right">
								<!-- <textarea id="reason" style="height:80px;padding: 10px 0;" class="form-control" ></textarea>  -->
								<input id="reason" type="text" class="form-control" >
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div class="btn-group" style="width: 200px;left: 50%;margin:10px;margin-left: -100px;">
				<button type="button" class="btn btn-inline" style="width: 33%" onclick="$('#arconditions').hide()">
					取消
				</button>
				<button type="button" class="btn btn-inline" style="width: 33%" ng-click="clearArSearch()">
					重置
				</button>
				<button type="button" class="btn btn-inline" style="width: 33%" @click="confirm">
					确定
				</button>
			</div>
		</div>
	</div>

`
var filterData = Vue.component("filterData", {
   template: filterData,
   data() {
      return {
        arsearchCondition:{},

         list: [
            // { title: "差旅费报销单", billType: "EXP_TRIP", img: "../img/toDo.png" },
            // { title: "车辆维修报销单", billType: "EXP_TRAFFIC", img: "../img/ckhs.png" },
            // { title: "个人经费报销单", billType: "EXP_OUTLAY_GR", img: "../img/sjqk.png" },
            // { title: "项目经费报销单", billType: "EXP_OUTLAY", img: "../img/zfcg.png" }
         ]
      }
   },
   mounted() {
      
   },
   methods:{
    confirm(){
        getArSearch(this.arsearchCondition)
        console.log(this.arsearchCondition)
          this.$emit("getParm",this.arsearchCondition)
          $('#arconditions').hide()
    }
   }
  
})