// components/index/share-gift/index.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['item', 'tag'],
  properties: {
    // 样式传值
    paramAtoB: {
      type: Number,
      value: 200
    },
    isShow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods:[],
    id:0,
    acid:0,
    isSure:true
  },
  ready(){
    // this.childRun("/api/gift/pack/info/1", "1")
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(e) {
      var id=e.currentTarget.id;
      var acid=e.currentTarget.dataset.acid
      var myEventDetail = { id: id, acid: acid}
      var myEventOption = {}
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    childRun(url){
      console.log("haaaaaaaaaaaaaaa");
      var that=this;
      wx.request({
        url: getApp().apiUrl + url,
        method: "post",
        data: {
          'page': 1,
          'limit': 1000,
        },
        header: {
          // 'Authorization': tokenVal,
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          // console.log(res.data.page.pageSize);
          var page = res.data.list;
          console.log(page.length);
          if (res.data.code == 0) {
            let goods = [];
            goods = that.data.goods;
            for (var i = 0; i <page.length; i++) {
              goods.push(page[i]);
              if (page[i].giftPackId){
                 that.setData({
                   isSure:false
                 })
              }
            }
            that.setData({
              goods: goods
            });
          }
        }
      })
    },
  }
})
