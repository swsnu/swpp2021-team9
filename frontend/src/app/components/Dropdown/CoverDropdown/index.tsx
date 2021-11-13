import React from 'react';
import { Menu, Transition } from '@headlessui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  itemId: number;
  onClickEdit: () => void;
  onClickDelete: () => void;
  show?: boolean;
}

export default function CoverDropdown(props: Props) {
  const styles = {
    menuitem:
      'hover:bg-gray-200 text-gray-700 group flex rounded-lg items-center w-full pr-4 py-1 text-sm font-medium',
  };

  return (
    <Transition
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      show={props.show}
    >
      <Menu.Items className="absolute z-10 left-0 w-24 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1">
          <Menu.Item>
            {() => (
              <button className={styles.menuitem} onClick={props.onClickEdit}>
                <div className="ml-1 mr-2 w-6 text-lg text-center text-gray-700">
                  <FontAwesomeIcon icon={faPen} />
                </div>
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {() => (
              <button className={styles.menuitem} onClick={props.onClickDelete}>
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
  );
}
