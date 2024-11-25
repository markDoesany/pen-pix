import { useState } from "react";

const UploadModal = ({ isOpen, onClose, items, onUploadFiles }) => {
  const [fileMappings, setFileMappings] = useState({});

  const handleFileChange = (e, index) => {
    setFileMappings({
      ...fileMappings,
      [index + 1]: e.target.files, 
    });
  };

  const handleUpload = () => {
    const allFiles = Object.entries(fileMappings);

    if (allFiles.length === 0) {
      alert("Please upload files for at least one item.");
      return;
    }

    allFiles.forEach(([itemNumber, files]) => {
      onUploadFiles(parseInt(itemNumber), Array.from(files));
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Upload Files</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="font-medium">{`Item ${index + 1}:`}</span>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, index)}
                className="flex-grow"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
