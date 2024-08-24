import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserAtom } from '../../atoms/UserAtom';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import useToast from '../../hooks/useToast';
import useErrorHandler from '../../hooks/useErrorHandler';

const Dashboard = () => {
  const { userId } = useParams(); 
  const [currentUser, setCurrentUser] = useRecoilState(UserAtom);
  const navigate = useNavigate(); 
  const { toastSuccess, toastError } = useToast();
  const { handleError } = useErrorHandler()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`/auth/user/${userId}`);
        const fetchedUser = response.data.user;

        if (currentUser && currentUser.id !== fetchedUser.id) {
          console.log("Unauthorized");
          handleError('unauthorized', "You are not authorized to access this page.")
          return;
        }
        
        setCurrentUser(fetchedUser);
      } catch (error) {
        if (error.response.status === 401) {
          handleError('unauthorized', 'You are not authorized to view this page.');
        } else if (error.response.status === 404) {
          handleError('404', 'The resource you are looking for could not be found.');
        } else {
          handleError('default', 'An unexpected error occurred.');
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.put('/auth/logout');
      toastSuccess(response.data.message);
      localStorage.removeItem("user")
      setCurrentUser(null)
      navigate('/auth'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      toastError('Logout failed');
    }
  };

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  }

  const userName = currentUser.email.split('@')[0];
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-teal-600 mb-4">Hello, {userName}!</h1>
        <p className="text-gray-700 text-lg mb-4">Welcome back! Here is your dashboard.</p>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-gray-800">Your Details</h2>
          <p className="mt-2 text-gray-600">Email: {currentUser.email}</p>
          <p className="mt-2 text-gray-600">User ID: {userId}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
