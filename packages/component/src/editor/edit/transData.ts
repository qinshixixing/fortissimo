import { SlateTransforms } from '@wangeditor/editor';
import type { IDomEditor } from '@wangeditor/editor';

export interface EditorTransDataConfig {
  editor: IDomEditor;
  mediaInfo: Record<string, File>;
  uploadFn?: (data: File, type: string) => Promise<string>;
  currentLinkTarget?: boolean;
}

export async function transData(params: EditorTransDataConfig) {
  const trans = async (elements: any[], parentIndex: number[]) => {
    return Promise.all(
      elements.map(async (element, index) => {
        const indexArr = [...parentIndex, index];
        if (element.type === 'image' || element.type === 'video') {
          if (!params.uploadFn) return;
          const src = element.src;
          if (src.startsWith('blob:')) {
            const file = params.mediaInfo[src];
            const url = await params.uploadFn(file, element.type);
            SlateTransforms.setNodes(params.editor, { src: url } as any, {
              at: indexArr
            });
          }
        }
        if (element.type === 'link') {
          if (!params.currentLinkTarget) return;
          SlateTransforms.setNodes(params.editor, { target: '' } as any, {
            at: indexArr
          });
        } else if (element.children) await trans(element.children, indexArr);
      })
    );
  };
  await trans(params.editor.children, []);
  return params.editor;
}
