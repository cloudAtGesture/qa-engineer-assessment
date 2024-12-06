import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC0mSZy19vsg9Xis7LJ1JlI5mpVfe2gVTw',
  authDomain: 'pub-152-todo-list-firebase.firebaseapp.com',
  projectId: 'pub-152-todo-list-firebase',
  storageBucket: 'pub-152-todo-list-firebase.firebasestorage.app',
  messagingSenderId: '514585945043',
  appId: '1:514585945043:web:c1094c0ccf5f38fa528526',
  measurementId: 'G-CV9RHN2PRW',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
