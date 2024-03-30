import { useEffect, useState } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import { auth, getUserSiteList, getUserSitePreferences, resetUI, startUI, writeUserSiteAttribute, writeUserSitePreferences } from './firebase';
import { User, signOut } from 'firebase/auth';
import Header from './components/Header';
import InputList from './components/InputList';
import ToastModal from './components/ToastModal';
import SectionArea from './components/SectionArea';

// window.addEventListener('DOMContentLoaded', startUI);

export interface CSSPropertiesState {
  '--main-bg-color': string;
  '--main-font-color': string;
  '--main-font-size': string;
  '--header-bg-color': string;
  '--nav-area-bg-color': string;
  '--nav-area-font-color': string;
  '--nav-area-font': string;
  '--nav-area-font-size': string;
  '--hamburger-size': string;
  '--main-padding-horiz': string;
  '--main-padding-vert': string;
  '--nav-padding-horiz': string;
  '--nav-padding-vert': string;
  '--header-height': string;
  '--header-padding-horiz': string;
  '--header-padding-vert': string;
  '--title-font': string;
  '--main-font': string;
  '--footer-height': string;
  '--nav-text-shadow-x': string;
  '--nav-text-shadow-y': string;
  '--nav-text-shadow-blur': string;
  '--nav-text-shadow-color': string;
  '--text-accent-color': string;
  '--hamburger-animation-duration': string;
  '--hamburger-color': string;
  '--hamburger-line-color': string;
  '--hamburger-line-thickness': string;
  '--hamburger-on-color': string;
  '--hamburger-roundness': string;
  '--logo-size': string;
  '--logo-color': string;
  '--title-font-size': string;
  '--title-font-color': string;
  'sections': object;
}

const propertiesKey = {
  '--footer-height': {
    label: 'Footer Height',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--hamburger-animation-duration': {
    label: 'Hamburger Animation Duration',
    type: 'range',
    min: 0,
    max: 1000,
    step: 1,
    unit: 'ms',
  },
  '--hamburger-size': {
    label: 'Hamburger Size',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--header-bg-color': {
    label: 'Header Background Color',
    type: 'color',
  },
  '--header-height': {
    label: 'Header Height',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--header-padding-horiz': {
    label: 'Header Padding Horizontal',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--header-padding-vert': {
    label: 'Header Padding Vertical',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--main-bg-color': {
    label: 'Main Background Color',
    type: 'color',
  },
  '--main-font-color': {
    label: 'Main Font Color',
    type: 'color',
  },
  '--main-font-size': {
    label: 'Main Font Size',
    type: 'range',
    min: 0.1,
    max: 3.5,
    step: 0.005,
    unit: 'rem',
  },
  '--main-padding-horiz': {
    label: 'Main Padding Horizontal',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--main-padding-vert': {
    label: 'Main Padding Vertical',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-area-bg-color': {
    label: 'Nav Area Background Color',
    type: 'color',
  },
  '--nav-area-width': {
    label: 'Nav Area Width',
    type: 'range',
    min: 2,
    max: 24,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-area-font': {
    label: 'Nav Area Font',
    type: 'select',
    options: ['Arial', 'Helvetica', 'sans-serif'],
  },
  '--nav-area-font-color': {
    label: 'Nav Area Font Color',
    type: 'color',
  },
  '--nav-area-font-size': {
    label: 'Nav Area Font Size',
    type: 'range',
    min: 0.1,
    max: 3.5,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-padding-horiz': {
    label: 'Nav Padding Horizontal',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-padding-vert': {
    label: 'Nav Padding Vertical',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-text-shadow-x': {
    label: 'Nav Text Shadow X',
    type: 'range',
    min: -2,
    max: 2,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-text-shadow-y': {
    label: 'Nav Text Shadow Y',
    type: 'range',
    min: -2,
    max: 2,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-text-shadow-blur': {
    label: 'Nav Text Shadow Blur',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-text-shadow-color': {
    label: 'Nav Text Shadow Color',
    type: 'color',
  },
  '--text-accent-color': {
    label: 'Text Accent Color',
    type: 'color',
  },
  '--title-font': {
    label: 'Title Font',
    type: 'select',
    options: ['Arial', 'Helvetica', 'sans-serif'],
  },
  '--title-font-size': {
    label: 'Title Font Size',
    type: 'range',
    min: 0.1,
    max: 3.5,
    step: 0.05,
    unit: 'rem',
  },
  '--title-font-color': {
    label: 'Title Font Color',
    type: 'color',
  },
  '--main-font': {
    label: 'Main Font',
    type: 'select',
    options: ['Arial', 'Helvetica', 'sans-serif'],
  },
  '--logo-size': {
    label: 'Logo Size',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--logo-color': {
    label: 'Logo Color',
    type: 'color',
  },
  '--hamburger-color': {
    label: 'Hamburger Color',
    type: 'color',
  },
  '--hamburger-line-color': {
    label: 'Hamburger Line Color',
    type: 'color',
  },
  '--hamburger-line-thickness': {
    label: 'Hamburger Line Thickness',
    type: 'range',
    min: 0.1,
    max: 1,
    step: 0.01,
    unit: 'rem',
  },
  '--hamburger-on-color': {
    label: 'Hamburger On Color',
    type: 'color',
  },
  '--hamburger-roundness': {
    label: 'Hamburger Roundness',
    type: 'range',
    min: 0,
    max: 50,
    step: 0.5,
    unit: '%'
  }
};

function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteList, setSiteList] = useState([]);
  const [currentSite, setCurrentSite] = useState({ siteId: '', siteName: '', siteUrl: '' });
  const [currentCSSValues, setCurrentCSSValues] = useState({} as CSSPropertiesState);
  const [justSaved, setJustSaved] = useState(false);

  const init = () => {
    auth.onAuthStateChanged(async (user: User | null) => {
      console.warn('AUTH STATE CHANGED! ---------------------->')
      if (user) {
        console.warn('-------> USER SIGNED IN!', user);
        // const newSignUp = user.metadata.creationTime === user.metadata.lastSignInTime;
        setCurrentUser(user);
        let sites = await getUserSiteList(user.uid);
        setSiteList(sites as any);
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

  const handleClickSave = async () => {
    if (currentUser) {
      const saved = await writeUserSitePreferences(currentSite.siteId, currentCSSValues);
      if (saved) {
        setJustSaved(true);
        setTimeout(() => {
          setJustSaved(false);
        }, 2000);
      }
      
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
    currentUser &&
      writeUserSiteAttribute(currentSite.siteId, name, value);

  }

  useEffect(() => {
    init();
    startUI();
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

  const cssVariables = Object.entries(currentCSSValues).filter(prop => prop[0].indexOf('--') === 0);
  
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
                  <h3><a href={`${currentSite.siteUrl}?test`} target='_blank' rel='noopener noreferrer'>{currentSite.siteUrl}?test</a></h3>
                  <SectionArea sections={Object.entries(currentCSSValues.sections)} />
                  <InputList propertiesKey={propertiesKey} cssVariables={cssVariables} handleChangeProperty={handleChangeProperty} />
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
        {currentSite.siteId && <button onClick={handleClickSave} type='button'>SAVE IT FOR REAL</button>}
      </footer>
      <ToastModal message={`
      Saved!
      ${currentSite.siteUrl}
      `} visible={justSaved} />
    </>
  )
}

export default App
