export function checkFormItemEmpty(data?: any) {
  let value = data;
  if (typeof value === 'string') value = data.trim();
  const isEmpty = !value && value !== 0 && value !== false;
  const isNoLength = Array.isArray(value) && !value.length;
  return isEmpty || isNoLength;
}

export function checkFormEmpty(data?: Record<string, any>) {
  if (!data) return true;
  return Object.keys(data).every((key) => checkFormItemEmpty(data[key]));
}
