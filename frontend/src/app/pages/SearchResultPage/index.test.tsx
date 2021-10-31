import * as React from 'react';
import { shallow, mount } from 'enzyme';
import SearchResultPage, { Props, State } from '.';

describe('<SearchResultPage />', () => {
  it('should render', () => {
    const component = shallow(<SearchResultPage />);
    const wrapper = component.find('.searchResultPage');
    expect(wrapper.length).toBe(1);
  });
});
