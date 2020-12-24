var dbserer = require('../dao/dbserver')

// 详情
exports.userDetial = function(req, res) {
    let id = req.body.id
    dbserer.userDetial(id, res)
}

// 修改好友昵称
exports.userUpdate = function(req, res) {
    let data = req.body
   dbserer.userUpate(data, res)
}

// 修改好友昵称
exports.friendMarkName = function(req, res) {
    let data = req.body;
    dbserer.friendMarkName(data, res)
}

// 获取好友昵称
exports.getMarkName = function(req, res) {
    let data = req.body;
    dbserer.getMarkName(data, res);
}