export const imageFormatList: string[] = ['png', 'jpg', 'jpeg'];

export const videoFormatList: string[] = ['mp4'];

export const linkFileFormatList: string[] = ['pdf', 'doc', 'docx'];

export function checkFileFormat(
  fileUrl: string,
  formatList: string[]
): boolean {
  const name = fileUrl.split('?')[0];
  return formatList.some((item) => name.endsWith(item));
}
