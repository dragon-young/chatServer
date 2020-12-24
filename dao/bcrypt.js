var bcrtpt = require('bcryptjs')

// 生成 hash 密码

exports.encryption = function(e) {
    let salt = bcrtpt.genSaltSync(10)
    let hash = bcrtpt.hashSync(e, salt)
    return hash
}

// 解密
exports.verification = function(e, hash) {
    let verif = bcrtpt.compareSync(e, hash);
    return verif;
}