import React, { useState, useEffect } from 'react';
import loadTransformations from '../../lib/transform';

const transformationOptions = loadTransformations();

const TransformationZone = ({ inputObject, onTransformationsChange }) => {
  const [fieldTransformations, setFieldTransformations] = useState({});
  const [selectedTransformation, setSelectedTransformation] = useState({});

  // Apply transformations to values only
  const applyTransformations = () => {
    onTransformationsChange(fieldTransformations, transformationOptions);
  };

  // Add transformation to value
  const handleAddTransformation = (key) => {
    const transformation = selectedTransformation[key];
    if (transformation && transformationOptions[transformation]) {
      setFieldTransformations((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), transformation],
      }));
      // Clear selected transformation after adding
      setSelectedTransformation((prev) => ({
        ...prev,
        [key]: '',
      }));
      applyTransformations();
    }
  };

  // Remove a transformation
  const handleRemoveTransformation = (key, index) => {
    setFieldTransformations((prev) => {
      const updatedTransformations = [...(prev[key] || [])];
      updatedTransformations.splice(index, 1);
      return {
        ...prev,
        [key]: updatedTransformations,
      };
    });
    applyTransformations();
  };

  // Move transformation up or down within the list
  const handleReorderTransformation = (key, index, direction) => {
    setFieldTransformations((prev) => {
      const updatedTransformations = [...(prev[key] || [])];
      const [movedItem] = updatedTransformations.splice(index, 1);
      updatedTransformations.splice(index + direction, 0, movedItem);
      return {
        ...prev,
        [key]: updatedTransformations,
      };
    });
    applyTransformations();
  };

  // Reapply transformations when the input object or transformation chain changes
  useEffect(() => {
    if (Object.keys(inputObject).length > 0) {
      applyTransformations();
    }
  }, [fieldTransformations, inputObject]);

  return (
    <div
      style={{
        padding: '5px',
        border: '2px dashed #aaa',
        backgroundColor: '#fff',
        minHeight: '150px',
      }}
    >
      <h4>Transformation Zone</h4>
      {Object.keys(inputObject).map((key) => (
        <div key={key} style={{ marginBottom: '20px' }}>
          <h5>{key} Transformations:</h5>

          {/* Dropdown Selector for Transformations */}
          <select
            value={selectedTransformation[key] || ''}
            onChange={(e) =>
              setSelectedTransformation((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            style={{
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            <option value="" disabled>
              Select Transformation
            </option>
            {Object.keys(transformationOptions).map((transformation) => (
              <option key={transformation} value={transformation}>
                {transformation}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleAddTransformation(key)}
            style={{
              padding: '5px 10px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Transformation
          </button>

          <div
            style={{
              minHeight: '50px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          >
            {(fieldTransformations[key] || []).map((transformation, index) => (
              <div
                key={`${key}-${transformation}-${index}`}
                style={{
                  padding: '8px',
                  margin: '4px 0',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {transformation}
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => handleReorderTransformation(key, index, -1)}
                    disabled={index === 0}
                    style={{
                      border: 'none',
                      backgroundColor: '#87cefa',
                      color: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      padding: '5px',
                    }}
                  >
                    Up
                  </button>
                  <button
                    onClick={() => handleReorderTransformation(key, index, 1)}
                    disabled={index === fieldTransformations[key].length - 1}
                    style={{
                      border: 'none',
                      backgroundColor: '#ffa07a',
                      color: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      padding: '5px',
                    }}
                  >
                    Down
                  </button>
                  <button
                    onClick={() => handleRemoveTransformation(key, index)}
                    style={{
                      border: 'none',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      padding: '5px',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransformationZone;