import * as React from 'react';
import { shallow, mount } from 'enzyme';
import SignUpPage, { Props, State } from './index';

describe('<SignUpPage />', () => {
  it('should render', () => {
    const component = shallow(<SignUpPage />);
    const wrapper = component.find('.signUpPage');
    expect(wrapper.length).toBe(1);
  });
});
