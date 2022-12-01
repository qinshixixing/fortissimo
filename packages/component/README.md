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

| 组件名                | 功能                  | props                  |备注|
|--------------------|---------------------|------------------------|---|
| Router             | 根据路由配置选项生成路由组件      | Route                  |
| TypeInput          | 类型输入框               | TypeInputProps         |
| Time.Point         | 编辑时间                | TimePointProps         |
| Time.Range         | 编辑时间段               | TimeRangeProps         |
| Time.Show          | 展示时间                | TimeShowProps          |
| Time.ShowRange     | 展示时间段               | TimeShowRangeProps     |
| Upload.File        | 上传文件                | UploadProps            |
| Upload.FileList    | 上传多个文件              | UploadListProps        |
| Upload.Image       | 上传图片                | UploadImageProps       |
| Upload.FileList    | 上传多个图片              | UploadImageListProps   |
| Pic.Item           | 展示图片                | PicProps               |
| Pic.List           | 展示多个图片              | PicListProps           |
| Pic.Avatar         | 展示头像                | PicAvatarProps         |
| Pic.Avatar         | 展示头像                | PicAvatarProps         |
| Video.Item         | 展示视频                | VideoProps             |
| Video.List         | 展示多个视频              | VideoListProps         |
| Audio.Item         | 展示音频                | AudioProps             |
| Audio.List         | 展示多个音频              | AudioListProps         |
| status             | 生成状态组件              | StatusConfig           |
| DataListPro        | 表格展示查询操作            | DataListProProps       |
| DataSimpleListPro  | 列表展示查询操作            | DataSimpleListProProps |
| DataList.HeaderOpt | 表格/列表上方操作           | DataListOptProps       |
| DataList.RowOpt    | 表格/列表每行右侧操作         | DataListOptProps       |
| DataList.Search    | 表格/列表搜索栏            | DataListSearchProps    |
| DataList.Page      | 表格/列表页码             | DataListPageProps      |
| DataList.Tabel     | 表格主体                | DataListTableProps     |
| DataList.List      | 列表主体                | DataListListProps      |
| OptBoxPro          | 集成表单操作弹窗            | OptBoxProProps         |
| OptBox.Modal       | 操作弹框                | OptBoxProps            |
| OptBox.Drawer      | 操作弹出抽屉              | OptBoxProps            |
| OptForm            | 操作表单                | OptFormProps           |
| Operation.Item     | 操作按钮                | OperationProps         |
| Operation.List     | 多个连续操作按钮            | OperationListProps     |
| Editor.Edit        | 富文本编辑器              | EditorProps            |
| Editor.Show        | 展示富文本编辑器（html字符串）内容 | EditorShowProps        |
| SelectData         | 集成搜索选择器             | SelectDataProps        |
| Layout.AdminHeader | 后台管理页面头部            | LayoutAdminHeaderProps |
| Layout.Sidebar     | 页面侧边菜单              | LayoutSidebarProps     |
| Layout.Footer      | 页面底部                | LayoutFooterProps      |
| AdminLayout        | 后台页面布局模版组件          | LayoutFooterProps      |
| Map.List           | 地图多个地点显示            | MapListProps           |
| Map.Item           | 地图单个地点显示            | MapItemProps           |
| Map.Line           | 地图轨迹显示              | MapLineProps           |
