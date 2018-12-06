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
    //options.id=19;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var shopapi = new ShopApi();
    shopapi.orderinfo({id:this.Base.options.id},(info)=>{
      info.amount = parseFloat(info.amount);
      this.Base.setMyData({info});
      shopapi.orderitem({ order_id: this.Base.options.id }, (orderitem) => {
        this.Base.setMyData({ orderitem });
      });
    });
    
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
Page(body)