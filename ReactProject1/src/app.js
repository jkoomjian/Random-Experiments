// Vendor Libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Internal Libraries
import Calendar from './Calendar';

// Static Assets
import './cal.scss';

function launch() {
  ReactDOM.render(
    <Calendar />,
    document.getElementById('cal-dock')
  );
}

window.addEventListener('load', function() {
  launch();
});