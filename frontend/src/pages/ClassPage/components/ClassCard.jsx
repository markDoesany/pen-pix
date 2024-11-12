import { CiEdit } from "react-icons/ci";

const ClassCard = () => {
  return (
    <div className="shadow-xl rounded-lg w-[300px] max-h-[350px] p-5 cursor-pointer transform hover:scale-105 duration-200 bg-white">
      <div className="flex justify-end cursor-pointer">
        <CiEdit size={25} color="gray"/>
      </div>
      <div>
        <span className="text-sm font-light text-gray-500">MW | 1:30 - 2:30 PM</span>
        <div className="mt-2">
          <h3 className="font-semibold text-3xl inline-block">Group 1</h3>
          <span className="ml-2 text-sm font-medium">CpE 2301</span>
        </div>
      </div>
      <div className="mt-5">
        <h4 className="text-sm font-semibold">Recent Tasks</h4>
        <ul className="text-gray-500 list-disc list-inside pl-5 h-[120px] mt-2 flex flex-col gap-2">
          <li>Laboratory Exercise</li>
          <li>Assignment</li>
          <li>Mideterm</li>
          <li>Prefinal</li>
        </ul>
      </div>
    </div>
  )
}

export default ClassCard