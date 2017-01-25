import React from 'react';

class CalHeader extends React.Component {

  render() {
    return (
      <h1>
        <a id="prevYear" href="#" onClick={this.props.decYear}>&lsaquo;</a>
        {this.props.currYear}
        <a id="nextYear" href="#" onClick={this.props.incYear}>&rsaquo;</a>
      </h1>
    );
  }

};

export default CalHeader;