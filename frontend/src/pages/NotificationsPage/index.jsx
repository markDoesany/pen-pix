import { IoIosClose } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

const NotificationPage = () => {
  const notifications = [
    { classGroup: "CPE 2301 | MWF", notification: "Justin submitted the file", date: "Sept 25, 2024" },
    { classGroup: "CPE 2302 | TTH", notification: "Anna commented on your post", date: "Sept 24, 2024" },
    { classGroup: "CPE 2303 | SAT", notification: "Group 2 completed the quiz", date: "Sept 23, 2024" },
    { classGroup: "CPE 2303 | SAT", notification: "Group 2 completed the quiz", date: "Sept 23, 2024" },
    { classGroup: "CPE 2303 | SAT", notification: "Group 2 completed the quiz", date: "Sept 23, 2024" },
    { classGroup: "CPE 2303 | SAT", notification: "Group 2 completed the quiz", date: "Sept 23, 2024" },
  ];

  return (
    <div className="relative w-full h-full text-customBlack1 bg-white mt-10 mb-10 rounded-lg px-10 pt-10 pb-4">
      {/* Close Icon */}
      <div className="absolute top-2 right-2 cursor-pointer">
        <IoIosClose size={35} />
      </div>

      {/* Title */}
      <h2 className="text-customGray2 text-3xl font-medium">Notifications</h2>

      {/* Table Headers */}
      <div className="grid grid-cols-5 gap-4 mt-5 font-bold border-b-2 border-customGray1  pb-3">
        <div>Class | Group</div>
        <div className="col-span-3">Notification</div>
        <div>Date</div>
      </div>

      {/* Limit to 6 rows */}
      <div className="h-[300px] overflow-y-auto mt-4 text-customGray2">
        {notifications.map((notification, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 py-3 border-b">
            <div>{notification.classGroup}</div>
            <div className="col-span-3">{notification.notification}</div>
            <div>{notification.date}</div>
          </div>
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
