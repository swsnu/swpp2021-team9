import React from 'react';
import { useDispatch } from 'react-redux';
import { useMakeCombinationSlice } from '../slice/makeCombination';

import InstrumentDropdown from 'app/components/Dropdown/InstrumentDropdown';
import { Menu } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  instruments: Instrument[];
}

export default function AddCoverButton(props: Props) {
  const { actions } = useMakeCombinationSlice();
  const dispatch = useDispatch();

  return (
    <div data-testid="AddCoverButton">
      <Menu as="div" className="relative inline-block text-left mx-2 pt-2">
        <div>
          <Menu.Button className="inline-flex justify-center px-2 border-transparent rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600">
            <div className="text-lg text-center">
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </Menu.Button>
        </div>

        <InstrumentDropdown
          instruments={props.instruments}
          onClickMenu={(instrument: Instrument) =>
            dispatch(actions.addItem(instrument))
          }
        />
      </Menu>
    </div>
  );
}
