// pages/shop/shop.js
var WxParse = require('../../wxParse/wxParse.js'); //加模板
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessInfo: {}, //商家信息
    // activityInfo: {}, //商家活动
    businessid: 0, //商品id
    token: "", //用户token
    // businessactivityid: 0, //商品活动id
    addrShow: true, //是否显示地址模块
    addressList: [], //地址列表
    commentShow: true, //是否显示用户评价模块
    saving: 0, //判断是否收藏
    goods: [],
    curPage: 1, //当前页
    pageSize: 10,
    starImg: [], //用户评价星星平均数
    inviteUserPhone: '', //邀请人电话
    shop: [] //商家信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //主页面传过来的值赋值
    that.setData({
      businessid: options.businessid,
      // businessactivityid: options.businessactivityid,
    })

    that.innitGoodsdetail(options.businessid) //初始化数据
    that.innitAddress(); //初始化地址
    // that.innitComment(); //初始化评论
    that.innitGoods(); //初始化商品信息
    that.innitShop()
    // //加载用户token
    // wx.getStorage({
    //   key: 'loginStutes',
    //   success: function (res) {
    //     console.log(res);
    //     var userInfo = JSON.parse(res.data);
    //     var tokenVal = userInfo.app_token;
    //     console.log(tokenVal)
    //     that.innitGoodsdetail(options.businessactivityid, tokenVal) //初始化数据
    //     that.innitAddress(); //初始化地址
    //     that.innitComment(tokenVal); //初始化评论
    //     that.innitGoods() //初始化商品信息
    //   },
    //   fail: function (res) {
    //     that.setData({
    //       'showPhoneModal': true
    //     });
    //   }
    // })
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
  //初始化页面详情数据
  innitGoodsdetail(detailId, token) {
    var that = this;
    wx.request({
      // + detailId
      url: getApp().apiUrl + '/api/business/info/' + detailId,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Authorization': token
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var hostInfo = res.data.info; //商家信息
          that.setData({
            'businessInfo': hostInfo,
          });

        } else {

        }

      },

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
  // innitComment(token) {
  //   var that = this
  //   //用户评价数量
  //   wx.request({
  //     url: getApp().apiUrl + '/api/comment/total/' + that.data.businessactivityid,
  //     data: ({
  //       businessActivityId: that.data.businessactivityid
  //     }),
  //     method: 'get',
  //     header: {
  //       // 'Authorization': token,
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success(res) {
  //       console.log(res.data.info.count)
  //       if (res.data.code == 0 && res.data.info.count != 0) {
  //         var avg = Math.round(res.data.info.score / res.data.info.count)
  //         console.log(avg);
  //         var starArr = [];
  //         for (var i = 0; i < avg; i++) {
  //           starArr.push("http://img.sahuanka.com/sjCard/images/star.png")
  //         };
  //         that.setData({
  //           starImg: starArr

  //         })
  //       }
  //     }

  //   })
  // },
  //跳转到评论总条数页面
  // commentAll() {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '/pages/commentAll/commentAll?businessActivityId=' + that.data.businessactivityid,
  //   })
  // },
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
  innitGoods() {
    var that = this;
    wx.request({
      // + detailId
      url: getApp().apiUrl + '/api/activity/list',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Authorization': tokenVal
      },
      data: {
        businessid: that.data.businessid,
        activitytype: [3, 4],
        page: that.data.curPage,
        limit: that.data.pageSize
      },
      success: function (res) {
        console.log(res);
        // console.log(res.data.page.pageSize);
        var page = res.data.page
        if (res.data.code !== 0) {
          wx.showToast({
            title: '加载失败...',
            icon: "none"
          })
        }
        if (res.data.code == 0 && page.list.length <= page.totalCount) {
          let goods = [];
          goods = that.data.goods;
          for (var i = 0; i < res.data.page.list.length; i++) {
            goods.push(res.data.page.list[i]);
          }
          that.setData({
            goods: goods,
          });
        }
      }
    })
    // wx.getStorage({
    //   key: 'loginStutes',
    //   success: function (res) {
    //     console.log(res);
    //     var userInfo = JSON.parse(res.data);
    //     var tokenVal = userInfo.app_token;
    //     wx.request({
    //       // + detailId
    //       url: getApp().apiUrl + '/api/activity/list',
    //       method: 'post',
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         'Authorization': tokenVal
    //       },
    //       data: {
    //         businessid: that.data.businessid,
    //         activitytype: [3, 4],
    //         page: that.data.curPage,
    //         limit: that.data.pageSize
    //       },
    //       success: function (res) {
    //         console.log(res);
    //         // console.log(res.data.page.pageSize);
    //         var page = res.data.page
    //         if (res.data.code !== 0) {
    //           wx.showToast({
    //             title: '加载失败...',
    //             icon: "none"
    //           })
    //         }
    //         if (res.data.code == 0 && page.list.length <= page.totalCount) {
    //           let goods = [];
    //           goods = that.data.goods;
    //           for (var i = 0; i < res.data.page.list.length; i++) {
    //             goods.push(res.data.page.list[i]);
    //           }
    //           that.setData({
    //             goods: goods,
    //           });
    //         }
    //       }
    //     })
    //   }
    // })
  },
  //获取商家列表
  innitShop() {
    var that = this;

    wx.request({
      // + detailId
      url: getApp().apiUrl + '/api/business/list',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Authorization': tokenVal
      },
      data: {
        page: 1,
        limit: 1000
      },
      success: function (res) {
        console.log(res);
        // console.log(res.data.page.pageSize);
        var page = res.data.page
        if (res.data.code !== 0) {
          wx.showToast({
            title: '加载失败...',
            icon: "none"
          })
        }
        if (res.data.code == 0 && page.list.length <= page.totalCount) {
          let shop = [];
          shop = that.data.shop;
          for (var i = 0; i < res.data.page.list.length; i++) {
            shop.push(res.data.page.list[i]);
          }
          that.setData({
            shop: shop,
          });
        }
      }
    })
    // wx.getStorage({
    //   key: 'loginStutes',
    //   success: function (res) {
    //     console.log(res);
    //     var userInfo = JSON.parse(res.data);
    //     var tokenVal = userInfo.app_token;
    //     wx.request({
    //       // + detailId
    //       url: getApp().apiUrl + '/api/business/list',
    //       method: 'post',
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         'Authorization': tokenVal
    //       },
    //       data: {
    //         page: 1,
    //         limit: 1000
    //       },
    //       success: function (res) {
    //         console.log(res);
    //         // console.log(res.data.page.pageSize);
    //         var page = res.data.page
    //         if (res.data.code !== 0) {
    //           wx.showToast({
    //             title: '加载失败...',
    //             icon: "none"
    //           })
    //         }
    //         if (res.data.code == 0 && page.list.length <= page.totalCount) {
    //           let shop = [];
    //           shop = that.data.shop;
    //           for (var i = 0; i < res.data.page.list.length; i++) {
    //             shop.push(res.data.page.list[i]);
    //           }
    //           that.setData({
    //             shop: shop,
    //           });
    //         }
    //       }
    //     })
    //   }
    // })
  },
  //上拉刷新，下拉加载
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1
    });
    this.innitGoods();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
    console.log(this.data.curPage)
    this.innitGoods()
  },
  onShareAppMessage: function (res) {
    var that = this
    var businessactivityid = that.data.businessactivityid;
    // var inviteUserPhone = that.data.inviteUserPhone;
    var businessid = that.data.businessid
    return {
      title: '299一年，杭州娃的开销我包了',
      path: "/pages/shop/shop?businessactivityid=" + businessactivityid + "&businessid=" + businessid,
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },
  //进入详情页
  goGoodsdetail(e) {
    console.log(e);
    var businessactivityid = e.currentTarget.dataset.businessId;
    var bid = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + businessactivityid + "&businessid=" + bid + "&activitytype=" + type,
    })
  },
  //返回首页
  returnIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})