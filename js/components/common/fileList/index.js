var fileList = `
 <div class="detail">
    <van-cell :value="blockTitle" />
    <van-swipe-cell v-for='(item,index) in fileList' :key="index">
        <van-cell :border="false" :title="item.title" />
        <template slot="right">
            <van-button square type="primary" text="预览" @click="downFile(index)"/>
            <van-button square type="danger" text="删除" @click="delFile(index)"/>
        </template>
    </van-swipe-cell>
    <div class="increaseBtn" id="uploadfile">
        <i class="iconfont icon-tianjia"></i>
        <span>新增{{blockTitle}}</span>
    </div>
    <div class="mark1">
			<div class="dialog">
              <!--	<p class='tc' id="addFile">添加附件</p> -->
              <p class='tc' id="addFile">添加附件</p>
				<p class='tc' id="photograph">拍照</p>
				<p class="tc"  style="margin-top:50px">
					<button id="cancel" type="button" class="btn btn-inline" style="">
						取消
					</button>
				</p>
			</div>
        </div>
        </van-dialog>
</div>    `
 
  Vue.component('fileList',{
     template:fileList,
	  data(){
		  return{
            blockTitle:"附件信息",
            fileList:[
                {title:"夜的尽头"},
                {title:"勋章"},
                {title:"我们的明天"}
            ]
		  }
      },
      created(){
          //上传附件按钮
          let diaLogHei = px2rem(190)+"rem"
          let tcHei = px2rem(46)+"rem"
          this.$nextTick(()=>{
            $('#uploadfile').on('click', function(){
                // if(billId == "undefined" || billId == null || billId == ""){
                //     UM.alert("请先进行保存操作");
                // }else{
                    $('.dialog').css('bottom',`-${diaLogHei}`)
                    $('.mark1').show();
                    $(".dialog").css({'height':diaLogHei})
                    $(".tc").css({'height':tcHei,"line-height":tcHei})
                    setTimeout(function(){
                        $('.dialog').css('bottom','0')
                    },50);
                // }		
            })
            //取消
            $('#cancel').on('click', function(){
                $('.mark1').hide();
                $('.dialog').css('bottom',diaLogHei)
            })
              //上传附件
          $('#addFile').on('click', function(){
              summer.openPhotoAlbum({
                  type : "multiple",//支持选多张图片
                  callback : function (args){
                      summer.toast({
                          msg: args.imgPath
                      });
                  }
              })
          })
          })
        
    },
   
        methods: {
            //预览
            downFile(){
               alert("预览功能")
            },
            //删除
            delFile(index){
                this.$dialog.confirm({
                    message: '确定删除吗？'
                  }).then(() => {
                      this.fileList.splice(index,1)
                      console.log(this)
                  }).catch(() => {
                    // on cancel
                  })
            }
            
          }
     
  }) 