import React from 'react';

class CalMonthDays extends React.Component {

  render() {
    const datesElems = this.props.monthData.dates.map( date => {
      return <div key={date.key} className={`day ${date.dayOfWeek} in-month-${date.inMonth}`}>{date.date}</div>;
    });

    return (
      <div className="days">
        {datesElems}
      </div>
    );
  }

}

export default CalMonthDays;