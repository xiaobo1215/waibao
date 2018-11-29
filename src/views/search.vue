<template>
  <div class="search">
    <p class="title">支持id  name</p>
    <div class="search_wrap">
      <van-search placeholder="请输入搜索关键词" v-model="value" />
    </div>
    <div class="noData">
      <p v-if="items.length==0">没有搜索到相关数据</p>
    </div>
    <div class="list_wrap">
      <item-list  v-on:select="onSelects" v-bind:list="items"></item-list>
    </div>
    <div class="load" v-if="loading">
      <van-loading color="#c1c1c1" size="40px"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Search ,Actionsheet,Dialog,Loading,Toast} from 'vant'
import {get,post,nyr} from '../../src/util/http.js'
import {debounce} from '../../src/util/util.js'
import {formatDatePub} from '../../src/util/util.js'
import ItemList  from '../components/citemlist'

require('../../src/util/cookie.js')
export default {
  name: 'home',
  components: {
    Search,
    Actionsheet ,
    Dialog,
    Loading,
    ItemList
  },
  filters:{
    nyr
  },
  watch:{
    value:function(newVal,oldVal){
      this.searchByKey()
    }
  },
  methods:{
    refresh(value){
      let self=this
      if(!value){
        return
      }
        this.loading=true
        get('/device/list',{openId:this.openId,deviceName:value}).then((res)=>{
        if(res.code==10000){
          this.items=[]
          this.items=res.data
          this.loading=false
          try {
            self.items.forEach((el,i)=>{
            el.probe_type=el.probe_type==1?'内置探头':'外置探头 '
            if(el.report_parse_acquisition_time!=undefined){
              el.time=formatDatePub(el.report_parse_acquisition_time)
            }
            if(el.report_parse_voltage != undefined && el.report_parse_voltage!=''){
              if( el.report_parse_voltage>3.6){
                // 高
                el.powerL=1
              }else if(el.report_parse_voltage<3.6 && el.report_parse_voltage>3.5 ){
                // 中
                el.powerL=2
              }else if(el.report_parse_voltage<3.5 && el.report_parse_voltage>3.45){
                // 低
                el.powerL=3
              }else {
                el.powerL=4
              }
            }
          })
          }catch(e){
            console.log(e)
          }
          
        }
      }).catch((e)=>{
        console.log(e)
      })
    },
    onSelects(){
      let self=this
      if(this.value==''){
        return
      }
      this.refresh(this.value)
    },

    toPercent(point){
      let str=Number(point*100).toFixed(1);
      str+="%";
      return str;
    },
    searchByKey:debounce(
      function(){
          let self=this
          if(self.value==''){
            return
          }
          this.loading=true
          get('/device/list',{openId:self.openId,deviceName:self.value}).then((res)=>{
          if(res.code==10000){
            self.items=[]
            self.items=res.data
            this.loading=false
            try {
              self.items.forEach((el,i)=>{
              el.probe_type=el.probe_type==1?'内置探头':'外置探头 '
              if(el.report_parse_acquisition_time!=undefined){
                el.time=formatDatePub(el.report_parse_acquisition_time)
              }
              if(el.report_parse_voltage != undefined && el.report_parse_voltage!=''){
                if( el.report_parse_voltage>3.6){
                  // 高
                  el.powerL=1
                }else if(el.report_parse_voltage<3.6 && el.report_parse_voltage>3.5 ){
                  // 中
                  el.powerL=2
                }else if(el.report_parse_voltage<3.5 && el.report_parse_voltage>3.45){
                  // 低
                  el.powerL=3
                }else {
                  el.powerL=4
                }
              }
            })
            }catch(e){
              console.log(e)
            }
            
          }
        }).catch((e)=>{
          console.log(e)
        })
      },500)
  },
  data(){
    return {
      selectId:'',//当前选择的设备id
      show:false,
      isFirst:false,
      value:'', // 用户输入内容
      items:[],
      loading:false,
      searchId:''
    }
  },
  mounted(){
    this.openId=Cookies.get('openId')  
    if(this.$route.query.id){
      this.value=this.$route.query.id
      this.refresh(this.$route.query.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.c1 {
  color: #0087ff;
}

.title {
  text-align: center;
  font-size: .4rem;
  padding: .4rem;
}
.search {
  min-height: 100%;

}
#app {
  margin: 0px;
}

* {
  margin: 0px;
  text-align: left
}


.search_wrapa p{
  text-align: left;
  height: .8rem;
  line-height: .8rem;
  background: #fff;
  font-size: .373rem;
  color: #c6c6c6;
  padding-left: .3rem;
}

.search_wrapa {
  padding: .2rem;
  background:rgb(242, 242, 242);
}

.noData p{
  line-height: .8rem;
  font-size: .4rem;
  text-align: center;
  padding: .267rem;
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

