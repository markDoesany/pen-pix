import Links from "./Links"
import { Link } from "react-router-dom"
import useToast from "../hooks/useToast";
import useLogout from "../hooks/useLogoutUser";

const Header = () => {
  const { toastSuccess, toastError } = useToast()
  const { logout } = useLogout()

  const handleLogout = async () => {
    try {
      logout()
      toastSuccess('Logout Successfully')
    } catch (error) {
      console.error('Error logging out:', error);
      toastError('Logout failed');
    }
  };

  return (
    <div className="flex justify-between items-center h-[50px] border-b-2 px-5 py-7">
      <div className="flex items-center">
        <Link> <img src="/icons/PenPix-txt.png" alt="Logo" /> </Link>
      </div>

      <div className="navbar flex items-center">
        <Links/>
      </div>

      <div className="user-menu flex items-center gap-5 font-semibold">
        <p>Hello bro!</p>
        <img className="cursor-pointer" src="/icons/notification.svg" alt="notification"/>
        <button className="bg-black text-white text-sm px-4 py-2 rounded-md" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Header