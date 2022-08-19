import { SlateTransforms } from '@wangeditor/editor';
import type { IDomEditor } from '@wangeditor/editor';

export interface EditorTransDataConfig {
  editor: IDomEditor;
  mediaInfo: Record<string, File>;
  uploadFn?: (data: File, type: string) => Promise<string>;
}

export async function transFile(params: EditorTransDataConfig) {
  const uploadImage = async (elements: any[], parentIndex: number[]) => {
    if (!params.uploadFn) return;
    return Promise.all(
      elements.map(async (element, index) => {
        if (!params.uploadFn) return;
        const indexArr = [...parentIndex, index];
        if (element.type === 'image' || element.type === 'video') {
          const src = element.src;
          if (src.startsWith('blob:')) {
            const file = params.mediaInfo[src];
            const url = await params.uploadFn(file, element.type);
            SlateTransforms.setNodes(params.editor, { src: url } as any, {
              at: indexArr
            });
          }
        } else if (element.children)
          await uploadImage(element.children, indexArr);
      })
    );
  };
  await uploadImage(params.editor.children, []);
  return params.editor;
}
