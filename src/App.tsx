// ? React Hooks
import React, { useCallback, useEffect, useState } from 'react';

// ? Components
import { AddInput } from './components/AddInput';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { TodoDoc } from './interface';

// ? Firebase Services (Higher-level API interactions with Firestore)
import { dbFetchTodos, dbAddTodo } from './firebase/firebase-service';

// ? Firebase Helpers (Low-level functions for manipulating Firestore documents)
import { dbUpdateCheckedField } from './firebase/firebase-helpers';

// ? External Libraries
import { v4 as uuid } from 'uuid';
import styled from '@emotion/styled';

const Wrapper = styled.div({
  display: 'grid',
  placeitems: 'center',
  width: 300,
});

const TODOS_LOCAL_STORAGE_KEY = 'todos_data';

function App() {
  const [todos, setTodos] = useState<TodoDoc[]>([]);

  useEffect(() => {
    const fetchTodosFromDB = async (): Promise<TodoDoc[]> => {
      try {
        // Fetch todos from Firestore
        const todos = await dbFetchTodos();

        if (todos.length > 0) {
          // Store the data in localStorage
          localStorage.setItem(TODOS_LOCAL_STORAGE_KEY, JSON.stringify(todos));
        }

        return todos;
      } catch (error) {
        console.error(`Error fetching todos: ${error}`);
        return [];
      }
    };
    const fetchTodosFromLocalStorage = (): TodoDoc[] => {
      // If there are no todo docs in Firestore, load from localStorage
      const storedTodos = localStorage.getItem(TODOS_LOCAL_STORAGE_KEY);

      // If stored data, parse it… else initialize an empty array
      return storedTodos ? JSON.parse(storedTodos) : [];
    };
    const loadTodos = async () => {
      // Fetch todos from Firestore
      let todos = await fetchTodosFromDB();

      if (todos.length === 0) {
        todos = fetchTodosFromLocalStorage();
      }

      // Set the state with the data from Firestore or localStorage
      setTodos(todos);
    };

    loadTodos();
  }, []);

  const addTodo = useCallback(async (label: string) => {
    const id = uuid();

    // optimistic update
    setTodos((prevTodos) => [
      {
        id,
        label,
        checked: false,
        firebaseId: '',
      },
      ...prevTodos,
    ]);

    try {
      const docRef = await dbAddTodo({
        id,
        label,
        checked: false,
      });

      // After successful Firestore creation, update the local state with the Firestore ID
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, firebaseId: docRef.id } : todo
        )
      );
    } catch (error) {
      console.error('Failed to save todo to Firestore:', error);

      // rollback state on failure
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  }, []);

  // checked is a boolean value that is passed to the TodoItem component: `e.target.checked`
  const handleChange = useCallback(
    async (id: string, checked: boolean, firebaseId: string) => {
      setTodos((prevTodos) => {
        // map through todos to toggle the checked state
        const updatedTodos = prevTodos.map((todo) =>
          todo.id === id ? { ...todo, checked } : todo
        );

        if (checked) {
          // find the checked item
          const checkedItemIndex = updatedTodos.findIndex(
            (todo) => todo.id === id
          );
          const [checkedItem] = updatedTodos.splice(checkedItemIndex, 1);

          // append the checked item to the end of the array
          updatedTodos.push(checkedItem);
        }

        // sort to ensure unchecked items are at the top
        const sortedTodos = updatedTodos.sort((a, b) => {
          if (a.checked && !b.checked) return 1;
          if (!a.checked && b.checked) return -1;
          return 0;
        });

        return sortedTodos; // Return the sorted array
      });

      dbUpdateCheckedField(firebaseId, checked);
    },
    []
  );

  return (
    <Wrapper>
      <Header>Todo List</Header>
      <AddInput onAdd={addTodo} />
      <TodoList>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            onChange={(id, checked) =>
              handleChange(id, checked, todo.firebaseId)
            }
          />
        ))}
      </TodoList>
    </Wrapper>
  );
}

export default App;
