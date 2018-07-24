var common = require("../../js/common");
var app = getApp()
// create.js
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
      wx.setNavigationBarTitle({title:"发起路演"});
  },
  submitRoadshow: function (e) {
      var roadshow = e.detail.value;
      if (!roadshow.compname || roadshow.compname == "") {
          this.errorShow("公司名/代码必填");
          return;
      }
      if (!roadshow.address || roadshow.address == "") {
          this.errorShow("地址必填");
          return;
      }
      if (!roadshow.contacts || roadshow.contacts == "") {
          this.errorShow("联系人必填");
          return;
      }
      if (!roadshow.contactsmobile || roadshow.contactsmobile == "") {
          this.errorShow("联系方式必填");
          return;
      }

      this.setData({
          errorInfo: false
      });
      var that = this;
      wx.showLoading({
          title: '正在提交',
      });

      common.dataAccess("?g=portal&m=RoadShow&a=create",
          {
              uid: app.globalData.userInfo.id,
              address: roadshow.address,
              contacts: roadshow.contacts,
              contactsmobile: roadshow.contactsmobile,
              time: that.data.date,
              remark: roadshow.remark,
              compname:roadshow.compname
          },
          function (res) {
              if (res.data.resCode == 200) {
                  app.globalData.userInfo.user_status = 2;
                  wx.redirectTo({
                      url: '../util/success?msg=提交成功，我们将尽快进行审核。'
                  });
              } else {
                  that.errorShow("申请失败,请稍候再提交!");
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