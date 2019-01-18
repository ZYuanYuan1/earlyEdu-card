class PosterTemplate {
  palette({
    posterImg: img,
    posterTitle: title,
    posterRemark: remark,
    posterAmount: amount,
    posterQRcode: QRcode,
    posterAddress: address
  }) {
    let 
      n = address.length,
      m = 0
    address.forEach(e => {
      e.addressList.forEach(ee => {
        m++
      })
    })
    let posterHeight = 1086 + 90 * n + 36 * m
    // https://img.sahuanka.com/earlyEdu-card/images/poster_addr.png
    let paletteJson = {
      width: '750rpx',
      height: `${posterHeight}rpx`,
      background: '#ffffff',
      views: [{
          type: 'rect',
          css: {
            color: '#ffffff',
            width: '630rpx',
            height: '630rpx',
            borderWidth: '2rpx',
            borderColor: '#eee',
            top: '60rpx',
            left: '60rpx'
          }
        },
        {
          type: 'image',
          url: img,
          css: {
            width: '630rpx',
            height: '630rpx',
            top: '60rpx',
            left: '60rpx'
          }
        },
        {
          type: 'text',
          text: title,
          css: {
            color: '#333333',
            width: '480rpx',
            top: '730rpx',
            fontSize: '32rpx',
            left: '375rpx',
            align: 'center',
            fontWeight: 'bold'
          },
        },
        {
          type: 'text',
          text: remark,
          css: {
            color: '#FF7662',
            width: '460rpx',
            top: '784rpx',
            fontSize: '26rpx',
            left: '375rpx',
            align: 'center',
          },
        },
        {
          type: 'image',
          url: QRcode,
          css: {
            width: '150rpx',
            height: '150rpx',
            borderRadius: '75rpx',
            top: '864rpx',
            left: '140rpx',
          },
        },
        {
          type: 'image',
          url: '/images/poster_triangle.png',
          css: {
            width: '16rpx',
            height: '20rpx',
            top: '888rpx',
            right: '356rpx',
          },
        },
        {
          type: 'text',
          text: '扫码立享超值团购价',
          css: {
            color: '#FF7662',
            width: '216rpx',
            top: '884rpx',
            fontSize: '24rpx',
            right: '130rpx',
          },
        },
        {
          type: 'text',
          text: `总价值：￥${amount}`,
          css: {
            color: '#666666',
            top: '928rpx',
            fontSize: '28rpx',
            right: '130rpx',
            textDecoration: 'line-through'
          },
        },
        {
          type: 'text',
          text: '团购价：￥299',
          css: {
            color: '#FF5339',
            top: '972rpx',
            fontSize: '32rpx',
            right: '130rpx',
            fontWeight: 'bold'
          },
        },
      ],
    }
    let curTop = 1060
    let addrArr = []
    address.forEach(e => {
      let result = this._addStore(curTop, addrArr, e.activityName)
      curTop = result.curTop
      addrArr = result.addrArr
      e.addressList.forEach(ee => {
        let result = this._addStoreAddress(curTop, addrArr, ee.district + ee.address)
        curTop = result.curTop
        addrArr = result.addrArr
      })
    })
    paletteJson.views.push(...addrArr)
    return paletteJson
  }

  // 增加商户
  _addStore(curTop, addrArr, store) {
    curTop += 40
    addrArr.push({
      type: 'text',
      text: `— ${store}适用门店 —`,
      css: {
        color: '#472D22',
        top: `${curTop}rpx`,
        left: '375rpx',
        fontSize: '24rpx',
        align: 'center',
        fontWeight: 'bold'
      }
    })
    curTop += 36
    return {
      curTop,
      addrArr
    }
  }

  // 增加商户地址
  _addStoreAddress(curTop, addrArr, address) {
    curTop += 14
    addrArr.push({
      type: 'text',
      text: address,
      css: {
        color: '#472D22',
        top: `${curTop}rpx`,
        left: '375rpx',
        fontSize: '22rpx',
        align: 'center',
      },
    })
    curTop += 22
    return {
      curTop,
      addrArr
    }
  }
}

export {
  PosterTemplate
}