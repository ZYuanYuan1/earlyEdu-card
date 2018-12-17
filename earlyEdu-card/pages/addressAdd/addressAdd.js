// pages/addressAdd/addressAdd.js
//获取应用实例
var app = getApp()
Page({
  data: {
    id: "",
    token: "",
    provinces: [],
    citys: [],
    districts: [],
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0,
    addressList: [],
    isDefault: false,
    region: ['请选择省市区', '', ''],
  },
  onLoad: function (e) {
    var addressList
    if (e.addressList != null) {
      addressList = JSON.parse(e.addressList);
      console.log(addressList);
      var that = this;
      var id = addressList.userAddrId;
      if (id) {
        that.setData({
          id: id,
          isDefault: addressList.isDefault,
          addressList: addressList,
          region: [addressList.province, addressList.city, addressList.district]
        });
        return;
      } else {
        wx.showModal({
          title: '提示',
          content: '无法获取地址数据',
          showCancel: false
        })
      }
    } else {
      addressList = null
    }
  },
  checkboxChange(e) {
    var isDefault = this.data.isDefault;
    isDefault = !this.data.isDefault
    this.setData({
      isDefault: isDefault
    })
  },
  bindCancel: function () {
    wx.navigateBack({})
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindSave: function (e) {
    console.log(e);
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;

    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (this.data.selProvince == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (this.data.selCity == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    //保存  修改
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        console.log(tokenVal);
        var apiAddoRuPDATE = "save";
        var apiAddid = that.data.id;
        console.log(apiAddid);
        var methods = "post";
        if (apiAddid) {
          apiAddoRuPDATE = "update";
        } else {
          apiAddid = ""
        }
        wx.request({
          url: getApp().apiUrl + '/api/userAddr/' + apiAddoRuPDATE,
          method: "post",
          data: {
            userAddrId: apiAddid,
            recipient: e.detail.value.linkMan,
            province: that.data.region[0],
            city: that.data.region[1],
            district: that.data.region[2],
            street: e.detail.value.address,
            phoneNumber: e.detail.value.mobile,
            isDefault: that.data.isDefault
          },
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res);
            if (res.data.code != 0) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '操作失败',
                content: "请联系管理员",
                showCancel: false
              })
              return;
            }
            // 跳转到结算页面
            wx.navigateBack({
              url: "/pages/address/address"
            })
          }
        })
      },
    })
  }
})