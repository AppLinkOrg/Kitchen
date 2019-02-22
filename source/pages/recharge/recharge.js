// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {
  WechatApi
} from "../../apis/wechat.api.js";
import {
  OrderApi
} from "../../apis/order.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
  
    super.onLoad(options);
    var api=new InstApi();
    api.getuplist({},(uplist)=>{
       
       for( var i in uplist)
       {

         uplist[i].amount = parseInt(uplist[i].amount);
       }
      this.Base.setMyData({

        uplist: uplist, checked: uplist[0].id
      })
    
    })
   
  }
  onMyShow() {
    var that = this;
  }
  xuanze(e){
    this.Base.setMyData({
      checked: e.currentTarget.id

    })
   
  }

 chonzhi(){
   var data = this.Base.options;
   data.czid=this.Base.getMyData().checked;
   data.member_id = this.Base.getMyData().memberinfo.id;
   data.status='P';
   var api1=new OrderApi();
   api1.addrechargerd(data,(res)=>{
    
     var api = new WechatApi();
     data.id=res.return;
     api.czprepay(data, (res) => {
      
      
       wx.requestPayment({
         timeStamp: res.timeStamp,
         nonceStr: res.nonceStr,
         package: res.package,
         signType: 'MD5',
         paySign: res.paySign,
         success(res) {
           wx.navigateBack({
             success() {

               wx.showToast({

                 title: '支付成功',
                 icon: 'success',
                 duration: 2000
               })
             }
           })

         },
         fail(res) {


           wx.showToast({

             title: '支付失败',
             icon: 'none',
             duration: 2000
           })

         }
       })
     });


   })
   
   
 }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.gotowallet = content.gotowallet;
body.xuanze = content.xuanze;
body.chonzhi = content.chonzhi;
Page(body)