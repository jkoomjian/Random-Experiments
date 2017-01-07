// Importing the module objects from the js files
import stopLightDirectives from './stoplight-directives';
import stopLightServices from './stoplight-services';
import stopLightControllers from './stoplight-controllers';

// Import other assets
import css from '../stoplight.less';


// The imported module variable are set as dependencies in the app
var stopLightApp = angular.module('cityRoads', [stopLightServices, stopLightDirectives, stopLightControllers]);