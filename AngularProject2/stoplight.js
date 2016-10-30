//TODO
//move all state to scope


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


  // Return the color class if given color is active, else return ""
  this.isLit = function(streetDirection, color) {
    return getActiveLightColor(streetDirection) == color;
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
    templateUrl: 'stoplight.html',
    link: function(scope, elem, attrs) {
      scope.lightDirection = attrs["lightDirection"];
      var streetDirection = attrs["streetDirection"];
      scope.streetDirection = streetDirection;
      scope.showLight = function(color) {
        return stopLightService.isLit(streetDirection, color) ? "on" : "";
      };
    }
  };
});

stopLightApp.directive('lightModeButton', function(stopLightService) {
  return {
    restrict: 'E',
    replace: true,  // replace the directive element
    scope: true,  // create a new child scope
    templateUrl: "lightmodebutton.html",
    link: function(scope, elem, attrs) {
      let idText = {manual: "toggleLights", auto: "autoLights"};
      let mode = attrs['lightMode'];
      scope.buttonText = attrs['buttonText'];
      scope.buttonId = idText[mode];
      scope.isInMode = function() {
        return stopLightService.getMode() == mode;
      };
      elem.on('click', function(event) {
        stopLightService.setMode(mode);
        if (mode == 'manual') stopLightService.toggleLights();
        if (mode == 'auto') stopLightService.startAutoMode();
      });
    }
  }
});

/*----------- Controllers ----------------*/
stopLightApp.controller('MainController', function($scope, stopLightService){
});