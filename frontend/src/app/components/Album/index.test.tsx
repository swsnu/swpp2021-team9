import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Album from '.';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import AlbumImage from '../Album/AlbumImage.png';
import { configureAppStore } from 'store/configureStore';

const store = configureAppStore();

const mockHistoryPush = jest.fn();
/*
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function setup() {
  jest.clearAllMocks();

  const path = '/';
  const page = render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={path} render={() => <Album />} />
          <Redirect to={path} />
        </Switch>
      </BrowserRouter>
    </Provider>,
  );

  const clicktitle = page.getAllByTestId('Title')[0] as HTMLButtonElement;
  
  const title = page.getByLabelText('Title') as HTMLInputElement;
  const artist = page.getByLabelText('Artist') as HTMLInputElement;
  const category = page.getByLabelText('Category') as HTMLSelectElement;
  const reference = page.getByLabelText('Reference Link') as HTMLInputElement;
  const description = page.getByLabelText('Description') as HTMLTextAreaElement;
  const submit = page.getByText('Submit') as HTMLButtonElement;
  const options = page.getAllByTestId('option') as HTMLOptionElement[];
    
  return {
    page,
    clicktitle,
    //clickplay,
  };
}
*/

test('should render', () => {
  //const set = setup();
  render(
    <Album
      id={0}
      thumbnail={AlbumImage}
      title="Album1"
      singer="Singer1"
      onClickTitle={() => {}}
      onClickPlay={() => {}}
    />,
  );
  expect(screen.getAllByTestId('Album')).toBeTruthy();
});
