// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBXAxbm8ZUg0Cm8y8q_YdY98qeTwdIkI9A",
	authDomain: "oxford-3000-6c314.firebaseapp.com",
	databaseURL: "https://oxford-3000-6c314-default-rtdb.firebaseio.com",
	projectId: "oxford-3000-6c314",
	storageBucket: "oxford-3000-6c314.appspot.com",
	messagingSenderId: "590519030140",
	appId: "1:590519030140:web:e5eb3d3c5e50da3322d4f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
