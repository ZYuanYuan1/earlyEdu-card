// pages/openCard/openCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    lock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //用户注册
    if (getApp().globalData.userInfo != null) {
      wx.getStorage({
        key: 'loginStutes',
        success: function (res) {
          console.log(res);
          var userInfo = JSON.parse(res.data);
          var tel = userInfo.mobile
          getApp().globalData.invitePeopleNumber = tel
        }
      })
    }
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
  // onShareAppMessage: function () {

  // },
  agreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  //支付
  pay() {
    var that = this;
    if (that.data.lock === true) {
      return
    }
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        if (getApp().globalData.userInfo != null){
        var userInfo = JSON.parse(res.data);
        that.setData({
          lock: true
        })
        //console.log(userInfo);
        var tokenVal = userInfo.app_token
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: {
            'ordertype': 2,
            'businessactivityid': 2
          },
          header: {
            'content-type': "application/x-www-form-urlencoded",
            'Authorization': tokenVal
          },
          success: function (res) {
            if (res.data.code == 0) {
              // var activityInfo = that.data.activityInfo;
              var orderId = res.data.order.orderid
              that.setData({
                orderId: orderId
              })
              console.log(that.data.orderId)
              //待完成-需拼接一个-创建订单成功后的对象
              // wx.navigateTo({
              //   url: '/pages/myorder/myorder?creditOrderInfo=' + orderInfo
              // })//领取成功跳转到-确认订单页面
              wx.request({
                url: getApp().apiUrl + '/api/order/creatPayOrder',
                method: 'post',
                data: {
                  'orderid': that.data.orderId
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization': tokenVal
                },
                success: function (res) {
                  console.log(res);
                  if (res.data.code == 0) {
                    //待完成-res参数
                    wx.requestPayment({
                      timeStamp: res.data.data.timeStamp,
                      nonceStr: res.data.data.nonceStr,
                      package: res.data.data.package,
                      signType: res.data.data.signType,
                      paySign: res.data.data.paySign,
                      success: function (res) {
                        that.setData({
                          lock: false
                        })
                        wx.showModal({
                          content: '恭喜您，已经成为早教卡会员！',
                          showCancel: false,
                          confirmText: "ok",
                          confirmColor: "#D0021B",
                          success(){}
                        })
                      },
                      fail: function (res) {
                        that.setData({
                          lock: false
                        })
                        wx.showModal({
                          content: '很抱歉，开通会员失败，再试一次~',
                          showCancel: false,
                          confirmText: "ok",
                          confirmColor: "#D0021B",
                          success(){}
                        });
                      },
                    })
                  };
                },
                fail: function (res) {
                  that.setData({
                    lock: false
                  })            
                }
              })
            } else {
              that.setData({
                lock: false
              })
             wx.showModal({
                content: res.data.msg,
                showCancel: false,
                confirmText: "ok",
                confirmColor: "#D0021B",
                success() {}
              })
            };
          },
          fail: function (res) {
            that.setData({
              lock: false
            })            
          }
        })
      
      
      }else{
          that.setData({
            'showPhoneModal': true
          }); 
      }
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  // 分享
  onShareAppMessage() {
    return {
      title: '送给宝宝的第一份成长大礼包~',
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },
})