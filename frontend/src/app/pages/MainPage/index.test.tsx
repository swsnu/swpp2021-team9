import * as React from 'react';
import { shallow, mount } from 'enzyme';
import MainPage, { Props, State } from '.';

describe('<MainPage />', () => {
  it('should render', () => {
    const component = shallow(<MainPage />);
    const wrapper = component.find('.mainPage');
    expect(wrapper.length).toBe(1);
  });
});
