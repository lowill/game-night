import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import AutoCompleteInput from './AutoCompleteInput.js';

describe('AutoCompleteInput Component', () => {
  it('should render an input html element', () => {
    const wrapper = shallow(<AutoCompleteInput/>);
    expect(wrapper.find('input')).toHaveLength(1);
  });
});