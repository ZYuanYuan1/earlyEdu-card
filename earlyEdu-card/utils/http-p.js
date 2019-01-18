class HTTP {
  request({
    url,
    data = {},
    method = 'GET',
    header = {
      'content-type': 'application/json'
    }
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header)
    })
  }

  _request(url, resolve, reject, data = {}, method = 'GET', header = {
    'content-type': 'application/json'
  }) {
    wx.request({
      url: getApp().apiUrl + url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          resolve(res.data)
        } else {
          reject()
          const error_alert = '请求失败'
          this._show_error(error_alert)
        }
      },
      fail: (err) => {
        reject()
        this._show_error()
      }
    })
  }

  _show_error(error_alert) {
    wx.showToast({
      title: error_alert ? error_alert : '抱歉，出现了一个错误',
      icon: 'none',
      duration: 2000
    })
  }

}

export {
  HTTP
}