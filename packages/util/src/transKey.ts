export type KeyConfig<T = string> = [T, string][];

type ServerData = { [key: string]: any };

interface TransKeyData<LoaclData> {
  toServerMap: Map<keyof LoaclData, string>;
  tolocalMap: Map<string, keyof LoaclData>;
  toServer: (local: Partial<LoaclData>) => ServerData;
  toLocal: (server: ServerData) => Partial<LoaclData>;
}

export function transKey<T>(data: KeyConfig<keyof T>): TransKeyData<T> {
  const toServerMap: Map<keyof T, string> = new Map();
  const tolocalMap: Map<string, keyof T> = new Map();
  data.forEach((item) => {
    toServerMap.set(item[0], item[1]);
    tolocalMap.set(item[1], item[0]);
  });
  const toServer = (local: Partial<T>): ServerData => {
    const result: ServerData = {};
    Object.keys(local).forEach((key) => {
      if (toServerMap.has(<keyof T>key))
        result[<string>toServerMap.get(<keyof T>key)] = local[<keyof T>key];
    });
    return result;
  };
  const toLocal = (server: ServerData): Partial<T> => {
    const result: Partial<T> = {};
    Object.keys(server).forEach((key) => {
      if (tolocalMap.has(key))
        result[<keyof T>tolocalMap.get(key)] = server[key];
    });
    return result;
  };
  return { toServer, toLocal, toServerMap, tolocalMap };
}
