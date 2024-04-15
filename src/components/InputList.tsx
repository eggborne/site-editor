
import { FC } from 'react';
import './InputList.css';

const fontOptions = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Lucida Console",
  "Comic Sans MS",
  "Arial Black",
  "Impact"
];

interface InputListProps {
  propertiesKey: any;
  cssVariables: Array<[string, string]>;
  cssData: Array<[string, string]>;
  // cssData: Record<string, string>;
  handleChangeProperty: (path: string, name: string, value: string) => void;
}

const InputList: FC<InputListProps> = ({ propertiesKey, cssData, handleChangeProperty }) => {

  const handleInputChange = (event: any) => {
    let { name, value } = event.target;
    propertiesKey[name].unit && (value += propertiesKey[name].unit);
    handleChangeProperty('cssPreferences', name, value);
  };

  return (
    <div className={'input-list'}>
      <h2>Colors / Sizes</h2>
      {cssData.map(([key, value]) => {
        const property = propertiesKey[key];
        return (
          <div className={`input-row ${property.type}`} key={key}>
            <label>{property.label}</label>
            <div className={'input-value-display'}>{value}</div>
            {property.type === 'select' ?
              <select defaultValue={value} name={key} onChange={handleInputChange}>
                {fontOptions.map((option: string) => {
                  return <option key={option} value={option}>{option}</option>;
                })}
              </select>
              :
              key.includes('animation-duration') ?
                <input
                  defaultValue={property.unit ? parseInt(value).toString() : value}
                  type={property.type}
                  min={property.min}
                  max={property.max}
                  step={property.step}
                  name={key}
                  onPointerUp={handleInputChange}
                />
                :
                <input
                  defaultValue={property.unit ? parseInt(value).toString() : value}
                  type={property.type}
                  min={property.min}
                  max={property.max}
                  step={property.step}
                  name={key}
                  onChange={handleInputChange}
                />
            }
          </div>
        )
      })}
    </div>
  );
};

export default InputList;
