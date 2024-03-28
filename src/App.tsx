import { useEffect, useState } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import { auth, getUserSiteList, getUserSitePreferences, resetUI, startUI, writeUserSitePreferences } from './firebase';
import { User, signOut } from 'firebase/auth';
import Header from './components/Header';
import InputList from './components/InputList';

window.addEventListener('DOMContentLoaded', startUI);

export interface CSSPropertiesState {
  '--footer-height': string;
  '--hamburger-animation-duration': string;
  '--hamburger-size': string;
  '--header-bg-color': string;
  '--header-height': string;
  '--header-padding-horiz': string;
  '--header-padding-vert': string;
  '--main-bg-color': string;
  '--main-font-color': string;
  '--main-padding-horiz': string;
  '--main-padding-vert': string;
  '--nav-area-bg-color': string;
  '--nav-area-font': string;
  '--nav-area-font-color': string;
  '--nav-area-font-size': string;
  '--nav-padding-horiz': string;
  '--nav-padding-vert': string;
  '--nav-text-shadow-x': string;
  '--nav-text-shadow-y': string;
  '--nav-text-shadow-blur': string;
  '--nav-text-shadow-color': string;
  '--text-accent-color': string;
  '--title-font': string;
}

function App() {

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteList, setSiteList] = useState([]);
  const [currentSite, setCurrentSite] = useState({ siteId: '', siteName: '', siteUrl: '' });
  const [currentCSSValues, setCurrentCSSValues] = useState({} as CSSPropertiesState);

  const init = () => {

    auth.onAuthStateChanged(async (user: User | null) => {
      console.warn('AUTH STATE CHANGED! ---------------------->')
      if (user) {
        console.warn('-------> USER SIGNED IN!', user);
        // const newSignUp = user.metadata.creationTime === user.metadata.lastSignInTime;

        setCurrentUser(user);
        let sites = await getUserSiteList(user.uid);
        const nextSiteList: Array<any> = new Array();
        for (let site in sites) {
          const siteObj = sites[site];
          siteObj.siteId = site;
          console.log('siteObj?', siteObj);
          nextSiteList.push(siteObj);
        }
        setSiteList(nextSiteList as any);
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
      writeUserSitePreferences(currentSite.siteId, currentCSSValues, 'test');
    }
  }

  const signUserOut = async () => {
    setCurrentUser(null);
    await signOut(auth);
    resetUI();
  }

  const handleClickSite = (e: any) => {
    const nextSite: any = siteList.find((site: any) => site.siteId === e.target.id);
    setCurrentSite(nextSite);
  }

  const handleChangeProperty = (name: string, value: string) => {
    const nextCSSValues = { ...currentCSSValues, [name]: value };
    setCurrentCSSValues(nextCSSValues);

  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {

    async function getPrefs() {
      if (currentUser && currentUser.uid && currentSite) {
        const prefs = await getUserSitePreferences(currentSite.siteId);
        console.log('got prefs', prefs);
        setCurrentCSSValues(prefs);
        setLoading(false);
      }
    }

    getPrefs();
  }, [currentSite]);

  return (
    <>
      <Header ready={ready} currentUser={currentUser} signUserOut={signUserOut} />
      <main>
        {ready ?
          currentUser &&
          <div className='adjustment-area'>
            {!currentSite.siteId ?
              <>
                <div>Choose a site:</div>
                <div>
                  {siteList.map((site: any) => {
                    return <button key={site.siteId} id={site.siteId} onClick={handleClickSite}>{site.siteUrl}</button>;
                  })}
                </div>
              </>
              :
                !loading ?
                  <>
                    <h3><a href={`${currentSite.siteUrl}?live`} target='_blank' rel='noopener noreferrer'>{currentSite.siteUrl}?live</a></h3>
                    <InputList cssProperties={currentCSSValues} handleChangeProperty={handleChangeProperty} />
                  </>
                  :
                  <div>loading...</div>
            }
          </div>
          :
          <div>loading</div>
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
