import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import { DomEditor } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import type {
  IDomEditor,
  Toolbar as IDomToolbar,
  IEditorConfig,
  IToolbarConfig
} from '@wangeditor/editor';
import { transData } from './transData';
import type { MediaInfo } from './transData';

import '@wangeditor/editor/dist/css/style.css';
export { transData };
export type { MediaInfo };
export type { EditorTransDataConfig } from './transData';

export interface EditorConfig {
  mode?: 'default' | 'simple';
  maxLength?: number;
  disabled?: boolean;
  height?: string | number;
  scroll?: boolean;
  imageFormat?: string[];
  videoFormat?: string[];
  uploadFn?: (data: File, type: string) => Promise<string>;
  uploadOnInsert?: boolean;
  currentLinkTarget?: boolean;
}

export interface EditorProps extends EditorConfig {
  value?: string;
  onChange?: (data: string, media: MediaInfo) => void;
}

const defaultImageFormat = ['jpg', 'jpeg', 'png'];
const defaultVideoFormat = ['mp4'];

export const Edit = forwardRef((props: EditorProps, ref) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [toolbar, setToolbar] = useState<IDomToolbar | null>(null);

  const [mediaInfo, setMediaInfo] = useState<MediaInfo>({});

  const toolbarConfig = useMemo<Partial<IToolbarConfig>>(() => {
    const excludeKeys = ['insertTable', 'codeBlock', 'todo'];
    if (!props.scroll) excludeKeys.push('fullScreen');
    return {
      excludeKeys
    };
  }, [props.scroll]);

  const editorConfig = useMemo<Partial<IEditorConfig>>(
    () => ({
      placeholder: '请输入内容',
      readOnly: props.disabled || false,
      MENU_CONF: {
        uploadImage: {
          allowedFileTypes: (props.imageFormat || defaultImageFormat).map(
            (item) => `.${item}`
          ),
          customUpload: async (file: File, insertFn: (url: string) => void) => {
            let url: string;
            if (props.uploadOnInsert && props.uploadFn) {
              url = await props.uploadFn(file, 'img');
            } else {
              url = URL.createObjectURL(file);
              setMediaInfo((v) => ({ ...v, [url]: { file, type: 'img' } }));
            }
            insertFn(url);
          }
        },
        uploadVideo: {
          allowedFileTypes: (props.videoFormat || defaultVideoFormat).map(
            (item) => `.${item}`
          ),
          customUpload: async (file: File, insertFn: (url: string) => void) => {
            let url: string;
            if (props.uploadOnInsert && props.uploadFn) {
              url = await props.uploadFn(file, 'video');
            } else {
              url = URL.createObjectURL(file);
              setMediaInfo((v) => ({ ...v, [url]: { file, type: 'video' } }));
            }
            insertFn(url);
          }
        }
      },
      maxLength: props.maxLength,
      scroll: props.scroll || false,
      autoFocus: false
    }),
    [props]
  );

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (!editor) return;
      editor.destroy();
      setEditor(null);
      setToolbar(null);
    };
  }, [editor]);

  useImperativeHandle(ref, () => ({
    ...editor,
    getToolbar: () => toolbar,
    getMediaInfo: () => mediaInfo,
    transData: async () => {
      if (!props.onChange || !editor) return;
      await transData({
        editor,
        mediaInfo,
        uploadFn: props.uploadFn,
        currentLinkTarget: props.currentLinkTarget
      });
      const html = editor.getHtml();
      props.onChange(html, mediaInfo);
    }
  }));

  return (
    <div className={'ft-editor-box'}>
      <Toolbar
        mode={props.mode || 'default'}
        editor={editor}
        defaultConfig={toolbarConfig}
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        mode={props.mode || 'default'}
        defaultConfig={editorConfig}
        value={props.value}
        onCreated={(editor) => {
          setEditor(editor);
          setTimeout(() => {
            const toolbar = DomEditor.getToolbar(editor);
            setToolbar(toolbar);
          });
        }}
        onChange={(() => {
          let isFirstChange = true;
          let lastHtml = '';
          return async (editor: IDomEditor) => {
            const html = editor.isEmpty() ? '' : editor.getHtml();
            if (lastHtml === html) return;
            lastHtml = html;
            if (isFirstChange) {
              isFirstChange = false;
              return;
            }
            props.onChange && props.onChange(html, mediaInfo);
          };
        })()}
        style={{
          [props.scroll ? 'height' : 'minHeight']: props.height || '300px'
        }}
      />
    </div>
  );
});
