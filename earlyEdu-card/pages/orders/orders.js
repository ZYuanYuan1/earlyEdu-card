// pages/orders/orders.js
var sliderWidth = 55; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../utils/util.js');
var QR = require("../../utils/qrcode.js");
import {
  $wuxRater
} from '../../components/wux'; //星星组件
var page = 1;
var hadLastPage = false;
Page({
  data: {
    inviteUserPhone: '', //邀请人电话
    taskList: [],
    businiss: [],
    tabs: ["全部", "待支付", "待使用", "待评价"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    showModal: false, //电子券弹框
    showPhoneModal: false, //手机号绑定弹框
    showModalStar: false, //订单评价弹框
    maskHidden: true,
    imagePath: '',
    placeholder: '', //默认二维码生成文本
    currClickStar: 5, //默认评分的值为5
    businessActivityId: '', //评价-当前活动id
    orderId: '', //订单id
    textareaVal: '',
    state: 1, //textarea-评价内容
    lock: false
  },
  onLoad: function () {
    // console.log(this.data.state)
    // page = 1;
    // hadLastPage = false;
    // var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
    //       sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
    //     });
    //   }
    // });
    //加载订单列表
    //   that.loadOrderListFun();
    // },
    // tabClick: function (e) {
    //   console.log(e);
    //   this.setData({
    //     sliderOffset: e.currentTarget.offsetLeft,
    //     activeIndex: e.currentTarget.id
    //   });
    //用户注册
    if (getApp().globalData.userInfo != null) {
      wx.getStorage({
        key: 'loginStutes',
        success: function (res) {
          var userInfo = JSON.parse(res.data);
          var tel = userInfo.mobile
          getApp().globalData.invitePeopleNumber = tel
        }
      })
    }
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
    //加载订单列表
    page = 1;
    hadLastPage = false;
    var that = this;
    that.setData({
      taskList: []
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    //加载订单列表
    that.loadOrderListFun();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
  onPullDownRefresh() {
    console.log("66666666")
    page = 1;
    this.setData({
      taskList: [],
    })
    this.loadOrderListFun();
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if(that.data.lock === true) {
      return
    }
    that.loadOrderListFun();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  //加载订单列表
  loadOrderListFun: function () {
    var that = this;
    // if (hadLastPage != false) {
    //   that.setData({ reachBottomTip: true });
    //   return;
    // };
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        that.setData({
          'userInfo': userInfo
        });
        wx.request({
          url: getApp().apiUrl + '/api/order/info/list',
          method: 'post',
          data: {
            'ordertype': [6, 11, 12],
            'limit': 10,
            'page': page
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var taskList = that.data.taskList;
              var businiss = that.data.businiss;
              var data = res.data.page.list;
              if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  if (data[i].orderType != 1) {
                    taskList.push(data[i].orderEntity);
                    businiss.push(data[i].businessInfo);
                  }
                }
              }
              if (res.data.page.currPage == res.data.page.totalPage) {
                hadLastPage = res.data.page.currPage;
                that.data.lock = true
              } else {
                page++;
              };
              that.setData({
                'taskList': taskList,
                businiss: businiss
              });
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            };

          },

        })
      },
      fail: function (res) {
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  //支付按钮
  gotopay: function (e) {
    console.log(e);
    var fromMyOrder = e.target.dataset.orderInfo;
    if (fromMyOrder.orderpic) {
      fromMyOrder.orderpic = encodeURIComponent(fromMyOrder.orderpic);
    }
    if (fromMyOrder.qrcode) {
      fromMyOrder.qrcode = encodeURIComponent(fromMyOrder.qrcode);
    }
    console.log(fromMyOrder);
    fromMyOrder = JSON.stringify(fromMyOrder);
    var type = 1;
    wx.navigateTo({
      url: '/pages/payment/payment?orderInfo=' + fromMyOrder + "&type=1",
    })
  },
  preventTouchMove: function () {},
  //点击电子券-弹出电子券二维码
  showDialogBtn: function (e) {
    var orderNo = e.target.dataset.orderNumber;
    this.setData({
      orderNo: orderNo,
      showModal: true
    })
    console.log(e);
    //生成二维码
    var size = this.setCanvasSize(); //动态设置画布大小
    var qrcData = e.target.dataset.qrcodeUrl;
    if (qrcData) {
      this.createQrCode(qrcData, "mycanvas", size.w, size.h);
    }

  },
  //关闭按钮
  onCancel: function () {
    this.setData({
      showModal: false
    });
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      // var res = wx.getSystemInfoSync();
      // var scale = 375/ 343;//不同屏幕下canvas的适配比例；设计稿是750宽
      // var width = res.windowWidth / scale;
      // var height = width;//canvas画布为正方形
      size.w = 120;
      size.h = 120;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log("********" + tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone; //true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.loadOrderListFun();
    }
  },
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    util.errImgFun(e, this);
  },
  //绑定textarea的值
  bindTextareaVal: function (e) {
    var textareaVal = e.detail.value.trim();
    this.setData({
      textareaVal: textareaVal
    });
  },
  //弹出评价弹框
  pop_evaluate: function (e) {
    console.log(e)
    var that = this;
    var businessActivityId = e.target.dataset.businessActivityId;
    var orderId = e.target.dataset.orderId;
    var ordertype = e.target.dataset.ordertype
    wx.navigateTo({
      url: '/pages/comment/comment?businessActivityId=' + JSON.stringify(businessActivityId) + '&orderId=' + JSON.stringify(orderId)
    })
  },
  //评价弹框-取消按钮
  onCancelStar: function () {
    this.setData({
      'showModalStar': false
    });
  },
  //跳转到课程详情页
  goGoodsDetail: function (e) {
    console.log(e)
    const orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderid=${orderid}`
    })
    // var businessactivityid = e.currentTarget.dataset.businessId
    // var currActivityType = e.currentTarget.dataset.activityType;
    // var businessid = e.currentTarget.id;
    // if (currActivityType==12){
    //   wx.navigateTo({
    //     url: '/pages/groupDetail/groupDetail?assembleActivityId=' + businessactivityid + "&businessId=" + businessid,
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '/pages/goodsDetail/goodsDetail?businessactivityid=' + businessactivityid + "&businessid=" + businessid + "&activitytype=" + currActivityType,
    //   })
    // }
  },
  //评价弹框-提交按钮
  onConfirmStar: function () {
    var that = this;
    var businessActivityId = this.data.businessActivityId; //活动id
    var orderId = this.data.orderId; //订单id
    var currClickStar = this.data.currClickStar; //当前的评分
    var content = this.data.textareaVal;
    var tokenVal = this.data.userInfo.app_token;
    wx.request({
      url: getApp().apiUrl + '/api/businessevaluation/save',
      method: 'post',
      data: {
        'businessactivityid': businessActivityId,
        'orderid': orderId,
        'score': currClickStar,
        'content': content
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': tokenVal
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.showToast({
            title: '评价成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              that.setData({
                'showModalStar': false
              });
            }
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        };

      },

    })
  },
})