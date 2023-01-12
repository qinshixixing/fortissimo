declare global {
  interface Navigator {
    msSaveOrOpenBlob: any;
    msSaveBlob: any;
  }
}

export type ReadResult = string | ArrayBuffer | null;

export function getBlob(url: string, token?: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    if (token) {
      xhr.setRequestHeader('Authorization', token);
    }
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.onabort = () => {
      reject(xhr.response);
    };
    xhr.ontimeout = () => {
      reject(xhr.response);
    };
    xhr.onerror = () => {
      reject(xhr.response);
    };
    xhr.send();
  });
}

export function saveBlob(blob: Blob, filename: string): void {
  if (window.navigator.msSaveOrOpenBlob) {
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

export function readBlob(file: Blob): Promise<ReadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'utf-8');
  });
}

export function readBlobAsDataURL(file: Blob): Promise<ReadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function generateBlob(data: string): Blob {
  const blob = new Blob([data], {
    type: 'text/plain'
  });
  return blob;
}

export interface DownloadFileParams {
  url: string;
  filename: string;
  token: string;
}

export async function downloadBlob({
  url = '',
  filename = '',
  token = ''
}: Partial<DownloadFileParams>): Promise<void> {
  if (!url || !filename) return;
  const blob = await getBlob(url, token);
  saveBlob(blob, filename);
}
