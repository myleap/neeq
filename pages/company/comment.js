// comment.js
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
        var compid = options.id;
        this.setData({
            compid: compid
        });
    },
    bindFormSubmit: function (e) {
        var text = e.detail.value.text;
        var that = this;
        common.dataAccess("?g=portal&m=company&a=createComments", { text: text, compid: this.data.compid, uid: app.globalData.userInfo.id }, function (res) {
            if (res.data.resCode == '200') {

                wx.navigateBack({

                });
            } else {
                wx.showToast({
                    title: '提交失败',
                    image: "../../images/error.png"
                });
            }
        });
    }
})