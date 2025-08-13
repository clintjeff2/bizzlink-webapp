// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyD-U6QBY4iHP5CQoMDxJGvZsglXO-SlIEA',
	authDomain: 'los-help.firebaseapp.com',
	databaseURL: 'https://los-help-default-rtdb.firebaseio.com',
	projectId: 'los-help',
	storageBucket: 'los-help.appspot.com',
	messagingSenderId: '655179049049',
	appId: '1:655179049049:web:189a279b9bbbc276fbe948',
	measurementId: 'G-283C0RLPYB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
