var formidable = require("formidable");//引用formidable插件
var test = require("../model/test.js");
var md5 = require("../model/md5.js");
var fs = require("fs");
var sd = require('silly-datetime');//引用datetime插件
var ObjectId = require('mongodb').ObjectID;
var path = require('path');
var util  = require('../model/util.js');
var haha  = require('../model/hahah.js');
var async = require('async');//引用async插件 解决异步循环
    //处理登陆
    exports.login = function(req,res,next){
        //调用formidable插件
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    	if (err) {
    		console.log(err);
    		return;
    	};
        //密码加密采用MD5
    	var password = md5(md5(fields.password) + "高杰豪");
        //调用查user方法（fd）
    	test.user.fd({userID:fields.phone},function(err,userid){
    		if (err) {
    		   return;
    		}
    		if (userid.length == 0) {
    			res.send("-1");
    		}else if (userid.length > 0){

    		test.user.fd({pas:userid[0].pas},function(err,pwd){
    		if (err) {
    			return;
    		}
    		if (pwd.length == 0) {
    			res.send("-2");
                return;
    		}else{
    		if (pwd[0].pas === password) {
            if (req.session) {
            req.session.phone = fields.phone;
            req.session.password = password;
            req.session.loinged = true;
            };
                       
			res.send("1");
            return;
    		}else{
    		res.send("-3");
            return;
    		}
    				
    	   }
    				//console.log(password);
    			
    			})
    		}
    		
    	});
    })
};
//处理注册
exports.register = function(req,res,next){
    //调用formidable插件
	    var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
    	if (err) {
    		return;
    	};
    	var password = md5(md5(fields.password) + "高杰豪");
        //调用查user方法（fd）
    	test.user.fd({userID:fields.phone},function(err,userID){
    		if (err) {
    			return;
    		}
    		if (userID.length == 0) {
                //创建一个用户
    		test.user.create({
    			"userID":fields.phone,
    			"pas":password
    			});
    		res.send("1");
            return;
    		}else{
    			res.send("-1");
                return;
    		}	
    	})
    	
    })
};
//处理是否登录
exports.logined = function(req,res,next){
    res.send(req.session.loinged);
    return;
};
//处理退出登录
    exports.loginout = function(req,res,next){
    //res.send("删除session了");
   req.session.loinged = false;
     //req.session.destroy();
     res.send(req.session.loinged);
     return;
     //res.redirect('/');
};
//处理用户信息
exports.userinfo = function(req,res,next){
    var flag = false;
    var resove = '';
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            return;
        };
        //调用用户信息查找方法
        test.userinfo.fd({},function(err,result){

                if (err) {
                    return;
                };
               //迭代器解决异步
             (function iterator(i){
                if (i == result.length ) {
                if (!flag) {
                if (req.session.loinged == true) {
                    //调用查user方法（fd）查找是否存在该用户
           test.user.fd({userID:req.session.phone},function(err,result){
                if (err) {
                return;
            }
                var aa = new test.userinfo({
                name:fields.name,
                sex : fields.sex,
                xl : fields.xl,
                initr:fields.initr,
                adress:fields.adress,
                aihao:fields.aihao,
                guanzhu:fields.guanzhu,
              });
                aa.save();
                aa.user.push(result[0]);
                res.json({result:aa,res:'2'});
                return;
           })
        };
                    }
                    return;
                }
                if (result.length != 0) {
                    //询问该用户是否存在，不存在就创建
                if (result[i].user[0].userID.toString() == req.session.phone.toString()) {
                    //console.log(555);
                    flag = true;
                    result[i].name = fields.name;
                    result[i].sex = fields.sex;
                    result[i].xl = fields.xl;
                    result[i].initr = fields.initr;
                    result[i].adress= fields.adress
                    result[i].aihao = fields.aihao;
                    result[i].guanzhu = fields.guanzhu;
                    result[i].save(function(){
                    test.userinfo.fd({},function(err,newresult){
                       // console.log(newresult);
                        res.json({result:newresult,res:'1'});
                        return;
                    })
                    });
                   
                    return;
                    }
                }else{

                    flag = false;

                }
                   
                   
                iterator(i + 1);
        })(0);
           
        });
        
        



     })
};
//处理显示用户信息
exports.showuserinfo = function(req,res,next){
    var flag = false;
     test.userinfo.fd({},function(err,result){
        if (err) {
        return;
        }
        //迭代器解决异步机制
         (function iterator(i){
            if (i >= result.length) {
                if (false ==flag) {
                res.json({'result':''});
                return;
                };
                
                return;
            };
            //找到该用户然后返回给前台
            if (result[i].user[0].userID.toString() == req.session.phone.toString()) {
                flag = true;
                res.json({'result':result[i]});
                return;
            }
        iterator(i + 1);
         })(0);
        //console.log(result);
        
      
     })
};
//处理富文本框保存图片的请求
exports.uploadimg = function(req,res,next){
        var imgLinks = [];
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
        if (err) {
            return;
        }
            // 存储图片的文件夹
        var storePath = path.resolve('../www/upload/');
        if (!fs.existsSync(storePath)) {
                fs.mkdirSync(storePath)
        }
            // 遍历所有上传来的图片
        util.objForEach(files, (name, file) => {
                // 图片临时位置
        var tempFilePath = file.path;
                // 图片名称和路径
        var fileName = file.name;
        var fullFileName = path.join(storePath, fileName);
                // 将临时文件保存为正式文件
        fs.renameSync(tempFilePath, fullFileName);
                // 存储链接
        imgLinks.push('upload/' + fileName);
        })
        res.send({errno : 0, data : imgLinks});
        return;
    })
};
//处理写文章的请求
exports.artice = function(req,res,next){
    //调用formidable插件
    var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
        if (err) {
            return;
        };
       var ImgUrl = JSON.parse(fields.ImgUrl);
       //保存该用户写的文章
        test.user.fd({userID:req.session.phone},function(err,useresult){
        if (err) {
        return;
        }
        var active = new test.commentaries;
        active.user.push(useresult[0]);
        active.title = fields.title;
        active.content = fields.content;
        active.body  = fields.body;
        active.ImgUrl.push(ImgUrl);
        active.save()
        })
    })
       res.json({result:'1'});
       return;
    }
    //处理显示文章的列表
    exports.showarticelist = function(req,res,next){
    //通过文章列表的查找方法找到全部文章
       test.commentaries.fd({},function(err,result){
        console.log(result);
        if (err) {
            return;
        }
        res.send(result);
        return;
       });
    }
    //显示特指的文章全部内容
    exports.showuseractice = function(req,res,next){

        console.log(req.query.id);
        test.commentaries.fById(req.query.id,function(err,result){
            if (err) {
                return;
            };
             res.send(result);
             return;
        });
       
    };
    //处理投票的请求
     exports.toupiao = function(req,res,next){
        var flag = false;
    test.commentaries.fById(req.query.userid,function(err,ztesult){
        if (err) {
            return;
        };
        //迭代器解决异步机制  添加赞同该文章的用户
        (function iterator(i){
            if (i >= ztesult.zantonguser.length) {
            if (!flag) {
            ztesult.zantonguser.push(req.session.phone);
            ztesult.save();
            test.commentaries.updazt({"_id" : new ObjectId(req.query.userid)},req.query.zantong,function(err,res){
            if (err) {
            console.log(err);
            return;
            }
        });
                };
                return;
            }
            if (req.session.phone == ztesult.zantonguser[i]) {
                flag = true;
                if ('-1' == req.query.zantong) {
                test.commentaries.shanchuuser({"_id" : new ObjectId(req.query.userid)} , req.session.phone , function(err , scresult){
                });
                test.commentaries.updazt({"_id" : new ObjectId(req.query.userid)},req.query.zantong,function(err,res){
                if (err) {
                console.log(err);
                return;
                }
        });
                }
                return;
            }else{
               flag = false; 
            }
            iterator(i + 1);
        })(0);
        
    })
    
       res.end();
       return;
        
    }

//是否赞同
    exports.sftp = function(req,res,next){
        var flag = false;
        //找到该文章询问该用户是否赞同了它（该文章）
    test.commentaries.fById(req.query.artive,function(err,result){
    if (err) {
    return;
    };
    //迭代器解决异步机制
    (function iterator(i){
         if (i >= result.zantonguser.length) {
            if (!flag) {
            res.json({'res':'-1','login':req.session.loinged});  
            };
            return;
         }
        if (req.session.phone == result.zantonguser[i]) {
            flag  = true ;
            res.json({'res':'1','login':req.session.loinged});
            return;
            return;
        }else{
            flag = false;
        }
        iterator(i + 1);
    })(0);
        });
       
    };
    //处理显示作者资料的请求
     exports.showauthorinfo = function(req,res,next){
        test.userinfo.fd({},function(err,result){
            if (err) {
                return;
            };
             //迭代器解决异步机制
            (function iterator(i){
                if(i >= result.length){
                    return;
                };
                if (result[i].user[0].userID == req.query.phoneid) {
                    res.send(result[i]);
                    return;
                };
            iterator(i + 1);
            })(0);    
        })
    };
    //处理是否登录请求
     exports.sfdl = function(req,res,next){
       res.send(req.session.loinged);
       return;
    };
    //处理收藏请求
     exports.shoucang = function(req,res,next){
        var flag = false;
        var ff = false;
        if ('false' == req.query.shoucang) {

        //找到该文章询问该用户是否已经收藏 是：在该文章的收藏用户数据删除该用户 否：反之
     test.commentaries.fById({"_id" : new ObjectId(req.query.userid)} , function(err , result){
            if (err) {
                return;
            };
            if (result.user[0].userID == req.session.phone ) {
                res.send("1");
                return;
            }else{
                test.scartice.fd({},function(err , collectres){
                    if (err) {
                        return;
                    }
                    (function iterator(i){
                    if (i >= collectres.length) {
                    if (!flag) {
                    test.user.fd({userID:req.session.phone},function(err,userid){
                    var shoucang =  new test.scartice;
                    shoucang.articeid.push(req.query.userid);
                    shoucang.user.push(userid[0]);
                    shoucang.save();   
                    })
                        }
                            return;
                        };
                    if (collectres[i].user[0].userID == req.session.phone) {
                        //console.log(888888888);
                        flag = true;
                        
                        (function iterato(k){
                            if (k >= collectres[i].articeid.length) {
                                if (!ff) {
                            collectres[i].articeid.push(req.query.userid); 
                            collectres[i].save();   
                                };
                                return;
                            };
                            if(collectres[i].articeid[k] == req.query.userid){
                                ff = true;
                                return;
                            }else{
                                ff = false;
                            }

                            iterato(k + 1);
                        })(0);
                      }else{
                     flag = false;
                      }
                    
                    iterator(i + 1);
                    })(0);
                   
                })
                
             res.send("-1");   
             return;
            }
          })
       }else{
         test.scartice.fd({},function(err , articeres){
            if (err) {
                return;
            };
            (function iterator(i){
            if (i >= articeres.length) {
                return;
            };
            //pull 删除
            if(articeres[i].user[0].userID == req.session.phone){
            articeres[i].articeid.pull(req.query.userid);
            articeres[i].save();   
            return;
            }
            iterator(i + 1);
            })(0);
       
        })
       }
    };
    //是否收藏
     exports.sfshoucang = function(req,res,next){
        var flag = false;
       test.scartice.fd({},function(err , articeres){
            if (err) {
                return;
            };
           (function iterator(i){
            if (i == articeres.length) {
                if (!flag) {
                    res.send("false");
                     return;
                }
               return;
            };
            (function iterato(k){
                if (k == articeres[i].articeid.length) {
                    return;
                }
                if(articeres[i].articeid[k] == req.query.userid){
                if(articeres[i].user[0].userID == req.session.phone){
                flag = true; 
                res.send("true");
                return;
                }
            }else{
            flag = false;
            }
                iterato(k + 1);
            })(0);
           
            iterator(i + 1);
            })(0);
       
        })
    };
    //处理感谢请求
    exports.ganxie = function(req,res,next){
       //找到该文章询问该用户是否感谢了它 是：删除 否：添加
         test.commentaries.fById(req.query.articeid,function(err,result){
            if (err) {
            return;
            };
             if ('true' == req.query.bool) {
            result.ganxie.push(req.session.phone);
            result.save();
             }else{
           result.ganxie.pull(req.session.phone); 
           result.save();
        }
            
            }) 
        
   
       res.send();
       return;
    };
    //处理是否感谢请求
     exports.sfganxie = function(req,res,next){
       var flag = false;
       //找到该文章询问该用户是否感谢了它 是：返回true 否：反之
    test.commentaries.fById(req.query.articeid,function(err,result){
    if (err) {
    return;
    };
    (function iterator(i){
        if (i == result.ganxie.length) {
            if (!flag) {
            res.send('false');  
            }
            return;
        }
    if (result.ganxie[i] == req.session.phone) {
        flag = true;
        res.send('true');
        return;
    }else{
        flag = false;
    }
    iterator(i + 1 );
    })(0);     
            
}) 
    };
//评论
    exports.pinglun = function(req,res,next){
    var flag = false;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            return
        }
        //找到该文章的全部评论
        test.commentaries.fById(fields.articeid,function(err,artres){
            if (err) {
                return;
            }
            //找到该用户
        test.user.fd({userID:req.session.phone},function(err,userres){
        //找出所有用户详细资料的数据
        test.userinfo.fd({},function(err,userinforesult){
            if (err) {
                return;
            }
            (function iterator(i){
            if (i >= userinforesult.length) {
                return;
            }
            //循环询问该用户是否存在
            if(userinforesult[i].user[0].userID == req.session.phone){
                //找到全部评论数据
                test.pinglun.fd({},function(err,result){
                    if (err) {
                        return;
                    };
                    (function iterato(k){
                    if (k >= result.length) {
                        if (!flag) {
                            //添加一条评论数据
                           var pl = new test.pinglun({
                            'plcontent':fields.content, 
                            'username':userinforesult[i].name
                                })
                           //保存数据库
                            pl.save();
                            //添加数组
                            pl.pluser.push(userres[0])
                            //添加成功之后返回
                            artres.tianjiapinglu(pl,function(){
                            console.log("添加成功啦");
                            res.send("1");
                        });  
                        }
                        return;
                    }
                    if (result[k].plcontent == fields.content) {
                        //console.log(fields.content);
                        flag = true;
                        res.send("-1");
                        return;
                    }else{
                        flag = false;
                    }
                    iterato(k + 1);
                })(0);
                })
            }
            iterator(i + 1)
            })(0);
        })
       
       });
       
        })  
    })
};

//显示评论
 exports.showpinglun = function(req,res,next){
    //找到特定的文章的评论
    test.commentaries.fById(req.query.articeid,function(err,artres){
    if (err) {
        result;
    }
    res.send(artres.pinglun);
    return;
    })
};
//回复路由
 exports.fuhuilist = function(req,res,next){
    //找到唯一文章
    test.commentaries.fById(req.query.articeid,function(err,articeres){
        if (err) {
            return;
        };
        (function iterator(i){
            if (i >= articeres.pinglun.length) {
                return;
            }
            //循环询问该用户是否存在在唯一文章里的评论数组里的评论用户数组里面
            if (articeres.pinglun[i].pluser[0].userID == req.query.userid) {
                if (articeres.pinglun[i].plcontent == req.query.plcontent) {
                   res.send(articeres.pinglun[i]);
                    return;
                }
            }
            iterator(i + 1);
        })(0);
    })
   
};

//保存回复评论
  exports.huifupl = function(req,res,next){
    //调用formidable插件
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
            return;
        };
        if (fields.userid == req.session.phone) {
            res.send("-1");
            return;
        }else{
            //找到所有用户的详细资料数据 
            test.userinfo.fd({},function(err, userinfores){
                if (err) {
                    return;
                };
                (function iterato(i){
                    if (i >= userinfores.length) {
                        return;
                    }
                    //找到该用户就添加
                    if(userinfores[i].user[0].userID == req.session.phone){
                    var huifu = new test.huifu({
                     huifucontent : fields.content
                        });
                        huifu.save();
                        huifu.huifuuser.push(userinfores[i]); 
                        //同过ID找到该评论添加回复
                        test.pinglun.fById(fields.plid,function(err,plres){
                            if (err) {
                                return;
                            }
                           plres.huifu.push(huifu);
                           plres.save(function(){
                            res.send("8");
                            return;
                           });
                        }) 
                        return; 
                    }
                    iterato(i + 1);
                })(0);
            })
           
        }
    })
       
       
    };

    //获取回复内容
  exports.showfuhuilist = function(req,res,next){
    var result=[];
    //通过ID找到特定的评论结果返回
    test.pinglun.fById(req.query.userid,function(err,plresult){
        if (err) {
            return;
        }
       res.send(plresult);
       return;
    })
       
    };
    //保存点赞的数量
  exports.dianzan = function(req,res,next){

   var flag = false;
   //调用formidable插件
   var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
            return;
        };
        if ('true' == fields.bool) {
            //找到该评论的
            test.pinglun.fById(fields.plid,function(err,result){
                if (err) {
                    return;
                }
                console.log(result);
            });
        };
         console.log(fields);
    });
   
    
       res.end();
       return;
       
    };
//处理我的收藏的请求
 exports.myshoucang = function(req,res,next){
    //找出全部收藏文章
   test.scartice.fd({},function(err,scres){
    if (err) {
        return;
    };
    //async解决异步机制
    //循环找出该用户是否收藏了该文章
    async.map(scres, function(item1, callback) { 
        if(item1.user[0].userID == req.session.phone){
        async.map(item1.articeid, function(item1, callback1) {
        test.commentaries.fById(item1,function(err,scwzresult){
        callback1(null, scwzresult);
         })
        },function(err,result){
            if (err) {
                return;
            };
            res.send(result);
            return;
            
        })
        }
    },function(err,result){
        return;
    })
   })
       
    };


    //我的文章
    exports.myactice = function(req,res,next){
    var all = [];
   test.commentaries.fd({},function(err,wzres){
    if (err) {
        return;
    };
    //迭代器解决异步机制
    //循环找出自己收藏对应的文章
    (function iterator(i){
        if (i >= wzres.length) {
            res.send(all);
            return;
        }
        if (wzres[i].user[0].userID == req.session.phone) {
            all.push(wzres[i]);
        };
        iterator(i + 1)
    })(0);
   })  
    };
//查看他人个人资料
exports.lookuserinfo = function(req,res,next){
    var flag = false;
    //找到全部用户的信息
     test.userinfo.fd({},function(err,result){
        if (err) {
        return;
        }
        //迭代器解决异步机制
        //找到对应的用户信息然后返回
         (function iterator(i){
            if (i >= result.length) {
                if (false ==flag) {
                res.json({'result':''});
                return;
                };
                
                return;
            };
            if (result[i].user[0].userID.toString() == req.query.userid.toString()) {
                flag = true;
                res.json({'result':result[i]});
                return;
            }
        iterator(i + 1);
         })(0);
     })
};
    //显示他人收藏
    exports.lookscang = function(req,res,next){
        //找到全部收藏的文章
   test.scartice.fd({},function(err,scres){
    if (err) {
        return;
    };
    //async 解决异步机制
    //循环找到该用户收藏的文章然后返回
    async.map(scres, function(item1, callback) { 
        if(item1.user[0].userID == req.query.userid){
        async.map(item1.articeid, function(item1, callback1) {
        test.commentaries.fById(item1,function(err,scwzresult){
        callback1(null, scwzresult);
         })
        },function(err,result){
            if (err) {
                return;
            };
            res.json({'result':result});
            return;
            
        })
        }
    },function(err,result){
        return;
    })
   })
      
    };

    //显示他人文章
    exports.lookuserartice = function(req,res,next){
    var all = [];
    //找到所有文章
   test.commentaries.fd({},function(err,wzres){
    if (err) {
        return;
    };
    //迭代器 循环找到该用户所写的文章
    (function iterator(i){
        if (i >= wzres.length) {
            res.send(all);
            return;
        }
        if (wzres[i].user[0].userID == req.query.userid) {
            all.push(wzres[i]);
        };
        iterator(i + 1)
    })(0);
   })  
    };
        //显示书城
    exports.allbookcity = function(req,res,next){
        //找出所有的书籍然后返回
        test.bookcity.fd({},function(err,result){
            if (err) {
                return;
            };
             res.send(result);
             return;
        })
   
    };
    //处理加入书架的请求
     exports.jiabookjia = function(req,res,next){
        //调用formidable插件
       var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
            return;
        }
        //找到所有书籍数据
        test.bookcity.fd({},function(err,result){
            if (err) {
                return;
            };
        //循环找出用户指定的书籍然后把该用户添加进去
        async.map(result, function(item, callback) {
            if (item._id == fields.bookid) {
            if (item.user.length == 0) {
                item.user.push(req.session.phone);
                item.save();
                res.send("1");
                return;
            }
            async.map(item.user, function(userid, callback) {
                if (userid == req.session.phone) {
                    res.send('-1');
                    return;
                }else{
                  item.user.push(req.session.phone); 
                  item.save();
                  res.send('2');
                  return; 
                }
            })    
            };
        })
        })
       }) 
    };
    //获取书架数据
     exports.showshjia = function(req,res,next){
        //找到全部的书籍
        test.bookcity.fd({},function(err,result){
            if (err) {
                return;
            };
            //循环找出该用户加入的书籍然后返回
        async.map(result, function(item, callback) {
        async.map(item.user, function(userid, callback) {
                if (userid == req.session.phone) {
                    res.json({'result':item});
                    return;
                }
            })    
        })
        })
    };
//上拉刷新文章数据
      exports.moredartice = function(req,res,next){
        //console.log(req.query.pageIndex);
        //调用文章找到更多文章方法，通过前台传回来的页码进行过滤 每次限制返回20条文章数据
        test.commentaries.moredartice({},req.query.pageIndex,function(err,result){
            res.send(result);
            return;
            //console.log(result);
        })
    };
//上拉刷新评论数据
 //调用找到更多评论方法，通过前台传回来的页码进行过滤 每次限制返回10条评论数据
      exports.moredpinglun = function(req,res,next){
        test.commentaries.moredpinglun1({"_id" : new ObjectId(req.query.articeid)},req.query.pageIndex,function(err,artres){
            if (err) {
                return;
            };
           res.send(artres[0].pinglun);
            return;
        })
    };

