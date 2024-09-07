import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

const SourceField = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FIELD,
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: '10px',
        margin: '5px',
        border: '1px solid #ccc',
        backgroundColor: isDragging ? '#e0e0e0' : '#fff',
        cursor: 'move',
      }}
    >
      {name}
    </div>
  );
};

export default SourceField;