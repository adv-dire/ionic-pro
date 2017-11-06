angular.module('starter.services', [])

.factory('services', function($ionicPopup,$http,$httpParamSerializerJQLike) {
  return {
    //登录
    login:function(formData,callback){
    $http({
    method: 'post',
    url: '/login',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
  //console.log(response.data);
  callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //注册
    register:function(formData,callback){
          $http({
    method: 'post',
    url: '/register',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
//是否登录
user:function(callback){
  $http({
    method: 'GET',
    url: '/logined'
}).then(function successCallback(response) {
        callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
},
//退出登录
loginout:function(callback){
  $http({
    method: 'GET',
    url: '/loginout'
}).then(function successCallback(response) {
        callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
},
//保存用户个人资料
 userinfo:function(formData,callback){
    $http({
    method: 'post',
    url: '/userinfo',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //显示用户的个人资料
    showuserinfo:function(callback){
    $http({
    method: 'GET',
    url: '/showuserinfo',
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //保存文章内容
  artice : function(formData,callback){
    $http({
    method: 'post',
    url: '/artice',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //显示首页文章列表
    showarticelist : function(callback){
    $http({
    method: 'GET',
    url: '/showarticelist',
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //获取对应的文章并显示
     showinfoartice : function(callback){
    $http({
    method: 'GET',
    url: '/showinfoartice',
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
//显示用户发布的文章
showuseractice : function(id,callback){
    $http({
    method: 'GET',
    url: '/showuseractice',
    params:{
        'id':id
    }
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //投票
toupiao : function(id,bool,callback){
    $http({
    method: 'GET',
    url: '/toupiao',
    params:{
        'zantong' : bool,
        'userid'  : id
    }
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
//是否已经投票
    sftp : function(userid , callback){
    $http({
    method: 'GET',
    url: '/sftp',
    params:{
    'artive':userid
    }
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //显示作者信息
     showauthorinfo : function(phoneid , callback){
    $http({
    method: 'GET',
    url: '/showauthorinfo',
    params:{
    'phoneid':phoneid
    }
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //是否登录
    sfdl : function(callback){
    $http({
    method: 'GET',
    url: '/sfdl',
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
//收藏
 shoucang : function(shoucang,userid,callback){
    $http({
    method: 'GET',
    url: '/shoucang',
    params : {
        'shoucang':shoucang,
        'userid':userid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //是否已经收藏了
    sfshoucang : function(userid,callback){
    $http({
    method: 'GET',
    url: '/sfshoucang',
    params:{
        'userid':userid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //感谢
    ganxie : function(userid,boll,callback){
    $http({
    method: 'GET',
    url: '/ganxie',
    params:{
    'bool':boll,
    'articeid':userid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

     //是否感谢
    sfganxie : function(userid,callback){
    $http({
    method: 'GET',
    url: '/sfganxie',
    params:{
    'articeid':userid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

//评论
    pinglun : function(formData,callback){
    $http({
    method: 'post',
    url: '/pinglun',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

    showpinglun : function(userid,callback){
    $http({
    method: 'GET',
    url: '/showpinglun',
    params:{
        'articeid':userid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //回复请求
 fuhuilist : function(plcontent,userid,artice,callback){
    $http({
    method: 'GET',
    url: '/fuhuilist',
    params:{
        'articeid':artice,
        'userid':userid,
        'plcontent':plcontent
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
 //保存回复评论数据
 huifupl : function(formData,callback){
    $http({
    method: 'post',
    url: '/huifupl',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

    //显示回复的列表
     showfuhuilist : function(userid,callback){
    $http({
    method: 'GET',
    url: '/showfuhuilist',
    params:{
        'userid':userid,
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },


     //点赞
    dianzan : function(formData,callback){
    $http({
    method: 'post',
    url: '/dianzan',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

     //收藏
    myshoucang : function(callback){
    $http({
    method: 'GET',
    url: '/myshoucang',
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

    //我的文章
     myactice : function(callback){
    $http({
    method: 'GET',
    url: '/myactice',
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //显示他人资料
     lookuserinfo:function(userid,callback){
    $http({
    method: 'GET',
    url: '/lookuserinfo',
    params:{
        'userid':userid
    }
}).then(function successCallback(response) {
          callback(response);
          
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
//显示他人收藏
     lookscang : function(userid,callback){

    $http({
    method: 'GET',
    url: '/lookscang',
    params:{
        'userid':userid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
//显示他人文章
    lookuserartice : function(userid,callback){
    $http({
    method: 'GET',
    url: '/lookuserartice',
    params:{
        'userid':userid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //显示赞同数量
    zantongpls : function(articeid,callback){
    $http({
    method: 'GET',
    url: '/zantongpls',
    params:{
        'userid':articeid
    },
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

     //显示书列表
    allbookcity : function(callback){
    $http({
    method: 'GET',
    url: '/allbookcity',
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
         //加入书架
    jiabookjia : function(formData,callback){
    $http({
    method: 'post',
    url: '/jiabookjia',
    data : $httpParamSerializerJQLike(formData.data), // pass in data as strings
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },

    //获取书架 
    showshjia : function(callback){
    $http({
    method: 'GET',
    url: '/showshjia',
}).then(function successCallback(response) {
          callback(response);
    }, function errorCallback(response) {
        // 请求失败执行代码
});
    },
    //提示功能
   alertPup:function (wz) {
    var alertPopup = $ionicPopup.alert({
    title: '不能进行操作',
    template: wz
   });
   alertPopup.then(function(res) {
   });
   setTimeout(function(){
    alertPopup.close();
   },2000)
 },
  };
});
