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
      const testTodoItem = 'test';

      /// add item with text variable
      const textBox = screen.getByPlaceholderText(placeholderText);

      // simulate text entry
      userEvent.type(textBox, testTodoItem);

      // simulate Enter/ return press
      userEvent.keyboard('{Enter}');

      // retrieve `todos` item from local storage
      const todosFromStorage = JSON.parse(localStorage.getItem('todos'));

      // check local storage for test item
      expect(todosFromStorage).toContainEqual( // ? checks each item in the array of `todos`
        expect.objectContaining({ label: testTodoItem }) // ? checks the `todoItem` label property  
      );

      // unmount the component
      unmount();

      // re-render the app
      render(<App />);

      // checkbox with test item name
      const testCheckbox = screen.getByRole('checkbox', { name: testTodoItem });

      // test item should be present post re-render
      expect(testCheckbox).toBeDefined();
    });
  });

  test('auto-sinking checked items', () => {
    // render list
    // check unchecked item
    // check order
    // check added item
  });
});



// Notes:
// render() Benefits:

// 1. Virtual DOM Rendering: `render()` creates a virtual DOM representation of the component, allowing you to test how it behaves in a realistic environment without needing to mount it in a full browser. This simulates user interactions efficiently.

// 2. Access to screen queries: after rendering a component, `render()` makes it easy to access elements through the `screen` object. You can query for elements using various methods (like `getByText`, `getByRole`, etc.), which allows you to check if the UI displays as expected.

// 3. Isolation: Each call to `render()` provides a fresh instnace of the component and it's state. this means that tests are isolated from one another, preventing state or side effects from one test affecting another.

// ...and more!