// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

// change to
import firebase from "firebase/compat";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCqf2tyWE-OnUpZ15dmNG75oN1xgcFNRlg",
	authDomain: "plo-auth.firebaseapp.com",
	projectId: "plo-auth",
	storageBucket: "plo-auth.appspot.com",
	messagingSenderId: "384812541837",
	appId: "1:384812541837:web:780e37e88035258ff63fc4",
};

// Initialize Firebase
let app;

if (firebase.apps.length == 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

const auth = firebase.auth();

export { auth, firebase };
