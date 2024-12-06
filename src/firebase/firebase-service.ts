import {
  collection,
  addDoc,
  getDocs,
  CollectionReference,
} from 'firebase/firestore';
import { db } from './firebase-init';
import { todoConverter } from './firebase-converters';
import { TodoDoc } from '../interface';
import { TodoItemProps } from '../components/TodoItem';

export const todosCollectionRef: CollectionReference<TodoDoc> = collection(
  db,
  'todos'
).withConverter(todoConverter);

export const dbFetchTodos = async (): Promise<TodoDoc[]> => {
  const data = await getDocs(todosCollectionRef);

  return data.docs.map((doc) => {
    return {
      ...doc.data(),
      firebaseId: doc.id,
    } as TodoItemProps;
  });
};

export const dbAddTodo = async (todo: TodoItemProps) => {
  return await addDoc(todosCollectionRef, todo);
}