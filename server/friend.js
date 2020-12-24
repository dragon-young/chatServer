var dbserer = require('../dao/dbserver')

// 好友申请
exports.applyFriend = function(req, res) {
    let data = req.body;
    dbserer.applyFriend(data, res)
}

// 更新好友状态
exports.updateFriendState = function(req, res) {
    let data = req.body;
    dbserer.updateFriendState(data, res);
}

// 拒绝好友或删除好友
exports.deleteFriend = function(req, res) {
    let data = req.body;
    dbserer.deleteFriend(data, res)
}

