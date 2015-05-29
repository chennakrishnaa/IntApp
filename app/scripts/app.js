'use strict';
angular.module('LocalStorageModule').value('prefix', 'myPre');
angular.module('yoangularApp', ['LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/enter',{
        templateUrl:'views/enter.html',
        contorller:'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
