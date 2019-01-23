// pages/shopAddress/shopAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.businessactivityid) {
      that.data.type = 1
    }
    this.innitAddress(options.businessid || options.businessactivityid)
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
  //拉起电话
  handlePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
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
  innitAddress(id) {
    var that = this;
    let url = getApp().apiUrl + '/api/business/address/list/' + id
    if(that.data.type == 1) {
      url = getApp().apiUrl + '/api/activity/address/' + id
    }
    wx.request({
      url,
      success(res) {
        console.log(res.data.list.length);
        if (res.data.code == 0 && res.data.list.length != 0) {
          that.setData({
            addressList: res.data.list,
            addressLength: res.data.list.length,
            addrShow: false
          })
        } else {
          that.setData({
            addressLength: 0
          })
        }
      }
    })
  }
})