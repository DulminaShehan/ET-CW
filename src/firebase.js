import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCmoWFcH_9xC53dT7j-XvUo74Td0J-dLv4",
  authDomain: "forestfiresysterm.firebaseapp.com",
  databaseURL: "https://forestfiresysterm-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "forestfiresysterm",
  storageBucket: "forestfiresysterm.firebasestorage.app",
  messagingSenderId: "527968292756",
  appId: "1:527968292756:web:e9324e6d41dc72c706c981",
  measurementId: "G-YP6Z64WJ1Z",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
