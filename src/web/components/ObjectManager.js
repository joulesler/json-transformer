import React, { useState } from 'react';

const ObjectManager = ({ onObjectChange }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [inputObject, setInputObject] = useState({});

  const handleAddField = () => {
    if (key) {
      const updatedObject = { ...inputObject, [key]: value };
      setInputObject(updatedObject);
      onObjectChange(updatedObject);
      setKey('');
      setValue('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleAddField}>Add Field</button>
      <pre>{JSON.stringify(inputObject, null, 2)}</pre>
    </div>
  );
};

export default ObjectManager;