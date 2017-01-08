// Import libraries
import angular from 'angular';
import {buttons} from 'bootstrap-css';

// Import static assets
import css from '../stoplight.less';

// Importing the module objects from the js files
import stopLightDirectives from './stoplight-directives';
import stopLightServices from './stoplight-services';
import stopLightControllers from './stoplight-controllers';


// The imported module variable are set as dependencies in the app
var stopLightApp = angular.module('cityRoads', [stopLightServices, stopLightDirectives, stopLightControllers]);