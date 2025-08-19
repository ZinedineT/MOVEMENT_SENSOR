// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB__yUFCeqlWpvkDriFgLFP46y52jlDoFE",
  authDomain: "pirsensorapp.firebaseapp.com",
  databaseURL: "https://pirsensorapp-default-rtdb.firebaseio.com",
  projectId: "pirsensorapp",
  storageBucket: "pirsensorapp.firebasestorage.app",
  messagingSenderId: "348358177054",
  appId: "1:348358177054:web:cf6879363235f7f9e0590f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
