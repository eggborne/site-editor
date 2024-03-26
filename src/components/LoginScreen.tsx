import './LoginScreen.css';
import { useEffect } from 'react';

interface LoginScreenProps {
  visible: boolean;
}

// function LoginScreen({ attributeName, label, type, currentValue, handleColorChange }: LoginScreenProps) {
const LoginScreen = ({ visible }: LoginScreenProps) => {

  return (
    <div className={`centered-modal login-screen${visible ? ' visible' : ''}`}>
      <div id={'firebaseui-auth-container'}></div>
    </div>
  )
}

export default LoginScreen;
