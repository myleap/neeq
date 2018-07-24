var common = require("../js/common.js");
var app = getApp();
Page({
    data: {
        tabs: [{
            url: "../images/pingjia.png",
            urlselect: "../images/pingjias.png"
        }, {
            url: "../images/baogao.png",
            urlselect: "../images/baogaos.png"
        }, {
            url: "../images/dz.png",
            urlselect: "../images/dzs.png"
        }],
        activeIndex: 0,
        activeSortIndex:0,
        sliderOffset: 0,
        sliderLeft: 0,
        companys: [

        ],
        evaluatescrolltop: 0,
        showmore: true,
        additions: [

        ],
        sort:"lastupdatetime"
    },
    sortTabClick: function (e) {
        var id = e.currentTarget.id;
        this.setData({ activeSortIndex: id, currentPage:1 });
        if (id == 0) {
            this.setData({
                sort:"lastupdatetime"
            });
            this.queryCompanys();
        } else if (id == 1) {
            this.setData({
                sort: "category2"
            });
            this.queryCompanys();
        } else if (id == 2) {
            this.setData({
                sort: "category3"
            });
            this.queryCompanys();
        } else if (id == 3) {
            this.setData({
                sort: "category6"
            });
            this.queryCompanys();
        }

    },
    onLoad: function () {
        var res = wx.getSystemInfoSync();
        var ht = (res.screenWidth) * 9 / 16;
        this.setData({
            ht: ht,
            barwidth: res.screenWidth / 3,
            scrollheight: app.globalData.tabbarWinHeight - 48 - 90
        });
        
        this.setData({
            currentPage: 1
        });
        this.queryCompanys();

    },
    onShow: function () {
        var firstIndex = app.globalData.firstIndex;
        if (firstIndex) {
            this.setData({
                activeIndex: firstIndex
            });
            if (firstIndex == 0) {
                this.setData({
                    currentPage: 1,
                    showmore: true
                });
                this.queryCompanys();
            }
            if (firstIndex == 1) {
                this.setData({
                    currentPage: 1,
                    showmore: true
                });
                this.queryReports();
            }
            if (firstIndex == 2) {
                this.setData({
                    currentPage: 1,
                    showmore: true
                });
                this.queryAdditions();
            }

        }
        app.globalData.firstIndex = false;
    },
    tabClick: function (e) {

        this.setData({
            activeIndex: e.currentTarget.id
        });


    },
    toCom: function (e) {
        var index = e.currentTarget.id;
        var id = this.data.companys[index].id;
        app.checkLogin(function () {
            wx.navigateTo({
                url: '../pages/company/detail?id=' + id,
            });
        });
    },
    scrolltobottom: function (e) {
        console.log(e);
    },
    changeEvent: function (e) {
        this.setData({
            activeIndex: e.detail.current
        });
        if (e.detail.current == 0) {
            this.setData({
                currentPage: 1,
                showmore: true
            });
            this.queryCompanys();
        }
        if (e.detail.current == 1) {
            this.setData({
                currentPage: 1,
                showmore: true
            });
            this.queryReports();
        }
        if (e.detail.current == 2) {
            this.setData({
                currentPage: 1,
                showmore: true
            });
            this.queryAdditions();
        }

    },
    queryCompanys: function () {
        var that = this;
        this.setData({
            loading: true
        });
        wx.showLoading({
            title: '加载中',
        });
        common.dataAccess("?g=portal&m=company&a=sortCompanys", { page: that.data.currentPage,sort:that.data.sort}, function (res) {
            if (res.data.resCode == '200') {
                if (res.data.companys && res.data.companys.length > 0) {
                    if (that.data.currentPage == 1) {
                        that.setData({
                            companys: res.data.companys,
                            evaluatescrolltop: 0
                        });

                    } else {
                        that.setData({
                            companys: that.data.companys.concat(res.data.companys)
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
    loadMoreCompanys: function () {
        if (this.data.loading || !this.data.showmore) {
            return;
        }
        this.setData({
            currentPage: this.data.currentPage + 1
        });
        this.queryCompanys();
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
    loadMoreReports: function () {
        if (this.data.loading || !this.data.showmore) {
            return;
        }
        this.setData({
            currentPage: this.data.currentPage + 1
        });
        this.queryReports();
    },
    queryReports: function () {
        var that = this;
        this.setData({
            loading: true
        });
        wx.showLoading({
            title: '加载中',
        });
        common.dataAccess("?g=portal&m=evaluate&a=queryReport", { page: that.data.currentPage }, function (res) {
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
                });
            }
        });

    },
    joinAddition: function (e) {
        var that = this;
        app.checkLogin(function () {
            if (app.globalData.userInfo.user_status == 3) {
                var id = e.currentTarget.id;
                var addid = that.data.additions[id].id;
                var data = {};
                data.uid = app.globalData.userInfo.id;
                data.addid = addid;
                wx.showLoading({
                    title: '提交中',
                });
                common.dataAccess("?g=portal&m=company&a=joinAddition", data, function (res) {
                    if (res.data.resCode == '200') {
                        var additions = that.data.additions;
                        additions[id].isjoin = 1;
                        that.setData({
                            additions: additions
                        });
                        wx.showModal({
                            title: '提示',
                            content: '感谢您关注' + that.data.additions[id].name + '公司定增，我们会尽快同您联系！',
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
    queryAdditions: function (e) {
        var that = this;
        this.setData({
            loading: true
        });
        wx.showLoading({
            title: '加载中',
        });
        var data = {};
        data.page = that.data.currentPage;
        if (app.globalData.userInfo) {
            data.uid = app.globalData.userInfo.id
        }
        common.dataAccess("?g=portal&m=company&a=queryAddition", data, function (res) {
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
    }
});