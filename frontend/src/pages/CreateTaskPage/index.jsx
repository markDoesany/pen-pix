import { FaPencil } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import ClassCombobox from "./components/ClassCombobox";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { UserAtom } from '../../atoms/UserAtom';
import axios from 'axios';

const CreateTaskPage = () => {
  const [next, setNext] = useState(false);
  const navigate = useNavigate();
  const user = useRecoilValue(UserAtom);

  const [formData, setFormData] = useState({
    title: "",
    classGroup: "",
    type: "",
    dueDate: "",
    answerKeys: [],
    totalSubmissions: 0,
    reviewedSubmissions: 0,
    status: "Ongoing",
    askBoolean: "no"
  });

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle task creation
  const handleCreateTask = async () => {
    const taskData = {
      title: formData.title,
      classGroup: formData.classGroup,
      type: formData.type,
      dueDate: formData.dueDate,
      answerKeys: formData.answerKeys,
      totalSubmissions: formData.totalSubmissions,
      reviewedSubmissions: formData.reviewedSubmissions,
      status: formData.status,
      askBoolean: formData.askBoolean,
    };

    try {
      const response = await axios.post("/task/create-task", taskData);
      console.log(response.data)
      navigate(`/dashboard/${user.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-5 gap-4 md:w-[800px] mx-auto">
      <h1 className="text-[28px] font-medium mt-2">Create Task</h1>
      {!next && (
        <div>
          <div className="flex flex-col gap-2">
            <label className="text-md font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Laboratory Exercise #1"
              className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"
            />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-md font-medium">Class Group</h2>
            <ClassCombobox />
            <div className="flex gap-2 items-center mt-1 cursor-pointer">
              <IoIosAddCircle color="gray" size={20} />
              <span className="text-gray-500">Add Class Group</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-md font-medium">Type of Task</h2>
            <ClassCombobox />
          </div>
          <div className="mt-4">
            <h2 className="text-md font-medium">Answer Keys</h2>
            <div className="flex flex-col gap-4 mt-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <label className="text-sm font-medium">Item 1</label>
                  <FaPencil size={15} />
                </div>
                <div className="flex gap-2 items-center cursor-pointer">
                  <IoIosAddCircle color="gray" size={20} />
                  <span className="text-gray-500">Add Item</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between w-full gap-10">
                  <div className="w-[150px]">
                    <ClassCombobox />
                  </div>
                  <input
                    type="text"
                    name="answerKey"
                    placeholder="Y1 = X1 ^ X2"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        answerKeys: [...prev.answerKeys, e.target.value],
                      }));
                    }}
                    className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md w-full"
                  />
                </div>
                <div className="flex gap-2 items-center cursor-pointer">
                  <IoIosAddCircle color="gray" size={20} />
                  <span className="text-gray-500">Add Expression</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-5">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg"
              onClick={() => navigate(`/dashboard/${user.id}`)}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-black text-white rounded-lg"
              onClick={() => setNext(true)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {next && (
        <div className="flex flex-col gap-5">
          <h2 className="text-md font-medium">Laboratory Exercise Number 1</h2>
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-md font-medium">Class Lists</h2>
              <h2 className="text-md font-medium">Due Date</h2>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <p className="font-light">CpE 2301 Group 1 | MW 1:30 - 2:30 PM</p>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-5">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg"
              onClick={() => setNext(false)}
            >
              Back
            </button>
            <button
              className="px-6 py-2 bg-black text-white rounded-lg"
              onClick={handleCreateTask}
            >
              Create Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTaskPage;
