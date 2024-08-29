import { useState } from "react";
import TaskMenu from "./TaskMenu";

const TaskList = ({ filter, tasks }) => {
  const [openTask, setOpenTask] = useState(null); // State to track the open task

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const handleMenu = (task) => {
    // Toggle the task menu
    setOpenTask(prevTaskId => (prevTaskId === task ? null : task));
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
      {filteredTasks.map((task) => (
        <div
          key={task.classGroup} // Use unique ID for key
          className="grid grid-cols-9 gap-4 text-sm border-b py-5 hover:bg-gray-200 rounded-b-sm cursor-pointer items-center relative"
        >
          <div className="text-gray-500 pl-3 col-span-1">{task.classGroup}</div>
          <div className="col-span-2">{task.title}</div>
          <div className="text-center col-span-1">
            {task.reviewedSubmission}/{task.totalSubmissions}
          </div>
          <div className="text-center col-span-2">{task.dueDate}</div>
          <div
            className={`text-center col-span-1 ${
              task.status === "Ongoing" ? "text-red-500" : "text-green-500"
            }`}
          >
            {task.status}
          </div>
          <div className="text-center col-span-1">{task.type}</div>
          <button className="text-right col-span-1 pr-4" onClick={() => handleMenu(task)}>
            <img className="inline-block" src="/icons/meatballs_menu.svg" alt="Menu icon" />
          </button>
          {openTask === task && <TaskMenu task={task}/>}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
