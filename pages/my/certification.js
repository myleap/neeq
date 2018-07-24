const common = require("../../js/common");
var app = getApp();
// certification.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        zjtype: ["监管机构", "上市公司", "券商", "银行", "保险", "公募基金", "新三板", "私募基金", "财务公司", "其他金融人士"],
        zjtypeIndex: 0,
        fileinputDisplay: "block"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '实名认证'
        })
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

    },
    bindTypeChange: function (e) {
        this.setData({
            zjtypeIndex: e.detail.value
        })
    },
    chooseImage: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    file: res.tempFilePaths[0],
                    fileinputDisplay: "none"
                });

            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: this.data.file, // 当前显示图片的http链接
            urls: [this.data.file] // 需要预览的图片http链接列表
        })
    },
    removeFile: function (e) {
        this.setData({
            file: false
        });
        this.setData({
            fileinputDisplay: "block"
        });
    },
    submitAuth: function (e) {
        var auth = e.detail.value;

        if (!auth.name || auth.name == "") {
            this.errorShow("姓名必填");
            return;
        }
        if (!auth.company || auth.company == "") {
            this.errorShow("公司信息必填");
            return;
        }
        if (!auth.job || auth.job == "") {
            this.errorShow("职业信息必填");
            return;
        }
        if (!auth.mobile || auth.mobile == "") {
            this.errorShow("联系方式必填");
            return;
        }
        if (!auth.code || auth.code == "") {
            this.errorShow("验证码必填");
            return;
        }
        if (!this.data.file || this.data.file == '') {
            this.errorShow("您必须上传您的名片");
            return;
        }
        this.setData({
            errorInfo: false
        });
        var that = this;
        wx.showLoading({
            title: '正在上传图片',
        })
        that.modifyMobile(auth.mobile, auth.code, function () {
            common.uploadFile(that.data.file, function (res) {
                if (res.resCode == "200") {
                    wx.showLoading({
                        title: '正在提交',
                    })
                    common.dataAccess("?g=portal&m=user&a=doAuth",
                        {
                            uid: app.globalData.userInfo.id,
                            name: auth.name,
                            company: auth.company,
                            job: auth.job,
                            mobile: auth.mobile,
                            type: parseInt(that.data.zjtypeIndex) + 1,
                            image: res.objects[0].filepath
                        },
                        function (res) {
                            if (res.data.resCode == 200) {
                                app.globalData.userInfo.user_status = 2;

                                wx.redirectTo({
                                    url: '../util/success?msg=提交成功，我们将尽快进行审核。'
                                });

                            } else {
                                wx.showToast({
                                    title: '提交失败,请稍候再重试',
                                })
                                wx.hideLoading();
                            }
                        }
                    );

                } else {
                    wx.showToast({
                        title: '提交失败,请稍候再重试',
                    })
                    wx.hideLoading();
                }

            });
        });

    },
    errorShow: function (txt) {
        this.setData({
            errorInfo: txt
        });
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        });
    },
    sendMobile: function () {

        var that = this;
        if (!this.data.inputValue || this.data.inputValue == '') {
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel: false
            })
            return;
        }
        common.dataAccess("https://www.myleap.cn/myleapAdmin/index.php/v1/mobileVerify/sendRegiest",
            {
                mobile: that.data.inputValue
            },
            function (res) {
                if (res.data.resCode == 200) {
                    wx.showToast({
                        title: '发送验证码成功！',
                    });
                    app.globalData.sendMobileTime = new Date().getTime();
                } else {
                    wx.showToast({
                        title: '验证码发送过于频繁',
                    })
                }
            }
        );
    },
    modifyMobile: function (mobile, code, callback) {

        common.dataAccess("https://www.myleap.cn/myleapAdmin/index.php/v1/mobileVerify/checkVerify",
            {
                mobile: mobile,
                type: 2,
                code: code
            },
            function (res) {
                if (res.data.resCode == 200) {
                    common.dataAccess("?g=portal&m=user&a=modifyMobile",
                        {
                            uid: app.globalData.userInfo.id,
                            mobile: mobile
                        },
                        function (res1) {
                            if (res1.data.resCode == 200) {
                                app.globalData.userInfo.mobile = mobile;

                                callback();
                            } else {
                                wx.showToast({
                                    title: '提交失败,请稍候再重试',
                                })
                                wx.hideLoading();
                            }

                        }
                    );
                } else {
                    wx.showToast({
                        title: '验证码错误',
                    })
                    wx.hideLoading();
                }

            }
        );
    }
})