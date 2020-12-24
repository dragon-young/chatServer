var dbserer = require('../dao/dbserver')

// var jwt = require('../dao/jwt')

// 登陆
exports.signIn = function(req, res) {
    let data = req.body.data
    let pwd = req.body.pwd
    // console.log(data)
    // console.log(pwd)
    dbserer.userMatch(data, pwd, res)
}

// token 测试
// exports.test = function(req, res) {
//     var token = req.body.token
//     var jg = jwt.verifyToken(token)
//     res.send(jg)
// }