import { FaTrashAlt } from "react-icons/fa";

const AnswerKeys = ({ onAdd, task, onDeleteExpression }) => {
  const hasAnswerKeys = task?.answer_keys?.length > 0;

  return (
    <div className="bg-secondaryBg text-textGray text-sm rounded-lg w-full max-h-[280px] flex flex-col overflow-hidden">
      <div className="bg-thirdBg flex justify-center items-center relative p-2">
        <h1 className="text-white font-semibold">Answer Keys</h1>
      </div>
      <div className="max-h-[180px] flex flex-col gap-2 pr-5 pl-2 py-4 overflow-y-auto">
        {task?.answer_keys.map((key, index) => {
          const [output, expression] = key.expression.split(/\s*=\s*/);
          return (
            <div key={index} className="flex justify-between items-center gap-3 h-[40px]">
              <span className="border border-borderGray p-2 rounded-md text-center w-10 over">{output}</span>
              <span className="border border-borderGray p-2 rounded-md flex-grow text-center">{expression}</span>
              <FaTrashAlt className="cursor-pointer" size={20} onClick={() => onDeleteExpression(index)} />
            </div>
          );
        })}
      </div>
      <div className={`flex ${hasAnswerKeys ? 'justify-end' : 'justify-center'} px-5`}>
        <button
          className={`bg-primaryColor px-8 py-2 mb-4 font-semibold text-sm rounded-full ${!hasAnswerKeys ? 'w-full' : ''}`}
          onClick={onAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AnswerKeys;
