import React from 'react';
import moment from 'moment';

// Internal Libraries
import CalMonths from './CalMonths';
import CalHeader from './CalHeader';

class Calendar extends React.Component {

  constructor() {
    super();
    // Required to make sure the handler gets the right this
    this.incYear = this._incYear.bind(this);
    this.decYear = this._decYear.bind(this);
    this.state = {
      currYear: moment().year()
    }
  }

  _incYear() {
    return this.changeYear(1);
  }

  _decYear() {
    return this.changeYear(-1);
  }

  changeYear(amt) {
    this.setState({
      currYear: this.state.currYear + amt
    });
    return false;
  }

  render() {
    return (
      <div>
        <CalHeader currYear={this.state.currYear} incYear={this.incYear} decYear={this.decYear} />
        <CalMonths currYear={this.state.currYear} />
      </div>
    );
  }

};

export default Calendar;