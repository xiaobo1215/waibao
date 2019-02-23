/* 发表时间格式化 */
export function formatDatePub(value) {
  if (value == null) return;
  //当前时间
  var n = new Date();
  var o = new Date(value);
  var newtime = n.getTime();
  var oldtime = o.getTime();
  var c = (newtime - oldtime) / 1000;

  //小于一分钟显示 刚刚
  if (c < 60) {
    return "刚刚";
  } else if (60 < c && c < 3600) {    //大于1分钟 小于60分钟 显示30分钟前
    return Math.floor(c / 60) + "分钟前";
  } else if (3600 < c && c < 86400) {   //大于60分钟 小于24小时  显示小时前
    return Math.floor(c / 3600) + "小时前";
  } else if (86400 < c) {   //大于24小时
    var month = '' + (o.getMonth() + 1),
      day = '' + o.getDate(),
      year = o.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    //同年只显示 月-日
    if (n.getFullYear() == o.getFullYear()) {
      return [month, day].join('-');
    } else {
      return [year, month, day].join('-');
    }
  }
}

/* 防抖 */
export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/* 年月日  时分秒 */

export function nyr(val){
  if(!val) return
  val=val*1000
  var d=new Date(val);
  var year=d.getFullYear();
  var month=change(d.getMonth()+1);
  var day=change(d.getDate());
  var hour=change(d.getHours());
  var minute=change(d.getMinutes());
  var second=change(d.getSeconds());
  function change(t){
    if(t<10){
     return "0"+t;
    }else{
     return t;
    }
  }
  var time=year+'-'+month+'-'+day+'        '+hour+':'+minute+':'+second;
  return time
}

export function NYR(val){
  if(!val) return
  val=val*1000
  var d=new Date(val);
  var year=d.getFullYear();
  var month=change(d.getMonth()+1);
  var day=change(d.getDate());
  var hour=change(d.getHours());
  var minute=change(d.getMinutes());
  var second=change(d.getSeconds());
  function change(t){
    if(t<10){
     return "0"+t;
    }else{
     return t;
    }
  }
  var time = year+'-'+month+'-'+day
  return time
}

export function SFM(val){
  if(!val) return
  val=val*1000
  var d=new Date(val);
  var year=d.getFullYear();
  var month=change(d.getMonth()+1);
  var day=change(d.getDate());
  var hour=change(d.getHours());
  var minute=change(d.getMinutes());
  var second=change(d.getSeconds());
  function change(t){
    if(t<10){
     return "0"+t;
    }else{
     return t;
    }
  }
  var time = hour+':'+minute+':'+second
  return time
}

/* 年月日  时分秒 */

export function Dnyr(val){
  if(!val) return
  // val=val*1000
  var d=new Date(val);
  var year=d.getFullYear();
  var month=change(d.getMonth()+1);
  var day=change(d.getDate());
  var hour=change(d.getHours());
  var minute=change(d.getMinutes());
  var second=change(d.getSeconds());
  function change(t){
    if(t<10){
     return "0"+t;
    }else{
     return t;
    }
  }
  var time=year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
  return time
}

export function IsPc(){
  let userAgentInfo = navigator.userAgent;
  let Agents = ["Android", "iPhone",
      "SymbianOS", "Windows Phone",
      "iPad", "iPod"];
      let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
    }
  }
  return flag;
}

export function state(){
  var _currentstate={}
  var states={
    jump:function(){
      console.log('jump')
    },
    move:function(){
      console.log('move')
    },
    shoot:function(){
      console.log('shoot')
    },
    squat:function(){
      console.log('shoot')
    }
  };
  var Action={
    changestate:function(){
      var arg=arguments;
      _currentstate={};
      if(arg.length){
        for(var i=0;i<arg.length;i++){
          _currentstate[arg[i]]=true
        }
      }

      return this
    },

    goes:function(){
      console.log('触发一次动作')
      for(var i in _currentstate){
        states[i] &&　states[i]()
      }
      return this
    }
  }

  return {
    change:Action.changestate,
    goes:Action.goes
  }
}

var marry=new state()
