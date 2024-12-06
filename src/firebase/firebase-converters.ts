import { TodoDoc } from "../interface";
import { DocumentData, SnapshotOptions, QueryDocumentSnapshot } from "firebase/firestore";

// Define the Firestore data converter for Todo
export const todoConverter = {
  toFirestore(todo: TodoDoc): DocumentData {
    return {
      id: todo.id,
      label: todo.label,
      checked: todo.checked,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TodoDoc {
    const data = snapshot.data(options);
    return {
      id: data.id,
      label: data.label,
      checked: data.checked,
      firebaseId: snapshot.id, // Add firebaseId here to match your TodoDoc interface
    };
  },
};