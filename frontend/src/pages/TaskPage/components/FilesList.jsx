import axios from 'axios';

const FilesList = ({ files, refreshFiles }) => {

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`/files/delete-file/${fileId}`);
      refreshFiles(); // Refresh the file list
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('An error occurred while deleting the file.');
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-lg font-bold">Files</h2>
      {files.length === 0 ? (
        <p>No files available.</p>
      ) : (
        <ul className="list-disc pl-5">
          {files.map((file) => (
            <li key={file.id} className="flex justify-between items-center space-x-2">
              <a 
                href={file.file_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500"
              >
                {file.filename}
              </a>
              <button 
                onClick={() => handleDeleteFile(file.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilesList;
