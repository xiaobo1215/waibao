<template>
  <div class="details">
    <!-- <p class="title">设备详情</p> -->
    <ul class="wrap">
      <li class="li">
        <span>设备ID：</span>
        <span class="fr">{{info.device_id}}</span>
      </li>
      <li class="li" v-on:click="edit">
        <span>设备名称：</span>
        <span class="fr h80">{{info.name}} <span class="fontFamily hht-xiugai-copy aling"></span></span>
      </li>
      <li class="po_re li">
        <span>采集间隔 </span>
        <span class="fr line" v-on:click="cjEdit">{{ info.sampling_interval | formattingType}} <span class="fontFamily hht-xiugai-copy aling"></span></span>
      </li>
      <li class="po_re li" >
        <span>上报间隔 </span>
        <span class="fr line" v-on:click="updateEedit">{{ info.upload_interval | formattingType}} <span class="fontFamily hht-xiugai-copy aling"></span></span>
      </li>
      <li class="li" v-on:click="qrcode">
        <span>二维码：</span>
        <span class="fr fontFamily hht-QRcode"></span>
      </li>
      <li class="li">
        <span>MAC地址：</span>
        <span class="fr">{{info.mac_address}}</span>
      </li>
      <li class="li">
        <span>固件版本：</span>
        <span class="fr">{{info.report_parse_version}}</span>
      </li>
      <li class="li">
        <span>设备类型：</span>
        <span class="fr">{{info.report_parse_version_high}}</span>
      </li>
      
      <li class="li" v-on:click="deleteSb">
        <span>删除设备：</span>
        <span class="fr fontFamily hht-shanchu"></span>
      </li>
    </ul>
    <!-- 弹出修改框 -->
    <div class="dialog">
      <van-dialog
        v-model="show"
        show-cancel-button
        :before-close="beforeClose"
        :title="'修改设备名称'"
        @confirm="onConfirm"
      >
        <van-field
          v-model="editname"
          label="新名称："
          placeholder= ''
          @blur="bulrs"
        />
      </van-dialog>
    </div>
    <!-- 二维码 -->
    <transition name="fade">
      <div class="qc" v-if="qcshow" v-on:click="hideqe">
        <div class="img_wrap">
          <img v-bind:src="info.qr_code" alt=""/>
        </div>
      </div>
    </transition>
    <div class="" style="display:none">
      <img v-bind:src="info.qr_code" alt=""/>
    </div>
    <div class="load" v-if="loading">
      <van-loading color="#c1c1c1" size="40px"/>
    </div>
    <div>
      <van-actionsheet
        v-model="showMod"
        :actions="mod"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Dialog ,Loading ,Toast,Actionsheet} from 'vant'
import {get,post} from '../../src/util/http.js'

export default {
  name: 'xq',
  components: {
   Dialog,
   Actionsheet
  },
  filters:{
    formattingType(val){
      if(typeof val !='number') return val
      switch(val)
      {
        case 3600:
        return '1小时'
        break;

        case 1800:
        return '30分钟'
        break;

        case 300:
        return '5分钟'
        break;

        case 60:
        return '1分钟'
        break;

        case 600:
        return '10分钟'
        break;

        case 21600:
        return '6个小时'
        break;

        case 43200:
        return '12个小时'
        break;

        case 86400:
        return '24个小时'
        break;
      }
    }
  },
  methods:{
    bulrs(){
      // 微信6.7.4bug
      window.scrollTo(0,0)
    },
    deleteSb(){
      Dialog.confirm({
        title: '确定删除?',
        message: '删除后将不在展示该设备'
      }).then(() => {
        this.loading=true
        // on confirm
        get('/device/deleleDevice',{wxUserDeviceId:this.deviceId}).then((res)=>{
          if(res.code==10000){
            this.loading=false
            Toast('老板，再见...')
            this.$router.back()
          }else {
            this.loading=false
            Toast('哈哈，没珊掉我..')
          }
        }).catch((e)=>{
          this.loading=false
          Toast('哈哈，没珊掉我..')
          console.log(e)
        })
      }).catch(() => {
        // on cancel
        Toast('谢手下留情...')
      });
    },
    edit(){
      this.show=true
    },
    // 采集编辑
    cjEdit(){
      let data=[
        {
          name:'1分钟',
          val:60,
          type:'cj'
        },
        {
          name:'5分钟',
          val:300,
          type:'cj'
        },
        {
          name:'10分钟',
          val:600,
          type:'cj'
        },
        {
          name:'1小时',
          val:3600,
          type:'cj'
        }
      ]
      this.mod=data
      this.showMod = true;
    },
    // 上报间隔
    updateEedit(){
      //  10 30 1 12
      let data=[
        {
          name:'10分钟',
          val:600,
          type:'sb'
        },
        {
          name:'30分钟',
          val:1800,
          type:'sb'
        },
        {
          name:'1小时',
          val:3600,
          type:'sb'
        },
        {
          name:'12小时',
          val:43200,
          type:'sb'
        }
      ]
      this.mod=data
      this.showMod = true;
    },
    onSelect(item){
      console.log(item)
      let _this=this
      if(item.type=='cj'){
        this.loading=true
        this.samplingInterval=item.val
        let cb=function(){
          _this.loading=false
           _this.showMod=false
          _this.info.sampling_interval=item.val
        }

        this.submitParam(cb)
      }else if(item.type=='sb'){
        this.loading=true
        this.uploadInterval=item.val
        let cb=function(){
          _this.showMod=false
          _this.loading=false
          _this.info.upload_interval=item.val
        }
        this.submitParam(cb)
      }
    },
    submitParam(cb,cbb){
      let callback=cb || function(){}
      let param={
          deviceId :this.info.device_id,
          openId:Cookies.get('openId'),
          samplingInterval:this.samplingInterval,
          uploadInterval:this.uploadInterval
      }
      console.log(param)
      post('/device/setting/hardware',param).then((res)=>{
        if(res.code==10000){
          callback && callback()
          Toast('修改成功！')
          this.loading=false
        }else {
          Toast('修改失败，稍后再试！')
          this.loading=false
        }
      }).catch((res)=>{
        console.log(res,'-----------------')
        this.loading=false
        Toast('修改失败，稍后再试！')
      })
    },
    beforeClose(action, done){
      // console.log(arguments,'-----------')
      console.log('----------')
      if(action=='confirm'){
        // setTimeout(done,1000)
        this.editorName(done)
      }else {
        done()
      }
    },
    onConfirm(){
      // console.log(e)
    },
    qrcode(){
      this.qcshow=true
    },
    hideqe(){
      this.qcshow=false
    },
    getData(){
      get('/device/view',{wxUserDeviceId:this.deviceId}).then((res)=>{
        if(res.code==10000){
          this.info=res.data
          this.editname=  this.info.name
          console.log(this.currentname,'--------------this.currentname----------')
        }
      
      }).catch((e)=>{
        console.log(e)
      })
    },
    editorName(done){
      let cb = done || function(){}
      if( this.info.name == this.editname){
        Toast('与当前名字相同,不能修改')
        cb(false)
        return
      }
      if(this.editname==''){
        Toast('不能为空,不能修改')
        cb(false)
        return
      }
      post('/device/update',{
        name:this.editname,
        deviceId:this.info.device_id
      }).then((res)=>{
        this.info.name=this.editname
        this.editname=""
        cb()
      }).catch(function(e){
        console.log(e,'------------')
      })
    }
  },
  data(){
    return {
      params:this.$route.params,
      show:false,
      editname:'',
      qcshow:false, // 二维码显示隐藏
      info:{},
      loading:false,
      showMod:false,
      mod:[]
    }
  },
  mounted(){
    this.deviceId=this.params.id
    this.getData()
    console.log(this.params.id,'-----------params')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.details {
  width: 100%;
  height: 100%;
}

.details .title {
  font-size: .4rem;
  padding: .4rem;
  text-align: center;
}


.details ul {
  padding: .133rem .4rem .133rem .4rem;
}
.details ul li {
  height: 1.333rem;
  line-height: 1.333rem;
  border-bottom: 1px solid #c6c6c6;
  text-align: left;
  font-size: .4rem;
}

.details ul li .aling {
  vertical-align: middle;
}

.details ul li .h80 {
  height: 80%;
}

.qc {
  position: fixed;
  width: 100%;
  height: 100%;
  top:0px;
  background: #333;
  opacity: .8;
}

.img_wrap {
  position: absolute;
  width: 5.333rem;
  height: 5.333rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%)
}

.img_wrap  img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: .187rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.line {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(0,-50%)
}

.po_re {
  position: relative;
}

</style>
