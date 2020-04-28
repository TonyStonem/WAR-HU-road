// pages/cloud/cloud.js
var db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: []
  },

  insert: function () {
    db.collection("user").add({
      data: {
        name: "sid",
        age: 17
      },
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })

    /*db.collection("user").add({
      data: {
        name: "tony",
        age: 18
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })*/
  },

  delete: function () {
    db.collection("user").doc("2a625d2b5ea679500039fe52742237e0")
      .remove()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  update: function () {
    db.collection("user").doc("2a625d2b5ea679500039fe52742237e0").update({
      data: {
        age: 18
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },

  query: function () {
    db.collection("user").where({
        name: "tony"
      })
      .get()
      .then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
  },

  sum: function () {
    wx.cloud.callFunction({
        name: "sum",
        data: {
          a: 1,
          b: 2
        }
      }).then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  getOpenId: function () {
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },

  batchDeletion: function () {
    wx.cloud.callFunction({
      name: "batchDeletion"
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },

  upload: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);

        //上传图片到云端
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + ".png", //上传至云端的路径
          filePath: tempFilePaths[0], //小程序临时文件路径
          success: res => {
            //返回文件ID
            console.log(res.fileID)

            //文件ID存储到云数据库
            db.collection("images").add({
              data: {
                fileID: res.fileID
              }
            }).then(res => {
              console.log(res);
            }).catch(err => {
              console.log(err);
            })

          },
          fail: err => {
            console.error(err);
          }
        })

      }
    })
  },

  getFile: function () {
    //获取openid
    wx.cloud.callFunction({
        name: "login"
      })
      .then(res => {
        var openID = res.result.openid
        console.log(openID)

        //根据openid去images数据库查找fileid
        db.collection("images").where({
            _openid: openID
          }).get()
          .then(res2 => {
            console.log(res2)

            //页面展示
            this.setData({
              images: res2.data
            })
          })
      })
  },

  downloadFile: function (event) {
    //从云端下载图片下来
    wx.cloud.downloadFile({
      fileID: event.target.dataset.fileid,
      success: res => {
        console.log(res.tempFilePath)

        //保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)

            //提示用户 保存成功
            wx.showToast({
              title: '保存成功'
            })
          },
          fail(err) {
            console.log(err)
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
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

  }
})