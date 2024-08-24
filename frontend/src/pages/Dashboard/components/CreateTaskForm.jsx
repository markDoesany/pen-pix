import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { TasksAtom } from '../../../atoms/TasksAtom';

const CreateTaskForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    classGroups: [{ name: '', schedule: '', dueDate: '' }],
    answerKey: [{ expression: '', points: '' }],
    askBoolean: 'yes',
    status: false // Added status property
  });

  // Get the current tasks from Recoil state
  const currentTasks = useRecoilValue(TasksAtom);
  const setTasks = useSetRecoilState(TasksAtom);

  const handleInputChange = (e, index, field, group) => {
    const { value } = e.target;
    if (group === 'classGroups' || group === 'answerKey') {
      const updatedGroup = formData[group].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData(prevState => ({
        ...prevState,
        [group]: updatedGroup
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [e.target.name]: value
      }));
    }
  };

  const handleAddItem = (group) => {
    setFormData(prevState => ({
      ...prevState,
      [group]: [...prevState[group], group === 'classGroups' ? { name: '', schedule: '', dueDate: '' } : { expression: '', points: '' }]
    }));
  };

  const handleDeleteItem = (group, index) => {
    setFormData(prevState => ({
      ...prevState,
      [group]: prevState[group].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const transformedData = formData.classGroups.map((group, groupIndex) => ({
      classNumber: groupIndex + 1,
      title: `${formData.title} - ${groupIndex + 1}`,
      totalSubmissions: 0, // Default value
      reviewedSubmission: 0, // Default value
      dueDate: group.dueDate, // Assuming dueDate from formData for illustration
      status: 'Ongoing', // Default status
      type: formData.type,
      answerKeys: formData.answerKey.map(item => ({ expression: item.expression, points: item.points })),
      askBoolean: formData.askBoolean
    }));

    // Append new tasks to existing tasks
    const updatedTasks = [...currentTasks, ...transformedData];

    console.log('Transformed Data:', transformedData);
    setTasks(updatedTasks);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-4/5 flex flex-col">
        <div className="flex-1 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Create Task</h2>
          
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder='e.g. Laboratory Exercise #1'
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Answer Key Section */}
            <div className='Answer-key'>
              <h3 className="text-lg font-semibold mb-2">Answer Key</h3>
              {formData.answerKey.map((item, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-semibold">Item {index + 1}</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder='Boolean expression'
                      value={item.expression}
                      onChange={(e) => handleInputChange(e, index, 'expression', 'answerKey')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="number"
                      placeholder='Points'
                      value={item.points}
                      onChange={(e) => handleInputChange(e, index, 'points', 'answerKey')}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={() => handleDeleteItem('answerKey', index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="mt-2 bg-black text-white px-4 py-2 rounded-md"
                onClick={() => handleAddItem('answerKey')}
              >
                Add Item
              </button>
            </div>

            {/* Class Group Section */}
            <div className='ClassGroup'>
              <h3 className="text-lg font-semibold mb-2">Class Group</h3>
              {formData.classGroups.map((group, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    placeholder='e.g. CPE 2301'
                    value={group.name}
                    onChange={(e) => handleInputChange(e, index, 'name', 'classGroups')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <label className="block text-sm font-semibold mb-1" htmlFor={`schedule-${index}`}>Schedule</label>
                  <input
                    id={`schedule-${index}`}
                    type="text"
                    placeholder='e.g. Lecture'
                    value={group.schedule}
                    onChange={(e) => handleInputChange(e, index, 'schedule', 'classGroups')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <label className="block text-sm font-semibold mb-1" htmlFor={`dueDate-${index}`}>Due Date</label>
                  <input
                    id={`dueDate-${index}`}
                    type="date"
                    placeholder='e.g. 2024-09-01'
                    value={group.dueDate}
                    onChange={(e) => handleInputChange(e, index, 'dueDate', 'classGroups')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                    onClick={() => handleDeleteItem('classGroups', index)}
                  >
                    Delete
                  </button>
                  {index < formData.classGroups.length - 1 && <hr className="my-4" />}
                </div>
              ))}
              <button
                className="mt-2 bg-black text-white px-4 py-2 rounded-md"
                onClick={() => handleAddItem('classGroups')}
              >
                Add Item
              </button>
            </div>

            {/* Type of Task Input */}
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="type">Type of Task</label>
              <input
                id="type"
                name="type"
                type="text"
                placeholder='e.g. Quiz, Homework'
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Simplified Boolean Expression Option */}
            <div>
              <label className="block text-sm font-semibold mb-1">Ask student for the simplified boolean expression?</label>
              <select
                name="askBoolean"
                value={formData.askBoolean}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-between">
          <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
          <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskForm;
