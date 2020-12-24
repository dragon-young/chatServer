var mongoose = require('mongoose')

// 有时候我们需要权限不同的多个连接， 或是连接到不同数据库
// 这个情况下我们可以使用 mongoose.createConnection()
var db = mongoose.createConnection('mongodb://localhost:27017/chat',  { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false})

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
  console.info('数据库chat打开成功')
})

module.exports = db