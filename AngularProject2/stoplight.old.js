angular.module('cityRoads', [])

  .controller('MainController', function($scope, $timeout, $interval) {
    //mode can be 'manual', or 'auto'
    $scope.mode = "manual";
    $scope.eastWestLightColor = "green";
    $scope.northSouthLightColor = "red";
    $scope.setManualMode = setManualMode;
    $scope.setAutoMode = setAutoMode;
    $scope.activeLightColor = activeLightColor;
    $scope.roads = [
                      {direction: 'west', streetDirection: 'eastWest'},
                      {direction: 'north', streetDirection: 'northSouth'},
                      {direction: 'east', streetDirection: 'eastWest'},
                      {direction: 'south', streetDirection: 'northSouth'}
                    ];

    function setManualMode() {
      $scope.mode = "manual";
      clearAutoMode();
      toggleLights();
    }

    function setAutoMode () {
      $scope.mode = "auto";
      clearAutoMode();
      toggleLightsPromise = $interval(function() {
        toggleLights();
      }, 5000);
      toggleLights();
    }

    // Return the color class if given color is active, else return ""
    function activeLightColor(streetDirection, color) {
      return $scope[streetDirection + 'LightColor'] == color ? color : "";
    }

    // Private
    var toggleLightsPromise;
    function clearAutoMode() {
      if (toggleLightsPromise) $interval.cancel(toggleLightsPromise);
    }

    function toggleLights() {
      ['eastWestLightColor', 'northSouthLightColor'].forEach( light => {
        if ($scope[light] == "green") $scope[light] = "yellow";
        $timeout(function() {
          $scope[light] = $scope[light] == "red" ? "green" : "red";
        }, 1500);
      });
    }
  });