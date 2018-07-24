// detail.js
var common = require("../../js/common");
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
        var id = options.id;
        this.setData({
            id: id
        });
        this.querySurvey(id);
    },
    querySurvey: function (id) {
        wx.showLoading();
        var that = this;
        var data = {};
        data.id = id;
        if (app.globalData.userInfo) {
            data.uid = app.globalData.userInfo.id;
        }
        common.dataAccess("?g=portal&m=survey&a=detail", data, function (res) {
            if (res.data.resCode == '200') {
                var survey = res.data.survey;
                that.setData({
                    survey: survey
                });
            }
            wx.hideLoading();
        });
    },
    joinSurvey: function () {
        var that = this;
        app.checkLogin(function () {
            if (app.globalData.userInfo.user_status == 3) {
                var surid = this.data.id;
                var data = {};
                data.uid = app.globalData.userInfo.id;
                data.surid = surid;
                wx.showLoading({
                    title: '提交中',
                });
                common.dataAccess("?g=portal&m=survey&a=join", data, function (res) {
                    if (res.data.resCode == '200') {

                        wx.showModal({
                            title: '提示',
                            content: '感谢您的报名，请留意我们的短信回执，按时参加，谢谢！',
                            showCancel: false
                        });
                        var survey = that.data.survey;
                        survey.canjoin = 2;
                        that.setData({
                            survey: survey
                        })
                    } else {
                        wx.showToast({
                            title: '提交失败',
                            image: "../../images/error.png"
                        });
                    }
                    wx.hideLoading();
                });
            } else {
                wx.showModal({
                    title: '提示',
                    content: '您还没有进行实名认证，或者您的实名认证还未通过!',
                    showCancel: false
                })
            }

        });
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