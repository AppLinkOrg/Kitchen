// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {
  ShopApi
} from "../../apis/shop.api.js";
import {
  WechatApi
} from "../../apis/wechat.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.order_id=11;
   
    

      this.djs();

    

    super.onLoad(options);
  }
  onMyShow() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        var zitima=0;
        var that = this;
        var shopapi = new ShopApi();
        shopapi.orderinfo({ id: this.Base.options.id }, (info) => {
          var aaaa = info.orderno;
          zitima = aaaa.substr(aaaa.length - 4);
          info.amount = parseFloat(info.amount);
          
          this.Base.setMyData({ info,zitima:zitima });
          shopapi.orderitem({ order_id: this.Base.options.id }, (orderitem) => {
            this.Base.setMyData({ orderitem });



            shopapi.shopinfo({ id: this.Base.options.shop_id }, (shop) => {





              var didian = [];
              var didian1 = {};
              var didian2 = {};
              info.pay_time = info.pay_time.replace(/-/g, '/');
              var sj = new Date(info.pay_time);
              console.log(info.pay_time);
          
              var ziti_time = new Date((sj).getTime() + parseInt(shop.ziti_minute) * 60 * 1000);
              var songhuo_time = new Date((sj).getTime() + parseInt(shop.songhuo_minute) * 60 * 1000);


              console.log(ziti_time);
              

              shop.ziti = ziti_time.getHours() + ":" + ziti_time.getMinutes();
              shop.songhuo = songhuo_time.getHours() + ":" + songhuo_time.getMinutes();
              didian1.longitude = shop.lng;
              didian1.latitude = shop.lat;
              didian1.width = 30;
              didian1.height = 30;
              didian1.iconPath = "/images/icons/dinwei.png",
                didian1.color = '#FF0000DD';
              didian1.label =  {
                content: "商家",
                  
                    display: 'ALWAYS',
                      textAlign: 'center',
              }
              didian2.label = {
                content: "我的",

                display: 'ALWAYS',
                textAlign: 'center',
              }

                   


              didian2.longitude = res.longitude;
              didian2.latitude = res.latitude;
              didian2.width = 30;
              didian2.height = 30;
              didian2.iconPath = "/images/icons/wode.png",
                didian2.color = '#FF0000DD';
              didian.push(didian1);
              didian.push(didian2);

              this.Base.setMyData({ shop, didian });
              //GetDistance
            });
          });
        });

      }

    })
   


   
  }
djs(){
  var that = this;
  this.timer = setInterval(() => {

    if (that.Base.getMyData().info.status=='P')

{
    var fen;

    var miao;
   
    var num = 0;
    //循环转化时
      var gqsj = parseInt(that.Base.getMyData().info.submit_time_timespan)+300;


      var dqsj = Date.parse(new Date()) / 1000;
     
      var sjj = gqsj - dqsj;
      console.log(gqsj);
      console.log(dqsj);
      fen=parseInt(sjj/60%60)
      miao = parseInt(sjj%60);

    
    content.setMyData({

      fen: fen,
      miao: miao,
      
    })
}
  }, 1000);

  }
  onUnload(){
    clearInterval(this.timer); 

  }

  payment(e) {
    var that=this;
    var api = new WechatApi();
    api.prepay({order_id:this.Base.options.id}, (ret) => {
      console.log(ret);
      ret.complete = function (e) {
        that.onMyShow();
      }
      wx.requestPayment(ret);
    });
  }
  cancel(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确定取消本订单？',
      success(e){
        if(e.confirm){
          var shopapi = new ShopApi();
          shopapi.cancelorder({ order_id: that.Base.options.id }, () => {
            that.onMyShow();
          });
        }
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.calc = content.calc; 
body.payment = content.payment;
body.cancel = content.cancel;
body.djs=content.djs;
Page(body)