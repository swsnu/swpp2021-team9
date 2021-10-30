import * as React from 'react';
import { shallow, mount } from 'enzyme';
import CreateCoverRecordPage, { Props, State } from './step1';

describe('<CreateCoverRecordPage />', () => {
  it('should render', () => {
    const component = shallow(<CreateCoverRecordPage />);
    const wrapper = component.find('.createCoverRecordPage');
    expect(wrapper.length).toBe(1);
  });
});
