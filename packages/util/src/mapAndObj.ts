export function mapToObj<T = any>(data: Map<string, T>): { [key: string]: T } {
  const obj: { [key: string]: T } = {};
  data.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export function objToMap<T = any>(data: { [key: string]: T }): Map<string, T> {
  const map: Map<string, T> = new Map();
  Object.entries(data).forEach((item) => {
    map.set(item[0], item[1]);
  });
  return map;
}
