import { FaPencil } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import ClassCombobox from "./components/ClassCombobox";
import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import {UserAtom} from '../../atoms/UserAtom'

const CreateTaskPage = () => {
  const [next, setNext] = useState(false)
  const navigate = useNavigate()
  const user = useRecoilValue(UserAtom)

  return (
    <div className="flex flex-col p-5 gap-4 md:w-[800px] mx-auto">
      <h1 className="text-[28px] font-medium mt-2">Create Task</h1>
        {!next && <div className="">
          <div className="flex flex-col gap-2">
            <label className="text-md font-medium">Title</label>
            <input type="text" placeholder="Laboratory Exercise #1" className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"/>
          </div>
          <div className="mt-4">
            <h2 className="text-md font-medium">Problem Set</h2>
              <div className="flex flex-col gap-4 mt-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5 mt-2">
                    <label className="text-sm font-medium">Item 1</label>
                    <FaPencil size={15}/>
                  </div>
                  {/* <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium">Points</label>
                    <input type="number" value={10} className="w-[70px] px-2 py-1 rounded-lg border border-gray-300 focus:outline-none"/>
                  </div> */}
                </div>
                {/* <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Description:</label>
                  <textarea 
                    className="h-20 rounded-lg border border-gray-300 focus:outline-none resize-none w-full p-2 text-sm" 
                    placeholder="Enter your text here"
                  />
                </div> */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between pr-2 cursor-pointer">
                    <label className="text-sm font-medium">Answer Key:</label>
                  </div>
                  <input type="text" placeholder="Y1 = X1 ^ X2" className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"/>
                </div>
              </div>
            <div className="flex gap-2 items-center mt-4 cursor-pointer">
              <IoIosAddCircle color="gray" size={20}/>
              <span className="text-gray-500">Add Item</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-md font-medium">Class Group</h2>
            <ClassCombobox/>
            <div className="flex gap-2 items-center mt-1 cursor-pointer">
              <IoIosAddCircle color="gray" size={20}/>
              <span className="text-gray-500">Add Class Group</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-md font-medium">Type of Task</h2>
            <ClassCombobox/>
          </div>
          <div className="flex gap-4 mt-5">
            <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => navigate(`/dashboard/${user.id}`)}>Cancel</button>
            <button className="px-6 py-2 bg-black text-white rounded-lg" onClick={() => setNext(true)}>Next</button>
          </div>
        </div>}

        {next && <div className="flex flex-col gap-5">
          <h2 className="text-md font-medium">Laboratory Exercise Number 1</h2>
          <div>
            <h2 className="text-md font-medium">Class Group</h2>
            <div className="mt-2">
              <div className="flex items-center gap-8">
                <p className="font-light">CpE 2301 Group 1 | MW 1:30 - 2:30 PM</p>
                <div className="flex-1">
                  <ClassCombobox/>
                </div>
                <button className="px-4 py-2 bg-gray-300 rounded-lg">Generate Link</button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-5">
            <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setNext(false)}>Back</button>
            <button className="px-6 py-2 bg-black text-white rounded-lg" onClick={() => navigate(`/dashboard/${user.id}`)}>Create Task</button>
          </div>
        </div>}
    </div>
  )
}

export default CreateTaskPage