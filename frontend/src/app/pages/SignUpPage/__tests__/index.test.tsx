import * as React from 'react';
import { render } from '@testing-library/react';

import { SignUpPage } from '..';

describe('<SignUpPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<SignUpPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
