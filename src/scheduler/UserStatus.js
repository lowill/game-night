import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './UserStatus.css';

class UserStatus extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editable: props.editable
    };
  }

  render() {
    return(
      <div className="userstatus" data-status={this.props.status.name} onClick={this.handleClick}>
        {this.props.status.content}
      </div>
    );
  }

  handleClick = () => {
    const nextState = UserStatus.cycleStatus(this.props);
    this.props.onClick(nextState);
  }
};

UserStatus.propTypes = {
  status: PropTypes.object,
  editable: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

UserStatus.USER_STATUS_TYPES = [{
  name: 'empty',
  code: 0,
  content: ' '
}, {
  name: 'available',
  code: 1,
  content: '✔'
}, {
  name: 'unavailable',
  code: 2,
  content: '✘'
}];

UserStatus.defaultProps = {
  status: UserStatus.USER_STATUS_TYPES[0],
  onClick: () => {}
};

UserStatus.cycleStatus = function(state) {
  const nextStatusCode = (state.status.code + 1) % UserStatus.USER_STATUS_TYPES.length;

  return {
    status: UserStatus.USER_STATUS_TYPES.find(status => status.code === nextStatusCode)
  };
}

export default UserStatus;