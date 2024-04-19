import { FC } from "react";
import { uploadProgressData } from "../App";
import './LoadingBar.css';

interface LoadingBarProps {
  progress: uploadProgressData;
  visible: boolean;
}

const LoadingBar: FC<LoadingBarProps> = ({ progress, visible }) => {
  const { bytesSent, bytesTotal } = progress;
  const percentComplete = Math.round((bytesSent / bytesTotal) * 100);
  // const percentComplete = 50;
  return (
    <div className={`${visible ? '' : 'hidden '}centered-modal loading-bar ${bytesSent === bytesTotal ? 'finished' : ''}`}>
      <div className='progress-indicator'>
        <div className='progress-bar' style={{ transform: `scalex(${percentComplete}%)` }}></div>      
        <div className='percent-label'>{percentComplete}%</div>
      </div>
    </div>
  );
};

export default LoadingBar;