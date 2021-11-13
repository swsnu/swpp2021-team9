import { render, fireEvent } from '@testing-library/react';
import { Menu } from '@headlessui/react';
import CoverDropdown from '.';

const onClickEdit = jest.fn().mockImplementation(() => {});

const onClickDelete = jest.fn().mockImplementation(() => {});

test('should render', () => {
  const page = render(
    <Menu>
      <CoverDropdown
        itemId={0}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
        show={true}
      />
    </Menu>,
  );

  const editButton = page.getByText('Edit');
  fireEvent.click(editButton);
  expect(onClickEdit).toHaveBeenCalled();

  const deleteButton = page.getByText('Delete');
  fireEvent.click(deleteButton);
  expect(onClickDelete).toHaveBeenCalled();
});
