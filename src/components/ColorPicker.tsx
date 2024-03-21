import { useEffect, useState } from 'react';
import './ColorPicker.css';
import { SliderPicker } from 'react-color';

interface ColorPickerProps {
  attributeName: string;
  color: string;
  handleColorChange: (attributeName: string, newValue: string) => void;
}

function ColorPicker({ attributeName, color, handleColorChange }: ColorPickerProps) {

  const [selectedColor, setSelectedColor] = useState(color);

  const onColorChange = (e: any) => {
    console.log('onColorChange!', attributeName, e.hex)
    setSelectedColor(e.hex);
    handleColorChange(attributeName, e.hex);
  }

  useEffect(() => {
    if (color !== selectedColor) {
      console.warn('changed color!')
    }
  }, [color])
  
  return (
    <div className='color-picker'>
      <SliderPicker color={selectedColor} onChangeComplete={onColorChange} />
    </div>
  )
}

export default ColorPicker
