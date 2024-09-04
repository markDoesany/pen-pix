import { FaCircle, FaTrashAlt } from "react-icons/fa";

const AnswerKeys = () => {
  return (
    <div className="bg-secondaryBg text-textGray text-sm rounded-lg w-full h-[280px] flex flex-col items overflow-hidden ">
      <div className="bg-thirdBg flex justify-center items-center relative p-2">
        <FaCircle size={12} color="#FFEA00" className="absolute left-2"/>
        <h1 className="text-white font-semibold">Answer Keys</h1>
      </div>
      <div className="h-[180px] flex flex-col gap-2 pr-5 pl-2 py-4">
        <div className="flex justify-between items-center gap-3 h-[40px]">
          <span className="border border-borderGray p-2 rounded-md text-center w-10">Y1</span>
          <span className="border border-borderGray p-2 rounded-md flex-grow text-center">X OR Y XOR Z</span>
          <FaTrashAlt className="cursor-pointer" size={20}/>
        </div>
        <div className="flex justify-between items-center gap-3 h-[40px]">
          <span className="border border-borderGray p-2 rounded-md text-center w-10">Y2</span>
          <span className="border border-borderGray p-2 rounded-md flex-grow text-center">X OR Y XOR Z</span>
          <FaTrashAlt className="cursor-pointer" size={20}/>
        </div>
      </div>
      <div className="flex justify-end px-5">
        <button className="bg-primaryColor px-8 py-2 font-semibold text-sm rounded-full">Add</button>
      </div>
    </div>
  );
  
}

export default AnswerKeys