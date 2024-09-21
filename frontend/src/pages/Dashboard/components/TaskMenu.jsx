// src/pages/Dashboard/components/TaskMenu.jsx
import { useNavigate } from 'react-router-dom';

const TaskMenu = ({ onDelete, taskId }) => { // Accept taskId as a prop

  const navigate = useNavigate();

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete();
  };

  const handleGetLink = (event) => {
    event.stopPropagation();
    navigate(`/student-upload/${taskId}`); // Navigate with taskId in URL
  };

  const handleGetTemplate = (event) => {
    event.stopPropagation();
    console.log("Get template");
  };

  return (
    <div className="absolute right-0 -bottom-32 bg-white border border-gray-300 shadow-lg rounded-md p-2 w-48 z-50">
      <ul className="space-y-2">
        <li>
          <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md" onClick={handleGetLink}>
            Generate Link
          </button>
        </li>
        <li>
          <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md" onClick={handleGetTemplate}>
            Get Template
          </button>
        </li>
        <li>
          <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md" onClick={handleDelete}>
            Remove Task
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TaskMenu;
