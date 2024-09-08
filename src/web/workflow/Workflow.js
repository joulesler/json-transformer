import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Input JSON' },
    position: { x: 250, y: 25 },
  },
];

const CustomNode = ({ data }) => {
  return (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: 'white' }}>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialEdges = [];

const MODAL_TYPES = {
  TRANSFORMATION: 'transformation',
  WORKFLOW: 'workflow',
};

const WorkflowChaining = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nextId, setNextId] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState('');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = (label) => {
    const newNode = {
      id: nextId.toString(),
      data: { label: `${label}` },
      position: { x: nextId * 200, y: 250 },
      type: 'custom',
    };
    setNodes((nds) => nds.concat(newNode));
    setNextId((id) => id + 1);
  };

  const handleAddTransformation = () => {
    setIsModalOpen(MODAL_TYPES.TRANSFORMATION);
  };

  const handleAddWorkflow = () => {
    setIsModalOpen(MODAL_TYPES.WORKFLOW);
  };

  const handleModalSubmit = (nodeType) => {
    if (selectedConfig) {
      addNode(`${nodeType} (${selectedConfig})`);
      setIsModalOpen(false);
    }
  };

  const handleConfigSelect = (configName) => {
    setSelectedConfig(configName);
  };

  const savedConfigurations = JSON.parse(localStorage.getItem('mappingConfiguration') || '{}');

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div className='flex flex-row justify-center gap-5'>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddWorkflow}>
          Add Workflow Stage
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddTransformation}>
          Add Transformation Stage
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => {addNode('End')}}>
          Add End Stage
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      {isModalOpen && (isModalOpen === MODAL_TYPES.TRANSFORMATION) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Select a Mapping Configuration</h2>
            <ul className="mb-4">
              {Object.keys(savedConfigurations).map((configName) => (
                <li key={configName} className="mb-2">
                  <button
                    className={`px-4 py-2 w-full text-left ${selectedConfig === configName ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleConfigSelect(configName)}
                  >
                    {configName}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleModalSubmit('Transformation')}>
                Add Transformation
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (isModalOpen === MODAL_TYPES.WORKFLOW) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Select a Mapping Configuration</h2>
            <ul className="mb-4">
              {['OAUTH', 'Header Extract', 'Encrypt', 'Decrypt', 'Sign Payload', 'API Call'].map((configName) => (
                <li key={configName} className="mb-2">
                  <button
                    className={`px-4 py-2 w-full text-left ${selectedConfig === configName ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleConfigSelect(configName)}
                  >
                    {configName}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleModalSubmit('Workflow')}>
                Add Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowChaining;