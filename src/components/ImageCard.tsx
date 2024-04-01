import { useEffect, useState } from 'react';
import { formatBytes } from '../scripts/util';
import './ImageCard.css';
import { ref, set } from 'firebase/database';
import { database } from '../firebase';

interface ImageCardProps {
  // label: string;
  // size: string;
  // url: string;
  // description: string;
  // media: string;
  // fileName: string;
  // extension: string;
  // dimensions: { width: number, height: number };
  imageObj: any;
  reportLoaded: (imageName: string) => void;
  onClickDelete: (imageFileName: string) => void;
}

const ImageCard = ({imageObj, reportLoaded, onClickDelete}: ImageCardProps) => {
  
  const [initialValues, setInitialValues] = useState({...imageObj});
  const [currentValues, setCurrentValues] = useState({...imageObj});
  const [loaded, setLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onImageLoad = (imageName: string) => {
    setLoaded(true);
    reportLoaded(imageName);
  };

  const handleChange = ({ target }: any) => {
    console.log('id', target.id, 'value', target.value);
    console.log('name', target.name);
    const nextValues = { ...currentValues, [target.name]: target.value };
    setCurrentValues(nextValues);
  }

  const handleClickDelete = ({ target: { id } }: any) => {
    const actualFileName = id.split('-').join('.');
    onClickDelete(actualFileName);
  }

  useEffect(() => {
    if (JSON.stringify({ ...currentValues }) !== JSON.stringify({ ...initialValues })) {
      if (!hasUnsavedChanges) {
        setHasUnsavedChanges(true);
      }
    } else {
      setHasUnsavedChanges(false);
    }
  }, [currentValues])

  const { label, size, url, description, fileName, media, dimensions, extension  } = imageObj;
  
  return (
    <div key={fileName + '-card'} className={'image-card' + (hasUnsavedChanges ? ' unsaved' : '')}>
      <img className='preview-image' src={url} alt={fileName} onLoad={() => onImageLoad(fileName)} />
      {loaded && (
        <>
          <div className='image-label file-name'>{fileName}.{extension}</div>
          <div className='image-label'>{size}</div>
          <input
            id={fileName + '-label-input'}
            name='label'
            type="text"
            defaultValue={label}
            onChange={(e) => handleChange(e)}
            placeholder="Label"
            className='image-label-input'
          />
          <textarea
            id={fileName + '-description-input'}
            name='description'
            defaultValue={description}
            // onChange={(e) => handleDescriptionChange(e, fileName)}
            placeholder="Description"
            className='image-description-input'
          />
          <input id={fileName + '-media-input'} type='text' defaultValue={media} placeholder='Media' />
          <div className='dimensions-area'>
            <label htmlFor={fileName + '-width'}>Width</label>
            <input id={fileName + '-width'} name='width' type='number' defaultValue={dimensions.width} placeholder='Width' className='image-width-input' />
            <label htmlFor={fileName + '-height'}>Height</label>
            <input id={fileName + '-height'} name='height0' type='number' defaultValue={dimensions.height} placeholder='Height' className='image-height-input' />
          </div>
          <div className='edit-controls'>
            <button onClick={() => null} disabled={!hasUnsavedChanges} className='image-save-button'>Save Changes</button> 
          </div>
          <button onClick={handleClickDelete} id={fileName + '-' + extension} className='image-delete-button'>X</button>
        </>
      )}
    </div>
  );
}

export default ImageCard;