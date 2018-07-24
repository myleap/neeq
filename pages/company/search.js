var common = require("../../js/common.js");
var app= getApp();
Page({
    data: {
        inputShowed: true,
        inputVal: "",
        companys:[],
        createpage:"create"
    },
    onLoad:function(options){
        if(options.type=='detail'){
            this.setData({
                type:"detail"
            });
        }else{
            this.setData({
                type: "evaluate"
            });
            if (app.globalData.userInfo.type == 0) {
                this.setData({ createpage: "normalusercreate" });
            }
        }
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        var that=this;
        var type =0;
        if (this.data.type =="evaluate"){
            type=1;
        }
        common.dataAccess("?g=portal&m=company&a=searchCompany", { keywords: e.detail.value,type:type}, function (res) {

            if (res.data.resCode == '200') {
                console.log(res.data.companys);
                that.setData({
                    companys: res.data.companys
                });
            }
        });
        this.setData({
            inputVal: e.detail.value
        });
    }
});