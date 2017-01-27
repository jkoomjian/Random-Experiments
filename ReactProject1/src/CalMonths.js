import React from 'react';
import { connect } from 'react-redux';

// Internal Libraries
import CalMonth from './CalMonth';

class CalMonths extends React.Component {
  render() {

    let months = [];
    for (let i=0; i<12; i++) {
      months.push(<CalMonth currMonth={i} currYear={this.props.currYearX} key={i} />);
    }

    return (
      <div className='months'>
        {months}
      </div>
    );
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    currYearX: store.currYearX
  };
};

export default connect(mapStateToProps)(CalMonths);