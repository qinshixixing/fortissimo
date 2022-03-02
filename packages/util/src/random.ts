const allSymbol = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
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
