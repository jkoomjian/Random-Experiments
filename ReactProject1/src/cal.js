// Vendor Libraries
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';

// Internal Libraries
import calTemplate from './cal-template.handlebars';

// Static Assets
import './cal.scss';


//----Global State---------------------------------
// var currYear = moment().year();


//----React---------------------------------

// create a calendar component
// header bar
// months, dates

var Calendar = React.createClass({

  incYear: function() {
    return this.changeYear(1);
  },

  decYear: function() {
    return this.changeYear(-1);
  },

  changeYear: function(amt) {
    this.setState({
      currYear: this.state.currYear + amt
    });
    return false;
  },

  getInitialState: function() {
    return {
      currYear: moment().year()
    };
  },

  render: function() {
    return (
      <div>
        <CalHeader currYear={this.state.currYear} incYear={this.incYear} decYear={this.decYear} />
        <CalMonths currYear={this.state.currYear} />
      </div>
    );
  }

});


var CalHeader = React.createClass({

  render: function() {
    return (
      <h1>
        <a id="prevYear" href="#" onClick={this.props.decYear}>&lsaquo;</a>
        {this.props.currYear}
        <a id="nextYear" href="#" onClick={this.props.incYear}>&rsaquo;</a>
      </h1>
    );
  }

});

var CalMonths = React.createClass({
  render: function() {
    return (
      <div className='months'>
      </div>
    );
  }
});

// var CalMonth = React.createClass({
//   render: function() {
//     return (
//       <div class="month">
//         <h2 class='name'>{{this.currMonthFull}}</h2>
//         <CalMonthDayNames />
//         <CalMonthDays />
//       </div>
//     );
// });
//
// var CalMonthDayNames = React.createClass({
//   render: function() {
//     return (
//       <div class='day-names'>
//         {{#each ../daysOfWeek}}
//           <div class='day-name {{this}}'>{{this}}</div>
//         {{/each}}
//       </div>
//     );
// });
//
// var CalMonthDays = React.createClass({
//   render: function() {
//     return (
//       <div class="days">
//         {{#each dates}}
//           <div class='day {{dayOfWeek}} in-month-{{inMonth}}'>{{date}}</div>
//         {{/each}}
//       </div>
//     );
// });


function launch() {
  ReactDOM.render(
    <Calendar />,
    document.getElementById('cal-dock')
  );
}






//----Old---------------------------------
function getCalData() {
  let out = {daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
              currYear: currYear,
              months: []
            };

  for (let i=0; i<12; i++) {

    let monthData = {};
    monthData.currMonthFull = moment({year: currYear, month: i, date: 1}).format("MMMM");
    monthData.currMonthShort = moment({year: currYear, month: i, date: 1}).format("MMM");
    monthData.dates = [];

    let firstOfMo = moment({year: currYear, month: i, date: 1});
    let daysInMo = firstOfMo.clone().endOf("month").date();
    let sunBeforeMo = firstOfMo.day(-0);
    let satAftereMo = moment({year: currYear, month: i, date: daysInMo}).day(6);

    let currDay = sunBeforeMo.clone();
    currDay.add(-1, 'days');

    do {
      currDay.add(1, 'days');

      // console.log("procesing page: ", currDay.format());
      monthData.dates.push({
        dayOfWeek: currDay.format("ddd"),
        date: currDay.format("D"),
        inMonth: currDay.format("M") == (i + 1) ? "true" : "false"
      });

    } while(!currDay.isSame(satAftereMo))

    out.months.push(monthData);
  }

  return out;
}

window.addEventListener('load', function() {
  launch();
});
