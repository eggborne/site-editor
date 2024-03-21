import { useEffect, useState } from 'react'
import './App.css'
import AdjustmentRow from './components/AdjustmentRow';
import { getUserPreferences, sendUserPreferences } from './scripts/db';
import { getDisplayName } from './scripts/util';

function App() {

  const [currentValues, setCurrentValues] = useState({});
  const [busySending, setBusySending] = useState(false);

  useEffect(() => {
    async function getPrefs() {
      const initialValues = await getUserPreferences('2');
      setCurrentValues(initialValues);
    }
    getPrefs();
  }, []);

  useEffect(() => {
    async function sendPrefs() {
      if (Object.entries(currentValues).length > 0 && !busySending) {
        setBusySending(true);
        await sendUserPreferences(currentValues, false);
        setTimeout(() => {
          setBusySending(false);
        }, 1000);
      }
    }
    sendPrefs();
  }, [currentValues]);

  const handleColorChange = (attributeName: string, newValue: string) => {
    const newCurrentValues = { ...currentValues };
    (newCurrentValues as { [key: string]: string })[attributeName] = newValue;
    if (JSON.stringify(currentValues) !== JSON.stringify(newCurrentValues)) {
      setCurrentValues(newCurrentValues);
    } else {
      console.warn('---- no change! ----');
    }
  }

  const handleClickSave = () => {
    console.log('clicked SAVE');
    sendUserPreferences(currentValues, true);
  }

  return (
    <>
      <header>
        <h1>Site Editor 🐪</h1>
      </header>
      <main>
        <div className='adjustment-area'>
          {Object.entries(currentValues)
            .filter(entry => entry[0].includes('color'))
            .map(([label, currentValue]) =>
              <AdjustmentRow key={label} type='color' handleColorChange={handleColorChange} attributeName={label} label={getDisplayName(label)} currentValue={currentValue as string} />
          )}
        </div>
      </main>
      <footer>
        <button onClick={ handleClickSave } type='button'>SAVE IT FOR REAL</button>
      </footer>
    </>
  )
}

export default App
