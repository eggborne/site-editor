// Import the functions you need from the SDKs you need
import * as firebaseui from 'firebaseui';
import { initializeApp } from "firebase/app";
import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider, PhoneAuthProvider, getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";


import { } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkJTNcO9Tg5q_4bnF9WvVgqrrEmeNk8Gw",
  authDomain: "site-editor-70b42.firebaseapp.com",
  projectId: "site-editor-70b42",
  storageBucket: "site-editor-70b42.appspot.com",
  messagingSenderId: "748460455351",
  appId: "1:748460455351:web:024448217433ad255f6432",
  measurementId: "G-7B1Q203GVY",
  databaseURL: "https://site-editor-70b42-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);


const ui = new firebaseui.auth.AuthUI(auth);

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      // Use email/password auth and not email link auth.
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
    },
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID,
  ],
  signInFlow: 'popup',
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      // Handle the sign-in success.
      console.log('Auth result:', authResult);
      console.log('Redirect URL:', redirectUrl);
      return false; // Return false to prevent automatic redirect.
    },
    uiShown: () => {
      console.warn('----- UI RENDERED ---------');
      // The UI has been rendered.
    }
  },
  tosUrl: '/',
  // Privacy policy url.
  privacyPolicyUrl: '/',
  // Other config options...
});

const writeUserPreferences = (userId: string, newPreferencesObj: object) => {
  set(ref(database, 'preferences/' + userId), newPreferencesObj);
}

const getUserPreferences = async (userId: string) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `preferences/${userId}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log("No data available");
    return null;
  }
}

// const analytics = getAnalytics(firebaseApp);

export {
  auth,
  database,
  // analytics,
  writeUserPreferences,
  getUserPreferences
};