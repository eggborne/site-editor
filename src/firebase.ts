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

const startUI = () => {
  ui.start('#firebaseui-auth-container', {
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: EmailAuthProvider.PROVIDER_ID,
        signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      },
      GoogleAuthProvider.PROVIDER_ID,
      GithubAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
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
}

const resetUI = () => {
  ui.reset();
  startUI();
}

const writeUserSitePreferences = (userId: string, siteId: string, newPreferencesObj: object) => {
  set(ref(database, `preferences/${userId}/${siteId}`), newPreferencesObj);
}

const getUserSiteList = async (userId: string) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `clients/${userId}/sites`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> No user site data available");
    return null;
  }
}

const getUserSitePreferences = async (userId: string, siteId: string) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `preferences/${userId}/${siteId}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> No user preference data available");
    return null;
  }
}

// const analytics = getAnalytics(firebaseApp);

window.addEventListener('DOMContentLoaded', startUI);

const obj = {
  "--footer-height": "1.75rem",
  "--hamburger-animation-duration": "200ms",
  "--hamburger-size": "calc(var(--header-height) * 0.85)",
  "--header-bg-color": "#3f3f2f",
  "--header-height": "4rem",
  "--header-padding-horiz": "0.325rem",
  "--header-padding-vert": "1rem",
  "--main-bg-color": "red",
  "--main-font-color": "#ffffffde",
  "--main-padding-horiz": "1rem",
  "--main-padding-vert": "1rem",
  "--nav-area-bg-color": "#7f8472",
  "--nav-area-font": "Helvetica",
  "--nav-area-font-color": "beige",
  "--nav-area-font-size": "1rem",
  "--nav-padding-horiz": "1rem",
  "--nav-padding-vert": "1rem",
  "--nav-text-shadow": "0.1rem 0.05rem 0.25rem #00000080",
  "--text-accent-color": "yellow",
  "--title-font": "Helvetica",
}

export {
  auth,
  database,
  getUserSiteList,
  writeUserSitePreferences,
  getUserSitePreferences,
  startUI,
  resetUI,
  // analytics,
};