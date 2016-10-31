const mod = angular.module('stopLightServicesModule', [])

  /*----------- Services ----------------*/

  //Stoplight Direction can be "NorthSouth" or "EastWest"
  .service('stopLightService', function($rootScope, $timeout, $interval) {

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
    this.toggleLights = function() {
      $timeout(function() {
        // Wrapped in a $timeout to ensure the stopLightSwitchInProgress update always occurs within the
        // $digest lifecycle. Avoids a manual call to $digest, which will fail in auto mode, where
        // toggleLighes is called in a $interval, and therefore already within the $digest cycle
        stopLightSwitchInProgress = true;
      }, 0);
      $timeout(function() {
        stopLightDirection = stopLightDirection == "NorthSouth" ? "EastWest" : "NorthSouth";
        stopLightSwitchInProgress = false;
      }, 1500);
    };

    this.startAutoMode = function() {
      toggleLightsPromise = $interval( () => {
        this.toggleLights();
      }, 5000);
      this.toggleLights();
    };

  });

// export default mod.name