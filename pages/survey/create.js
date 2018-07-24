var common = require("../../js/common");
var app = getApp();
// create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:app.dateformat(new Date(),"yyyy-MM-dd")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.setNavigationBarTitle({ title: "发起调研" });
  },
  submitSurvey: function (e) {
      var survey = e.detail.value;

      if (!survey.company || survey.company == "") {
          this.errorShow("公司名称必填");
          return;
      }
      if (!survey.address || survey.address == "") {
          this.errorShow("地址必填");
          return;
      }
      if (!survey.contacts || survey.contacts == "") {
          this.errorShow("联系人必填");
          return;
      }
      if (!survey.contactsmobile || survey.contactsmobile == "") {
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

      common.dataAccess("?g=portal&m=survey&a=create",
          {
              uid: app.globalData.userInfo.id,
              address: survey.address,
              company: survey.company,
              contacts: survey.contacts,
              contactsmobile: survey.contactsmobile,
              time:that.data.date,
              remark:survey.remark
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