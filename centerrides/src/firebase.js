
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCLdAUvGhr0K32xYOau44GYrWkefkEo-pk",
    authDomain: "center-rides.firebaseapp.com",
    databaseURL: "https://center-rides-default-rtdb.firebaseio.com",
    projectId: "center-rides",
    storageBucket: "center-rides.firebasestorage.app",
    messagingSenderId: "1071345887223",
    appId: "1:1071345887223:web:1d986c43dc457fbfe1f0f2",
    measurementId: "G-JYQBZWQL8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Export the database for use in other parts of the app
export default database;
