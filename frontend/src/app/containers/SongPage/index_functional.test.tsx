import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { configureAppStore } from 'store/configureStore';
import SongPage from '.';
import { Song } from 'utils/urls';
import { Props as InstrumentDropdownProps } from 'app/components/Dropdown/InstrumentDropdown';
import { Props as CoverDropdownProps } from 'app/components/Dropdown/CoverDropdown';
import { api } from 'api/band';
import {
  dummySongs,
  dummyCombinations,
  dummyCovers,
  dummyInstruments,
} from 'api/dummy';

const store = configureAppStore();

const mockHistoryPush = jest.fn().mockImplementation(string => {});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// function MockAddCoverButton(props: AddCoverButtonProps) {
//   const { actions } = useSongSlice();
//   const dispatch = useDispatch();
//   return (
//     <button
//       onClick={() => dispatch(actions.addItem(dummyInstruments[0]))}
//       data-testid="AddCoverButton"
//     ></button>
//   );
// }
// jest.mock('./CombinationArea/AddCoverButton', () => {
//   return {
//     __esModule: true,
//     ...jest.requireActual('./CombinationArea/AddCoverButton'),
//     default: MockAddCoverButton,
//   };
// });

function MockInstrumentDropdown(props: InstrumentDropdownProps) {
  return (
    <div>
      <button
        data-testid="InstrumentDropdown0"
        onClick={() => props.onClickMenu(dummyInstruments[0])}
      />
      <button
        data-testid="InstrumentDropdown1"
        onClick={() => props.onClickMenu(dummyInstruments[1])}
      />
    </div>
  );
}
jest.mock('app/components/Dropdown/InstrumentDropdown', () => {
  return {
    __esModule: true,
    ...jest.requireActual('app/components/Dropdown/InstrumentDropdown'),
    default: MockInstrumentDropdown,
  };
});

function MockCoverDropdown(props: CoverDropdownProps) {
  return (
    <div>
      <button onClick={props.onClickEdit} data-testid="CoverDropdownEdit" />
      <button onClick={props.onClickDelete} data-testid="CoverDropdownDelete" />
    </div>
  );
}
jest.mock('app/components/Dropdown/CoverDropdown', () => {
  return {
    __esModule: true,
    ...jest.requireActual('app/components/Dropdown/CoverDropdown'),
    default: MockCoverDropdown,
  };
});

jest.mock('./SongInfo', () => {
  return {
    __esModule: true,
    ...jest.requireActual('./SongInfo'),
    default: props => <div></div>,
  };
});

jest.mock('./TopCombination', () => {
  return {
    __esModule: true,
    ...jest.requireActual('./TopCombination'),
    default: props => <div></div>,
  };
});

function setup() {
  jest.clearAllMocks();

  const page = render(
    <Provider store={store}>
      <MemoryRouter>
        <Switch>
          <Route path={Song(':id')} component={SongPage} />
          <Redirect to={Song(0)} />
        </Switch>
      </MemoryRouter>
    </Provider>,
  );
  return { page };
}

beforeEach(() => {
  jest.clearAllMocks();
  api.getSongInfo = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        res(dummySongs[1]);
      }),
  );
  api.getCombinationsBySong = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        res(dummyCombinations);
      }),
  );
  api.getCoversBySongId = jest.fn(
    (_songId: number) =>
      new Promise((res, rej) => {
        res(dummyCovers);
      }),
  );
  api.getInstruments = jest.fn(
    () =>
      new Promise((res, rej) => {
        res(dummyInstruments);
      }),
  );
});

test('selecting cover test', () => {
  const { page } = setup();
  const addCoverButton = page.getByTestId('AddCoverButton');
  fireEvent.click(addCoverButton);

  let instrumentButton = page.getByTestId('InstrumentDropdown0');
  fireEvent.click(instrumentButton);

  // add another without selecting
  instrumentButton = page.getByTestId('InstrumentDropdown1');
  fireEvent.click(instrumentButton);

  let coverGetButtons = page.queryAllByTestId('CoverGetButton');
  expect(coverGetButtons.length).toBeGreaterThan(0);
  fireEvent.click(coverGetButtons[0]);

  // edit
  let addedCovers = page.queryAllByTestId('AddedCoverListItem');
  expect(addedCovers.length).toBe(2);
  fireEvent.click(addedCovers[0]);

  const editButtons = page.queryAllByTestId('CoverDropdownEdit');
  fireEvent.click(editButtons[0]);

  coverGetButtons = page.queryAllByTestId('CoverGetButton');
  expect(coverGetButtons.length).toBeGreaterThan(0);
  fireEvent.click(coverGetButtons[0]);

  // delete
  addedCovers = page.queryAllByTestId('AddedCoverListItem');
  expect(addedCovers.length).toBe(2);
  fireEvent.click(addedCovers[0]);

  const deleteButtons = page.queryAllByTestId('CoverDropdownDelete');
  fireEvent.click(deleteButtons[0]);

  addedCovers = page.queryAllByTestId('AddedCoverListItem');
  expect(addedCovers.length).toBe(1);
});
