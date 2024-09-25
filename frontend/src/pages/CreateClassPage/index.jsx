import ComboBox from "./components/ClassGroupCombobox"
import StudentList from "./components/StudentList";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil'
import {UserAtom} from '../../atoms/UserAtom'

const CreateClassPage = () => {
  const user = useRecoilValue(UserAtom)
  const navigate = useNavigate()

  const handleCreateClass = async() =>{
    navigate(`/classes/${user.id}`)
  }
  return (
    <div className="flex flex-col p-5 gap-4 md:w-[800px] mx-auto">
      <h1 className="text-[28px] font-medium mt-2">Create Class</h1>
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium">Class Name</label>
        <div className="flex gap-4">
          <input type="text" placeholder="Course Code" className="flex-1 placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"/>
          <div className="w-full flex-1">
            <ComboBox/>
          </div>
        </div>
        <input type="text" placeholder="Class Schedule" className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"/>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium">Student ID Number</label>
        <div className="flex justify-between items-center">
        <input type="text" placeholder="Id Number" className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"/>
          <BsThreeDots/>
        </div>
      </div>
      <button className="px-6 py-2 bg-black text-white rounded-lg">Add Student</button>
      <div>
        <StudentList/>
      </div>
      <div className="flex gap-4 mt-5">
        <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => navigate(`/classes/${user.id}`)}>Cancel</button>
        <button className="px-6 py-2 bg-black text-white rounded-lg" onClick={handleCreateClass}>Create Class</button>
      </div>
    </div>
  )
}

export default CreateClassPage