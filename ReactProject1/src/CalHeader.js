import React from 'react';
import { connect } from 'react-redux';
import Constants from './Constants';

class CalHeader extends React.Component {

  incYear(amt) {
    this.props.updateYear(this.props.currYearX + amt);
  }

  render() {
    return (
      <h1>
        <a id="prevYear" href="#" onClick={() => this.incYear(-1)}>&lsaquo;</a>
        {this.props.currYearX}
        <a id="nextYear" href="#" onClick={() => this.incYear(1)}>&rsaquo;</a>
      </h1>
    );
  }

}

// Map props to redux
const mapStateToProps = function(store, ownProps) {
  return {
    currYearX: store.currYearX
  };
};

// Map handlers to redux
// ownProps are the props passed from the parent component, not the component props/state
const mapDispatchToProps = function(dispatch, ownProps) {

  return {
    updateYear: function(newYear) {
      dispatch({
        type: Constants.UPDATE_CURR_YEAR,
        curr_year: newYear
      });
    }
  };

};

export default connect(mapStateToProps, mapDispatchToProps)(CalHeader);