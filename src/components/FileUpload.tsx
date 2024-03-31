import { FC, useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  uploadFile: (files: File[]) => void;
};

const FileUpload: FC<FileUploadProps> = ({ uploadFile }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = async () => {
    if (files.length === 0) {
      console.error('No files selected');
      return;
    } else {
      uploadFile(files);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      console.log('files are', newFiles);
      setFiles(newFiles);
    }
  };

  return (
    <div className='file-upload'>
      <input type="file" onChange={handleFileChange} multiple />
      <button onClick={handleUpload}>Upload Files</button>
    </div>
  );
};

export default FileUpload;
