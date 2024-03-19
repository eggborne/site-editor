import { useEffect, useState } from 'react'
import './App.css'
import { getUserPreferences } from './scripts/db';
import AdjustmentRow from './components/AdjustmentRow';

function App() {

  const [currentValues, setCurrentValues] = useState({});

  useEffect(() => {
    async function getPrefs() {
      const initialValues = await getUserPreferences('1');
      setCurrentValues(initialValues);
    }
    getPrefs();
  }, []);

  useEffect(() => {
    console.log('values changed!', currentValues);
  }, [currentValues])

  return (
    <>
      <header>
        <h1>Site Editor 🐪</h1>
      </header>
      <main>
        <div className='adjustment-area'>
          {Object.entries(currentValues).map(([label, currentValue]) =>
            <AdjustmentRow label={label} currentValue={currentValue as string} />
          )}
        </div>
      </main>
      <footer>footer</footer>
    </>
  )
}

export default App
