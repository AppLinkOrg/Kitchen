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
    var api=new InstApi();
    api.getuplist({},(uplist)=>{
       
       for( var i in uplist)
       {

         uplist[i].amount = parseInt(uplist[i].amount);
       }
      this.Base.setMyData({

      uplist:uplist
      })
    })
    this.Base.setMyData({
      checked:2
    
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