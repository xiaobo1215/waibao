import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
import echarts from 'echarts'
import './assets/icon/iconfont.css';
import {get,post} from '../src/util/http'
require('../src/util/cookie')

// import ElementUI from 'element-ui';
import Mint from 'mint-ui';
import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);


Vue.use(Vant);
Vue.use(Mint);
Vue.prototype.$echarts=echarts
Vue.config.productionTip = false
router.beforeEach((to,from,next)=>{
  if(to.meta.title){
    document.title=to.meta.title
  }
  //本地开发 写入cookie   开发人员的openId
   //var key='oJ3fKwNf3IkVFiAGKVu2WE-0i918'
   //Cookies('openId',key,{ expires: new Date(new Date().getTime() + (2*24*60*60 * 1000))})
  let href= encodeURIComponent(window.location.href) 
  if(Cookies.get('openId')){
    next()
  }else {
    let code= window.location.search.split('&')[0].split('=')[1];
    if(code){
      // document.write( window.location.href,'--------------',window.location.search)
      // 用code  换openId
      get('/wx/getWebTokenByCode',{code:code}).then((res)=>{
        if(res.code==10000 && res.data!=undefined && res.data.openid!='' &&  res.data.openid!=undefined){
          Cookies('openId',res.data.openid,{ expires: new Date(new Date().getTime() + (2*24*60*60 * 1000))})
          next()
        }else {
          // code 失效 或者接口挂了
          window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri='+href+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
        }
      }).catch((e)=>{
        console.log(e)
      })
    }else {
      window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf410780b57e7f0ad&redirect_uri='+href+'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
