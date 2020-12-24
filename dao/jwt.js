var jwt = require('jsonwebtoken')
var secret = "dragonYoung"
// 生成token

exports.generateToken = function(e) {
    let payload = {
        id: e,
        time: new Date()
    }
    
    let token = jwt.sign(payload, secret, {
        expiresIn: 60*60*24*120
    })
    return token
}

// 解码token
exports.verifyToken = function(e) {
    var payload;
    jwt.verify(e, secret, function(err, result){
        if (err) {
            payload = 0;
            // console.log('拿到写得有问题？')
        } else {
            payload = 1;
        }
    })
    return payload
}