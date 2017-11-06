var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://localhost/test',{useMongoClient: true,promiseLibrary: global.Promise});
 var db = mongoose.connection;
 db.on('error',console.error.bind(console,'连接错误:'));
db.once('open', function (callback) {
 console.log("数据库成功打开");
});

module.exports = db;