/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stoplightDirectives = __webpack_require__(1);

	var _stoplightDirectives2 = _interopRequireDefault(_stoplightDirectives);

	var _stoplightServices = __webpack_require__(2);

	var _stoplightServices2 = _interopRequireDefault(_stoplightServices);

	var _stoplightControllers = __webpack_require__(3);

	var _stoplightControllers2 = _interopRequireDefault(_stoplightControllers);

	var _stoplight = __webpack_require__(4);

	var _stoplight2 = _interopRequireDefault(_stoplight);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// The imported module variable are set as dependencies in the app
	// Importing the module objects from the js files
	var stopLightApp = angular.module('cityRoads', [_stoplightServices2.default, _stoplightDirectives2.default, _stoplightControllers2.default]);

	// Import other assets

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// import "templates/lightmodebutton.html";
	// import "templates/stoplight.html";

	var mod = angular.module('stopLightDirectivesModule', []);

	/*----------- Directives ----------------*/
	// change colors based on stopLightService.
	// uses attribute to determine which direction the stop light will use.
	mod.component('stopLightRoad', {
	  templateUrl: 'templates/stoplight.html',
	  bindings: {
	    lightDirection: '@',
	    streetDirection: '@'
	  },
	  //controller, must be wrapped in a function to get access to this
	  controller: function controller(stopLightService) {
	    this.showLight = function (color) {
	      return stopLightService.isLit(this.streetDirection, color) ? "on" : "";
	    };
	  }
	});

	mod.component('lightModeButton', {
	  templateUrl: "templates/lightmodebutton.html",
	  bindings: {
	    mode: '@lightMode',
	    buttonText: '@'
	  },
	  controller: function controller(stopLightService) {
	    var idText = { manual: "toggleLights", auto: "autoLights" };
	    this.buttonId = idText[this.mode];
	    this.isInMode = function () {
	      return stopLightService.getMode() == this.mode;
	    };
	    this.setMode = function () {
	      stopLightService.setMode(this.mode);
	      if (this.mode == 'manual') stopLightService.toggleLights();
	      if (this.mode == 'auto') stopLightService.startAutoMode();
	    };
	  }
	});

	exports.default = mod.name;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var mod = angular.module('stopLightServicesModule', [])

	/*----------- Services ----------------*/

	//Stoplight Direction can be "NorthSouth" or "EastWest"
	.service('stopLightService', function ($rootScope, $timeout, $interval) {

	  // holds value that indicates the direction of traffic. North/South and East/West
	  var stopLightDirection = "NorthSouth";
	  var stopLightSwitchInProgress = false;

	  //mode can be 'manual', or 'auto'
	  var stopLightMode = "manual";
	  var toggleLightsPromise;

	  /* ------------- Private --------------*/

	  // Return true/false if the given color is active for the given street direction
	  var getActiveLightColor = function getActiveLightColor(streetDirection) {
	    if (streetDirection == stopLightDirection) {
	      return stopLightSwitchInProgress ? "yellow" : "green";
	    } else {
	      return "red";
	    }
	    return currLightColor == color;
	  };

	  var clearAutoMode = function clearAutoMode() {
	    if (toggleLightsPromise) $interval.cancel(toggleLightsPromise);
	  };

	  /* ------------- Public --------------*/

	  // Return true if the given color is active
	  this.isLit = function (streetDirection, color) {
	    return getActiveLightColor(streetDirection) == color;
	  };

	  this.getMode = function () {
	    return stopLightMode;
	  };

	  this.setMode = function (mode) {
	    clearAutoMode();
	    stopLightMode = mode;
	  };

	  //toggle the lights value.
	  this.toggleLights = function () {
	    stopLightSwitchInProgress = true;
	    $timeout(function () {
	      stopLightDirection = stopLightDirection == "NorthSouth" ? "EastWest" : "NorthSouth";
	      stopLightSwitchInProgress = false;
	    }, 1500);
	  };

	  this.startAutoMode = function () {
	    var _this = this;

	    toggleLightsPromise = $interval(function () {
	      _this.toggleLights();
	    }, 5000);
	    this.toggleLights();
	  };
	});

	exports.default = mod.name;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var mod = angular.module('stopLightControllersModule', [])

	/*----------- Controllers ----------------*/
	.controller('MainController', function ($scope, stopLightService) {});

	exports.default = mod.name;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".vertical-center {\n  top: 50%;\n  transform: translateY(-50%);\n}\n.vertical-center-rel {\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n}\n.testing {\n  border: 1px dashed red;\n}\nh1 {\n  position: absolute;\n  top: 20px;\n  left: 50px;\n  z-index: 100;\n}\n#stoplight-body {\n  height: 100%;\n  background-color: lightgreen;\n  position: relative;\n  overflow: hidden;\n}\n.road-wrapper {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 50%;\n  padding-right: 42px;\n  transform-origin: right center;\n  background-color: gray;\n}\n.road-part {\n  display: inline-block;\n  vertical-align: middle;\n}\n.road {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  width: 92%;\n  height: 100px;\n  border-top: 3px solid #F2F2F2;\n  border-bottom: 3px solid #F2F2F2;\n  background-color: gray;\n}\n.road:before {\n  content: '';\n  display: block;\n  position: absolute;\n  bottom: 0;\n  height: 48.5px;\n  width: 100%;\n  border-top: 3px dashed yellow;\n}\n.road:after {\n  content: '';\n  display: block;\n  position: absolute;\n  right: 0;\n  width: 9px;\n  border-top: 47px solid gray;\n  border-bottom: 47px solid #F2F2F2;\n}\n.road-end {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  width: 92%;\n  height: 100px;\n  border-top: 3px solid #F2F2F2;\n  border-bottom: 3px solid #F2F2F2;\n  background-color: gray;\n  width: 2%;\n}\n.road-end:before {\n  content: '';\n  display: block;\n  position: absolute;\n  bottom: 0;\n  height: 48.5px;\n  width: 100%;\n  border-top: 3px dashed yellow;\n}\n.road-end:after {\n  content: '';\n  display: block;\n  position: absolute;\n  right: 0;\n  width: 9px;\n  border-top: 47px solid gray;\n  border-bottom: 47px solid #F2F2F2;\n}\n.road-end:before,\n.road-end:after {\n  display: none;\n}\n.road-junction {\n  display: inline-block;\n  vertical-align: middle;\n  width: 40px;\n}\n.road-junction .corner-angle {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n.road-junction .top-corner {\n  width: 40px;\n  height: 40px;\n  position: absolute;\n  top: -37px;\n}\n.road-junction .top-corner:before {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: gray;\n}\n.road-junction .top-corner:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-radius: 0 0 100% 0;\n  background-color: lightgreen;\n  border-right: 3px solid #F2F2F2;\n  border-bottom: 3px solid #F2F2F2;\n}\n.road-junction .bottom-corner {\n  width: 40px;\n  height: 40px;\n  position: absolute;\n  top: -37px;\n  top: auto;\n  bottom: -37px;\n}\n.road-junction .bottom-corner:before {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: gray;\n}\n.road-junction .bottom-corner:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-radius: 0 0 100% 0;\n  background-color: lightgreen;\n  border-right: 3px solid #F2F2F2;\n  border-bottom: 3px solid #F2F2F2;\n}\n.road-junction .bottom-corner:before {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: gray;\n}\n.road-junction .bottom-corner:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-radius: 0 100% 0 0;\n  border-right: 3px solid #F2F2F2;\n  border-top: 3px solid #F2F2F2;\n  border-bottom-width: 0;\n}\n.road-junction .road-junction-center {\n  background-color: gray;\n  height: 100px;\n}\n.road-wrapper.west {\n  transform: rotate(0deg);\n}\n.road-wrapper.north {\n  transform: rotate(90deg);\n}\n.road-wrapper.east {\n  transform: rotate(180deg);\n}\n.road-wrapper.south {\n  transform: rotate(270deg);\n}\n.stoplight {\n  position: absolute;\n  bottom: -60px;\n  right: 0;\n  width: 300px;\n  height: 40px;\n}\n.stoplight .pole {\n  background-color: black;\n  width: 180px;\n  height: 4px;\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n}\n.stoplight .stoplight-box {\n  width: 120px;\n  height: 40px;\n  background-color: #FBD504;\n  border: 1px solid black;\n  border-radius: 10% 20% 20% 10%;\n  position: absolute;\n  right: 0;\n  top: 0;\n  padding-left: 15px;\n}\n.stoplight .stoplight-box .light {\n  border: 1px solid black;\n  border-right-width: 2px;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  display: inline-block;\n  margin: auto;\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n  margin-right: 5%;\n  background-color: #2B2B2B;\n}\n.stoplight .stoplight-box .light.on.red {\n  background-color: #E71C3A;\n}\n.stoplight .stoplight-box .light.on.yellow {\n  background-color: yellow;\n}\n.stoplight .stoplight-box .light.on.green {\n  background-color: #7CD12B;\n}\n.buttons.btn-group {\n  position: absolute;\n  right: 1vw;\n  bottom: 1vw;\n}\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }
/******/ ]);