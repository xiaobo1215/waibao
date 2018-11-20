<template>
  <div class="cjset">
    <p class="title">采集上传设置</p>
    <div class="btn_wrap">
      <p>
        <van-button type="primary" v-on:click="cj">采集间隔设置</van-button>
        <span class="fr" v-if="viewCjTime!=''">{{viewCjTime}}</span>
      </p>
      <p>
        <van-button type="primary"  v-on:click="sb">上报间隔设置</van-button>
        <span class="fr" v-if="viewSbTime!=''">{{viewSbTime}}</span>
      </p>
      <p><van-button type="primary">确认</van-button></p>
    </div>
    <div>
      <van-actionsheet
        v-model="show"
        :actions="mod"
        @select="oncj"
      />
      <van-actionsheet
        v-model="showTow"
        :actions="modTow"
        @select="onsb"
      />
    </div>

    <!-- 弹出采集自定义修改框 -->
    <div class="dialog">
      <van-dialog
        v-model="showdialog"
        show-cancel-button
        :before-close="beforeClose"
        :title="'自定义采集间隔'"
        @confirm="onConfirm"
      >
        <van-field
          v-model="cjtime"
          label="分钟"
          type="number"
          placeholder="请输入1-60"
          oninput="if(value.length>2)value=value.slice(0,2)"
        />
      </van-dialog>
    </div>

    <!-- 弹出上报自定义修改框 -->
    <div class="dialog">
      <van-dialog
        v-model="showdialogTow"
        show-cancel-button
        :before-close="beforeCloseTow"
        :title="'自定义上报间隔'"
        @confirm="onConfirm"
      >
        <van-field
          v-model="sbTimeM"
          label="分钟"
          type="number"
          placeholder="请输入10-60"
          oninput="if(value.length>2)value=value.slice(0,2)"
        />
      </van-dialog>
    </div>

    <!-- 弹出上报自定义修改框 -->
    <div class="dialog">
      <van-dialog
        v-model="showdialogThree"
        show-cancel-button
        :before-close="beforeCloseThree"
        :title="'自定义上报间隔'"
        @confirm="onConfirm"
      >
        <van-field
          v-model="sbTimeH"
          label="小时"
          type="number"
          placeholder="请输入1-24"
          oninput="if(value.length>2)value=value.slice(0,2)"
        />
      </van-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Button,Actionsheet,Dialog ,Toast } from 'vant';

export default {
  name: 'cjset',
  components: {
    Button,
    Actionsheet,
    Dialog ,
    Toast 
  },
  methods:{
    cj(){
      this.show=true
    },
    oncj(item){
      this.show = false;
      if(item.name=='自定义'){
        this.custom()
      }else {
        this.viewCjTime=item.name
        this.viewCjTimeVal=item.val
      }
      console.log(item)
    },
    custom(){
      this.showdialog=true
    },
    beforeClose(action, done){
      if (action === 'confirm') {
        let reg=/0\d/
        let cjtime=this.cjtime.replace(/^\s+|\s+$/gm,'')
        if(this.cjtime=='' || this.cjtime=='00' ||　reg.test(cjtime)){
          Toast.fail('请输入正确的时间');
          done(false)
          return
        }
        this.viewCjTime=this.cjtime+'分钟'
        this.cjtime=''
        setTimeout(done, 1000);
      } else {
        done();
      }
    },
    onConfirm(){

    },


    sb(){
      this.showTow=true
    },

    onsb(item){
      this.showTow = false;
      if(item.name=='自定义分钟'){
        this.showdialogTow=true
      }else if(item.name=='自定义小时') {
        this.showdialogThree=true
      }else {
        this.viewSbTime=item.name
        this.viewSbTimeVal=item.val
      }
    },
    customTow(){

    },
    beforeCloseTow(action,done){
      if (action === 'confirm') {
        let reg=/0\d/
        let sbTimeM=this.sbTimeM.replace(/^\s+|\s+$/gm,'')
        if(this.sbTimeM=='' || this.sbTimeM=='00' ||　reg.test(sbTimeM) || (sbTimeM>60)){
          Toast.fail('请输入正确的时间');
          done(false)
          return
        }
        this.viewSbTime=this.sbTimeM+'分钟'
        this.sbTimeM=''
        setTimeout(done, 1000);
      } else {
        done();
      }
    },
    beforeCloseThree(action,done){
      if (action === 'confirm') {
        let reg=/0\d/
        let sbTimeH=this.sbTimeH.replace(/^\s+|\s+$/gm,'')
        if(this.sbTimeH=='' || this.sbTimeH=='00' ||　reg.test(sbTimeH) || (sbTimeH>24)){
          Toast.fail('请输入正确的时间');
          done(false)
          return
        }
        this.viewSbTime=this.sbTimeH+'小时'
        this.sbTimeH=''
        setTimeout(done, 1000);
      } else {
        done();
      }
    }
  },
  data(){
    return {
      show:false,
      showTow:false,
      showdialog:false,
      showdialogTow:false,
      showdialogThree:false,
      cjtime:'', // 采集间隔时间
      viewCjTime:'', // view 显示的选着后的采集间隔时间
      viewCjTimeVal:'',// 采集间隔时间

      sbTimeM:'',
      sbTimeH:'',
      viewSbTime:'',
    
      modTow:[
        {
          name:'10分钟',
          val:600
        },
        {
          name:'30分钟',
          val:1800
        },
        {
          name:'1小时',
          className:'aa',
          val:3600
        },
        {
          name:'12小时',
          val:43200
        },
        {
          name:'自定义分钟'
        },
         {
          name:'自定义小时'
        }
      ],
      mod:[
        {
          name:'1分钟',
          val:1
        },
        {
          name:'5分钟',
          val:5
        },
        {
          name:'10分钟',
          className:'aa',
          val:10
        },
        {
          name:'自定义'
        }
      ]
    }
  },
  mounted(){
    // console.log(this.params,'-----------params')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn_wrap {
  padding: .4rem;
}

.btn_wrap p {
  text-align: left;
  height: 1.333rem;
  line-height: 1.333rem;
}

.btn_wrap button {
  margin-right: .267rem;
}

.aa{
  background: #f1f1f1 !important;
}

.title {
  font-size: .4rem;
  padding: .4rem;
  text-align: center;
}

.bod {
  background:#fff;
}

.box {
  background: #fff;
}

</style>
