// pages/orderDetail/orderDetail.js
var util = require('../../utils/util.js');
var QR = require("../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetailData: null, //订单详情信息
    showModal: false, //电子券弹框
    imagePath: '',
    logisticsDetailData:{},//物流信息
    logisticsCompanyData:{},//物流商家信息
    // expressId:0 //物流id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetailInfo(options.orderid);
    this.getLogisticsDetail(options.orderid);
    // this.getLogisticsCompany()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //点击电子券-弹出电子券二维码
  showDialogBtn: function (e) {
    var orderNo = e.target.dataset.orderNumber;
    this.setData({
      orderNo: orderNo,
      showModal: true
    })
    console.log(e);
    //生成二维码
    var size = this.setCanvasSize(); //动态设置画布大小
    var qrcData = e.target.dataset.qrcodeUrl;
    if (qrcData) {
      this.createQrCode(qrcData, "mycanvas", size.w, size.h);
    }

  },
  //关闭按钮
  onCancel: function () {
    this.setData({
      showModal: false
    });
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      // var res = wx.getSystemInfoSync();
      // var scale = 375/ 343;//不同屏幕下canvas的适配比例；设计稿是750宽
      // var width = res.windowWidth / scale;
      // var height = width;//canvas画布为正方形
      size.w = 120;
      size.h = 120;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    console.log('tt')
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        console.log(rrr)
        var tempFilePath = res.tempFilePath;
        console.log("********" + tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  //支付按钮
  gotopay: function (e) {
    console.log(e);
    var fromMyOrder = e.target.dataset.orderInfo;
    if (fromMyOrder.orderpic) {
      fromMyOrder.orderpic = encodeURIComponent(fromMyOrder.orderpic);
    }
    if (fromMyOrder.qrcode) {
      fromMyOrder.qrcode = encodeURIComponent(fromMyOrder.qrcode);
    }
    console.log(fromMyOrder);
    fromMyOrder = JSON.stringify(fromMyOrder);
    var type = 1;
    wx.navigateTo({
      url: '/pages/payment/payment?orderInfo=' + fromMyOrder + "&type=1",
    })
  },

  //弹出评价弹框
  pop_evaluate: function (e) {
    console.log(e)
    var that = this;
    var businessActivityId = e.target.dataset.businessActivityId;
    var orderId = e.target.dataset.orderId;
    var ordertype = e.target.dataset.ordertype
    wx.navigateTo({
      url: '/pages/comment/comment?businessActivityId=' + JSON.stringify(businessActivityId) + '&orderId=' + JSON.stringify(orderId)
    })
  },
  //评价弹框-取消按钮
  onCancelStar: function () {
    this.setData({
      'showModalStar': false
    });
  },
  // 获取订单详情
  getOrderDetailInfo(orderid) {
    let that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        // that.setData({
        //   'userInfo': userInfo
        // });
        wx.request({
          url: getApp().apiUrl + `/api/order/info/${orderid}`,
          method: 'get',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 0) {
              that.setData({
                orderDetailData: res.data.order
              })
            }
          },

        })
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  // 获取物流详情
  getLogisticsDetail(orderid) {
   var that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        // that.setData({
        //   'userInfo': userInfo
        // });
        wx.request({
          url: getApp().apiUrl + `/api/order/address/${orderid}`,
          method: 'get',
          data: { orderId: orderid},
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res)
            var logisticsDetailData = res.data.info;
            if (res.data.code == 0) {
              that.setData({
                logisticsDetailData: logisticsDetailData,
              })
              wx.request({
                url: getApp().apiUrl + '/api/express/info/' + logisticsDetailData.expressId,
                method: 'get',
                data: { expressId: logisticsDetailData.expressId },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization': tokenVal
                },
                success: function (res) {
                  console.log(res)
                  if (res.data.code == 0) {
                    that.setData({
                      logisticsCompanyData: res.data.info
                    })
                  }
                },

              })
            }
          },

        })
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //支付
  wxpay() {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        var orderDetailData = that.data.orderDetailData;
        // that.data.remark
        wx.request({
          url: getApp().apiUrl + '/api/order/creatPayOrder',
          method: 'post',
          data: { 'orderid': orderDetailData.orderid, 'isReplace': orderDetailData.isReplace, 'addressId': orderDetailData.addressId, 'remark': orderDetailData.remark },
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              if (!res.data.data) {
                wx.switchTab({
                  url: '/pages/orders/orders',
                })
                return
              }
              //待完成-res参数
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                success: function (res) {
                  that.setData({
                    type: 1
                  })
                  that.countdown(that)
                },
                fail: function (res) {
                  // wx.showToast({
                  //   title: '支付失败',
                  //   icon: 'none',
                  //   duration: 2000
                  // });
                  that.setData({
                    type: 2
                  })
                },
              })

            };

          },

        })
      },
      // 当密码输入框输入数字6位数时的自定义函数
      valueSix() {
        console.log("1");
        // 模态交互效果
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //点击跳转到详情
  goDetail(){
    var that=this;
    var orderDetailData = that.data.orderDetailData;
    var businessId = orderDetailData.businessid;
    var ordertype = orderDetailData.ordertype;
    var activitytype;
    if (orderDetailData.ordertype==12){
      var assembleActivityId = orderDetailData.businessactivityid
      wx.navigateTo({
        url: '/pages/groupDetail/groupDetail?assembleActivityId=' + assembleActivityId + "&businessId=" + businessId,
      })
    }else{
      if (orderDetailData.ordertype==6){
         activitytype=3;
      }else{
         activitytype = 4
      }
      var businessactivityid = orderDetailData.businessactivityid;
      wx:wx.navigateTo({
        url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + businessactivityid + "&businessid=" + businessId + "&activitytype=" + activitytype
      })
    }
  }
})