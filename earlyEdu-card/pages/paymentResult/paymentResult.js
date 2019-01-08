// pages/paymentResult/paymentResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //区分支付成功或者失败
    second: 3, //倒计时
    id: 0,
    orderMessage:{}//订单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var type = options.type;
    var orderMessage = JSON.parse(options.orderMessage);
    var number = 3;
      this.setData({
        type: type,
        orderMessage: orderMessage
      })
    if (type == 1 || type == 3) { this.countdown(this);}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //进入订单详情页
  goOrderdetail(e) {
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id;
    var orderid = this.data.orderMessage.orderid;
    if (id) {
      this.setData({
        id: e.currentTarget.id
      })
      wx.redirectTo({
        url: '/pages/orderDetail/orderDetail?orderid=' + orderid
      })
    }
  },
  //倒计时
  countdown(that) {
    var second = that.data.second;
    var id = that.data.id;
    var orderid = this.data.orderMessage.orderid;
    var time = setTimeout(function() {
      that.setData({
        second: second - 1
      });
      that.countdown(that);
    }, 1000)
    if (second == 0) {
      if (id == 1) {} else {
        wx.redirectTo({
          url: '/pages/orderDetail/orderDetail?orderid=' + orderid,
        })
      }
    }
  },
    //付款
  wxpay() {
    var that=this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        var orderMessage = that.data.orderMessage;
        // that.data.remark
        wx.request({
          url: getApp().apiUrl + '/api/order/creatPayOrder',
          method: 'post',
          data: { 'orderid': orderMessage.orderid, 'isReplace': orderMessage.isReplace, 'addressId': orderMessage.addressId, 'remark': orderMessage.remark },
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
                   type:1
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
})