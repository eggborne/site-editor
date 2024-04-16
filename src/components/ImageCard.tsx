import { useEffect, useState } from 'react';
import './ImageCard.css';

interface ImageCardProps {
  imageObj: any;
  reportLoaded: (imageName: string) => void;
  onChangeImageAttribute: (imageObj: any) => void;
  onClickDoneEditingImage: (imageObj: any) => void;
  onClickDelete: (imageFileName: string) => void;
  onClickCancel: () => void;
}

const ImageCard = ({ imageObj, reportLoaded, onChangeImageAttribute, onClickDoneEditingImage, onClickCancel }: ImageCardProps) => {

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
    const nextValues = (keyPath === 'width' || keyPath === 'height' || keyPath === 'unit') ?
      { ...currentValues, dimensions: { ...currentValues.dimensions, [keyPath]: keyPath === 'unit' ? target.value : parseInt(target.value) } }
      :
      { ...currentValues, [keyPath]: target.value };
    setCurrentValues(nextValues);
    onChangeImageAttribute(nextValues);
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
      <h3>Editing {fileName}.{extension} ({size})</h3>
      <img className='preview-image' src={url} alt={fileName} onLoad={() => onImageLoad(fileName)} />
      {loaded ? (
        <>
          <div className='image-label file-name'>{fileName}.{extension}</div>
          <div className='image-label'>{size}</div>
          <label htmlFor={fileName + '-title'}>Title</label>
          <input
            id={fileName + '-label-input'}
            name='title'
            type="text"
            defaultValue={title}
            onChange={(e) => handleChange(e)}
            className='image-label-input'
          />
          <label htmlFor={fileName + '-description'}>Description</label>
          <textarea
            id={fileName + '-description-input'}
            name='description'
            defaultValue={description}
            onChange={(e) => handleChange(e)}
            className='image-description-input'
          />
          <label htmlFor={fileName + '-media'}>Media</label>
          <input onChange={(e) => handleChange(e)} name='media' id={fileName + '-media-input'} type='text' defaultValue={media} placeholder='Media' />
          <div className='dimensions-area'>
            <label htmlFor={fileName + '-width'}>Width</label>
            <input onChange={(e) => handleChange(e)} id={fileName + '-width'} name='width' type='number' defaultValue={dimensions.width} placeholder='Width' className='image-width-input' />
            <label htmlFor={fileName + '-height'}>Height</label>
            <input onChange={(e) => handleChange(e)} id={fileName + '-height'} name='height' type='number' defaultValue={dimensions.height} placeholder='Height' className='image-height-input' />
            <label htmlFor='image-unit'>Unit</label>
            <select onChange={(e) => handleChange(e)} id={fileName + '-unit'} name='unit'>
              <option>in.</option>
              <option>px</option>
            </select>
          </div>
          <div className='edit-controls'>
            <button onClick={onClickCancel} className='caution'>Cancel</button>
            <button
              onClick={() => onClickDoneEditingImage(currentValues)} disabled={!hasUnsavedChanges} className='image-save-button'>Done</button>
          </div>
        </>
      )
        :
      <h3>loading...</h3>
    }
    </div>
  );
}

export default ImageCard;