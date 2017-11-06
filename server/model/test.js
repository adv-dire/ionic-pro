var mongoose = require('mongoose');
var md5 = require("../model/md5.js");
var sd = require('silly-datetime');

//用户数据库
var userSchema = new mongoose.Schema({
    userID:  String,
    pas: String,
});
//书城数据库
var bookcitySchema = new mongoose.Schema({
    title:  String,
    author: String,
    ImgUrl:String,
    miaoshu:String,
    dushuliang: { type: Number, default: 0 },
    user:[]
});
//书城找出所有的数据方法，第一个参数为一个对象，第二个为回调函数
bookcitySchema.statics.fd = function(obj , callback){
     var obj = obj || {};
     this.model('bookcity').find(obj, callback);
}
//收藏文章数据库
var scarticeSchema = new mongoose.Schema({
    articeid : [],
    user:[userSchema]
});
//删除用户文章方法 第一个参数为一个对象 第二个为要删除的元素 第三个为回调函数
scarticeSchema.statics.shanchuuartive = function(obj , sobj ,callback) {
     var obj = obj || {};
    this.model('scartice').update(obj , {$pull:{articeid:sobj}} , { multi: true } , callback);
};
//找出文章的静态方法 第一个参数为对象 第二个为回调函数
scarticeSchema.statics.fd = function(obj , callback){
     var obj = obj || {};
     this.model('scartice').find(obj, callback);
}
//用户详细信息数据库
var userinfoSchema = new mongoose.Schema({
    name : String,
    sex : String,
    xl : String,
    initr:String,
    adress:String,
    aihao:String,
    guanzhu:String,
    user:[userSchema],

});
//找出全部用户数据的静态方法第一个参数为一个对象 第二个为回调函数
userinfoSchema.statics.fd = function(obj,callback) {
      var obj = obj || {};
     this.model('userinfo').find(obj, callback);
};

//添加用户详细资料的方法 第一个参数为一个对象 第二个为回调函数
userinfoSchema.statics.adduserinfo = function(obj,callback) {
    this.user.push(obj);
    this.save(function(){
        callback();
    });
}
//添加用户的方法 第一个参数为一个对象 第二个为回调函数
userSchema.statics.fd = function(obj,callback) {
    var obj = obj || {};
   this.model('user').find(obj, callback);
};
//回评评论的数据库
var huifusSchema = new mongoose.Schema({
    huifucontent:String,
    name:String,
    hfdate: { type: String, default: sd.format(new Date(), 'YYYY-MM-DD HH:mm') },
    huifuuser:[userinfoSchema],
})
//添加回复方法 第一个参数为一个对象 第二个为回调函数
huifusSchema.methods.tianjiahuifu = function(studentObj,callback){
    this.pinglun.push(studentObj);
    this.save(function(){
        callback();
    })
}
//评论数据库
var pinglunsSchema = new mongoose.Schema({
    name:String,
    dianzanuser:[],
    dianzan:{ type: Number, default: 0 },
    plcontent:String,
    username:String,
    pldate: { type: String, default: sd.format(new Date(), 'YYYY-MM-DD HH:mm') },
    pluser:[userSchema],
    huifu:[huifusSchema]
})

//找更多文章方法  第一个参数为一个对象 第二个参数为页码 第三个为回调函数
pinglunsSchema.statics.moredpinglun = function(obj,skipnm,callback) {
     var obj = obj || {};
     var skipsl = skipnm * 20;
     console.log(skipsl);
     this.model('commentaries').find(obj , callback).skip(skipsl).limit(20).sort({updated:-1});
};
//通过ID找到特定的评论方法
pinglunsSchema.statics.fById = function(id ,callback) {
     var num = num || 0;
     this.model('pinglun').findById(id , callback);
};
//找到全部评论的方法
pinglunsSchema.statics.fd = function(obj,callback) {
     var obj = obj || {};
     this.model('pinglun').find(obj , callback).sort({updated:-1});
};
//总评论数量
pinglunsSchema.statics.fd = function(obj,callback) {
     var obj = obj || {};
     this.model('pinglun').find(obj , callback).count();
};
//文章列表数据
var commentariesSchema = new mongoose.Schema({
    title:  String,
    content:String,
    zantonguser:[],
    ganxie:[],
    zantong:{ type: Number, default: 0 },
    updated: { type: Date, default: Date.now },
    ImgUrl: [],
    body:   String,
    user:[userSchema],
    pinglun:[pinglunsSchema]

});
//添加评论方法
commentariesSchema.methods.tianjiapinglu = function(studentObj,callback){
    this.pinglun.push(studentObj);
    this.save(function(){
        callback();
    })
}
//测试
commentariesSchema.methods.tianjiaxuesheng = function(studentObj,callback){
    this.user.push(studentObj);
    this.save(function(){
        callback();
    });
}
//找到更多评论方法 第一个参数为一个对象 第二个参数为页码 第三个为回调函数
commentariesSchema.statics.moredpinglun1 = function(obj,skipnm,callback) {
     var obj = obj || {};
     var skipsl = skipnm * 10;
    // console.log(skipsl);
     this.model('commentaries').find(obj,callback).slice('pinglun',[skipsl,10]).exec(function(err,resu){
        if (err) {
            return;
        };
     })
};

//找到更多文章方法 第一个参数为一个对象 第二个参数为页码 第三个为回调函数
commentariesSchema.statics.moredartice = function(obj,skipnm,callback) {
     var obj = obj || {};
     var skipsl = skipnm * 20;
     console.log(skipsl);
     this.model('commentaries').find(obj , callback).skip(skipsl).limit(20).sort({updated:-1});
};

//找到全部文章发放  第一个参数为一个对象 第二个回调函数
commentariesSchema.statics.fd = function(obj,callback) {
     var obj = obj || {};
     this.model('commentaries').find(obj , callback).sort({updated:-1});
};

//更新赞同数量
commentariesSchema.statics.updazt = function(obj , num ,callback) {
     var num = num || 0;
     var obj = obj || {};
     this.model('commentaries').update(obj , {"$inc":{"zantong":num}} , callback);
};
//找到唯一的文章方法 第一个参数为ID 
commentariesSchema.statics.fById = function(id ,callback) {
     var num = num || 0;
     this.model('commentaries').findById(id , callback);
};

//更新赞同数量
commentariesSchema.statics.shanchuuser = function(obj , sobj ,callback) {
     var obj = obj || {};
    // console.log(sobj.toString());
    this.model('commentaries').update(obj , {$pull:{zantonguser:sobj}} , { multi: true } , callback);
};

//创建MODEL
var commentaries = mongoose.model("commentaries",commentariesSchema);
var user      = mongoose.model("user",userSchema);
var userinfo  = mongoose.model("userinfo",userinfoSchema);
var scartice  = mongoose.model("scartice",scarticeSchema);
var pinglun   = mongoose.model("pinglun",pinglunsSchema);
var huifu   = mongoose.model("huifu",huifusSchema);
var bookcity   = mongoose.model("bookcity",bookcitySchema);
//暴露接口
exports.user = user;
exports.userinfo = userinfo;
exports.commentaries = commentaries;
exports.scartice = scartice;
exports.pinglun = pinglun;
exports.huifu   = huifu;
exports.bookcity   = bookcity;


exports.all=[];