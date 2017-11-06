angular.module('starter.controllers', [])

.controller('homeCtrl', ['$ionicGesture','$timeout','$ionicScrollDelegate','$scope','$http','services',function($ionicGesture,$timeout,$ionicScrollDelegate,$scope , $http  , services) {
  //初始化首页内容选项卡
  //视图进入之后

  $timeout(function(){
 $ionicScrollDelegate.resize();
  },500)
   $scope.$on('$ionicView.enter', function (e) {
 
   var mySwiper = new Swiper('.swiper-container',{
     scrollbar:'.swiper-scrollbar' ,
     scrollbarHide : false,
     scrollbarDraggable : true ,
     scrollbarSnapOnRelease : true ,
     iOSEdgeSwipeDetection : true,
     iOSEdgeSwipeThreshold : 50,
     threshold : 60,
     touchMoveStopPropagation : true,
  }); 

})
   //文章的空数组
 $scope.artice =[];
    //显示文章标题及内容等等
     /* services.showarticelist(function(result){
      $scope.artice = result.data;
     // console.log(result.data);
      //console.log($scope.artice[1].pinglun);
      }); */


//下拉刷新
 $scope.doRefresh = function() {
    $http.get('/showarticelist')
     .success(function(newItems) {
      $scope.artice = newItems;
      $ionicScrollDelegate.resize();
     })
     .finally(function() {
       // 停止-广播ion-refresher
       $ionicScrollDelegate.resize();
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
//上拉刷新
$scope.newsList = {
    hasmore: true,
    pageIndex: 0,
}; 
$scope.bool = false;
$scope.time = 0;
  $scope.loadMore = function() {
    setTimeout(function(){
       $http.get('/moredartice?pageIndex=' + $scope.newsList.pageIndex)
      .success(function(items) {
      $scope.time = 1000;
      if (items.length > 0) {
        angular.forEach(items,function(data,index,array){
        $scope.artice.push(data);
        
      })
        //页数
          $scope.newsList.pageIndex++;
           if (items.length < $scope.newsList.pageIndex) {
          $scope.newsList.hasmore = false;
          }
         
      }else{
        $scope.bool = true;
        $scope.newsList.hasmore = false;
      }
     
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
    $ionicScrollDelegate.resize();
  },$scope.time)
   
  };

  /*$scope.$on('$stateChangeSuccess', function() {

    $scope.loadMore();
     $ionicScrollDelegate.resize();
  });*/
}])
//全部书籍
.controller('allbookCtrl', ['$rootScope','services','$state','$scope','$http','services',function($rootScope,services,$state,$scope , $http  , services) {
  $scope.evaluateLevel = '5';//指令需要的
  //获取书城的数据
  services.allbookcity(function(res){
   $scope.purdata = res.data;
  })
  //获取书城的数据的请求的参数的处理
  formData = {
    data:{'bookid':$state.params.bookid}
  }
  //加入书籍请求
  $scope.jiarubookjia = function(){
    services.jiabookjia(formData,function(res){
      if (res.data == '-1') {
        services.alertPup("你已经收藏过了");
      }else{
      services.alertPup("收藏成功");
      }
    })
  }
  //返回前页时，刷新前页  
/*$rootScope.$on('$locationChangeSuccess',function(){
    parent.location.reload();   
});*/
//console.log(idx);
//初始化书城里面的SWIper插件
 var bannerbook = new Swiper('#bannerbook', {
        pagination: '.swiper-pagination',
        observer:'true',
        roundLengths:true,
        initialSlide :$state.params.id,

        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
      coverflow: {
            rotate: 5,
            stretch: -30,
            depth: 120,
            modifier: 3,
            slideShadows : true
        }

    });
 bannerbook.init();
var allbookinfo = new Swiper('#allbookinfo', {
  roundLengths:true,
  noSwiping : true,
  noSwipingClass : 'stop-swiping',
  observer:'true',
  effect : 'fade',
  fade: {
  crossFade: true,
    }
})
bannerbook.params.control = allbookinfo
//返回前一个页面，可用ionic内置$ionicHistory实现
$scope.back=function(){
   window.history.back();
}

     
}])
//市场控制器
.controller('ChatsCtrl', function($timeout,$scope , $window , $ionicScrollDelegate,$timeout,$document,$ionicGesture,$window) {
  //初始化SWIper插件
  var sswiper = new Swiper('#banner', {
 // autoplay: 5000,//可选选项，自动滑动
    effect : 'fade',
})
//解决ionic内置isscorll不能上下滚动问题
          $timeout(function () {
            //return false; // <--- comment this to "fix" the problem
            var sv = $ionicScrollDelegate.$getByHandle('kalendar').getScrollView();

            var container = sv.__container;

            var originaltouchStart = sv.touchStart;
            var originalmouseDown = sv.mouseDown;
            var originaltouchMove = sv.touchMove;
            var originalmouseMove = sv.mouseMove;

            container.removeEventListener('touchstart', sv.touchStart);
            container.removeEventListener('mousedown', sv.mouseDown);
            document.removeEventListener('touchmove', sv.touchMove);
            document.removeEventListener('mousemove', sv.mousemove);

            sv.touchStart = function (e) {
                e.preventDefault = function () { }
                if (originalmouseMove) {
                    originaltouchStart.apply(sv, [e]);
                }
            }

            sv.touchMove = function (e) {
                e.preventDefault = function () { }
                if (originalmouseMove) {
                    originaltouchMove.apply(sv, [e]);
                }
            }

            sv.mouseDown = function (e) {
                e.preventDefault = function () { }
                if (originalmouseMove) {
                    originalmouseDown.apply(sv, [e]);
                }
            }

            sv.mouseMove = function (e) {
                e.preventDefault = function () { }
                if (originalmouseMove) {
                    originalmouseMove.apply(sv, [e]);
                }
            }

            container.addEventListener("touchstart", sv.touchStart, false);
            container.addEventListener("mousedown", sv.mouseDown, false);
            document.addEventListener("touchmove", sv.touchMove, false);
            document.addEventListener("mousemove", sv.mouseMove, false);
        });
})
//书城的控制器
.controller('bookcityCtrl', function($state,services,$scope, $stateParams) {
 
//跳转到allbook页面
 $scope.ddd =  function(index,bookid){
  $state.go('allbook',{
    'id':index,
    'bookid':bookid
  },{reload:true}); //跳转刷新 
 }
 //获取书籍的全部数据
 services.allbookcity(function(res){
   $scope.purdata = res.data;
  }) 

})
//书架
.controller('bookjiaCtrl', function($state,services,$scope) {
   services.showshjia(function(res){
   
   var bjdata = res.data;
    $scope.adata = bjdata;
    console.log($scope.adata);
  }) 
})
//写文章控制器
.controller('articeCtrl', function($scope , $stateParams , services , $state) {
  var ImgUrl = [];
//处理post请求的参数
  var formData = {

  data: {"title":'',"body":'',"content":'',"ImgUrl":''}

  }
//监听文章标题
  $scope.$watch('title',function(newval){
  if (newval) {
  formData.data.title = newval;
    }
  })
      $scope.posted = function(){
      formData.data.ImgUrl = angular.toJson(ImgUrl);
      formData.data.body =  editor.txt.html();
      formData.data.content = editor.txt.text();
      if (formData.data.title !='') {
      services.artice(formData , function(result){
      if (1 == result.data.result) {
      editor.txt.clear();
      $state.go('tab.home',{reload:true})
          }   
   });
      }else{
       services.alertPup("请填写文章标题");
          }
     
}
//拿到dom(改进到指令)
  var div = angular.element(document.querySelector("#active-editor"));
  //获取页面的高度为了解决富文本框高度带来的BUG
  var aa = window.screen.height - 125;
       // 初始化富文本框
        var E = window.wangEditor
        var editor = new E('#active-tab', '#active-editor')  // 两个参数也可以传入 elem 对象，class 选择器
        editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'freColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
    ];
    //富文本框发出请求保存写文章插入的图片
    editor.customConfig.uploadImgServer = '/uploadimg';
    editor.customConfig.uploadImgHeaders = {
    'Accept': 'text/x-json'
};
//无用值/参数在后台可用REQ.QUERY.参数名拿到参数值
    editor.customConfig.uploadImgParams = {
    token: 'abcdef12345',
    name:'tupian'
}
    
    editor.customConfig.showLinkImg = false;

    editor.customConfig.uploadImgHooks = {
    success: function (xhr, editor, result) {
    ImgUrl.push(result.data);
    }
}
    editor.customConfig.customAlert = function (info) {
    // info 是需要提示的内容
    alert('自定义提示：' + info)
}
    editor.create();
    //给该div赋值高度（改进到指令）
    div[0].style.height = aa+'px';
     

})
//用户控制器
.controller('userCtrl', function($cordovaFileTransfer,$rootScope,$scope,$cordovaImagePicker,$cordovaCamera,services,$state) {
  //$scope.logined = true;
  //跳转到我的文章页面 可用ionic内置$ionicHistory实现
  $scope.myartice = function(){
  $state.go("myactice");
}

  //路由跳转 可用ionic内置$ionicHistory实现
  $scope.shoucang = function(){
    $state.go("shoucang")
  }
  //路由跳转 可用ionic内置$ionicHistory实现
    $scope.info = function(){
    $state.go("Pinfo");
  }
   ////路由跳转 可用ionic内置$ionicHistory实现
    $scope.artice = function(){
    if( $scope.shifoudenglu == true){
      $state.go("artice");
    }else{
    services.alertPup("请先登录");//ionic内置弹出警告框 已封装到SERVICES里面（方法名alertPup）参数为一个字符串 后期还需封装
    }
    
  }
  //判断是否登录
    services.user(function(result){
    $scope.shifoudenglu = result.data;
    if (true == result.data) {
     $scope.login = false;
     $scope.logined = true;
     $scope.visible = true;
   }else{
     $scope.logined = false;
     $scope.login = true;
     $scope.visible = false;
   }
  });
    //退出登录
      $scope.loginout = function(){
      services.loginout(function(result){
      if (false == result.data) {
      $state.reload();
      };
    })
  }
      $scope.img = {
      url:""
    };
    //用户选择头像
    $scope.uploadimg = function(){
      document.addEventListener("deviceready", function () {

      var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

      $cordovaCamera.getPicture(options).then(function(imageData) {
      
      $scope.img.url = "data:image/jpeg;base64," + imageData;

      }, function(err) {
      // error
      });

    }, false);
    }
      
//上传到服务器保存
/*var server = '/uploadimg';
var filePath = $scope.img.url;
var options = {};
document.addEventListener('deviceready', function () {

    $cordovaFileTransfer.upload(server, filePath, options)
      .then(function(result) {
        console.log(result);
      }, function(err) {
        // Error
      }, function (progress) {
        // constant progress updates
      });

  }, false);*/

   
  })
//个人信息控制器
.controller('PersonalinformationCtrl', function($scope,$state,services) {
  //回退页面 可用ionic内置
  $scope.back = function(){
  history.back();
}
//发送查看用户信息请求
  services.showuserinfo(function(result){
    if (result.data.result == "") {
      return;
    }
    //显示请求回来的数据
  $scope.userinfo.name = result.data.result.name;
  $scope.userinfo.aihao = result.data.result.aihao;
  $scope.userinfo.initr = result.data.result.initr;
  $scope.userinfo.adress = result.data.result.adress;
  $scope.userinfo.guanzhu = result.data.result.guanzhu;
  $scope.sex.choice = result.data.result.sex;
  $scope.xl.choice = result.data.result.xl;
  })
 // 处理post请求的参数
  var formData = {

  data: {"name":'',"aihao":'',"initr":'',"adress":"","guanzhu":"","sex":"","xl":""}

    }
  $scope.userinfo={
  "name":'',
  "aihao":'',
  "initr":'',
  "adress":'',
  "guanzhu":''
 };
//监听用户输入的值
  $scope.$watch('userinfo.name',function(newval){
  if (newval) {
  formData.data.name = newval;
  }
})
  //监听用户输入的值
  $scope.$watch('userinfo.aihao',function(newval){
  if (newval) {
  formData.data.aihao = newval;
}
  })
  //监听用户输入的值
   $scope.$watch('userinfo.initr',function(newval){
  if (newval) {
   formData.data.initr = newval;
  }
  })
   //监听用户输入的值
   $scope.$watch('userinfo.adress',function(newval){
   if (newval) {
   formData.data.adress = newval;
 }
  })
   //监听用户输入的值
   $scope.$watch('userinfo.guanzhu',function(newval){
   if (newval) {
   formData.data.guanzhu = newval;
}
  })
   $scope.sex = {
   "choice":""
}; 
   $scope.xl = {
   "choice":""
}; 
//监听用户输入的值
   $scope.$watch('sex.choice',function(newval){
   if (newval) {
   formData.data.sex = newval;
 }
  })
   //监听用户输入的值
    $scope.$watch('xl.choice',function(newval){
    if (newval) {
    formData.data.xl = newval;
}
  })
    //提交用户详细资料的数据到数据库
    $scope.title = false;
    $scope.userinfodata;
    $scope.submit = function(){
    services.userinfo(formData,function(result){
    $scope.title = true;
    $scope.userinfodata = result.data.result;
    if (1 == result.data.res) {
    $scope.titlew = '修改个人资料成功';
    setTimeout(function(){
    $scope.titlew = '个人资料';
    $scope.$apply();
    },5000)
    }else{
    $scope.titlew = '保存个人资料成功';
    setTimeout(function(){
    $scope.titlew = '个人资料';
    $scope.$apply();
    },5000)
  }
});
}

})
//登录控制器
.controller('loginCtrl', function($scope,$state,services) {
//处理POST请求的参数
 var formData = {

 data: {phone:'aaa_value',password:'bbb_value'}

}
//监听用户名
 $scope.$watch('user.phone',function(newval){
 if (newval) {

 formData.data.phone = newval;

  }
})
 //监听密码
  $scope.$watch('user.password',function(newval){
  if (newval) {

  formData.data.password = newval;

  }
  
})
//提交
  $scope.submit=function(){
  services.login(formData , function(result){
  if (1 == result.data) {
  $state.go("tab.user");
    };
   });
  }
})
//注册控制器
.controller('registerCtrl', function($scope,$state,$stateParams,services) {
 $state.params.name;
//处理POST请求的参数
  var formData = {

  data: {phone:'aaa_value',password:'bbb_value'}

}
//监听用户名
  $scope.$watch('user.phone',function(newval){
  if (newval) {
  formData.data.phone = newval;
  }
  
})
  //监听密码
  $scope.$watch('user.password',function(newval){
  if (newval) {
  formData.data.password = newval;
  }
  
})
  //提交
  $scope.submit=function(){
  services.register(formData,function(result){
  if (-1 == result.data) {
  console.log("手机号已经存在了");
  }else{
  $state.go("login")
  console.log("注册成功");
  }
})
}
})
//显示文章
.controller('showarticeCtrl', function($ionicPopup,services,$interval,$scope , $state , $stateParams) {

})
//收藏文章
.controller('shoucangCtrl', function(services,$interval,$scope , $state , $stateParams) {
services.myshoucang(function(res){
  $scope.scdata = res.data;
})
$scope.back = function(){
  history.back();
}
})
//我的文章
.controller('myacticeCtrl', function(services,$interval,$scope , $state , $stateParams) {
services.myactice(function(res){
  $scope.wzdata = res.data;
 //console.log(res.data);
})
$scope.back = function(){
  history.back();
}
})
//查看他人信息
.controller('showperinfoCtrl', function(services,$interval,$scope , $state , $stateParams) {
$scope.back = function(){
  history.back();
}
var swiper = new Swiper('#showperinfo',{
     scrollbar:'.swiper-scrollbar' ,
     scrollbarHide : false,
     scrollbarDraggable : true ,
     scrollbarSnapOnRelease : true ,
  }); 
//发送查看他人文章
services.lookuserartice($state.params.userid,function(res){
  $scope.wzdata = res.data;
 //console.log(res.data);
})
//发送查看他人收藏
services.lookscang($state.params.userid,function(res){
  $scope.scdata = res.data.result;
});
//发送查看他人详细资料
services.lookuserinfo($state.params.userid,function(res){
  $scope.userdata = res.data.result;
})

})
//回复评论列表
.controller('ReplyCtrl', function(services,$interval,$scope , $state , $stateParams) {
$scope.reback = function(){
   history.back();
}

  //获取所有评论的列表
services.fuhuilist($state.params.plcontent,$state.params.userid,$state.params.articeid,function(result){
  $scope.data = result.data;
  $scope.pluserid = result.data._id;
  services.showfuhuilist($scope.pluserid,function(res){
 $scope.huifupldata = res.data.huifu;

})
})

})
//评论
.controller('pinglunCtrl', function($http,$rootScope,$ionicActionSheet,$interval,$scope , $state , $stateParams,services) {
 //下拉刷新
 $scope.pinglunlist = [];
$scope.doRefresh = function() {
    $http.get('/showpinglun?articeid='+$state.params.articeid)
     .success(function(newItems) {
      $scope.pinglunlist = newItems;
     })
     .finally(function() {
       // 停止-广播ion-refresher
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
  //上拉刷新
$scope.newsList = {
    hasmore: true,
    pageIndex: 0,
}; 
$scope.bool = false;
$scope.time = 0;
  $scope.loadMore = function() {
    setTimeout(function(){
       $http.get('/moredpinglun?articeid=' + $state.params.articeid+'&pageIndex=' + $scope.newsList.pageIndex)
    .success(function(items) {
      console.log(items);
      $scope.time = 1000;
       
      if (items.length > 0) {
        angular.forEach(items,function(data,index,array){
        $scope.pinglunlist.push(data);
      })
          $scope.newsList.pageIndex++;
          if (items.length < $scope.newsList.pageIndex) {
          $scope.newsList.hasmore = false;
          }
         
      }else{
        $scope.bool = true;
        $scope.newsList.hasmore = false;
      }
     
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  },$scope.time)
   
  };

 /* $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });*/
 //是否登录
 services.sfdl(function(result){
  $scope.sfdl = result;
 })
$scope.username = "请输入你的评论";
$scope.dianzanbool = false;
//处理post请求参数
  var diandata = {
  data:{'articeid':$state.params.articeid , 'bool':'','plid':''}
  }
  //判断是否已经点赞
$scope.dianzan = function(index,plid,event){
    $scope.dianzansl = index;
     diandata.data.plid = plid;
if (true == $scope.dianzanbool) {
    diandata.data.bool = true;
    services.dianzan(diandata,function(result){
    //console.log(result);
    $scope.dianzanbool = false;
  })
}else{
   diandata.data.bool = false;
  services.dianzan(diandata,function(result){
   // console.log(result);
    $scope.dianzanbool = true;
  })
}
  event.stopPropagation();

}
//对应文章评论的文章的_id
$scope.xdactive = $state.params.articeid;
$scope.back = function(){
   history.back();
}
//回复评论
$scope.huifu=function(event,username,userid , plid){
  formData.data.plid = plid;
  formData.data.userid = userid;
 event.stopPropagation();
 //初始化上拉菜单
  var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: '<b><i class="ion-reply"> 回复评论</i></b>' },
       { text: '<b><i class="ion-thumbsdown"> 踩评论</i></b>' }
     ],
     destructiveText: '<i class="ion-alert-circled"> 举报</i>',
     titleText: '操作评论',
     cancelText: '取消',
     cancel: function() {
        },
     destructiveButtonClicked:function(){
      console.log('被删除');
     },
     buttonClicked: function(index) {
      $scope.index = index;
      if (index == 0) {
       $scope.username = '回复' + username + '的评论';
       $scope.shouldBeOpen = true;
      };
       return true;
     }
   });
}
//显示用户
$scope.showuser = function(userid,$event){
   $state.go('showperinfo',{
          'userid':userid
        });
  $event.stopPropagation();
}
 
$scope.back = function(){
        history.back();
      }
//显示评论列表
/*services.showpinglun($state.params.articeid , function(result){
 
  $scope.pinglunlist = result.data;
});*/

//处理post请求参数
  var formData = {
  data: {"content":'',"articeid":$state.params.articeid , "userid":'' , 'plid':''}
    }
      $scope.$watch('pinglun',function(newval){
        formData.data.content = newval;
      });
      $scope.$watch('index',function(newval){
        $scope.index = newval;
      });
      //保存评论
      $scope.pinglun = '';
     $scope.submit = function(){
      if (!$scope.sfdl.data) {
        services.alertPup("原因是你未登录");
        return;
      };
      if(formData.data.content != ''){
      if($scope.index == 0){
        services.huifupl(formData,function(result){
           $scope.pinglun = '';
          $scope.index = 2;
        })
        
         $scope.username = '请输入你的评论';
        return;
      }
        services.pinglun(formData,function(result){
       if('-1' == result.data){
        services.alertPup("您已经发过该评论了");
       }else{
        services.alertPup("评论成功");
        services.showpinglun($state.params.articeid , function(result){
 
  $scope.pinglunlist = result.data;
});
       }
       $scope.pinglun = '';
        })
      }else{
      services.alertPup("内容不能为空");
      }
      
     }

})


//获取焦点
.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        
            element.bind('blur', function () {
               // console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
}])
//星级评价(尝试使用编译（$complies）依然不能解决问题（bug）)
.directive("mystarselect", function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            level: '=',
        },
        template: '<div id="mystarselect"></div>',
        link: function (scope) {

            function star5(starid) {
                src = "img/";
                this.star_on_left = src + "starBack.png";
                this.star_off_left = src + "star.png";
                this.star_on_right = src + "starBack.png";
                this.star_off_right = src + "star.png";
                this.id = starid;
                this.point = 0;

                this.initial = starInitial;
                this.redraw = starRedraw;
                this.attach = starAttach;
                this.deattach = starDeAttach;
                this.doall = starDoall;
            }

            function starDoall(point) {
                this.initial();
                this.attach();
                this.redraw(point);
            }

            function starInitial() {
                var html = "<div style='float:left'>" +
                    "<img id='star" + this.id + "_1' point='1' src='" + this.star_off_right + "'> ";
                html += "<img id='star" + this.id + "_2' point='2' src='" + this.star_off_right + "'> ";
                html += "<img id='star" + this.id + "_3' point='3' src='" + this.star_off_right + "'> ";
                html += "<img id='star" + this.id + "_4' point='4' src='" + this.star_off_right + "'> ";
                html += "<img id='star" + this.id + "_5' point='5' src='" + this.star_off_right + "'>" + "</div>";
                //document.write(html);
                document.getElementById("mystarselect").innerHTML = html;
            }

            function starAttach() {
                for (var i = 1; i < 6; i++) {
                    document.getElementById("star" + this.id + "_" + i).style.cursor = "pointer";
                    document.getElementById("star" + this.id + "_" + i).onmouseover = moveStarPoint;
                    document.getElementById("star" + this.id + "_" + i).onmouseout = outStarPoint;
                    document.getElementById("star" + this.id + "_" + i).starid = this.id;
                    document.getElementById("star" + this.id + "_" + i).onclick = setStarPoint;
                }
            }

            function starDeAttach() {
                for (var i = 1; i < 6; i++) {
                    document.getElementById("star" + this.id + "_" + i).style.cursor = "default";
                    document.getElementById("star" + this.id + "_" + i).onmouseover = null;
                    document.getElementById("star" + this.id + "_" + i).onmouseout = null;
                    document.getElementById("star" + this.id + "_" + i).onclick = null;
                }
            }

            function starRedraw(point) {
                for (var i = 1; i < 6; i++) {
                    if (i <= point)
                        if (parseInt(i / 2) * 2 == i)
                            document.getElementById("star" + this.id + "_" + i).src = this.star_on_right;
                        else
                            document.getElementById("star" + this.id + "_" + i).src = this.star_on_left;
                    else if (parseInt(i / 2) * 2 == i)
                        document.getElementById("star" + this.id + "_" + i).src = this.star_off_right;
                    else
                        document.getElementById("star" + this.id + "_" + i).src = this.star_off_left;
                }
            }

            function moveStarPoint(evt) {
                var pstar = evt ? evt.target : event.toElement;
                var point = pstar.getAttribute("point");
                var starobj = new star5(pstar.starid);
                starobj.redraw(point);
            }

            function outStarPoint(evt) {
                var pstar = evt ? evt.target : event.srcElement;
                var starobj = new star5(pstar.starid);
                starobj.redraw(0);
            }

            function setStarPoint(evt) {
                var pstar = evt ? evt.target : event.srcElement;
                var starobj = new star5(pstar.starid);
                starobj.deattach();
                var n = pstar.getAttribute("point");
                console.log("选择的等级:" + n);
                scope.level = n;
                starobj.doall(n);
            }

            var star = new star5("point");
            star.doall(5);
        }
    };
})
//显示文章
.directive('appTab', ['$timeout','$ionicScrollDelegate','$rootScope','$ionicPopup',"$sce",'$compile','$state','services',function($timeout,$ionicScrollDelegate,$rootScope,$ionicPopup,$sce,$compile,$state , services){
    return {
    restrict: 'A',
    replace: true,
    templateUrl: 'dircter/showarticeD.html',
    scope:{},
    link:function(scope,element){
      console.log(element);
      scope.bool = true;
        scope.hq = function(){
          setTimeout(function(){
            var view= $ionicScrollDelegate.$getByHandle('mainScroll');
         if(view.getScrollPosition().top <= 0){
          console.log(8)
          scope.bool = true;
         }else if(view.getScrollPosition().top >=40){
          console.log(9);
          scope.bool = false;
         } 
         scope.$apply();
       },50)
       
      } 
      scope.$watch('bool',function(newval){
       scope.bool = newval;
      })
      $timeout(function(){
         $ionicScrollDelegate.resize();
       },100)
       scope.$on('$ionicView.enter', function (e) {
        console.log(5);
         $ionicScrollDelegate.resize();
       })
       
      //路由跳转
      scope.lookuserinfo = function(){
        $state.go('showperinfo',{
          'userid':$state.params.user
        });
      }
       //路由跳转
      scope.pinglun = function(){
        $rootScope.$broadcast('to_checkout', 'shop_list_data');
        $state.go("pinglun",{
          articeid:$state.params.userid,
          sfdl:scope.zantonbool
        })
      }
//查看作者的详细资料
      services.showauthorinfo($state.params.user,function(result){
       scope.usertitle = result.data.name;
       scope.usermiaoshu = result.data.initr;
      })
      //路由跳转
      scope.back = function(){
        $state.go("tab.home");
      }
    scope.ztshu = 0;
    var id = $state.params.userid;
    services.showuseractice(id,function(result){
    scope.title = result.data.title;  
    scope.currentWork = result.data.body;
    scope.ztshu = result.data.zantong;
    scope.description = $sce.trustAsHtml(scope.currentWork);
    
});
    //是否登录
    services.sfdl(function(result){

      if (false == result.data) {
        scope.zantonbool = true;
       // $state.reload();
      }else{
      services.sftp(id , function(result){
      if ('-1' == result.data.res) {
      scope.zantonbool = true ;
      }else{
      scope.zantonbool = false;
      }
    })
      }
      scope.login = result.data;
    })
    //是否登录
    scope.$watch('login',function(newval){
      if (newval) {
         scope.login = newval;
      };
    })

    //是否收藏
    scope.shoucang = true;
    services.sfshoucang(id,function(result){
      //console.log(result);
      if('true' == result.data){
        scope.shoucang = false;
      }else{
        scope.shoucang = true;
      }
    })

    scope.shoucangwz = "收藏"
    
    scope.shoucangx = function(){
      //解决第一次不能点击问题
      setTimeout(function(){
      //是否为文章作者 如果是就不收藏否则允许收藏
      services.shoucang(scope.shoucang,id,function(result){
     // console.log(result);
      if (1 == result.data) {
      services.alertPup("你是原作者");
      return;
       }
      });
        scope.$apply();
      },100)
      
      //如果已经登录
      if(scope.login){
      if (scope.shoucang == true) {
      scope.shoucang = false;
      scope.shoucangwz = "已收藏"
      }else{
      scope.shoucang = true;
      scope.shoucangwz = "收藏"

      }
    }else{
         services.alertPup("原因是你未登录");
    }
    }
    //是否感谢
    scope.ganxie = true;
    services.sfganxie(id,function(result){
      if ('true' == result.data) {
      scope.ganxie = false;
      }else{
      scope.ganxie = true;
      }
    })
    
    scope.ganxiewz = "感谢"
    
    scope.ganxieh = function(){
      services.ganxie(id,scope.ganxie , function(result){
       // console.log(result);
      })
    if (scope.ganxie == true) {
    scope.ganxie = false;

    scope.ganxiewz = "已感谢"
      }else{
    scope.ganxie = true;
    scope.ganxiewz = "感谢"
      }
    }
    //是否赞同
    var zt;
    scope.zantong = function(){
       //如果未登录
      if (!scope.login) {
       services.alertPup("原因是你未登录");
        return;
      };
      if (true == scope.zantonbool) {
        //console.log(scope.zantonbool);
        zt = 1;
        //console.log(scope.zantonbool);
        scope.zantonbool = false;
        scope.ztshu =  scope.ztshu + 1
       
      }else{
        // console.log(scope.zantonbool);
        zt = -1;
        //console.log(scope.zantonbool);
        scope.ztshu =  scope.ztshu - 1
        scope.zantonbool = true;
       
      }
      //是否投票
       services.toupiao(id,zt,function(result){
        })
    }
  }

  };
}]);