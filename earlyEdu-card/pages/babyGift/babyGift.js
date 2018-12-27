// pages/babyGift/babyGift.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false, //手机号绑定弹框
    arrowUrl: "https://img.sahuanka.com/earlyEdu-card/images/downArrow.png",
    goods: [], //商品列表
    curPage: 1, //当前页
    pageSize: 10, //条数
    choose: [], //选择
    chooseId: 0, //选择id
    chooseClassId: null,
    classShow: true, //分类选框是否显示
    sortShow: true, //排序选框是否显示
    sortId: 0, //排序id
    sort: [{
      sortName: "综合排序",
      index: 0
    }, {
      sortName: "价格从低到高",
      index: 1
    }, {
      sortName: "价格从高到低",
      index: 2
    }, {
      sortName: "最新发布",
      index: 3
    }, {
      sortName: "距离最近",
      index: 4
    }],
    searchInput: "", //输入搜索
    invitePeopleNumber: "" //邀请人电话
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      var scene = decodeURIComponent(options.scene);
      getApp().globalData.invitePeopleNumber = scene;
      console.log("222222" + getApp().globalData.invitePeopleNumber);
    }
    // wx.createAudioContext(audioid, this)
    this.innitChoose(); //初始化数据
    this.innitBabygift(0, 0); //初始化数据
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


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '送给宝宝的第一份成长大礼包~',
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },
  receive() {
    wx.showModal({
      content: '抱歉，您还不是会员，无法领取哦',
      showCancel: false,
      confirmText: "去升级",
      confirmColor: "#D0021B",
      success() {}
    })
  },
  //初始化选择状态框
  innitChoose() {
    var that = this
    wx.request({
      url: getApp().apiUrl + '/api/product/menu/list',
      method: 'get',
      header: {
        // 'Authorization': tokenVal,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        var choose = [{
          productMenuId: 0,
          name: "全部"
        }];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            choose.push(res.data.list[i]);
          }
        }
        that.setData({
          curPage: 1,
          choose: choose,
          chooseId: 0,
        });
        // that.innitBabygift(that.data.chooseId, that.data.sortId)
      }

    })
    // wx.getStorage({
    //   key: 'loginStutes',
    //   success: function (res) {
    //     console.log(res);
    //     var userInfo = JSON.parse(res.data);
    //     var tokenVal = userInfo.app_token;
    //     console.log(tokenVal);
    //     wx.request({
    //       url: getApp().apiUrl + '/api/product/menu/list',
    //       method: 'get',
    //       header: {
    //         'Authorization': tokenVal,
    //         'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       success: function (res) {
    //         console.log(res);
    //         var choose = [{
    //           productMenuId: 0,
    //           name: "全部"
    //         }];
    //         if (res.data.code == 0) {
    //           for (var i = 0; i < res.data.list.length; i++) {
    //             choose.push(res.data.list[i]);
    //           }
    //         }
    //         that.setData({
    //           curPage: 1,
    //           choose: choose,
    //           chooseId: 0,
    //         });
    //         // that.innitBabygift(that.data.chooseId, that.data.sortId)
    //       }

    //     })
    //   },
    //   fail: function (res) {
    //     that.setData({
    //       'showPhoneModal': true
    //     });
    //   }
    // })
  },
  //初始化数据
  innitBabygift(chooseId, sort) {
    var that = this;
    if (chooseId == 0) {
      mdata = {
        'page': that.data.curPage,
        'limit': that.data.pageSize,
        sort: that.data.sortId,
        activitytype: 4
      }
    } else {
      var mdata = {
        'productmenuid': chooseId,
        'page': that.data.curPage,
        'limit': that.data.pageSize,
        sort: that.data.sortId,
        activitytype: 4
      };
    }
    wx.showLoading({
      "mask": true
    })
    wx.request({
      url: getApp().apiUrl + '/api/activity/list',
      method: 'post',
      data: mdata,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Authorization': tokenVal
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        // console.log(res.data.page.pageSize);
        var page = res.data.page
        wx.hideLoading();
        if (res.data.code !== 0) {
          wx.showToast({
            title: '加载失败...',
            icon: "none"
          })
        }
        if (res.data.code == 0 && that.data.curPage <= page.totalPage) {
          let goods = [];
          goods = that.data.goods
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
    //     // console.log(res);
    //     var userInfo = JSON.parse(res.data);
    //     var tokenVal = userInfo.app_token;

    //     if (chooseId == 0) {
    //       mdata = {
    //         'page': that.data.curPage,
    //         'limit': that.data.pageSize,
    //         sort: that.data.sortId,
    //         activitytype: 4
    //       }
    //     } else {
    //       var mdata = {
    //         'productmenuid': chooseId,
    //         'page': that.data.curPage,
    //         'limit': that.data.pageSize,
    //          sort: that.data.sortId,
    //          activitytype: 4
    //       };
    //     }
    //     wx.showLoading({
    //       "mask": true
    //     })
    //     wx.request({
    //       url: getApp().apiUrl + '/api/activity/list',
    //       method: 'post',
    //       data: mdata,
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         'Authorization': tokenVal
    //       },
    //       success: function (res) {
    //         // console.log(res);
    //         wx.hideLoading();
    //         // console.log(res.data.page.pageSize);
    //         var page = res.data.page
    //         wx.hideLoading();
    //         if (res.data.code !== 0) {
    //           wx.showToast({
    //             title: '加载失败...',
    //             icon: "none"
    //           })
    //         }
    //         if (res.data.code == 0 && that.data.curPage <= page.totalPage) {
    //           let goods = [];
    //           goods = that.data.goods
    //           for (var i = 0; i < res.data.page.list.length; i++) {
    //             goods.push(res.data.page.list[i]);
    //           }
    //           that.setData({
    //             goods: goods,
    //           });
    //         }
    //       }

    //     })
    //   },
    //   fail: function (res) {
    //     that.setData({
    //       'showPhoneModal': true
    //     });
    //   }
    // })
  },
  //上拉刷新，下拉加载
  onPullDownRefresh: function () {
    this.setData({
      goods: [], //清空数据
      curPage: 1
    });
    this.innitBabygift(this.data.chooseId, this.data.sortId)
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
    console.log(this.data.curPage)
    this.innitBabygift(this.data.chooseId, this.data.sortId)
  },
  //分类选框是否显示，点击调用数据
  searchClass(e) {
    let chooseClassId = e.currentTarget.id
    if (e.currentTarget.dataset.c == true) {
      chooseClassId = this.data.chooseClassId
    }
    console.log(chooseClassId)
    console.log(e.currentTarget.id)
    this.setData({
      classShow: !this.data.classShow,
      sortShow: true,
      // chooseId: e.currentTarget.id,
      chooseClassId: chooseClassId,
      goods: [],
      curPage: 1
      // sortId: e.currentTarget.dataset.index
    })
    this.innitBabygift(e.currentTarget.id, 0);
  },
  //排序选框是否显示，点击调用数据
  searchSort(e) {
    this.setData({
      sortShow: !this.data.sortShow,
      classShow: true,
      goods: [],
      chooseId: e.currentTarget.id,
      sortId: e.currentTarget.dataset.index
    })
    this.innitBabygift(this.data.chooseId, this.data.sortId);
  },
  //导航选择
  chooseBind(e) {
    console.log(e);
    this.setData({
      goods: [],
      chooseId: e.currentTarget.id,
      chooseClassId: null,
      curPage: 1
    });
    this.innitBabygift(this.data.chooseId, this.data.sortId);
  },
  //跳转到详情
  goGooddstail(e) {
    var businessactivityid = e.currentTarget.dataset.businessactivityid;
    var businessid = e.currentTarget.dataset.businessid
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + businessactivityid + '&businessid=' + businessid,
    })
  },
  //领取礼品
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone; //true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.innitChoose();
      this.innitBabygift(that.data.chooseId, that.data.sortId)
    }
  },
  //回到首页
  returnIndex() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  //初始化
})