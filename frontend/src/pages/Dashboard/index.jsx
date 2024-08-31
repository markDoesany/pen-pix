import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import useErrorHandler from '../../hooks/useErrorHandler';
import FilterCreateNav from './components/FilterCreateNav.jsx';
import TaskList from './components/TaskList.jsx';
import { UserAtom } from '../../atoms/UserAtom';
import {TasksAtom}  from '../../atoms/TasksAtom.js'

const Dashboard = () => {
  const { userId } = useParams(); 
  const [currentUser, setCurrentUser] = useRecoilState(UserAtom);
  const [tasks, setTasks] = useRecoilState(TasksAtom)
  const [filter, setFilter] = useState('All');
  const { handleError } = useErrorHandler();

  const getTasks = async () => {
    try {
      const response = await axios.get('/task/get-tasks', { withCredentials: true })
      const tasks = response.data
      console.log(tasks)
      setTasks(tasks)

    } catch (error) {
      if (error.response.status === 401) {
        setCurrentUser(null)
        localStorage.removeItem('user')
        handleError('unauthorized', 'Your session has expired. Login again.');
    }
  }
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`/auth/user/${userId}`);
        const fetchedUser = response.data.user;
        if (currentUser?.id !== fetchedUser.id) {
          console.log("Unauthorized");
          handleError('unauthorized', "You are not authorized to access this page.")
          return;
        }
        setCurrentUser(fetchedUser);
        getTasks()

      } catch (error) {
        if (error.response.status === 401) {
          handleError('unauthorized', 'Your session has expired. Login again.');
        } else if (error.response.status === 404) {
          handleError('404', 'The resource you are looking for could not be found.');
        } else {
          handleError('default', 'An unexpected error occurred.');
        }
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, []);

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  }

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  return (
    <div className="mt-10 flex flex-col w-full">
      <FilterCreateNav onFilterChange={handleFilterChange} />
      <TaskList filter={filter} tasks={tasks}/>
    </div>
  );
};

export default Dashboard;
