import React from 'react';
import Point from './Point';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
describe('<Point>', () => {
  it('should render', () => {
    render(<Point id={0} time={1} labelText={'Text'} />);
    const pointComponent = screen.getByTestId('Point');
    expect(pointComponent).toBeTruthy();
  });
});
