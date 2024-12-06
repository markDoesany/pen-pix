import { useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const FilesList = ({ files, refreshFiles }) => {
  const [sortOption, setSortOption] = useState('desc');
  const [filterOption, setFilterOption] = useState('all');

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`/files/delete-file/${fileId}`);
      refreshFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('An error occurred while deleting the file.');
    }
  };

  const filteredFiles = files
    .filter((file) => {
      if (filterOption === 'graded') return file.graded;
      if (filterOption === 'ungraded') return !file.graded;
      return true;
    })
    .sort((a, b) => {
      return sortOption === 'asc'
        ? a.total_grade - b.total_grade
        : b.total_grade - a.total_grade;
    });

  const groupedFiles = filteredFiles.reduce((acc, file) => {
    if (!acc[file.item_number]) acc[file.item_number] = [];
    acc[file.item_number].push(file);
    return acc;
  }, {});

  const formatFilename = (filename) => filename.replace(/\.[^/.]+$/, '');

  const renderEmptyMessage = () => {
    if (filterOption === 'graded') {
      return <p className="text-yellow-600 text-sm">All files are not yet graded.</p>;
    }
    if (filterOption === 'ungraded') {
      return <p className="text-yellow-600 text-sm">All files are already graded.</p>;
    }
    return <p className="text-sm">No submissions available.</p>;
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-3">Submissions</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
        <div>
          <label className="font-medium mr-2 text-sm">Sort by Grade:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-auto text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div>
          <label className="font-medium mr-2 text-sm">Filter:</label>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-auto text-sm"
          >
            <option value="all">All</option>
            <option value="graded">Graded</option>
            <option value="ungraded">Ungraded</option>
          </select>
        </div>
      </div>

      {Object.keys(groupedFiles).length === 0 ? (
        renderEmptyMessage()
      ) : (
        Object.entries(groupedFiles).map(([itemNumber, files]) => (
          <div key={itemNumber} className="mb-4">
            <h3 className="text-md font-medium mb-2">Item {itemNumber}</h3>
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left w-[40%]">Filename</th>
                  <th className="border border-gray-300 px-2 py-1 hidden sm:table-cell w-[30%]">Status</th>
                  <th className="border border-gray-300 px-2 py-1 w-[30%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="text-center">
                    <td className="border border-gray-300 px-2 py-1 text-left truncate" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        title={formatFilename(file.filename)} // Tooltip for full filename
                      >
                        {formatFilename(file.filename)}
                      </a>
                    </td>
                    <td className={`border border-gray-300 px-2 py-1 hidden sm:table-cell ${file.graded ? 'text-green-600' : 'text-red-600'}`}>
                      {file.graded ? 'Graded' : 'Not graded'}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <button onClick={() => handleDeleteFile(file.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default FilesList;
