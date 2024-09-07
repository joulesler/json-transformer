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
    <div className="p-5">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="mr-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mr-2 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddField}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Field
        </button>
      </div>
      <pre className="bg-gray-100 p-3 rounded border border-gray-300">
        {JSON.stringify(inputObject, null, 2)}
      </pre>
    </div>
  );
};

export default ObjectManager;