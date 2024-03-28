
import { ChangeEvent, FC, useEffect, useState } from 'react';
import './InputList.css';
import { convertCSSVarName } from '../scripts/util';
import { CSSPropertiesState } from '../App';

const fontOptions = ["Helvetica", "Arial", "Times New Roman", "Georgia", "Sans-serif"];

interface InputListProps {
  cssProperties: CSSPropertiesState;
  handleChangeProperty: (name: string, value: string) => void;
}

const initialCSSProperties: CSSPropertiesState = {
  // color input
  "--main-bg-color": "#ff9999",
  "--header-bg-color": "#3f222f",
  "--nav-area-bg-color": "#7f8472",
  "--main-font-color": "#ffffff",
  "--nav-area-font-color": "#f5f5dc",
  "--text-accent-color": "#ffff00",
  "--nav-text-shadow-color": "#000000",
  // font selector input
  "--title-font": "Helvetica",
  "--nav-area-font": "Helvetica",
  // range input, step 0.1
    // range 2-8
  "--header-height": "4rem",
  "--footer-height": "1.75rem",
  "--hamburger-size": "2rem",
    // range 0.5-3.5
  "--nav-area-font-size": "1rem",
    // range 0.1-3.5
  "--header-padding-horiz": "0.3rem",
  "--header-padding-vert": "1rem",
  "--main-padding-horiz": "1rem",
  "--main-padding-vert": "1rem",
  "--nav-padding-horiz": "1rem",
  "--nav-padding-vert": "1rem",
    // range 0-3.5
  "--nav-text-shadow-x": "0.1rem",
  "--nav-text-shadow-y": "0.05rem",
  "--nav-text-shadow-blur": "0.25rem",
    // range 0-1000
  "--hamburger-animation-duration": "200ms",
}

// "--nav-text-shadow-alpha": "80"
  
const InputList: FC<InputListProps> = ({ cssProperties, handleChangeProperty }) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    handleChangeProperty(name, value);
  };

  // useEffect(() => {
  //   getUserSitePreferences(userSiteId).then(prefs => setCssProperties(prefs));
  // }, [])

  return (
    <div className={'input-list'}>
      {/* Color inputs */}
      {Object.entries(cssProperties).filter(([key]) => key.includes('color')).map(([key, value]) => (
        <div className={'input-row color'} key={key}>
          <label>{convertCSSVarName(key)}</label>
          <div className={'input-value-display'}>{value}</div>
          <input type="color" name={key} defaultValue={value} onChange={handleInputChange} />
        </div>
      ))}

      {/* Font selector inputs */}
      {Object.entries(cssProperties).filter(([key]) => key.includes('font') && !key.includes('color') && !key.includes('size')).map(([key, value]) => (
        <div className={'input-row select'} key={key}>
          <label>{convertCSSVarName(key)}</label>
          <select name={key} defaultValue={value} onChange={handleInputChange}>
            {fontOptions.map((font) => (
              <option key={font} defaultValue={font}>{font}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Range inputs */}
      {Object.entries(cssProperties).filter(([key]) => !key.includes('color') && (!key.includes('font') || key.includes('size'))).map(([key, value]) => {
        const isDuration = key.includes('duration');
        const step = isDuration ? 100 : 0.1; // step for duration is 100ms, for others 0.1
        const min = isDuration ? 0 : key.includes('size') ? 2 : 0.1; // Customize based on the key
        const max = isDuration ? 1000 : 3.5; // Customize based on the key
        return (
          <div className={'input-row range'} key={key}>
            <label>{convertCSSVarName(key)}</label>
            <div className={'input-value-display'}>{value}{isDuration ? !value.includes('ms') && 'ms' : !value.includes('rem') && 'rem'}</div>
            <input type="range" name={key} defaultValue={parseFloat(value)} min={min} max={max} step={step} onChange={handleInputChange} />
          </div>
        );
      })}
    </div>
  );
};

export default InputList;
