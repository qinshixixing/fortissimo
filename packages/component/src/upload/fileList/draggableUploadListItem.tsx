import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

const type = 'DragableUploadList';

interface DragableUploadListItemProps {
  originNode: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  file: UploadFile;
  fileList: UploadFile[];
  moveRow: (dragIndex: any, hoverIndex: any) => void;
}

export const DraggableUploadListItem = ({
  originNode,
  moveRow,
  file,
  fileList
}: DragableUploadListItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward'
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    }
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  drop(drag(ref));
  const errorNode = (
    <Tooltip title='Upload Error'>{originNode.props.children}</Tooltip>
  );
  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ''
      }`}
      style={{ cursor: 'move' }}
    >
      {file.status === 'error' ? errorNode : originNode}
    </div>
  );
};
