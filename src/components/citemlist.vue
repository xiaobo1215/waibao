<template>
  <div>
    <div class="list_wrap">
      <ul>
        <li v-for="(item,index) in list" v-bind:key="index">
          <!-- <p class="machine_name p"> </p> -->
          <p class="t machine_name">
            <!-- <span>温湿度计(名称)</span> -->
            <span class="fontFamily hht-guanliyuan Administrator" v-if="item.wxUserDeviceRole==1"> </span>{{item.name}}
            
            <span class="fontFamily hht-shezhi1 fr" v-on:click="set(index,item.top,item.wxUserDeviceId,item.wxUserDeviceRole)"></span>
            <span class="fontFamily  hht-WIFIxinhao-ji3 fr" v-if="item.signalFlag ==1"></span>
            <span class="fontFamily  hht-WIFIxinhao-ji2 fr" v-if="item.signalFlag ==2"></span>
            <span class="fontFamily  hht-WIFIxinhao-ji1 fr" v-if="item.signalFlag ==3"></span>
            <span class="fontFamily  hht-WIFIxinhao-ji fr" v-if="item.signalFlag ==4"></span>
            <!-- 信号{{item.report_parse_device_signal}} -->
            <span class="fontFamily  hht-dianchidianya_ji3 fr" v-if="item.voltageFlag==4"></span>
            <span class="fontFamily  hht-dianchidianya_ji2 fr"  v-else-if="item.voltageFlag==3"></span>
            <span class="fontFamily  hht-dianchidianya_ji1 fr" v-else-if="item.voltageFlag==2"></span>
            <span class="fontFamily  hht-dianchidianya_ji fr" v-else-if="item.voltageFlag==1"></span>
            <!-- 0,1,4 待下发  3 下发是阿拜 2下发成功 -->
            <span class="fr  fontFamily hht-dengdai" v-if="item.cmdExeStatus==0" style="font-size:.32rem; margin-right: .2rem;"></span>
            <span class="fr fontFamily hht-dengdai" v-if="item.cmdExeStatus==1" style="font-size:.32rem; margin-right: .2rem;"></span>
            <span class="fr fontFamily hht-dengdai" v-if="item.cmdExeStatus==4" style="font-size:.32rem  margin-right: .2rem;;"></span>
            <span class="fr fontFamily hht-shibai" v-if="item.cmdExeStatus==3" style="font-size:.32rem; margin-right: .2rem;"></span>
            <!-- <span class="fr fontFamily hht-chenggong-01" v-if="item.cmdExeStatus==2" style="font-size:.32rem; margin-right: .2rem;"></span> -->
            
            <!-- 设备是否校准过 -->
            <span class="fr font_icon"   v-if="item.isOffset==1"   style="font-size:.4rem; margin-right: .2rem;">校准</span>
            <!-- 离线el.offline=true -->
            <span class="fr lixian"   v-if="!item.isOnline"   style="font-size:.4rem; margin-right: .2rem;">离线</span>
          
          </p>
          <!-- <p class="p">
            <span>数据设置下发状态:</span>
            <span class="fr  fontFamily hht-dengdai" v-if="item.cmdExeStatus==0" style="font-size:.4rem; margin-right: .2rem;"></span>
            <span class="fr fontFamily hht-dengdai" v-if="item.cmdExeStatus==1" style="font-size:.4rem; margin-right: .2rem;"></span>
            <span class="fr fontFamily hht-dengdai" v-if="item.cmdExeStatus==4" style="font-size:.4rem  margin-right: .2rem;;"></span>
            <span class="fr fontFamily hht-shibai" v-if="item.cmdExeStatus==3" style="font-size:.4rem; margin-right: .2rem;"></span>
            <span class="fr fontFamily hht-chenggong-01" v-if="item.cmdExeStatus==2" style="font-size:.4rem; margin-right: .2rem;"></span>
          </p> -->
          <p class="wendu p" >

            <span class="fontFamily hht-wendu" v-on:click="gotoWdPage(item)">温度：</span>
            <span v-bind:class='returnClass(item.report_parse_temperature,item.temperature_low,item.temperature_high)' v-on:click="gotoWdPage(item)">{{item.report_parse_temperature }}℃</span>
            <span class="scope fr " v-if="item.isSeted==1">范围：<span class="">{{item.temperature_low}}-{{item.temperature_high}}</span></span>
          </p>
          <p class="shidu p " >
            <span class="fontFamily hht-shidu" v-on:click="gotoWdPage(item)">湿度：</span>
            <span v-bind:class='returnClass(item.report_parse_humidity,item.humidity_low,item.humidity_high)' v-on:click="gotoWdPage(item)">{{item.report_parse_humidity}} %RH</span>
            <span class="scope fr" v-if="item.isSeted==1">范围：<span class="">{{item.humidity_low}}-{{item.humidity_high}}</span></span>
          </p>
          <p class="info p">
            <span >{{item.report_parse_acquisition_time | NYR }} <span style="margin:0 3px"></span>  {{item.report_parse_acquisition_time | SFM }}</span>
            <span>ID:{{item.device_id}}</span>
            <span>{{item.sensor_type}}</span>
          </p>
        </li>
      </ul>
    </div>
    <div>
      <van-actionsheet
        v-model="show"
        :actions="actions"
        @select="onSelect"
      />
    </div>
  </div>
  
</template>

<script>
import {get,post} from '../../src/util/http.js'
import {formatDatePub,nyr,NYR,SFM} from '../../src/util/util.js'
import { Actionsheet ,Loading,Toast ,Dialog } from 'vant'

export default {
  name: 'itemlist',
  props:{
    list:{
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    Loading,
    Actionsheet ,
    Toast,
    Dialog
  },
  filters:{
    nyr,NYR,SFM
  },
  data(){
    return {
      selectId:'',//当前选择的设备id
      show:false,
      isFirst:false,
      loading:false,
      actions:[]
    }
  },
  methods:{
    returnClass(a,b,c){
      if(a>c || a<b){
        return 'warn'
      }else {
        return 'normal'
      }
    },

    top(opt){
      console.log(opt,'------123')
      this.loading=true
      //       wxUserDeviceId  必传，下面俩参数传其种一个
      // alarmSwitch （boolean 类型 true|false）
      // top       1置顶 0取消置顶
      post('/device/setting/software',{
        wxUserDeviceId:opt.wxUserDeviceId,
        top:opt.top?'0':'1'
      }).then((res)=>{
        if(res.code==10000){
          this.$emit('select')
          console.log(this.$parent)
        }else {
          this.loading=false
          Toast('置顶失败，稍后再试！')
        }
      }).catch(function(e){
        console.log(e,'------------')
      })
    },
    onSelect(item){
      this.show = false;
      // console.log(item)/
      if(item.url=='first'){
        if(item.type=='gotop'){
          let opt=this.list[this.currentIndex]
          this.top(opt)
        }else if(item.type=='cancelgotop'){
          let opt=this.list[this.currentIndex]
          this.top(opt)
        }
        return
      }else if(item.url=='delete'){
        let opt=this.list[this.currentIndex]
        this.dealer(opt)
        return
      }else if(item.url=='/wsd/'){
        let items=this.list[this.currentIndex]
        let opt={
          path:item.url+''+items.device_id
        }
        this.selectId=''
        this.$router.push(opt)
      }else {
        let opt={
          path:item.url+''+this.selectId
        }
        console.log(opt,'--------')
        this.selectId=''
        this.$router.push(opt)
      }
    },
    gotoWdPage (opt){
      console.log(opt)
      let data={
        path:'/wsd/'+opt.device_id
      }
      this.$router.push(data)
    },
    set(index,top,id,role){
      let data=[]
      if(role==1){
        // 2管理员
        data=[
          {
            name:'设备详情',
            url:'/xq/',
          },
          {
            name:'温度曲线',
            url:'/wsd/'
          },
          {
            name:'报警设置',
            url:'/warn/'
          },
          {
            name:'成员列表',
            url:'/itemlist/'
          }
        ]
        if(this.$parent.$el.className!='search'){
          data.push({ name:'置顶/取消置顶',url:'first'})
        }
      }else {
        // 2成员
        data=[
          {
            name:'设备详情',
            url:'/xq/',
          },
          {
            name:'温度曲线',
            url:'/wsd/'
          },
          {
            name:'报警设置',
            url:'/warn/'
          },
          {
            name:'成员列表',
            url:'/itemlist/'
          }
        ]
        if(this.$parent.$el.className!='search'){
          data.push({ name:'置顶/取消置顶',url:'first'})
        }
      }
      this.actions=data
      if(this.$parent.$el.className!='search'){
        if(top==1){
          this.actions[this.actions.length-1].name='取消置顶';
          this.actions[this.actions.length-1].type='cancelgotop';
        }else {
          this.actions[this.actions.length-1].name='置顶'
          this.actions[this.actions.length-1].type='gotop';
        }
      }
      this.selectId=id
      this.currentIndex=index
      this.show=!this.show
    },
  },
  mounted(){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list_wrap ul li .t span {
  font-size: .32rem;
  /* margin-right: .3rem; */
}

.list_wrap ul li {
  border-bottom: 1px solid #c6c6c6;
  padding: .2rem 0;
}

.list_wrap ul li .info {
  display: flex;
  flex-direction:row;
  flex-wrap:nowrap;
  justify-content:space-between;

}

.list_wrap ul{
  padding: .2rem .4rem .4rem .4rem;
}

.list_wrap ul p.t {
  line-height: .933rem;
  height: .933rem;
}

.list_wrap ul .p {
  line-height: .933rem;
  height: .933rem;
}

.list_wrap ul li .p span {
  margin-right: .1rem;
  font-size: .32rem;
}

.machine_name {
  font-size: .453rem;
}

.list_wrap ul li .machine_name .hht-shezhi1 {
  font-size: .48rem;
  width: .8rem;
  height: .8rem;
  text-align: center;
  vertical-align: middle;
  color: #0087ff;
}

.list_wrap ul li .machine_name span:active {
  color: #333;
}
.hht-WIFIxinhao-ji:before {
  margin-right: 5px;
}





.Administrator {
  vertical-align: -1px !important;
}

.wendu span,.shidu span{
  font-size: .4rem !important ;
}

.warn {
  color: red !important ;
}

.machine_name .Administrator {
  color: #0087ff;
  font-size: .5rem !important ;
  margin-right: 4px;
}

.machine_name .fontFamily {
  margin-right: 0.2rem;
}
.font_icon {
  font-size: 10px !important;
  padding: 0 .133333rem;
  border-radius: .186667rem;
  margin-top: .26rem;
  text-align: center;
  color: #999;
  border:1px solid #999;
  height: .426667rem;
  line-height:  .426667rem;
  transform: scale(.9)
}

.lixian {
  font-size: 10px !important;
  padding: 0 .133333rem;
  border-radius: .186667rem;
  margin-top: .26rem;
  text-align: center;
  color: #fff;
  height: .426667rem;
  line-height:  .426667rem;
  background: #0087ff;
  transform: scale(.9)
}


</style>


 