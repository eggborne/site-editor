
import { FC, useState } from 'react';
import './SectionArea.css';
import FileUpload from './FileUpload';
import { publishObj } from '../App';
import { formatBytes } from '../scripts/util';
import ImageCard from './ImageCard';

interface SectionAreaProps {
  sections: Array<[string, any]>;
  siteImages: any;
  deleteImage: any;
  currentSiteId: string;
  getPreviewImageUrl: (file: File) => Promise<string>;
  updateSectionData: (newSectionData: any, sectionNumber: number) => void;
  publishFile: (newPublishObj: publishObj) => void;
}

const SectionArea: FC<SectionAreaProps> = ({ sections, currentSiteId, getPreviewImageUrl, updateSectionData, publishFile, siteImages, deleteImage }) => {

  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const onImageLoad = (imageName: string) => {
    setLoadedImages(prevState => [...prevState, imageName]);
  };

  const handleChange = ({ target }: any, sectionNumber: number) => {
    const newSectionData = { [target.name]: target.value };
    return updateSectionData(newSectionData, sectionNumber);
  }

  const onClickDelete = (imageFileName: string) => {
    deleteImage(imageFileName);
  }

  console.log(siteImages)

  return (
    <div className={'section-area'}>
      <h2>Site Sections</h2>
      {sections.map(([key, value]) => {
        const { label, href, textContent } = value;
        return (
          <div className="section-control" key={key}>
            <div className='section-text-input'>
              <label htmlFor={`section-label-${key}`}>Section label</label>
              <input onChange={(e) => handleChange(e, parseInt(key))} id={`section-label-${key}`} name="label" type="text" defaultValue={label}></input>
            </div>
            {/* <div>
              <label htmlFor={`url-${key}`}>URL</label>
              <input onChange={handleChange} id={`url-${key}`} name="href" type="text" defaultValue={`/${href}`}></input>
            </div> */}
            <div className='section-text-input large-text'>
              <label htmlFor={`contents-${key}`}>Contents</label>
              <textarea onChange={(e) => handleChange(e, parseInt(key))} id={`contents-${key}`} name="textContent" defaultValue={textContent}></textarea>
            </div>
            {label === 'gallery' &&
              <div className='image-upload'>
                <label>Images</label>
                <div className='image-display'>
                  {siteImages && siteImages.map(({ url, media, fileName, dimensions, size, extension, label, description }: any) =>
                    <ImageCard
                      key={fileName}
                      imageObj={{
                        url,
                        media,
                        fileName,
                        dimensions,
                        size: formatBytes(size),
                        extension,
                        label,
                        description
                      }}
                      reportLoaded={onImageLoad}
                      onClickDelete={onClickDelete}
                    />
                  )}
                </div>
                <FileUpload getPreviewImageUrl={getPreviewImageUrl} publishFile={publishFile} />
              </div>
            }
          </div>
        )
      })}
    </div>
  );
};

export default SectionArea;
