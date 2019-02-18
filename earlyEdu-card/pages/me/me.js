// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},//用户信息
    isShowsex:false,//是否显示性别弹窗
    genderIndex: 0,//当前性别选择
    gender: ['男', '女'],//性别选择
    date: '2016-09-01'//当前日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.initInfoFun()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
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

  // name跳转页面
  nameBind(){
    wx.navigateTo({
      url: '/pages/myMessage/myMessage?userName=' + this.data.userInfo.username,
    })
  },
  //初始化页面
  initInfoFun: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var user= JSON.parse(res.data);
        var tokenVal = user.app_token;
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal},
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var userInfo = res.data.user;
              if (userInfo.dabaogender!=null){
              var genderIndex = that.data.gender.indexOf(userInfo.dabaogender);
                  that.setData({
                    genderIndex: genderIndex,
                  })
              }
              if (userInfo.dabaobirthday !=null||'') {
                var date = userInfo.dabaobirthday;
                that.setData({
                  date: date
                })
              }
              that.setData({ 
                'userInfo': userInfo,
                });
            } else if (res.data.code == 500 || res.data.code == 401) {
              that.setData({ 'showPhoneModal': true });
            };

          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  // 上传图片
  changeImg(){
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showToast({
          title: '请稍候...',
          icon: 'loading',
          duration: 10000,
          mask: true
        })

        wx.getStorage({
          key: 'loginStutes',
          success: function (r) {
            //console.log(res);
            var user = JSON.parse(r.data);
            //console.log(userInfo);
            var tokenVal = user.app_token;
            console.log(tokenVal);
            wx.uploadFile({
              url: getApp().apiUrl + '/api/user/uploadimg',
              method: 'post',
              filePath: res.tempFilePaths[0],
              name: 'file',
              header: { 'content-type': 'multipart/form-data', 'Authorization': tokenVal },
              success: function (uploadimgres) {
                var data = JSON.parse(uploadimgres.data)
                console.log(uploadimgres.data);
                var info = data.user;
                console.log(info);
                that.setData({
                  userInfo:info
                })
                wx.hideToast();
              }
            });
          },
          fail: function () {
            that.setData({ 'showPhoneModal': true });
          }
        })
      }
    })
  },
  // 选择性别
  sexBind(e){
    console.log(e.currentTarget.dataset.different);
    var that=this; 
    var different = e.currentTarget.dataset.different;
    that.setData({
      genderIndex:e.detail.value
    })
    //待完成-确认修改成功后的操作
    that.upData(different)
  },
  //选择日期
    birthBind(e){
      var that = this;
      var different = e.currentTarget.dataset.different;
      that.setData({
        date: e.detail.value
      })
      that.upData(different)
    },
    //上传性别和生日
  upData(different){
      var that=this;
    if (different=="sex"){
        var data = { dabaogender: that.data.gender[that.data.genderIndex] }
      }
    if (different =='birth'){
        var data = { dabaobirthday:that.data.date}
      }
      wx.getStorage({
        key: 'loginStutes',
        success: function (r) {
          //console.log(res);
          var userInfo = JSON.parse(r.data);
          //console.log(userInfo);
          var tokenVal = userInfo.app_token;
          //console.log(tokenVal);
          wx.request({
            url: getApp().apiUrl + '/api/user/update',
            method: 'post',
            data: data,
            header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
            success: function (res) {
              console.log(res);

            },
            fail: function () {
              console.log('操作失败');
            }
          })
        }
      }) 
    }
})