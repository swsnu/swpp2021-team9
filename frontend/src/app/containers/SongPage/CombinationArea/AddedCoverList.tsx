import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useMakeCombinationSlice,
  CombinationItem,
} from '../slice/makeCombination';
import { selectCombination, selectCurrent } from '../slice/selectors';

import CoverDropdown from 'app/components/Dropdown/CoverDropdown';
import { Menu } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIcon } from 'utils/imageTools';

export interface Props {}

export default function AddedCoverList(props: Props) {
  const dispatch = useDispatch();
  const { actions } = useMakeCombinationSlice();

  const combination = useSelector(selectCombination);
  const current = useSelector(selectCurrent);

  const styles = {
    menuButton: (item: CombinationItem) => {
      let bgStyle = '';
      if (item.id === current) {
        bgStyle = 'bg-indigo-200';
      } else if (item.cover === null) {
        bgStyle = 'bg-red-200 hover:bg-red-300';
      } else {
        bgStyle = 'bg-gray-200 hover:bg-gray-300';
      }
      return (
        bgStyle +
        ' inline-flex justify-center items-center px-1 rounded-lg text-sm font-medium text-gray-600'
      );
    },
  };

  return (
    <ul
      data-testid="AddedCoverList"
      className="flex flex-wrap p-2 gap-2 rounded-lg bg-gray-200"
    >
      {combination.length > 0 ? (
        combination.map(item => (
          <li key={item.id} data-testid="AddedCoverListItem">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className={styles.menuButton(item)}>
                  <div className="mr-1 w-6 text-lg text-center text-gray-700">
                    <FontAwesomeIcon icon={getIcon(item.instrument.icon)} />
                  </div>
                  {item.cover
                    ? item.cover.title
                    : `Select ${item.instrument.name}...`}
                </Menu.Button>
              </div>

              <CoverDropdown
                itemId={item.id}
                onClickEdit={() => dispatch(actions.setCurrent(item.id))}
                onClickDelete={() => dispatch(actions.deleteItem(item.id))}
              />
            </Menu>
          </li>
        ))
      ) : (
        <span className="text-sm py-1 px-2 font-medium text-gray-500 tracking-wider">
          Add covers to make your own combination!
        </span>
      )}
    </ul>
  );
}
