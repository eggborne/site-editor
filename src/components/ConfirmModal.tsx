import { FC } from "react";
import './ConfirmModal.css';

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  confirmAction: () => void;
  cancelAction: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ visible, message, confirmAction, cancelAction }) => {
  return (
    <div className={`centered-modal confirm-modal${visible ? ' visible' : ''}`}>
      <p>{message}</p>
      <button onClick={cancelAction} className='caution'>No way</button>
      <button onClick={confirmAction} className='stop'>Do it</button>
    </div>
  );
};

export default ConfirmModal;