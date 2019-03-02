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
      <li class="li">
        <span>传输数据字节数：</span>
        <span class="fr">{{info.report_type_total}}</span>
      </li>
      <li class="li">
        <span>传输数据条数：</span>
        <span class="fr">{{info.report_total}}</span>
      </li>
      <li class="li">
        <span>计数重置日期：</span>
        <span class="fr">{{info.report_count_reset_time | nyr}}</span>
      </li>
      <li class="li" v-on:click="showMark">
        <span class="btn">温湿度校准</span>
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
        @blur="bulrs"
      />
    </div>
    <div class="dialog_sd">
      <van-dialog
        v-model="markStatus"
        show-cancel-button
        :before-close="SDbeforeClose"
      >
        <van-field
          v-model="tOffset"
          label="温度修正"
          placeholder="请输入两位小数"
          @blur="bulrs"
          
        />
        <van-field
          v-model="hOffset"
          label="湿度修正"
          placeholder="请输入两位小数"
          @blur="bulrs"
        />
      </van-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Dialog ,Loading ,Toast,Actionsheet,Button} from 'vant'
import {get,post} from '../../src/util/http.js'

export default {
  name: 'xq',
  components: {
   Dialog,
   Actionsheet,
   Button
  },
  filters:{
    nyr (val){
      if(!val) return
      var d=new Date(val);
      var year=d.getFullYear();
      var month=change(d.getMonth()+1);
      var day=change(d.getDate());
      var hour=change(d.getHours());
      var minute=change(d.getMinutes());
      var second=change(d.getSeconds());
      function change(t){
        if(t<10){
          return "0"+t;
        }else{
          return t;
        }
      }
      var time=year+'-'+month+'-'+day+'        '+hour+':'+minute+':'+second;
      return time
    },
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

        default:
        var hours = parseInt((val % (60 * 60 * 24)) / (60 * 60));
        var minutes = parseInt((val % ( 60 * 60)) / (60));
        var seconds = (val % (60));
        var time = ''
        if(hours>0){
          time=hours+'小时 '
        }
        if(minutes>0){
          time+=(minutes+'分钟 ')
        }
        if(seconds){
          time+=(seconds+'秒')
        }
        return  time
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
    showMark (){
      this.markStatus=true
    },
    hideMark(){
      this.markStatus=false
    },
    edit(){
      this.show=true
    },
    cancel(){
      this.hideMark()
    },
    enter(){

    },
    SDbeforeClose(action, done){
      if(action=='confirm'){
        // setTimeout(done, 1000);
        this.checkoutSD(done)
      }else{
        done()
      }
    },
    checkoutSD(cb){
      let callback=cb|| function(){}
      if(this.tOffset===''){
        Toast('湿度修正不能为空')
        callback(false)
        return
      }

      if(this.hOffset===''){
        Toast('湿度修正不能为空')
        callback(false)
        return
      }

      if(!this.isNumber(this.tOffset)){
        Toast('请输入正确的温度校准值')
        callback(false)
        return
      }
      if(!this.isNumber(this.hOffset)){
        Toast('请输入正确的湿度校准值')
        callback(false)
        return
      }

      // 保留两位小数 不做四舍五入 
      this.tOffset=this.toFixedTow(this.tOffset)
      this.hOffset=this.toFixedTow(this.hOffset)

      // 换成number
      this.tOffset=parseFloat(this.tOffset)
      this.hOffset=parseFloat(this.hOffset)

      if(this.tOffset<-30){
        Toast('温度校准下线不能小于-30.00')
        callback(false)
        return
      }
      if(this.tOffset>30){
        Toast('温度校准上线不能大于30.00')
        callback(false)
        return
      }
      if(this.hOffset<-30){
        Toast('湿度校准下线不能小于-30.00')
        callback(false)
        return
      }
      if(this.hOffset>30){
        Toast('湿度校准上线不能大于30.00')
        callback(false)
        return
      }
      if(this.hOffset==this.info.humidity_offset && this.tOffset==this.info.temperature_offset){
        Toast('于当前校准值相同，不能修改。')
        callback(false)
        return
      }
      this.loading=true
      this.submitOffset(callback)

    },
    submitOffset(cb){
      let callback=cb || function(){}
      let param={
          temperatureOffset :this.tOffset,
          humidityOffset :this.hOffset,
          reportCountReset:1,
          deviceId :this.info.device_id,
        }
      console.log(param)
      post('/device/update',param).then((res)=>{
        if(res.code==10000){
          callback && callback()
          Toast('修改成功！')
          this.loading=false
          this.info.humidity_offset=this.hOffset
          this.info.temperature_offset=this.tOffset
        }else {
          Toast('修改失败，稍后再试！')
          this.loading=false
        }
      }).catch((res)=>{
        this.loading=false
        Toast('修改失败，稍后再试！')
      })
    },
    isNumber(val){
      let regPos = /^\d+(\.\d+)?$/; //非负浮点数
      let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if(regPos.test(val) || regNeg.test(val)){
        return true;
      }else{
        return false;
      }
    },
    toFixedTow(val){
      let reg = /([0-9]+.[0-9]{2})[0-9]*/;
      val=(val+'').replace(reg,"$1")
      return val
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
          this.editname=this.info.name
          this.tOffset=this.info.temperature_offset
          this.hOffset=this.info.humidity_offset
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
      mod:[],
      markStatus:false,
      tOffset:'', // 温度偏移量
      hOffset:'' // 湿度偏移量
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
  z-index: 10;
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

.xz_wrap {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 85%;
  background: #fff;
  transition: .3;
  border-radius: 4px;
  font-size: 16px;
  overflow: hidden;
  transition: .3s;
  z-index: 2000;
  padding: 10px;
}

.xz_wrap .wd,.xz_wrap .sd {
  /* height: 40px; */
  padding: 5px 0px;
}

.xz_wrap span {
  font-size: 14px;
  float: left;
  line-height: 30px;
  line-height: 30px;
}
.xz_wrap input {
  border: 0;
  margin: 0;
  padding: 0;
  resize: none;
  width: 60px;
  border: 1px solid #999;
  border-radius: 4px;
  float: left;
  line-height: 30px;
  line-height: 30px;
  padding: 0 6px;
}

.xz_wrap .text {
  margin: 0 .2rem 0 1rem;
}
.xz_wrap .jg {
  margin: 0 4px;
}

.btn_wrap .btn {
  float: left;
  width: 50%;
  height: 40px;
  line-height: 40px;
  position: relative;
}

.btn_wrap .btn::before{
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  width: 100%;
  height: 100%;
  border: inherit;
  border-color: #000;
  background-color: #000;
  border-radius: inherit;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}

.gl {
  color: #00c000;
}

.btn_wrap .btn:active::before {
  opacity: .3;
}

.li {
  position: relative;
}

.btn {
  background:#00c000;
  display: block;
  width: 200px;
  height: 1rem;
  width: 2.666667rem;
  color: #fff;
  text-align: center;
  line-height: 1rem;
  border-radius: 30px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0,-50%);
}
</style>
