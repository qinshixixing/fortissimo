# @fortissimo/request

请求库

```shell script
npm i @fortissimo/request
```

### 使用示例

```typescript
import { requestBase } from '@fortissimo/request';

const request = requestBase();

async function getFile(file, env, token) {
  const list = await request.get('/api/getList');
  console.log(list);
}
```

### API

|函数名/类名|功能|返回值|备注|
|---|--|---|---|
|basicAjax|底层ajax请求|AxiosInstance|
|requestBase|基础请求|AxiosInstance|项目从该请求扩展|
|requestStream|流数据请求|AxiosInstance|项目请求文件流从该请求扩展|
|setRequestAuth|设置请求的token和登录跳转逻辑|AxiosInstance|
|checkToken|检查本地存储token|void|
