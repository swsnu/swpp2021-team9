import * as React from 'react';
import { shallow, mount } from 'enzyme';
import SongPage, { Props, State } from './index';

describe('<SongPage />', () => {
  it('should render', () => {
    const component = shallow(<SongPage />);
    const wrapper = component.find('.songPage');
    expect(wrapper.length).toBe(1);
  });
});
