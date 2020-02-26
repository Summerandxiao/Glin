
var fileList = `
 <div class="detail uploadFile">
    <van-cell :value="fileInfo.item.infoName" />
   
   <van-swipe-cell v-if="fileList" v-for='(item,index) in fileList' :key="index">
        <van-cell :border="false" :title="item.name" />
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
                <van-uploader multiple capture :after-read="afterRead">
                    <p class='tc' id="addFile">添加附件</p>
                </van-uploader>
				<p class='tc' id="photograph">拍照</p>
				<p class="tc"  style="margin-top:50px">
					<button id="cancel" type="button" class="btn btn-inline" style="">
						取消
					</button>
				</p>
			</div>
        </div>
        </van-dialog>  
    <!--预览图片区域-->
    <van-dialog v-model="show" style="height:70%;" title="预览" show-cancel-button>
        <img  :src="src">
    </van-dialog>
</div>    `

Vue.component('fileList', {
    props: ["fileInfo"],
    template: fileList,
    data() {
        return {
            blockTitle: "附件信息",
            show: false,
            src: "",
            fileList: [
                // {title:"夜的尽头"},
                // {title:"勋章"},
                // {title:"我们的明天"}
            ]
        }
    },
    created() {
        //上传附件按钮
        let diaLogHei = px2rem(190) + "rem"
        let tcHei = px2rem(46) + "rem"
        this.$nextTick(() => {
            $('#uploadfile').on('click', function () {
                $('.dialog').css('bottom', `-${diaLogHei}`)
                $('.mark1').show();
                $(".dialog").css({ 'height': diaLogHei })
                $(".tc").css({ 'height': tcHei, "line-height": tcHei })
                setTimeout(function () {
                    $('.dialog').css('bottom', '0')
                }, 50);
            })
            //取消
            $('#cancel').on('click', function () {
                $('.mark1').hide();
                $('.dialog').css('bottom', diaLogHei)
            })
            //上传附件
            //   $('#addFile').on('click', function(){
            //       summer.openPhotoAlbum({
            //           type : "multiple",//支持选多张图片
            //           callback : function (args){
            //               summer.toast({
            //                   msg: args.imgPath
            //               });
            //           }
            //       })
            //   })
        })

    },

    methods: {
        //上传附件
        afterRead(name) {
            let diaLogHei = px2rem(190) + "rem"
            console.log(name)
            if (Array.isArray(name)) {
                name.forEach(item =>
                    this.fileList.push({ name: item.file.name, type: item.file.type, content: item.content })
                )
            } else {
                this.fileList.push({ name: name.file.name, type: name.file.type, content: name.content })
            }
            $('.mark1').hide();
            $('.dialog').css('bottom', diaLogHei)
        },
        //预览
        downFile(index) {
            this.show = true
            this.src = this.fileList[index].content



        },
        //删除
        delFile(index) {
            this.$dialog.confirm({
                message: '确定删除吗？'
            }).then(() => {
                this.fileList.splice(index, 1)
                console.log(this)
            }).catch(() => {
                // on cancel
            })
        }

    }

}) 