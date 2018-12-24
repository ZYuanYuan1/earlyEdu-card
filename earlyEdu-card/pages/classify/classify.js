//获取应用实例
var app = getApp();
Page({
  data: {
    choose: [],
    chooseId: 0, //选择id
    classShow: true, //分类选框是否显示
    shops: [], //商家数据
    showPhoneModal: false, //手机号绑定弹框
    inviteUserPhone: '', //邀请人电话
    allShop: [], //所有店铺数据
    searchInput: "", //搜索内容
  },
  onLoad: function () {
    // this.initShop(0);
    this.initShop(0)
    this.setData({
      shops: [],
      chooseId: 0,
      curPage: 1,
      classShow: false
    })
    this.innitChoose()
  },
  //导航选择
  chooseBind(e) {
    console.log(e);
    this.setData({
      goods: [],
      chooseId: e.currentTarget.id,
    });
    // this.innitBabygift(e.currentTarget.id, 0);
  },
  //初始化选择状态框
  innitChoose() {
    var that = this
    //加载用户token
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/business/menu/list',
          method: 'get',
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res);
            var choose = [];
            var choosees = [];
            if (res.data.code == 0) {
              let allSubListArr = []
              for (var i = 0; i < res.data.list.length; i++) {
                choose.push(res.data.list[i]);
                allSubListArr.push(...res.data.list[i].subList)
              }
              choose.unshift({
                businessMenuId: 0,
                name: '全部',
                subList: allSubListArr
              })
            }
            that.setData({
              choose: choose,
              chooseId: 0,
            });
            // that.innitBabygift(0, 0)
          }

        })
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  initShop(chooseId) {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/business/list',
          method: "post",
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            businessMenuId: chooseId,
            limit: 1000,
            page: 1
          },
          success: function (res) {
            console.log(res);
            if (res.data.code !== 0) {
              wx.showToast({
                title: '数据加载失败',
                icon: "none"
              })
            }
            let shops = [];
            shops = that.data.shops
            for (var i = 0; i < res.data.page.list.length; i++) {
              shops.push(res.data.page.list[i]);
            }
            that.setData({
              shops: shops,
            });
          }
        })
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  //选项卡
  tabClick: function (e) {
    console.log(e)
    this.initShop(e.currentTarget.id);
    this.setData({
      shops: [],
      chooseId: e.currentTarget.id,
      curPage: 1,
      classShow: false
    });
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone; //true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.initShop(this.data.chooseId);
      innitChoose()
    }
  },
  //邀请
  goShop(e) {
    var businessid = e.currentTarget.dataset.businessid;
    wx.navigateTo({
      url: '/pages/shop/shop?businessid=' + businessid,
    })
  },

  onShareAppMessage() {
    return {
      title: '送给宝宝的第一份成长大礼包~',
      imageUrl: 'https://img.sahuanka.com/earlyEdu-card/images/sharePar.jpg'
    }
  },

  //搜索
  // toSearch: function (e) {
  //   var searchInput = e.detail.value;
  //   this.setData({
  //     curPage: 1,
  //     searchInput: searchInput,
  //     goods: []
  //   });
  //   this.initShop(that.data.chooseId)
  // },
})