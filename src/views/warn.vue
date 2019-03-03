<template>
  <div class="warn">
    <p class="title">数据设置</p>
    <ul>
      <li>
        <span>报警开关</span>
        <span class="fr mar"><van-switch :value="checked" size="24px" @input="onInput" /></span>
      </li>
      <li>
        <span>报警间隔 </span>
        <span class="fr" v-on:click="alarmEdit">{{ info.alarm_interval | formattingType}} <span class="fontFamily hht-xiugai-copy aling"></span></span>
      </li>
      <!-- <li>
        <span>采集间隔 </span>
        <span class="fr" v-on:click="cjEdit">{{ info.sampling_interval | formattingType}} <span class="fontFamily hht-xiugai-copy aling"></span></span>
      </li>
      <li>
        <span>上报间隔 </span>
        <span class="fr" v-on:click="updateEedit">{{ info.upload_interval | formattingType}} <span class="fontFamily hht-xiugai-copy aling"></span></span>
      </li>-->
      <li class="setmod">
        <span>正常温度范围℃</span>
        <span class="fr " v-on:click="modificationWenDu"><span>{{info.temperature_low}}℃ </span> ~ <span >{{info.temperature_high}}℃<span  class="fontFamily hht-xiugai-copy aling"></span> </span>  </span>
      </li>
      <li>
        <span>正常湿度范围</span>
        <span class="fr " v-on:click="modificationSD"><span>{{info.humidity_low}}%RH</span> ~ <span >{{info.humidity_high}}%RH<span  class="fontFamily hht-xiugai-copy aling"></span> </span>  </span>
      </li>
      <li class="btn_wrap">
        <span class="default_btn" v-on:click="setDefault1">恢复正常温度范围</span>
        <span class="default_btn" v-on:click="setDefault2">恢复正常湿度范围</span>
      </li>
    </ul>
    <div>
      <van-actionsheet
        v-model="show"
        :actions="mod"
        @select="onSelect"
      />
    </div>

    <div class="load" v-if="loading">
      <van-loading color="#c1c1c1" size="40px"/>
    </div>

    <div class="dialog_wd">
      <van-dialog
        v-model="wdDialogShow"
        show-cancel-button
        :before-close="WDbeforeClose"
      >
        <van-field
          v-model="temperatureLow"
          label="温度下线"
          placeholder="请输入两位小数"
          ref="ref1"
          @blur="bulrs"
        />
        <van-field
          v-model="temperatureHigh"
          label="温度上线"
          placeholder="请输入两位小数"
          ref="ref2"
          @blur="bulrs"
        />
      </van-dialog>
    </div>
    <div class="dialog_sd">
      <van-dialog
        v-model="sdDialogShow"
        show-cancel-button
        :before-close="SDbeforeClose"
      >
        <van-field
          v-model="humidityLow"
          label="湿度下线"
          placeholder="请输入两位小数"
          ref="ref3"
          @blur="bulrs"
          
        />
        <van-field
          v-model="humidityHigh"
          label="湿度上线"
          placeholder="请输入两位小数"
           ref="ref4"
           @blur="bulrs"
        />
      </van-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {get,post} from '../../src/util/http.js'
import { Switch ,Dialog,Actionsheet,Loading,Toast} from 'vant'

export default {
  name: 'warn',
  components: {
    Switch,
    Dialog,
    Loading,
    Toast,
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
      setTimeout(()=>{
        if(document.activeElement.tagName=='INPUT' || document.activeElement.tagName=='input'){

        }else {
          window.scrollTo(0,0)
        }
      })
      
    },
    onInput(checked){
      Dialog.confirm({
        title: '提醒',
        message: '是否切换开关？'
      }).then(() => {
        this.loading=true
        this.switchBtn()
      }).catch((e)=>{
        console.log(e)
      });
    },
    switchBtn (){
      post('/device/setting/software',{
        wxUserDeviceId:this.deviceId,
        alarmSwitch:!this.checked
      }).then((res)=>{
        if(res.code==10000){
          this.checked = !this.checked;
          this.loading=false
        }else {
          this.loading=false
          Toast('切换失败，稍后再试！')
        }
      }).catch((res)=>{
        this.loading=false
        Toast('切换失败，稍后再试！')
      })
    },
    onSelect(item){
      console.log(item)
      let _this=this
      if(item.type=='cj'){
        console.log('采集')
        this.loading=true
        this.samplingInterval=item.val
        let cb=function(){
          _this.show=false
          _this.loading=false
          _this.info.sampling_interval=item.val
          _this.samplingInterval=''
        }

        this.submitParam(cb)
      }else if(item.type=='bj'){
        console.log('报警')
        this.loading=true
        this.alarmInterval=item.val
        let cb=function(){
          _this.show=false
          _this.loading=false
          _this.info.alarm_interval=item.val
          _this.alarmInterval=''
        }
        this.submitParam(cb)
      }else if(item.type=='sb'){
        console.log('上报')
        this.loading=true
        this.uploadInterval=item.val
        let cb=function(){
          _this.show=false
          _this.loading=false
          _this.info.upload_interval=item.val
          _this.uploadInterval=''
        }
        this.submitParam(cb)
      }
    },
    edit(){
      this.show = true;
    },

    setModelVal(){
      this.temperatureHigh=this.info.temperature_high
      this.temperatureLow=this.info.temperature_low

      this.humidityHigh=this.info.humidity_high
      this.humidityLow=this.info.humidity_low
    },

    // 修改温度范围
    modificationWenDu(){
      this.wdDialogShow=true
      this.setModelVal()
    },

    // 校验温度 范围是否合法
    checkoutWD(cb){

      let callback=cb|| function(){}
      
      if(this.temperatureLow===''){
        console.log(this.temperatureLow,'----')
        Toast('温度下限不能为空')
        cb(false)
        return
      }

      if(this.temperatureHigh===''){
        Toast('温度上限不能为空')
        cb(false)
        return
      }

      if(!this.isNumber(this.temperatureLow)){
        Toast('请输入正确的温度下线')
        cb(false)
        return
      }

      if(!this.isNumber(this.temperatureHigh)){
        Toast('请输入正确的温度上线')
        cb(false)
        return
      }

      // 保留两位小数 不做四舍五入 
      this.temperatureHigh=this.toFixedTow(this.temperatureHigh)
      this.temperatureLow=this.toFixedTow(this.temperatureLow)

      // 换成number
      this.temperatureHigh=parseFloat(this.temperatureHigh)
      this.temperatureLow=parseFloat(this.temperatureLow)

      if(this.temperatureLow<-655.36){
        Toast('下线不能小于-655.36')
        cb(false)
        return
      }

      if(this.temperatureHigh>655.35){
        Toast('上线不能大于655.35')
        cb(false)
        return
      }

      if(this.temperatureHigh<this.temperatureLow){
        console.log(this.temperatureHigh,'------------',this.temperatureLow)
        Toast('下线不能大于上线')
        cb(false)
        return
      }

      if(this.temperatureHigh===this.temperatureLow){
        console.log(this.temperatureHigh,'------------',this.temperatureLow)
        Toast('下线不能等于上线')
        cb(false)
        return
      }


      console.log(this.temperatureHigh,'------',this.info.temperature_high,'校验合格',this.temperatureLow,'-----',this.info.temperature_low)
      if(this.temperatureHigh==this.info.temperature_high && this.temperatureLow==this.info.temperature_low){
        Toast('与当前值一致,不能提交...')
        cb(false)
        return
      }

      let _this=this
      let cbb=function(){
        _this.info.temperature_low=_this.temperatureLow
        _this.info.temperature_high=_this.temperatureHigh
        _this.temperatureLow=_this.temperatureLow
        _this.temperatureHigh=_this.temperatureHigh
      }
      this.submitParam(cb,cbb)
    },

    toFixedTow(val){
      let reg = /([0-9]+.[0-9]{2})[0-9]*/;
      val=(val+'').replace(reg,"$1")
      return val
    },

    // 校验湿度 范围是否合法
    checkoutSD(cb){
      let callback=cb|| function(){}
      // humidityHigh:'',//  湿度上限 
      // humidityLow :'',//  湿度下限 
      if(this.humidityLow===''){
        Toast('湿度下限不能为空')
        cb(false)
        return
      }

      if(this.humidityHigh===''){
        Toast('湿度上限不能为空')
        cb(false)
        return
      }

      if(!this.isNumber(this.humidityLow)){
        Toast('请输入正确的湿度下线')
        cb(false)
        return
      }

      if(!this.isNumber(this.humidityHigh)){
        Toast('请输入正确的湿度上线')
        cb(false)
        return
      }

      // 保留两位小数 不做四舍五入 
      this.humidityLow=this.toFixedTow(this.humidityLow)
      this.humidityHigh=this.toFixedTow(this.humidityHigh)

      // 换成number
      this.humidityLow=parseFloat(this.humidityLow)
      this.humidityHigh=parseFloat(this.humidityHigh)

      if(this.humidityLow<0){
        Toast('下线不能小于0')
        cb(false)
        return
      }

      if(this.humidityHigh>100){
        Toast('上线不能大于100')
        cb(false)
        return
      }

      if(this.humidityHigh<this.humidityLow){
        console.log(this.humidityHigh,'------范围------',this.humidityLow)
        Toast('下线不能大于上线')
        cb(false)
        return
      }

      if(this.humidityHigh===this.humidityLow){
        console.log(this.humidityHigh,'------范围------',this.humidityLow)
        Toast('下线不能等于上线')
        cb(false)
        return
      }

      console.log(this.humidityHigh,'-----',this.info.humidity_high,'校验合格',this.humidityLow,'----',this.info.humidity_low)

      if(this.humidityHigh==this.info.humidity_high && this.humidityLow==this.info.humidity_low){
        Toast('与当前值一致,不能提交...')
        cb(false)
        return
      }

      var _this=this
      let cbb=function(){
        _this.info.humidity_low=_this.humidityLow
        _this.info.humidity_high=_this.humidityHigh
        _this.humidityLow=_this.humidityLow
        _this.humidityHigh=_this.humidityHigh
      }
      this.submitParam(cb,cbb)

    },

    WDbeforeClose(action,done){
      if(action=='confirm'){
        this.checkoutWD(done)
        // setTimeout(done, 1000);
      }else{
        done()
      }
    },
    SDbeforeClose(action,done){
      if(action=='confirm'){
        // setTimeout(done, 1000);
        this.checkoutSD(done)
      }else{
        done()
      }
    },

    unInfo(opt){
      let obj=opt || {}
      // if(obj.samplingInterval){
      //   this.info.
      // }
    },

    submitParam(cb,cbb){
      let callback=cb || function(){}
      let callbackb=cbb || function(){}
      let param={
          deviceId :this.info.device_id,
          openId:Cookies.get('openId'),
          samplingInterval:this.samplingInterval,
          uploadInterval:this.uploadInterval,
          alarmInterval:this.alarmInterval,
          temperatureHigh:this.temperatureHigh,
          temperatureLow:this.temperatureLow,
          humidityHigh:this.humidityHigh,
          humidityLow :this.humidityLow
      }
      console.log(param)
      post('/device/setting/hardware',param).then((res)=>{
        if(res.code==10000){
          callback && callback()
          callbackb && callbackb()
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
    modificationSD(){
      this.sdDialogShow=true
      this.setModelVal()
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
    getData(){
      get('/device/view',{wxUserDeviceId:this.deviceId}).then((res)=>{
        if(res.code==10000){
          this.info=res.data
          this.temperatureHigh=res.data.temperature_high
          this.temperatureLow=res.data.temperature_low

          this.humidityHigh=res.data.humidity_high
          this.humidityLow=res.data.humidity_low

          this.checked=res.data.alarm_switch
          this.loading=false
        }
      }).catch((e)=>{
        console.log(e)
      })
    },

    // 报警编辑
    alarmEdit(){
      // 30 1 6 12 24
      let data=[
        {
          name:'30分钟',
          val:1800,
          type:'bj'
        },
        {
          name:'1小时',
          val:3600,
          type:'bj'
        },
        {
          name:'6小时',
          val:21600,
          type:'bj'
        },
        {
          name:'12小时',
          val:43200,
          type:'bj'
        },
          {
          name:'24小时',
          val:86400,
          type:'bj'
        },
      ]
      this.mod=data
      this.show = true;
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
      this.show = true;
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
      this.show = true;
    },

    // 温度 湿度 设置成默认值
    setDefault1(){
      this.temperatureHigh=655.35
      this.temperatureLow=-655.36
      this.submitParam(()=>{
        this.info.temperature_low=this.temperatureLow
        this.info.temperature_high=this.temperatureHigh
      })

    },

    setDefault2(){
      this.humidityHigh=100
      this.humidityLow=0
      this.submitParam(()=>{
        this.info.humidity_low=this.humidityLow
        this.info.humidity_high=this.humidityHigh
      })
    }
  },
  data(){
    return {
      checked:false, // 报警开关  
      show:false, // 底部弹框 显示 隐藏
      deviceId:'',
      info:{}, // 设备信息
      loading:false, 

      samplingInterval:'', //采集间隔
      uploadInterval:'',//上报间隔
      alarmInterval:'',//报警间隔 

      temperatureHigh:'',//  温度上限 
      temperatureLow:'',//  温度下限

      humidityHigh:'',//  湿度上限 
      humidityLow :'',//  湿度下限 

      wdDialogShow:false ,// 温度编辑弹窗显示
      sdDialogShow:false,// 湿度编辑弹窗显示
      mod:[] ,// 底部弹出框的内容
    }

   
  },
  mounted(){
    console.log(this.$route.params,'-----------params')
    this.deviceId=this.$route.params.id
    this.getData()
    this.loading=true
    console.log(this.$refs,'------258----------')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  min-height: 100%;
}
.warn ul li {
  height: 1.333rem;
  line-height: 1.333rem;
  text-align: left;
  border-bottom: 1px solid #c6c6c6;
}

.warn ul {
  padding: .4rem;
}

.warn .aling {
  vertical-align: middle;
}

.warn .mar {
  margin-top: .187rem;
  height: 70%;
}

.title {
  font-size: .4rem;
  padding: .4rem;
  text-align: center;
}

.load {
  position: fixed;
  width: 56px;
  height: 56px;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: #333;
  opacity: .8;
  border-radius:.133rem;
  text-align: center;
  vertical-align: middle;
}

.load .van-loading {
  vertical-align: middle;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}

.default_btn {
    background: #00c000;
    height: 1rem;
    line-height: 1rem;
    padding: 0 .133333rem;
    width: 2.666667rem;
    color: #fff;
    text-align: center;
    border-radius: .533333rem;
    position: absolute;
    
}

.default_btn:first-child{
  left: 0;
  top: 50%;
  transform: translate(0,-50%)
}

.default_btn:last-child{
  right: 0;
  top: 50%;
  transform: translate(0,-50%)
}
.btn_wrap {
  position: relative;
}

</style>