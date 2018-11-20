<template>
  <div class="download">
    <div v-if="isPc">
      <h1>慧居科技</h1>
      <div>
          <p>请选择导出的开始和结束日期</p>
         <el-date-picker
          v-model="value1"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="change"
          >
        </el-date-picker>
      </div>
      <div>
        <div class="panel-body">
          <p><strong>注意事项：</strong><br>1、导入文件格式：.xls，.xlsx<br></p>
          <p style="margin-top:10px;"><strong>考勤导入：</strong><a class="btn btn-primary btn-xs " @click="chooseFile">选择文件</a></p>
          <p>已选择文件：<em style="color:red; font-style:normal;">{{attence}}</em></p><p>{{info}}</p>
          <input type="file" style="display:none" name="attence"  @change="changeFile($event)" ref="attenceInput" />
      </div>
      <div class="panel-footer">
          <a class="btn btn-primary btn-md" @click="upFile">确认导入</a>
      </div>
      </div>
    </div>
    <div v-else>
      <h1>请用电脑访问</h1>
    </div>

    
  
   
  </div>
</template>

<script>
// @ is an alias to /src
import { DatetimePicker , Actionsheet ,Loading,Toast ,Dialog } from 'vant'
import {get,post} from '../../src/util/http.js'
import {formatDatePub,nyr,IsPc} from '../../src/util/util.js'
require('../../src/util/cookie.js')
import axios from 'axios';
export default {
  name: 'home',
  components: {
    Loading,
    Actionsheet ,
    Toast,
    Dialog,
    DatetimePicker
  },
  filters:{
    nyr
  },
  methods:{
    change(e){
      console.log(new Date(e[0]).getTime(),'-------------',new Date(e[1]).getTime())
    },
    chooseFile(){
      this.$refs.attenceInput.click();
    },
    changeFile (e) {
      this.attence = e.target.files[0].name;
      this.attenceFile = e.target.files[0];
    },

    upFile(){
      let filename = this.attenceFile.name;
      let arr = filename.split('.');
      console.log(this.attenceFile)
      if (arr[1] !== 'xls' && arr[1] !== 'xlsx') {
        Toast('文件格式错误！');
        return;
      }
      let fileData = new window.FormData();
      fileData.append('file', this.attenceFile);
      console.log(fileData)
      let config={
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }
      // return
      axios.post('http://live-smart.com.cn/file/device/import',fileData,config).then((res)=>{
        console.log(res)
      }).catch((e)=>{
        console.log(e)
      })



    }

  //   upFile(){
  //     let filename = this.attenceFile.name;
  //       let arr = filename.split('.');
  //       if (arr[1] !== 'xls' && arr[1] !== 'xlsx') {
  //         this.$toast.center('文件格式错误！');
  //         return;
  //       }
  //       let fileData = new window.FormData();
  //       fileData.append('file', this.attenceFile) 
  //       let filename = this.attenceFile.name;
  //        let arr = filename.split('.');
  //        if (arr[1] !== 'xls' && arr[1] !== 'xlsx') {
  //          this.$toast.center('文件格式错误！');
  //          return;
  //        }
  //        let fileData = new window.FormData();
  //        fileData.append('file', this.attenceFile) 
  //        let filename = this.attenceFile.name;
  //        let arr = filename.split('.');
  //        if (arr[1] !== 'xls' && arr[1] !== 'xlsx') {
  //          this.$toast.center('文件格式错误！');
  //          return;
  //        }
  //        let fileData = new window.FormData();
  //        fileData.append('file', this.attenceFile)
  //       //  xhr
  //       //  xhr.onreadystatechange = () => {
  //       //   if (xhr.readyState === 4) {
  //       //   if (xhr.status === 200) {
  //       //   let response = JSON.parse(xhr.response)
  //       //   this.$toast.center(response.message)
  //       //   } else {
  //       //   let error = this.$emit('upload-error', xhr)
  //       //   if (error !== false) {
  //       //     this.$toast.center(xhr.statusText)
  //       //   }
  //   }
  // }
  //   }
  //   }
  },
  data(){
    return {
      value1:'',
      isPc:IsPc(),
      attence:'',
      attenceFile:{},
      info:{}
    }
  },
  mounted(){

   window.addEventListener("resize", () => {this.isPc=IsPc() });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  body {
    width: 100% !important;
    max-width: 100% !important;
  }
  .date {
    width: 300px;
    margin: 0 auto;
  }

</style>
