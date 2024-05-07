
import { FC, useState } from 'react';
import './SectionArea.css';
import FileUpload from './FileUpload';
import { imageDataObj, imagePublishObj } from '../App';
import ImageCard from './ImageCard';
import { formatBytes } from '../scripts/util';
import ConfirmModal from './ConfirmModal';
import ImageArea from './ImageArea';

interface SectionAreaProps {
  sections: Array<[string, any]>;
  siteImages: any;
  currentSiteId: string;
  deleteImage: any;
  updateSectionData: (newSectionData: any, sectionNumber: number) => void;
  publishFile: (file: File, thumbnailFile: File, newPublishObj: imagePublishObj) => void;
  updateImageData: (imageObj: any) => void;
  refreshSiteImages: () => void;
}

const SectionArea: FC<SectionAreaProps> = ({ sections, siteImages, currentSiteId, deleteImage, updateSectionData, publishFile, updateImageData, refreshSiteImages }) => {

  const [selectedImage, setSelectedImage] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState('');

  const handleChange = ({ target }: any, sectionNumber: number, save?: boolean) => {
    const newSectionData = { ...sections[sectionNumber][1] };
    newSectionData[target.name] = target.value;
    updateSectionData(newSectionData, sectionNumber);
  }

  const onClickDelete = (imageFileName: string) => {
    setConfirmingDelete(imageFileName);
  }
  const onClickCancel = () => {
    setSelectedImage('');
  }

  const handleClickThumbnail = (e: any) => {
    setSelectedImage(e.target.id)
  }

  const handleCancelDelete = () => {
    setConfirmingDelete('');
  }

  const handleClickDoneEditingImage = (imageObj: any) => {
    refreshSiteImages();
    setSelectedImage('');
  }

  console.warn('SectionArea got sections:', sections[0][1]);

  return (
    <div className={'section-area'}>
      <h2>Site Sections</h2>
      {sections.map(([key, value]) => {
        const { label, textContent } = value;
        return (
          <div className="section-control" key={key}>
            <div className='section-text-input'>
              <label htmlFor={`section-label-${key}`}>Section label</label>
              <input autoComplete="off" onChange={(e) => handleChange(e, parseInt(key))} id={`section-label-${key}`} placeholder="(blank)" name="label" type="text" value={label}></input>
            </div>
            <div className='section-text-input large-text'>
              <label htmlFor={`contents-${key}`}>Contents</label>
              <textarea autoComplete="off" onChange={(e) => handleChange(e, parseInt(key))} id={`contents-${key}`} name="textContent" value={textContent}></textarea>
            </div>
            {key === '0' &&
              <div className='image-area'>
                <h4>Gallery Images</h4>
                <ImageArea
                  siteImages={siteImages}
                  onClickDelete={onClickDelete}
                  onClickThumbnail={handleClickThumbnail}
                  selectedImage={selectedImage}
                  onClickCancel={onClickCancel}
                  onClickDoneEditingImage={handleClickDoneEditingImage}
                  updateImageData={updateImageData}
                />
                <FileUpload publishFile={publishFile} sectionPath={key.toString()} />
              </div>
            }
          </div>
        )
      })}
      <ConfirmModal
        visible={confirmingDelete !== ''}
        message={`Really delete ${confirmingDelete}?`}
        confirmAction={async () => { await deleteImage(confirmingDelete);  setConfirmingDelete('')}}
        cancelAction={handleCancelDelete}
      />
    </div>
  );
};

export default SectionArea;
