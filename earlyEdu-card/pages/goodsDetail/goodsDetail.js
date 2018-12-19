// pages/goodsDetail/goodsDetail.js
var WxParse = require('../../wxParse/wxParse.js'); //加模板
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessInfo: {}, //商家信息
    activityInfo: {}, //商家活动
    // actype: 4, //商品类型，区分礼品和普通商品价格，默认礼品
    businessid: 0, //商品id
    token: "", //用户token
    businessactivityid: 0, //商品活动id
    goodsNumber: 0, //销售多少件
    addrShow: true, //是否显示地址模块
    addressList: [], //地址列表
    commentShow: true, //是否显示用户评价模块
    saving: 0, //判断是否收藏
    activitytype: 0, //区分商品类型
    inviteUserPhone: '', //邀请人电话
    userInfo: {} //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    //主页面传过来的值赋值
    that.setData({
      activitytype: options.activitytype,
      businessid: options.businessid,
      businessactivityid: options.businessactivityid
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
        that.innitGoodsdetail(options.businessactivityid, tokenVal) //初始化数据
        that.innitCount(tokenVal) //加载销售件数
        that.innitAddress(); //初始化地址
        that.innitComment(tokenVal); //初始化评论
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
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
  onShow: function () {},

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
  //初始化页面
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
      url: getApp().apiUrl + '/api/businessactivity/info/' + detailId,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var hostInfo = res.data.business; //商家信息
          var activityInfo = res.data.businessactivity; //商家活动
          console.log(activityInfo);
          that.setData({
            'businessInfo': hostInfo,
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
  //初始化销售件数
  innitCount(token) {
    var that = this;
    wx.request({
      url: getApp().apiUrl + '/api/order/number/' + that.data.businessactivityid,
      method: "get",
      data: {
        businessactivityid: that.data.businessactivityid
      },
      header: {
        'Authorization': token
      },
      success(res) {
        that.setData({
          goodsNumber: res.data.number
        })
      }
    })
  },
  //初始化店铺地址
  innitAddress() {
    var that = this;
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
  //初始化用户评价
  innitComment(token) {
    var that = this
    //用户评价数量
    wx.request({

      url: getApp().apiUrl + '/api/comment/total/' + that.data.businessactivityid,
      data: ({
        businessActivityId: that.data.businessactivityid
      }),

      method: 'get',
      header: {
        'Authorization': token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {

        console.log(res.data.info.count)
        if (res.data.code == 0 && res.data.info.count != 0) {

          that.setData({

            count: res.data.info.count,
            commentShow: false

          })
        }
      }

    })
    //用户评价信息
    wx.request({
      url: getApp().apiUrl + '/api/comment/latest/' + that.data.businessactivityid,
      data: ({
        businessActivityId: that.data.businessactivityid
      }),
      header: {
        'Authorization': token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'get',
      success(res) {
        if (res.data.code == 0 && res.data.info != null) {

          var createdate = res.data.info.createTime;
          var createMonth = createdate.substring(5, 7);
          var createDay = createdate.substring(8, 10);

          var starArr = [];
          for (var i = 0; i < res.data.info.score; i++) {
            starArr.push("http://img.sahuanka.com/sjCard/images/star.png")
          };
          that.setData({

            info: res.data.info,

            createDate: createMonth + "月" + createDay + "日",
            starImg: starArr

          })
        } else {
          that.setData({
            count: 0,
          })
        }
      }

    })
  },
  //跳转到评论总条数页面
  commentAll() {
    var that = this;
    wx.navigateTo({
      url: '/pages/commentAll/commentAll?businessActivityId=' + that.data.businessactivityid,
    })
  },
  //跳转到地址总条数页面
  adressAll() {
    var that = this;
    wx.navigateTo({
      url: '/pages/shopAddress/shopAddress?businessid=' + that.data.businessid,
    })
  },
  //收藏
  save: function (e) {
    console.log(e);
    var that = this;
    var storeId = that.data.businessInfo.businessid;
    console.log(storeId);
    var curr_state = that.data.saving;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var datainfo = JSON.parse(res.data);
        var tokenval = datainfo.app_token;
        console.log(tokenval);
        if (curr_state == 1) {
          wx.request({
            url: getApp().apiUrl + '/api/attention/delete',
            method: 'POST',
            data: {
              'businessid': storeId
            },
            header: {
              'content-type': 'text/html;charset=UTF-8',
              'Authorization': tokenval
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                that.setData({
                  saving: 0
                });
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }

          })
        } else {
          wx.request({
            url: getApp().apiUrl + '/api/attention/save',
            method: 'POST',
            data: {
              'businessid': storeId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': tokenval
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                that.setData({
                  saving: 1
                });
                wx.showToast({
                  title: '收藏成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }

          });
        }
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    });
  },
  goShop() {
    console.log(this.data.businessid)
    wx.navigateTo({
      url: '/pages/shop/shop?businessactivityid=' + this.data.businessactivityid + "&businessid=" + this.data.businessid,
    })
  },
  //确认支付
  //跳转至确认订单页面

  sureOrders: function () {
    console.log();
    //创建支付订单
    var that = this;
    var businessactivityid = that.data.businessactivityid;
    var activitytype = that.data.activitytype;
    var ordertype
    if (activitytype == 3) {
      ordertype = 6
    } else {
      ordertype = 11;
    }
    console.log(ordertype);
    wx.getStorage({

      key: 'loginStutes',

      success: function (res) {

        //console.log(res);

        var userInfo = JSON.parse(res.data);

        //console.log(userInfo);

        var tokenVal = userInfo.app_token;
        wx.request({

          url: getApp().apiUrl + '/api/order/creatOrder',

          method: 'post',

          data: {
            'ordertype': ordertype,
            'businessactivityid': businessactivityid
          },

          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },

          success: function (res) {

            console.log(res);

            if (res.data.code == 0) {

              var activityInfo = that.data.activityInfo;

              var orderInfo = res.data.order;

              if (orderInfo.orderpic) {
                orderInfo.orderpic = encodeURIComponent(orderInfo.orderpic);
              }

              if (orderInfo.qrcode) {
                orderInfo.qrcode = encodeURIComponent(orderInfo.qrcode);
              }

              // console.log(orderInfo);

              orderInfo = JSON.stringify(res.data.order);
              if (activitytype == 3) {
                wx.navigateTo({
                  url: '/pages/payment/payment?orderInfo=' + orderInfo
                })
              } else {
                wx.showToast({
                  title: "领取成功",
                  icon: "none"
                })
              } //领取成功跳转到-确认订单页面

            } else {
              if (userInfo.grade < 0 || res.data.msg == "你还不是会员") {
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
              } else {
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
  }
})