import  React  from 'react';
import '@testing-library/jest-dom/extend-expect';
import App, { initialData } from "./App";
import { placeholderText } from './components/AddInput';
import { render, screen } from '@testing-library/react'
import { Todo } from "./interface";
import { TodoItem } from "./components/TodoItem";
import { userEvent } from '@testing-library/user-event';

describe('todo list functionality', () => {
  describe('toggling todo items', () => {
    test('via checkbox', () => {
      // get the first todo item props
      const listItemOneProps: Todo = initialData[0];

      // create virtual DOM component
      render(<TodoItem {...listItemOneProps} />);

      // get the checkbox and label text
      const listItemOneCheckbox: HTMLInputElement = screen.getByRole(
        'checkbox',
        {
          name: listItemOneProps.label,
        }
      );
      
      // store initial state
      const checkboxIsChecked = listItemOneCheckbox.checked;
      
      // initial state check
      !checkboxIsChecked
        ? expect(listItemOneCheckbox).not.toBeChecked()
        : expect(listItemOneCheckbox).toBeChecked();

      // simulate user click event on the checkbox
      userEvent.click(listItemOneCheckbox);

      // final state check
      !checkboxIsChecked
        ? expect(listItemOneCheckbox).toBeChecked()
        : expect(listItemOneCheckbox).not.toBeChecked();
    });

    test('via label', () => {
      // get the first todo item props
      const listItemOneProps: Todo = initialData[0];

      // create virtual DOM component
      render(<TodoItem {...listItemOneProps} />);

      // get the checkbox and label text
      const listItemOneCheckbox: HTMLInputElement = screen.getByRole(
        'checkbox',
        {
          name: listItemOneProps.label,
        }
      );

      // get clickable element
      const labelText: HTMLLabelElement = screen.getByText(
        listItemOneProps.label
      );

      // store initial state
      const checkboxIsChecked = listItemOneCheckbox.checked;

      // initial state check
      !checkboxIsChecked
        ? expect(listItemOneCheckbox).not.toBeChecked()
        : expect(listItemOneCheckbox).toBeChecked();

      // simulate user click event on the label (which toggles the checkbox)
      userEvent.click(labelText);

      // final state check
      !checkboxIsChecked
        ? expect(listItemOneCheckbox).toBeChecked()
        : expect(listItemOneCheckbox).not.toBeChecked();
    });
  });

  describe('local storage tests', () => {
    test('state persistence', () => {
      // render app and store return unmount function
      const { unmount } = render(<App />);

      // create test item text var
      const testTodoItemText = 'test';

      /// add item with text variable
      const textBox = screen.getByPlaceholderText(placeholderText);

      // simulate text entry
      userEvent.type(textBox, testTodoItemText);

      // simulate Enter/ return press
      userEvent.keyboard('{Enter}');

      // retrieve `todos` item from local storage
      const todosFromStorage = JSON.parse(localStorage.getItem('todos'));

      // check local storage for test item
      expect(todosFromStorage).toContainEqual( // ? checks each item in the array of `todos`
        expect.objectContaining({ label: testTodoItemText }) // ? checks the `todoItem` label property  
      );

      // unmount the component
      unmount();

      // re-render the app
      render(<App />);

      // checkbox with test item name
      const testCheckbox = screen.getByRole('checkbox', { name: testTodoItemText });

      // test item should be present post re-render
      expect(testCheckbox).toBeDefined();
    });
  });

  describe('todo list item ordering', () => {
    test('auto-sinking checked items', () => {
      // render app
      render(<App />);

      // create test item text var
      const testTodoItemText = 'test';

      /// add item with text variable
      const textBox = screen.getByPlaceholderText(placeholderText);

      // simulate text entry
      userEvent.type(textBox, testTodoItemText);

      // simulate Enter/ return press
      userEvent.keyboard('{Enter}');

      // get new item
      const testTodoItem = screen.getByRole('checkbox', {
        name: testTodoItemText,
      });

      // simulate test item click (checkbox checked)
      userEvent.click(testTodoItem);

      // get all list item checkboxes in an arry
      const listCheckboxes = screen.getAllByRole('checkbox');

      // get last todo item on list
      const lastTodoItem = listCheckboxes[listCheckboxes.length - 1];

      // get the accessible names
      const testTodoItemLabel =
        testTodoItem.getAttribute('aria-label') || testTodoItem.textContent;
      const lastTodoItemLabel =
        lastTodoItem.getAttribute('aria-label') || lastTodoItem.textContent;

      // check if the newly added todo item has moved to the bottom of the list
      expect(testTodoItemLabel).toBe(lastTodoItemLabel);
    });
  }); 
});