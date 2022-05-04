type trimStringObj = Record<string, any>;
export function trimString<T extends trimStringObj = trimStringObj>(obj: T) {
  const data: trimStringObj = {
    ...obj
  };
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') data[key] = obj[key].trim();
  });
  return data as T;
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
