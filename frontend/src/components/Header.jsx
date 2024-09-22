import Links from "./Links"
import { Link } from "react-router-dom"
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import useToast from "../hooks/useToast";
import useLogout from "../hooks/useLogoutUser";
import { useState } from "react";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { toastSuccess, toastError } = useToast();
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      logout();
      toastSuccess('Logout Successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toastError('Logout failed');
    }
  };

  return (
    <div className="flex justify-between items-center h-[50px] border-b-2 px-5 py-7 relative">
      <div className="flex items-center">
        <Link><img src="/icons/PenPix-txt.png" alt="Logo" /></Link>
      </div>

      <div className="navbar flex items-center max-md:hidden">
        <Links />
      </div>

      <div className="user-menu flex items-center gap-5 font-semibold max-md:hidden">
        <img className="cursor-pointer" src="/icons/notification.svg" alt="notification" />
        <button className="bg-black text-white text-sm px-4 py-2 rounded-md" onClick={handleLogout}>Logout</button>
      </div>

      <div className={`z-10 fixed top-0 right-0 h-full w-1/4 bg-white shadow-lg transition-transform transform ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5">
          <div className="hidden max-md:block cursor-pointer mt-3">
            <IoClose size={30} onClick={() => setShowMenu(!showMenu)} />
          </div>
          <div className="mt-10">
            <Links/>
          </div>
          <div className="font-medium mt-10">
            <button className="bg-black text-white text-sm px-2 py-1 rounded-md" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="hidden max-md:flex gap-4 cursor-pointer ">
        <img className="cursor-pointer" src="/icons/notification.svg" alt="notification" />
        <LuMenu size={30} onClick={() => setShowMenu(!showMenu)} />
      </div>
    </div>
  )
}

export default Header;
