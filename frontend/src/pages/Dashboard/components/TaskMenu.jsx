const TaskMenu = ({task}) => {
  return (
    <div className="absolute right-0 -bottom-40 bg-white border border-gray-300 shadow-lg rounded-md p-2 w-48 z-50">
      <ul className="space-y-2">
        <li>
          <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md">
            Generate Link
          </button>
        </li>
        <li>
          <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md">
            Get Template
          </button>
        </li>
        <li>
          <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md">
            Edit Task
          </button>
        </li>
        <li>
          <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md">
            Remove Task
          </button>
        </li>
      </ul>
    </div>
  );
}

export default TaskMenu;
