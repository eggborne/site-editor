import { useState } from 'react'
import './App.css'
import LoginScreen from './components/LoginScreen';

function App() {

  // const [currentValues, setCurrentValues] = useState({}); 

  const handleClickSave = () => {
    console.log('clicked SAVE');
  }

  return (
    <>
      <header>
        <h1>Site Editor 🐪</h1>
      </header>
      <main>
        <LoginScreen />
        <div className='adjustment-area'>
          
        </div>
      </main>
      <footer>
        <button onClick={ handleClickSave } type='button'>SAVE IT FOR REAL</button>
      </footer>
    </>
  )
}

export default App
