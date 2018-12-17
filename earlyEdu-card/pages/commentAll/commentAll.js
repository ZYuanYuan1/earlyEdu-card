// pages/commentAll/commentAll.js
var page = 1;
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    businessactivityid: 0,
    totalPage: 0
  },
  onLoad(o) {
    var that = this;
    page = 1;
    this.setData({
      businessactivityid: o.businessActivityId
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.loadMore();
  },

  // 请求数据
  loadMore() {
    var that = this;
    var list = that.data.list;
    that.setData({
      hidden: false
    });
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          method: "POST",
          url: getApp().apiUrl + "/api/comment/list",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal,
          },
          data: { businessActivityId: that.data.businessactivityid, page: page, limit: 10 },
          success: function (res) {
            console.log(res);
            // var starImg:[],
            for (var i = 0; i < res.data.page.list.length; i++) {
              list.push(res.data.page.list[i]);
              list[i].starImg = [];
              var createdate = list[i].createTime;
              var createMonth = createdate.substring(5, 7);
              var createDay = createdate.substring(8, 10);
              for (var j = 0; j < res.data.page.list[i].score; j++) {
                // list[i].push(starImg)
                list[i].starImg.push("http://img.sahuanka.com/sjCard/images/star.png");
              }


            }
            that.setData({
              list: list,
              totalPage: res.data.page.totalPage,
              createDate: createMonth + "月" + createDay + "日"
            });
            page++;
          }
        })
        that.setData({
          hidden: true
        });
      }
    })
  },
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    if (that.data.totalPage == page) {
      that.loadMore();
    } else {
      wx.showToast({

        title: "已经到底了",

        icon: 'none'

      })
    }

  }
})