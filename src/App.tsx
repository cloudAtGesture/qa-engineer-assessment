import React, { useCallback, useState } from "react";
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
    label: "Buy groceries",
    checked: false,
  },
  {
    id: uuid(),
    label: "Reboot computer",
    checked: false,
  },
  {
    id: uuid(),
    label: "Ace CoderPad interview",
    checked: true,
  },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialData);

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

  const handleChange = useCallback((checked: boolean) => {
    // handle the check/uncheck logic
  }, []);

  return (
    <Wrapper>
      <Header>Todo List</Header>
      <AddInput onAdd={addTodo} />
      <TodoList>
        {todos.map((todo) => (
          <TodoItem {...todo} onChange={handleChange} />
        ))}
      </TodoList>
    </Wrapper>
  );
}

export default App;
