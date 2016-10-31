const mod = angular.module('stopLightDirectivesModule', []);

/*----------- Directives ----------------*/
// change colors based on stopLightService.
// uses attribute to determine which direction the stop light will use.
mod.directive('stopLightRoad', function($templateCache, stopLightService){
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'templates/stoplight.html',
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

mod.directive('lightModeButton', function(stopLightService) {
  return {
    restrict: 'E',
    replace: true,  // replace the directive element
    scope: true,  // create a new child scope
    templateUrl: "templates/lightmodebutton.html",
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

// export default mod.name