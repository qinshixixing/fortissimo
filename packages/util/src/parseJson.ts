export function parseJson(data: string): any {
  let result;
  try {
    result = JSON.parse(data);
  } catch (e) {
    result = data;
  }
  return result;
}
