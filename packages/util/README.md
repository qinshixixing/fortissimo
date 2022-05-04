# @fortissimo/util

前端工具函数库

```shell script
npm i @fortissimo/util
```

### 使用示例

```typescript
import { sleep } from '@fortissimo/util'

async function getFile(file, env, token) {
  console.log(1)
  await sleep(5)
  console.log(2)
}
```

### API

|函数名/类名|功能|返回值|备注|
|---|---|---|---|
|detectIE|检查是否为ie|boolean|
|getIEVersion|获取ie版本|number|
|getBrowserType|获取浏览器种类|string|
|CustomEventTarget|自定义事件中心|CustomEventTargetInstance|
|parseJson|解析JSON串（自带try，catch）|any|
|sleep|休眠函数|void|
|createProxyStorage|在localstorage中创建代理对象|{ [propName: string]: any }|
|getRandomString|获取随机字符串|string|
|getBlob|获取二进制文件|Promise<Blob>  |
|saveBlob|保存二进制文件|void|
|readBlob|读取二进制文件|Promise<ReadResult>|
|readBlobAsDataURL|读取二进制文件为DataURL|Promise<ReadResult>|
|generateBlob|生成二进制文件|Blob|
|downloadBlob|下载二进制文件|void|
|imageFormatList|受支持的图片格式列表|string[]|
|videoFormatList|受支持的视频格式列表|string[]|
|linkFileFormatList|受支持的文件外链格式列表|string[]|
|checkFileFormat|检查文件是否符合格式|boolean|
|checkImage|检查文件是否为图片|boolean|
|checkVideo|检查文件是否为视频|boolean|
|checkLinkFile|检查文件是否为链接可预览文件|boolean|
|watermarkConfig|返回base64|string|
|mapToObj|把Map转成对象|{ [key: string]: any }|
|objToMap|把对象转成Map|Map<string, any>|
|checkPhoneEnv|检查移动端页面环境|PhoneEnv|
|trimString|把对象中字符串字段去除前后空格|T extends Record<string, any>|
|transKey|转化服务端与本地对象字段名工厂函数|TransKeyData<T>|
|getTimeFormat|根据精度获取时间转换格式|string|
