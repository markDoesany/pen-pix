const TaskList = ({ filter, tasks }) => {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-7 gap-4 font-semibold text-sm border-b-2 pb-2">
        <div className="text-gray-500">Group</div>
        <div>Title</div>
        <div className="text-center">No. of Submissions</div>
        <div className="text-center">Due Date</div>
        <div className="text-center">Status</div>
        <div className="text-center">Type of Task</div>
        <div className="text-right pr-3">Icon</div>
      </div>
      {filteredTasks.map((task, index) => (
        <div key={index} className="grid grid-cols-7 gap-4 text-sm border-b py-5 hover:bg-gray-200 rounded-b-sm cursor-pointer items-center">
          <div className="text-gray-500 pl-3">{task.classNumber}</div>
          <div>{task.title}</div>
          <div className="text-center">{task.reviewedSubmission}/{task.totalSubmissions}</div>
          <div className="text-center">{task.dueDate}</div>
          <div className={`text-center ${task.status === 'Ongoing' ? 'text-red-500' : 'text-green-500'}`}>
            {task.status}
          </div>
          <div className="text-center">{task.type}</div>
          <div className="text-right pr-3">Icon</div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
