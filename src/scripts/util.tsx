export const pause = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const formatBytes = (bytes: any, decimals: number = 2): string => {
  bytes = parseInt(bytes);
  return bytes === 0
    ? '0 Bytes'
    : `${parseFloat((bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))).toFixed(decimals < 0 ? 0 : decimals))} ${['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][Math.floor(Math.log(bytes) / Math.log(1024))]}`;
}

export const propertiesKey = {
  '--footer-height': {
    label: 'Footer Height',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--hamburger-animation-duration': {
    label: 'Hamburger Animation Duration',
    type: 'range',
    min: 0,
    max: 1000,
    step: 1,
    unit: 'ms',
  },
  '--hamburger-size': {
    label: 'Hamburger Size',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--header-bg-color': {
    label: 'Header Background Color',
    type: 'color',
  },
  '--header-height': {
    label: 'Header Height',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--main-bg-color': {
    label: 'Main Background Color',
    type: 'color',
  },
  '--main-font-color': {
    label: 'Main Font Color',
    type: 'color',
  },
  '--main-font-size': {
    label: 'Main Font Size',
    type: 'range',
    min: 0.1,
    max: 3.5,
    step: 0.005,
    unit: 'rem',
  },
  '--main-padding-horiz': {
    label: 'Main Padding Horizontal',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--main-padding-vert': {
    label: 'Main Padding Vertical',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-area-bg-color': {
    label: 'Nav Area Background Color',
    type: 'color',
  },
  '--nav-area-width': {
    label: 'Nav Area Width',
    type: 'range',
    min: 2,
    max: 24,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-area-font': {
    label: 'Nav Area Font',
    type: 'select',
    options: ['Arial', 'Helvetica', 'sans-serif'],
  },
  '--nav-area-font-color': {
    label: 'Nav Area Font Color',
    type: 'color',
  },
  '--nav-area-font-size': {
    label: 'Nav Area Font Size',
    type: 'range',
    min: 0.1,
    max: 3.5,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-padding-horiz': {
    label: 'Nav Padding Horizontal',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-padding-vert': {
    label: 'Nav Padding Vertical',
    type: 'range',
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--nav-text-shadow-x': {
    label: 'Nav Text Shadow X',
    type: 'range',
    min: -2,
    max: 2,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-text-shadow-y': {
    label: 'Nav Text Shadow Y',
    type: 'range',
    min: -2,
    max: 2,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-text-shadow-blur': {
    label: 'Nav Text Shadow Blur',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.05,
    unit: 'rem',
  },
  '--nav-text-shadow-color': {
    label: 'Nav Text Shadow Color',
    type: 'color',
  },
  '--text-accent-color': {
    label: 'Text Accent Color',
    type: 'color',
  },
  '--title-font': {
    label: 'Title Font',
    type: 'select',
    options: ['Arial', 'Helvetica', 'sans-serif'],
  },
  '--title-font-size': {
    label: 'Title Font Size',
    type: 'range',
    min: 0.1,
    max: 3.5,
    step: 0.05,
    unit: 'rem',
  },
  '--title-font-color': {
    label: 'Title Font Color',
    type: 'color',
  },
  '--main-font': {
    label: 'Main Font',
    type: 'select',
    options: ['Arial', 'Helvetica', 'sans-serif'],
  },
  '--logo-size': {
    label: 'Logo Size',
    type: 'range',
    min: 1,
    max: 10,
    step: 0.1,
    unit: 'rem',
  },
  '--logo-color': {
    label: 'Logo Color',
    type: 'color',
  },
  '--hamburger-color': {
    label: 'Hamburger Color',
    type: 'color',
  },
  '--hamburger-line-color': {
    label: 'Hamburger Line Color',
    type: 'color',
  },
  '--hamburger-line-thickness': {
    label: 'Hamburger Line Thickness',
    type: 'range',
    min: 0.1,
    max: 1,
    step: 0.01,
    unit: 'rem',
  },
  '--hamburger-on-color': {
    label: 'Hamburger On Color',
    type: 'color',
  },
  '--hamburger-roundness': {
    label: 'Hamburger Roundness',
    type: 'range',
    min: 0,
    max: 50,
    step: 0.5,
    unit: '%'
  },
  '--section-heading-color': {
    label: 'Section Heading Color',
    type: 'color',
  },
  '--section-heading-font-size': {
    label: 'Section Heading Font Size',
    type: 'range',
    min: 0.5,
    max: 3.5,
    step: 0.01,
    unit: 'rem',
  },
};