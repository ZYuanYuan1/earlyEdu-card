// pages/aBulk/aBulk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    id:0,
    goods:[],
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id
    })
    var id=this.data.id;
    this.initGoods(id);
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
  //跳转
  toGoodsdetail(e){
   var id=e.currentTarget.id;
    var acType=e.currentTarget.dataset.acType;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + id + "&activitytype=" + acType
    })
  },
  //初始数据
  initGoods(giftPackId){
    var that=this
     wx.request({
       url: getApp().apiUrl + "/api/gift/pack/info/" + giftPackId,
       method: "get",
       data: {
         'page': 1,
         'limit': 1000,
         giftPackId: giftPackId
       },
       header: {
         // 'Authorization': tokenVal,
         'content-type': 'application/x-www-form-urlencoded'
       },
       success: function (res) {
         console.log(res);
         // console.log(res.data.page.pageSize);
         var page = res.data.info;
         console.log(page.activityList.length);
         if (res.data.code == 0) {
           let goods = [];
           goods = that.data.goods;
           for (var i = 0; i < page.activityList.length; i++) {
             goods.push(page.activityList[i]);
           }
           that.setData({
             goods: goods,
             count: page.amount
           });
         }
       }
     })
   }
})