// addition.js
var app = getApp();
var common = require("../../js/common");
Page({

  /**
   * 页面的初始数据
   */
    data: {
        date: app.dateformat(new Date(), "yyyy-MM-dd")
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  submitAddition: function (e) {
      var addition = e.detail.value;
      if (!addition.company || addition.company == "") {
          this.errorShow("公司名称必填");
          return;
      }
      if (!addition.zfjg || addition.zfjg == "") {
          this.errorShow("增发价格必填");
          return;
      }
      if (!addition.zfsl || addition.zfsl == "") {
          this.errorShow("增发数量必填");
          return;
      }
      if (!addition.mjzj || addition.mjzj == "") {
          this.errorShow("募集资金必填");
          return;
      }
      if (!this.data.date || this.data.date == "") {
          this.errorShow("公告时间必填");
          return;
      }
      this.setData({
          errorInfo: false
      });
      var that = this;
      wx.showLoading({
          title: '正在提交',
      });

      common.dataAccess("?g=portal&m=user&a=addition",
          {
              uid: app.globalData.userInfo.id,
              zfjg: addition.zfjg,
              company: addition.company,
              zfsl: addition.zfsl,
              mjzj: addition.mjzj,
              ggrq: that.data.date
          },
          function (res) {
              if (res.data.resCode == 200) {
                  app.globalData.userInfo.user_status = 2;
                  wx.redirectTo({
                      url: '../util/success?msg=提交成功，我们将尽快进行审核。'
                  });
              } else {
                  that.errorShow("操作失败,请稍候再提交!");
              }
              wx.hideLoading();
          }
      );

  },
  bindDateChange: function (e) {
      this.setData({
          date: e.detail.value
      })
  },
  errorShow: function (txt) {
      this.setData({
          errorInfo: txt
      });
  }
})