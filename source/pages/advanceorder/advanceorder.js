// pages/advanceorder/advanceorder.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
    //this.needauth=false;
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var time1 = new Date();
    var time = new Date(time1.getTime() + 24 * 60 * 60 * 1000);
    console.log(time);
    var myddy = time1.getDay();

    var h = time.getHours();
    var nian = time.getFullYear(); 
    var yue = time.getMonth()+1;
    var ri = time.getDate();
    
    var hlist = [
      '00', '01', '02',
      '03', '04', '05',
      '06', '07', '08',
      '09', '10', '11',
      '12', '13', '14',
      '15', '16', '17',
      '18', '19', '20',
      '21', '22', '23'
    ]
    var mlist = ['00', '20', '40']
    var show_day = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    this.Base.setMyData({
      hlist: hlist,
      mlist: mlist,
      myddy: myddy,
      show_day: show_day,
     nian: nian,
     yue:yue,
     ri:ri
    })
    


  }
  xzs(e){
    this.Base.setMyData({
      xzs: e.currentTarget.id
    })
 
  }
  xzf(e){
    this.Base.setMyData({
      xzf: e.currentTarget.id
    })
  }
  qdc(){
    var hlist = this.Base.getMyData().hlist;
    var mlist = this.Base.getMyData().mlist;

    var xzs = hlist[this.Base.getMyData().xzs];
    var xzf = mlist[this.Base.getMyData().xzf];
    var nian = this.Base.getMyData().nian;
    var yue = this.Base.getMyData().yue;
    var ri = this.Base.getMyData().ri;
   
    if(xzs!=undefined&&xzf!=undefined)
    {
     

      var s=(nian + "-" + yue + "-" + ri + " " + xzs + ":" + xzf + ":" + "00");
     
      s = s.replace(/-/g, "/");
      var date = new Date(s);
    
      //   wx.navigateTo({
      //     url: '/pages/shopchoose/shopchoose?ydd=' + s,
          
      //  })
      wx.navigateTo({
        url: '/pages/orderdetails/orderdetails?shop_id=' + this.Base.options.shop_id + "&orderids=" + this.Base.options.orderids + "&menu_id=" + this.Base.options.menu_id
          + "&ydd=" +s,
      })
    }

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.xzs = content.xzs;
body.xzf = content.xzf;
body.qdc=content.qdc;
Page(body)