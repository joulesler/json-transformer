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
        <div className="p-5 border-2 border-dashed border-gray-400 bg-white min-h-[150px]">
            {Object.keys(inputObject).map((key) => (
                <div key={key} className="mb-5">
                    <h4 className="text-lg font-bold">
                        {key} Transformations:
                    </h4>
                    <select
                        value={selectedTransformation[key] || ''}
                        onChange={(e) =>
                            setSelectedTransformation((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                            }))
                        }
                        className="p-2 border border-gray-300 rounded mr-2"
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
                        className="p-2 bg-green-500 text-white rounded cursor-pointer"
                    >
                        Add Transformation
                    </button>

                    <div className="min-h-[50px] p-2 border border-gray-300 rounded mt-2">
                        {(fieldTransformations[key] || []).map((transformation, index) => (
                            <div
                                key={`${key}-${transformation}-${index}`}
                                className="p-2 my-1 bg-gray-200 border border-gray-300 rounded flex justify-between items-center"
                            >
                                {transformation}
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleReorderTransformation(key, index, -1)}
                                        disabled={index === 0}
                                        className="p-1 bg-blue-400 text-white rounded cursor-pointer disabled:opacity-50"
                                    >
                                        Up
                                    </button>
                                    <button
                                        onClick={() => handleReorderTransformation(key, index, 1)}
                                        disabled={index === fieldTransformations[key].length - 1}
                                        className="p-1 bg-orange-400 text-white rounded cursor-pointer disabled:opacity-50"
                                    >
                                        Down
                                    </button>
                                    <button
                                        onClick={() => handleRemoveTransformation(key, index)}
                                        className="p-1 bg-red-500 text-white rounded cursor-pointer"
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