var common = require("../js/common.js");
var app = getApp();
Page({
    data: {
        tabs: ["路演", "调研"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        roadshows: [],
        currentPage: 1
    },
    onLoad: function () {
        var res = wx.getSystemInfoSync();
        var ht = (res.screenWidth) * 9 / 16;
        this.setData({
            ht: ht,
            barwidth: res.screenWidth / 2 - 30,
            scrollheight: app.globalData.tabbarWinHeight - 46
        });
        this.queryRoadShow();
    },
    querySurvey: function () {
        var that = this;
        this.setData({
            loading: true
        });
        wx.showLoading({
            title: '加载中',
        });
        var uid = -1;
        if (app.globalData.userInfo) {
            uid = app.globalData.userInfo.id;
        }
        common.dataAccess("?g=portal&m=survey&a=getList", { page: that.data.currentPage, uid: uid }, function (res) {
            if (res.data.resCode == '200') {
                if (res.data.surveys && res.data.surveys.length > 0) {
                    if (that.data.currentPage == 1) {
                        that.setData({
                            surveys: res.data.surveys
                        });

                    } else {
                        that.setData({
                            surveys: that.data.surveys.concat(res.data.surveys)
                        });
                    }

                } else {
                    that.setData({
                        showmore: false
                    });
                }
            }
            wx.hideLoading();
            that.setData({ loading: false });
        });
    },
    queryRoadShow: function () {
        var that = this;
        this.setData({
            loading: true
        });
        wx.showLoading({
            title: '加载中',
        });
        var uid = -1;
        if (app.globalData.userInfo) {
            uid = app.globalData.userInfo.id;
        }
        common.dataAccess("?g=portal&m=RoadShow&a=getList", { page: that.data.currentPage, uid: uid }, function (res) {
            if (res.data.resCode == '200') {
                if (res.data.roadshows && res.data.roadshows.length > 0) {
                    if (that.data.currentPage == 1) {
                        that.setData({
                            roadshows: res.data.roadshows
                        });

                    } else {
                        that.setData({
                            roadshows: that.data.roadshows.concat(res.data.roadshows)
                        });
                    }

                } else {
                    that.setData({
                        showmore: false
                    });
                }
            }
            wx.hideLoading();
            that.setData({ loading: false });
        });
    },
    joinSurvey: function (e) {
        var that = this;
        app.checkLogin(function () {
            if (app.globalData.userInfo.user_status == 3) {
                var id = e.currentTarget.id;
                var surid = that.data.surveys[id].id;
                var data = {};
                data.uid = app.globalData.userInfo.id;
                data.surid = surid;
                wx.showLoading({
                    title: '提交中',
                });
                common.dataAccess("?g=portal&m=survey&a=join", data, function (res) {
                    if (res.data.resCode == '200') {
                        var surveys = that.data.surveys;
                        surveys[id].canjoin = 2;
                        that.setData({
                            surveys: surveys
                        });
                        wx.showModal({
                            title: '提示',
                            content: '感谢您的报名，请留意我们的短信回执，按时参加，谢谢！',
                            showCancel: false
                        });
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
    joinRoadshow: function (e) {
        var that = this;
        app.checkLogin(function () {
            if (app.globalData.userInfo.user_status == 3) {
                var id = e.currentTarget.id;
                var rdid = that.data.roadshows[id].id;
                var data = {};
                data.uid = app.globalData.userInfo.id;
                data.rdid = rdid;
                wx.showLoading({
                    title: '提交中',
                });
                common.dataAccess("?g=portal&m=RoadShow&a=join", data, function (res) {
                    if (res.data.resCode == '200') {
                        var roadshows = that.data.roadshows;
                        roadshows[id].canjoin = 2;
                        that.setData({
                            roadshows: roadshows
                        });
                        wx.showModal({
                            title: '提示',
                            content: '感谢您的报名，请留意我们的短信回执，按时参加，谢谢！',
                            showCancel: false
                        });
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
    onShow: function () {
        var secondIndex = app.globalData.secondIndex;
        if (secondIndex) {
            this.setData({
                activeIndex: secondIndex
            });
        }
        app.globalData.secondIndex = false;
        if (this.data.activeIndex == 0) {
            this.queryRoadShow();
        } else if (this.data.activeIndex == 1) {
            this.querySurvey();
        }
    },
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    changeEvent: function (e) {
        this.setData({
            activeIndex: e.detail.current
        });
        this.setData({
            currentPage: 1,
            showmore: true
        });

        if (this.data.activeIndex == 0) {
            this.queryRoadShow();
        } else if (this.data.activeIndex == 1) {
            this.querySurvey();
        }
    },
    loadMoreRoadshows: function () {
        this.setData({
            currentPage: parseInt(this.data.currentPage) + 1
        });
        this.queryRoadShow();
    },
    loadMoreSurveys: function () {
        this.setData({
            currentPage: parseInt(this.data.currentPage) + 1
        });
        this.querySurvey();
    }

});