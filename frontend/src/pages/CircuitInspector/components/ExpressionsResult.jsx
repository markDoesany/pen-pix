import { FaCircle, FaTrashAlt } from "react-icons/fa";

const ExpressionsResult = () => {
  return (
    <div className="bg-secondaryBg text-textGray text-sm rounded-lg w-full h-[200px] flex flex-col items overflow-hidden ">
      <div className="bg-thirdBg flex justify-center items-center relative p-2">
        <FaCircle size={12} color="#FFEA00" className="absolute left-2"/>
        <h1 className="text-white font-semibold">Boolean Result</h1>
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
    </div>
  );
}

export default ExpressionsResult