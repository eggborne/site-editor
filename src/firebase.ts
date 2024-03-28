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
    privacyPolicyUrl: '/',
  });
}

const resetUI = () => {
  ui.reset();
  startUI();
}

const writeUserSitePreferences = (siteId: string, newPreferencesObj: object, type: string) => {
  set(ref(database, `preferences/${siteId}/${type}`), newPreferencesObj);
}

const writeUserSiteAttribute = (userId: string, siteId: string, newAttributeKey: string, newAttributeValue: string ) => {
  set(ref(database, `preferences/${userId}/${siteId}/${newAttributeKey}`), newAttributeValue);
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

const setSiteForUser = (userId: string, siteId: string) => {
  set(ref(database, `clients/${userId}/sites`), ['13467d21-a3a5-4ba5-88b3-ce98be547f90']);
}

const getUserSitePreferences = async (siteId: string) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `preferences/${siteId}/test`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> No user preference data available");
    return null;
  }
}

// const analytics = getAnalytics(firebaseApp);

export {
  auth,
  database,
  getUserSiteList,
  writeUserSitePreferences,
  writeUserSiteAttribute,
  getUserSitePreferences,
  startUI,
  resetUI,
  // analytics,
};