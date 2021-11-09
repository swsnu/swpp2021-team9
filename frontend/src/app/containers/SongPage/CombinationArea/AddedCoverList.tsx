import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSongSlice } from '../slice';
import { selectCombination, selectCurrent } from '../slice/selectors';

import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getIcon } from '../getIcon';

export interface Props {}

export default function AddedCoverList(props: Props) {
  const dispatch = useDispatch();
  const { actions } = useSongSlice();

  const combination = useSelector(selectCombination);
  const current = useSelector(selectCurrent);

  const styles = {
    menuitem: (active: boolean) =>
      `${
        active && 'bg-gray-200'
      } text-gray-700 group flex rounded-md items-center w-full pr-4 py-1 text-sm font-medium`,
  };

  return (
    <ul data-testid="AddedCoverList" className="flex flex-wrap mr-2 gap-2">
      {combination.length > 0 ? (
        combination.map(item => (
          <li key={item.id}>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className={`${
                    item.id === current
                      ? 'bg-indigo-200'
                      : item.cover === null
                      ? 'bg-red-200'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } inline-flex justify-center items-center px-1 rounded-md text-sm font-medium text-gray-600`}
                >
                  <div className="mr-1 w-6 text-lg text-center text-gray-700">
                    <FontAwesomeIcon icon={getIcon(item.instrument.icon)} />
                  </div>
                  {item.cover
                    ? item.cover.title
                    : `Select ${item.instrument.name}...`}
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
                <Menu.Items className="absolute z-10 left-0 w-24 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={styles.menuitem(active)}
                          onClick={() => dispatch(actions.setCurrent(item.id))}
                        >
                          <div className="ml-1 mr-2 w-6 text-lg text-center text-gray-700">
                            <FontAwesomeIcon icon={faPen} />
                          </div>
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={styles.menuitem(active)}
                          onClick={() => dispatch(actions.deleteItem(item.id))}
                        >
                          <div className="ml-1 mr-2 w-6 text-lg text-center text-gray-700">
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </li>
        ))
      ) : (
        <span className="text-sm font-medium text-gray-500 tracking-wider">
          Add covers to make your own combination!
        </span>
      )}
    </ul>
  );
}
