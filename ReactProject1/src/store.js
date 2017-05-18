import Constants from './Constants';
import * as Redux from 'redux';
import moment from 'moment';

/** Reducers **/
const currYearReducer = function(state, action) {

  if (action.type == Constants.UPDATE_CURR_YEAR) {

    if (state === undefined) {
      return moment().year();
    } else {
      return action.curr_year;
    }

  }

  return state;
};

// This isn't doing anything here, but it will be useful once there are multiple reducers
const reducers = Redux.combineReducers({
  currYearX: currYearReducer
});

/** Store **/
const store = Redux.createStore(reducers);

export default store;