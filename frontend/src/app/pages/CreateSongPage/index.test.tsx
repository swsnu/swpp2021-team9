import * as React from 'react';
import { shallow, mount } from 'enzyme';
import CreateSongPage, { Props, State } from './index';

describe('<CreateSongPage />', () => {
  it('should render', () => {
    const component = shallow(<CreateSongPage />);
    const wrapper = component.find('.createSongPage');
    expect(wrapper.length).toBe(1);
  });
});
