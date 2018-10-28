import UserStatus from './UserStatus.js';
import React from 'react';
import ReactDOM from 'react-dom';
import enzyme, { shallow, mount, render } from 'enzyme';

describe('UserStatus class', () => {

  describe('component', () => {
    it('should render without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<UserStatus/>, div);
    });

    describe('status changes', () => {
      const statusWrapper = (function() {
        const state = {
          status: UserStatus.USER_STATUS_TYPES[0]
        };

        return {
          state: state,
          updateStatus: function(newState) {
            state.status = newState.status;
          }
        };
      }());

      function simulateOnClick(componentFn, target, count) {
        let wrapper = shallow(componentFn());
        for(let i=0; i<count; i++) {
          const el = wrapper.find(target);
          el.props().onClick();
          wrapper = shallow(componentFn());  // faking re-render
        }
        return wrapper;
      }

      // I want to return a new React element each time I need the component
      function getComponent() {
        return <UserStatus status={statusWrapper.state.status} onClick={statusWrapper.updateStatus}/>;
      }

      beforeEach(() => {
        statusWrapper.state.status = UserStatus.USER_STATUS_TYPES[0];
      });

      it('should cycle from empty status to available status when clicked', () => {
        const wrapper = simulateOnClick(getComponent, 'div', 1);
        expect(wrapper.find('div').props()['data-status']).toBe('available');
      });

      it('should cycle from available status to unavailable status when clicked twice', () => {
        const wrapper = simulateOnClick(getComponent, 'div', 2);
        expect(wrapper.find('div').props()['data-status']).toBe('unavailable');
      });

      it('should cycle from empty status to empty status when clicked thrice', () => {
        const wrapper = simulateOnClick(getComponent, 'div', 3);
        expect(wrapper.find('div').props()['data-status']).toBe('empty');
      });
    });

    
  });

  describe('helper functions', () => {

    describe('cycle status method', () => {
      it('should return an available type status (code 1) if the current status was empty (code 0)', () => {
        const currentState = {status: UserStatus.USER_STATUS_TYPES[0]};
        const expectedState = {status: UserStatus.USER_STATUS_TYPES[1]};
        const actual = UserStatus.cycleStatus(currentState);

        expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedState));
      });

      it('should cycle back to empty status (code 0) after unavailable status (code 2)', () => {
        const currentState = {status: UserStatus.USER_STATUS_TYPES[2]};
        const expectedState = {status: UserStatus.USER_STATUS_TYPES[0]};
        const actual = UserStatus.cycleStatus(currentState);

        expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedState));
      });
    });

  });
});