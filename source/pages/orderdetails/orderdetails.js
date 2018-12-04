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
    //options = { expresstype: "A", shop_id: "1", menu_id: "1", orderids: "6,1" };
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ totalprice:0});
  }
  onMyShow() {
    var that = this;
    var shopapi=new ShopApi();
    shopapi.shopinfo({id:this.Base.options.shop_id},(shop)=>{
      this.Base.setMyData({shop});
    });
    this.setCurrent();
  }



  setCurrent() {
    var shopapi = new ShopApi();

    shopapi.menugoods({
      menu_id: this.Base.options.menu_id
    }, (menugoods) => {
      this.Base.setMyData({
        menugoods
      });
      var shopapi = new ShopApi();
      shopapi.cartlist({ orderids: this.Base.options.orderids}, (orderitem) => {
        this.Base.setMyData({ orderitem});
        this.calc();
      });
    });
  }
  calc() {
    var orderitem = this.Base.getMyData().orderitem;
    var menugoods = this.Base.getMyData().menugoods;
    var totalprice = 0;
    var totalnum = 0;
    var cansales = [];
    for (var i = 0; i < orderitem.length; i++) {
      var vallist = orderitem[i].vallist;
      var price = parseFloat(orderitem[i].goods_price);
      var valstr = [];
      for (var a of vallist) {
        valstr.push(a.sname);
        price += parseFloat(a.price);
      }
      totalnum += parseInt(orderitem[i].num);
      orderitem[i].valstr = valstr.join("/");
      orderitem[i].oneprice = price;

      for (var a of menugoods) {
        if (a.goods_id == orderitem[i].goods_id) {
          var price = orderitem[i].oneprice;
          console.log(a.discount);
          if (a.discount > 0) {
            console.log("jkk");
            orderitem[i].oldprice = orderitem[i].oneprice;
            orderitem[i].oneprice = parseFloat((orderitem[i].oneprice * parseFloat(a.discount / 10.0)).toFixed(2));
            orderitem[i].havediscount = "Y";
          }
          break;
        }

      }
      orderitem[i].numprice = orderitem[i].oneprice * parseInt(orderitem[i].num);
      
      totalprice += orderitem[i].numprice;

    }
    


    this.Base.setMyData({
      orderitem,
      totalprice
    });
  }
  payment(e){

    var api = new WechatApi();
    api.prepay(this.Base.options, (ret)=>{
      console.log(ret);
      ret.complete = function (e) {
        wx.navigateTo({
          url: '/pages/orderresult/orderresult?id='+ret.retid,
        })
      }
      wx.requestPayment(ret);
    });


  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.calc = content.calc; 
body.setCurrent = content.setCurrent;
body.payment = content.payment;
Page(body)