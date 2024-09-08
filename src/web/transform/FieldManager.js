import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

const FieldManager = ({ onAddField }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const handleAddField = () => {
    if (fieldName.trim()) {
      onAddField({ name: fieldName, value: fieldValue });
      setFieldName('');
      setFieldValue('');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Typography variant="h5">Add New Field</Typography>
      <TextField
        label="Field Name"
        value={fieldName}
        onChange={(e) => setFieldName(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <TextField
        label="Field Value"
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <Button variant="contained" color="primary" onClick={handleAddField}>
        Add Field
      </Button>
    </div>
  );
};

export default FieldManager;