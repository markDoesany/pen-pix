import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import CreateTaskForm from './CreateTaskForm';
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'


const FilterCreateNav = ({ onFilterChange }) => {
  // const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const navigate = useNavigate()

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  const handleCreateTask = () => {
    navigate('/create-task')
      // setShowCreateTaskForm(true); // Show the CreateTaskForm
  };

  const handleCloseForm = () => {
    setShowCreateTaskForm(false); // Hide the CreateTaskForm
  };

  return (
    <div className="w-full">
      <div className="flex gap-10 w-full justify-between">
        <div className="flex items-center justify-between bg-gray-200 rounded-md text-sm font-light border-2 border-customGray2 overflow-hidden ml-3">
          <button
            className={`px-4 py-1 h-full w-full rounded-l-md ${selectedFilter === 'All' ? 'bg-white text-gray-900' : 'hover:bg-white text-gray-900'}`}
            onClick={() => handleFilterChange('All')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 h-full w-full border-r-2 border-l-2 border-customGray2 ${selectedFilter === 'Completed' ? 'bg-white text-gray-900' : 'hover:bg-white text-gray-900'}`}
            onClick={() => handleFilterChange('Completed')}
          >
            Complete
          </button>
          <button
            className={`px-3 py-1 h-full w-full rounded-r-md ${selectedFilter === 'Ongoing' ? 'bg-white text-gray-900' : 'hover:bg-white text-gray-900'}`}
            onClick={() => handleFilterChange('Ongoing')}
          >
            Incomplete
          </button>
        </div>

        <button className="bg-primaryColor text-white rounded-md px-5 py-2 font-semibold flex items-center gap-2" onClick={handleCreateTask}> <FaPlus/>Create New Task</button>
      </div>

      {showCreateTaskForm && (<CreateTaskForm onClose={handleCloseForm} />)}
    </div>
  );
};

export default FilterCreateNav;
