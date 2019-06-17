// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {
  ShopApi
} from "../../apis/shop.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    this.Base.setMyData({
      tab: 'null'
    });
    super.onLoad(options);
    this.Base.setMyData({ SHOPID: AppBase.SHOPID });
    
  }
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "外卖",
    })
  }
  onMyShow() {
    var that = this;
    this.Base.setMyData({ mylocation:""});
    this.Base.getAddress((location) => {
      console.log(location);
      console.log(555555555);
      var mylat = location.location.lat;
      var mylng = location.location.lng;
      this.Base.setMyData({
        mylocation: location.ad_info
      });

      var orderb = this.Base.getMyData().tab;

      var shopapi = new ShopApi();
      shopapi.shoplist({
        mylat,
        mylng,
        orderby: orderb,
      }, (shoplist) => {
        console.log(shoplist);
        for (var i = 0; i < shoplist.length; i++) {
          shoplist[i].mile = this.Base.util.GetDistance(mylat, mylng, shoplist[i].lat, shoplist[i].lng);
          shoplist[i].sales = parseInt(shoplist[i].sales) + parseInt(shoplist[i].count1);
          shoplist[i].shop_score = (parseFloat(shoplist[i].shop_score).toFixed(1));
          shoplist[i].miletxt = this.Base.util.GetMileTxt(shoplist[i].mile);
        }
        this.Base.setMyData({ shoplist });
        if (AppBase.SHOPID == 0) {
          AppBase.SHOPID = shoplist[0].id;
          this.Base.setMyData({ SHOPID: AppBase.SHOPID });
        }
      });
    });
    if (this.Base.getMyData().mylocation=='')
    {
   //  this.Base.info("当前未获取到位置授权,请检查是否开启位置服务");
    }
    var shopapi = new ShopApi();
    shopapi.cartlist({}, (cartorder) => {
      this.Base.setMyData({ cartorder });
    });
  }

  changetab(e) {
    this.Base.setMyData({ tab: e.currentTarget.id });
    this.Base.getAddress((location) => {
      console.log(location);
      var mylat = location.location.lat;
      var mylng = location.location.lng;
      this.Base.setMyData({
        mylocation: location.ad_info
      });
      var shopapi = new ShopApi();
      shopapi.shoplist({
        mylat,
        mylng,
        orderby: e.currentTarget.id,
      }, (shoplist) => {
        for (var i = 0; i < shoplist.length; i++) {
          shoplist[i].mile = this.Base.util.GetDistance(mylat, mylng, shoplist[i].lat, shoplist[i].lng);
          shoplist[i].sales = parseInt(shoplist[i].sales) + parseInt(shoplist[i].count1);
          shoplist[i].shop_score = (parseFloat(shoplist[i].shop_score).toFixed(1));
          shoplist[i].miletxt = this.Base.util.GetMileTxt(shoplist[i].mile);
        }
        this.Base.setMyData({ shoplist });
        if (AppBase.SHOPID == 0) {
          AppBase.SHOPID = shoplist[0].id;
          this.Base.setMyData({ SHOPID: AppBase.SHOPID });
        }
      });
    });


  }
  chooseShop(e) {
    var id = e.currentTarget.id;
    AppBase.SHOPID = id;
    wx.navigateTo({
      url: '/pages/menu/menu?ydd=' + this.Base.options.ydd,
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changetab = content.changetab;
body.chooseShop = content.chooseShop;
Page(body)