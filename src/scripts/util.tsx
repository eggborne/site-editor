export const pause = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const convertCSSVarName = (cssVarName: string): string => {
  const replacements: { [key: string]: string } = {
    bg: 'background',
    horiz: 'x',
    vert: 'y',
    nav: 'navigation',
  };

  Object.entries(replacements).forEach(([key, replacement]) => {
    const regex = new RegExp(key, 'gi');
    cssVarName = cssVarName.replace(regex, replacement);
  });

  return cssVarName
    .slice(2) // Remove the leading '--'
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase()); // Capitalize first letter of each word
};
