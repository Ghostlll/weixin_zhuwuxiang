//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    markers: [{
      iconPath: '/pages/images/houbefore.png',
      id: 0,
      longitude: 114.397845 ,
      latitude:  23.100181 ,
      width: 50,
      height: 50
    }],

    //规划范围
    polygons: [{
      points: [{
        longitude: 114.395914,
        latitude: 23.101326
      }, {
        longitude: 114.398167,
        latitude: 23.100931
      }, {
        longitude: 114.401493,
        latitude: 23.099510
      }, {
        longitude: 114.398253,
        latitude: 23.097872
      }, {
        longitude: 114.393983,
        latitude: 23.099924
      }],
      strokeColor: '#FF0000DD',
      strokeWidth: 2,
      fillColor: '#FF0000DD'
    }],
  },

//regionchange
  regionchange(e) {
    console.log(e.type)
  },

//跳转页面
  jumpage1: function () {
    wx.navigateTo({
      url: '../parkGreen/parkGreen',
    })
  },
  jumpage2: function () {
    wx.navigateTo({
      url: '../traffic/traffic',
    })
  },
  jumpage3: function () {
    wx.navigateTo({
      url: '../build/build',
    })
  },
  jumpage4: function () {
    wx.navigateTo({
      url: '../food/food',
    })
  },
  jumpage5: function () {
    wx.navigateTo({
      url: '../wire/wire',
    })
  },
  jumpage6: function () {
    wx.navigateTo({
      url: '../gabage/gabage',
    })
  },
  jumpage7: function () {
    wx.navigateTo({
      url: '../floor/floor',
    })
  },
  jumpage8: function () {
    wx.navigateTo({
      url: '../street/street',
    })
  },
  jumpage9: function () {
    wx.navigateTo({
      url: '../Other/Other',
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
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
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
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
  
})
