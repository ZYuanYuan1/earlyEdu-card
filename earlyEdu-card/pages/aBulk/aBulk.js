// pages/aBulk/aBulk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desheight:160,
    show:false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id
    })
    this.properties.height=160;
    this.getChildRun()
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
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail'
    })
  },
  //初始数据
  getChildRun() {
    var header = this.selectComponent('#myComponent');
    console.log(header);
    // 父组件里执行子组件的方法
    var aid=this.data.id;
    console.log(aid);
    header.childRun("/api/gift/pack/info/1", aid)
  }
})