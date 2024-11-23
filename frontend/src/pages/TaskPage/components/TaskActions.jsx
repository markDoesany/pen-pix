import { useRef } from 'react';

const TaskActions = ({ onEdit, onDelete, onUpload, onAnalyze, onGetLink }) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg space-y-4">
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
          <button className="w-full bg-green-500 text-white p-2 rounded"
            onClick={onGetLink}>
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
          <button
            className="w-full bg-yellow-500 text-white p-2 rounded"
            onClick={handleUploadClick}
          >
            Upload File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*" 
            multiple 
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 0) {
                onUpload(files); 
              }
            }}
          />
        </>
    </div>
  );
};

export default TaskActions;
