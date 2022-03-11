# @fortissimo/component

react纯ts(js)组件库

```shell script
npm i @fortissimo/component
```

### 使用示例

```typescript
import React from 'react';
import { Router } from '@fortissimo/component';
import type { Route } from '@fortissimo/component';

const config: Route[] = [
    {
        path: '',
        component: <div>hello, world!</div>
    },
    {
        path: 'about',
        component: <div>about</div>
    }
]

export default function() {
    return <div><Router config={config} /></div>
}
```

### API

|组件名|功能|props|备注|
|---|---|---|---|
|Router|根据路由配置选项生成路由组件|Route|

#### Route

|选项|功能|类型|是否必须|备注|
|---|---|---|---|---|
|path|路由路径（相对）|string|是|
|component|路由对应组件|ReactNode|是|
|layout|路由对应模版组件|ReactNode|否|
|routes|子路由选项|Route[]|否|
|childRoutes|是否允许路由组件内部设置子路由|boolean|否|
|root|路由组件是否嵌套|boolean|否|
