var dbserer = require('../dao/dbserver')

var email = require('../dao/emailserver')

// 用户注册
exports.register = function(req, res) {
    let name = req.body.name
    let mail = req.body.mail
    let pwd = req.body.pwd
    // res.send({name, mail, pwd})
    email.emailSignUp(mail, res)

    dbserer.buildUser(name, mail, pwd, res);
}

// 用户或游戏哪个是否被占用判断
exports.judgeValue = function(req, res) {
    let data = req.body.data;
    let type = req.body.type;
    // res.send({data, type})
    dbserer.countUserValue(data, type, res)
}

