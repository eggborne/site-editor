// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { User, getAuth } from 'firebase/auth';

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkJTNcO9Tg5q_4bnF9WvVgqrrEmeNk8Gw",
  authDomain: "site-editor-70b42.firebaseapp.com",
  projectId: "site-editor-70b42",
  storageBucket: "site-editor-70b42.appspot.com",
  messagingSenderId: "748460455351",
  appId: "1:748460455351:web:024448217433ad255f6432",
  measurementId: "G-7B1Q203GVY"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
// onAuthStateChanged(auth, user => {
//   console.warn('onAuthStateChanged', user);
// });
// const analytics = getAnalytics(firebaseApp);

const initApp = () => {
  auth.onAuthStateChanged((user: User | null) => {
    if (user) {
      // User is signed in.
      const { displayName, email, emailVerified, photoURL, uid, phoneNumber, providerData } = user;

      user.getIdToken().then((accessToken: string) => {
        const signInStatus = document.getElementById('sign-in-status');
        const signInButton = document.getElementById('sign-in');
        const accountDetails = document.getElementById('account-details');

        if (signInStatus) signInStatus.textContent = 'Signed in';
        if (signInButton) signInButton.textContent = 'Sign out';
        if (accountDetails) {
          accountDetails.textContent = JSON.stringify({
            displayName,
            email,
            emailVerified,
            phoneNumber,
            photoURL,
            uid,
            accessToken,
            providerData
          }, null, '  ');
        }
      });
    } else {
      // User is signed out.
      document.getElementById('sign-in-status')!.textContent = 'Signed out';
      document.getElementById('sign-in')!.textContent = 'Sign in';
      document.getElementById('account-details')!.textContent = 'null';
    }
  }, function (error) {
    console.log(error);
  });
};

export { initApp, auth };