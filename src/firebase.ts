import * as firebaseui from 'firebaseui';
import { initializeApp } from "firebase/app";
import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { } from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

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

const writeUserSitePreferences = async (siteId: string, newPreferencesObj: object) => {
  // const result = await set(ref(database, `sites/${siteId}/prod`), newPreferencesObj);
  // return result;

  try {
    await set(ref(database, `sites/${siteId}/prod`), newPreferencesObj);
    console.log('Save operation was successful');
    return true; // Indicates success
  } catch (error) {
    console.error('Save operation failed:', error);
    return false; // Indicates failure
  }
}

const writeUserSiteAttribute = (siteId: string, newAttributeKey: string, newAttributeValue: string) => {
  const dbUrl = `sites/${siteId}/test/${newAttributeKey}`;
  console.log('writing', newAttributeKey, newAttributeValue, 'to', dbUrl)
  set(ref(database, dbUrl), newAttributeValue);
}

const getUserSiteList = async (userId: string) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `sites`));
  if (snapshot.exists()) {
    // const userSites = Object.values(snapshot.val()).filter((site: any) => {
    //   console.log('site?', site);
    //   return Object.keys(site.authorizedUsers).includes(userId);;
    // });
    const userSites = [];
    for (let siteId in snapshot.val()) {
      const siteObj = snapshot.val()[siteId];
      Object.keys(siteObj.authorizedUsers).includes(userId) && userSites.push({...siteObj, siteId});
    }
    console.log('userSites?', userSites);
    return userSites;
  } else {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> No user site data available");
    return null;
  }
}

const getUserSitePreferences = async (siteId: string) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `sites/${siteId}/test`));
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
};