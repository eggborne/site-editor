
import { FC } from 'react';
import './SectionArea.css';

interface SectionAreaProps {
  sections: Array<[string, any]>;
}

const SectionArea: FC<SectionAreaProps> = ({ sections }) => {

  return (
    <div className={'section-area'}>
      <h2>Site Sections</h2>
      {sections.map(([key, value]) => {
        console.log('section', key, value);
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
