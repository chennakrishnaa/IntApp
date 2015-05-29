'use strict';

angular.module('yoangularApp').controller('BorrowerCtrl',
    function($scope) {
        //$scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
        $scope.borrower = {name:'venkatarao'};
        $scope.master = {};
        $scope.update = function(borrower) {
            console.log('update');
            $scope.master = angular.copy(borrower);
            console.log($scope.master);
          };
        $scope.reset = function() {
            console.log('reset');
            $scope.borrower = angular.copy($scope.master);
          };
        $scope.isUnchanged = function(borrower) {
            return angular.equals(borrower, $scope.master);
          };
        $scope.reset();
      });