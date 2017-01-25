import React from 'react';

class CalMonthDayNames extends React.Component {

  constructor() {
    super();
    this.daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  }

  render() {
    const daysOfWeekElems = this.daysOfWeek.map( day => {
      return <div key={day} className={`day-name ${day}`}>{day}</div>;
    });

    return (
      <div className='day-names'>
        {daysOfWeekElems}
      </div>
    );
  }
}

export default CalMonthDayNames;