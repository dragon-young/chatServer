var dbserver = require('../dao/dbserver')

exports.getFriend = function(req, res) {
    let uid = req.body.uid;
    let state = req.body.state;
    dbserver.getUsers(uid, state, res)
}

exports.getLastMsg = function(req, res) {
    let data = req.body;
    dbserver.getOneMsg(data, res)
}

// 未读消息数
exports.unreadMsg = function(req, res) {
    let data = req.body;
    dbserver.unreadMsg(data, res)
}

// 一对一消息已读
exports.updateMsg = function(req, res) {
    let data = req.body;
    dbserver.updateMsg(data, res)
}
