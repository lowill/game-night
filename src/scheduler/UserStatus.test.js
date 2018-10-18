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

    it('should cycle from empty status to available status when clicked', () => {
      const wrapper = shallow(<UserStatus/>);
      wrapper.find('div').simulate('click');
      expect(wrapper.find('div').props()['data-status']).toBe('available');
    });

    it('should cycle from available status to unavailable status when clicked twice', () => {
      const wrapper = shallow(<UserStatus/>);
      wrapper.find('div').simulate('click');
      wrapper.find('div').simulate('click');
      expect(wrapper.find('div').props()['data-status']).toBe('unavailable');
    });

    it('should cycle from empty status to empty status when clicked thrice', () => {
      const wrapper = shallow(<UserStatus/>);
      wrapper.find('div').simulate('click');
      wrapper.find('div').simulate('click');
      wrapper.find('div').simulate('click');
      expect(wrapper.find('div').props()['data-status']).toBe('empty');
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