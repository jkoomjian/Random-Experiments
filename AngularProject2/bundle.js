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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// The imported module variable are set as dependencies in the app
	// var stopLightApp = angular.module('cityRoads', ['stopLightServicesModule', 'stopLightDirectivesModule', 'stopLightControllersModule']);
	var stopLightApp = angular.module('cityRoads', [_stoplightServices2.default, _stoplightDirectives2.default, _stoplightControllers2.default]); // Importing the module objects from the js files

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

/***/ }
/******/ ]);