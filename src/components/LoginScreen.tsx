import './LoginScreen.css';

import { initApp, auth } from '../firebase';
import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

// interface LoginScreenProps {
//   attributeName: string;
//   label: string;
//   type: string;
//   currentValue: string;
//   handleColorChange: (attributeName: string, newValue: string) => void;
// }

console.warn('calling initApp()');
initApp();
const ui = new firebaseui.auth.AuthUI(auth);


ui.start('#firebaseui-auth-container', {
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID,
  ],
  // Other config options...
});

// function LoginScreen({ attributeName, label, type, currentValue, handleColorChange }: LoginScreenProps) {
const LoginScreen = () => {

  return (
    <div className='centered-modal login-screen'>
      <pre id="account-details"></pre>
      <div id="sign-in-status"></div>
      <div id="sign-in"></div>
      < div id='firebaseui-auth-container'></div>
    </div>
  )
}

export default LoginScreen;
