import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, onSubmit, defaultValue }) => {
  const [inputValue, setInputValue] = React.useState(defaultValue);

  useEffect(() => {
    // Focus the input when the modal opens
    if (isOpen) {
      document.getElementById('modal-input').focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Map Field</h2>
        <input
          id="modal-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 p-2 rounded mb-4 w-full"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;