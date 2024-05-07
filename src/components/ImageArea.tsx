import { FC, useState } from "react";
import './ImageArea.css';
import ImageCard from "./ImageCard";
import { formatBytes } from "../scripts/util";
import { imageDataObj } from "../App";

interface ImageAreaProps {
  siteImages: imageDataObj[];
  selectedImage: string;
  onClickThumbnail: (e: React.MouseEvent<HTMLImageElement>) => void;
  onClickDelete: (fileName: string) => void;
  updateImageData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickDoneEditingImage: (imageObj: any) => void;
  onClickCancel: () => void;
}

const ImageArea: FC<ImageAreaProps> = ({ siteImages, selectedImage, onClickThumbnail, onClickDelete, updateImageData, onClickDoneEditingImage, onClickCancel }) => {
  const [imageSectionArray, setImageSectionArray] = useState<{ series: string; images: any[] }[]>([]);

  if (imageSectionArray.length === 0 && siteImages) {
    const nextImageSectionArray: { series: string; images: any[] }[] = [];
    const seriesNames: string[] = [];
    for (let imageObj of siteImages) {
      if (!seriesNames.includes(imageObj.series)) {
        seriesNames.push(imageObj.series);
        nextImageSectionArray.push({
          series: imageObj.series,
          images: [imageObj]
        });
      } else {
        for (let section of nextImageSectionArray) {
          if (section.series === imageObj.series) {
            section.images.push(imageObj);
          }
        }
      }
    }
    console.warn('imageSectionArray', nextImageSectionArray);
    setImageSectionArray(nextImageSectionArray);
  }

  return (
    <div className='image-display'>
      {imageSectionArray && imageSectionArray.map(({ series, images }) =>
        <div className='image-section' key={series}>
          <h4>{series} series</h4>
          {images && images.map(({ url, thumbnailUrl, media, fileName, dimensions, size, extension, series, title, description }: imageDataObj) =>
            <div className={'image-series-list'} key={fileName}>
              {/* shows the image's thumbnail */}
              <div className={`image-container`}>
                <img id={fileName} className='thumbnail' src={thumbnailUrl} onClick={onClickThumbnail} />
                <button className='image-delete-button' onClick={() => onClickDelete(`${fileName}.${extension}`)}>X</button>
              </div>
              {/* but also the card if the image is selected */}
              {selectedImage === fileName &&
                <ImageCard
                  key={fileName}
                  imageObj={{
                    url,
                    thumbnailUrl,
                    media,
                    fileName,
                    dimensions,
                    size: formatBytes(size),
                    extension,
                    series,
                    title,
                    description
                  }}
                  onChangeImageAttribute={updateImageData}
                  onClickDoneEditingImage={onClickDoneEditingImage}
                  onClickDelete={onClickDelete}
                  onClickCancel={onClickCancel}
                />
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageArea;