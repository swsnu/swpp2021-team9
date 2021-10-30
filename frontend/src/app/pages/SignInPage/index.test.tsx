import * as React from 'react';
import { shallow, mount } from 'enzyme';
import SignInPage, { Props, State } from './index';

describe('<SignInPage />', () => {
  it('should render', () => {
    const component = shallow(<SignInPage />);
    const wrapper = component.find('.signInPage');
    expect(wrapper.length).toBe(1);
  });
});
