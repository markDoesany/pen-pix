import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskActions = ({ isEditing, onEdit, onSave, onCancel, onDelete, onUpload, onAnalyze, task }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleGenerateLink = () => {
    // Navigate to StudentUploadLink with the task ID
    if (task && task.id) {
      navigate(`/student-upload/${task.id}`); // Update the navigation path to include task ID
    } else {
      console.error('Task ID is missing');
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg space-y-4">
      {isEditing ? (
        <>
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={onSave}
          >
            Save
          </button>
          <button
            className="w-full bg-gray-300 text-black p-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            className="w-full bg-orange-700 text-white p-2 rounded"
            onClick={onAnalyze}
          >
            Analyze Submission
          </button>
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={onEdit}
          >
            Edit Task
          </button>
          <button
            className="w-full bg-green-500 text-white p-2 rounded"
            onClick={handleGenerateLink} // Update the onClick handler
          >
            Generate Link
          </button>
          <button className="w-full bg-purple-500 text-white p-2 rounded">
            Get Template
          </button>
          <button
            className="w-full bg-red-500 text-white p-2 rounded"
            onClick={onDelete}
          >
            Delete Task
          </button>
          {/* Upload File Button */}
          <button
            className="w-full bg-yellow-500 text-white p-2 rounded"
            onClick={handleUploadClick}
          >
            Upload File
          </button>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*" // Only allow image files
            multiple // Allow multiple file uploads
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 0) {
                onUpload(files); // Call the onUpload function passed from parent
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default TaskActions;
