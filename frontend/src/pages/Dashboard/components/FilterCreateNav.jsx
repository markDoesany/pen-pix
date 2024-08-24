import { useState } from 'react';
import CreateTaskForm from './CreateTaskForm';

const FilterCreateNav = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  const handleCreateTask = () => {
    setShowCreateTaskForm(true); // Show the CreateTaskForm
  };

  const handleCloseForm = () => {
    setShowCreateTaskForm(false); // Hide the CreateTaskForm
  };

  return (
    <div className="relative">
      <div className="flex gap-10">
        <div className="flex items-center justify-between bg-gray-200 gap-1 px-1 py-1 rounded-md text-sm font-bold w-[220px]">
          <button
            className={`px-2 py-1 rounded-md ${selectedFilter === 'All' ? 'bg-white text-gray-900' : 'hover:bg-white text-gray-900'}`}
            onClick={() => handleFilterChange('All')}
          >
            All
          </button>
          <button
            className={`px-2 py-1 rounded-md ${selectedFilter === 'Completed' ? 'bg-white text-gray-900' : 'hover:bg-white text-gray-900'}`}
            onClick={() => handleFilterChange('Completed')}
          >
            Completed
          </button>
          <button
            className={`px-2 py-1 rounded-md ${selectedFilter === 'Ongoing' ? 'bg-white text-gray-900' : 'hover:bg-white text-gray-900'}`}
            onClick={() => handleFilterChange('Ongoing')}
          >
            Ongoing
          </button>
        </div>

        <button className="bg-[#953867] text-white rounded-md px-5 font-semibold" onClick={handleCreateTask}>Create Task</button>
      </div>

      {showCreateTaskForm && (<CreateTaskForm onClose={handleCloseForm} />)}
    </div>
  );
};

export default FilterCreateNav;
