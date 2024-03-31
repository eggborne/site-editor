
import { FC, useState } from 'react';
import './SectionArea.css';
import FileUpload from './FileUpload';

interface SectionAreaProps {
  sections: Array<[string, any]>;
  siteImages: any;
  deleteImage: any;
  uploadFile: (files: File[]) => void;
}

const SectionArea: FC<SectionAreaProps> = ({ sections, uploadFile, siteImages, deleteImage }) => {
  
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const onImageLoad = (imageName: string) => {
    setLoadedImages(prevState => [...prevState, imageName]);
  };

  const onClickDelete = (e: any) => {
    deleteImage(e.target.id);
  }

  return (
    <div className={'section-area'}>
      <FileUpload uploadFile={uploadFile} />
      <div className='image-display'>
        {siteImages && siteImages.map(({ url, imageName }: any) => 
            <div key={imageName} className='image-display-item'>
            <img className='preview-image' src={url} alt={imageName} onLoad={() => onImageLoad(imageName)} />
            {loadedImages.includes(imageName) && (
              <>
                <div className='image-label'>{imageName}</div>
                <button onClick={onClickDelete} id={imageName} className='image-delete-button'>X</button>
              </>
            )}
            </div>
          )}
      </div>
      <h2>Site Sections</h2>
      {sections.map(([key, value]) => {
        const { label, href, textContent } = value;
        return (
          <div className="section-control" key={key}>
            <div>
              <label htmlFor={`section-title-${key}`}>Section title</label>
              <input id={`section-title-${key}`} name="label" type="text" defaultValue={label}></input>
            </div>
            <div>
              <label htmlFor={`url-${key}`}>URL</label>
              <input id={`url-${key}`} name="href" type="text" defaultValue={`/${href}`}></input>
            </div>
            <div className='large-text'>
              <label htmlFor={`contents-${key}`}>Contents</label>
              <textarea id={`contents-${key}`} name="textContent" defaultValue={textContent}></textarea>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default SectionArea;
