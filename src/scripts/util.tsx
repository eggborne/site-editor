export const pause = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const getDisplayName = (cssVariableName: string) =>
  cssVariableName
    .replace(/^--/, '')
    .replace(/bg/g, 'Background')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
