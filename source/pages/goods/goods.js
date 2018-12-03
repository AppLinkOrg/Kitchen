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
    this.Base.needauth=false;
    super.onLoad(options);
   
  }
  onMyShow() {
    var that = this;
    this.Base.setMyData({
      num: 1,
      price: 21,

    })
  }
  jia(){
console.log(123);

  }
  jian() {
    console.log(456);

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.jia=content.jia;
body.jian=content.jian;
Page(body)