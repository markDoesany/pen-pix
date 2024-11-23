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
import useClassData from '../../hooks/useClassData'


const TaskPage = () => {
  const [task, setTask] = useState({});
  const [files, setFiles] = useRecoilState(FilesAtom)
  const currentUser = useRecoilValue(UserAtom);
  const { taskId } = useParams();
  const navigate = useNavigate();
  const {classData, loading} = useClassData(taskId)
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
    fetchFiles(); 

  }, [taskId, fetchFiles]);

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('task_id', taskId);

    try {
      const response = await axios.post('/files/upload-files', formData, {
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

  const handleEditTask = () =>{
    navigate(`/edit-task/${task?.id}`)
  }

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

  if (loading) return
  return (
    <div className="bg-[#EFEFEF] min-h-screen w-full p-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white shadow-lg p-6 rounded-lg">
            <div className="space-y-4 ">
              <h1 className="text-xl font-bold">{task.title}</h1>
              <p>{task.description}</p>
              <p className="text-gray-500">Class: {classData?.class_code} | {classData?.class_group}</p>
              <p className="text-gray-500">Type: {task.exam_type}</p>
              <p className="text-gray-500">Class Schedule: {classData?.class_schedule}</p>
              <p className="text-gray-500">Updated At: {formatDueDateTime(task.updated_at)}</p>
              <p className="text-gray-500">Due Date: {formatDueDateTime(task.due_date)}</p>
              <p className="text-gray-500">Status: {task.status}</p>
              <p className="text-gray-500">
                Submissions: {task.reviewed_submissions}/{task.total_submissions}
              </p>
              <div className="space-y-2">
                <label className="font-semibold">Answer Keys:</label>
                <ul className="pl-5 space-y-1 text-gray">
                  { task.answer_keys?.map((answerKey, index) => {
                      return(
                        <ul key={index} className='text-gray-500'>
                        <span className="font-semibold">{answerKey['item']}:</span>
                        {answerKey['keys'].map((key, index)=>{
                          return(
                          <li key={index} className='list-disc ml-10 flex justify-between'>
                            <div>
                              <span className="ml-2 font-semibold">Expression: </span> 
                              <span>{key['expression']}</span>
                            </div>
                            <div>
                              <span className="ml-2 font-semibold">Grade: </span> 
                              <span>{key['grade']}</span>
                            </div>
                          </li>)
                        })}
                      </ul>)
                      })}
                </ul>
              </div>
            </div>
        </div>

        <TaskActions
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onUpload={handleUpload}
          onAnalyze={handleAnalyzeSubmission}
          onGetLink={handleGetLink}
        />
      </div>

      <div className="w-full mx-auto p-4 mt-5">
        <FilesList files={files} refreshFiles={refreshFiles}/>
      </div>
    </div>
  );
};

export default TaskPage;
