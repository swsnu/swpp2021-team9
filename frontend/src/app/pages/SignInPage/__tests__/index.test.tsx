import * as React from 'react';
import { render } from '@testing-library/react';

import { SignInPage } from '..';

describe('<SignInPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<SignInPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
