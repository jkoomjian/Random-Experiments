// light_button_template is a string containing the content of lightmodebutton.html
import light_button_template from '../templates/lightmodebutton.html';
import stoplight_template from '../templates/stoplight.html';

const mod = angular.module('stopLightDirectivesModule', []);

/*----------- Directives ----------------*/
// change colors based on stopLightService.
// uses attribute to determine which direction the stop light will use.
mod.component('stopLightRoad', {
  template: stoplight_template,
  bindings: {
    lightDirection:  '@',
    streetDirection: '@'
  },
  //controller, must be wrapped in a function to get access to this
  controller: function(stopLightService) {
    this.showLight = function(color) {
      return stopLightService.isLit(this.streetDirection, color) ? "on" : "";
    }
  }
});

mod.component('lightModeButton', {
  template: light_button_template,
  bindings: {
    mode: '@lightMode',
    buttonText: '@'
  },
  controller: function(stopLightService) {
    let idText = {manual: "toggleLights", auto: "autoLights"};
    this.buttonId = idText[this.mode];
    this.isInMode = function() {
      return stopLightService.getMode() == this.mode;
    };
    this.setMode  = function() {
      stopLightService.setMode(this.mode);
      if (this.mode == 'manual') stopLightService.toggleLights();
      if (this.mode == 'auto') stopLightService.startAutoMode();
    };
  }
});

export default mod.name