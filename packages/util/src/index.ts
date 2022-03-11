export { detectIE, getIEVersion, getBrowserType } from './checkBrowser';

export { CustomEventTarget } from './CustomEventTarget';
export type {
  CustomEventCallback,
  CustomEventListeners,
  AllCustomEventListeners,
  CustomEventTargetInstance
} from './CustomEventTarget';

export { parseJson } from './parseJson';

export { sleep } from './sleep';

export { createProxyStorage } from './storage';

export { getRandomString } from './random';

export { getBlob, saveBlob, downloadFile } from './download';
export type { DownloadFileParams } from './download';

export {
  imageFormatList,
  videoFormatList,
  linkFileFormatList,
  checkFileFormat
} from './fileFormat';

export { blobToBase64 } from './blobToBase64';

export { watermarkConfig } from './watermarkConfig';
export type { WatermarkConfig } from './watermarkConfig';

export { readFile } from './readFile';
