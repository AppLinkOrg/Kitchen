// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  ShopApi
} from "../../apis/shop.api.js";

class Content extends AppBase {
  constructor() {

    super();
  }
  onLoad(options) {
    this.Base.needauth = false;
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
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
        mylng
      }, (shoplist) => {
        for (var i = 0; i < shoplist.length; i++) {
          shoplist[i].mile = this.Base.util.GetDistance(mylat, mylng, shoplist[i].lat, shoplist[i].lng);

          shoplist[i].miletxt = this.Base.util.GetMileTxt(shoplist[i].mile);
        }
        this.Base.setMyData({ shoplist });
        var currentshop = this.Base.getMyData().currentshop;
        if (currentshop == null) {
          this.setCurrent(shoplist[0].id)
        }
      });
    });
  }
  setCurrent(shop_id) {
    var shoplist = this.Base.getMyData().shoplist;
    for (var i = 0; i < shoplist.length; i++) {
      if (shoplist[i].id == shop_id) {
        this.Base.setMyData({ currentshop: shoplist[i] });

        var shopapi = new ShopApi();
        shopapi.menucat({ menu_id: shoplist[i].menu_id }, (menucat) => {
          shopapi.menugoods({ menu_id: shoplist[i].menu_id }, (menugoods) => {
            var ret=[];
            for(var i=0;i<menucat.length;i++){
              menucat[i].goods=[];
              for (var j = 0; j < menugoods.length; j++) {
                if(menucat[i].id==menugoods[j].cat_id){
                  menucat[i].goods.push(menugoods[j]);
                }
              }
              if(menucat[i].goods.length>0){
                ret.push(menucat[i]);
              }
            }
            this.Base.setMyData({menu:ret});
          });
        });
        return;
      }
    }
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.setCurrent = content.setCurrent;
Page(body)