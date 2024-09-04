import { FaArrowLeft, FaArrowRight, FaUserCircle } from "react-icons/fa";
import Combobox from "./Combobox";
import { Link } from "react-router-dom";
import { UserAtom } from "../../../atoms/UserAtom";
import { useRecoilValue } from "recoil";

const Header = () => {
  const currentUser = useRecoilValue(UserAtom)

  return (
    <div className="flex justify-between items-center gap-8 bg-secondaryBg w-full h-[50px] border-b border-borderGray p-10 font-sans text-textGray">
      <div className="Logo cursor-pointer w-[220px]">
        <Link to={`/dashboard/${currentUser.id}`} className="flex gap-2 items-center">
          <span className="font-bold text-2xl ">PenPix |</span>  
          <span className="font-xl">Pencil to Pixel</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-between items-center border-r-2 border-l-2 border-borderGray px-7">
        <div className="task details">
          <h3 className="font-semibold">Task Title</h3>
          <small>Due date: January 20, 2022</small>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center">
            <p>0/1</p>
            <label className="text-sm">Graded</label>
          </div>
          <div className="text-sm">
            <p>1/1</p>
          </div>
        </div>
      </div>

      <div className="pagination flex justify-between gap-5 items-center w-[350px]">
        <FaArrowLeft size={25} className="cursor-pointer"/>
        <div className="flex items-center gap-2 w-full">
          <FaUserCircle size={35}/>
          <Combobox/>
        </div>
        <FaArrowRight size={25} className="cursor-pointer"/>
      </div>
    
    </div>
  )
}

export default Header