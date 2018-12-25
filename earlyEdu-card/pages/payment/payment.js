// pages/payment/payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],//地址初始化
    switchChecked:true,//是否使用佣金抵扣
    orderInfo: {},//订单信息
    surplus:0,//剩余支付资金
    amount:0,//不抵扣金额
    remark:"",//留言
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var orderInfo = JSON.parse(options.orderInfo);
    if (orderInfo.orderpic) { orderInfo.orderpic = decodeURIComponent(orderInfo.orderpic); }
    if (orderInfo.qrcode) { orderInfo.qrcode = decodeURIComponent(orderInfo.qrcode); }
    if (orderInfo.ordertype == 12 || orderInfo.ordertype == 11){
      //对抵扣金额进行处理
      var sur = orderInfo.amount;
      var amount = sur.toFixed(2);
      this.setData({ 
        orderInfo: orderInfo,
        amount: amount,
        });
  }else{
      //对抵扣金额进行处理
      var sur = orderInfo.amount - orderInfo.replaceAmount;
      var surplus = sur.toFixed(2);
      var amount = orderInfo.amount.toFixed(2);
      this.setData({
        orderInfo: orderInfo,
        surplus: surplus,
        amount: amount
      });
  }
      this.innitShoppingAddr()
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
    this.innitShoppingAddr()
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
//是否使用佣金抵扣
  switchChange(e){
    console.log(e)
    this.setData({
      switchChecked: e.detail.value,
    })
  },
  //付款
  wxpay(e){
    var that=this;
    var orderId = e.target.dataset.orderId;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        var isReplace = that.data.switchChecked;
        var orderInfo = that.data.orderInfo;
        var addressId = that.data.addressList.userAddrId;
        var remark = that.data.remark;
        var  orderMessage={};
        orderMessage.orderid = orderId;
        orderMessage.isReplace = isReplace;
        orderMessage.addressId = addressId;
        orderMessage.remark = remark;
        if (orderInfo.ordertype == 12 || orderInfo.ordertype == 11){//判断类型区分拼团、礼品和商品
          isReplace=""
        }
        // that.data.remark
        wx.request({
          url: getApp().apiUrl + '/api/order/creatPayOrder',
          method: 'post',
          data: { 'orderid': orderId, 'isReplace': isReplace, 'addressId': addressId, 'remark': remark},
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
                  wx.navigateTo({
                    url: '/pages/paymentResult/paymentResult?type=1' + "&orderMessage=" + JSON.stringify(orderMessage),
                  })
                },
                fail: function (res) {
                  // wx.showToast({
                  //   title: '支付失败',
                  //   icon: 'none',
                  //   duration: 2000
                  // });
                  wx.navigateTo({
                    url: '/pages/paymentResult/paymentResult?type=2' + "&orderMessage=" + JSON.stringify(orderMessage),
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
  // 初始化地址
  innitShoppingAddr() {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/userAddr/list',
          header: {
            'Authorization': tokenVal,
            'content-type': 'x-www-form-urlencoded'
          },
          method: "get",
          success(res) {
            console.log(res);
            if (res.data.code == 0 && res.data.list.length != 0) {
              that.setData({
                addressList: res.data.list[0],

              });
            } else {
              that.setData({
                addressList: null
              });
            }
          }
        })
      }
    })
  },
  //跳转到地址页面
  addAddress() {
    wx.navigateTo({
      url: "/pages/address/address"
    })
  },
  //留言
  remark: function (e) {
    console.log(e);
    var remark = e.detail.value;
    this.setData({ remark: remark });
  },
})