import * as React from 'react';
import { render } from '@testing-library/react';

import { MainPage } from '..';

describe('<MainPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<MainPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
