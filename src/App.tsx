import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import styled from "@emotion/styled";
import { AddInput } from "./components/AddInput";
import { TodoItem } from "./components/TodoItem";
import { TodoList } from "./components/TodoList";
import { Header } from "./components/Header";
import { Todo } from "./interface";

const Wrapper = styled.div({
  display: "grid",
  placeitems: "center",
  width: 300,
});

/**
* This is the initial todo state.
* Instead of loading this data on every reload,
* we should save the todo state to local storage,
* and restore on page load. This will give us
* persistent storage.
*/

export const initialData: Todo[] = [
  {
    id: uuid(),
    label: 'Buy groceries',
    checked: false,
  },
  {
    id: uuid(),
    label: 'Reboot computer',
    checked: false,
  },
  {
    id: uuid(),
    label: 'Ace CoderPad interview',
    checked: true,
  },
];

const TODOS_LOCAL_STORAGE_KEY = "todos_data";


function App() {
  const [todos, setTodos] = useState((): Todo[] => {
    const storedTodos = localStorage.getItem(TODOS_LOCAL_STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(TODOS_LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((label: string) => {
    setTodos((prev) => [
      {
        id: uuid(),
        label,
        checked: false,
      },
      ...prev,
    ]);
  }, []);

  // checked is a boolean value that is passed to the TodoItem component: `e.target.checked`
  const handleChange = useCallback((id: string, checked: boolean) => {
    setTodos((prevTodos) => {
      // map through todos to toggle the checked state
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, checked } : todo
      );

      if (checked) {
        // find the checked item
        const checkedItemIndex = updatedTodos.findIndex((todo) => todo.id === id);
        const [checkedItem] = updatedTodos.splice(checkedItemIndex, 1);

        // append the checked item to the end of the array
        updatedTodos.push(checkedItem);
      }

      // sort to make sure unchecked are at the top and checked at the bottom
      const sortedTodos = updatedTodos.sort((a, b) => {
        if (a.checked && !b.checked) return 1;
        if (!a.checked && b.checked) return -1;
        return 0;
      });

      return sortedTodos;
    });
  }, []);

  return (
    <Wrapper>
      <Header>Todo List</Header>
      <AddInput onAdd={addTodo} />
      <TodoList>
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} onChange={handleChange} />
        ))}
      </TodoList>
    </Wrapper>
  );
}

export default App;
