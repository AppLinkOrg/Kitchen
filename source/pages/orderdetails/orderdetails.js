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
import {
  WechatApi
} from "../../apis/wechat.api.js";
import {
  ApiUtil
} from "../../apis/apiutil.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options = {  shop_id: "4", menu_id: "2", orderids: "8" };
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);

    var zitiname = wx.getStorageSync("zitiname");
    console.log({
      zitiname
    });
    var zitimobile = wx.getStorageSync("zitimobile");
    this.Base.setMyData({
      ydd: options.ydd,
      tjdz: "-1",
      totalprice: 0,
      zhifu: true,
      expresstype: "A",
      eat: 1,
      beizhu: "",
      delivery_time: "",
      zitiname: zitiname,
      zitimobile: zitimobile
    });


  }
  onMyShow() {


    var that = this;
    var shopapi = new ShopApi();

    var tjdzzzz = [];
    shopapi.tjaddresslist({
      shop_id: this.Base.options.shop_id
    }, (tjdizhi) => {

      for (var i = 0; i < tjdizhi.length; i++) {
        if (ApiUtil.checkInOpen(tjdizhi[i].tb_sj)) {
          tjdzzzz.push(tjdizhi[i]);

        }
      }
      console.log(tjdzzzz);
      this.Base.setMyData({
        tjdizhi: tjdzzzz
      })
    })


    shopapi.shopinfo({
      id: this.Base.options.shop_id
    }, (shop) => {


      var date = new Date();
      date = new Date(date.getTime() + parseInt(shop.ziti_minute) * 1000 * 60);
      console.log("ziti_start" + date);
      var ziti_start = ApiUtil.FormatTime2(date);
      console.log("ziti_start" + ziti_start);


      var openning = shop.openning.split("-");
      if (ziti_start > openning[1]) {
        ziti_start = openning[1];
      }
      var ydd = this.Base.options.ydd;
      if (ydd != undefined && ydd != 'undefined') {
        console.log("panduan ydd");
        ziti_start = openning[0];
      }
      var cd = new Date();
      if (ydd != undefined && ydd != 'undefined') {
        cd = cd.getTime() + 24 * 3600 * 1000;
      } else {
        cd = cd.getTime();
      }
      cd = new Date(cd);
      cd = ApiUtil.FormatDate(cd);

      this.Base.setMyData({
        zitidate: cd,
        zititime: ziti_start,
        zitistarttime: ziti_start,
        zitiendtime: openning[1]
      })




      if (ydd != undefined && ydd != 'undefined') {
        console.log("ydd" + ydd);
        var ydd = new Date(ydd);

        var ziti_time = new Date((ydd).getTime() + parseInt(shop.ziti_minute) * 60 * 1000);
        var songhuo_time = new Date((ydd).getTime() + parseInt(shop.songhuo_minute) * 60 * 1000);
      } else {

        console.log("ziti_time" + ziti_time);

        var ziti_time = new Date((new Date()).getTime() + parseInt(shop.ziti_minute) * 60 * 1000);
        var songhuo_time = new Date((new Date()).getTime() + parseInt(shop.songhuo_minute) * 60 * 1000);

      }
      console.log("ziti_time" + ziti_time);
      shop.ziti = ApiUtil.FormatTime2(ziti_time);
      shop.songhuo = ApiUtil.FormatTime2(songhuo_time);

      this.Base.setMyData({
        shop
      });
      //GetDistance
    });
    this.setCurrent();

    var address_id = this.Base.getMyData().address_id;
    var memberinfo = this.Base.getMyData().memberinfo;
    if (address_id == undefined || address_id == 0) {
      this.Base.setMyData({
        address_id: memberinfo.defaultaddress
      })
      address_id = memberinfo.defaultaddress;
    }
    var shopapi = new ShopApi();
    shopapi.addressinfo({
      id: address_id
    }, (info) => {
      this.Base.setMyData({
        addressinfo: info
      });
    });


  }

  changeExpress() {
    var expresstype = this.Base.getMyData().expresstype;
    expresstype = expresstype == "A" ? "B" : "A";
    this.Base.setMyData({
      expresstype
    });
  }

  dataReturnCallback(callid, data) {
    this.Base.setMyData({
      address_id: data
    });
  }

  selecteat(e) {

    this.Base.setMyData({
      eat: e.currentTarget.id
    });
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
      shopapi.cartlist({
        orderids: this.Base.options.orderids
      }, (orderitem) => {
        this.Base.setMyData({
          orderitem
        });
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
      orderitem[i].numprice = parseFloat((orderitem[i].oneprice * parseInt(orderitem[i].num)).toFixed(2));

      totalprice += Number((orderitem[i].numprice).toFixed(2));
      totalprice = Number(totalprice.toFixed(2));
    }



    this.Base.setMyData({
      orderitem: orderitem,
      totalprice: Number(totalprice)
    });
  }
  payment(e) {
    if (this.Base.options.ydd == undefined || this.Base.options.ydd == "undefined") {
      var shop = this.Base.getMyData().shop;

      var cd = new Date();

      var openning = shop.openning.split("-");

      var ziti_start = openning[0].split(":");
      ziti_start = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate(), ziti_start[0], ziti_start[1], 0);
      ziti_start = ziti_start.getTime();


      var ziti_end = openning[1].split(":");
      ziti_end = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate(), ziti_end[0], ziti_end[1], 0);
      ziti_end = ziti_end.getTime();
      cd=cd.getTime();
      console.log(cd);
      console.log(ziti_start);
      if(cd<ziti_start){
        this.Base.info("我们还没上班呢");
       return ;
      } if (cd > ziti_end) {
        this.Base.info("我们已经下班了");
        return;
      }
    }



    var api = new WechatApi();
    var data = this.Base.options;
    var sdata = this.Base.getMyData();

    data.eat = sdata.eat;
    if (sdata.tjdz == "-1" || sdata.tjdz == null || sdata.tjdz == undefined || sdata.tjdz == "-1") {
      data.address_id = sdata.address_id;
      console.log(1);
      console.log(sdata.address_id);
    } else {
      data.myf = true;
      data.address_id = sdata.tjdz;
      sdata.address_id = sdata.tjdz;
      console.log(2);
      console.log(sdata.tjdz);
    }


    data.beizhu = sdata.beizhu;
    data.delivery_time = sdata.delivery_time;
    data.expresstype = sdata.expresstype;
    console.log(data);
    console.log(sdata);
    console.log("牛逼");
    console.log("牛逼");
    console.log(sdata.expresstype);
    console.log(sdata.address_id);
    if (sdata.expresstype == "B") {
      data.delivery_time = sdata.sondasj;
      if (sdata.address_id == "0") {
        this.Base.info("请选择送餐地址");
        return;
      } else {
        if (sdata.tjdz == "-1") {

          var meter = this.Base.util.GetDistance(sdata.shop.lat, sdata.shop.lng, sdata.addressinfo.lat, sdata.addressinfo.lng);
          console.log(meter);
          if (meter > parseInt(sdata.shop.deliverymeter)) {
            this.Base.info("送餐地址超出了范围");
            return;
          }
        }
      }
    } else {
      if (sdata.zitiname == "") {
        this.Base.info("请输入自提姓名");
        return;
      }
      if (sdata.zitimobile == "") {
        this.Base.info("请输入自提电话");
        return;
      }
      console.log(!(/^1[34578]\d{9}$/.test(sdata.zitimobile)));

      if (!(/^1[34578]\d{9}$/.test(sdata.zitimobile))) {
        console.log(1);
        wx.showToast({
          title: '手机号格式错误',
          icon: 'none',
          duration: 2000
        })

        return

      } else {


      }

      data.delivery_time = sdata.zitisj;
    }

    data.zitidate = sdata.zitidate;
    data.zititime = sdata.zititime;
    data.zitiname = sdata.zitiname;
    data.zitimobile = sdata.zitimobile;

    data.delivery_time = sdata.zitidate + " " + data.zititime;

    //console.log(data);
    //return;
    this.Base.setMyData({
      zhifu: false
    });
    api.prepay(data, (ret) => {
      console.log(ret);
      ret.complete = function(e) {
        wx.switchTab({
          url: '/pages/orderlist/orderlist',
        })
      }
      wx.requestPayment(ret);
    });


  }
  bindremark(e) {

    this.Base.setMyData({
      beizhu: e.detail.value
    })
  }
  bindZitiTimeChange(e) {
    console.log(e);
    var zititime = e.detail.value;
    this.Base.setMyData({
      zititime
    });
  }
  bindZitName(e) {
    var zitiname = e.detail.value;
    wx.setStorage({
      key: 'zitiname',
      data: zitiname,
    })
    this.Base.setMyData({
      zitiname: zitiname
    })
  }
  bindZitMobile(e) {
    var zitimobile = e.detail.value;
    wx.setStorage({
      key: 'zitimobile',
      data: zitimobile,
    })
    this.Base.setMyData({
      zitimobile: zitimobile
    })
  }
  tjdz(e) {
    this.Base.setMyData({
      tjdz: e.currentTarget.id
    });

  }

  bindZitiDateChange(e) {

    var zitidate = e.detail.value;
    wx.setStorage({
      key: 'zitidate',
      data: zitidate,
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.calc = content.calc;
body.setCurrent = content.setCurrent;
body.payment = content.payment;
body.changeExpress = content.changeExpress;
body.selecteat = content.selecteat;
body.bindremark = content.bindremark;
body.bindZitiTimeChange = content.bindZitiTimeChange;
body.bindZitName = content.bindZitName;
body.bindZitMobile = content.bindZitMobile;
body.bindZitiDateChange = content.bindZitiDateChange;
body.tjdz = content.tjdz;
Page(body)