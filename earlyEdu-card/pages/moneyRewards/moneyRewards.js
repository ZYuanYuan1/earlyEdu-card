// pages/moneyRewards/moneyRewards.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",//时间
    curPage: 1,//当前页
    pageSize: 10,//条数
    amount:0,//总金额
    grade: 0,//区分商家用户
    moneys:[],//用户资金流水/商家
    moneyLength:0,//数据长度
    createDate:"",//流水创建时间
    inviteUserPhone: '',//邀请人电话
    showPhoneModal: false,//手机号绑定弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.innitUserInfo()
    that.innitMoney()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    that.innitUserInfo()
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
   * 用户点击右上角分享
   */
  // 分享
  onShareAppMessage() {
    return {
      title: '送给宝宝的第一份成长大礼包~',
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },
  postal(){
    if (this.data.amount<0){
    wx.showModal({
      content: '亲爱的，抱歉，100元以下不能提现，但是可以在平台消费哦ヾ(≧∪≦*)ノ〃',
      showCancel:false,
      confirmText:"ok",
      confirmColor:"#D0021B"
    })
    }else{
    wx.navigateTo({
      url: '/pages/cash_charge/cash_charge',
    })
    }
  },
  //初始化用户信息
  innitUserInfo(){
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
            if (res.data.code == 0) {
              that.setData({
                amount: res.data.user.amount,
                grade: res.data.user.grade
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
  //初始化现金列表/api/fundsflow/list get
  innitMoney(){
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
         url: getApp().apiUrl + '/api/fundsflow/list',
         method: 'get',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var page = res.data.page
            if (res.data.code !== 0) {
              wx.showToast({
                title: '加载失败...',
                icon: "none"
              })
            }
            if (res.data.code == 0 && that.data.curPage <= page.totalPage) {
              let moneys = [];
              moneys= that.data.moneys
              for (var i = 0; i < page.list.length; i++) {
                moneys.push(page.list[i]);
              }
              for (var i = 0; i < moneys.length; i++) {
                if (moneys[i].createdate != null){
                  moneys[i].createdate = moneys[i].createdate.substring(0,10)
                }
              }
              that.setData({
                moneys: moneys,
                moneyLength: page.list.length
              });
            }
          }
        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
    },
      //上拉刷新，下拉加载
      onPullDownRefresh: function () {
        this.setData({
          curPage: 1
        });
        // this.innitBabygift(0, 0)
        wx.stopPullDownRefresh();
      },
      onReachBottom: function () {
        this.setData({
          curPage: this.data.curPage + 1
        });
        console.log(this.data.curPage)
        // this.innitBabygift(0, 0)
      },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      that.innitUserInfo()
      that.innitMoney()
    }
  },
  //邀请
  //跳转到额外奖金
  goExtra(){
    wx.navigateTo({
      url: '/pages/extra/extra',
    })
  }
})