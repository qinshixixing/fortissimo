# @fortissimo/request

请求库

```shell script
npm i @fortissimo/request
```

### 使用示例

```typescript
import { request } from '@fortissimo/request';

const instance = request();

async function getFile(file, env, token) {
  const list = await instance({
      url: '/api/getList',
      methon: 'get'
  });
  console.log(list);
}
```

### API

|函数名/类名|功能|返回值|备注|
|---|--|---|---|
|basicAjax|底层ajax请求|AxiosInstance|
|requestBase|基础请求|RequestBaseInstance|项目从该请求扩展|
|request|请求|RequestInstance|
|checkToken|检查本地存储token|void|
