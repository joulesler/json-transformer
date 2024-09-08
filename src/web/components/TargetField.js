import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import Modal from './Modal';

const TargetField = ({ originalMappedFields, onMappingChange }) => {
    const [mappedFields, setMappedFields] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.FIELD,
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const handleDrop = (item) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (newKey) => {
        if (newKey && currentItem) {
            setMappedFields((prev) => {
                const updatedMappings = { ...prev, [currentItem.name]: newKey };
                onMappingChange(updatedMappings); // Call with updated mappings
                return updatedMappings;
            });
        };
        setIsModalOpen(false); // Close modal after submit
    };

    const handleRemoveMapping = (key) => {
        const updatedMappings = { ...mappedFields };
        delete updatedMappings[key];
        onMappingChange(updatedMappings); // Call with updated mappings
    };

    // load the initial mappings
    React.useEffect(() => {
        setMappedFields(originalMappedFields);
    }, [originalMappedFields]);

    return (
        <div
            ref={drop}
            className={`p-4 border-2 border-dashed ${isOver ? 'bg-gray-100' : 'bg-white'} min-h-40`}
        >
            {Object.entries(mappedFields).map(([sourceKey, targetKey]) => (
                <div key={sourceKey} className="mb-2 flex items-center">
                    <span className="mr-2">{sourceKey} ➔ {targetKey}</span>
                    <button
                        onClick={() => handleRemoveMapping(sourceKey)}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            ))}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    defaultValue={currentItem ? currentItem.name : ''}
                />
            )}
        </div>
    );
};

export default TargetField;