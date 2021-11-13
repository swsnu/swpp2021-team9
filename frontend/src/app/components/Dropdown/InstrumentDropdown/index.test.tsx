import { render, fireEvent } from '@testing-library/react';
import { Menu } from '@headlessui/react';
import InstrumentDropdown from '.';
import { dummyInstruments } from 'app/containers/SongPage/dummy';

const onClickMenu = jest
  .fn()
  .mockImplementation((instrument: Instrument) => {});

test('should render', () => {
  const page = render(
    <Menu>
      <InstrumentDropdown
        instruments={dummyInstruments}
        onClickMenu={onClickMenu}
        show={true}
      />
    </Menu>,
  );

  const menuButtons = page.queryAllByText(dummyInstruments[0].name);
  expect(menuButtons.length).toBeGreaterThan(0);
  fireEvent.click(menuButtons[0]);
  expect(onClickMenu).toHaveBeenCalledWith(dummyInstruments[0]);
});
