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
  
    super.onLoad(options);
    this.Base.setMyData({
      checked:1
    
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

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.gotowallet = content.gotowallet;
body.xuanze = content.xuanze;
Page(body)