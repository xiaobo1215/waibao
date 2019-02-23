<template>
  <div class="home">
    <div class="search_wrapa" v-on:click="toSearch">
      <p class=""><span class="fontFamily hht-sousuo"></span> 请输入搜索关键词</p>
    </div>
    <mt-loadmore :top-method="loadTop"  :topDistance='45' @top-status-change="handleTopChange" ref="loadmore" class="list_wrap">
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus === 'drop'" class="load_hint">可以松开了...</span>
        <span v-show="topStatus === 'loading'" class="load_hint">加载中..</span>
        <span v-show="topStatus === 'pull'" class="load_hint">下拉更新数据</span>
      </div>
      
      <div v-infinite-scroll="loadMore"
          infinite-scroll-disabled='falg'
          infinite-scroll-distance="20">
          <item-list  v-on:select="onSelects" v-bind:list="items"></item-list>
          <p class="hint" v-if="loadStatus==3">没有更多</p>
      </div>
      <!-- <div slot="bottom" class="mint-loadmore-bottom">
        <span class="load_hint">加载更多数据...</span>
      </div> -->
      <!-- <p class="hint" v-if="loadStatus==1" >加载中...</p>
      <p class="hint" v-if="loadStatus==2" v-on:click="loadMore">点击加载更多</p>
      <p class="hint" v-if="loadStatus==3">没有更多</p>
      <p class="hint" v-if="loadStatus==4" v-on:click="reload">加载失败，点击重新加载</p> -->
    </mt-loadmore>
    <!-- <div class="list_wrap">
      
    </div> -->
    <div>
      <van-actionsheet
        v-model="show"
        :actions="actions"
        @select="onSelect"
      />
    </div>
    <div class="load" v-if="loading">
      <van-loading color="#c1c1c1" size="40px"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Actionsheet ,Loading,Toast ,Dialog } from 'vant'
import { Loadmore,InfiniteScroll  } from 'mint-ui';
import ItemList  from '../components/citemlist'
import {get,post} from '../../src/util/http.js'
import {nyr} from '../../src/util/util.js'
require('../../src/util/cookie.js')

export default {
  name: 'home',
  data(){
      return {
        selectId:'',//当前选择的设备id
        show:false,
        isFirst:false,
        items:[],
        loading:false,
        actions:[],
        pageNum:1,
        loadStatus:2, // 1加载中 2可以加载 3没有更多 4加载失败
        pageSize:5,
        allLoaded:false,
        falg:true,
        topStatus: '',
      }
  },
  components: {
    Loading,
    Actionsheet ,
    Toast,
    Dialog,
    ItemList,
    Loadmore
  },
  filters:{
    nyr
  },
  methods:{
    handleTopChange(status) {
      console.log(status,'-----------status')
      this.topStatus = status;
    },
    loadTop() {
      this.update()
    },
    loadBottom() {
      this.allLoaded = true;// 若数据已全部获取完毕
      this.$refs.loadmore.onBottomLoaded();
    },

    update(){
      console.log('-------------123')
      if(this.loadStatus==1){
        return
      }
      this.loadStatus=1 // 1加载中 2可以加载 3没有更多 4加载失败
      this.pageSize=5
      this.pageNum=1
      this.loading=true
      let opendId=Cookies.get('openId')
      get('/device/list',{openId:opendId,pageNum:this.pageNum,pageSize:this.pageSize}).then((res)=>{
        if(res.code==10000){
          this.loading=false
          this.items=[].concat(res.data.list) 
          var current = Date.now()
          this.items.forEach((el,i)=>{
            el.probe_type=el.probe_type==1?'内置探头':'外置探头 '
            // el.time=formatDatePub(el.report_parse_acquisition_time)
            if(el.report_parse_voltage>3.6){
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
            if((current-(el.report_parse_acquisition_time)*1000)>(24*60*60*100)){
              el.offline=true
            }else {
              el.offline=false
            }
          })
          console.log(this.items)
          this.items.sort((a,b)=>{
            if(b.top!=undefined && a.top!=undefined){
              return b.top-a.top
            }
          })
          this.loadStatus=(res.data.hasNextPage)?2:3
          this.$refs.loadmore.onTopLoaded();
          if(this.loadStatus==3){
            this.falg=true
          }else {
            this.falg=false
          }
        }else {
          this.loadStatus=4
        }
      }).catch((e)=>{
        console.log(e)
      })
    },
    onSelects(){
      // this.getList()
      let pageSize = this.pageSize
      let pageNum = this.pageNum
      let opendId=Cookies.get('openId')
      get('/device/list',{openId:opendId,pageNum:1,pageSize:(pageSize*pageNum)}).then((res)=>{
        if(res.code==10000){
          this.loading=false
          this.items=[].concat(res.data.list) 
          var current = Date.now()
          this.items.forEach((el,i)=>{
            el.probe_type=el.probe_type==1?'内置探头':'外置探头 '
            // el.time=formatDatePub(el.report_parse_acquisition_time)
            if(el.report_parse_voltage>3.6){
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
            if((current-el.create_time)>(24*60*60*100)){
              el.offline=true
            }else {
              el.offline=false
            }
          })
          this.items.sort((a,b)=>{
            if(b.top!=undefined && a.top!=undefined){
              return b.top-a.top
            }
          })
          this.loadStatus=(res.data.hasNextPage)?2:3
        }else {
          this.loadStatus=4
        }
      }).catch((e)=>{
        console.log(e)
      })
    },
    loadMore(){
      console.log('-------------123')
      if(this.loadStatus==1){
        return
      }
      var _i=this.pageNum
      _i++
      this.pageNum=_i
      this.loading=true
      this.falg=true
      this.getList()
    },
    reload(){
      this.loading=true
      this.getList()
    },
    onSelect(item){
      this.show = false;
      // console.log(item)/
      if(item.url=='first'){
        if(item.type=='gotop'){
          let opt=this.items[this.currentIndex]
          this.top(opt)
        }else if(item.type=='cancelgotop'){
          let opt=this.items[this.currentIndex]
          this.top(opt)
        }
        return
      }else if(item.url=='delete'){
        let opt=this.items[this.currentIndex]
        this.dealer(opt)
        return
      }else if(item.url=='/wsd/'){
        let items=this.items[this.currentIndex]
        let opt={
          path:item.url+''+items.device_id
        }
        this.selectId=''
        this.$router.push(opt)
      }else {
        let opt={
          path:item.url+''+this.selectId
        }
        this.selectId=''
        this.$router.push(opt)
      }
    },

    toPercent(point){
      let str=Number(point*100).toFixed(1);
      str+="%";
      return str;
    },
    getList(){
      let opendId=Cookies.get('openId')
      this.loadStatus=1
      get('/device/list',{openId:opendId,pageNum:this.pageNum,pageSize:this.pageSize}).then((res)=>{
        if(res.code==10000){
          this.loading=false
          this.items=this.items.concat(res.data.list) 
          var current = Date.now()
          this.items.forEach((el,i)=>{
            el.probe_type=el.probe_type==1?'内置探头':'外置探头 '
            // el.time=formatDatePub(el.report_parse_acquisition_time)
            if(el.report_parse_voltage>3.6){
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
            if((current-el.create_time)>(24*60*60*100)){
              el.offline=true
            }else {
              el.offline=false
            }
          })
    
          this.items.sort((a,b)=>{
            if(b.top!=undefined && a.top!=undefined){
              return b.top-a.top
            }
          })
          this.loadStatus=(res.data.hasNextPage)?2:3
          if(this.loadStatus==3){
            this.falg=true
          }else {
            this.falg=false
          }
        }else {
          this.loadStatus=4
        }
      }).catch((e)=>{
        console.log(e)
      })
    },
    toSearch(){
      let opt={
        path:'/search',
        query: {
            id: ''
        }
      }
      this.$router.push(opt)
    }
  },
  directives:{
    db:{
      inserted: function (el,value) {
        el.innerText=value.value
      }
    }
  },
  
  mounted(){
    this.loading=true

    //oJ3fKwNf3IkVFiAGKVu2WE-0i918
    // var key='oJ3fKwNf3IkVFiAGKVu2WE-0i918'
    // Cookies('openId',key,{ expires: new Date(new Date().getTime() + (2*24*60*60 * 1000))})
    if(Cookies.get('openId')){
      // 如果cookie  有openId
      this.getList()
    }else{
      let code= window.location.search.split('&')[0].split('=')[1];
      if(code){
        // 用code  换openId
        get('/wx/getWebTokenByCode',{code:code}).then((res)=>{
          if(res.code==10000 && res.data!=undefined && res.data.openid!='' &&  res.data.openid!=undefined){
            this.userInfo=res.data
            Cookies('openId',this.userInfo.openid,{ expires: new Date(new Date().getTime() + (2*24*60*60 * 1000))})
            this.getList()
          }else {
            // code 失效 或者接口挂了
            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri=http%3a%2f%2flive-smart.com.cn%2findex.html%23%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
          }
        }).catch((e)=>{
          console.log(e)
        })
      }else {
        // 没有code 去这个地址
        window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri=http%3a%2f%2flive-smart.com.cn%2findex.html%23%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
      }
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
.home {
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

.hint {
  width: 95%;
  margin: 0 auto;
  height: 1.067rem;
  font-size: .427rem;
  line-height: 1.067rem;
  background: #f1f1f1;
  border-radius: 5px;
  margin-bottom: 5px;
  text-align: center;
}

.search_wrapa {
  z-index: 50;
  position: fixed;
  width: 100%;
  top: 0px;
}
.list_wrap {
  padding-top: .6rem;
}

.load_hint {
  display: block;
  text-align: center;
  height: .6rem;
  line-height: .6rem;
}


</style>
