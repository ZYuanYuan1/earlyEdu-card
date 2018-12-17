// pages/myMessage/myMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      userName: options.userName
    })
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
  onShareAppMessage: function () {

  },
  //保存宝宝的昵称
  save(e){
    console.log(e.detail.value.input)
    var that = this;
    var nameVal = e.detail.value.input;
    //待完成-确认修改成功后的操作
    console.log(nameVal)
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data:{'username': nameVal},
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            wx.navigateTo({
              url: "/pages/me/me"
            })
          },
          fail: function () {
            wx.showToast({
              title: '提交失败',
            })
          }
        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  }

})