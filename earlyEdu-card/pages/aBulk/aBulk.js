import {
  PosterTemplate
} from './palette'
const posterTemplate = new PosterTemplate()

const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_base64src'

const base64src = function (base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
    const buffer = wx.base64ToArrayBuffer(bodyData)
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      },
    })
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    id: 0,
    goods: [],
    count: 0,
    template: '', //painter json数据
    posterData: null,
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    var id = this.data.id;
    this.initGoods(id);

    // 初始化小程序码
    this.innitQRcode()
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
  // 生成海报
  handlePoster() {
    let that = this
    wx.showModal({
      content: '即将生成分享海报',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '生成分享海报中',
            mask: true
          })
          base64src(that.data.posterQRcode)
            .then(res => {
              that.setData({
                showModal: true,
                'posterData.posterQRcode': res
              })
            })
            .then(() => {
              that.setData({
                template: posterTemplate.palette(that.data.posterData)
              })
            })
        } else if (res.cancel) {
          wx.showToast({
            title: '取消生成海报',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

  },
  onImgOK(e) {
    this.setData({
      posterPath: e.detail.path,
    })
    wx.hideLoading()
    // wx.saveImageToPhotosAlbum({
    //   filePath: e.detail.path,
    //   success(res) {
    //     wx.hideLoading()
    //     wx.showToast({
    //       title: '海报已保存至相册',
    //       icon: 'success',
    //       duration: 2000
    //     })
    //   },
    //   fail() {
    //     wx.hideLoading()
    //     wx.showToast({
    //       title: '保存海报失败，请重试',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    // })
  },
  handleCancelPoster() {
    this.setData({
      showModal: false
    })
  },
  handleSavePoster() {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.posterPath,
      success(res) {
        // wx.hideLoading()
        that.setData({
          showModal: false
        })
        wx.showToast({
          title: '海报已保存至相册',
          icon: 'success',
          duration: 2000
        })
      },
      fail() {
        // wx.hideLoading()
        that.setData({
          showModal: false
        })
        wx.showToast({
          title: '保存海报失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //跳转
  toGoodsdetail(e) {
    var id = e.currentTarget.id;
    var acType = e.currentTarget.dataset.acType;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + id + "&activitytype=" + acType
    })
  },
  //初始数据
  initGoods(giftPackId) {
    var that = this
    wx.request({
      url: getApp().apiUrl + "/api/gift/pack/info/" + giftPackId,
      method: "get",
      data: {
        'page': 1,
        'limit': 1000,
        giftPackId: giftPackId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        let page = res.data.info;
        if (res.data.code == 0) {
          let {
            posterPath: posterImg,
            title: posterTitle,
            remark: posterRemark,
            amount: posterAmount,
            storeList: posterAddress
          } = page
          let posterData = {
            posterImg,
            posterTitle,
            posterRemark,
            posterAmount,
            posterAddress
          }

          let goods = [];
          goods = that.data.goods;
          for (var i = 0; i < page.activityList.length; i++) {
            goods.push(page.activityList[i]);
          }
          that.setData({
            goods: goods,
            count: page.amount,
            posterData
          });
        }
      }
    })
  },
  innitQRcode() {
    var that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        // var tel = encodeURIComponent(`${userInfo.mobile}&${that.data.id}`)
        var tel = `${userInfo.mobile}.${that.data.id}`
        wx.request({
          url: getApp().apiUrl + "/api/weixin/qrCode",
          method: 'post',
          data: {
            scene: tel,
            page: `pages/aBulkPay/aBulkPay`,
            is_hyaline: true
          },
          header: {
            'content-type': 'application/json',
            'Authorization': tokenVal
          },
          responseType: 'arraybuffer',
          success(res) {
            var src = wx.arrayBufferToBase64(res.data); //对数据进行转换操作
            that.setData({
              posterQRcode: 'data:image/png;base64,' + src,
            })
          }
        })
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        })
      }
    })
  },
})