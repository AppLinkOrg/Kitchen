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
  MemberApi
} from '../../apis/member.api';
import {
  ShopApi
} from "../../apis/shop.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);


    this.Base.setMyData({
      fenshu: 0, inputVal: "", start_photo: []
    });
  }
  onMyShow() {
    var that = this;
    var that = this;
    var shopapi = new ShopApi();
    shopapi.orderinfo({ id: this.Base.options.id }, (info) => {
      info.amount = parseFloat(info.amount);

      this.Base.setMyData({ info });

    });

  }
  pingfen(e) {

    this.Base.setMyData({
      fenshu: parseInt(e.currentTarget.id) + 1
    });
  }
  startuploadimg(e) {
    var that = this;
    var id = e.currentTarget.id;
    var start_photo = [];
    this.Base.uploadImage("photo", (ret) => {
      start_photo.push(ret);
      that.Base.setMyData({
        start_photo
      });
    }, () => { }, 3);
  }
  tijiao() {

    var fenshu = this.Base.getMyData().fenshu;
    var pinglun = this.Base.getMyData().inputVal;
    var zhaopian = this.Base.getMyData().start_photo;
    var dianpu = this.Base.getMyData().info.shop_id;
    var member = this.Base.getMyData().memberinfo.id;
    var ordergroup	=this.Base.options.id;
    if (fenshu != 0 && pinglun != "") {
      var shopapi = new ShopApi();
      shopapi.addshopscore({
        shop_id: dianpu, member_id: member, score: fenshu, content: pinglun, picture: zhaopian,
        ordergroup_id: ordergroup

      }, (huidiao) => {
        this.Base.toast("评论完成");
        wx.navigateBack({

        })

      })

    }



  }

  shuru(e) {
    this.Base.setMyData({
      inputVal: e.detail.value
    });

  }


}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.pingfen = content.pingfen;
body.startuploadimg = content.startuploadimg;
body.tijiao = content.tijiao;
body.shuru = content.shuru;
Page(body)