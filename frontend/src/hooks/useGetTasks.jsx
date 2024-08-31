import { useCallback } from 'react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { TasksAtom } from '../atoms/TasksAtom'; // Adjust the path as needed

const useGetTasks = () => {
  const setTasks = useSetRecoilState(TasksAtom);

  const getTasks = useCallback(async () => {
    try {
      const response = await axios.get('/task/get-tasks', { withCredentials: true });
      const tasks = response.data;
      console.log(tasks);
      setTasks(tasks); // Update tasks state
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [setTasks]);

  return getTasks;
};

export default useGetTasks;

// const getTasks = useCallback(async () => {
  //   try {
  //     const response = await axios.get('/task/get-tasks', { withCredentials: true })
  //     const tasks = response.data
  //     console.log(tasks)
  //     setTasks(tasks)

  //   } catch (error) {
  //     if (error.response.status === 401) {
  //       setCurrentUser(null)
  //       localStorage.removeItem('user')
  //       handleError('unauthorized', 'Your session has expired. Login again.');
  //   }
  // }
  // }, [handleError, setCurrentUser, setTasks])