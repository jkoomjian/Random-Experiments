//TODO
//move all state to scope


var stopLightApp = angular.module('cityRoads', ['stopLightServiceModule']);

/*----------- Services ----------------*/

//wrapped in its own module
var stopLightServiceModule = angular.module('stopLightServiceModule', []);

//Stoplight Direction can be "NorthSouth" or "EastWest"
stopLightServiceModule.service('stopLightService', function($rootScope, $timeout, $interval) {

  // holds value that indicates the direction of traffic. North/South and East/West
  var stopLightDirection = "NorthSouth";
  var stopLightSwitchInProgress = false;

  //mode can be 'manual', or 'auto'
  var stopLightMode = "manual";
  var toggleLightsPromise;


  /* ------------- Private --------------*/

  // Return true/false if the given color is active for the given street direction
  var getActiveLightColor = function(streetDirection) {
    if (streetDirection == stopLightDirection) {
      return stopLightSwitchInProgress ? "yellow" : "green";
    } else {
      return "red";
    }
    return currLightColor == color;
  };

  var clearAutoMode = function () {
    if (toggleLightsPromise) $interval.cancel(toggleLightsPromise);
  };


  /* ------------- Public --------------*/

  // Return true if the given color is active
  this.isLit = function(streetDirection, color) {
    return getActiveLightColor(streetDirection) == color;
  };

  this.getMode = function() {
    return stopLightMode;
  };

  this.setMode = function(mode) {
    clearAutoMode();
    stopLightMode = mode;
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

  this.startAutoMode = function() {
    toggleLightsPromise = $interval( () => {
      this.toggleLights(true);
    }, 5000);
    this.toggleLights();
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