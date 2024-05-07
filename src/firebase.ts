import * as firebaseui from 'firebaseui';
import { initializeApp } from "firebase/app";
import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { imageDataObj } from './App';
// import { getAnalytics } from "firebase/analytics";

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const dbUrl = import.meta.env.VITE_DATABASE_URL;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "site-editor-70b42.firebaseapp.com",
  projectId: "site-editor-70b42",
  storageBucket: "site-editor-70b42.appspot.com",
  messagingSenderId: "748460455351",
  appId: "1:748460455351:web:024448217433ad255f6432",
  measurementId: "G-7B1Q203GVY",
  databaseURL: dbUrl,
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

const writeUserSitePreferences = async (siteId: string, newPreferencesObj: object, test?: boolean | false) => {
  console.warn('firebase.ts.writeUserSitePreferences', siteId, newPreferencesObj);
  await set(ref(database, `sites/${siteId}/userContent/${test ? 'test' : 'prod'}`), newPreferencesObj);
}

const writeUserImageData = async (siteId: string, newImageDataObj: imageDataObj) => {
  try {
    const imageTargetUrl = `sites/${siteId}/userContent/test/images/${newImageDataObj.fileName}`;
    console.warn('writeUserImageData', imageTargetUrl, newImageDataObj)
    await set(ref(database, imageTargetUrl), newImageDataObj);
    console.log('Save operation was successful');
    return true;
  } catch (error) {
    console.error('Save operation failed:', error);
    return false;
  }
}

const writeUserSiteAttribute = async (siteId: string, path: string | '', newAttributeKey: string, newAttributeValue: string) => {
  const dbUrl = `sites/${siteId}/userContent/test${path ? `/${path}` : ''}/${newAttributeKey}`;
  console.log('dbUrl', dbUrl, 'adding', newAttributeValue);
  await set(ref(database, dbUrl), newAttributeValue);
}

const saveUserSiteAttribute = (siteId: string, newAttributeKey: string, newAttributeValue: string) => {
  console.warn('-- saveUserSiteAttribute to PROD', siteId, newAttributeKey, newAttributeValue);
  const dbUrl = `sites/${siteId}/userContent/prod/cssPreferences/${newAttributeKey}`;
  set(ref(database, dbUrl), newAttributeValue);
}

const writeUserSectionAttribute = (siteId: string, sectionNumber: number, newAttributeKey: string, newAttributeValue: string) => {
  const dbUrl = `sites/${siteId}/userContent/test/sections/${sectionNumber}/${newAttributeKey}`;
  console.warn('writeUserSectionAttribute', siteId, sectionNumber, newAttributeKey, newAttributeValue);
  set(ref(database, dbUrl), newAttributeValue);
}

const saveUserSectionAttribute = async (siteId: string, sectionNumber: number, newAttributeKey: string, newAttributeValue: string) => {
  console.warn('-- saveUserSectionAttribute to PROD', siteId, newAttributeKey, newAttributeValue);
  const dbUrl = `sites/${siteId}/userContent/prod/sections/${sectionNumber}/${newAttributeKey}`;
  await set(ref(database, dbUrl), newAttributeValue);
  return true;
}

const getUserSiteList = async (userId: string) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `sites`));
  if (snapshot.exists()) {
    const userSites = [];
    for (let siteId in snapshot.val()) {
      const siteObj = snapshot.val()[siteId];
      Object.keys(siteObj.authorizedUsers).includes(userId) && userSites.push({...siteObj, siteId});
    }
    return userSites;
  } else {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> No user site data available");
    return null;
  }
}

const getUserSitePreferences = async (siteId: string, production?: boolean | false) => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `sites/${siteId}/userContent/${production ? 'prod' : 'test'}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> No user preference data available");
    return null;
  }
}

export {
  auth,
  database,
  getUserSiteList,
  writeUserImageData,
  writeUserSitePreferences,
  writeUserSiteAttribute,
  writeUserSectionAttribute,
  saveUserSiteAttribute,
  saveUserSectionAttribute,
  getUserSitePreferences,
  startUI,
  resetUI,
};