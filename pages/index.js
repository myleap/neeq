// index.js
var common=require("../js/common");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var res = wx.getSystemInfoSync();
      this.setData({
          winWidth:res.windowWidth,
          winHeight:res.windowHeight
      });
      app.globalData.tabbarWinHeight = res.windowHeight;
  }
})