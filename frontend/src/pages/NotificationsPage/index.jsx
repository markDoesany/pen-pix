import { IoIosClose } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRecoilState } from 'recoil';
import { NotificationsAtom } from "../../atoms/Notifications";
import { useEffect } from "react";
import axios from "axios";
import useErrorHandler from '../../hooks/useErrorHandler';
import { formatDueDateTime } from "../../utils/helpers";
import { Link, useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const [notifications, setNotifications] = useRecoilState(NotificationsAtom);
  const { handleError } = useErrorHandler();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/notification/get-notifications'); // Adjust the URL if necessary
        const fetchedNotifications = response.data.notifications;

        const sortedNotifications = fetchedNotifications.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at); // Latest first
        });

        setNotifications(sortedNotifications);
        console.log(response.data);
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

    fetchNotifications();
  }, []);

  return (
    <div className="relative w-full h-full text-customBlack1 bg-white mt-10 mb-10 rounded-lg px-10 pt-10 pb-4">
      <div className="absolute top-2 right-2 cursor-pointer">
        <IoIosClose size={35} onClick={() => navigate(`/auth`)}/>
      </div>

      <h2 className="text-customGray2 text-3xl font-medium">Notifications</h2>

      <div className="grid grid-cols-5 gap-4 mt-5 font-bold border-b-2 border-customGray1 pb-3">
        <div>Class | Group</div>
        <div className="col-span-3">Notification</div>
        <div>Date</div>
      </div>

      <div className="h-[300px] overflow-y-auto mt-4 text-customGray2">
        {notifications?.map((notification, index) => (
          <Link to={`/task/${notification.task_id}`} key={index} className="grid grid-cols-5 gap-4 py-3 border-b">
            <div>{notification.task_id}</div>
            <div className="col-span-3">{notification.message}</div>
            <div>{formatDueDateTime(notification.created_at)}</div>
          </Link>
        ))}
      </div>
      <div className="flex gap-5 justify-center items-center mt-3">
        <FaArrowLeft className="cursor-pointer"/>
        <p>Page 1 of 1</p>
        <FaArrowRight className="cursor-pointer"/>
      </div>
    </div>
  );
};

export default NotificationPage;
