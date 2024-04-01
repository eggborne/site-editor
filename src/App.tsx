import { useEffect, useState } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import { auth, database, getUserSiteList, getUserSitePreferences, resetUI, startUI, writeUserImageData, writeUserSectionAttribute, writeUserSiteAttribute, writeUserSitePreferences } from './firebase';
import { User, signOut } from 'firebase/auth';
import Header from './components/Header';
import InputList from './components/InputList';
import ToastModal from './components/ToastModal';
import SectionArea from './components/SectionArea';
import { storage } from './firebase_storage';
import { deleteObject, getDownloadURL, getMetadata, list, ref, uploadBytesResumable } from 'firebase/storage';
import { get, ref as dbRef } from 'firebase/database';

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
  },
  '--section-heading-color': {
    label: 'Section Heading Color',
    type: 'color',
  },
  '--section-heading-font-size': {
    label: 'Section Heading Font Size',
    type: 'range',
    min: 0.5,
    max: 3.5,
    step: 0.01,
    unit: 'rem',
  },
};

export interface publishObj {
  file: File;
  title: string;
  description: string;
  media: string;
  dimensions: Record<string, number>;
}

function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteList, setSiteList] = useState([]);
  const [currentSite, setCurrentSite] = useState({ siteId: '', siteName: '', siteUrl: '' });
  const [currentCSSValues, setCurrentCSSValues] = useState({} as CSSPropertiesState);
  const [justSaved, setJustSaved] = useState(false);
  const [siteStorage, setSiteStorage] = useState(null as any);
  const [siteImages, setSiteImages] = useState(null as any);

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
    const storageRef = ref(storage, 'sites/' + nextSite.siteId + '/images');
    console.log('storageRef', storageRef)
    setSiteStorage(storageRef);
  }

  const handleChangeProperty = (name: string, value: string) => {
    const nextCSSValues = { ...currentCSSValues, [name]: value };
    setCurrentCSSValues(nextCSSValues);
    currentUser &&
      writeUserSiteAttribute(currentSite.siteId, name, value);
  }

  const getImageArray = async (siteImages: any) => {
    const imageArr: object[] = [];
    for (const image of siteImages) {
      console.log('doing image', image)
      const imageRef = ref(siteStorage, image.name);
      const imageDataRef = dbRef(database, `sites/${currentSite.siteId}/prod/sections/0/images/${splitFileName(image.name)[0]}`);
      const imageMetadata = await get(imageDataRef);
      console.log('imageMetadata', imageMetadata.val());
      // const url = await getDownloadURL(imageRef);
      const meta = await getMetadata(imageRef);

      console.log('meta??', meta);

      const fullMetadata = { ...imageMetadata.val(), ...meta };
      console.log('----- full metatatata', fullMetadata);
      // const fullMetadata = { ...imageMetadata.val(), url, ...meta };
      imageArr.push(fullMetadata);

      // imageArr.push({url, ...image});
    }
    return imageArr;
  };

  const splitFileName = (fileName: string) => {
    return fileName.lastIndexOf('.') > 0
      ? [fileName.substring(0, fileName.lastIndexOf('.')), fileName.substring(fileName.lastIndexOf('.') + 1)]
      : [fileName, ''];
  }

  const publishFile = async ({ file, title, description, media, dimensions }: publishObj) => {
    const imageRef = ref(siteStorage, file.name);
    console.log('uploading file', file.name, 'to', imageRef);
    await uploadBytesResumable(imageRef, file);
    const url = await getDownloadURL(imageRef);
    const size = file.size;
    const filename = file.name;
    const splitFileNameArr = splitFileName(filename);
    console.log('splitFileNameArr', splitFileNameArr);
    const metadata = {
      fileName: splitFileNameArr[0],
      extension: splitFileNameArr[1],
      url,
      size,
      title: title || 'Sample Title',
      description: description || 'Sample Description',
      media: media || 'Sample Media',
      dimensions: dimensions.width || { width: 1, height: 1 },
    };
    console.log('writing image data', metadata)
    const savedResult = await writeUserImageData(currentSite.siteId, metadata);
    if (savedResult) {
      console.log('saved image data');
      await deletePreviewImage(file.name);
      refreshSiteImages();
    } else {
      console.error('failed to save image data');
    }
  }

  const getPreviewImageUrl = async (file: File) => {
    const previewRef = ref(siteStorage, '/preview/' + file.name);
    const uploadResult = await uploadBytesResumable(previewRef, file);
    console.log('preview uploaded?', uploadResult);
    const url = await getDownloadURL(previewRef);
    return url;
  }

  const refreshSiteImages = async () => {
    // const listRef = ref(storage, 'sites/' + currentSite.siteId + '/images');
    const result = await list(siteStorage);
    const newImages = await getImageArray(result.items);
    setSiteImages(newImages);
  }

  const deleteImage = async (imageWithExt: string) => {
    const imageRef = ref(siteStorage, imageWithExt);
    await deleteObject(imageRef);
    await refreshSiteImages();
  };

  const deletePreviewImage = async (imageName: string) => {
    const imageRef = ref(siteStorage, '/preview/' + imageName);
    await deleteObject(imageRef);
  };

  const updateSectionData = async (newSectionData: any, sectionNumber: number) => {
    console.log('updating section data', newSectionData);
    Object.entries(newSectionData).forEach(([key, value]) => {
      console.log('writing', key, value)
      writeUserSectionAttribute(currentSite.siteId, sectionNumber, key, value as string);
    });
  }

  useEffect(() => {
    if (siteStorage) {
      // const listRef = ref(storage, 'sites/' + currentSite.siteId + '/images');
      // list(listRef).then(async result => {
      //   console.log('list result', result.items);
      //   const newImages = await getImageArray(result.items);
      //   console.log('newImages', newImages);
      //   setSiteImages(newImages);
      // });
      refreshSiteImages();
    }

  }, [siteStorage])

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
                  <SectionArea
                    sections={Object.entries(currentCSSValues.sections)}
                    currentSiteId={currentSite.siteId}
                    siteImages={siteImages}
                    publishFile={publishFile}
                    updateSectionData={updateSectionData}
                    getPreviewImageUrl={getPreviewImageUrl}
                    deleteImage={deleteImage}
                  />
                  <InputList
                    propertiesKey={propertiesKey}
                    cssVariables={cssVariables}
                    handleChangeProperty={handleChangeProperty}
                  />
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
