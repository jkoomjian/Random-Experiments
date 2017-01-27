// Vendor Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

// Internal Libraries
import Calendar from './Calendar';

// Static Assets
import './cal.scss';

function launch() {
  ReactDOM.render((
    <Provider store={store}>
      <Calendar />
    </Provider>),
    document.getElementById('cal-dock')
  );
}

window.addEventListener('load', function() {
  launch();
});