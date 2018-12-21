// pages/choose/choose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // arrowUrl: "https://img.sahuanka.com/earlyEdu-card/images/downArrow.png",
    // navTxt: {
    //   navtxtImg: "https://img.sahuanka.com/earlyEdu-card/images/right.png",
    //   navtxtCon: [
    //     "精选优质早教商家",
    //     "一站式早教服务",
    //     "全程陪伴孩子成长"
    //   ]
    // },
    // content: [
    //   { imgUrl: "/images/copy1.png", conDis: "让孩子告别驼背和内向吧", conName: "潮童星形体礼仪课程哈哈哈哈哈哈哈哈哈哈啊哈哈", price: "288" },
    //   { imgUrl: "/images/copy2.png", conDis: "全方位培养孩子的想象力和创造力", conName: "潮红黄蓝亲子园特色课", price: "398" },
    //   { imgUrl: "/images/copy3.png", conDis: "哈哈哈哈哈哈哈哈哈", conName: "莲影古筝特色课程", price: "588" },
    //   { imgUrl: "/images/copy4.png", conDis: "让孩子告别驼背和内向吧", conName: "潮童星形体礼仪课程", price: "988" }
    // ],
    showPhoneModal: false,//手机号绑定弹框
    arrowUrl: "https://img.sahuanka.com/earlyEdu-card/images/downArrow.png",
    goods: [],//商品列表
    curPage: 1,//当前页
    pageSize: 10,//条数
    choose: [],//选择
    chooseId: 0,//选择id
    chooseClassId: null,
    classShow: true,//分类选框是否显示
    sortShow: true,//排序选框是否显示
    sortId: 0,//排序id
    sort: [{ sortName: "综合排序", index: 0 }, { sortName: "价格从低到高", index: 1 }, { sortName: "价格从高到低", index: 2 }, { sortName: "最新发布", index: 3 }, { sortName: "距离最近", index: 4 }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       chooseId: options.businessMenuId,
     })
    this.innitChoose();
    this.innitBabygift(options.businessMenuId, 0)
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
  onShareAppMessage: function () {

  },
  //初始化数据
  innitBabygift(chooseId, sort) {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;

        if (chooseId == 0) {
          mdata = { 'page': that.data.curPage, 'limit': that.data.pageSize, sort: that.data.sortId, activitytype: [3, 4] }
        } else {
          var mdata = { 'productmenuid': chooseId, 'page': that.data.curPage, 'limit': that.data.pageSize, sort: that.data.sortId, activitytype: [3, 4] };
        }
        wx.showLoading({
          "mask": true
        })
        wx.request({
          url: getApp().apiUrl + '/api/activity/list',
          method: 'post',
          data: mdata,
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
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
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //初始化选择状态框
  innitChoose() {
    var that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/product/menu/list',
          method: 'get',
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res);
            var choose = [{ productMenuId: 0, name: "全部" }];
            if (res.data.code == 0) {
              for (var i = 0; i < res.data.list.length; i++) {
                choose.push(res.data.list[i]);
              }
            }
            that.setData({
              curPage: 1,
              choose: choose,
              // chooseId: 0,
            });
            // that.innitBabygift(that.data.chooseId, that.data.sortId)
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
      goods: [],
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
    if(e.currentTarget.dataset.c == true) {
      chooseClassId = this.data.chooseClassId
    }
    console.log(e)
    this.setData({
      goods: [],
      curPage: 1,
      classShow: !this.data.classShow,
      sortShow: true,
      chooseClassId: chooseClassId,
      // chooseId: e.currentTarget.id,
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
  goGoodsdetail(e) {
    console.log(e)
    var businessactivityid = e.currentTarget.dataset.businessId;
    var businessid = e.currentTarget.dataset.id;
    var activitytype = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + businessactivityid + '&businessid=' + businessid + "&activitytype=" + activitytype,
    })
  },
})