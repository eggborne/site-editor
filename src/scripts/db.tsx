import axios from 'axios';

type CSSPreferences = {
  '--header-height': string;
  '--footer-height': string;
  '--main-bg-color': string;
  '--header-bg-color': string;
  '--main-font-color': string;
  '--nav-area-bg-color': string;
  '--text-accent-color': string;
  '--title-font': string;
  '--nav-area-font': string;
  '--nav-area-font-color': string;
  '--nav-area-font-size': string;
  '--main-padding-vert': string;
  '--main-padding-horiz': string;
  '--header-padding-vert': string;
  '--header-padding-horiz': string;
  '--nav-text-shadow': string;
  '--hamburger-size': string;
  '--hamburger-animation-duration': string;
};

export const defaultCSSPreferences: CSSPreferences = {
  '--header-height': '4rem',
  '--footer-height': '1.75rem',
  '--main-bg-color': 'red',
  '--header-bg-color': '#3f3f2f',
  '--main-font-color': 'rgba(255, 255, 255, 0.87)',
  '--nav-area-bg-color': 'rgb(127, 132, 114)',
  '--text-accent-color': 'yellow',
  '--title-font': "Helvetica",
  '--nav-area-font': "Helvetica",
  '--nav-area-font-color': 'beige',
  '--nav-area-font-size': '1rem',
  '--main-padding-vert': '1rem',
  '--main-padding-horiz': '1rem',
  '--header-padding-vert': '1rem',
  '--header-padding-horiz': '0.325rem',
  '--nav-text-shadow': '0.1rem 0.05rem 0.25rem rgb(0, 0, 0, 0.5)',
  '--hamburger-size': 'calc(var(--header-height) * 0.85)',
  '--hamburger-animation-duration': '200ms',
};


export const getCurrentCSSValues = () => {
  const newValuesObj: Record<string, string> = {};
  const attributeList = Object.keys(defaultCSSPreferences);
  attributeList.forEach(attributeName => {
    const newValue = getComputedStyle(document.documentElement).getPropertyValue(attributeName).trim();
    newValuesObj[attributeName] = newValue;
  });
  console.table(newValuesObj);
  return newValuesObj;
}

export const applyCSSValues = (newValuesObj: Record<string, string>) => {
  for (let [attributeName, newValue] of Object.entries(newValuesObj)) {
    console.warn('setting', attributeName, 'to', newValue);
    document.documentElement.style.setProperty(attributeName, newValue);
  }
}

export const getUserPreferences = async (prefID: string) => {
  console.log('getting user prefs for ID', prefID)
  const response = await axios({
    method: 'post',
    url: `https://rockyrachel.art/php/getpreferences.php`,
    data: {
      userID: parseInt(prefID)
    }
  });
  if (response.data) {
    return JSON.parse(response.data.CSSValues);
  } else {
    console.warn('NO RESPONSE.DATA');
  }
}

