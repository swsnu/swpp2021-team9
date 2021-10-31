import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { App } from './index';

describe('<App />', () => {
  it('should render', () => {
    const component = shallow(<App />);
    const wrapper = component.find('.app');
    expect(wrapper.length).toBe(1);
  });
});
