// pages/extra/extra.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:0,//下线人数
    allCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.innitUserInfo();
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
  // 分享
  onShareAppMessage() {
    return {
      title: '送给宝宝的第一份成长大礼包~',
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },
  innitUserInfo() {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res.data.user.userid)
            if (res.data.code == 0) {
              wx.request({
                url: getApp().apiUrl + '/api/reward/info/' + res.data.user.userid,
                method: 'get',
                data: { userId: res.data.user.userid },
                header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
                success: function (res) {
                  console.log(res)
                  if (res.data.code == 0) {
                    that.setData({
                      count: res.data.count,
                      allCount: res.data.count*30
                    })
                  }
                }
              })
            }
          }
        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //领取奖金
  getExtra(){
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res.data.user.userid)
            if (res.data.code == 0) {
              wx.request({
                url: getApp().apiUrl + '/api/reward/receive/' + res.data.user.userid,
                method: 'get',
                data: {userId: res.data.user.userid},
                header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
                success: function (res) {
                  console.log(res)
                  if (res.data.code == 0) {
                     wx.navigateBack({
                     })
                  }else{
                    wx.showToast({
                      title: res.data.msg,
                      icon:"none"
                    })
                  }
                }
              })
            }
          }
        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  }
})