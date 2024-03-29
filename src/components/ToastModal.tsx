import { FC } from "react";
import './ToastModal.css';

interface ToastModalProps {
  visible: boolean;
  message: string;
}

const ToastModal: FC<ToastModalProps> = ({ visible, message }) => {
  return (
    <div className={`centered-modal toast-modal${visible ? ' visible' : ''}`}>
      <p>{message}</p>
    </div>
  );
};

export default ToastModal;