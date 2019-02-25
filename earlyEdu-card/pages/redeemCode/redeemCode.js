// pages/redeemCode/redeemCode.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteUserPhone: '',//邀请人电话
    showPhoneModal: false,//手机号绑定弹框
    buttonClicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  buttonClicked(self) {
    self.setData({
      buttonClicked: true
    })
    setTimeout(function () {
      self.setData({
        buttonClicked: false
      })
    }, 3000)
  },

  /**
   * 用户点击右上角分享
   */
 
  //兑换
  changeVip(e){
    var that = this;
    that.buttonClicked(that);
    var input=e.detail.value.input;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/vip/upgrade',
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },       
          data:{
            activationCode: input
          },
          success: function (res) {
            if(res.data.code==0){
              wx.showModal({
                title: '恭喜您，兑换成功！快去选礼包吧~',
                content: '每成功邀请一个好友购卡，您可获得奖金40元，若您邀请的好友邀请新用户成功购卡，您可再获得奖金30元哦！',
                showCancel: false,
                confirmText: "我的礼包",
                confirmColor: "#D0021B",
                success(res) {
                  wx.navigateTo({
                    url: '/pages/babyGift/babyGift',
                  })
                }
              })
            }else{
              wx.showModal({
                content: '抱歉，您输入的兑换码有误。请重新输入，或联系客服',
                showCancel: false,
                confirmText: "ok",
                confirmColor: "#D0021B",
                success() {
                }
              })
            }
          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo)
    }
  },
  change(){
    wx.showModal({
      content: '您操作的频率太快，稍后点击！',
      showCancel: false,
      confirmText: "ok",
      confirmColor: "#D0021B",
      success() {
      }
    })
  }
})