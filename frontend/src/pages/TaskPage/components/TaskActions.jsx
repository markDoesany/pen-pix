import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the taskId
import axios from 'axios';
import LinkModal from './LinkModal';

const TaskActions = ({ isEditing, onEdit, onSave, onCancel, onDelete, onUpload, onAnalyze }) => {
  const fileInputRef = useRef(null);
  const { taskId } = useParams(); // Get taskId from URL parameters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleGetLinkClick = async () => {
    try {
      const response = await axios.post(`/task/generate-link/${taskId}`);
      const generatedLink = response.data.link; // Get the full link from the response
      setGeneratedLink(generatedLink); // Use setGeneratedLink to update the state
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error generating link:', error);
    }
};

  const closeModal = () => {
    setIsModalOpen(false);
    setGeneratedLink(''); // Reset the link when closing
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
          <button className="w-full bg-green-500 text-white p-2 rounded" onClick={handleGetLinkClick}>
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
      {/* Link Modal */}
      <LinkModal isOpen={isModalOpen} onClose={closeModal} link={generatedLink} />
    </div>
  );
};

export default TaskActions;
