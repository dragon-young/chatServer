var emailserver = require('../dao/emailserver');
var signUp = require('../server/signup');
var login = require('../server/login')

var search = require('../server/search')

var userdetails = require('../server/userdetails');

var friend = require('../server/friend')

var index = require('../server/index')

module.exports = function(app) {
    app.post('/mail', (req,res) => {
        let mail = req.body.mail;
        emailserver.emailSignUp(mail, res)
    })

    // 注册页面
    app.post('/register/add', (req, res) => {
        signUp.register(req, res)
    })

    // 判断邮箱是否被占用
    app.post('/register/judge', (req, res) => {
        signUp.judgeValue(req, res)
    })


    // 登陆页面
    // 登陆
    app.post('/login/match', (req,res) => {
        console.log('aa');
        login.signIn(req, res)
    })


    // 搜索页面
    app.post('/search/user', (req, res) => {
        search.searchUser(req, res);
    })

    app.post('/search/isfriend', (req, res) => {
        search.isFriend(req, res);
    })
    app.post('/search/group', (req, res) => {
        search.searchGroup(req, res);
    })
    app.post('/search/isingroup', (req, res) => {
        search.isInGroup(req, res);
    })

    // 用户详情 -- 测试成功
    app.post('/user/details', (req, res) => {
        userdetails.userDetial(req, res)
    })

    // 用户修改 -- 测试成功
    app.post('/user/update', (req, res) => {
        userdetails.userUpdate(req, res)
    })
    // 用户信息修改 -- 未测试
    app.post('/user/markname', (req, res) => {
        userdetails.friendMarkName(req, res)
    })

    // 好友昵称获取
    app.post('/user/getmarkname', (req, res) => {
        userdetails.getMarkName(req, res)
    })

    // 好友操作
    // 申请好友
    app.post('/friend/applyfriend', (req, res) => {
        friend.applyFriend(req, res)
    })

    // 申请好友状态
    app.post('/friend/updatefriendstate', (req, res) => {
        friend.updateFriendState(req, res);
    })


    // 删除好友
    app.post('/friend/deletefriend', (req, res) => {
        friend.deleteFriend(req, res)
    })

    // 主页
    // 获取好友 0--好友， 1--申请人 2 -- 发送人
    app.post('/index/getfriend', (req, res) => {
        index.getFriend(req,res)
    })

    // 获取最后一条消息
    app.post('/index/getlastmsg', (req, res) => {
        index.getLastMsg(req,res)
    })

    
    app.post('/index/updatemsg', (req, res) => {
        index.updateMsg(req,res)
    })


    app.post('/test', (req, res) => {
        console.log('测试')
    })

    

}