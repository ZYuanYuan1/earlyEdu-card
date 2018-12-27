// pages/my/my.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false, //手机号绑定弹框
    userInfo: {}, //用户信息
    memberDate: "",
    inviteUserPhone: '' //邀请人电话
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("1111" + JSON.stringify(options))
    if (options.inviteUserPhone) {
      var inviteUserPhone = options.inviteUserPhone;
      getApp().globalData.invitePeopleNumber = inviteUserPhone;
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
    this.initInfoFun()
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

  //跳转到头像信息编辑页面
  editMy() {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  },
  //跳转到会员开卡
  goMember() {
    wx.navigateTo({
      url: '/pages/member/member',
    })
  },
  //跳转到我的消息页面
  myNews() {
    wx.navigateTo({
      url: '/pages/myNews/myNews'
    })
  },
  //跳转到宝贝大礼页面
  babyGift() {
    wx.navigateTo({
      url: '/pages/babyGift/babyGift',
    })
  },
  //跳转到现今奖励
  moneyRewards() {
    wx.navigateTo({
      url: '/pages/moneyRewards/moneyRewards',
    })
  },
  //跳转到我的收藏页面
  collection() {
    wx.navigateTo({
      url: '/pages/collection/collection',
    })
  },
  //跳转到优惠券页面
  coupon() {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },
  //跳转到地址管理
  address() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  //跳转到兑换码页面

  redeemCode() {
    wx.navigateTo({
      url: '/pages/redeemCode/redeemCode',
    })
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    var bindInfo = e.detail.bindPhone; //true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.initInfoFun()
    }
  },
  //初始化页面
  initInfoFun: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res1) {
        var userInfo = JSON.parse(res1.data);
        var tokenVal = userInfo.app_token;
        console.log(userInfo)
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res2) {
            let code = res2.data.code;
            let info = res2.data.user;
            if (code === 0) {
              console.log("api get info：" + info);
              var memberDate = info.memberdate;
              if (memberDate != null && memberDate.length > 0) {
                var member = memberDate.substring(0, 10)
                that.setData({
                  memberDate: member
                })
              }
              that.setData({
                userInfo: info
              })
            } else {
              that.setData({
                'showPhoneModal': true
              });
            }
          },
        })
      },
      fail: function (res) {
        console.log("loginStutes 失败")
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  goQRcode() {
    wx.navigateTo({
      url: '/pages/myQRcode/myQRcode',
    })
  },
  //邀请
  onShareAppMessage: function (res) {
    // var that = this
    // console.log(res);
    // if (res.from === 'button') {
    // 来自页面内转发按钮
    //   console.log(res.target);
    // }
    // wx.getStorage({
    //   key: 'loginStutes',
    //   success: function(res2) {
    //     console.log(res2);
    //     var userInfo = JSON.parse(res2.data);
    //     that.setData({
    //       inviteUserPhone: userInfo.mobile
    //     });
    //   },
    // })
    // let userInfo = wx.getStorageSync('loginStutes');
    // console.log("2222" + userInfo.mobile)
    // userInfo = JSON.parse(userInfo);
    // console.log("2222" + userInfo.mobile)
    // that.setData({
    //   inviteUserPhone: userInfo.mobile
    // });
    return {
      title: '送给宝宝的第一份成长大礼包~',
      // path: "/pages/my/my?inviteUserPhone=" + userInfo.mobile,
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },

  // 核销码
  skipScancode() {
    wx.scanCode({
      success: (scanCodeRes) => {
        console.log(scanCodeRes)
        wx.getStorage({
          key: 'loginStutes',
          success: function (res) {
            console.log(res);
            var userInfo = JSON.parse(res.data);
            var tokenVal = userInfo.app_token;
            //that.setData({ 'userInfo': userInfo });
            wx.request({
              url: scanCodeRes.result,
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': tokenVal
              },
              success: function (res) {
                console.log(res);
                if (res.data.code == 0) {
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'error',
                    duration: 2000
                  })
                };

              },

            })
          },
          fail: function (res) {
            that.setData({
              'showPhoneModal': true
            });
          }
        })
      }
    })
  },
  goReturn() {
    this.setData({
      'showPhoneModal': true
    });
  },
  goQRcode() {
    wx.navigateTo({
      url: '/pages/myQRcode/myQRcode',
    })
  }
})