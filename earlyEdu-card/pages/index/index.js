// pages/index/index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var config = require('../../utils/config.js');
var app = getApp();
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//banner图
    'locationStr': '加载失败',//定位地址
    'bannerList':[],//banner
     goods:[],//商品列表
     curPage:1,//当前页
     pageSize:10,
     searchInput:"",//搜索内容
    inviteUserPhone: '',//邀请人电话
    showPhoneModal: false,//手机号绑定弹框
    nav: [
      { imgUrls: 'https://img.sahuanka.com/earlyEdu-card/images/circle.png', descs: '孕产护理', businessMenuId:35},
      { imgUrls: 'https://img.sahuanka.com/earlyEdu-card/images/group2.png', descs: '亲子购物', businessMenuId: 2},
      { imgUrls: 'https://img.sahuanka.com/earlyEdu-card/images/baby.png', descs: '婴儿服务', businessMenuId: 36 },
      { imgUrls: 'https://img.sahuanka.com/earlyEdu-card/images/group3.png', descs: '学习教育', businessMenuId: 4},
      { imgUrls: 'https://img.sahuanka.com/earlyEdu-card/images/group4.png', descs: '亲子游乐', businessMenuId: 1 },
      { imgUrls: 'https://img.sahuanka.com/earlyEdu-card/images/life.png', descs: '生活服务', businessMenuId: 48 }
    ],
    navTxt: {
      navtxtImg: "https://img.sahuanka.com/earlyEdu-card/images/right.png",
      navtxtCon: [
        "精选优质早教商家",
        "一站式早教服务",
        "全程陪伴孩子成长"
      ]
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //实例化API核心类
    qqmapsdk = new QQMapWX({
      key: config.key
    });
    if (options.location) {
      this.setData({ 'locationStr': options.location })
      this.locationFun();
    } else {
      this.locationFun();
    }
    this.loadBannerListFun()//加载banner
    this.getGoodsList();//加载商品数据
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

   onShareAppMessage(){
     return {
       title: '送给宝宝的第一份成长大礼包~',
       imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
     }
   },

  //定位地址方法
  locationFun() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            var add = res.result.address;
            if (res.result.address_reference && res.result.address_reference.landmark_l1) {
              that.setData({ 'locationStr': res.result.address_reference.landmark_l1.title })
            } else if (res.result.address_reference && res.result.address_reference.landmark_l2) {
              that.setData({ 'locationStr': res.result.address_reference.landmark_l2.title })
            } else {
              that.setData({ 'locationStr': add })
            }
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {

          }
        });

      },
      fail: function (res) {
        that.setData({ 'locationStr': '定位失败' })
      },
      complete: function (res) {
        // that.loadScoreListFun('', that.data.taskval, that.data.areaval, that.data.sortval);
      }
    })
  },
  // //定位跳转
  // searchLocation(e){
  //   var loca = e.currentTarget.dataset.locaSearch;
  //   wx.navigateTo({
  //     url: '/pages/searchLocation/searchLocation?loca=' + loca
  //   })
  // },
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
  //广告图方法
  loadBannerListFun: function () {
    var that = this;
    wx.request({
      url: app.apiUrl + '/api/banner/list',
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { 'limit': 10, 'page': that.data.curPage },
      success: function (res) {
        if (res.data.code == 0) {
          var bannerList = [];
          var data = res.data.page.list;
          if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              bannerList.push(data[i]);
            }
          }
          that.setData({ 'bannerList': bannerList });
        };

      },

    })
  },
  //点击跳转到宝贝大礼页面
  goBabygift(){
    wx.navigateTo({
      url: '/pages/babyGift/babyGift',
    })
  },
  //初始化数据
  getGoodsList: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/activity/list',
          method: "post",
          data:{
            'page': that.data.curPage, 
            'limit': that.data.pageSize,
            'activityname': that.data.searchInput,
            'activitytype': [3,4],
            'sort':0
          },
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res);
            // console.log(res.data.page.pageSize);
            var page = res.data.page
            if (res.data.code !== 0) {
                wx.showToast({
                  title: '加载失败...',
                  icon:"none"
                })
              }
            if (res.data.code == 0 && page.list.length <= page.totalCount){
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
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //上拉刷新，下拉加载
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1,
      goods: []
    });
    this.getGoodsList();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
    console.log(this.data.curPage)
    this.getGoodsList()
  },
  //搜索
  toSearch: function (e) {
    var searchInput = e.detail.value;
    this.setData({
      curPage: 1,
      searchInput: searchInput,
      goods:[]
    });
    this.getGoodsList();
  },
  //进入详情页
  goGoodsdetail(e){
    console.log(e);
    var businessactivityid = e.currentTarget.dataset.businessId;
    var bid = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + businessactivityid + "&businessid=" + bid + "&activitytype=" + type,
    })
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.loadBannerListFun()//加载banner
      this.getGoodsList();//加载商品数据
    }
  },
  //邀请
  //跳到选择页面
  goChoose(e){
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/choose/choose?businessMenuId=' + e.currentTarget.id,
    })
  },
  //跳转到拼团列表页面
  goAssemble(){
     wx.navigateTo({
       url: '/pages/assemble/assemble',
     })
  }
})