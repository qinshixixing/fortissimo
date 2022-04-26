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

export {
  getBlob,
  saveBlob,
  readBlob,
  readBlobAsDataURL,
  generateBlob,
  downloadBlob
} from './blob';

export type { ReadResult, DownloadFileParams } from './blob';

export {
  imageFormatList,
  videoFormatList,
  linkFileFormatList,
  checkFileFormat,
  checkImage,
  checkVideo,
  checkLinkFile
} from './fileFormat';

export { watermarkConfig } from './watermarkConfig';
export type { WatermarkConfig } from './watermarkConfig';

export { mapToObj, objToMap } from './mapAndObj';

export { checkPhoneEnv } from './phoneEnv';
export type { PhoneEnv } from './phoneEnv';

export { trimString } from './trimString';

export { transKey } from './transKey';
export type { KeyConfig } from './transKey';
