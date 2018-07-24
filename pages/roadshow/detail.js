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
            rdid: id
        })
        this.queryRoadShow(id);
    },
    queryRoadShow: function (id) {
        wx.showLoading();
        var that = this;
        var data = {};
        data.id = id;
        if (app.globalData.userInfo) {
            data.uid = app.globalData.userInfo.id;
        }
        common.dataAccess("?g=portal&m=RoadShow&a=detail", data, function (res) {
            if (res.data.resCode == '200') {
                var roadshow = res.data.roadshow;
                roadshow.lyqy = JSON.parse(roadshow.lyqy);
                roadshow.jbjs = JSON.parse(roadshow.jbjs);
                that.setData({
                    roadshow: roadshow
                });
            }
            wx.hideLoading();
        });
    },
    joinRoadshow: function () {
        var that = this;
        app.checkLogin(function () {
            if (app.globalData.userInfo.user_status == 3) {
                var rdid = this.data.rdid;
                var data = {};
                data.uid = app.globalData.userInfo.id;
                data.rdid = rdid;
                wx.showLoading({
                    title: '提交中',
                });
                common.dataAccess("?g=portal&m=RoadShow&a=join", data, function (res) {
                    if (res.data.resCode == '200') {
                        wx.showModal({
                            title: '提示',
                            content: '感谢您的报名，请留意我们的短信回执，按时参加，谢谢！',
                            showCancel: false
                        });
                        var roadshow = that.data.roadshow;
                        roadshow.canjoin = 2;
                        that.setData({
                            roadshow: roadshow
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
    }
})