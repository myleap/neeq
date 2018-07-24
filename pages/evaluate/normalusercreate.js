var common = require("../../js/common.js");
var app = getApp()
Page({
    data: {
        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        indicators: [

        ],
    },
    onLoad: function (options) {
        var code = options.code;
        var name = options.name;
        this.setData({
            code: options.code,
            name: options.name
        });
        var userType = app.globalData.userInfo.type;
        this.setData({
            userType: userType
        });
        var that = this;
        common.dataAccess("?g=portal&m=evaluate&a=evaluateItem", { uid: app.globalData.userInfo.id }, function (res) {

            if (res.data.resCode == '200') {
                console.log(res.data.evaluates);
                that.setData({
                    indicators: res.data.evaluates
                });
            }
        });

    },
    //点击左边,半颗星
    selectLeft: function (e) {
        var key = e.currentTarget.dataset.key;
        var id = e.currentTarget.dataset.id;
        if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key = 0;
        }
        this.data["indicators"][id]["key"] = key;
        this.setData({
            indicators: this.data["indicators"]
        });
    },
    //点击右边,整颗星
    selectRight: function (e) {
        var key = e.currentTarget.dataset.key;
        var id = e.currentTarget.dataset.id;
        this.data["indicators"][id]["key"] = key;
        this.setData({
            indicators: this.data["indicators"]
        });
    },
    submitEvaluate:function(){
        var code = this.data.code;
        var uid = app.globalData.userInfo.id;
        var that = this;
        
        common.dataAccess("?g=portal&m=evaluate&a=doEvaluate", { uid: uid, compid: code, indicators:JSON.stringify(that.data.indicators) }, function (res) {
            if (res.data.resCode == '200') {
                wx.hideLoading();
                wx.redirectTo({
                    url: '../util/success?msg=您对'+that.data.name+"的评分为"+res.data.score+"(总分100分)"
                });
            }else{
                wx.showModal({
                    title: '提示',
                    showCancel:false,
                    content: res.data.info,
                    success: function (res) {
                       
                    }
                })
                wx.hideLoading();
            }
        });
        wx.showLoading({
            title: '加载中',
        })
    }
})
