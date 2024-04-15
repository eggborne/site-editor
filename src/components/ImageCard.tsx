import { useEffect, useState } from 'react';
import './ImageCard.css';

interface ImageCardProps {
  imageObj: any;
  reportLoaded: (imageName: string) => void;
  onChangeImageAttribute: (imageObj: any) => void;
  onClickSaveImageChanges: (imageObj: any) => void;
  onClickDelete: (imageFileName: string) => void;
}

const ImageCard = ({ imageObj, reportLoaded, onClickDelete, onClickSaveImageChanges }: ImageCardProps) => {

  const [initialValues, setInitialValues] = useState({ ...imageObj });
  const [currentValues, setCurrentValues] = useState({ ...imageObj });
  const [loaded, setLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onImageLoad = (imageName: string) => {
    console.log(imageName, 'loaded!')
    setLoaded(true);
    reportLoaded(imageName);
  };

  const handleChange = ({ target }: any) => {
    const keyPath = target.name;
    const nextValues = (keyPath === 'width' || keyPath === 'height') ?
      { ...currentValues, dimensions: { ...currentValues.dimensions, [keyPath]: parseInt(target.value) } }
      :
      { ...currentValues, [keyPath]: target.value };
    setCurrentValues(nextValues);
  }

  const handleClickDelete = ({ target: { id } }: any) => {
    const actualFileName = id.split('-').join('.');
    onClickDelete(actualFileName);
  }

  useEffect(() => {
    if (!Object.entries(initialValues).length) {
      console.error('no initial values!')
      setInitialValues({ ...imageObj });
    }
    const currentRaw = JSON.stringify({ ...currentValues });
    const initialRaw = JSON.stringify({ ...initialValues });
    if (currentRaw !== initialRaw) {
      if (!hasUnsavedChanges) {
        setHasUnsavedChanges(true);
      }
    } else {
      setHasUnsavedChanges(false);
    }
    
  }, [currentValues])

  const { title, size, url, description, fileName, media, dimensions, extension } = imageObj;

  return (
    <div key={fileName + '-card'} className={'image-card' + (hasUnsavedChanges ? ' unsaved' : '')}>
      <img className='preview-image' src={url} alt={fileName} onLoad={() => onImageLoad(fileName)} />
      {loaded && (
        <>
          <div className='image-label file-name'>{fileName}.{extension}</div>
          <div className='image-label'>{size}</div>
          <input
            id={fileName + '-label-input'}
            name='title'
            type="text"
            defaultValue={title}
            onChange={(e) => handleChange(e)}
            // placeholder="Title"
            className='image-label-input'
          />
          <textarea
            id={fileName + '-description-input'}
            name='description'
            defaultValue={description}
            onChange={(e) => handleChange(e)}
            placeholder="Description"
            className='image-description-input'
          />
          <input id={fileName + '-media-input'} type='text' defaultValue={media} placeholder='Media' />
          <div className='dimensions-area'>
            <label htmlFor={fileName + '-width'}>Width</label>
            <input onChange={(e) => handleChange(e)} id={fileName + '-width'} name='width' type='number' defaultValue={dimensions.width} placeholder='Width' className='image-width-input' />
            <label htmlFor={fileName + '-height'}>Height</label>
            <input onChange={(e) => handleChange(e)} id={fileName + '-height'} name='height' type='number' defaultValue={dimensions.height} placeholder='Height' className='image-height-input' />
          </div>
          <div className='edit-controls'>
            <button onClick={() => onClickSaveImageChanges(currentValues)} disabled={!hasUnsavedChanges} className='image-save-button'>Save Changes</button>
          </div>
          <button onClick={handleClickDelete} id={fileName + '-' + extension} className='image-delete-button'>X</button>
        </>
      )}
    </div>
  );
}

export default ImageCard;