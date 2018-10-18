import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './UserStatus.css';

class UserStatus extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status: props.status,
      editable: props.editable
    };
  }

  render() {
    return(
      <div className="userstatus" data-status={this.state.status.name} onClick={this.handleClick}>
        {this.state.status.content}
      </div>
    );
  }

  handleClick = () => {
    this.setState(UserStatus.cycleStatus);
  }
};

UserStatus.propTypes = {
  status: PropTypes.object,
  editable: PropTypes.bool
};

UserStatus.USER_STATUS_TYPES = [{
  name: 'empty',
  code: 0,
  content: ''
}, {
  name: 'available',
  code: 1,
  content: '&#x2714;'
}, {
  name: 'unavailable',
  code: 2,
  content: '&#x2718;'
}];

UserStatus.defaultProps = {
  status: UserStatus.USER_STATUS_TYPES[0]
};

UserStatus.cycleStatus = function(state) {
  const nextStatusCode = (state.status.code + 1) % UserStatus.USER_STATUS_TYPES.length;
  return {
    status: UserStatus.USER_STATUS_TYPES.find(status => status.code === nextStatusCode)
  };
}

export default UserStatus;