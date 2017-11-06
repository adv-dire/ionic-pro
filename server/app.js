var express = require("express");
var app = express();
var session = require('express-session');
var cookieParser  = require('cookie-parser');
var MongoStore=require("connect-mongo")(session);
var db = require("./model/db.js");
var test = require("./model/test.js");
var md5 = require("./model/md5.js");
var formidable = require("formidable");
app.use(cookieParser());
//var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
var router = require("./router/router.js");
//将登陆持久化到数据库中
app.use(session({
    secret: '12345',
     name: 'testapp',
     cookie: {maxAge: 60 * 1000 * 60 * 24 * 360 },
     resave: false,
     saveUninitialized: true,
     store: new MongoStore({   //创建新的数据库
         mongooseConnection:db,
     })
 }));
//var ObjectId = require('mongodb').ObjectID;
//var router = express.Router();
app.use(express.static("./public"));//静态文件夹（等同于根目录）
app.set("view engine","ejs");
app.use("/", express.static('../www'));//静态文件夹（等同于根目录）
app.all("/login",router.login);//登陆路由
app.all("/register",router.register); //注册路由
app.all("/logined",router.logined);//是否登录返回值bool值路由
app.all("/loginout",router.loginout);//退出登录路由
app.all("/userinfo",router.userinfo);//用户详细资料路由
app.all("/showuserinfo",router.showuserinfo);//显示用户详细资料路由
app.all("/uploadimg",router.uploadimg);//保存写文章图片路由
app.all("/artice",router.artice);//文章路由
app.all("/showarticelist",router.showarticelist);//显示文章列表路由
app.all("/showuseractice",router.showuseractice);//显示用户文章路由
app.all("/toupiao",router.toupiao);//投票路由
app.all("/sftp",router.sftp);//是否投票路由
app.all("/showauthorinfo",router.showauthorinfo);//显示作者信息路由
app.all("/sfdl",router.sfdl);//是否登录路由
app.all("/shoucang",router.shoucang);//收藏路由
app.all("/sfshoucang",router.sfshoucang);//是否收藏路由
app.all("/ganxie",router.ganxie);//感谢路由
app.all("/sfganxie",router.sfganxie);//是否感谢路由
app.all("/pinglun",router.pinglun);//评论路由
app.all("/showpinglun",router.showpinglun);//显示评论路由
app.all("/fuhuilist",router.fuhuilist);//回复评论列表路由
app.all("/huifupl",router.huifupl);//回复评论路由
app.all("/showfuhuilist",router.showfuhuilist);//显示回复评论列表路由
app.all("/dianzan",router.dianzan);//点赞路由
app.all("/myshoucang",router.myshoucang);//我的收藏路由
app.all("/myactice",router.myactice);//我的文章路由
app.all("/lookuserinfo",router.lookuserinfo);//查看用户信息路由
app.all("/lookscang",router.lookscang);//查看他人收藏路由
app.all("/lookuserartice",router.lookuserartice);//查看他人收藏文章路由
app.all("/allbookcity",router.allbookcity);//书城路由
app.all("/jiabookjia",router.jiabookjia);//加入书架路由
app.all("/showshjia",router.showshjia);//显示书架路由
app.all("/moredartice",router.moredartice);//获取更多文章路由
app.all("/moredpinglun",router.moredpinglun);//获取更多评论路由
app.listen(8100,"192.168.1.12");