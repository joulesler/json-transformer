import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

const TargetField = ({ label, onMappingChange }) => {
  const [mappedFields, setMappedFields] = useState({});

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (item) => {
    const newKey = prompt(`Map "${item.name}" to output key:`, item.name);
    if (newKey) {
      // Update both the state and call onMappingChange in the correct order
      setMappedFields((prev) => {
        const updatedMappings = { ...prev, [item.name]: newKey };
        onMappingChange(updatedMappings); // Call with updated mappings
        return updatedMappings;
      });
    }
  };

  const handleRemoveMapping = (key) => {
    setMappedFields((prev) => {
      const updatedMappings = { ...prev };
      delete updatedMappings[key];
      onMappingChange(updatedMappings); // Call with updated mappings
      return updatedMappings;
    });
  };

  return (
    <div
      ref={drop}
      style={{
        padding: '5px',
        border: '2px dashed #aaa',
        backgroundColor: isOver ? '#f0f0f0' : '#fff',
        minHeight: '150px',
      }}
    >
      <h4>{label}</h4>
      {Object.entries(mappedFields).map(([sourceKey, targetKey]) => (
        <div key={sourceKey} style={{ marginBottom: '10px' }}>
          {sourceKey} ➔ {targetKey}
          <button onClick={() => handleRemoveMapping(sourceKey)} style={{ marginLeft: '10px' }}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default TargetField;