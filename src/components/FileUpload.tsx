import { FC, useEffect, useState } from 'react';
import './FileUpload.css';
import { publishObj } from '../App';

interface FileUploadProps {
  publishFile: (newPublishObj: publishObj, sectionPath: string) => void;
  sectionPath: string,
};

const FileUpload: FC<FileUploadProps> = ({ publishFile, sectionPath }) => {
  const [file, setFile] = useState(null as File | null);
  const [previewFileUrl, setPreviewFileUrl] = useState('' as string);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!file) {
      console.error('No files selected');
      return;
    } else {
      const title = e.target['image-title'].value;
      const description = e.target['image-description'].value;
      const media = e.target['image-media'].value;
      const width = parseInt(e.target['image-width'].value);
      const height = parseInt(e.target['image-height'].value);

      console.log('preview file', previewFileUrl);
      const newPublishObj = {
        file,
        title,
        description,
        media,
        dimensions: { width, height },
      }

      console.log('newPublishObj', newPublishObj);
      URL.revokeObjectURL(previewFileUrl);
      setPreviewFileUrl('');
      publishFile(newPublishObj, sectionPath);
      setFile(null);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('got files, ', files)
    if (files) {
      const nextPreviewFileUrlObj = Array.from(files)[0];
      const nextPreviewFileUrl = URL.createObjectURL(nextPreviewFileUrlObj);
      console.log('next preview file', nextPreviewFileUrl);
      setPreviewFileUrl(nextPreviewFileUrl);
      setFile(nextPreviewFileUrlObj);
    }
  };

  return (
    <div className='file-upload'>
      <div className="upload-btn-wrapper">
        {!file && <button className="caution">Add an image...</button>}
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      {file && <form onSubmit={handleUpload} id="upload-form">
        {previewFileUrl ?
          <img className='upload-preview-image' src={previewFileUrl} alt='preview' />
          :
          <div className='upload-preview-image-placeholder'>{'[no image selected]'}</div>
        }
        <label htmlFor='image-title'>Title</label>
        <input type='text' id='image-title' name='image-title' />
        <label htmlFor='image-description'>Description</label>
        <textarea id='image-description' name='image-description' />
        <label htmlFor='image-media'>Media</label>
        <input type='text' id='image-media' name='image-media' />
        <div className='two-columns'>
          <label htmlFor='image-width'>Width</label>
          <input type='number' id='image-width' name='image-width' />
          <label htmlFor='image-height'>Height</label>
          <input type='number' id='image-height' name='image-height' />
        </div>
        <button className="go" type='submit'>Publish Image!</button>
      </form>}
    </div>
  );
};

export default FileUpload;
