export const pause = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const formatBytes = (bytes: any, decimals: number = 2): string => {
  bytes = parseInt(bytes);
  return bytes === 0
    ? '0 Bytes'
    : `${parseFloat((bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))).toFixed(decimals < 0 ? 0 : decimals))} ${['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][Math.floor(Math.log(bytes) / Math.log(1024))]}`;
}