// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
    this.needauth=false;
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
  }
  gomenu(){

    wx.switchTab({
      url: '../menu/menu',
    });

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.gomenu = content.gomenu;
Page(body)