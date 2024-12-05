import  React  from 'react';
import '@testing-library/jest-dom/extend-expect';
import App from "./App";
import { placeholderText } from './components/AddInput';
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import { Todo } from "./interface";
import { userEvent } from '@testing-library/user-event';

interface AddTestItemResult {
  label: string;
  checkBox: HTMLInputElement;
}

const testItemLabel = 'test';
const addTestItem = async (
  label: string = testItemLabel
): Promise<AddTestItemResult> => {
  // add item with text variable
  const textBox = screen.getByPlaceholderText(placeholderText);

  // simulate text entry and enter/return key press
  await userEvent.type(textBox, label);
  await userEvent.keyboard('{Enter}');

  const checkBox: HTMLInputElement = await screen.findByRole('checkbox', {
    name: label,
  });

  // return new item data
  return {
    label,
    checkBox,
  };
};

describe('todo list functionality', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  })

  describe('adding todo items', () => {
    test('via input box', async () => {
      // render app
      render(<App />);

      // create and add test item
      const addTestItemResult: AddTestItemResult = await addTestItem();

      // check if the item has been added
      expect(screen.getByText(addTestItemResult.label)).toBeInTheDocument();
    });
  });

  describe('toggling todo items', () => {
    let addTestItemResult: AddTestItemResult;
    let testItemCheckBox: HTMLInputElement;
    let initialCheckedStatus: boolean;
    let unmount: RenderResult['unmount'];

    beforeEach(async () => {
      // render app
      ({ unmount } = render(<App />));

      // create and add test item
      addTestItemResult = await addTestItem();

      testItemCheckBox = addTestItemResult.checkBox;
      initialCheckedStatus = testItemCheckBox.checked;
    });

    afterAll(() => {
      // clean up
      unmount();
    });

    test('via checkbox', async () => {
      // initial state check
      expect(testItemCheckBox.checked).toBe(initialCheckedStatus);
      
      // simulate user click event on the checkbox
      await userEvent.click(testItemCheckBox);
      
      // final state check
      expect(testItemCheckBox.checked).toBe(!initialCheckedStatus);
    });

    test('via label', async () => {
      // get clickable label element
      const labelText: HTMLLabelElement = screen.getByText(
        addTestItemResult.label
      );

      // initial state check
      expect(testItemCheckBox.checked).toBe(initialCheckedStatus);

      // simulate user click event on the label (which toggles the checkbox)
      await userEvent.click(labelText);

      // final state check
      expect(testItemCheckBox.checked).toBe(!initialCheckedStatus);
    });
  });

  // describe('local storage tests', () => {
  //   let initialUnmount: RenderResult['unmount'];
    
  //   beforeEach(() => {  
  //     // render app
  //     const { unmount } = render(<App />);

  //     // store unmount function for initial render
  //     initialUnmount = unmount;
  //   });

  //   test('state persistence', async () => {
  //     // create test item text var
  //     const testTodoItemText = 'test';

  //     /// add item with text variable
  //     const textBox = screen.getByPlaceholderText(placeholderText);

  //     // simulate text entry and enter/return key press
  //     await userEvent.type(textBox, testTodoItemText);
  //     await userEvent.keyboard('{Enter}');

  //     // wait for local storage to update
  //     await waitFor(() => {
  //       // retrieve `todos` item from local storage
  //       const todosFromStorage = JSON.parse(localStorage.getItem('todos_data'));

  //       // check local storage for test item
  //       expect(todosFromStorage).toContainEqual(
  //         expect.objectContaining({ label: testTodoItemText })
  //       );
  //     });
      
  //     // simulate refresh with new render
  //     initialUnmount();
  //     const { unmount } = render(<App />);

  //     // checkbox with test item name
  //     const testCheckbox = screen.getByRole('checkbox', {
  //       name: testTodoItemText,
  //     });

  //     // test item should be present post re-render
  //     expect(testCheckbox).toBeInTheDocument();

  //     // clean up
  //     unmount();
  //   });
  // });

  // describe('todo list item ordering', () => {
  //   test('auto-sinking checked items', async () => {
  //     // render app
  //     render(<App />);

  //     // create test item text var
  //     const testTodoItemText = 'Test';

  //     // add item with text variable
  //     const textBox = screen.getByPlaceholderText(placeholderText);

  //     // await userEvent.clear(textBox);
  //     await userEvent.clear(textBox);

  //     // asynschronously simulate text entry
  //     await userEvent.type(textBox, testTodoItemText, { delay: 50 });

  //     // asynschronously simulate enter/return press
  //     await userEvent.keyboard('{Enter}');

  //     // ensure the item has been added
  //     await waitFor(() => {
  //       expect(screen.getByText(testTodoItemText)).toBeInTheDocument();
  //     });

  //     // get new item
  //     const testTodoItem = await screen.findByRole('checkbox', {
  //       name: testTodoItemText,
  //     });
      
  //     // get test item id for comparison
  //     const testTodoItemId = testTodoItem.getAttribute('id');

  //     // click to check the item
  //     await userEvent.click(testTodoItem);

  //     await waitFor(() => {
  //       // get all list item checkboxes in an arry
  //       const listCheckboxes = screen.getAllByRole('checkbox');

  //       // get last todo item on list
  //       const lastTodoItem = listCheckboxes[listCheckboxes.length - 1];

  //       // get last item id for comparison accessible names
  //       const lastTodoItemId = lastTodoItem.getAttribute('id');

  //       // check if the newly added todo item has moved to the bottom of the list
  //       expect(testTodoItemId).toBe(lastTodoItemId);
  //     });
  //   });
  // }); 
});