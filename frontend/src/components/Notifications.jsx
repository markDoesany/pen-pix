import { FaRegBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


const Notifications = ({onClose}) => {
  const navigate = useNavigate()

  return (
    <div className="w-[280px] text-white  bg-black text-sm pb-3 pt-2">
      <div className="text-white flex items-center gap-2 ml-4">
        <FaRegBell color="white"/>
        <span className="font-semibold">Notifications</span>
      </div>
      <div className="w-full max-h-[250px] flex flex-col font-light text-xs  mt-4">
        <Link to={"#"} className="border-b-1 border-customGray1 py-3 px-5">Laborartory Exercise #1 has been locked</Link>
        <Link to={"#"} className="border-b-1 border-customGray1 border py-3 px-5">Laborartory Exercise #1 has been locked</Link>
        <Link to={"#"} className="border-b-1 border-customGray1 border py-3 px-5">Laborartory Exercise #1 has been locked</Link>
        <Link to={"#"} className="p-2 px-5">Laborartory Exercise #1 has been locked</Link>
      </div>
      <p className="underline italic mt-5 mr-5 text-xs text-right font-normal" onClick={() => 
        {
          onClose()
          navigate('/notifications')
        }
        
        }>View all notifications</p>
    </div>
  )
}

export default Notifications