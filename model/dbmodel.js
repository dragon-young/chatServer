var mongoose = require('mongoose')
var db = require('../config/db')

var Schema = mongoose.Schema;

// 用户表
var UserSchema = new Schema({
    name: {     // 用户名
        type: String
    },          // 密码
    psw: {
        type: String
    },          // 邮箱
    email: {
        type: String
    },          // 性别
    sex: {
        type: String,
        default: 'asexual'
    },          // 生日
    birthday: {
        type: Date
    },          // 电话
    explain: {
        type: String
    },
    imgurl: {
        type: String,
        default: 'user.png'
    },          
    time: {
        type: Date
    }
});

// 好友表
var FriendSchema = new Schema({
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },       
    // 好友id   
    friendID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    markname: {
        type: String
    },
    // 好友状态
    state: {
        type: String
    },
    // 生成时间
    time: {
        type: Date
    },
    // 最后通讯时间 
    lastTime: {
        type: Date
    }
});

// 一对一消息表
var MessageSchema = new Schema({
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 好友id
    friendID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 内容
    message: {
        type: String
    },
    // 内容类型
    types: {
        type: String
    },
    // 发送时间
    time: {
        type: Date
    },
    // 消息状态
    state: {
        type: Number
    }
});

// 群表
var GroupSchema = new Schema({
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 群名称
    name: {
        type: String
    },
    // 群头像
    imgUrl: {
        type: String,
        default: 'group.png'
    },
    // 创建时间
    time: {
        type: Date
    },
    // 公告
    notice: {
        type: String
    }
})

// 群成员表
var GroupUserSchema = new Schema({
    // 群id
    groupID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 发送时间
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 群内名称
    name: {
        type: String
    },
    // 未读消息数
    tip: {
        type: String
    },
    // 加入时间
    time: {
        type: Date
    },
    // 最后的通讯时间
    lastTime: {
        type: Date
    },
    // 是否屏蔽群消息 0 -- 不屏蔽， 1 -- 屏蔽
    shield: {
        type: Number
    }
})

// 群消息数
var GroupMsgSchema = new Schema({
    groupID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 内容
    message: {
        type: String
    },
    // 内容类型
    types: {
        type: String
    },
    // 发送时间
    time: {
        type: Date
    }
})


module.exports = db.model('User', UserSchema)
module.exports = db.model('Friend', FriendSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupUser', GroupUserSchema)
module.exports = db.model('GroupMsg', GroupMsgSchema)

