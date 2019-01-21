import {
  ABulkModel
} from '../../models/aBulk'

const aBulkModel = new ABulkModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    isLogin: false, // 判断登录
    tel: '', // 登录手机号，分销
    tokenVal: '',
    vip: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const scene = decodeURIComponent(options.scene)
    let sceneArr = scene.split('.')
    getApp().globalData.invitePeopleNumber = sceneArr[0]
    this.setData({
      id: sceneArr[1]
    })
    this.getUserInfo()
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

  // 获取登信息
  getUserInfo() {
    let that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        let userInfo = JSON.parse(res.data)
        that.setData({
          isLogin: true,
          tel: userInfo.mobile,
          tokenVal: userInfo.app_token,
          vip: userInfo.grade == 0 ? false : true
        })
      },
      fail: function (res) {

      }
    })
  },

  // 绑定手机成功
  bindPhoneSucc() {
    console.log('绑定成功')
    let that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        let userInfo = JSON.parse(res.data)
        that.setData({
          isLogin: true,
          tel: userInfo.mobile,
          tokenVal: userInfo.app_token,
          vip: userInfo.grade == 0 ? false : true
        })
        that.pay()
      },
      fail: function (res) {

      }
    })
  },

  pay() {
    let that = this
    aBulkModel.createOrder(that.data.id, that.data.tokenVal)
      .then(res => {
        if (res && res.code == 0) {
          if (res.data) {
            aBulkModel.pay(res.data, res => {
              if (res) {
                aBulkModel.createOrder(that.data.id, that.data.tokenVal)
                  .then(res => {
                    if (res && res.code == 0) {
                      that.toOrders()
                    }
                  })
              }
            })
          } else {
            that.toOrders()
          }
        }
      })
  },

  // 跳转到订单列表
  toOrders() {
    wx.showToast({
      title: '正在跳转订单列表',
      icon: 'none',
      duration: 1000
    })
    setTimeout(function () {
      wx.reLaunch({
        url: '/pages/orders/orders'
      })
    }, 1000)
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

  }
})