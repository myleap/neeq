var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: '推荐企业',
        url: "../pages/my/suggestcompany"
      },
      {
        name: '发起评价',
        url: "../pages/company/search"
      },
      {
        name: '发起调研',
        url: "../pages/survey/create"
      },
      {
        name: '发起路演',
        url: "../pages/roadshow/create"
      },
      {
        name: '我要加盟',
        url: ""
      },
      {
        name: '定增方案',
        url: "../pages/placement/create"
      },
      {
        name: '实名认证',
        url: "../pages/my/certification"
      },
      {
        name: '关注设置',
        url: "../pages/evaluate/create"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   this.doCheckLogin();
  },
  onShow:function(){
    this.doCheckLogin();
  },
  doCheckLogin:function(){
      if (app.globalData.userInfo) {
          this.setData({
              userInfo: app.globalData.userInfo
          });
          if (app.globalData.userInfo.user_status) {
              this.setData({
                  isauth: app.globalData.userInfo.user_status
              });
          } else {
              this.setData({
                  isauth: 1
              });
          }
      }
  },
  login:function(){
      wx.showLoading({
          title: '登录中',
      });
      var that = this;
      app.getUserInfo(function(){
        that.doCheckLogin();
        wx.hideLoading();
      });
  },
  toEvaulate:function(){
      this.redirectUrl("./company/search");
  },
  toSuggest:function(){
      this.redirectUrl("./my/suggestcompany");
  },
  toCertification:function(){
      this.redirectUrl("./my/certification");
  },
  toSurvey:function(){
      this.redirectUrl("./survey/create");
  },
  toRoadShow:function(){
      this.redirectUrl("./roadshow/create");
  },
  toJoin:function(){
      this.redirectUrl("./my/join");
  },
  toAddition:function(){
      this.redirectUrl("./my/addition");
  },
  bindMobile:function(){
    //   this.redirectUrl("./my/bindMobile");
      wx.navigateTo({
          url: './my/bindmobile'
      })
  },
  redirectUrl:function(url){
      app.checkLogin(function(){
          wx.navigateTo({
              url: url
          })
      });
  },
  logout:function(){
      var that = this;
      wx.showModal({
          title: '提示',
          content: '您确认要退出登录吗？',
          success: function (res) {
              if (res.confirm) {
                  app.globalData.userInfo = false;
                  that.setData({
                      userInfo: false
                  });
              }
          }
      })
    
  }
})