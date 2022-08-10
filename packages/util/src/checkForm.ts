export function checkFormItem(data?: any) {
  let value = data;
  if (typeof value === 'string') value = data.trim();
  const isEmpty = !value && value !== 0 && value !== false;
  const isNoLength = Array.isArray(value) && !value.length;
  return isEmpty || isNoLength;
}

export function checkForm(data?: Record<string, any>) {
  if (!data) return true;
  return Object.keys(data).every((key) => checkFormItem(data[key]));
}
