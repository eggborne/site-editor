import './AdjustmentRow.css';

interface AdjustmentRowProps {
  label: string;
  currentValue: string;
}

function AdjustmentRow({ label, currentValue }: AdjustmentRowProps) {
  return (
    <div className='adjustment-row'>
      <div>{label}</div>
      <div>{currentValue}</div>
    </div>
  )
}

export default AdjustmentRow
