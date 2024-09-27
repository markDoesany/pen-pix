import Links from "./Links"
import { Link, useNavigate } from "react-router-dom"
import { LuMenu } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { RiNotification2Line } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import useToast from "../hooks/useToast";
import useLogout from "../hooks/useLogoutUser";
import { useState } from "react";
import Notifications from "./Notifications";
import { NotificationsAtom } from "../atoms/Notifications";
import { useRecoilValue } from "recoil";

const Header = () => {
  const notifications = useRecoilValue(NotificationsAtom)
  const [showMenu, setShowMenu] = useState(false);
  const { toastSuccess, toastError } = useToast();
  const { logout } = useLogout();
  const navigate = useNavigate()
  const [ isNotificationOpen, setIsNotificationOpen] = useState(false)

  const handleLogout = async () => {

    try {
      logout();
      toastSuccess('Logout Successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toastError('Logout failed');
    }
  };

  const handleToggleNotification = () =>{
    setIsNotificationOpen(!isNotificationOpen)
  }

  return (
    <div className="flex justify-between items-center h-[50px] border-b-2 px-5 py-7 relative w-full bg-white">
      <div className="flex items-center">
        <Link><img src="/icons/PenPix-txt.png" alt="Logo" /></Link>
      </div>

      <div className="navbar flex items-center max-md:hidden">
        <Links />
      </div>

      <div className="user-menu flex items-center gap-8 font-semibold max-md:hidden ">
        <div className="flex items-center gap-3 cursor-pointer relative h-full w-full">
          <RiNotification2Line size={25}  onClick={handleToggleNotification}/>
          <IoSettingsOutline size={25} onClick={() => navigate('/settings')}/>
          {isNotificationOpen ?
            <div className="absolute w-full h-full z-50 -bottom-11 -left-64">
              <Notifications onClose={() => setIsNotificationOpen(!isNotificationOpen)} notificationsList={notifications}/>
            </div> : ''}
        </div>
        <button className="flex items-center gap-1" onClick={handleLogout}>
          <span className="text-md text-primaryColor">Logout</span>
          <IoLogOut size={35} color="#F26132"/>
        </button>
      </div>

      <div className={`z-10 fixed top-0 right-0 h-full w-1/4 bg-white shadow-lg transition-transform transform md:hidden ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5">
          <div className="hidden max-md:block cursor-pointer mt-3">
            <IoClose size={30} onClick={() => setShowMenu(!showMenu)} />
          </div>
          <div className="mt-10">
            <Links/>
          </div>
          <button className="flex items-center gap-1 mt-10" onClick={handleLogout}>
            <span className="text-md text-primaryColor">Logout</span>
            <IoLogOut size={25} color="#F26132"/>
        </button>
        </div>
      </div>

      <div className="hidden max-md:flex gap-4 cursor-pointer ">
        <div className="flex items-center gap-3 cursor-pointer relative">
          <RiNotification2Line size={25} onClick={handleToggleNotification}/>
          <IoSettingsOutline size={25} onClick={() => navigate('/settings')}/>
          {isNotificationOpen ?
            <div className="absolute w-full h-full z-50 -bottom-11 right-64 max-md:right-56">
              <Notifications onClose={() => setIsNotificationOpen(!isNotificationOpen)} notificationsList={notifications}/>
            </div> : ''}
        </div>
        <LuMenu size={30} onClick={() => setShowMenu(!showMenu)} />
      </div>
      
    </div>
  )
}

export default Header;
