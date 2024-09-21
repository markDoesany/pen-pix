// src/pages/Dashboard/components/TaskList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskMenu from "./TaskMenu";
import { formatDueDateTime } from "../../../utils/helpers";
import useDeleteTask from '../../../hooks/useDeleteTask';

const TaskList = ({ filter, tasks, refreshTasks }) => {
  const [openTask, setOpenTask] = useState(null); // State to track the open task
  const navigate = useNavigate();
  const { handleDeleteTask: deleteTask } = useDeleteTask();

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const handleMenu = (event, task) => {
    event.stopPropagation();
    setOpenTask(prevTaskId => (prevTaskId === task ? null : task));
  };

  const handleSelectedTask = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    refreshTasks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-9 gap-4 font-semibold text-sm border-b-2 pb-2">
        <div className="text-gray-500 col-span-1">Group</div>
        <div className="col-span-2">Title</div>
        <div className="text-center col-span-1">No. of Submissions</div>
        <div className="text-center col-span-2">Due Date</div>
        <div className="text-center col-span-1">Status</div>
        <div className="text-center col-span-1">Type of Task</div>
        <div className="text-right col-span-1 pr-3"></div>
      </div>
      {filteredTasks.map((task, index) => (
        <div
          key={task.id} // Use unique ID for key
          className="grid grid-cols-9 gap-4 text-sm border-b py-5 hover:bg-gray-200 rounded-b-sm cursor-pointer items-center relative"
          onClick={() => handleSelectedTask(task.id)}
        >
          <div className="text-gray-500 pl-3 col-span-1 font-semibold">{task.class_group}</div>
          <div className="col-span-2 font-semibold">{task.title}</div>
          <div className="text-center col-span-1">
            {task.reviewed_submissions}/{task.total_submissions}
          </div>
          <div className="text-center col-span-2">{formatDueDateTime(task.due_date)}</div>
          <div
            className={`text-center col-span-1 font-semibold ${
              task.status === "Ongoing" ? "text-red-500" : "text-green-500"
            }`}
          >
            {task.status}
          </div>
          <div className="text-center col-span-1 font-semibold">{task.type}</div>
          <button className="text-right col-span-1 pr-4" onClick={(event) => handleMenu(event, task)}>
            <img className="inline-block" src="/icons/meatballs_menu.svg" alt="Menu icon" />
          </button>
          {openTask === task && <TaskMenu taskId={task.id} onDelete={() => handleDeleteTask(task.id)} />}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
