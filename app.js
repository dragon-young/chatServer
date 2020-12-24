const express = require('express')

//解析req.body插件
var bodyParser = require('body-parser')

// token 验证
var jwt = require('./dao/jwt')


const app = express()

const port = 8080

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS') {
        res.sendStatus(200) 
    }else {
        next();
    }
});

app.use(bodyParser.json())

app.use(function(req, res, next){
    if (typeof(req.body.token) != 'undefined') {
        var token = req.body.token
        // console.log(token)
        var tokenMatch = jwt.verifyToken(token)
        // console.log(tokenMatch);
        if (tokenMatch == 1) {
            // 通过验证
            next()
        } else {
            // 验证不通过
            res.send({status: 300, msg: 'token不匹配'})
        }
    } else {
        next()
    }
})

require('./router/index.js')(app)
require('./router/files.js')(app)

app.use(express.static(__dirname + '/data'))

app.use(function(req, res, next) {
    let err = new Error('Not Found!!')
    err.status = 404
    next(err)
})

app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.send(err.message)
})



app.listen(port, () => {
    console.log(`启动服务器： ${port}`)
})