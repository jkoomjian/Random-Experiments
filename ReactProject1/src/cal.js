// Vendor Libraries
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';

// Internal Libraries
import calTemplate from './cal-template.handlebars';

// Static Assets
import './cal.scss';


//----React---------------------------------

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

    let months = [];
    for (let i=0; i<12; i++) {
      months.push(<CalMonth currMonth={i} currYear={this.props.currYear} key={i} />)
    }

    return (
      <div className='months'>
        {months}
      </div>
    );
  }
});

var CalMonth = React.createClass({

  render: function() {
    const monthData = getMonthData(this.props.currYear, this.props.currMonth);

    return (
      <div className="month">
        <h2 className='name'>{monthData.currMonthFull}</h2>
        <CalMonthDayNames />
        <CalMonthDays monthData={monthData} />
      </div>
    );
  }
});


var CalMonthDayNames = React.createClass({
  daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],

  render: function() {

    const daysOfWeekElems = this.daysOfWeek.map( day => {
      return <div key={day} className={`day-name ${day}`}>{day}</div>;
    });

    return (
      <div className='day-names'>
        {daysOfWeekElems}
      </div>
    );
  }
});

var CalMonthDays = React.createClass({
  render: function() {
    const datesElems = this.props.monthData.dates.map( date => {
      return <div key={date.key} className={`day ${date.dayOfWeek} in-month-${date.inMonth}`}>{date.date}</div>;
    });

    return (
      <div className="days">
        {datesElems}
      </div>
    );
  }
});


//---- Logic ---------------------------------
function getMonthData(currYear, currMonth) {

    let monthData = {};
    monthData.currMonthFull = moment({year: currYear, month: currMonth, date: 1}).format("MMMM");
    monthData.currMonthShort = moment({year: currYear, month: currMonth, date: 1}).format("MMM");
    monthData.dates = [];

    let firstOfMo = moment({year: currYear, month: currMonth, date: 1});
    let daysInMo = firstOfMo.clone().endOf("month").date();
    let sunBeforeMo = firstOfMo.day(-0);
    let satAftereMo = moment({year: currYear, month: currMonth, date: daysInMo}).day(6);

    let currDay = sunBeforeMo.clone();
    currDay.add(-1, 'days');

    do {
      currDay.add(1, 'days');

      // console.log("procesing page: ", currDay.format());
      monthData.dates.push({
        dayOfWeek: currDay.format("ddd"),
        date: currDay.format("D"),
        inMonth: currDay.format("M") == (currMonth + 1) ? "true" : "false",
        key: currDay.format("X")  //unix timestamp
      });

    } while(!currDay.isSame(satAftereMo))

  return monthData;
}

function launch() {
  ReactDOM.render(
    <Calendar />,
    document.getElementById('cal-dock')
  );
}

window.addEventListener('load', function() {
  launch();
});