<template>
  <div class="item_list">
    <p class="title"></p>
    <div class="list">
      <ul>
        <li class="item" >
          <!-- <p class="">
            <span class="label">核定ID：</span>
            <span class="fr">{{info.wxUserDeviceId}}</span>
          </p> -->
          <p class="">
            <span class="label">申请者昵称：</span>
            <span class="label fr">{{info.nickname}}</span>
          </p>
          <!-- <p class="">
            <span class="label">申请者openId：</span>
            <span class="label fr">{{info.open_id}}</span>
          </p> -->
          <p class="">
            <span class="label">申请时间：</span>
            <span class="label fr">{{info.create_time | Dnyr}}</span>
          </p>
          <p class="">
            <span class="label">设备Id：</span>
            <span class="label fr">{{info.device_id}}</span>
          </p>
          <p class="">
            <span class="label">设备名称：</span>
            <span class="label fr">{{info.custom_device_name}}</span>
          </p>
          <p class="">
            <span class="label">审核时间：</span>
            <span class="label fr">{{info.check_time | Dnyr}}</span>
          </p>
          <p class="">
            <span class="label">审核状态：</span>
            <span class="label fr" v-if="info.check_status==0">待审核</span>
            <span class="label fr" v-if="info.check_status==1">已批准</span>
            <span class="label fr" v-if="info.check_status==2">已拒绝</span>
          </p>
          <p class="">
            <span class="label">审核人：</span>
            <span class="label fr">{{info.checkPersonName}}</span>
          </p>
          <!-- <p class="">
            <span class="label">审核者iD：</span>
            <span class="label fr">{{info.check_open_id}}</span>
          </p> -->
        </li>
      </ul>
    </div>
    <div class="btn_wrap" v-if="info.check_status==0">
      <van-button type="primary" size="normal" v-on:click="Onallow" :disabled="disabledT">允许</van-button>
      <van-button type="warning" size="normal" v-on:click="Onreject" :disabled="disabledW">拒绝</van-button>
    </div>
    <div class="load" v-if="loading">
      <van-loading color="#c1c1c1" size="40px"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {Loading,Button,Toast } from 'vant';
import {get,post} from '../../src/util/http.js'
import {formatDatePub,Dnyr} from '../../src/util/util.js'
require('../../src/util/cookie.js')

export default {
  name: 'cjset',
  components: {
    Loading,
    Button ,
    Toast
  },
  filters:{
    formatDatePub,
    Dnyr
  },
  data(){
    return {
      deviceId:'',
      loading:false,
      info:{},
      disabledT:false,
      disabledW:false,
      userInfo:{}
    }
  },
  methods:{
    Onallow(e){
      this.loading=true
      get('/device/checkApproved',{wxUserDeviceId :this.deviceId,openId:this.userInfo.openid}).then((res)=>{
        if(res.code==10000){
          Toast('允许成功')
          this.loading=false
          this.disabledT=true
          this.disabledW=true
        }else {
          this.loading=false
          Toast(res.msg?res.msg:'允许失败')
        }
      }).catch((e)=>{
        this.loading=false
        Toast('允许失败')
        console.log(e)
      })

    },
    Onreject(e){
      this.loading=true
      get('/device/checkUnapprove',{wxUserDeviceId :this.deviceId,openId:this.userInfo.openid}).then((res)=>{
        if(res.code==10000){
          Toast('拒绝成功')
          this.loading=false
          this.disabledT=true
          this.disabledW=true
        }else {
          this.loading=false
          Toast(res.msg?res.msg:'拒绝失败')
        }
      }).catch((e)=>{
        this.loading=false
        Toast('拒绝失败')
        console.log(e)
      })
    },
    getData(){
      get('/device/checkView',{wxUserDeviceId :this.deviceId,openId:this.userInfo.openid}).then((res)=>{
        if(res.code==10000){
          this.loading=false
          this.info=res.data
        }else {
          Toast(res.msg?res.msg:'获取数据失败'+JSON.stringify(res.data))
          this.loading=false
        }
      }).catch((e)=>{
        this.loading=false
        Toast('获取数据失败，catch')
        console.log(e)
      })
    },
    checkOpenid(){
      let code= window.location.search.split('&')[0].split('=')[1];
      if(code){
        var _this=this
        get('/wx/getWebTokenByCode',{code:code}).then((res)=>{
          if(res.code==10000 && res.data!=undefined && res.data.openid!='' &&  res.data.openid!=undefined){
            this.userInfo=res.data
            Cookies('openId',this.userInfo.openid,{ expires: new Date(new Date().getTime() + (2*24*60*60 * 1000))})
            this.getData()
          }else {
            // code 失效 或者接口挂了
            let url="http://live-smart.com.cn/index.html#/Tpl/"+this.deviceId
            let currentHref= encodeURIComponent(url);
            let href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri='+currentHref+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
            window.location.href=href
            this.loading=false
          }
        }).catch((e)=>{
          console.log(e)
          this.loading=false
        })
        // this.getData()
      }else{
        let currentHref= encodeURIComponent(window.location.href);
        let href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri='+ currentHref+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
        window.location.href=href
        
        // let code= window.location.search.split('&')[0].split('=')[1];
        // if(code){
        //   // 用code  换openId
        //   get('/wx/getWebTokenByCode',{code:code}).then((res)=>{
        //     if(res.code==10000 && res.data!=undefined && res.data.openid!='' &&  res.data.openid!=undefined){
        //       this.userInfo=res.data
        //       Cookies('openId',this.userInfo.openid,{ expires: new Date(new Date().getTime() + (2*24*60*60 * 1000))})
        //       this.getList()
        //     }else {
        //       // code 失效 或者接口挂了
        //       window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri=http%3a%2f%2flive-smart.com.cn%2findex.html%23%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
        //     }
        //   }).catch((e)=>{
        //     console.log(e)
        //   })
        // }else {
        //   // 没有code 去这个地址
        //   window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri=http%3a%2f%2flive-smart.com.cn%2findex.html%23%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
        // }
      }
    }
  },
  
  mounted(){
    this.deviceId=this.$route.params.id
    if(!this.deviceId){
      setTimeout(()=>{
        window.close();
      })
    }
    console.log(this.$route.params.id)
    this.checkOpenid()
    this.loading=true
    // this.getData()
  }
}
</script>
<style scoped>
.item_list {
  height: 100%;
  font-size: .4rem;
}

.btn_wrap {
  display: flex;
  flex-direction:row;
  justify-content:space-around;
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

.list {
  padding: .133rem .4rem;
}

.item_list .list .item p{
  height: 1.2rem;
  line-height:1.2rem;
  text-align: left;
  border-bottom: 1px solid #c6c6c6;
  
}

.item_list .list ul li {
  padding: .133rem 0;
}

.item_list .list ul li .fr {
  margin-right: .133rem;
}

.item_list .list ul li .cov {
  width: .667rem;
  height:.667rem;
  border-radius: 50%;
  margin-top: .133rem;
}

.item_list .list ul li p .label:first-child {
  margin-left: .133rem;
}

.title {
  text-align: center;
  font-size: .4rem;
  padding: .4rem;
}

.hint {
  height: 1.067rem;
  font-size: .427rem;
  line-height: 1.067rem;
  background: #f1f1f1;
  border-radius: 5px;
  margin-bottom: 5px;
}

.btn_wrap {
  margin-top: .267rem;
}
</style>
