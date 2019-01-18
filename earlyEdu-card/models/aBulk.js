//首页
import {
  HTTP
}
from '../utils/http-p.js'

class HomeModel extends HTTP {
  data = null
  //商场订单
  getHomeInfo() {
    return this.request({
      url: 'travel/home/home',
      method: 'POST'
    })
  }

  //获取当前城市名字
  getCityInfo(latitude, longitude, sCallback) {
    wx.request({
      url: `https://api.map.baidu.com/geocoder/v2/?ak=Og3bCINwlyWNDrjDzwMmimZOpVIeg48b&location=${latitude},${longitude}&output=json`,
      success(res) {
        sCallback(res)
      }
    })
  }
}



export {
  HomeModel
}