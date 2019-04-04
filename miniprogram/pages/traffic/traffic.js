// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    promote: [
      { name: '有乱停车现象', value: 1 },
      { name: '人行道过窄', value: 2 },
      { name: '有垃圾箱或其他设施挡路', value: 3 },
      { name: '交通噪音过大', value: 4 },
      { name: '交通设施缺失', value: 5 }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  //记录数据库数据
  formSubmit: function (e) {
    const db = wx.cloud.database()
    db.collection('counters').add({
      data: {
        value : e.detail.value
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          value: e.detail.value
        })
        wx.showToast({
          title: '新增记录成功',
        })
  
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  jumpage: function () {
    wx.navigateTo({
      url: 'pages/index/index'
    })
  }
})