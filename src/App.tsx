import { useEffect, useState } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import { auth, database, getUserSiteList, getUserSitePreferences, resetUI, startUI, writeUserImageData, writeUserSiteAttribute, writeUserSitePreferences } from './firebase';
import { User, signOut } from 'firebase/auth';
import Header from './components/Header';
import InputList from './components/InputList';
import ToastModal from './components/ToastModal';
import SectionArea from './components/SectionArea';
import { storage } from './firebase_storage';
import { deleteObject, getDownloadURL, getMetadata, list, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { get, ref as dbRef, remove } from 'firebase/database';
import BusyIndicator from './components/BusyIndicator';
import { pause, propertiesKey } from './scripts/util';
import LoadingBar from './components/LoadingBar';
import ConfirmModal from './components/ConfirmModal';

export interface userCSSData {
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
}

export interface imageDataObj {
  description: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  extension: string;
  fileName: string;
  media: string;
  series: string;
  size: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  aspectRatio?: Number;
}

export interface imagePublishObj {
  description: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  media: string;
  series: string;
  title: string;
  aspectRatio: number;
}

interface SectionData {
  id: string;
  label: string;
  href: string;
  textContent: string;
}

interface userValuesData {
  cssPreferences: userCSSData;
  sections: SectionData[];
  images: Record<string, imageDataObj>;
  title: string;
}

export interface uploadProgressData {
  bytesSent: number;
  bytesTotal: number;
}

function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteList, setSiteList] = useState([]);
  const [savedUserValues, setSavedUserValues] = useState({} as userValuesData)
  const [userValues, setUserValues] = useState({} as userValuesData)
  const [currentSite, setCurrentSite] = useState({ siteId: '', siteName: '', siteUrl: '' });
  const [databaseBusy, setDatabaseBusy] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [siteStorage, setSiteStorage] = useState(null as any);
  const [siteImages, setSiteImages] = useState(null as any);
  const [uploadProgress, setUploadProgress] = useState({} as uploadProgressData);
  const [confirmingRestore, setConfirmingRestore] = useState(false);

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

  const getPrefs = async () => {
    if (currentUser && currentUser.uid && currentSite) {
      const prefs = await getUserSitePreferences(currentSite.siteId);
      console.log('got prefs', prefs);
      setUserValues(prefs);
      setLoading(false);
    }
  }

  const restoreSaved = async () => {
    // const restoredValues = await getUserSitePreferences(currentSite.siteId, true);
    const restoredValues = { ...savedUserValues };
    setUserValues(restoredValues);
    console.warn('sending', restoredValues)
    await writeUserSitePreferences(currentSite.siteId, restoredValues, true);
    location.reload();
  }

  const handleClickSave = async () => {
    if (currentUser && !databaseBusy) {
      console.log('CLICKED SAVE TO SAVE ---->', userValues);
      setDatabaseBusy(true);
      try {
        await writeUserSitePreferences(currentSite.siteId, userValues);
        // const nextSavedUserValues = await getUserSitePreferences(currentSite.siteId, true);
        const nextSavedUserValues = { ...userValues };
        setSavedUserValues(nextSavedUserValues);
      } catch (error) {
        console.error('Save error:', error);
      }
      setDatabaseBusy(false);
      setJustSaved(true);
      setTimeout(() => {
        setJustSaved(false);
      }, 1200);
    }
  }

  const signUserOut = async () => {
    setCurrentUser(null);
    await signOut(auth);
    resetUI();
  }

  const handleClickSite = async (e: any) => {
    const nextSite: any = siteList.find((site: any) => site.siteId === e.target.id);
    setCurrentSite(nextSite);
    const storageRef = ref(storage, `sites/${nextSite.siteId}/images/${currentUser?.uid}`);
    console.log('storageRef', storageRef)
    setSiteStorage(storageRef);
    const nextSavedUserValues = await getUserSitePreferences(nextSite.siteId, true);
    setSavedUserValues(nextSavedUserValues);
  }

  const handleChangeProperty = async (path: string, name: string, value: string) => {
    let nextUserValues = { ...userValues };
    if (path === 'cssPreferences') {
      const nextPrefs = { ...nextUserValues.cssPreferences, [name]: value };
      nextUserValues.cssPreferences = nextPrefs;
    } else {
      nextUserValues = { ...userValues, [name]: value };
    }
    console.log('handleChangeProperty nextUserValues?', nextUserValues);
    setUserValues(nextUserValues);
    if (currentUser) {
      setDatabaseBusy(true);
      await writeUserSiteAttribute(currentSite.siteId, path, name, value);
      setDatabaseBusy(false);
    }
  }

  const getImageArray = async (siteImages: any) => {
    const imageArr: object[] = [];
    for (const image of siteImages) {
      console.log('doing image', image)
      console.log('image.name', image.name);
      const imageRef = ref(siteStorage, image.name);
      const imageDbUrl = `sites/${currentSite.siteId}/userContent/test/images/${image.name.split('.')[0]}`;
      console.log('imageDbUrl', imageDbUrl);
      const imageDataRef = dbRef(database, imageDbUrl);
      const imageMetadata = await get(imageDataRef);
      console.log('imageMetadata', imageMetadata.val());
      // const url = await getDownloadURL(imageRef);
      const meta = await getMetadata(imageRef);
      console.log('getMetadata', meta);
      const fullMetadata = { ...imageMetadata.val(), ...meta };
      console.log('----- full metatadata { ...imageMetadata.val(), ...meta } -->', fullMetadata);
      imageArr.push(fullMetadata);
    }
    return imageArr;
  };

  const splitFileName = (fileName: string) => {
    return fileName.lastIndexOf('.') > 0
      ? [fileName.substring(0, fileName.lastIndexOf('.')), fileName.substring(fileName.lastIndexOf('.') + 1)]
      : [fileName, ''];
  }

  const uploadThumbnail = async (thumbnailFile: File) => {
    const storageRef = ref(siteStorage, `/thumbnails/${thumbnailFile.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, thumbnailFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`File uploaded at ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Upload failed');
    }
  }

  const publishFile = async (file: File, thumbnailFile: File, newImageObj: imagePublishObj) => {
    setDatabaseBusy(true);
    const { series, title, description, dimensions, media, aspectRatio } = newImageObj;
    const imageRef = ref(siteStorage, file.name);
    console.log('uploading file', file.name, 'to', imageRef);

    const thumbnailUrl = await uploadThumbnail(thumbnailFile);
    console.log('thumbnailUrl', thumbnailUrl);

    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setUploadProgress({
          bytesSent: snapshot.bytesTransferred,
          bytesTotal: snapshot.totalBytes,
        });
      },
      (error) => {
        console.error(error.code)
      },
      async () => {
        // Upload completed successfully
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const size = file.size;
        const splitFileNameArr = splitFileName(file.name);
        const metadata: imageDataObj = {
          description: description || 'Sample Description',
          dimensions: {
            width: dimensions.width || 1,
            height: dimensions.height || 1,
            unit: dimensions.unit || '',
          },
          extension: splitFileNameArr[1],
          fileName: splitFileNameArr[0],
          media: media || 'Sample Media',
          size,
          title: title || 'Sample Title',
          series: series || '',
          url: downloadURL,
          thumbnailUrl,
          aspectRatio,
        };
        console.log('writing image data', metadata)
        const savedResult = await writeUserImageData(currentSite.siteId, metadata);
        if (savedResult) {
          console.log('saved image data');
          await pause(500);
          setDatabaseBusy(false);
          setUploadProgress({
            bytesSent: 0,
            bytesTotal: 0,
          });
          refreshSiteImages();
        } else {
          console.error('failed to save image data');
        }
        return savedResult;
      }
    );
  }

  const refreshSiteImages = async () => {
    const result = await list(siteStorage);
    const newImages = await getImageArray(result.items) as imageDataObj[];
    console.log('got newImages', newImages);
    console.log('imaegs??', userValues.images)
    setSiteImages(newImages);
  }

  const deleteImage = async (imageWithExt: string) => {
    console.log('deleting image', imageWithExt)
    const imageRef = ref(siteStorage, imageWithExt);
    const imageThumbnailRef = ref(siteStorage, `thumbnails/thumbnail_${imageWithExt}`)
    const testDataRef = dbRef(database, `sites/${currentSite.siteId}/userContent/test/images/${splitFileName(imageWithExt)[0]}`);
    setDatabaseBusy(true);
    await deleteObject(imageThumbnailRef);
    await deleteObject(imageRef);
    await remove(testDataRef);
    try {
      const prodDataRef = dbRef(database, `sites/${currentSite.siteId}/userContent/prod/images/${splitFileName(imageWithExt)[0]}`);
      await remove(prodDataRef);
      console.error('REMOVED PROD IMAGE??')
    } catch (error) {
      console.error('not in prod!', error);
    }
    await refreshSiteImages();
    setDatabaseBusy(false);
  };

  const updateSectionData = async (newSectionData: any, sectionNumber: number) => {
    Object.entries(newSectionData).forEach(async ([key, value]) => {
      console.log('writing', key, value)
      await writeUserSiteAttribute(currentSite.siteId, `sections/${sectionNumber}`, key, value as string);
    });
    const nextUserValues = { ...userValues };
    nextUserValues.sections[sectionNumber] = newSectionData;
    console.log('nextUserValues?', nextUserValues);
    setUserValues(nextUserValues);
  }

  const updateImageData = (imageObj: imageDataObj) => {
    console.log('updateImageData received changed imageObj', imageObj);
    console.log('userValues', userValues);
    const nextUserValues = { ...userValues };
    const nextImages = { ...nextUserValues.images } as Record<string, imageDataObj>;
    nextImages[imageObj.fileName] = imageObj;
    nextUserValues.images = nextImages;
    console.log('changed to', nextUserValues);
    setUserValues(nextUserValues);
    writeUserImageData(currentSite.siteId, imageObj);
    refreshSiteImages();
  }

  useEffect(() => {
    if (siteStorage) {
      refreshSiteImages();
    }
  }, [siteStorage]);

  useEffect(() => {
    init();
    startUI();
  }, []);

  useEffect(() => {
    getPrefs();
  }, [currentSite]);

  const cssVariables = userValues.cssPreferences ? Object.entries(userValues.cssPreferences) : [];

  const cssData: Record<string, string> = {};
  if (userValues.cssPreferences) {
    for (let [itemKey, itemValue] of Object.entries(userValues.cssPreferences)) {
      cssData[itemKey] = itemValue;
    }
  }

  const unsavedChanges = JSON.stringify(savedUserValues) != JSON.stringify(userValues);

  if (unsavedChanges) {
    console.log('unsaved!');
    console.log(savedUserValues, userValues);
  }

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
                  <div className='narrow-label-input'>
                    <label>Main title:</label>
                    <input type='text' defaultValue={userValues.title} onChange={e => handleChangeProperty('', 'title', e.target.value)}></input>
                  </div>
                  <SectionArea
                    sections={Object.entries(userValues.sections)}
                    currentSiteId={currentSite.siteId}
                    siteImages={siteImages}
                    publishFile={publishFile}
                    updateSectionData={updateSectionData}
                    deleteImage={deleteImage}
                    updateImageData={updateImageData}
                    refreshSiteImages={refreshSiteImages}
                  />
                  <InputList
                    propertiesKey={propertiesKey}
                    cssVariables={cssVariables}
                    cssData={Object.entries(userValues.cssPreferences)}
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
      <footer className={unsavedChanges ? 'unsaved' : ''}>
        {currentSite.siteId &&
          <>
            <button className='restore-button caution' disabled={databaseBusy || !unsavedChanges} onClick={() => setConfirmingRestore(true)} type='button'>Restore Saved</button>
            <button className='save-button' disabled={databaseBusy || !unsavedChanges} onClick={handleClickSave} type='button'>SAVE IT FOR REAL</button>
          </>
        }
      </footer>
      <ToastModal
        message={`
          Saved!
          ${currentSite.siteUrl}
        `} visible={justSaved}
      />
      <ConfirmModal
        visible={confirmingRestore}
        message={`Really restore everything to the last saved state? This will also reload the page.`}
        confirmAction={async () => { await restoreSaved() }}
        cancelAction={() => setConfirmingRestore(false)}
      />
      <BusyIndicator visible={databaseBusy} />
      <LoadingBar progress={uploadProgress} visible={!!uploadProgress.bytesTotal} />
    </>
  )
}

export default App
