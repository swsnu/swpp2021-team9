import * as React from 'react';
import { shallow, mount } from 'enzyme';
import ProfilePage, { Props, State } from '.';

describe('<ProfilePage />', () => {
  it('should render', () => {
    const component = shallow(<ProfilePage />);
    const wrapper = component.find('.profilePage');
    expect(wrapper.length).toBe(1);
  });
});
