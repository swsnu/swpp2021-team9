import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useSongSlice } from '../slice';
import { Instrument } from 'types/models';

import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { getIcon } from '../getIcon';

export interface Props {
  instruments: Instrument[];
}

export default function AddCoverButton(props: Props) {
  const { actions } = useSongSlice();
  const dispatch = useDispatch();

  const styles = {
    menuitem: (active: boolean) =>
      `${
        active && 'bg-gray-200'
      } text-gray-700 group flex rounded-md items-center w-full pr-4 py-1 text-sm font-medium`,
  };

  return (
    <div data-testid="AddCoverButton">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center px-2 border-transparent rounded-md text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600">
            <div className="text-lg text-center">
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 left-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {props.instruments.map(instrument => (
                <Menu.Item key={instrument.id}>
                  {({ active }) => (
                    <button
                      className={styles.menuitem(active)}
                      onClick={() => dispatch(actions.addItem(instrument))}
                    >
                      <div className="ml-1 mr-2 w-6 text-lg text-center text-gray-700">
                        <FontAwesomeIcon icon={getIcon(instrument.icon)} />
                      </div>
                      {instrument.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <div className={styles.menuitem(false)}>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      className="text-lg ml-1 mr-2 text-gray-500"
                    />
                    <span className="text-gray-500">More...</span>
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
