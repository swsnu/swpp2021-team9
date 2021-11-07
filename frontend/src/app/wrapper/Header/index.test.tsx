import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Header from '.';

test('should render', () => {
  render(
    <Header
      onSignInClicked={function (): void {
        throw new Error('Function not implemented.');
      }}
      onSignUpClicked={function (): void {
        throw new Error('Function not implemented.');
      }}
      onSignOutClicked={function (): void {
        throw new Error('Function not implemented.');
      }}
      onProfileClicked={function (): void {
        throw new Error('Function not implemented.');
      }}
    />,
  );
  expect(screen.getByTestId('Header')).toBeTruthy();
});
