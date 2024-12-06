import { doc, updateDoc } from "firebase/firestore";
import { todosCollectionRef } from "./firebase-service";

export const dbUpdateCheckedField = async (firebaseId: string, checked: boolean) => {
  try {
    if (firebaseId) {
      // get a reference to the todo document
      const todoDocRef = doc(todosCollectionRef, firebaseId);

      // update the checked field in Firestore
      await updateDoc(todoDocRef, { checked });
    }
  } catch (error) {
    console.error(`Failed to update todo in Firestore: ${error}`);
  }
};
