import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ObjectManager from './components/ObjectManager';
import SourceField from './components/SourceField';
import TargetField from './components/TargetField';
import TransformationZone from './components/TransformationZone';

const App = () => {
  const [inputObject, setInputObject] = useState({});
  const [mappings, setMappings] = useState({});
  const [outputObject, setOutputObject] = useState({});
  const [fieldTransformations, setFieldTransformations] = useState({});
  const [transformationOptions, setTransformationOptions] = useState({});

  const reRenderOutputObject = () => {
    const transformedObject = lodash.cloneDeep(inputObject);

    // Apply transformations to the inputObject first
    Object.keys(fieldTransformations).forEach((key) => {
      const transformations = fieldTransformations[key] || [];
      let value = inputObject[key];

      if (typeof value !== 'string') {
        console.warn(`Value for key '${key}' is not a string:`, value);
        value = ''; // Handle non-string values appropriately
      }

      // Apply all transformations
      transformations.forEach((transformation) => {
        const transformFunc = transformationOptions[transformation];
        if (transformFunc) {
          value = transformFunc(value);
        }
      });

      transformedObject[key] = value;
    });

    // Apply key mappings to the transformedObject, removing the original keys
    Object.entries(mappings).forEach(([sourceKey, targetKey]) => {
      if (transformedObject.hasOwnProperty(sourceKey)) {
        transformedObject[targetKey] = transformedObject[sourceKey];
        delete transformedObject[sourceKey];
      }
    });

    // Remove all the original keys that do not have a mapping
    Object.keys(transformedObject).forEach((key) => {
      if (!Object.values(mappings).includes(key)) {
        delete transformedObject[key];
      }
    });

    setOutputObject(transformedObject);
  };

  const handleMappingChange = (updatedMappings) => {
    setMappings(updatedMappings);
  };

  useEffect(() => {
    reRenderOutputObject();
  }, [mappings, fieldTransformations]);

  const handleTransformationsChange = (fieldTransformations, transformationOptions) => {
    setFieldTransformations(fieldTransformations);
    setTransformationOptions(transformationOptions);

    // Re-render the output object when transformations change
    reRenderOutputObject();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6">JSON Mapping Editor</h1>

        {/* Object Manager Section */}
        <div className="mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Input Object</h2>
            <ObjectManager onObjectChange={setInputObject} />
          </div>
        </div>

        {/* Main Transformation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Source Fields */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Source Fields</h2>
            {Object.keys(inputObject).map((key) => (
              <SourceField key={key} name={key} />
            ))}
          </div>

          {/* Transformation Zone */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Data Transformations</h2>
            <TransformationZone
              inputObject={inputObject}
              mappings={mappings}
              onTransformationsChange={handleTransformationsChange}
            />
          </div>

          {/* Target Fields */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Target Fields</h2>
            <TargetField onMappingChange={handleMappingChange} />
          </div>
        </div>

        {/* Output Object Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Output Object:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(outputObject, null, 2)}
          </pre>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;