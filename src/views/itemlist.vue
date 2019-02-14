<template>
  <div class="item_list">
    <p class="title">成员列表</p>
    <div class="list">
      <ul>
        <li class="item" v-for="(item,index) in items" v-bind:key="index">
          <p class="">
            <!-- <span class="label">设置</span> -->
            <img v-bind:src="item.member_headimgurl" alt="" class="label cov" style="margin-right:5px;">
            <span class="label">{{item.member_nickname}}</span>
            <span class="fontFamily hht-shezhi1 label fr" v-on:click="edit(item)" v-if="item.type==2 && admin===openId"></span>
            <span class="fontFamily hht-guanliyuan Administrator label fr" v-else-if="item.type==1"></span>
          </p>
          <!-- <p class="">
            <span class="label">头像：</span>
            <span class="label fr cov" v-bind:style="background"></span>
            <img v-bind:src="item.member_headimgurl" alt="" class="label fr cov">
          </p> -->
          <!-- <p class="">
            <span class="label">昵称：</span>
            
          </p> -->
          <!-- <p class="">
            <span class="label">性别：</span>
            <span class="label fr">{{item.member_sex==1?'男':'女'}}</span>
          </p> -->
          <p class="">
            <span class="label">审核状态：</span>
            <span class="label fr">{{item.member_checkStatus==1?'审核通过':'待审核'}}</span>
          </p>
        </li>
      </ul>
      <p class="hint" v-if="loadState==2" >加载中...</p>
      <p class="hint" v-if="loadState==1" v-on:click="loadMore">点击加载更多</p>
      <p class="hint" v-if="loadState==3">没有更多</p>
      <p class="hint" v-if="loadState==4" v-on:click="reload">加载失败，点击重新加载</p>
    </div>

    <div class="load" v-if="loading">
      <van-loading color="#c1c1c1" size="40px"/>
    </div>
    <div class="actionsheet">
      <van-actionsheet
        v-model="show"
        :actions="actions"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {Loading,Actionsheet,Toast,Dialog} from 'vant';
import {get,post} from '../../src/util/http.js'
require('../../src/util/cookie.js')

export default {
  name: 'cjset',
  components: {
    Loading,
    Actionsheet,
    Toast,
    Dialog
  },
  data(){
    return {
      deviceId:'',
      loading:true,
      items:[],
      show:false,
      actions:[],
      loadState:0 ,// 1可以加载 2加载中 3没有跟多 4加载失败
      pageNum:1,
      pageSize:10,
      openId:Cookies.get('openId')?Cookies.get('openId'):'',
      editData:{} ,// 待编辑数据
      admin:''
    }
  },
  methods:{
    onSelect(item){
      this.show = false;
      if(!this.openId){
        return
      }
      if(item.type=='delete'){
        // 删除
        this.loading=true
        this.delete()
      }else if(item.type=='move'){
        // 转让
        this.loading=true
        this.move()

      }else if(item.type=='allow'){
        // 批准
        this.loading=true
        this.allow()

      }else if(item.type=='reject'){
        // 驳回
        this.loading=true
        this.reject()

      }
    },
    reload(){
      this.getData()
    },

    delete(){

      Dialog.confirm({
        title: '确定删除?',
        message: '删除后将不在展示该成员'
      }).then(() => {
        this.loading=true
        // on confirm
        get('/device/memberDelete',{member_wxUserDeviceId :this.editData.member_wxUserDeviceId,openId:this.openId}).then((res)=>{
        if(res.code==10000){
         Toast('删除成功')
          var id=this.editData.member_wxUserDeviceId
          var _list=this.items
          for(var i=0;i<_list.length;i++){
            if(_list[i].member_wxUserDeviceId==id){
              _list.splice(i,1)
              break
            }
          }
          this.loading=false
          this.items=_list
        }else {
          Toast('删除失败')
          this.loading=false
        }
      }).catch((e)=>{
          this.loading=false
          Toast('删除失败')
          console.log(e)
      })
      }).catch(() => {
        // on cancel
        this.loading=false
        Toast('谢手下留情...')
      });
    },
    move(item){
      Dialog.confirm({
        title: '确定转移?',
        message: '转移后您将不在有部分权限'
      }).then(()=>{
         this.loading=true;
         get('/device/adminTransfer',{deviceId :this.editData.member_deviceId,fromOpenId:this.openId,toOpenId:this.editData.member_openId}).then((res)=>{
          if(res.code==10000){
            this.loading=false
            Toast('转移成功')
            this.loading=false
            this.pageNum=1;
            this.getData()
            this.items=[]
          }else {
            Toast('转移失败')
            this.loading=false
          }
        }).catch((e)=>{
          Toast('转移失败')
          this.loading=false
          console.log(e)
        })
      }).catch(() => {
        // on cancel
        this.loading=false
        Toast('谢手下留情...')
      });      
    },

    allow(){
      // http://live-smart.com.cn/device/checkApproved       GET
      // 入参：
      // wxUserDeviceId    成员设备绑定ID
      get('/device/checkApproved',{wxUserDeviceId:this.editData.member_wxUserDeviceId}).then((res)=>{
        if(res.code==10000){
          this.loading=false
          Toast('审核成功')
          this.loading=false
          let id=this.editData.member_wxUserDeviceId
          this.items.forEach((item,index)=>{
            if(item.member_wxUserDeviceId==id){
                item.member_checkStatus=1
            }
          })
         
        }else {
          Toast('审核失败')
          this.loading=false
        }
      }).catch((e)=>{
        Toast('审核失败')
        this.loading=false
      })
    },
    reject(){
      // http://live-smart.com.cn/device/checkUnapprove    GET
      // 入参：
      // wxUserDeviceId    成员设备绑定ID
      get('/device/checkUnapprove',{wxUserDeviceId:this.editData.member_wxUserDeviceId}).then((res)=>{
        if(res.code==10000){
          this.loading=false
          Toast('驳回成功')
          this.loading=false
          this.pageNum=1;
          this.getData()
          this.items=[]
        }else {
          Toast('驳回失败')
          this.loading=false
        }
      }).catch((e)=>{
        Toast('驳回失败')
        this.loading=false
      })
    },
    loadMore(){
      this.loading=true
      let pageNum=this.pageNum
      pageNum++
      this.pageNum=pageNum;
      this.loadState=2
      this.getData()
    },
    getData(){
      get('/device/memberList',{wxUserDeviceId:this.deviceId,pageNum:this.pageNum,pageSize:this.pageSize}).then((res)=>{
        if(res.code==10000){
         this.loading=false
         if(this.pageNum==1){
           this.admin=res.data.list[0].member_openId
         }
         this.items= this.items.concat(res.data.list)
         this.loadState= (this.pageNum*this.pageSize)>=res.data.total?3:1
        }else if(res.code==30000){
          // 没有权限 回到上一页
          this.$router.go(-1)
        }
      }).catch((e)=>{
        this.loadState=4
        this.loading=false
        this.$router.go(-1)
        console.log(e)
      })
    },
    edit(item){
      console.log(item)
      let data=[]
      if(item.member_checkStatus==1){
        data=[
          {
            name:'删除',
            type:'delete'
          },
          {
            name:'转让',
            type:'move'
          }
        ]
      }else if(item.member_checkStatus==0){
        data=[
          {
            name:'删除',
            type:'delete'
          },
          {
            name:'批准',
            type:'allow'
          },
          {
            name:'驳回',
            type:'reject'
          }
        ]
      }
      this.actions=data
      console.log(data,'---------------------')
      this.editData=item
      this.show=true
    }
  },
  
  mounted(){
    this.deviceId=this.$route.params.id
    this.getData()
  }
}
</script>
<style scoped>
.item_list {
  height: 100%;
  font-size: .4rem;
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
.list ul {
  margin-bottom: .4rem;
}

.item_list .list .item p{
  height: .933rem;
  line-height: .933rem;
  text-align: left;
  
}

.item_list .list ul li {
  border-bottom: 1px solid #c6c6c6;
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

.Administrator {
    color: #0087ff;
    font-size: .5rem !important;
    margin-right: 4px;
}
</style>