// suggestcompany.js
var common = require("../../js/common");
var app =getApp();
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
      wx.setNavigationBarTitle({ title: "推荐企业" });
  },
  submitSuggest: function (e) {
      var suggest = e.detail.value;

      if (!suggest.company || suggest.company == "") {
          this.errorShow("公司名称必填");
          return;
      }
      if (!suggest.reason || suggest.reason == "") {
          this.errorShow("推荐原因必填");
          return;
      }
      this.setData({
          errorInfo: false
      });
      var that = this;
      wx.showLoading({
          title: '正在提交',
      });
      
    common.dataAccess("?g=portal&m=user&a=suggest",
        {
            uid: app.globalData.userInfo.id,
            reason: suggest.reason,
            company: suggest.company
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
  errorShow: function (txt) {
      this.setData({
          errorInfo: txt
      });
  }
})