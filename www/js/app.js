// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','validation','starter.controllers', 'starter.services','ngCordova' ])
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard'); 
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center'); 
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');        
    
    $ionicConfigProvider.platform.ios.views.transition('ios'); 
    $ionicConfigProvider.platform.android.views.transition('android');


})
.run(function($ionicPlatform,$ionicGesture) {

  $ionicGesture.on('touchend', function(e){
      e.cancelable = false;
      e.defaultPrevented = true;
      return true;
    }, angular.element(document));
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $ionicPlatform.registerBackButtonAction(function(e) {
    var current_state_name = $state.current.name;
    if(current_state_name !== 'sidemenu.post'
     && current_state_name !== 'sidemenu.contact_town' &&
    current_state_name !== 'sidemenu.contact_people'){
        $ionicPopup.confirm({
            title: '退出应用',
            template: '您确定要退出xxxx吗?'
        }).then(function (res) {
            if (res) {
                //ionic.Platform.exitApp();
                navigator.app.exitApp();
            } else {
                console.log('You are not sure');
            }
        });
        e.preventDefault();
        return false;
    }else{
        navigator.app.backHistory();
    }
},100);
})

.config(['$validationProvider', function($validationProvider) {
  var expression = {
    phone: /^1[\d]{10}$/,
    password: function(value) {
      var str = value + ''
      return str.length > 5;
    },
    required: function(value) {
      return !!value;
    }
  };
  var defaultMsg = {
    phone: {
      success: '',
      error: '必须是11位手机号'
    },
    password: {
      success: '',
      error: '长度至少6位'
    },
    required: {
      success: '',
      error: '不能为空'
    }
  };
  $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        cache:false,
        controller: 'homeCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.user', {
    url: '/user',
    views: {
      'tab-user': {
        templateUrl: 'templates/user.html',
        controller: 'userCtrl'
      }
    }
  })
  //显示文章路由
  .state('showartice', {
    url: '/showartice/:userid/:user',
        templateUrl: 'templates/showartice.html',
        reload:true,
        controller: 'showarticeCtrl'
  })
   .state('pinglun', {
    url: '/pinglun/:articeid/:sfdl',
        templateUrl: 'templates/pinlun.html',
        reload:true,
        controller: 'pinglunCtrl'
  })
   .state('Pinfo', {
    url: '/Pinfo',
        templateUrl: 'templates/Personalinformation.html',
        controller: 'PersonalinformationCtrl'
  })
   .state('Reply', {
    url: '/Reply/:userid/:articeid/:plcontent',
        templateUrl: 'templates/Replytocommentlist.html',
        controller: 'ReplyCtrl'
  })
    .state('artice', {
    url: '/actice',
        templateUrl: 'templates/artice.html',
        controller: 'articeCtrl'
  })
  .state('login', {
    url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
  })
   .state('reg', {
    url: '/reg/:name',
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
  })
   .state('shoucang', {
    url: '/shoucang',
        templateUrl : 'templates/shoucang.html',
        controller  :  'shoucangCtrl'
  })
   .state('myactice', {
    url: '/myactice',
        templateUrl : 'templates/myartice.html',
        controller  :  'myacticeCtrl'
  })
//查看他人个人信息
    .state('showperinfo', {
    url: '/showperinfo/:userid',
        templateUrl : 'templates/showperinfo.html',
        controller  :  'showperinfoCtrl'
  })
    
    //书城
    .state('tab.bookcity', {
      url: '/bookcity',
      views: {
        'tab-bookcity': {
          templateUrl: 'templates/bookcity.html',
          controller: 'bookcityCtrl'
        }
      }
    })
    //查看全部书籍
    .state('allbook', {
    url: '/allbook/:id/:bookid',
    templateUrl : 'templates/allbook.html',
    cache:false,
    controller  :  'allbookCtrl'
  })
     //查看书架
    .state('bookjia', {
    url: '/bookjia',
    templateUrl : 'templates/bookjia.html',
    controller  :  'bookjiaCtrl'
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/user');

});
