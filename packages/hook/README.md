# @nebula/hook

react hooks函数库

```shell script
npm i @nebula/hook
```

### 使用示例

```typescript jsx
import React, { useState } from 'react';
import { useWatch } from '@tb-util/hook';

export function Main() {
  const [data, setData] = useState(0)
  useWatch(() => {}, data);
  return (
    <div onclick={() => {
        setData(data + 1)
      }}
    >
      {data}
    </div>
  );
}
```

### API

|hook名| 功能                     |返回值|备注|
|---|------------------------|---|---|
|useMount| 在组件挂载后执行的一次性操作         |void|
|useWatch| 在被监听数据变化后执行的操作，可对比前后数据 |void|
|useInitStore| 初始化store               |Store<T>|
|useInitSimpleStore| 初始化简易store             |SimpleStore<T>|
|useCustomEventTarget| 生成或获取自定义事件中心           |CustomEventTarget|
|useCustomEventListener| 给自定义事件中心监听事件           |void|
|useEventTarget| 生成或获取事件中心              |EventTarget|
|useEventListener| 给事件中心监听事件              |void|
|useStorageMessage| 监听本地存储发送消息事件           |void|
