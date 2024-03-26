import { useEffect, useState } from 'react'
import './App.css'
import LoginScreen from './components/LoginScreen';
import { auth, getUserPreferences, writeUserPreferences } from './firebase';
import { User, signOut } from 'firebase/auth';

function App() {

  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentToken, setCurrentToken] = useState('');
  const [currentCSSValues, setCurrentCSSValues] = useState({});

  const init = () => {
    auth.onAuthStateChanged(async (user: User | null) => {
      console.error('AUTH STATE CHANGED!')
      if (user) {
        console.warn('-------> USER SIGNED IN!', user);
        const accessToken = await user.getIdToken();
        setCurrentUser(user);
        setCurrentToken(accessToken);
        const nextPrefs = await getUserPreferences(user.uid);
        console.log('got nextPrefs', nextPrefs);
        setCurrentCSSValues(nextPrefs);
      } else {
        setCurrentUser(null);
        setCurrentToken('');
        console.error('USER SIGNED OUT');
      }
      if (!ready) {
        setReady(true);
      }
      
    }, function (error) {
      console.log(error);
    });
  };

  const handleClickSave = () => {
    console.log('clicked SAVE');
    // if (currentUser) {
    //   writeUserPreferences(currentUser.uid, currentCSSValues);
    // }
  }

  const signUserOut = async () => {
    const result = await signOut(auth);
    setCurrentUser(null);
    setCurrentToken('');
    setReady(false);
    // location.reload();
    console.warn('SIGNED OUT result:', result);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <header>
        <h1>Site Editor 🐪</h1>
        <div className='user-info'>
          {true ?
            currentUser &&
              <div>
                Logged in as {currentUser.displayName}
                <button onClick={signUserOut} type='button' className='sign-out-button'>Sign Out</button>
              </div>
            :
            <div>loading...</div>
          }
        </div>
      </header>
      <main>
        {true ?
          !currentUser ?
            <LoginScreen visible={ready} />
          :
          currentToken &&
            <div className='adjustment-area'>
              {currentUser.displayName} ({currentUser.email}) is logged in now
              </div>
          :
          <div>loading...</div>
        }
      </main>
      <footer>
        <button onClick={handleClickSave} type='button'>SAVE IT FOR REAL</button>
      </footer>
    </>
  )
}

export default App
