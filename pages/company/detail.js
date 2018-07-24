// detail.js
var common = require("../../js/common");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mW: 200,
        mH: 200,
        currentPage: 1,
        mColorPolygon: "#B8B8B8",
        mColorLines: "#B8B8B8",
        mColorText: "#000000",
        pointdisplay: "none",
        activeIndex: 0,
        tabs: [{
            url: "../../images/pingjia.png",
            urlselect: "../../images/pingjias.png"
        }, {
            url: "../../images/baogao.png",
            urlselect: "../../images/baogaos.png"
        }, {
            url: "../../images/dz.png",
            urlselect: "../../images/dzs.png"
        }],
        navbarPosition: "relative",
        comments: [],
        commentareadisplay: false,
        loadMore: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var res = wx.getSystemInfoSync();
        var compid = options.id;


        this.setData({
            bgHeight: res.screenWidth * 9 / 28,
            winHeight: res.windowHeight,
            barwidth: res.screenWidth / 3,
            mCenter: (res.screenWidth) / 2,
            myCenter: 100,
            compid: compid
        });
        this.queryDetail();

    },
    onShow: function () {
        this.queryComments();
    },
    loadMoreAdditions: function () {
        if (this.data.loading || !this.data.showmore) {
            return;
        }
        this.setData({
            currentPage: this.data.currentPage + 1
        });
        this.queryAdditions();
    },
    queryReports: function () {
        var that = this;
        this.setData({
            loading: true
        });
        wx.showLoading({
            title: '加载中',
        });
        common.dataAccess("?g=portal&m=evaluate&a=queryReport", { page: that.data.currentPage, code: this.data.detail.code }, function (res) {
            if (res.data.resCode == '200') {
                if (res.data.reports && res.data.reports.length > 0) {
                    if (that.data.currentPage == 1) {
                        that.setData({
                            reports: res.data.reports,
                            evaluatescrolltop: 0
                        });

                    } else {
                        that.setData({
                            reports: that.data.reports.concat(res.data.reports)
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
    openFile: function (e) {
        var that = this;
        app.checkLogin(function () {
            if (app.globalData.userInfo.user_status == 3) {
                wx.showLoading({
                    title: '下载中',
                })
                common.openFile(e.currentTarget.id);
            } else {
                wx.showModal({
                    title: '提示',
                    content: '您还没有进行实名认证，或者您的实名认证还未通过!',
                    showCancel: false
                })
            }

        });
    },
    queryAdditions: function (e) {
        var that = this;
        this.setData({
            loading: true
        });
        wx.showLoading({
            title: '加载中',
        });
        common.dataAccess("?g=portal&m=company&a=queryAddition", {uid:app.globalData.userInfo.id, page: that.data.currentPage, code: this.data.detail.code }, function (res) {
            if (res.data.resCode == '200') {
                if (res.data.additions && res.data.additions.length > 0) {
                    if (that.data.currentPage == 1) {
                        that.setData({
                            additions: res.data.additions
                        });

                    } else {
                        that.setData({
                            additions: that.data.additions.concat(res.data.additions)
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
    loadMoreReports: function () {
        if (this.data.loading || !this.data.showmore) {
            return;
        }
        this.setData({
            currentPage: this.data.currentPage + 1
        });
        this.queryReports();
    },
    tabClick: function (e) {
        this.setData({ scroll: 0 });
        var currentid = e.currentTarget.id;
        this.setData({
            activeIndex: currentid
        });

        if (currentid == 1) {
            this.setData({
                currentPage: 1,
                showmore: true
            });
            this.queryReports();
        }
        if (currentid == 2) {
            this.setData({
                currentPage: 1,
                showmore: true
            });
            this.queryAdditions();
        }

    },
    queryDetail: function () {
        var that = this;
        common.dataAccess("?g=portal&m=company&a=detail", { id: this.data.compid }, function (res) {
            if (res.data.resCode == '200') {
                wx.setNavigationBarTitle({
                    title: res.data.company.name + "(" + res.data.company.code + ")"
                })
                that.setData({
                    detail: res.data.company
                });
            }
        });
    },
    queryComments: function () {
        var that = this;
        common.dataAccess("?g=portal&m=company&a=getComments", { page: this.data.currentPage, compid: this.data.compid }, function (res) {
            if (res.data.resCode == '200') {
                if (res.data.comments && res.data.comments.length > 0) {
                    if (that.data.currentPage == 1) {
                        that.setData({
                            comments: res.data.comments
                        });
                    } else {
                        that.setData({
                            comments: that.data.comments.concat(res.data.comments)
                        });
                    }
                } else {
                    that.setData({
                        loadMore: false
                    });
                }
            }
        });
    },
    toCommentsPage: function () {
        this.setData({
            commentareadisplay: true,
            focus: true
        });
    },
    bindFormSubmit: function (e) {
        if (this.data.commiting) {
            return;
        }
        var text = e.detail.value.text;
        var that = this;
        wx.showLoading({
            title: '提交中',
        });
        this.setData({
            commiting: true
        });
        common.dataAccess("?g=portal&m=company&a=createComments", { text: text, compid: this.data.compid, uid: app.globalData.userInfo.id }, function (res) {
            wx.hideLoading();
            that.setData({
                commiting: false
            });
            if (res.data.resCode == '200') {
                that.setData({
                    commentareadisplay: false,
                    focus: false
                });
                that.queryComments();
            } else {
                wx.showToast({
                    title: '提交失败',
                    image: "../../images/error.png"
                });
            }

        });
    },
    loadMoreComments: function () {
        this.setData({
            currentPage: this.data.currentPage + 1
        });
        this.queryComments();
    },
    blurEvent: function () {
        this.setData({
            commentareadisplay: false,
            focus: false
        });
    },
    toEvaluateP: function () {
        var createpage = "create";
        if (app.globalData.userInfo.type == 0) {
            createpage = "normalusercreate";
        }
        wx.navigateTo({
            url: '../evaluate/' + createpage + '?code=' + this.data.detail.code + '&name=' + this.data.detail.name
        })

    }

})