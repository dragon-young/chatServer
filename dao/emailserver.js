// 引用发送邮件插件
var nodemailer = require('nodemailer')

// 引入证书文件
var credentials = require('../config/credetials')

// 创建传输方式
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: credentials.qq.user,
        pass: credentials.qq.pass
    }
})

// 注册发送邮件给用户
exports.emailSignUp = function(email, res) {
    // 发送信息
    let options = {
        from: '1413846573@qq.com',
        to: email,
        subject: '感谢你在dragonYoung的注册',
        html: '<span>dragonYoung的聊天室欢迎你加入</span><a href="http://169.254.170.10:8081/#/pages/login/login">点击加入</a>'
    };
    // 发送邮箱
    transporter.sendMail(options, function(err, msg){
        if (err) {
            res.send('邮箱发送失败')
            console.log(err)
        } else {
            res.send('邮箱发送成功')
        }
    })
}