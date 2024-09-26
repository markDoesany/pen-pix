import ClassCard from "./components/ClassCard";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ClassPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full py-10 flex flex-col">
      <div>
        <ClassCard />
      </div>
      <button 
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-2 bg-black py-2 px-5 rounded-lg w-[500px] "
        onClick={() => navigate('/create-class')}
      >
        <FaPlus 
          color="white"
          size={20}
          className="cursor-pointer"
        />
        <span className="text-md font-medium text-white">Add Class</span>
      </button>
    </div>
  );
};

export default ClassPage;
