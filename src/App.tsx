import { useEffect, useState } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import { auth, getUserSiteList, getUserSitePreferences, resetUI, startUI, writeUserSitePreferences } from './firebase';
import { User, signOut } from 'firebase/auth';

function App() {

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteList, setSiteList] = useState([]);
  const [currentSite, setCurrentSite] = useState('');
  const [currentCSSValues, setCurrentCSSValues] = useState({});

  const init = () => {

    auth.onAuthStateChanged(async (user: User | null) => {
      console.warn('AUTH STATE CHANGED! ---------------------->')
      if (user) {
        console.warn('-------> USER SIGNED IN!', user);
        // const newSignUp = user.metadata.creationTime === user.metadata.lastSignInTime;

        setCurrentUser(user);
        const sites = await getUserSiteList(user.uid);
        console.log('sites?', sites);
        setSiteList(sites);
        // const nextPrefs = await getUserSitePreferences(user.uid);
        // console.log('got nextPrefs', nextPrefs);
        // setCurrentCSSValues(nextPrefs);
        if (!ready) {
          setReady(true);
        }
      } else {
        console.error('USER IS NOT SIGNED IN');
      }
      setReady(true);

    }, function (error) {
      console.log(error);
    });
  };

  const handleClickSave = () => {
    if (currentUser) {
      writeUserSitePreferences(currentUser.uid, currentSite, currentCSSValues);
      console.log('clicked SAVE');
    }
  }

  const signUserOut = async () => {
    setCurrentUser(null);
    await signOut(auth);
    resetUI();
  }

  const handleClickSite = (e: any) => {
    console.log('clicked site', e.target.textContent);
    setCurrentSite(e.target.textContent);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {

    async function getPrefs() {
      if (currentUser && currentUser.uid && currentSite) {
        const prefs = await getUserSitePreferences(currentUser.uid, currentSite);
        console.log('got prefs', prefs);
        setLoading(false);
      }
    }

    getPrefs();
  }, [currentSite]);

  return (
    <>
      <header>
        <h1>Site Editor 🐪</h1>
        <div className='user-info'>
          {ready ?
            currentUser &&
            <div>
              Logged in as {currentUser.displayName || currentUser.email}
              <button onClick={signUserOut} type='button' className='sign-out-button'>Sign Out</button>
            </div>
            :
            <div>loading...</div>
          }
        </div>
      </header>
      <main>
        {ready ?
          currentUser &&
          <div className='adjustment-area'>
            <p>{currentUser.displayName} ({currentUser.email}) is logged in now</p>
            {!currentSite ?
              <>
                <div>Choose a site:</div>
                <div>
                  {siteList.map(site => {
                    return <button key={site} onClick={handleClickSite}>{site}</button>;
                  })}
                </div>
              </>
              :
              !loading ? <div>selected site: {currentSite}</div> : <div>loading...</div>
            }
          </div>
          :
          <div>loading...</div>
        }
        {!currentUser &&
          <LoginScreen visible={ready} />
        }
      </main>
      <footer>
        {currentUser && <button onClick={handleClickSave} type='button'>SAVE IT FOR REAL</button>}
      </footer>
    </>
  )
}

export default App
