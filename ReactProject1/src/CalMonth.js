// Vendor Libraries
import React from 'react';
import moment from 'moment';

// Internal Libraries
import CalMonthDays from './CalMonthDays';
import CalMonthDayNames from './CalMonthDayNames';

class CalMonth extends React.Component {

  getMonthData(currYear, currMonth) {

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

  render() {
    let monthData = this.getMonthData(this.props.currYear, this.props.currMonth);

    return (
      <div className="month">
        <h2 className='name'>{monthData.currMonthFull}</h2>
        <CalMonthDayNames />
        <CalMonthDays monthData={monthData} />
      </div>
    );
  }
};

export default CalMonth;