var bcrypt = require('../dao/bcrypt')

// 引入token
var jwt = require('../dao/jwt');
const { find } = require('../model/dbmodel');

var dbModel = require('../model/dbmodel')

var User = dbModel.model('User');

var Friend = dbModel.model('Friend')

var Group = dbModel.model('Group')

var GroupUser = dbModel.model('GroupUser')

var Message = dbModel.model('Message')

// 新建用户
exports.buildUser = function(name, mail, pwd, res) {
    // 密码加密
    let password = bcrypt.encryption(pwd)
    let data = {
        name: name,
        email: mail,
        psw: password,
        time: new Date()
    }
    let user = new User(data)
    user.save(function(err, result) {
        if (err) {
            res.send({status:500});
        } else {
            res.send({status:200})
        }
    })
}

// 匹配用户表元素个数
exports.countUserValue = function(data, type, res) {
    let wherestr = {}
    wherestr[type] = data

    User.countDocuments(wherestr, function(err, result) {
        if (err) {
            res.send({status: 500})
        } else {
            res.send({status: 200, result})
        }
    })
}

// 用户验证
exports.userMatch = function(data, pwd, res) {
    let wherestr = {
        $or: [
            {
                'name': data
            },
            {
                'email': data
            }
        ]
    }
    let out = {'name': 1, 'imgurl': 1, 'psw': 1}
    User.find(wherestr, out, function(err, result){
        if(err) {
            res.send({status:500})
        } else {
            if (result == '') {
                console.log("哪里错了")
                res.send({status: 400})
            }
            result.map(function(e) {
                const pwdMatch = bcrypt.verification(pwd, e.psw)
                if (pwdMatch) {
                    let token = jwt.generateToken(e._id)
                    let back = {
                        id: e._id,
                        name: e.name,
                        imgurl: e.imgurl,
                        token: token
                    }
                    res.send({status: 200, back})
                } else {
                    res.send({status: 400})
                }
            })
        }
    })
}

// 搜索用户
exports.searchUser = function(data, res) {
    let wherestr;
    if (data == 'dragonYoung') {
        wherestr = {}
    } else {
        wherestr = {
            $or: [
                {
                    'name': {$regex: data}
                },
                {
                    'email': {$regex: data}
                }
            ]
        }
    }
    let out = {
        'name': 1,
        'email': 1,
        'imgurl': 1
    }
    User.find(wherestr, out, function(err, result) {
        if (err) {
            res.send({status: 500})
        } else {
            res.send({status: 200, result})
        }
    })
}

// 判断用户是否为好友
exports.isFriend = function (uid, fid, res) {
    let wherestr = {
        'userID': uid,
        'friendID': fid,
        'state': 0

    }
    Friend.findOne(wherestr, function(err, result){
        if (err) {
            res.send({status:500})
        } else {
            if (result) {
                res.send({status: 200, tip: 1})
            } else {
                res.send({status: 400, tip: 0})
            }
        }
    })
}

// 搜索群
exports.searchGroup = function(data, res){
    let wherestr;
    if (data == 'dragonYoung') {
        wherestr = {}
    } else {
        wherestr = {
            'name': {$regex: data}
        }
    }
    let out = {
        'name': 1,
        'imgurl': 1
    }
    Group.find(wherestr, out, function(err, result) {
        if (err) {
            res.send({status: 500})
        } else {
            res.send({status: 200, result})
        }
    })
}

// 判断是否在群内
exports.isIngroup = function(uid, gid, res) {
    let wherestr = {
        'userID': uid,
        'groupID': gid
    }
    GroupUser.findOne(wherestr, function(err, result){
        if (err) {
            res.send({status:500})
        } else {
            if (result) {
                // 是在群内
                res.send({status: 200})
            } else {
                // 不在群内
                res.send({status: 400})
            }
        }
    }) 
}

// 用户详情
exports.userDetial = function(id, res) {
    let wherestr = { '_id': id }
    let out = { 'psw': 0 }
    User.findOne(wherestr, out, function(err, result){
        if (err) {
            res.send({status:500})
        } else {
            res.send({status:200, result})
        }
    })
}

function update(data, update, res) {
    User.findByIdAndUpdate(data, update, function(err, resu){
        if(err) {
            res.send({status:500, msg: '修改失败'})
        } else {
            res.send({status:200, msg: '修改成功'})
        }
    })
}

// 用户修改
exports.userUpate = function(data, res) {
    let updatestr = {}
    // 判断是否有密码
    if (typeof(data.pwd) != 'undefined') {
        User.find({'_id': data.id}, {'psw': 1 }, function(err, result){
            if(err) {
                res.send({status:500})
            } else {
                if (result == '') {
                    console.log("哪里错了")
                    res.send({status: 400})
                }
                result.map(function(e) {
                    const pwdMatch = bcrypt.verification(data.pwd, e.psw)
                    if (pwdMatch) {
                        // 密码验证成功
                        if (data.type == 'psw') {
                            let password = bcrypt.encryption(data.data)
                            updatestr[data.type] = password
                            update(data.id, updatestr, res)
                        } else {
                            updatestr[data.type] = data.data
                            User.countDocuments(updatestr, function(err, result){
                                if (err) {
                                    res.send({status:500})
                                } else {
                                    if (result == 0) {
                                        console.log("emial修改进来了？")
                                        update(data.id, updatestr, res)
                                    } else {
                                        res.send({status: 300, msg: '邮箱是一样的'})
                                    }
                                }
                            })
                        }
                    } else {
                        res.send({status: 400, msg: '密码错误'})
                    }
                })
            }
        })
    } else if (data.type == 'name') {
        updatestr[data.type] = data.data
        User.countDocuments(updatestr, function(err, result){
            if (err) {
                res.send({status:500})
            } else {
                if (result == 0) {
                    update(data.id, updatestr, res)
                } else {
                    res.send({status:300})
                }
            }
        })
    }
    else {
        // 一般项目修改
        console.log("进来了？？")
        updatestr[data.type] = data.data
        update(data.id, updatestr, res)
    }
}

// 好友昵称的修改
exports.friendMarkName = function(data, res) {
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid
    }
    let updatestr = {
        'markname': data.name
    }
    Friend.updateOne(wherestr, updatestr, function(err, result){
        if(err) {
            res.send({status:500, msg: '昵称修改失败'})
        } else {
            res.send({status:200, msg: '昵称修改成功'})
        }
    })
}

// 获取好友昵称
exports.getMarkName = function(data, res) {
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid
    }
    let out = {
        'markname': 1
    }
    Friend.findOne(wherestr, out, function(err, result){
        if(err) {
            res.send({status:500, msg: '获取昵称失败'})
        } else {
            res.send({status:200, result, msg: '获取昵称成功'})
        }
    })
}

// 好友操作
// 添加好友表
exports.buildFriend = function(uid, fid, state, res) {
    let data = {
        userID: uid,
        friendID: fid,
        state: state,
        time: new Date(),
        lastTime: new Date()
    }
    let friend = new Friend(data)
    friend.save(function(err, result) {
        if (err) {
            console.log('添加好友表出错');
        } else {
            // res.send({status:200})
        }
    })
}

// 好友聊天通讯时间
exports.upFriendLastTime = function(data) {
    let wherestr = {
        $or: [
            {
                'userID': data.uid,
                'friendID': data.fid
            },
            {
                'userID': data.fid,
                'friendID': data.uid
            }
        ]
    }
    let updatestr = {
        'lastTime': new Date()
    }
    Friend.updateMany(wherestr, updatestr, function(err, result){
        if (err) {
            // res.send({status:500});
            console.log('更新好友最后通讯时间出错');
        } else {
            // res.send({status:200});
        }
    })
}

// 添加一对一消息
exports.inserMsg = function(uid, fid, msg, type, res) {
    let data = {
        userID: uid,
        friendID: fid,
        message: msg,
        types: type,
        time: new Date(),
        state: 1
    }
    let message = new Message(data)
    message.save(function(err, result) {
        if (err) {
            res.send({status:500});
        } else {
            res.send({status:200})
        }
    })
}

// 好友申请
exports.applyFriend = function(data, res) {
    // 判断是否已经申请过
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid
    }
    Friend.countDocuments(wherestr, (err, result) => {
        if(err) {
            res.send({status:500})
        } else {
            // 如果result 等于 0， 为初次申请
            if (result == 0) {
                this.buildFriend(data.uid, data.fid, 2)
                this.buildFriend(data.fid, data.uid, 1)
            } else {
                // 已经申请过好友
                this.upFriendLastTime(data)
            }
            // 添加消息
            this.inserMsg(data.uid, data.fid, data.msg, 0, res)
        }
    })
}

// 更新好友状态
exports.updateFriendState = function(data, res) {
    let wherestr = {
        $or: [
            {
                'userID': data.uid,
                'friendID': data.fid
            },
            {
                'userID': data.fid,
                'friendID': data.uid
            }
        ]
    }
    Friend.updateMany(wherestr, {
        'state': 0
    }, function(err, result) {
        if(err) {
            res.send({status:500})
        } else {
            res.send({status:200})
        }
    })
}

// 拒绝好友或删除好友
exports.deleteFriend = function(data, res) {
    let wherestr = {
        $or: [
            {
                'userID': data.uid,
                'friendID': data.fid
            },
            {
                'userID': data.fid,
                'friendID': data.uid
            }
        ]
    }
    Friend.deleteMany(wherestr, function(err, result) {
        if(err) {
            res.send({status:500, msg: '删除好友失败'})
        } else {
            res.send({status:200, msg: '删除好友信息成功'})
        }
    })
}

exports.getUsers = function(uid, state,  res) {
    let query = Friend.find({})
    query.where({'userID':uid, 'state': state})

    query.populate('friendID');

    // 排序方式 最后
    query.sort({'lastTime': -1})

    // 输出查询结果
    query.exec().then(function(e) {
        let result = e.map(function(ver){
            return {
                id: ver.friendID._id,
                name: ver.friendID.name,
                markname: ver.markname,
                imgurl: ver.friendID.imgurl,
                lastTime: ver.lastTime
            }
        })
        res.send({status: 200, result})
    }).catch(function(err) {
        res.send({status: 500, result})
    })
}

exports.getOneMsg = function(data, res) {
    let query = Message.findOne({})

    query.where({
        $or: [
            {
                'userID': data.uid,
                'friendID': data.fid
            },
            {
                'userID': data.fid,
                'friendID': data.uid
            }
        ]
    })
    // 排序方式 最后
    query.sort({'time': -1})

    // 输出查询结果
    query.exec().then(function(e) {
        let result =  {
            message: ver.message,
            time: ver.time,
            types: ver.types
        }
        res.send({status: 200, result})
    }).catch(function(err) {
        res.send({status: 500, result})
    })
}

// 未读消息数
exports.unreadMsg = function(data, res) {
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid,
        'state': 0
    }
    Message.countDocuments(wherestr, (err, result) => {
        if(err) {
            res.send({status:500})
        } else {
            res.send({status:200, result})
        }
    })
}

// 一对一状态修改
exports.updateMsg = function(data, res) {
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid,
        'state': 1
    }
    // 修改内容
    let updatestr = {'state':0}
    Message.updateMany(wherestr, updatestr ,(err, result) => {
        if(err) {
            res.send({status:500, msg: '一对一状态修改失败'})
        } else {
            res.send({status:200, msg: '一对一状态修改成功'})
        }
    })
}