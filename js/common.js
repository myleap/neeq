var ajax_url = "https://www.myleap.cn/neeqAdmin/index.php";

// var ajax_url = "http://localhost/index.php";
// var download_url ="http://localhost/data/upload/";
var download_url = "https://www.myleap.cn/neeqAdmin/data/upload/";
function dataAccess(url, data, success) {
    var ul = ajax_url + url;
    if (url.indexOf('http') == 0) {
        ul = url;
    }
    wx.request({
        url: ul,
        method: "POST",
        data: data,
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
            success(res);
        },
        fail: function (res) {
            wx.hideLoading();
            wx.showToast({
                title: '服务器访问失败',
                image: "../images/networkerror.png"
            })
        }
    });
}

function uploadFile(filePath, success) {
    wx.uploadFile({
        url: ajax_url + "?g=portal&m=file&a=upload", //仅为示例，非真实的接口地址
        filePath: filePath,
        name: 'file',
        formData: {
            type: "auth"
        },

        success: function (res) {
            success(JSON.parse(res.data));
        }
    })
}
function openFile(path) {
    var ul = download_url + path;
    if (path.indexOf('http') == 0) {
        ul = path;
    }
    wx.downloadFile({
        url: ul,
        success: function (res) {
            var filePath = res.tempFilePath
            wx.openDocument({
                filePath: filePath,
                success: function (res) {
                    wx.hideLoading();
                }
            })
        }
    });
}
module.exports.dataAccess = dataAccess;
module.exports.uploadFile = uploadFile;
module.exports.openFile = openFile;