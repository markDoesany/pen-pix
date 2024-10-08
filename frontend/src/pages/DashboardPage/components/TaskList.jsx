import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskMenu from "./TaskMenu";
import { formatDueDateTime } from "../../../utils/helpers";
import useDeleteTask from '../../../hooks/useDeleteTask';

const TaskList = ({ filter, tasks, refreshTasks }) => {
  const [openTask, setOpenTask] = useState(null);
  const navigate = useNavigate();
  const { handleDeleteTask: deleteTask } = useDeleteTask();

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.status === filter;
  });

  const handleMenu = (event, task) => {
    event.stopPropagation();
    setOpenTask((prevTaskId) => (prevTaskId === task ? null : task));
  };

  const handleSelectedTask = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    refreshTasks();
  };

  const handleGetLink = (taskId) => {
    navigate(`/student-upload/${taskId}`);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-7 max-md:hidden">
        <div className="grid grid-cols-7 gap-4 font-semibold text-sm border-b-2 pb-2">
          <div className="text-left text-gray-500">Course | Group</div>
          <div className="text-left col-span-2">Title</div>
          <div className="text-center ">No. of Submissions</div>
          <div className="text-center ">Due Date</div>
          <div className="text-center ">Type of Task</div>
          <div className="text-right  pr-3"></div>
        </div>
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 text-sm border-b py-5 hover:bg-gray-200 rounded-b-sm cursor-pointer items-center relative"
            onClick={() => handleSelectedTask(task.id)}
          >
            <div className="text-left pl-3 font-semibold text-gray-500">{task.class_group}</div>
            <div className="col-span-2 font-semibold text-left">{task.title}</div>
            <div className="text-center border border-gray-300 rounded-md w-16 py-1 mx-auto">
              <p>{task.reviewed_submissions}/{task.total_submissions}</p>
            </div>
            <div className="text-center">{formatDueDateTime(task.due_date)}</div>
            <div className="text-center col-span-1 font-semibold">{task.type}</div>
            <button
              className="text-right col-span-1 pr-4"
              onClick={(event) => handleMenu(event, task)}
            >
              <img className="inline-block" src="/icons/meatballs_menu.svg" alt="Menu icon" />
            </button>
            {openTask === task && (
              <TaskMenu
                onDelete={() => handleDeleteTask(task.id)}
                onGetLink={() => handleGetLink(task.id)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="hidden max-md:block">
        {filteredTasks.map((task) => (
          <div
            key={task.id} // Use unique ID for key
            className="border border-gray-300 rounded-lg p-4 mb-4 hover:bg-gray-100 cursor-pointer mt-5 relative"
            onClick={() => handleSelectedTask(task.id)}
          >
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-gray-600">Group: {task.class_group}</p>
            <p className="text-gray-600">Due Date: {formatDueDateTime(task.due_date)}</p>
            <p className={`font-semibold ${task.status === "Ongoing" ? "text-red-500" : "text-green-500"}`}>
              Status: {task.status}
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">Submissions: {task.reviewed_submissions}/{task.total_submissions}</p>
              <button
                className="text-gray-500"
                onClick={(event) => handleMenu(event, task)}
              >
                <div className="absolute w-10 top-2 right-0">
                  <img src="/icons/meatballs_menu.svg" alt="Menu icon" />
                </div>
              </button>
            </div>
            {openTask === task && (
              <TaskMenu
                onDelete={() => handleDeleteTask(task.id)}
                onGetLink={() => handleGetLink(task.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
