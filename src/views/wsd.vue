<template>
  <div class="wsd">
    <div class="btn_wrap">
      <!-- <van-button type="primary" v-on:click="onYesterday">昨天</van-button> -->
      <!-- <van-button type="primary" v-on:click="onToday">今天</van-button> -->
      <!-- <van-button type="primary" v-on:click="onElse">其他</van-button> -->
      <div class="clearfix"> 
          <div class="btn " v-on:click="cut(1)" v-bind:class="currentTab==1?'active':''">今天</div>
          <div class="btn" v-on:click="cut(2)" v-bind:class="currentTab==2?'active':''">昨天</div>
          <div class="btn" v-on:click="cut(3)" v-bind:class="currentTab==3?'active':''">前天</div>
          <div class="btn" v-on:click="cut(4)" v-bind:class="currentTab==4?'active':''">本周</div>
          <div class="btn" v-on:click="cut(5)" v-bind:class="currentTab==5?'active':''">本月</div>
          <div class="btn" v-on:click="cut(6)" v-bind:class="currentTab==6?'active':''">本年</div>
      </div>
    </div>
    <div>
      <div class="sd mod" id="sd"></div>
    </div>
    <div>
      <div class="wd mod" id="wd"></div>
    </div>
    <div>
       <div class="power mod" id="power"></div>
    </div>
    <div class="date_wrap" v-bind:class="datePicker?'bottom_show':'bottom_false'">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="currentDateT"
        @confirm="Onconfirm"
        @cancel="Oncancel"
      />
    </div>
    <div class="load" v-if="loading">
      <van-loading color="#c1c1c1" size="40px"/>
    </div>
    <transition name="fade">
      <div class="mark" v-if="datePicker" v-on:click="hideDatePicker"></div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import { Button,Loading,Toast,DatetimePicker } from 'vant';
import {get,post} from '../../src/util/http.js'

export default {
  name: 'wsd',
  components: {
    Button,
    Loading,
    Toast
  },
  computed:{
    classObject:function(){
      
    }
  },
  methods:{
    Onconfirm(value){
      let d=new Date(value)
      let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'').getTime()
      _t=_t/1000
      console.log(_t)
      this.selectDate=_t
      this.getdatas()
    },

    cut(item){
      this.currentTab=item
      if(item==1){ // 当前是否是今天的数据
        let d=new Date()
        let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'').getTime()
        _t=_t/1000
        if(this.data && this.data.date==_t)
        return
      }

      if(item==2){
        let d=new Date()
        let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+(d.getDate()-1)+'').getTime()
        _t=_t/1000
        if(this.data && this.data.date==_t)
        return
      }

      if(item==3){ // 当前是否是前天的数据
        let d=new Date()
        let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+(d.getDate()-2)+'').getTime()
        _t=_t/1000
        if(this.data && this.data.date==_t)
        return
      }

      if(item==4){ // 当前是否是本月的数据
        let _t='1'
        if(this.data && this.data.date==_t)
        return
      }

      if(item==5){ // 当前是否是本月的数据
        let _t='2'
        if(this.data && this.data.date==_t)
        return
      }
      if(item==6){ // 当前是否是本月的数据
        let _t='3'
        if(this.data && this.data.date==_t)
        return
      }

      if(item==1){ // 今天
        let d=new Date()
        let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'').getTime()
        _t=_t/1000
        this.selectDate=_t
        this.getdatas()
      }else if(item==2) { //昨天
        let d=new Date()
        let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+(d.getDate()-1)+'').getTime()
        _t=_t/1000
        this.selectDate=_t
        this.getdatas()
      }else if(item==3){
        let d=new Date()
        let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+(d.getDate()-2)+'').getTime()
        _t=_t/1000
        this.selectDate=_t
        this.getdatas()
      }else if(item==4){
        this.selectDate='1'
        this.getdatas()
      }else if(item==5){
        this.selectDate='2'
        this.getdatas()
      }else if(item==6){
        this.selectDate='3'
        this.getdatas()
      }
    },

    Oncancel(){
      this.datePicker=false
    },

    onElse(){
      this.datePicker=true
    },
    onToday(){
      let d=new Date()
      let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'').getTime()
      _t=_t/1000
      this.selectDate=_t
      this.getdatas()
    },
    onYesterday(){
      let d=new Date()
      let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+(d.getDate()-1)+'').getTime()
      _t=_t/1000
      this.selectDate=_t
      this.getdatas()
    },


    hideDatePicker(){
      this.datePicker=false
    },
    init(){
      let d=new Date()
      let _t=new Date(''+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+(d.getDate())+'').getTime()
      _t=_t/1000
      this.selectDate=_t
      this.getdatas()
    },

    getDataDate(){
      let d=new Date((this.data.date*1000))
      let s=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
      return s
    },

    drawLine(){
      let _this=this
      let myChart = this.$echarts.init(document.getElementById('wd'))
      let myChart2 = this.$echarts.init(document.getElementById('sd'))
      let myChart3 = this.$echarts.init(document.getElementById('power'))
      let option = {
          title: {
            text: '湿度曲线',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'category',
            data:_this.d1
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: _this.d2,
              type: 'line'
          }],
          dataZoom: [{
            }, {
                type: 'inside'
            }],
      };
      let option2 = {
          title: {
            text: '温度曲线',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'category',
            data:_this.d1
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: _this.d3,
              type: 'line'
          }],
          dataZoom: [{
            }, {
                type: 'inside'
            }],
      };
      let option3 = {
          title: {
            text: '电量',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'category',
            data:_this.d1
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: _this.d4,
              type: 'line'
          }],
          dataZoom: [{
            }, {
                type: 'inside'
            }],
      };
      // var obj={
      //   data:[_this.getDataDate()],
      //   x: 'left'
      // }
      // option.legend=obj
      console.log(option,'---------------')
      myChart.setOption(option)
      myChart2.setOption(option2)
      myChart3.setOption(option3)
      window.addEventListener("resize", () => { myChart.resize(); myChart2.resize(); myChart3.resize();});
    },
    getdatas(){
      var data={
        deviceId :this.deviceId
      }
      if(this.selectDate==='1' || this.selectDate==='2' || this.selectDate==='3'){
        data.flag=this.selectDate
      }else {
        data.date=this.selectDate
      }
      get('/device/reportData',data).then((res)=>{
        if(res.code==10000){
          if(res.data.humidity.length>0&& res.data.temperature.length>0&& res.data.voltage.length>0){
            this.data=res.data
            this.data.date=this.selectDate
            this.loading=false
            this.d1=res.data.timeData
            if(this.selectDate==='1' || this.selectDate==='2' || this.selectDate==='3'){
              let reg=/\d{4}-(\d{1,2}-\d{1,2})/
              let _d=[]
              this.d1.forEach(function(item,index){
                if(reg.test(item)){
                  _d.push(RegExp.$1)
                }
              })
              this.d1=_d
            }else {
              let reg=/\d{4}-\d{1,2}-\d{1,2}/
              this.d1 = this.d1.map(function (str) {
                return str.replace(reg, '');
              });
            }
            this.d2=res.data.humidity
            this.d3=res.data.temperature
            this.d4=res.data.voltage
            this.drawLine()
            this.hideDatePicker()
            this.loading=false
          }else {
            this.loading=false
            this.data=null
            this.d2=[]
            this.d3=[]
            this.d4=[]
            this.d1=[]
            this.drawLine()
            Toast('暂无数据...')
            this.hideDatePicker()
            this.loading=false
          }
        }else {
          this.loading=false
          Toast('获取数据失败，请稍后')
          this.hideDatePicker()
          this.loading=false
        }
      }).catch((e)=>{
        this.loading=false
        this.hideDatePicker()
        Toast('获取数据失败，请稍后')
        console.log(e)
      })
    }
  },
  data(){
    return {
      deviceId:'',
      selectDate:'',
      currentDate: new Date(),
      currentDateT: new Date(),
      minDate: new Date('2018/1/1'),
      datePicker:false,
      d1:[],
      d2:[],
      d3:[],
      d4:[],
      currentTab:true,
      data:null,
      loading:true
    }
  },
  mounted(){
    this.deviceId=this.$route.params.id
    this.init()
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wsd .mod {
  width: 100% !important;
  height: 300px;
  /* border-bottom: 1px solid #333; */
  padding-bottom: 40px;
  box-sizing: content-box;
}

.btn_wrap {
  position: fixed;
  width: 100%;
  top: 0px;
  padding: .4rem;
  background: #fff;
  z-index: 10;
  box-sizing: border-box;
  border-bottom: 1px solid #f3f3f3;
}

.btn_wrap .btn{
  float: left;
  width: 1.3rem;
  height: 1.173rem;
  line-height: 1.173rem;
  font-size: .4rem;
  text-align: center;
  background: #f6f6f6;
  margin-right: .2rem;
  border-radius: .08rem;
}

.btn_wrap .btn:active {
  background: #4b0;
  color: #fff;
}

.btn_wrap .active {
  background: #4b0;
  color: #fff;
}



.item_title {
  font-size: .427rem;
  margin-top: .133rem;
}

.wsd {
  padding: 2rem 0 1rem 0;
}

.wsd .btn_wrap{
  text-align: left;
}

.wsd .btn_wrap button {
  margin-left: .267rem;
}

.title {
  font-size: .4rem;
  padding: .4rem;
  text-align: center;
}

.date_wrap {
  position: fixed;
  height: 6.933rem;
  width: 100%;
  z-index: 10;
}
.mark {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  background: #333;
  opacity: .7;
}

.bottom_hide {
  bottom: -7rem;
}

.bottom_show {
  bottom: 0px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.tip {
  font-size: .133rem;
  text-align: left;
  margin-top: .267rem;
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

</style>
