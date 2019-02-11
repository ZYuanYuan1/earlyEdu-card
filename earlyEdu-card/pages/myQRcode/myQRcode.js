// pages/myQRcode/myQRcode.js
var base64 = require('../../utils/base64.js')
const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src';

const base64src = function(base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  });
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false, //手机号绑定弹框
    img: "",
    saveImg: "",
    inviteUserPhone: '', //邀请人电话
    template: {},
    shareImage: '',
    showModal: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("1111" + JSON.stringify(options))
    if (options.inviteUserPhone) {
      var inviteUserPhone = options.inviteUserPhone;
      getApp().globalData.invitePeopleNumber = inviteUserPhone;
    }
    wx.getStorage({
      key: 'loginStutes',
      success: function(res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        console.log(tokenVal);
        that.innitQRcode(tokenVal)
      },
      fail: function(res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
    // that.goCanvas()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  //邀请
  onShareAppMessage: function(res) {
    var that = this
    console.log(res);
    if (res.from === 'button') {
      来自页面内转发按钮
      console.log(res.target);
    }
    // wx.getStorage({
    //   key: 'loginStutes',
    //   success: function(res2) {
    //     console.log(res2);
    //     var userInfo = JSON.parse(res2.data);
    //     that.setData({
    //       inviteUserPhone: userInfo.mobile
    //     });
    //   },
    // })
    let userInfo = wx.getStorageSync('loginStutes');
    console.log("2222" + userInfo.mobile)
    userInfo = JSON.parse(userInfo);
    console.log("2222" + userInfo.mobile)
    that.setData({
      inviteUserPhone: userInfo.mobile
    });
    return {
      title: '299一年，杭州娃的开销我包了',
      path: "/pages/my/my?inviteUserPhone=" + userInfo.mobile
    }
  },
  innitQRcode(token) {
    var that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function(res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        var tel = encodeURIComponent(userInfo.mobile)
        console.log(tokenVal);
        console.log(tel);
        wx.request({
          url: getApp().apiUrl + "/api/weixin/qrCode",
          method: 'post',
          data: {
            scene: tel,
            page: "pages/babyGift/babyGift",
            is_hyaline: true
          },
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          responseType: 'arraybuffer',
          success(res) {
            console.log("11111111" + res);
            var src2 = wx.arrayBufferToBase64(res.data); //对数据进行转换操作
            that.setData({
              img: 'data:image/png;base64,' + src2,
              saveImg: src2
            })
            //  console.log(that.data.saveImg);
            // var file = src2;
          }
        })
      },
      fail: function(res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  //处理分享海报生成
  handleSharePoster() {
    let that = this
    wx.showLoading({
      title: '生成分享海报中',
      mask: true
    })
    base64src(this.data.img).then(res => {
      console.log(res)
      let qrcode = res
      wx.getImageInfo({
        src: 'https://img.sahuanka.com/earlyEdu-card/images/poster_bg1.jpg',
        success: function(res) {
          that.setData({
            showModal: true,
            template: that.palette(res.path, qrcode)
          })
        }
      })

    })


  },
  onImgOK(e) {
    this.setData({
      shareImage: e.detail.path
    })
    wx.hideLoading()
  },
  palette(bg, qr_code) {
    return ({
      width: '558rpx',
      height: '992rpx',
      background: bg,
      views: [{
        type: 'image',
        url: qr_code,
        css: {
          width: '180rpx',
          height: '180rpx', 
          left: '189rpx',
          top: '500rpx',
          borderRadius: '90rpx'
        }
      }]
    })
  },
  handleCancelPoster() {
    this.setData({
      showModal: false
    })
  },
  handleSavePoster() {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          showModal: false
        })
      }
    })
  },
  // saveImg(){
  //     var that=this;
  //       wx.saveImageToPhotosAlbum({
  //         filePath: that.data.img,
  //         success: function (res) {
  //           wx.showToast({
  //             title: '保存成功',
  //             icon: "none"
  //           })
  //         },
  //         fail: function (res) {
  //           wx.showToast({
  //             title: '保存失败',
  //             icon: "none"
  //           })
  //         }
  //       })
  //   },
  // goCanvas(){
  //   var that=this;
  //       const ctx = wx.createCanvasContext('shareCanvas')
  //       ctx.drawImage(that.data.saveImg, 0, 0, 200,400)
  //       ctx.draw()
  // }
})