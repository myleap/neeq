// join.js
var app = getApp();
var common = require("../../js/common");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [
            {name: '拟上市', value: '0', checked: true},
            {name: '被投资', value: '1'},
            {name: '被并购', value: '2' }
        ],
  },
  checkboxChange: function (e) {
   
      var checkboxItems = this.data.checkboxItems, values = e.detail.value;
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
          checkboxItems[i].checked = false;

          for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
              if (checkboxItems[i].value == values[j]) {
                  checkboxItems[i].checked = true;
                  break;
              }
          }
      }

      this.setData({
          checkboxItems: checkboxItems,
          values:values
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  submitJoinMember: function (e) {
      var joinmember = e.detail.value;
      if (!joinmember.name || joinmember.name == "") {
          this.errorShow("公司名称必填");
          return;
      }
      if (!joinmember.code || joinmember.code == "") {
          this.errorShow("公司代码必填");
          return;
      }
      if (!joinmember.contacts || joinmember.contacts == "") {
          this.errorShow("联系人姓名必填");
          return;
      }
      if (!joinmember.contactsmobile || joinmember.contactsmobile == "") {
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

      common.dataAccess("?g=portal&m=user&a=joinMember",
          {
              uid: app.globalData.userInfo.id,
              code: joinmember.code,
              company: joinmember.name,
              contacts: joinmember.contacts,
              contactsmobile: joinmember.contactsmobile,
              rzyx: that.data.values.toString()
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
  errorShow: function (txt) {
      this.setData({
          errorInfo: txt
      });
  }
})