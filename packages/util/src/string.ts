export function trimString(obj: { [key: string]: any }) {
  const data = {
    ...obj
  };
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') data[key] = obj[key].trim();
  });
  return data;
}

const allSymbol = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890';
const allSymbolLength = allSymbol.length;

export function getRandomString(length?: number): string {
  if (typeof length !== 'number' || !length) length = 8;
  let i = 0,
    str = '';
  while (i < length) {
    str = str + allSymbol[Math.floor(Math.random() * allSymbolLength)];
    i++;
  }
  return str;
}
