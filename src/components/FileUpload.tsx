import { FC, useState } from 'react';
import './FileUpload.css';
import { imagePublishObj } from '../App';
import Pica from 'pica';

interface FileUploadProps {
  publishFile: (file: File, thumbnailFile: File, newPublishObj: imagePublishObj) => void;
  sectionPath: string,
};

const getApsectRatio = async (file: File): Promise<number> => {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise((resolve) => img.onload = resolve);
  return img.width / img.height;
};


const blobToFile = (blob: Blob, fileName: string): File => {
  // LastModifiedDate is optional; if not provided, current date is used
  const lastModifiedDate = new Date();
  // Create a new File object
  const file = new File([blob], fileName, {
    type: blob.type,
    lastModified: lastModifiedDate.getTime(),
  });
  return file;
};

const createThumbnail = async (imageFile: File): Promise<File> => {

  const pica = Pica();

  const img = new Image();
  const canvas = document.createElement('canvas');
  
  img.src = URL.createObjectURL(imageFile);
  await new Promise((resolve) => img.onload = resolve);
  
  const targetHeight = 200;
  const targetWidth = targetHeight * (img.width / img.height);
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  await pica.resize(img, canvas, {
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2
  });

  const blob = await pica.toBlob(canvas, 'image/jpeg', 0.90);
  return blobToFile(blob, `thumbnail_${imageFile.name}`);
};

const FileUpload: FC<FileUploadProps> = ({ publishFile }) => {
  const [file, setFile] = useState(null as File | null);
  const [previewFileUrl, setPreviewFileUrl] = useState('' as string);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!file) {
      console.error('No files selected');
      return;
    } else {
      const thumbnail = await createThumbnail(file);
      const aspectRatio = await getApsectRatio(file);
      console.log('thumbnail aspectRatio', aspectRatio);
      console.log('thumbnail', thumbnail);

      const description = e.target['image-description'].value;
      const series = e.target['image-series'].value;
      const title = e.target['image-title'].value;
      const media = e.target['image-media'].value;
      const width = parseInt(e.target['image-width'].value);
      const height = parseInt(e.target['image-height'].value);
      const unit = e.target['image-unit'].value;

      console.log('unit', unit);
      const newPublishObj: imagePublishObj = {
        description,
        dimensions: { width, height, unit },
        media,
        series,
        title,
        aspectRatio,
      }

      console.log('newPublishObj', newPublishObj);
      URL.revokeObjectURL(previewFileUrl);
      setPreviewFileUrl('');
      publishFile(file, thumbnail, newPublishObj); 
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

  const cancelUpload = () => {
    setFile(null);
    URL.revokeObjectURL(previewFileUrl);
    setPreviewFileUrl('');
  }

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
      {file && <form className='upload-form' onSubmit={handleUpload} id="upload-form">
        <h3>New Image: {file.name}</h3>
        <div className='image-container'>
          <img className='upload-preview-image' src={previewFileUrl} alt='preview' />
        </div>
        <label htmlFor='image-series'>Series</label>
        <input type='text' id='image-series' name='image-series' />
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
          <label htmlFor='image-unit'>Unit</label>
          <select id='image-unit' name='image-unit'>
            <option>in.</option>
            <option>px</option>
          </select>
        </div>
        <div className='lower-button-area'>
          <button className="caution" onClick={cancelUpload} type='button'>Cancel</button>
          <button className="go" type='submit'>Publish Image!</button>
        </div>
      </form>}
    </div>
  );
};

export default FileUpload;
