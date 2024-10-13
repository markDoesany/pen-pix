import TaskActions from './components/TaskActions';
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { UserAtom } from '../../atoms/UserAtom';
import { FilesAtom } from '../../atoms/FilesAtom'
import FilesList from './components/FilesList';
import { formatDueDateTime } from '../../utils/helpers';
import useDeleteTask from '../../hooks/useDeleteTask';

const TaskPage = () => {
  const [task, setTask] = useState({});
  const [files, setFiles] = useRecoilState(FilesAtom)
  const [isEditing, setIsEditing] = useState(false); // State to track if in edit mode
  const currentUser = useRecoilValue(UserAtom);
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { handleDeleteTask: deleteTask}  = useDeleteTask()
  const fetchFiles = useCallback(async () => {
    try {
      const response = await axios.get(`/files/get-files/${taskId}`);
      setFiles(response.data.files);
      console.log(response.data.files);
    } catch (error) {
      console.log(error);
    }
  }, [taskId, setFiles]);

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await axios.get(`/task/get-task/${taskId}`, {
          withCredentials: true,
        });
        setTask(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getTask();
    fetchFiles(); // Fetch files on component mount

  }, [taskId, fetchFiles]);

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('task_id', taskId);

    try {
      const response = await ('/files/upload-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log('Files uploaded:', response.data);
      fetchFiles(); // Refresh the files list
    } catch (error) {
      console.log('Error uploading files:', error);
    }
  };

  const handleEditTask = () => {
    setIsEditing(true);
  };

  const handleSaveTask = async () => {
    try {
      const response = await axios.patch(`/task/edit-task/${task.id}`, task, {
        withCredentials: true,
      });
  
      console.log("Task saved:", response.data);
      setIsEditing(false);
      
    } catch (error) {
      console.log("Error saving task:", error);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteTask = async () => {
    await deleteTask(taskId)
    navigate(`/dashboard/${currentUser.id}`);
  };

  const handleAnalyzeSubmission = () =>{
    navigate(`/circuit-evaluator/${task.id}`)
  }

  const refreshFiles = () => {
    fetchFiles();
  };

  const handleGetLink = () => {
    navigate(`/student-upload/${task.id}`);
  }

  return (
    <div>
      <div className="w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: Task details */}
        <div className="md:col-span-2 bg-white shadow-lg p-6 rounded-lg">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Group</label>
                <input
                  type="text"
                  value={task.class_group}
                  onChange={(e) => setTask({ ...task, class_group: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  value={task.type}
                  onChange={(e) => setTask({ ...task, type: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Schedule</label>
                <input
                  type="text"
                  value={task.class_schedule}
                  onChange={(e) =>
                    setTask({ ...task, class_schedule: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="datetime-local"
                  value={task.due_date}
                  onChange={(e) =>
                    setTask({ ...task, class_schedule: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Answer Keys</label>
                {task.answer_keys &&
                  task.answer_keys.map((key, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Expression</label>
                        <input
                          type="text"
                          value={key.expression}
                          onChange={(e) => {
                            const newAnswerKeys = [...task.answer_keys];
                            newAnswerKeys[index].expression = e.target.value;
                            setTask({ ...task, answer_keys: newAnswerKeys });
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="w-20">
                        <label className="block text-sm font-medium text-gray-700">Points</label>
                        <input
                          type="number"
                          value={key.points}
                          onChange={(e) => {
                            const newAnswerKeys = [...task.answer_keys];
                            newAnswerKeys[index].points = e.target.value;
                            setTask({ ...task, answer_keys: newAnswerKeys });
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newAnswerKeys = task.answer_keys.filter((_, i) => i !== index);
                          setTask({ ...task, answer_keys: newAnswerKeys });
                        }}
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                        disabled={task.answer_keys.length <= 1}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setTask({
                        ...task,
                        answer_keys: [...(task.answer_keys || []), { expression: '', points: '' }]
                      });
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Add Answer Key
                  </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-xl font-bold">{task.title}</h1>
              <p>{task.description}</p>
              <p className="text-gray-500">Class: {task.class_group}</p>
              <p className="text-gray-500">Type: {task.type}</p>
              <p className="text-gray-500">Class Schedule: {task.class_schedule}</p>
              <p className="text-gray-500">Updated At: {formatDueDateTime(task.updated_at)}</p>
              <p className="text-gray-500">Due Date: {formatDueDateTime(task.due_date)}</p>
              <p className="text-gray-500">Status: {task.status}</p>
              <p className="text-gray-500">
                Submissions: {task.reviewed_submissions}/{task.total_submissions}
              </p>
              <div className="space-y-2">
                <label className="font-semibold">Answer Keys:</label>
                <ul className="list-disc pl-5 space-y-1">
                  {task.answer_keys &&
                    task.answer_keys.map((key, index) => (
                      <li key={index}>
                        <span className="font-semibold">Expression:</span> {key.expression}
                        <span className="ml-2 font-semibold">Points:</span> {key.points}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right side: Buttons */}
        <TaskActions
          isEditing={isEditing}
          onEdit={handleEditTask}
          onSave={handleSaveTask}
          onCancel={handleCancelEdit}
          onDelete={handleDeleteTask}
          onUpload={handleUpload}
          onAnalyze={handleAnalyzeSubmission}
          onGetLink={handleGetLink}
        />
      </div>

      <div className="w-full mx-auto p-4">
        <FilesList files={files} refreshFiles={refreshFiles}/>
      </div>
    </div>
  );
};

export default TaskPage;
