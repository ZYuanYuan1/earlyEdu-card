// pages/comment/comment.js
var qiniu=require('../../utils/qiniuUploader.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:[],
    evalList: [{tempFilePaths:[], imgList:[]}],
    "comment_title":"大嘴说",
    "conmment_content":"大嘴说在线英语半年课程",
    startext: "非常满意",
    stardata:[0,1,2,3,4],
    flag:5,
    businessactivity:{},
    no:"",
    flag1:false,
    isAnon:true,
    textarea:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var businessActivityId = options.businessActivityId;
    wx.request({
      url: getApp().apiUrl + '/api/businessactivity/info/' +businessActivityId,
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res.data.businessactivity)
        that.setData({
          businessactivity: res.data.businessactivity,
          orderId:options.orderId,
        })
      }
    })
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
  //内容
  bareaVal(e){
    this.setData({
     textarea:e.detail.value
    })
  },
  //匿名评价
  checkboxChange(e){
    this.setData({
      isAnon: !e.detail.value[0]
    })
  },
  changeColor: function (e){
    this.setData({no:e.currentTarget.dataset.no+1,flag1:true})
    var index=e.currentTarget.dataset.index;
    var num=e.currentTarget.dataset.no;
    var that=this;
    if (num == 0) {
      that.setData({
        flag: 1,
        startext: "差"
      });
    } else if (num == 1) {
      that.setData({
        flag: 2,
        startext: '较差'
      });
    } else if (num == 2) {
      that.setData({
        flag: 3,
        startext: '一般'
      });
    } else if (num == 3) {
      that.setData({
        flag: 4,
        startext: '满意'
      });
    } else if (num == 4) {
      that.setData({
        flag: 5,
        startext: '非常满意'
      });
    }
  },
  joinPicture: function (e) {
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.evalList;
    var that = this;
    var imgNumber = evalList[index].tempFilePaths;
    if (imgNumber.length >= 3) {
      wx.showModal({
        title: '',
        content: '最多上传三张图片',
        showCancel: false,
      })
      return;
    }
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage("album", imgNumber);
          } else if (res.tapIndex == 1) {
            that.chooseWxImage("camera", imgNumber);
          }
        }
      }
    })
  },
  chooseWxImage: function (type, list) {
    var img = list;
    var len = img.length;
    var that = this;
    var evalList = this.data.evalList;
    wx.chooseImage({
      count: 3,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function (res) {
        var addImg = res.tempFilePaths;
        var addLen = addImg.length;
        if ((len + addLen) > 3) {
          for (var i = 0; i < (addLen - len); i++) {
            var str = {};
            str.pic = addImg[i];
            img.push(str);
          }
        } else {
          for (var j = 0; j < addLen; j++) {
            var str = {};
            str.pic = addImg[j];
            img.push(str);
          }
        }
        that.setData({
          evalList: evalList
        })
        that.upLoadImg(img);
      },
    })
  },
  upLoadImg: function (list) {
    var that = this;
    this.upload(that, list);
  },
  //多张图片上传
  upload: function (page, path) {
    var that = this;
    var curImgList = [];
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
    for (var i = 0; i < path.length; i++) {
      wx.showToast({
        icon: "loading",
        title: "正在上传"
      }),
        wx.uploadFile({
        url: getApp().apiUrl +'/api/comment/upload',//接口处理在下面有写
          method: 'post',
          filePath: path[i].pic,
          name: 'file',
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
            },
          success: function (res) {
            console.log(res);
            curImgList.push(res.data);
            var evalList = that.data.evalList;
            evalList[0].imgList = curImgList;
            that.setData({
              evalList: evalList
            })
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return;
            }
            var data = res.data
            page.setData({  //上传成功修改显示头像
              src: path[0]
            })
          },
          fail: function (e) {
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideToast();  //隐藏Toast
          }
        })
    }
      }
    })
  },
  //删除图片
  clearImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.evalList;
    var img = evalList[0].tempFilePaths;
    img.splice(index, 1);
    this.setData({
      evalList: evalList
    })
    this.upLoadImg(img);
  },
  //提交发布
  submitClick: function (e) {
    var that=this;
    if(that.data.flag1==false){
      that.data.no=5
    }
    // var evalList = that.data.evalList;
    // var imgList = evalList[0].imgList;
    // var imgPort = "";//图片地址，多张以逗号分割
    // if (imgList.length != 0) {
    //   for (var j = 0; j < imgList.length; j++) {
    //     imgPort = imgList[j] + "," + imgPort;
    //   }
    // } else {
    //   imgPort = "";
    // }
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        var evalArr = that.data.evalList[0].tempFilePaths;
        for (var i = 0; i < evalArr.length;i++){
          that.data.imgUrl.push(evalArr[i].pic)
        }
    wx.request({
      url: getApp().apiUrl +'/api/comment/save',
      data:{
        orderId: that.data.orderId,
        score:that.data.no,
        content: that.data.textarea,
        isAnonymous:!that.data.isAnon,
        // imgList: JSON.stringify(that.data.evalList[0].tempFilePaths)
        imgList: that.data.imgUrl
      },
      method:"post",
      header: {
        'Authorization': tokenVal,
        'content-type': 'application/x-www-form-urlencoded'
            },
      success(res){
        if (res.data.code==0){
          wx.showToast({
               title: '评价成功',
               icon: 'success',
               duration: 1000,
             })
             wx.navigateBack({
            
             })
          var pages = getCurrentPages();

          var prevPage = pages[pages.length - 2]; //上一个页面

          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

          prevPage.setData({

            state: 0

          })
        }else{
          wx.showToast({
            title: '评价失败，请重新提交',
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })
      }
    })
  }
})