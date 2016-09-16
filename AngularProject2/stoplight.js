var stopLightApp = angular.module('cityRoads', []);

/*----------- Services ----------------*/
//Stoplight Direction can be "NorthSouth" or "EastWest"
stopLightApp.service('stopLightService', function($rootScope, $timeout, $interval) {
  // holds value that indicates the direction of traffic. North/South and East/West
  var stopLightDirection = "NorthSouth";
  var stopLightSwitchInProgress = false;

  //mode can be 'manual', or 'auto'
  var stopLightMode = "manual";
  var toggleLightsPromise;

  // Return true/false if the given color is active for the given street direction
  var getActiveLightColor = function(streetDirection) {
    if (streetDirection == stopLightDirection) {
      return stopLightSwitchInProgress ? "yellow" : "green";
    } else {
      return "red";
    }
    return currLightColor == color;
  };

  //toggle the lights value.
  this.toggleLights = function(skipApply) {
    stopLightSwitchInProgress = true;
    if (!skipApply) $rootScope.$apply();
    $timeout(function() {
      stopLightDirection = stopLightDirection == "NorthSouth" ? "EastWest" : "NorthSouth";
      stopLightSwitchInProgress = false;
    }, 1500);
  };

  // Return the color class if given color is active, else return ""
  this.activeLightColor = function(streetDirection, color) {
    return getActiveLightColor(streetDirection) == color ? color : "";
  };

  this.getMode = function() {
    return stopLightMode;
  };

  this.setMode = function(mode) {
    this.clearAutoMode();
    stopLightMode = mode;
  };

  this.startAutoMode = function() {
    toggleLightsPromise = $interval( () => {
      this.toggleLights(true);
    }, 5000);
    this.toggleLights();
  };

  this.clearAutoMode = function () {
    if (toggleLightsPromise) $interval.cancel(toggleLightsPromise);
  };

});

/*----------- Directives ----------------*/
// change colors based on stopLightService.
// uses attribute to determine which direction the stop light will use.
stopLightApp.directive('stopLightRoad', function($templateCache, stopLightService){
  return {
    restrict: 'E',
    scope: true,
    template: function() {
      return $templateCache.get('stopLightTemplate');
    },
    link: function(scope, elem, attrs) {
      scope.lightDirection = attrs["lightDirection"];
      var streetDirection = attrs["streetDirection"];
      scope.streetDirection = streetDirection;
      scope.activeLightColor = function(color) {
        return stopLightService.activeLightColor(streetDirection, color);
      };
    }
  };
});

// button to toggle stopLightService.
stopLightApp.directive('stopLightSwitchDirective', function(stopLightService){
  return function(scope, elem, attrs) {
    elem.on('click', function(event) {
      stopLightService.setMode('manual');
      stopLightService.toggleLights();
    });
  };
});

stopLightApp.directive('stopLightSwitchDirectiveAuto', function(stopLightService){
  return function(scope, elem, attrs) {
    elem.on('click', function(event) {
      stopLightService.setMode('auto');
      stopLightService.startAutoMode();
    });
  };
});

/*----------- Controllers ----------------*/
stopLightApp.controller('MainController', function($scope, stopLightService){
  $scope.isInMode = function(mode) {
    return stopLightService.getMode() == mode;
  };
});