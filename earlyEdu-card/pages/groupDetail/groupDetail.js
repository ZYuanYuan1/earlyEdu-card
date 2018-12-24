// pages/groupDetail/groupDetail.js
var WxParse = require('../../wxParse/wxParse.js'); //加模板
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityInfo: {}, //商家活动
    actype: 4, //商品类型，区分礼品和普通商品价格，默认礼品
    businessid: 0, //商品id
    assembleActivityId:0,//拼团id
    token: "", //用户token
    addrShow: true, //是否显示地址模块
    addressList: [], //地址列表
    activitytype: 0, //区分商品类型
    inviteUserPhone: '', //邀请人电话
    userInfo: {}, //用户信息
    number:0,//拼团人数
    dayDiff:0,//相差多少天
    hours:0//相差多少小时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    //主页面传过来的值赋值
    that.setData({
      assembleActivityId: options.assembleActivityId,
      businessid: options.businessId,
    })
    console.log(that.data.businessid)
    //加载用户token
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        console.log(tokenVal)
        that.innitGoodsdetail(options.assembleActivityId, tokenVal) //初始化数据
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
    that.innitCount(options.assembleActivityId)//初始化拼团人数
    that.innitAddress(); //初始化地址
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
    this.innitCount(this.data.assembleActivityId);
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
  //拉起电话
  handlePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  /**
   * 用户点击右上角分享
   */
  //初始化用户信息
  initUserinfo: function () {
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
  //初始化页面详情数据
  innitGoodsdetail(detailId, token) {
    var that = this;
    wx.request({
      // + detailId
      url: getApp().apiUrl + '/api/assembleActivity/info/' + detailId,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      data:{
        assembleActivityId: that.data.assembleActivityId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var activityInfo = res.data.info; //商家活动
       //天数换算  
          var t3 = activityInfo.shelfTime;
          that.timeFun(t3)
          if (activityInfo.shelfTime!= null) {
            activityInfo.shelfTime = activityInfo.shelfTime.substring(0, 10)
          }
          that.setData({
            'activityInfo': activityInfo
          });
          //富文本
          var article = activityInfo.content;
          WxParse.wxParse('article', 'html', article, that, 15);

        } else {
          wx.showToast({
            title: '数据加载失败',
            icon: "none"
          })
        }

      },

    })
  },
  innitCount(detailId){
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res1) {
        var userInfo = JSON.parse(res1.data);
        var tokenVal = userInfo.app_token;
        console.log(userInfo)
    wx.request({
      // + detailId
      url: getApp().apiUrl + '/api/assembleActivity/orderCount/' + detailId,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': tokenVal
      },
      data: {
        assembleActivityId: that.data.assembleActivityId
      },
      success: function (res) {
        console.log(res)
        var activityInfo=that.data.activityInfo;
        var number = (res.data.count/activityInfo.maxNumber * 100).toFixed(1);
         if(res.data.code==0){
           that.setData({
             number: number
           })
         }
      }
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
  //初始化店铺地址
  innitAddress() {
    var that = this;
    // + that.data.businessid
    wx.request({
      url: getApp().apiUrl + '/api/business/address/list/' + that.data.businessid,
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
  },

  //跳转到地址总条数页面
  adressAll() {
    var that = this;
    wx.navigateTo({
      url: '/pages/shopAddress/shopAddress?businessid=' + that.data.businessid,
    })
  },
  //确认支付
  //跳转至确认订单页面
  sureOrders: function () {
    console.log();
    //创建支付订单
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        console.log("111111111" + userInfo.grade)
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: {
            'ordertype': 12,
            'businessactivityid': that.data.assembleActivityId
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res.data.order);
            if (res.data.code == 0) {
              var orderInfo = res.data.order;
              if (orderInfo.orderpic) {
                orderInfo.orderpic = encodeURIComponent(orderInfo.orderpic);
              }
              if (orderInfo.qrcode) {
                orderInfo.qrcode = encodeURIComponent(orderInfo.qrcode);
              }
              orderInfo = JSON.stringify(res.data.order);
              var activityInfo = that.data.activityInfo
              //商品是会员的情况下
              if (activityInfo.isMember){
                if (userInfo.grade > 0) {
                  wx.navigateTo({
                    url: '/pages/payment/payment?orderInfo=' + orderInfo
                  })
                } 
              }else{
                wx.navigateTo({
                  url: '/pages/payment/payment?orderInfo=' + orderInfo
                })
              }
               //领取成功跳转到-确认订单页面

            } else {
              if(res.data.msg=="你还不是会员"){
                wx.showModal({
                  content: '抱歉，您还不是会员，无法领取哦',
                  showCancel: false,
                  confirmText: "去升级",
                  confirmColor: "#D0021B",
                  success() {
                    wx.navigateTo({
                      url: '/pages/member/member',
                    })
                  }
                })
              }else{
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            }
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

  },
  //邀请
  onShareAppMessage: function (res) {
    var that = this
    var businessactivityid = that.data.businessactivityid;
    var inviteUserPhone = that.data.inviteUserPhone;
    var businessid = that.data.businessid;
    var activitytype = that.data.activitytype
    return {
      title: '送给宝宝的第一份成长大礼包~',
      path: "/pages/goodsDetail/goodsDetail?businessactivityid=" + businessactivityid + "&businessid=" + businessid + "&activitytype" + activitytype,
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },
  //回到首页
  returnIndex() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  //天数换算函数
  timeFun(d1){
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var that=this;
    var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateEnd = new Date();//获取当前时间
    var dateDiff = dateBegin.getTime() - dateEnd.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
    console.log(" 相差 " + dayDiff + "天 " + hours + "小时 ")
    if (dateDiff<0){
      that.setData({
        dayDiff: 0,
        hours: 0
      })
    }else{
    that.setData({
      dayDiff:dayDiff,
      hours: hours
    })
    }
  }
})