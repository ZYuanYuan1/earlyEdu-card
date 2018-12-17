// pages/cash_charge/cash_charge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashVal:'',//充值金额
    showPhoneModal: false,
    trueNameVal:'',
    alipayVal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        console.log(userInfo)
        var tokenVal = userInfo.app_token
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          data: {},
          header: { 'content-type': "application/x-www-form-urlencoded", 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
               var info=res.data.user
              //  that.data.trueNameVal = info.realname;
              //  that.data.alipayVal = info.alipay
               that.setData({trueNameVal:info.realname, alipayVal:info.alipay})
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            };

          },

        })
        //that.setData({userInfo: userInfo})
        
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
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
  //实时获取充值金额
  getCashVal: function (e) {
    var currVal = e.detail.value.trim();
    this.setData({ cashVal: currVal });
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.setData({ 'showPhoneModal': false });//绑定手机号成功后影藏弹框
    }
  },
  // trueName:function(e){
  //   var touchName = e.detail.value.trim();
  //   this.setData({ trueNameVal: touchName });
  // },
  // alipay:function(e){
  //   var touchAccount = e.detail.value.trim();
  //   this.setData({ alipayVal: touchAccount });
  // },
  //去提现按钮
  gotocharge: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        console.log(userInfo);
        var tokenVal = userInfo.app_token;
        var currCash = that.data.cashVal;
        // var userName = that.data.trueNameVal;
        // var account=that.data.alipayVal;
        // if (!userName){
        //   wx.showToast({
        //     title: '姓名不能为空',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return
        // }
        // if (!account){
        //   wx.showToast({
        //     title: '支付宝账号不能为空',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return
        // }
        // if (!currCash ||currCash==0) {
        //   wx.showToast({
        //     title: '充值金额不能为空或0',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return
        // };
        var check = /^\d+(\.{0,1}\d+){0,1}$/;//验证非负数
        if (!check.test(currCash)) {
          wx.showToast({
            title: '请输入正确的金额',
            icon: 'none',
            duration: 2000
          })
          return
        }
        // var currcashmoney = userInfo.amount;//账户余额
        // console.log(currcashmoney);
        // console.log(currCash);
        // if (currCash >currcashmoney){
        //   wx.showToast({
        //     title: '您已超出提现的金额',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return
        // }
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: { 'ordertype': 8, 'amount': currCash, integral:0},
          header: { 'content-type': "application/x-www-form-urlencoded", 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var orderInfo = res.data.order;
              var orderId = orderInfo.orderid
              wx.showToast({
                title:'提现申请成功,预计一到三天到帐',
                icon: 'none',
                duration:2000,
                success:function(){
                  setTimeout(function(){
                    wx.redirectTo({
                      url: '/pages/cash_record/cash_record'
                    })
                  },2000);
                   
                }
              })
              
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            };

          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  preventTouchMove: function () {
  },
 
 
})