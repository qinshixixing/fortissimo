export function trimString(obj: { [key: string]: any }) {
  const data = {
    ...obj
  };
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') data[key] = obj[key].trim();
  });
  return data;
}
