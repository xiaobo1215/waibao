import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Tpl from './views/Tpl.vue'
import Cjset from './views/cjset.vue'
import Details from './views/details.vue'
import Itemlist from './views/itemlist.vue'
import Warn from './views/warn.vue'
import Wsd from './views/wsd.vue'
import Search from './views/search.vue'
import Download from './views/download.vue'

Vue.use(Router)
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        title:'设备列表',
        keepAlive:true
      }
    },
    {
      path: '/cjset/:id',
      name: 'cjset',
      component: Cjset,
      meta:{
        title:'采集设置'
      }
    },
    {
      path: '/xq/:id',
      name: 'xq',
      component: Details,
      meta:{
        title:'设备详情'
      }
    },
    {
      path: '/itemlist/:id',
      name: 'itemlist',
      component: Itemlist,
      meta:{
        title:'设备列表'
      }
    },
    {
      path: '/warn/:id',
      name: 'warn',
      component: Warn,
      meta:{
        title:'报警设置'
      }
    },
    {
      path: '/wsd/:id',
      name: 'wsd',
      component: Wsd,
      meta:{
        title:'温湿曲线'
      }
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta:{
        title:'搜索'
      }
    },
    {
      path: '/tpl/:id',
      name: 'tpl',
      component: Tpl,
      meta:{
        title:'模板消息'
      }
    },
    {
      path:'/download/',
      name: 'download',
      component: Download,
      meta:{
        title:'数据导出'
      }
    },
    {
      path: '/about',
      name: 'about',
      meta:{
        title:'设备详情'
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
