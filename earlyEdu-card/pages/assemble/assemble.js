// pages/assemble/assemble.js
var util = require('../../utils/util.js');
var page = 1;
var hadLastPage = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'homeList': [], //页面主列表
    'reachBottomTip': false,
    'showPhoneModal': false, //手机号绑定弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // page = 1;
    // hadLastPage = false;
    // this.loadDealListFun()
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
    page = 1;
    hadLastPage = false;
    this.setData({
      'homeList': []
    })
    this.loadDealListFun()
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
  loadDealListFun: function () {
    console.log("aaaaaaaaaaaaaaaaaaa")
    var that = this;
    if (hadLastPage != false) {
      that.setData({
        reachBottomTip: true
      });
      return;
    };
    wx.request({
      url: getApp().apiUrl + '/api/assembleActivity/list',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Authorization': tokenVal
      },
      data: {
        'limit': 10,
        'page': page
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var homeList = that.data.homeList;
          var data = res.data.page.list;
          if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              homeList.push(data[i]);
              homeList[i].percent = (homeList[i].number / homeList[i].maxNumber * 100).toFixed(1)
            }
          }
          if (res.data.page.currPage == res.data.page.totalPage) {
            hadLastPage = res.data.page.currPage;
          } else {
            page++;
          };
          that.setData({
            'homeList': homeList
          })
        }
      },

    })
    // wx.getStorage({
    //   key: 'loginStutes',
    //   success: function (res) {
    //     var userInfo = JSON.parse(res.data);
    //     var tokenVal = userInfo.app_token;
    //     wx.request({
    //       url: getApp().apiUrl + '/api/assembleActivity/list',
    //       method: 'post',
    //       header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
    //       data: { 'limit': 10, 'page': page},
    //       success: function (res) {
    //         console.log(res);
    //         if (res.data.code == 0) {
    //           var homeList = that.data.homeList;
    //           var data = res.data.page.list;
    //           if (data && data.length > 0) {
    //             for (var i = 0; i < data.length; i++) {
    //               homeList.push(data[i]);
    //               homeList[i].percent=(homeList[i].number / homeList[i].maxNumber*100).toFixed(1)
    //             }
    //           }
    //           if (res.data.page.currPage == res.data.page.totalPage) {
    //             hadLastPage = res.data.page.currPage;
    //           } else {
    //             page++;
    //           };
    //           that.setData({'homeList': homeList})
    //         }
    //       },

    //     })
    //   },
    //   fail: function () {
    //     that.setData({ 'showPhoneModal': true });
    //   }
    // })
    // setInterval(that.loadDealListFun, 1000)实时数据推送
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone; //true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      page = 1;
      hadLastPage = false;
      this.loadDealListFun();
    }
  },
  onReachBottom: function () {
    console.log(999);
    //var that = this;   
    this.loadDealListFun(); //加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({
      homeList: [],
      'reachBottomTip': false
    }); //将数据清空
    this.loadDealListFun();
    wx.stopPullDownRefresh();
  },
  goGroupdetail(e) {
    console.log(e)
    var assembleActivityId = e.currentTarget.id;
    var businessId = e.currentTarget.dataset.businessid
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail?assembleActivityId=' + assembleActivityId + "&businessId=" + businessId
    })
  }
})