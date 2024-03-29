
import { ChangeEvent, FC } from 'react';
import './InputList.css';
import { CSSPropertiesState } from '../App';

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
  cssProperties: CSSPropertiesState;
  handleChangeProperty: (name: string, value: string) => void;
}

const InputList: FC<InputListProps> = ({ propertiesKey, cssProperties, handleChangeProperty }) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    let { name, value } = event.target;
    console.log('got', name, value);
    propertiesKey[name].unit && (value += propertiesKey[name].unit);
    handleChangeProperty(name, value);
  };

  return (
    <div className={'input-list'}>
      {Object.entries(cssProperties).map(([key, value]) => {
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
