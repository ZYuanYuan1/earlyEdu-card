// pages/searchLocation/searchLocation.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var config = require('../../utils/config.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchAddress: null,
    location: "重新定位",
    address: '',
    searchRecords: ["西湖"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: config.key
    });
    var address
    // 参数传值
    if (options.loca) {
      address = options.loca;
    }
    this.setData({ 'address': address });
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
  //获取定位地址方法
  locationViewSelected: function () {
    var that = this;
    that.setData({ 'address': '定位中...', 'location': '正在定位...' });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        //that.globalData.latitude = latitude;
        //that.globalData.longitude = longitude;
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            var address = res.result.address
            if (res.result.address_reference && res.result.address_reference.landmark_l1) {
              address = res.result.address_reference.landmark_l1.title;
            } else if (res.result.address_reference && res.result.address_reference.landmark_l2) {
              address = res.result.address_reference.landmark_l2.title;
            } else {
              // that.setData({ 'locationStr': address })
            }

            that.setData({ 'address': address, 'location': '重新定位' })
            //跳回首页
            wx.reLaunch({
              url: '/pages/index/index?location=' + address
            })
          },
          fail: function (res) {
        
          },
          complete: function (res) {
   

          }
        });

      },
      fail: function (res) {
     
        that.setData({ 'address': '定位失败', 'location': '重新定位' })
      },
      complete: function (res) {
  
      }
    })
  },
  keyboardDoneSelected: function (event) {
    var searchAddress = event.detail.value.trim();
    this.setData({
      searchAddress: searchAddress
    });
  },
  searchRecordSelected: function (event) {
    var address = event.currentTarget.dataset.address
  }
})