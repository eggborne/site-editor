import './AdjustmentRow.css';
import ColorPicker from './ColorPicker';

interface AdjustmentRowProps {
  attributeName: string;
  label: string;
  type: string;
  currentValue: string;
  handleColorChange: (attributeName: string, newValue: string) => void;
}

function AdjustmentRow({ attributeName, label, type, currentValue, handleColorChange }: AdjustmentRowProps) {
  return (
    <div className='adjustment-row'>
      {type === 'color' ?
        <>
          <ColorPicker handleColorChange={handleColorChange} attributeName={attributeName}  color={currentValue} />
          <div className='adjustment-label'>{label}</div>
          <div className='color-preview' style={{ backgroundColor: currentValue }}>
            {/* <div className='value-id'>{currentValue}</div> */}
          </div>          
        </>
        :
        null
      }
    </div>
  )
}

export default AdjustmentRow;
