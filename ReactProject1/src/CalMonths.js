import React from 'react';

// Internal Libraries
import CalMonth from './CalMonth';

class CalMonths extends React.Component {
  render() {

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
};

export default CalMonths;