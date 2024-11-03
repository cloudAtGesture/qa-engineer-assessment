import  React  from 'react';
import '@testing-library/jest-dom/extend-expect';
import { getMockedFunction } from './test-utils';
import { initialData } from "./App";
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
    // initialize local storage mock
    let localStorageMock = {};

    // simulate local storage methods
    beforeAll(() => {
      global.Storage.prototype.setItem = jest.fn((key, value) => {
        localStorageMock[key] = value;
      });
      global.Storage.prototype.getItem = jest.fn(
        (key) => localStorageMock[key]
      );
    });

    // resets our local storage mock
    beforeEach(() => {
      localStorageMock = {};
    });

    // resets mocks to original values (prevents future test pollution)
    afterAll(() => {
      getMockedFunction(global.Storage.prototype.setItem).mockReset();
      getMockedFunction(global.Storage.prototype.getItem).mockReset();
    });

    test('state persistence', () => {
      // render app

      // check list state to ensure it contains initial items only

      // add item

      // re-render app

      // check list state to ensure it contains initial items plus added item
    });
  });



  test('auto-sinking checked items', () => {});
});



// Notes:
// render() Benefits:

// 1. Virtual DOM Rendering: `render()` creates a virtual DOM representation of the component, allowing you to test how it behaves in a realistic environment without needing to mount it in a full browser. This simulates user interactions efficiently.

// 2. Access to screen queries: after rendering a component, `render()` makes it easy to access elements through the `screen` object. You can query for elements using various methods (like `getByText`, `getByRole`, etc.), which allows you to check if the UI displays as expected.

// 3. Isolation: Each call to `render()` provides a fresh instnace of the component and it's state. this means that tests are isolated from one another, preventing state or side effects from one test affecting another.

// ...and more!