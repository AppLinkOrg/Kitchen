import {
  ApiConfig
} from 'apiconfig.js';

export class ApiUtil {

  static renamelist = [];

  static HtmlDecode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");


    s = s.replace(new RegExp("</p>", "gm"), "</p><br />");
    s = s.replace(new RegExp("\"/alucard263096/kitchen/upload/", "gm"), "\"" + "https://cmsdev.app-link.org/alucard263096/kitchen/upload/");


    return s;
  }

 static format()
 {
   var o = {
     "M+": this.getMonth() + 1, //月份 
     "d+": this.getDate(), //日 
     "H+": this.getHours(), //小时 
     "m+": this.getMinutes(), //分 
     "s+": this.getSeconds(), //秒 
     "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
     "S": this.getMilliseconds() //毫秒 
   };
   if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
   for (var k in o)
     if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
   return fmt;
 }
 
  static fixRename(ret) {
    var renamelist = ApiUtil.renamelist;
    console.log("rename a");
    if (ret instanceof Array) {
      for (var i = 0; i < ret.length; i++) {
        if (ret[i].member_id != undefined && renamelist[ret[i].member_id] != undefined && renamelist[ret[i].member_id] != "") {
          ret[i].member_nickName = renamelist[ret[i].member_id];
        }
        if (ret[i].nickName != undefined && renamelist[ret[i].id] != undefined && renamelist[ret[i].id] != "") {
          ret[i].nickName = renamelist[ret[i].id];
        }
      }
    } else {
      console.log("rename b"); 
      if (ret.member_id != undefined && renamelist[ret.member_id] != undefined && renamelist[ret.member_id] != "") {
        ret.member_nickName = renamelist[ret.member_id].nickName;
      }
      if (ret.nickName != undefined && renamelist[ret.id] != undefined && renamelist[ret.id] != "") {
        console.log("rename c");
        ret.nickName = renamelist[ret.id];
      }
    }
    return ret;
  }

  static Toast(toastCtrl, msg) {
    let toast = toastCtrl.create({
      message: msg
      
    });
    toast.present();
  }

  static FormatDateTime(date){
    console.log("FormatDateTime"+date);
    var year = ApiUtil.ten2(date.getFullYear());
    var month = ApiUtil.ten2(date.getMonth() + 1);
    var datec = ApiUtil.ten2(date.getDate());
    var hour = ApiUtil.ten2(date.getHours());
    var minute = ApiUtil.ten2(date.getMinutes());
    var second = ApiUtil.ten2(date.getSeconds());

    var v= year + "-" + month + "-" + datec+" "+hour+":"+minute+":"+second;

    console.log("FormatDateTime=" + v);
    return v;
  }

  static ten2(i){
    i=parseInt(i);
    if(i>9){
      return i.toString();
    }else{
      return "0"+i.toString();
    }
  }

  static FormatDate(val) {
    var date=ApiUtil.FormatDateTime(val);
    return date.substring(0,10);
  }
  static FormatTime(val) {
    var date = ApiUtil.FormatDateTime(val);
    return date.substring(11, 19);
  }
  static FormatTime2(val) {
    var date = ApiUtil.FormatDateTime(val);
    return date.substring(11, 16);
  }

//判断当前时间是否在制定时间内
  static checkInOpen(opening) {
    var whedate = false;
    try{
    var mydate = new Date();
    mydate = mydate.getHours() + ":" + mydate.getMinutes();
    console.log("mmmopenning" + opening);
    var sj = opening.split(",");
    for (var i = 0; i < sj.length; i++) {
      sj[i] = sj[i].split("-");
      console.log("mmmms" + sj[i][0]);
      console.log("mmmm" + mydate);
      console.log("mmmme" +sj[i][1]);

      var m = parseInt(mydate.replace(":", ""));
      var s = parseInt(sj[i][0].replace(":",""));
      var e = parseInt(sj[i][1].replace(":", ""));

      console.log("mmmms2" +s);
      console.log("mmmm2" +m);
      console.log("mmmme2" +e);
      if (s < m && e > m) {
        whedate = true;
      }
      }
      console.log("判断时间");
      console.log(whedate);
    }catch(e){

    }
    return whedate;
}

  static IsMobileNo(str) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return myreg.test(str);
  }
  static FormatPercent(val) {
    val = val * 100.0;
    return val.toFixed(2) + '%';
  }
  static FormatPrice(val) {
    val = val * 1.0;
    return val.toFixed(2);
  }
  static FormatNumber(val, digits) {
    val = val * 1.0;
    return val.toFixed(digits);
  }
  static Storage = null;

  static TimeAgo(agoTime) {

    // 计算出当前日期时间到之前的日期时间的毫秒数，以便进行下一步的计算
    var time = (new Date()).getTime() / 1000 - agoTime;

    var num = 0;
    if (time >= 31104000) { // N年前
      num = parseInt(time / 31104000);
      return num + '年前';
    }
    if (time >= 2592000) { // N月前
      num = parseInt(time / 2592000);
      return num + '月前';
    }
    if (time >= 86400) { // N天前
      num = parseInt(time / 86400);
      return num + '天前';
    }
    if (time >= 3600) { // N小时前
      num = parseInt(time / 3600);
      return num + '小时前';
    }
    if (time > 60) { // N分钟前
      num = parseInt(time / 60);
      return num + '分钟前';
    }
    return '1分钟前';
  }


  static fixImages(info) {
    var images = [];
    if (info.photo1 != "") {
      images.push(info.photo1);
    }
    if (info.photo2 != "") {
      images.push(info.photo2);
    }
    if (info.photo3 != "") {
      images.push(info.photo3);
    }
    if (info.photo4 != "") {
      images.push(info.photo4);
    }
    if (info.photo5 != "") {
      images.push(info.photo5);
    }
    if (info.photo6 != "") {
      images.push(info.photo6);
    }
    if (info.photo7 != "") {
      images.push(info.photo7);
    }
    if (info.photo8 != "") {
      images.push(info.photo8);
    }
    if (info.photo9 != "") {
      images.push(info.photo9);
    }
    if (info.photo10 != "") {
      images.push(info.photo10);
    }
    if (info.photo11 != "") {
      images.push(info.photo11);
    }
    if (info.photo12 != "") {
      images.push(info.photo12);
    }
    if (info.photo13 != "") {
      images.push(info.photo13);
    }
    if (info.photo14 != "") {
      images.push(info.photo14);
    }
    return images;
  }

  static Rad(d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
  }
  static GetDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = ApiUtil.Rad(lat1);
    var radLat2 = ApiUtil.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = ApiUtil.Rad(lng1) - ApiUtil.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // 地球半径，千米;
    s = Math.round(s * 10000) / 10000; //输出为公里
    s = Math.round(s * 1000) / 1; //单位修改为米,取整
    //s=s.toFixed(4);
    console.log("计算地址");
    console.log(s);
    return s;
  }
  static GetMileTxt(mile){
    console.log(mile);
    if (mile > 1000) {
      return "约" + (mile / 1000.0).toFixed(0) + "公里";
    } else if (mile < 100) {
      return  "100米内";
    } else {
      return  "" + (mile).toString() + "米";
    }
  }
}