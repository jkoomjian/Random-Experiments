var angApp = angular.module('angApp', ['ngRoute']);


angApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'cntrlPanel.html'
    })
    .when('/scoreboard', {
      templateUrl: 'scoreboard.html'
    })
    .otherwise({
      redirectTo  :'/'
    });
});

angApp.factory('socketioService', function() {
  //singleton - this object is only instantiated once
  return {
    publishEvent: function() {
    }
  };
});

angApp.controller('cntrlPanelController', function($scope, $route, $routeParams, $location, socketioService) {
  $scope.puCount = 0;
  $scope.compName = undefined;
  $scope.startComp = startComp;
  $scope.incCount = incCount;
  $scope.setCompName = setCompName;
  $scope.$route = $route;
  $scope.$routeParams = $routeParams;
  $scope.$location = $location;

  function startComp() {
    //Normally you would use ng-model on compName input. But when the routes are switched,
    //the input is cleared, clearing $scope.compName
    //this is a hack to get around the problem :(
    $scope.compName = document.getElementById('name').value;
    console.log(`name is: ${$scope.compName}`);
    $scope.puCount = 0;
  }

  function incCount() {
    console.log('at inc count, count is: ' + $scope.puCount);
    $scope.puCount = $scope.puCount + 1;
    socketioService.publishEvent();
    return false;
  }

  function setCompName() {
  }
});