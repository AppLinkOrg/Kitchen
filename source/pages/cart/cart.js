// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ num: 1 ,xuanzhon:1});
  }
  onMyShow() {
    var that = this;
  }
  jian() {
    var num = this.Base.getMyData().num;
    if (num > 1) {
      num--;
      this.Base.setMyData({ num });
    }
  }
  jia() {
    var num = this.Base.getMyData().num;
    if (num < 99) {
      num++;
      this.Base.setMyData({ num });
    }
  }
  changexz(e) {
    this.Base.setMyData({
      xuanzhon: e.currentTarget.id
    });
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.jia = content.jia;
body.jian = content.jian;
body.changexz = content.changexz;
Page(body)