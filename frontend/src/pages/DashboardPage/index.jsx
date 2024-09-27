import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';
import useErrorHandler from '../../hooks/useErrorHandler';
import FilterCreateNav from './components/FilterCreateNav.jsx';
import TaskList from './components/TaskList.jsx';
import { UserAtom } from '../../atoms/UserAtom';
import { TasksAtom } from '../../atoms/TasksAtom.js';
import { NotificationsAtom } from '../../atoms/Notifications.js'
import useGetTasks from '../../hooks/useGetTasks.jsx';
import EmptyTasksPlaceholder from './components/EmptyTaskPlaceholder.jsx';

const Dashboard = () => {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useRecoilState(UserAtom);
  const tasks = useRecoilValue(TasksAtom);
  const [filter, setFilter] = useState('All');
  const setNotifications = useSetRecoilState(NotificationsAtom); // New state for notifications
  const { handleError } = useErrorHandler();
  const getTasks = useGetTasks();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`/auth/user/${userId}`);
        const fetchedUser = response.data.user;
        if (currentUser?.id !== fetchedUser.id) {
          console.log('Unauthorized');
          handleError('unauthorized', 'You are not authorized to access this page.');
          return;
        }
        setCurrentUser(fetchedUser);
      } catch (error) {
        if (error.response?.status === 401) {
          handleError('unauthorized', 'Your session has expired. Login again.');
        } else if (error.response?.status === 404) {
          handleError('404', 'The resource you are looking for could not be found.');
        } else {
          handleError('default', 'An unexpected error occurred.');
        }
        console.log(error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/notification/get-notifications'); // Adjust the URL if necessary
        setNotifications(response.data.notifications);
        console.log(response.data)
      } catch (error) {
        if (error.response?.status === 401) {
          handleError('unauthorized', 'Unable to fetch notifications, please log in again.');
        } else if (error.response?.status === 404) {
          handleError('404', 'No notifications found.');
        } else {
          handleError('default', 'An error occurred while fetching notifications.');
        }
        console.log(error);
      }
    };

    fetchCurrentUser();
    getTasks();
    fetchNotifications(); // Fetch notifications on component mount
  }, []);

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  }

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const refreshTasks = async () => {
    await getTasks();
  };

  return (
    <div className="flex flex-col w-full h-screen bg-white p-10">
      <FilterCreateNav onFilterChange={handleFilterChange} />
      {tasks.length === 0 ? (
        <EmptyTasksPlaceholder />
      ) : (
        <TaskList filter={filter} tasks={tasks} refreshTasks={refreshTasks} />
      )}
    </div>
  );
};

export default Dashboard;
