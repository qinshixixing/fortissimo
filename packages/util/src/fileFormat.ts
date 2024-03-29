export const imageFormatList: string[] = ['png', 'jpg', 'jpeg'];

export const videoFormatList: string[] = ['mp4'];

export const linkFileFormatList: string[] = ['pdf', 'doc', 'docx'];

export function checkFileFormat(
  fileUrl: string,
  formatList: string[]
): boolean {
  const name = fileUrl.split('?')[0];
  return formatList.some((item) =>
    name.toLowerCase().endsWith(`.${item.toLowerCase()}`)
  );
}

export function checkImage(fileUrl: string) {
  return checkFileFormat(fileUrl, imageFormatList);
}

export function checkVideo(fileUrl: string) {
  return checkFileFormat(fileUrl, videoFormatList);
}

export function checkLinkFile(fileUrl: string) {
  return checkFileFormat(fileUrl, linkFileFormatList);
}
