//app.js
// App({
//   onLaunch: function () {
//     // 展示本地存储能力
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       }
//     })
//     // 获取用户信息
//     wx.getSetting({
//       success: res => {
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//           wx.getUserInfo({
//             success: res => {
//               // 可以将 res 发送给后台解码出 unionId
//               this.globalData.userInfo = res.userInfo

//               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//               // 所以此处加入 callback 以防止这种情况
//               if (this.userInfoReadyCallback) {
//                 this.userInfoReadyCallback(res)
//               }
//             }
//           })
//         }
//       }
//     })
//   },
//   globalData: {
//     userInfo: null
//   }
// })
App({
  globalData: {
    userInfo: null,
    latitude: '',
    longitude: '',
    county: '温州市',
    scene: null,
    systemInfo: null,
    loginInfo: null,
    invitePeopleNumber: "",
    localAddress: '杭州',
    flag: true
  },
  onLaunch(options) {
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    //console.log(logs);
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // console.log(options);
    this.globalData.scene = options.scene;
    this.getUserInfo(function (info) {
      // console.log(info);
      // console.log(that.globalData.invitePeopleNumber)
    });
  },
  getSystemInfo: function (cb) {
    var that = this
    if (that.globalData.systemInfo) {
      typeof cb == "function" && cb(that.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.systemInfo = res
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
      })
    }
  },
  getUserInfo: function (cb) {
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        // console.log(that.globalData.flag)
        // console.log(res)
        wx.getStorage({
          key: 'flag',
          success: function (res) {
            that.globalData.flag = res.flag
          }
        })
        // console.log(that.globalData.flag)  
        var js_code = res.code;
        wx.request({
          url: that.apiUrl + '/api/weixin/login',
          // url:"https://api.jcrsjy.com/api/home/getToken",
          method: 'post',
          data: {
            'appletCode': js_code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            // console.log("登录成功"+res);
            if (res.data.code == 0) {
              //如果用户不为空
              if (res.data.user) {
                wx.setStorage({
                  key: 'loginStutes',
                  data: JSON.stringify(res.data.user)
                })
                that.globalData.userInfo = res.data.user
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            }
          },

        })
      },
      fail: function () {

      }
    })
  },

  //定位地址方法
  locationFun() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.globalData.latitude = latitude;
        that.globalData.longitude = longitude;
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            // console.log(res);
            //that.setData({ 'locationStr': res.result.address })
          },
          fail: function (res) {
            // console.log(res);
          },
          complete: function (res) {
            // console.log(11);
          }
        });
      }
    })
  },

   apiUrl: "https://test2.jcrsjy.com", //测试接口
  //  apiUrl: "https://api.jcrsjy.com", //正式接口

})