import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ObjectManager from './components/ObjectManager';
import SourceField from './components/SourceField';
import TargetField from './components/TargetField';
import TransformationZone from './components/TransformationZone';
import { Container, Grid, Paper, Typography } from '@mui/material';

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
      <Container>
        <Typography variant="h4" gutterBottom>
          JSON Mapping Editor
        </Typography>

        {/* Object Manager Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Input Object
              </Typography>
              <ObjectManager onObjectChange={setInputObject} />
            </Paper>
          </Grid>
        </Grid>

        {/* Main Transformation Grid */}
        <Grid container spacing={3} style={{ display: 'flex', marginTop: '20px' }}>
          {/* Source Fields */}
          <Grid item xs={12} md={4} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Source Fields
              </Typography>
              {Object.keys(inputObject).map((key) => (
                <SourceField key={key} name={key} />
              ))}
            </Paper>
          </Grid>

          {/* Transformation Zone */}
          <Grid item xs={12} md={4} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Data Transformations
              </Typography>
              <TransformationZone
                inputObject={inputObject}
                mappings={mappings}
                onTransformationsChange={handleTransformationsChange}
              />
            </Paper>
          </Grid>

          {/* Target Fields */}
          <Grid item xs={12} md={4} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Target Fields
              </Typography>
              <TargetField
                label="Mapping Zone"
                onMappingChange={handleMappingChange}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Output Object Section */}
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Output Object:</Typography>
              <pre>{JSON.stringify(outputObject, null, 2)}</pre>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DndProvider>
  );
};

export default App;