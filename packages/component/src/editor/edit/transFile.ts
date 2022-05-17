import { getBlob } from '@fortissimo/util';
import { SlateTransforms } from '@wangeditor/editor';
import type { IDomEditor } from '@wangeditor/editor';

export interface EditorTransDataConfig {
  editor: IDomEditor;
  uploadFn?: (data: Blob, name: string, type: string) => Promise<string>;
}

export async function transFile(params: EditorTransDataConfig) {
  const uploadImage = async (
    elements: any[],
    parentIndex: number[],
    editor: IDomEditor
  ) => {
    if (!params.uploadFn) return;
    return Promise.all(
      elements.map(async (element, index) => {
        if (!params.uploadFn) return;
        const indexArr = [...parentIndex, index];
        if (element.type === 'image' || element.type === 'video') {
          const src = element.src;
          if (src.startsWith('blob:')) {
            const blob = await getBlob(src);
            const formatArr = blob.type.split('/');
            const fomart = formatArr[formatArr.length - 1];
            const url = await params.uploadFn(blob, `.${fomart}`, element.type);
            SlateTransforms.setNodes(editor, { src: url } as any, {
              at: indexArr
            });
          }
        } else if (element.children)
          await uploadImage(element.children, indexArr, editor);
      })
    );
  };
  await uploadImage(params.editor.children, [], params.editor);
  return params.editor;
}
