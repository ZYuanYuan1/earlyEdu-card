var util = require('../../../utils/hashes.js');

Component({
  // 组件的属性列表
  properties: {
    isShow: {
      type: Boolean,
      value: false
    }
  },

  // 组件的初始数据
  data: {
    //phoneShowModal: false
    mobile: "", //绑定手机号的值
    codeVal: "", //验证码登录-输入的验证码
    VerifyCode: '获取验证码'
  },

  // 组件的方法列表
  methods: {
    //input实时获取手机号
    getMobile: function (e) {
      var mobile = e.detail.value.trim();
      this.setData({
        mobile: mobile
      })
    },
    /**
     * 验证码输入框输入时获取input值
     */
    getcodeVal: function (e) {
      var code = e.detail.value.trim();
      this.setData({
        codeVal: code
      })
    },
    /**
     * 获取短信验证码
     */
    getCode: function () {
      //获取手机号，去掉所有空格
      var mobile = this.data.mobile.replace(/\s/g, "");
      if (!mobile) {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none'
        })
        return false;
      }
      var myreg = /^((1)+\d{10})$/;
      //用正则校验手机号码是否正确
      if (!myreg.test(mobile)) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none'
        })
        return false;
      }
      //初始化倒计时时长
      var waitTime = 60;
      //调用验证码倒计时
      this.count_down(this, waitTime);
      var that = this;
      wx.request({
        url: getApp().apiUrl + '/api/user/sms',
        method: 'POST',
        data: {
          "phone": mobile,
          'templateCode': 1,
          'key': util.hex_sha256(util.hexMD5("card" + mobile).toUpperCase())
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            wx.showToast({
              title: '验证码发送成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            console.log(res);
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
          };
        },
        fail: function () {

        }
      })
    },
    preventTouchMove: function () {},
    //点击按钮-出现弹框
    showDialogPhoneBtn: function () {
      this.setData({
        isShow: true
      })
    },
    //取消按钮
    onCancelPhone: function () {
      this.setData({
        isShow: false
      });
    },
    //确定按钮
    onConfirmPhone: function () {
      var that = this;
      //获取手机号，去掉所有空格
      var mobile = this.data.mobile.replace(/\s/g, "");
      if (!mobile) {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none'
        })
        return false;
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
      //用正则校验手机号码是否正确
      if (!myreg.test(mobile)) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none'
        })
        return false;
      }
      var verCode = this.data.codeVal.trim();
      if (!verCode) {
        wx.showToast({
          title: '验证码不能为空',
          icon: 'none'
        })
        return false
      }
      var codeReg = /^[0-9]*$/;
      if (!codeReg.test(verCode) || verCode.length != 4) {
        wx.showToast({
          title: '验证码有误',
          icon: 'none'
        })
        return
      }
      var invitemobile = getApp().globalData.invitePeopleNumber;
      wx.login({
        success: function (res1) {
          if (res1.code) {
            //发起网络请求
            wx.request({
              url: getApp().apiUrl + '/api/weixin/phonebinding',
              method: 'POST',
              data: {
                "appletCode": res1.code,
                "mobile": mobile,
                "code": verCode,
                "invitemobile": invitemobile
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res2) {
                if (res2.data.code == 0) {
                  that.triggerEvent('phone', {}, {})
                } else {

                }
              },
              fail: function () {}
            })
          }
        }
      });
    },
    //渲染验证码倒计时
    count_down: function (that, waitTime) {
      if (waitTime == 0) {
        that.setData({
          VerifyCode: "重新发送",
          disabled: ""
        });
      } else {
        that.setData({
          VerifyCode: waitTime + " 秒",
          disabled: "disabled"
        });
        waitTime--;
        setTimeout(function () {
          that.count_down(that, waitTime)
        }, 1000)
      }
    }
  }
})