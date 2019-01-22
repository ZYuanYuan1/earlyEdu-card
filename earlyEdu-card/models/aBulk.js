//首页
import {
  HTTP
}
from '../utils/http-p.js'

class ABulkModel extends HTTP {
  data = null

  // 创建订单
  createOrder(businessactivityid, tokenVal) {
    return this.request({
      url: '/api/order/creatOrder',
      method: 'POST',
      data: {
        ordertype: 13,
        businessactivityid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': tokenVal
      },
    })
  }

  // 开卡
  pay(payInfo, sCallback) {
    wx.requestPayment({
      timeStamp: payInfo.timeStamp,
      nonceStr: payInfo.nonceStr,
      package: payInfo.package,
      signType: payInfo.signType,
      paySign: payInfo.paySign,
      success: function (res) {
        sCallback(res)
      },
      fail: function (res) {
        sCallback()
      },
    })
  }
}



export {
  ABulkModel
}