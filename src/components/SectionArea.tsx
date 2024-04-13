
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
  updateSectionData: (newSectionData: any, sectionNumber: number) => void;
  publishFile: (newPublishObj: publishObj, sectionPath: string) => void;
}

const SectionArea: FC<SectionAreaProps> = ({ sections, updateSectionData, publishFile, siteImages, deleteImage }) => {

  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const onImageLoad = (imageName: string) => {
    setLoadedImages(prevState => [...prevState, imageName]);
  };

  const handleChange = ({ target }: any, sectionNumber: number, save?: boolean) => {
    // const newSectionData = { ...sections[sectionNumber], [target.name]: target.value };
    console.log('target.name', target.name);
    console.log('target.value', target.value);
    console.log('sections', sections);
    console.log('sectionNumber', sectionNumber);
    const newSectionData = { ...sections[sectionNumber][1] };
    newSectionData[target.name] = target.value;
    console.log('SectionArea.handleChange new sec data as', newSectionData)
    updateSectionData(newSectionData, sectionNumber);
  }

  const onClickSaveImageChanges = (imageObj: any) => {
    console.log('onClickSaveImageChanges received imageObj', imageObj);
    const newSectionData = { [imageObj.fileName]: imageObj };
    console.log('newSectionData', newSectionData);
    updateSectionData(newSectionData, 0);

    // handleChange({ target: { name: 'images', value: newSectionData } }, 0, true);
  }

  const onClickDelete = (imageFileName: string) => {
    deleteImage(imageFileName);
  }

  return (
    <div className={'section-area'}>
      <h2>Site Sections</h2>
      {sections.map(([key, value]) => {
        const { label, textContent } = value;
        return (
          <div className="section-control" key={key}>
            <div className='section-text-input'>
              <label htmlFor={`section-label-${key}`}>Section label</label>
              <input onChange={(e) => handleChange(e, parseInt(key))} id={`section-label-${key}`} name="label" type="text" defaultValue={label}></input>
            </div>
            <div className='section-text-input large-text'>
              <label htmlFor={`contents-${key}`}>Contents</label>
              <textarea onChange={(e) => handleChange(e, parseInt(key))} id={`contents-${key}`} name="textContent" defaultValue={textContent}></textarea>
            </div>
            {label === 'gallery' &&
              <div className='image-upload'>
                <label>Images</label>
                <div className='image-display'>
                  {siteImages && siteImages.map(({ url, media, fileName, dimensions, size, extension, title, description }: any) =>
                    <ImageCard
                      key={fileName}
                      imageObj={{
                        url,
                        media,
                        fileName,
                        dimensions,
                        size: formatBytes(size),
                        extension,
                        title,
                        description
                      }}
                      reportLoaded={onImageLoad}
                      onChangeImageAttribute={(imageObj: any) => handleChange(imageObj, 0)}
                      onClickSaveImageChanges={onClickSaveImageChanges}
                      onClickDelete={onClickDelete}
                    />
                  )}
                </div>
                <FileUpload publishFile={publishFile} sectionPath={key.toString()} />
              </div>
            }
          </div>
        )
      })}
    </div>
  );
};

export default SectionArea;
