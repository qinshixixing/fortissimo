export interface DownloadFileParams {
  url: string;
  filename: string;
  token: string;
}

export function getBlob(url: string, token?: string): Promise<Blob> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    if (token) {
      xhr.setRequestHeader('Authorization', token);
    }
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}

export function saveBlob(blob: Blob, filename: string): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window.navigator.msSaveOrOpenBlob) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    const body: HTMLBodyElement = document.querySelector(
      'body'
    ) as HTMLBodyElement;
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
}

export async function downloadFile({
  url = '',
  filename = '',
  token = ''
}: Partial<DownloadFileParams>): Promise<void> {
  if (!url || !filename) return;
  const blob = await getBlob(url, token);
  saveBlob(blob, filename);
}
