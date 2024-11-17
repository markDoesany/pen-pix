import { IoMdAddCircleOutline } from "react-icons/io";
import {useNavigate} from 'react-router-dom'

const AddClass = () => {
  const navigate = useNavigate();
  return (
    <button className="rounded-lg w-[300px] h-[300px] p-5 cursor-pointer flex items-center justify-center bg-white border-2 border-[#ADAAAA] flex-col gap-2" onClick={()=> navigate('/create-class')}>
      <IoMdAddCircleOutline size={120} color="gray"/>
      <p className="font-semibold text-customGray3 text-lg">Add Class</p>
    </button>
  )
}

export default AddClass